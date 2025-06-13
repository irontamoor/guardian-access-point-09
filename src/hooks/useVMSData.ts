
import { useState, useEffect } from 'react';

// Types for our data structures
export interface Student {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export interface Staff {
  id: string;
  name: string;
  department: string;
  status: 'present' | 'absent';
  check_in_time?: string;
  check_out_time?: string;
}

export interface Visitor {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  host_name: string;
  purpose: string;
  badge_id: string;
  status: 'active' | 'checked_out';
  check_in_time: string;
  check_out_time?: string;
}

export interface ParentPickup {
  id: string;
  parent_name: string;
  student_name: string;
  student_id: string;
  car_registration: string;
  pickup_type: 'pickup' | 'dropoff';
  status: 'pending' | 'completed' | 'cancelled';
  request_time: string;
  completion_time?: string;
}

export interface ActivityRecord {
  id: string;
  type: 'student' | 'staff' | 'visitor' | 'parent';
  name: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

// Mock data - in real implementation, this would connect to Supabase
const mockStudents: Student[] = [
  { id: 'STU001', name: 'Emma Johnson', grade: 'Grade 5', status: 'present', check_in_time: '8:15 AM' },
  { id: 'STU002', name: 'Michael Chen', grade: 'Grade 7', status: 'present', check_in_time: '8:22 AM' },
  { id: 'STU003', name: 'Sofia Rodriguez', grade: 'Grade 3', status: 'present', check_in_time: '8:45 AM' },
];

const mockStaff: Staff[] = [
  { id: 'EMP001', name: 'Sarah Miller', department: 'Elementary', status: 'present', check_in_time: '7:45 AM' },
  { id: 'EMP002', name: 'David Thompson', department: 'Administration', status: 'present', check_in_time: '8:00 AM' },
  { id: 'EMP003', name: 'Lisa Garcia', department: 'Middle School', status: 'present', check_in_time: '7:55 AM' },
];

const mockVisitors: Visitor[] = [
  { 
    id: 'VIS001', 
    name: 'John Anderson', 
    company: 'ABC Corp', 
    phone: '555-0123',
    host_name: 'Dr. Smith',
    purpose: 'Meeting',
    badge_id: 'VIS1234',
    status: 'active',
    check_in_time: '10:30 AM'
  },
  {
    id: 'VIS002',
    name: 'Mary Johnson',
    company: 'Tech Solutions',
    phone: '555-0124',
    host_name: 'Ms. Brown',
    purpose: 'Interview',
    badge_id: 'VIS1235',
    status: 'active',
    check_in_time: '11:15 AM'
  }
];

const mockPickups: ParentPickup[] = [
  {
    id: 'PU001',
    parent_name: 'Jennifer Wilson',
    student_name: 'Tommy Wilson',
    student_id: 'STU123',
    car_registration: 'ABC-123',
    pickup_type: 'pickup',
    status: 'pending',
    request_time: '3:20 PM'
  },
  {
    id: 'PU002',
    parent_name: 'Robert Chen',
    student_name: 'Michael Chen',
    student_id: 'STU002',
    car_registration: 'XYZ-789',
    pickup_type: 'pickup',
    status: 'pending',
    request_time: '3:25 PM'
  }
];

export const useVMSData = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [visitors, setVisitors] = useState<Visitor[]>(mockVisitors);
  const [pickups, setPickups] = useState<ParentPickup[]>(mockPickups);
  const [recentActivity, setRecentActivity] = useState<ActivityRecord[]>([]);

  // Generate recent activity from all data
  useEffect(() => {
    const activity: ActivityRecord[] = [
      ...students.filter(s => s.status === 'present').map(s => ({
        id: s.id + '_activity',
        type: 'student' as const,
        name: s.name,
        action: 'Signed In',
        time: s.check_in_time || '',
        status: 'success' as const
      })),
      ...staff.filter(s => s.status === 'present').map(s => ({
        id: s.id + '_activity',
        type: 'staff' as const,
        name: s.name,
        action: 'Signed In',
        time: s.check_in_time || '',
        status: 'success' as const
      })),
      ...visitors.filter(v => v.status === 'active').map(v => ({
        id: v.id + '_activity',
        type: 'visitor' as const,
        name: v.name,
        action: 'Registered',
        time: v.check_in_time,
        status: 'info' as const
      })),
      ...pickups.filter(p => p.status === 'pending').map(p => ({
        id: p.id + '_activity',
        type: 'parent' as const,
        name: p.parent_name,
        action: 'Pickup Request',
        time: p.request_time,
        status: 'warning' as const
      }))
    ].slice(0, 10); // Show only latest 10 activities

    setRecentActivity(activity);
  }, [students, staff, visitors, pickups]);

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: 'STU' + Date.now()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: 'EMP' + Date.now()
    };
    setStaff(prev => [...prev, newStaff]);
  };

  const addVisitor = (visitorData: Omit<Visitor, 'id' | 'badge_id'>) => {
    const newVisitor: Visitor = {
      ...visitorData,
      id: 'VIS' + Date.now(),
      badge_id: 'VIS' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    };
    setVisitors(prev => [...prev, newVisitor]);
  };

  const addPickup = (pickupData: Omit<ParentPickup, 'id'>) => {
    const newPickup: ParentPickup = {
      ...pickupData,
      id: 'PU' + Date.now()
    };
    setPickups(prev => [...prev, newPickup]);
  };

  const updateStudentStatus = (id: string, status: 'present' | 'absent', time?: string) => {
    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { 
            ...student, 
            status, 
            [status === 'present' ? 'check_in_time' : 'check_out_time']: time 
          }
        : student
    ));
  };

  const updateStaffStatus = (id: string, status: 'present' | 'absent', time?: string) => {
    setStaff(prev => prev.map(staffMember => 
      staffMember.id === id 
        ? { 
            ...staffMember, 
            status, 
            [status === 'present' ? 'check_in_time' : 'check_out_time']: time 
          }
        : staffMember
    ));
  };

  const updatePickupStatus = (id: string, status: ParentPickup['status'], completionTime?: string) => {
    setPickups(prev => prev.map(pickup => 
      pickup.id === id 
        ? { ...pickup, status, completion_time: completionTime }
        : pickup
    ));
  };

  return {
    students,
    staff,
    visitors,
    pickups,
    recentActivity,
    addStudent,
    addStaff,
    addVisitor,
    addPickup,
    updateStudentStatus,
    updateStaffStatus,
    updatePickupStatus
  };
};
