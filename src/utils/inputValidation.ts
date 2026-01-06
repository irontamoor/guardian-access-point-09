import { z } from 'zod';

// Common validation patterns
const namePattern = /^[a-zA-Z\s'-]+$/;
const phonePattern = /^[\d\s+()-]*$/;
const alphanumericPattern = /^[a-zA-Z0-9\s'-]*$/;

// Sanitize string input - remove control characters
export function sanitizeString(input: string): string {
  if (!input) return '';
  // Remove control characters except newlines and tabs
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

// Validate and sanitize name fields
export function validateName(name: string, maxLength = 100): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(name);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Name is required' };
  }
  
  if (sanitized.length > maxLength) {
    return { valid: false, sanitized, error: `Name must be ${maxLength} characters or less` };
  }
  
  if (!namePattern.test(sanitized)) {
    return { valid: false, sanitized, error: 'Name contains invalid characters' };
  }
  
  return { valid: true, sanitized };
}

// Validate phone number
export function validatePhone(phone: string | undefined | null): { valid: boolean; sanitized: string; error?: string } {
  if (!phone) {
    return { valid: true, sanitized: '' };
  }
  
  const sanitized = sanitizeString(phone);
  
  if (sanitized.length > 20) {
    return { valid: false, sanitized, error: 'Phone number is too long' };
  }
  
  if (!phonePattern.test(sanitized)) {
    return { valid: false, sanitized, error: 'Phone number contains invalid characters' };
  }
  
  return { valid: true, sanitized };
}

// Validate email
export function validateEmail(email: string | undefined | null): { valid: boolean; sanitized: string; error?: string } {
  if (!email) {
    return { valid: true, sanitized: '' };
  }
  
  const sanitized = sanitizeString(email);
  
  if (sanitized.length > 255) {
    return { valid: false, sanitized, error: 'Email is too long' };
  }
  
  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(sanitized);
  
  if (!result.success) {
    return { valid: false, sanitized, error: 'Invalid email format' };
  }
  
  return { valid: true, sanitized };
}

// Validate notes/text content
export function validateNotes(notes: string | undefined | null, maxLength = 500): { valid: boolean; sanitized: string; error?: string } {
  if (!notes) {
    return { valid: true, sanitized: '' };
  }
  
  const sanitized = sanitizeString(notes);
  
  if (sanitized.length > maxLength) {
    return { valid: false, sanitized, error: `Notes must be ${maxLength} characters or less` };
  }
  
  return { valid: true, sanitized };
}

// Validate ID codes (student ID, employee ID, etc.)
export function validateCode(code: string, maxLength = 50): { valid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeString(code);
  
  if (!sanitized || sanitized.length === 0) {
    return { valid: false, sanitized: '', error: 'Code is required' };
  }
  
  if (sanitized.length > maxLength) {
    return { valid: false, sanitized, error: `Code must be ${maxLength} characters or less` };
  }
  
  if (!alphanumericPattern.test(sanitized)) {
    return { valid: false, sanitized, error: 'Code contains invalid characters' };
  }
  
  return { valid: true, sanitized };
}

// Zod schemas for comprehensive validation
export const visitorSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).regex(namePattern, 'Invalid characters in name'),
  lastName: z.string().min(1, 'Last name is required').max(100).regex(namePattern, 'Invalid characters in name'),
  phoneNumber: z.string().max(20).regex(phonePattern, 'Invalid phone format').optional().or(z.literal('')),
  organization: z.string().max(100).optional().or(z.literal('')),
  visitPurpose: z.string().min(1, 'Purpose is required').max(200),
  hostName: z.string().min(1, 'Host name is required').max(100),
  notes: z.string().max(500).optional().or(z.literal('')),
  carRegistration: z.string().max(20).optional().or(z.literal('')),
});

export const studentAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required').max(50).regex(alphanumericPattern),
  studentName: z.string().min(1, 'Student name is required').max(200),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const staffAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required').max(50).regex(alphanumericPattern),
  employeeName: z.string().min(1, 'Employee name is required').max(200),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export const parentPickupSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required').max(50),
  parentGuardianName: z.string().min(1, 'Parent/Guardian name is required').max(100).regex(namePattern),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type VisitorInput = z.infer<typeof visitorSchema>;
export type StudentAttendanceInput = z.infer<typeof studentAttendanceSchema>;
export type StaffAttendanceInput = z.infer<typeof staffAttendanceSchema>;
export type ParentPickupInput = z.infer<typeof parentPickupSchema>;
