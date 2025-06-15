
import { useSignInOptions } from "@/hooks/useSignInOptions";
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
    addOption: addStudentOption,
    deactivateOption: deactivateStudentOption,
  } = useSignInOptions("student", "sign_in");

  // Staff sign-in reasons/comments
  const {
    options: staffSignInOptions,
    loading: staffLoading,
    addOption: addStaffOption,
    deactivateOption: deactivateStaffOption,
  } = useSignInOptions("staff", "sign_in");

  // Pickup types for parent pickup
  const {
    options: pickupTypeOptions,
    loading: pickupLoading,
    addOption: addPickupTypeOption,
    deactivateOption: deactivatePickupTypeOption,
  } = useSignInOptions("both", "pickup_type");

  // Visit types for visitors
  const {
    options: visitTypeOptions,
    loading: visitLoading,
    addOption: addVisitTypeOption,
    deactivateOption: deactivateVisitTypeOption,
  } = useSignInOptions("both", "visit_type");

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
              addOption={addStudentOption}
              deactivateOption={deactivateStudentOption}
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
              addOption={addStaffOption}
              deactivateOption={deactivateStaffOption}
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
              addOption={addPickupTypeOption}
              deactivateOption={deactivatePickupTypeOption}
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
              addOption={addVisitTypeOption}
              deactivateOption={deactivateVisitTypeOption}
              defaultAppliesTo="both"
              showAppliesTo={true}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
