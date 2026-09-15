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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount: number
          booking_date: string
          booking_time: string
          created_at: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          location: string
          paid_at: string | null
          payment_environment: string
          payment_status: string
          payment_transaction_id: string | null
          platform_fee: number
          reference: string
          service_name: string
          status: string
          user_id: string
          vendor_earnings: number
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          booking_date: string
          booking_time: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          guests?: number
          id?: string
          location?: string
          paid_at?: string | null
          payment_environment?: string
          payment_status?: string
          payment_transaction_id?: string | null
          platform_fee?: number
          reference?: string
          service_name: string
          status?: string
          user_id: string
          vendor_earnings?: number
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_name?: string
          customer_phone?: string
          guests?: number
          id?: string
          location?: string
          paid_at?: string | null
          payment_environment?: string
          payment_status?: string
          payment_transaction_id?: string | null
          platform_fee?: number
          reference?: string
          service_name?: string
          status?: string
          user_id?: string
          vendor_earnings?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          active: boolean
          category: string
          city: string
          created_at: string
          id: string
          label: string
          name: string
          phone: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          category?: string
          city?: string
          created_at?: string
          id?: string
          label: string
          name?: string
          phone: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          category?: string
          city?: string
          created_at?: string
          id?: string
          label?: string
          name?: string
          phone?: string
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      service_offerings: {
        Row: {
          active: boolean
          category: string
          city: string
          created_at: string
          description: string
          id: string
          price_from: number
          sort_order: number
          title: string
        }
        Insert: {
          active?: boolean
          category?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          price_from?: number
          sort_order?: number
          title: string
        }
        Update: {
          active?: boolean
          category?: string
          city?: string
          created_at?: string
          description?: string
          id?: string
          price_from?: number
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          label?: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          area: string
          category: string
          city: string
          created_at: string
          description: string
          distance_km: number
          hours: string
          id: string
          image_key: string
          lat: number
          lng: number
          name: string
          open_now: boolean
          owner_email: string
          owner_id: string | null
          owner_name: string
          phone: string
          photo_urls: string[]
          price_from: number
          price_range: string
          rating: number
          registration_id: string
          reviews_count: number
          status: string
          verification_notes: string
          verified: boolean
          video_url: string
        }
        Insert: {
          area?: string
          category: string
          city: string
          created_at?: string
          description?: string
          distance_km?: number
          hours?: string
          id?: string
          image_key?: string
          lat: number
          lng: number
          name: string
          open_now?: boolean
          owner_email?: string
          owner_id?: string | null
          owner_name?: string
          phone?: string
          photo_urls?: string[]
          price_from?: number
          price_range?: string
          rating?: number
          registration_id?: string
          reviews_count?: number
          status?: string
          verification_notes?: string
          verified?: boolean
          video_url?: string
        }
        Update: {
          area?: string
          category?: string
          city?: string
          created_at?: string
          description?: string
          distance_km?: number
          hours?: string
          id?: string
          image_key?: string
          lat?: number
          lng?: number
          name?: string
          open_now?: boolean
          owner_email?: string
          owner_id?: string | null
          owner_name?: string
          phone?: string
          photo_urls?: string[]
          price_from?: number
          price_range?: string
          rating?: number
          registration_id?: string
          reviews_count?: number
          status?: string
          verification_notes?: string
          verified?: boolean
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_own_booking: {
        Args: { p_booking_id: string }
        Returns: {
          amount: number
          booking_date: string
          booking_time: string
          created_at: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          location: string
          paid_at: string | null
          payment_environment: string
          payment_status: string
          payment_transaction_id: string | null
          platform_fee: number
          reference: string
          service_name: string
          status: string
          user_id: string
          vendor_earnings: number
          vendor_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_pending_booking: {
        Args: {
          p_booking_date: string
          p_booking_time: string
          p_customer_name: string
          p_customer_phone: string
          p_guests: number
          p_payment_environment?: string
          p_vendor_id: string
        }
        Returns: {
          amount: number
          booking_date: string
          booking_time: string
          created_at: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          location: string
          paid_at: string | null
          payment_environment: string
          payment_status: string
          payment_transaction_id: string | null
          platform_fee: number
          reference: string
          service_name: string
          status: string
          user_id: string
          vendor_earnings: number
          vendor_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "vendor" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "vendor", "user"],
    },
  },
} as const
