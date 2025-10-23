export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      parent_pickup_records: {
        Row: {
          action_time: string
          action_type: string
          approved: boolean
          created_at: string
          id: string
          notes: string | null
          parent_guardian_name: string
          photo_url: string | null
          pickup_type: string | null
          relationship: string
          student_id: string
          student_name: string | null
          updated_at: string
        }
        Insert: {
          action_time?: string
          action_type: string
          approved?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          parent_guardian_name: string
          photo_url?: string | null
          pickup_type?: string | null
          relationship: string
          student_id: string
          student_name?: string | null
          updated_at?: string
        }
        Update: {
          action_time?: string
          action_type?: string
          approved?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          parent_guardian_name?: string
          photo_url?: string | null
          pickup_type?: string | null
          relationship?: string
          student_id?: string
          student_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string
          first_name: string
          id: string
          last_name: string
          position: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id: string
          first_name: string
          id?: string
          last_name: string
          position?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string
          first_name?: string
          id?: string
          last_name?: string
          position?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_attendance: {
        Row: {
          check_in_photo_url: string | null
          check_in_time: string | null
          check_out_photo_url: string | null
          check_out_time: string | null
          created_at: string
          employee_id: string
          employee_name: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          check_in_photo_url?: string | null
          check_in_time?: string | null
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          employee_id: string
          employee_name: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          check_in_photo_url?: string | null
          check_in_time?: string | null
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          employee_id?: string
          employee_name?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: []
      }
      student_attendance: {
        Row: {
          check_in_photo_url: string | null
          check_in_time: string | null
          check_out_photo_url: string | null
          check_out_time: string | null
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          student_name: string
          updated_at: string
        }
        Insert: {
          check_in_photo_url?: string | null
          check_in_time?: string | null
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          student_name: string
          updated_at?: string
        }
        Update: {
          check_in_photo_url?: string | null
          check_in_time?: string | null
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          first_name: string
          grade: string | null
          id: string
          last_name: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          grade?: string | null
          id?: string
          last_name: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          grade?: string | null
          id?: string
          last_name?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_users: {
        Row: {
          admin_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          password: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_code: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_code?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          password?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_code?: string | null
        }
        Relationships: []
      }
      visitor_records: {
        Row: {
          check_in_photo_url: string | null
          check_in_time: string
          check_out_photo_url: string | null
          check_out_time: string | null
          created_at: string
          first_name: string
          host_name: string | null
          id: string
          last_name: string
          notes: string | null
          organization: string | null
          phone_number: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
          visit_purpose: string
        }
        Insert: {
          check_in_photo_url?: string | null
          check_in_time?: string
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          first_name: string
          host_name?: string | null
          id?: string
          last_name: string
          notes?: string | null
          organization?: string | null
          phone_number?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          visit_purpose: string
        }
        Update: {
          check_in_photo_url?: string | null
          check_in_time?: string
          check_out_photo_url?: string | null
          check_out_time?: string | null
          created_at?: string
          first_name?: string
          host_name?: string | null
          id?: string
          last_name?: string
          notes?: string | null
          organization?: string | null
          phone_number?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          visit_purpose?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_safe_user_data: {
        Args: { p_admin_id: string; p_role?: string }
        Returns: {
          admin_id: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_code: string
        }[]
      }
      get_visitor_records: {
        Args: { p_admin_id: string; p_date?: string }
        Returns: {
          check_in_time: string
          check_out_time: string
          created_at: string
          first_name: string
          host_name: string
          id: string
          last_name: string
          notes: string
          organization: string
          phone_number: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
          visit_purpose: string
        }[]
      }
      verify_admin_credentials: {
        Args: { p_admin_id: string; p_password: string }
        Returns: {
          admin_id: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          user_code: string
        }[]
      }
    }
    Enums: {
      attendance_status: "in" | "out"
      user_role:
        | "admin"
        | "staff"
        | "student"
        | "parent"
        | "visitor"
        | "reader"
        | "staff_admin"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["in", "out"],
      user_role: [
        "admin",
        "staff",
        "student",
        "parent",
        "visitor",
        "reader",
        "staff_admin",
      ],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
