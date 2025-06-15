
import { useState, useEffect } from 'react';

type AppliesTo = "both" | "student" | "staff";
type Category = "sign_in" | "pickup_type" | "visit_type";

interface Option {
  id: string;
  label: string;
  applies_to: AppliesTo;
  is_active: boolean;
  category: Category;
}

export function useSignInOptions(appliesTo: AppliesTo, category: Category) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock options for now - in a real app, these would come from the database
  const defaultOptions: Record<string, Option[]> = {
    'student_sign_in': [
      { id: "1", label: "Late", applies_to: "student", is_active: true, category: "sign_in" },
      { id: "2", label: "Medical Appointment", applies_to: "student", is_active: true, category: "sign_in" },
      { id: "3", label: "Bus Delay", applies_to: "student", is_active: true, category: "sign_in" },
      { id: "4", label: "Personal Reason", applies_to: "student", is_active: true, category: "sign_in" },
      { id: "5", label: "Other", applies_to: "student", is_active: true, category: "sign_in" }
    ],
    'staff_sign_in': [
      { id: "6", label: "Late", applies_to: "staff", is_active: true, category: "sign_in" },
      { id: "7", label: "Medical Appointment", applies_to: "staff", is_active: true, category: "sign_in" },
      { id: "8", label: "Personal Day", applies_to: "staff", is_active: true, category: "sign_in" },
      { id: "9", label: "Meeting", applies_to: "staff", is_active: true, category: "sign_in" },
      { id: "10", label: "Sick", applies_to: "staff", is_active: true, category: "sign_in" },
      { id: "11", label: "Other", applies_to: "staff", is_active: true, category: "sign_in" }
    ],
    'both_pickup_type': [
      { id: "12", label: "Regular Pickup", applies_to: "both", is_active: true, category: "pickup_type" },
      { id: "13", label: "Early Dismissal", applies_to: "both", is_active: true, category: "pickup_type" },
      { id: "14", label: "Medical Appointment", applies_to: "both", is_active: true, category: "pickup_type" },
      { id: "15", label: "Emergency Pickup", applies_to: "both", is_active: true, category: "pickup_type" },
      { id: "16", label: "Other", applies_to: "both", is_active: true, category: "pickup_type" }
    ],
    'both_visit_type': [
      { id: "17", label: "Meeting", applies_to: "both", is_active: true, category: "visit_type" },
      { id: "18", label: "Interview", applies_to: "both", is_active: true, category: "visit_type" },
      { id: "19", label: "Delivery", applies_to: "both", is_active: true, category: "visit_type" },
      { id: "20", label: "Other", applies_to: "both", is_active: true, category: "visit_type" }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const key = `${appliesTo}_${category}`;
      setOptions(defaultOptions[key] || []);
      setLoading(false);
    }, 100);
  }, [appliesTo, category]);

  const addOption = async (label: string, applies: AppliesTo, cat: Category) => {
    try {
      const newOption: Option = {
        id: Date.now().toString(),
        label,
        applies_to: applies,
        is_active: true,
        category: cat
      };
      setOptions(prev => [...prev, newOption]);
      return null; // No error
    } catch (error) {
      return error;
    }
  };

  const deactivateOption = async (id: string) => {
    try {
      setOptions(prev => prev.filter(opt => opt.id !== id));
      return null; // No error
    } catch (error) {
      return error;
    }
  };

  return { options, loading, addOption, deactivateOption };
}
