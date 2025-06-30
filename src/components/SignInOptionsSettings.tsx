
import { useSignInOptionsJson } from "@/hooks/useSignInOptionsJson";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionCategoryManager } from "./OptionCategoryManager";

// Add new: Accept adminData as a prop for access control
type SignInOptionsSettingsProps = {
  adminData: { role: string; [key: string]: any };
};

export default function SignInOptionsSettings({ adminData }: SignInOptionsSettingsProps) {
  // Student sign-in reasons/comments
  const {
    options: studentSignInOptions,
    loading: studentLoading,
  } = useSignInOptionsJson("student", "sign_in");

  // Staff sign-in reasons/comments
  const {
    options: staffSignInOptions,
    loading: staffLoading,
  } = useSignInOptionsJson("staff", "sign_in");

  // Pickup types for parent pickup
  const {
    options: pickupTypeOptions,
    loading: pickupLoading,
  } = useSignInOptionsJson("both", "pickup_type");

  // Visit types for visitors
  const {
    options: visitTypeOptions,
    loading: visitLoading,
  } = useSignInOptionsJson("both", "visit_type");

  // Placeholder functions for add/deactivate - these would need to be implemented
  // to modify the JSON files (not implemented in this example)
  const addOption = async (label: string, appliesTo: string, category: string) => {
    console.log('Add option not implemented for JSON-based system:', { label, appliesTo, category });
    return { message: 'Add option not implemented for JSON-based system' };
  };

  const deactivateOption = async (id: string) => {
    console.log('Deactivate option not implemented for JSON-based system:', id);
    return { message: 'Deactivate option not implemented for JSON-based system' };
  };

  // Only show to admins
  if (adminData.role !== "admin") {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Option Management (Admins Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Only admins can manage global options. If you believe this is a mistake, contact an administrator.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Option Management</CardTitle>
        <p className="text-sm text-gray-600">
          Note: Options are now managed via JSON files. Add/remove functionality is not available in this interface.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="student_sign_in" className="w-full">
          <TabsList>
            <TabsTrigger value="student_sign_in">Student Sign-In Options</TabsTrigger>
            <TabsTrigger value="staff_sign_in">Staff Sign-In Options</TabsTrigger>
            <TabsTrigger value="pickup_type">Pickup/Drop-off Types</TabsTrigger>
            <TabsTrigger value="visit_type">Visitor Visit Types</TabsTrigger>
          </TabsList>
          <TabsContent value="student_sign_in">
            <OptionCategoryManager
              title="Student Sign-In/Out Comments"
              placeholder="e.g. Late, Excused, Early Leave"
              category="sign_in"
              appliesTo="student"
              options={studentSignInOptions}
              loading={studentLoading}
              addOption={addOption}
              deactivateOption={deactivateOption}
              defaultAppliesTo="student"
              showAppliesTo={false}
            />
          </TabsContent>
          <TabsContent value="staff_sign_in">
            <OptionCategoryManager
              title="Staff Sign-In/Out Comments"
              placeholder="e.g. Offsite, Sick, In-Person"
              category="sign_in"
              appliesTo="staff"
              options={staffSignInOptions}
              loading={staffLoading}
              addOption={addOption}
              deactivateOption={deactivateOption}
              defaultAppliesTo="staff"
              showAppliesTo={false}
            />
          </TabsContent>
          <TabsContent value="pickup_type">
            <OptionCategoryManager
              title="Pickup/Drop-off Types"
              placeholder="e.g. Early, Medical, Bus"
              category="pickup_type"
              appliesTo="both"
              options={pickupTypeOptions}
              loading={pickupLoading}
              addOption={addOption}
              deactivateOption={deactivateOption}
              defaultAppliesTo="both"
              showAppliesTo={true}
            />
          </TabsContent>
          <TabsContent value="visit_type">
            <OptionCategoryManager
              title="Visitor Visit Types"
              placeholder="e.g. Meeting, Interview, Delivery"
              category="visit_type"
              appliesTo="both"
              options={visitTypeOptions}
              loading={visitLoading}
              addOption={addOption}
              deactivateOption={deactivateOption}
              defaultAppliesTo="both"
              showAppliesTo={true}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
