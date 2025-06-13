
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, UserPlus, Shield, Printer, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    visitType: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setVisitorData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterVisitor = () => {
    if (!visitorData.name || !visitorData.phone || !visitorData.hostName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const badgeId = 'VIS' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    toast({
      title: "Visitor Registered!",
      description: `Badge ID: ${badgeId} - Please proceed to print visitor badge`,
      variant: "default"
    });
    
    // Reset form
    setVisitorData({
      name: '',
      company: '',
      phone: '',
      email: '',
      hostName: '',
      purpose: '',
      visitType: ''
    });
  };

  const handleCheckOut = () => {
    toast({
      title: "Thank you for visiting!",
      description: "Visitor checked out successfully",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
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

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleRegisterVisitor}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register & Print Badge
              </Button>
              <Button 
                onClick={handleCheckOut}
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
                  <div className="text-xs text-gray-500">Badge: VIS####</div>
                  <div className="text-xs text-gray-500">Host: {visitorData.hostName || 'Host Name'}</div>
                </div>
              </div>
            </div>
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
