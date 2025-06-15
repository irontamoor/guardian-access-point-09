
import { useState, useEffect } from 'react';

interface SignInOption {
  id: string;
  label: string;
  category: string;
}

export function useSignInOptions(type: "student" | "staff") {
  const [options, setOptions] = useState<SignInOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock options for now - in a real app, these would come from the database
  const defaultOptions: Record<string, SignInOption[]> = {
    student: [
      { id: "1", label: "Late", category: "attendance" },
      { id: "2", label: "Medical Appointment", category: "medical" },
      { id: "3", label: "Bus Delay", category: "transport" },
      { id: "4", label: "Personal Reason", category: "personal" },
      { id: "5", label: "Other", category: "other" }
    ],
    staff: [
      { id: "1", label: "Late", category: "attendance" },
      { id: "2", label: "Medical Appointment", category: "medical" },
      { id: "3", label: "Personal Day", category: "personal" },
      { id: "4", label: "Meeting", category: "work" },
      { id: "5", label: "Sick", category: "medical" },
      { id: "6", label: "Other", category: "other" }
    ]
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOptions(defaultOptions[type] || []);
      setLoading(false);
    }, 100);
  }, [type]);

  return { options, loading };
}
