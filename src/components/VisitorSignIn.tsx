import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UserPlus, Shield, Printer, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

// Import UUID generator, fallback to a quick function if missing
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface VisitorSignInProps {
  onBack: () => void;
}

const VisitorSignIn = ({ onBack }: VisitorSignInProps) => {
  const [visitorData, setVisitorData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    hostName: '',
    purpose: '',
    visitType: '',
    badgeNumber: '', // <-- New field for sign out
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [badgeId, setBadgeId] = useState<string | null>(null); // To display the badge number after registration
  const [showBadgeFlash, setShowBadgeFlash] = useState(false); // To show badge flash overlay

  // Helper: Find existing visitor by phone or email
  const findOrCreateVisitor = async () => {
    let visitor = null;
    if (visitorData.phone || visitorData.email) {
      let query = supabase.from("system_users").select("*").eq("role", "visitor");
      if (visitorData.email) {
        query = query.ilike("email", visitorData.email);
      } else {
        query = query.eq("phone", visitorData.phone);
      }
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== "PGRST116") throw error;
      if (data) visitor = data;
    }
    // Create new if not found
    if (!visitor) {
      const [first = "", ...last] = visitorData.name.split(" ");
      const newVisitorId = uuidv4();
      const { data, error } = await supabase.from("system_users").insert({
        id: newVisitorId,
        first_name: first || visitorData.name,
        last_name: last.join(" ") || ".",
        phone: visitorData.phone || null,
        email: visitorData.email || null,
        role: "visitor",
        status: "active"
      }).select().single();
      if (error) throw error;
      visitor = data;
    }
    return visitor;
  };

  // Visitor attendance record
  const createVisitorAttendance = async (visitor_id: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase.from("attendance_records").insert({
      user_id: visitor_id,
      status: "in",
      check_in_time: now,
      company: visitorData.company || null,
      host_name: visitorData.hostName || null,
      purpose: visitorData.purpose || null
    });
    if (error) throw error;
  };

  // Sign out: mark latest "in" attendance as out 
  const visitorCheckOut = async (visitor_id: string) => {
    const { data: recs, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", visitor_id)
      .eq("status", "in")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) throw error;
    const latestIn = recs && recs.length ? recs[0] : null;
    if (latestIn) {
      const now = new Date().toISOString();
      const { error: updError } = await supabase
        .from("attendance_records")
        .update({
          status: "out",
          check_out_time: now
        })
        .eq("id", latestIn.id);
      if (updError) throw updError;
    } else {
      // Record a check out with no preceding check in
      const now = new Date().toISOString();
      const { error: insertError } = await supabase.from("attendance_records").insert({
        user_id: visitor_id,
        status: "out",
        check_out_time: now,
        company: null,
        host_name: null,
        purpose: "Checked out without prior check-in"
      });
      if (insertError) throw insertError;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterVisitor = async () => {
    setLoading(true);
    try {
      if (!visitorData.name || !visitorData.phone || !visitorData.hostName) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Create/find visitor user in system_users
      const visitor = await findOrCreateVisitor();

      // Add their attendance event (with company, host, purpose)
      await createVisitorAttendance(visitor.id);

      // Simulate Badge ID
      const generatedBadgeId = 'VIS' + (visitor.id.substring(0, 4).toUpperCase());
      setBadgeId(generatedBadgeId);
      setShowBadgeFlash(true); // trigger badge flash overlay

      toast({
        title: "Visitor Registered!",
        description: `Badge: ${generatedBadgeId} - Please proceed to print visitor badge`,
        variant: "default"
      });

      // Reset form fields (except badge id)
      setVisitorData({
        name: '',
        company: '',
        phone: '',
        email: '',
        hostName: '',
        purpose: '',
        visitType: '',
        badgeNumber: '',
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      // Must have badge number, phone or email to identify visitor
      if (!visitorData.badgeNumber && !visitorData.phone && !visitorData.email) {
        toast({
          title: "Error",
          description: "Please enter the visitor's Badge number, phone or email to check out.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      let visitor = null;
      if (visitorData.badgeNumber) {
        // Try to find via badge number: badge is VISxxxx where xxxx is first 4 of id (uppercase)
        const badgePattern = visitorData.badgeNumber.replace(/vis/gi, "VIS");
        const { data: foundList, error } = await supabase
          .from("system_users")
          .select("*")
          .eq("role", "visitor");
        if (error) throw error;
        const match = (foundList || []).find(v => ("VIS" + v.id.substring(0, 4).toUpperCase()) === badgePattern);
        if (match) visitor = match;
      }
      // If not found by badge, try by email or phone
      if (!visitor && (visitorData.phone || visitorData.email)) {
        let query = supabase.from("system_users").select("*").eq("role", "visitor");
        if (visitorData.email) {
          query = query.ilike("email", visitorData.email);
        } else {
          query = query.eq("phone", visitorData.phone);
        }
        const { data, error } = await query.maybeSingle();
        if (!error && data) visitor = data;
      }

      if (!visitor) {
        toast({
          title: "Not found",
          description: "No visitor found with provided badge/phone/email for check out.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Update their latest attendance as signed out, or add an out record if none
      await visitorCheckOut(visitor.id);

      toast({
        title: "Thank you for visiting!",
        description: "Visitor checked out successfully",
        variant: "default"
      });

      setVisitorData({
        name: '',
        company: '',
        phone: '',
        email: '',
        hostName: '',
        purpose: '',
        visitType: '',
        badgeNumber: '',
      });
      setBadgeId(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Overlay flash badge component
  const BadgeFlashModal = () => {
    if (!badgeId || !showBadgeFlash) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all animate-fade-in">
        <div className="bg-white rounded-lg px-8 py-8 max-w-sm shadow-xl border-2 border-purple-200 flex flex-col items-center space-y-4 animate-scale-in">
          <div className="text-xl font-bold text-purple-700 mb-2">Visitor Badge Number</div>
          <div className="p-4 rounded-md bg-purple-50 border border-purple-200 text-3xl font-mono font-semibold text-black animate-pulse select-all">
            {badgeId}
          </div>
          <div className="text-gray-600 text-sm text-center">
            <p>Write this number down to check out when you leave.</p>
            <p className="text-gray-400">Tap Dismiss when done.</p>
          </div>
          <button
            onClick={() => setShowBadgeFlash(false)}
            className="w-full mt-2 py-2 rounded bg-purple-700 hover:bg-purple-800 text-white font-semibold text-lg transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <BadgeFlashModal />
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-purple-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
        </div>
        <p className="text-gray-600">Secure visitor registration and badge printing system</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <Card className="lg:col-span-2 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              <span>Visitor Registration</span>
            </CardTitle>
            <CardDescription>Please provide the following information for security purposes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter visitor's full name"
                  value={visitorData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  value={visitorData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={visitorData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={visitorData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Host/Contact Person *</Label>
                <Input
                  id="hostName"
                  placeholder="Who are you visiting?"
                  value={visitorData.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitType">Visit Type</Label>
                <Select value={visitorData.visitType} onValueChange={(value) => handleInputChange('visitType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="event">School Event</SelectItem>
                    <SelectItem value="volunteer">Volunteer Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Textarea
                id="purpose"
                placeholder="Please describe the purpose of your visit"
                value={visitorData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Badge Number (for Check Out)</Label>
              <Input
                id="badgeNumber"
                placeholder="Enter Badge Number for Check Out (e.g. VISABCD)"
                value={visitorData.badgeNumber}
                onChange={(e) => handleInputChange('badgeNumber', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                If you are checking out, you may enter only your Badge number (no need for name, phone, etc)
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleRegisterVisitor}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register & Print Badge
              </Button>
              <Button 
                onClick={handleCheckOut}
                disabled={loading}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Check Out Visitor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Badge Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Printer className="h-5 w-5 text-purple-600" />
              <span>Visitor Badge</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg p-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-semibold text-purple-600 mb-2">VISITOR</div>
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{visitorData.name || 'Visitor Name'}</div>
                  <div className="text-gray-600">{visitorData.company || 'Company'}</div>
                  <div className="text-xs text-gray-500">
                    Badge: {badgeId ? badgeId : 'VIS####'}
                  </div>
                  <div className="text-xs text-gray-500">Host: {visitorData.hostName || 'Host Name'}</div>
                </div>
              </div>
            </div>
            {badgeId && (
              <div className="w-full mt-2">
                <div className="p-3 text-center rounded-md bg-green-50 border border-green-200 text-green-600 font-semibold text-lg shadow-sm">
                  Your Badge Number: <span className="font-mono text-black">{badgeId}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">Please use this Badge Number to check out when leaving.</div>
              </div>
            )}
            <Button className="w-full mt-4" variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Badge
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorSignIn;
