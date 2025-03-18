export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          device_id: string
          id: string
          message: string
          resolved_at: string | null
          timestamp: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          device_id: string
          id?: string
          message: string
          resolved_at?: string | null
          timestamp?: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          device_id?: string
          id?: string
          message?: string
          resolved_at?: string | null
          timestamp?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          capacity: number
          created_at: string
          created_by: string | null
          firmware: string | null
          id: string
          installation_date: string | null
          last_updated: string
          lat: number | null
          lng: number | null
          location: string | null
          metrics: Json | null
          name: string
          site_id: string | null
          status: Database["public"]["Enums"]["device_status"]
          type: Database["public"]["Enums"]["device_type"]
        }
        Insert: {
          capacity: number
          created_at?: string
          created_by?: string | null
          firmware?: string | null
          id?: string
          installation_date?: string | null
          last_updated?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          name: string
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"]
          type: Database["public"]["Enums"]["device_type"]
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string | null
          firmware?: string | null
          id?: string
          installation_date?: string | null
          last_updated?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          name?: string
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"]
          type?: Database["public"]["Enums"]["device_type"]
        }
        Relationships: [
          {
            foreignKeyName: "devices_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_readings: {
        Row: {
          created_at: string
          current: number | null
          device_id: string
          energy: number
          frequency: number | null
          id: string
          power: number
          state_of_charge: number | null
          temperature: number | null
          timestamp: string
          voltage: number | null
        }
        Insert: {
          created_at?: string
          current?: number | null
          device_id: string
          energy: number
          frequency?: number | null
          id?: string
          power: number
          state_of_charge?: number | null
          temperature?: number | null
          timestamp?: string
          voltage?: number | null
        }
        Update: {
          created_at?: string
          current?: number | null
          device_id?: string
          energy?: number
          frequency?: number | null
          id?: string
          power?: number
          state_of_charge?: number | null
          temperature?: number | null
          timestamp?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          completed_date: string | null
          created_at: string
          created_by: string | null
          description: string | null
          device_id: string
          id: string
          maintenance_type: string
          notes: string | null
          performed_by: string | null
          scheduled_date: string | null
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          device_id: string
          id?: string
          maintenance_type: string
          notes?: string | null
          performed_by?: string | null
          scheduled_date?: string | null
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          device_id?: string
          id?: string
          maintenance_type?: string
          notes?: string | null
          performed_by?: string | null
          scheduled_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          dashboard_layout: Json | null
          email: string
          email_notifications: boolean | null
          first_name: string | null
          id: string
          last_login: string | null
          last_name: string | null
          push_notifications: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          sms_notifications: boolean | null
          theme_preference: Database["public"]["Enums"]["theme_preference"]
        }
        Insert: {
          created_at?: string
          dashboard_layout?: Json | null
          email: string
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          last_login?: string | null
          last_name?: string | null
          push_notifications?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean | null
          theme_preference?: Database["public"]["Enums"]["theme_preference"]
        }
        Update: {
          created_at?: string
          dashboard_layout?: Json | null
          email?: string
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          last_login?: string | null
          last_name?: string | null
          push_notifications?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          sms_notifications?: boolean | null
          theme_preference?: Database["public"]["Enums"]["theme_preference"]
        }
        Relationships: []
      }
      report_results: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          report_id: string
          result_data: Json
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          report_id: string
          result_data: Json
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          report_id?: string
          result_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "report_results_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_template: boolean
          last_run_at: string | null
          parameters: Json | null
          schedule: string | null
          site_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_template?: boolean
          last_run_at?: string | null
          parameters?: Json | null
          schedule?: string | null
          site_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_template?: boolean
          last_run_at?: string | null
          parameters?: Json | null
          schedule?: string | null
          site_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          location: string
          name: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          location: string
          name: string
          timezone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string
          name?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_site_access: {
        Row: {
          created_at: string
          id: string
          site_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          site_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          site_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_site_access_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          cloud_cover: number | null
          forecast: boolean
          humidity: number | null
          id: string
          precipitation: number | null
          site_id: string
          source: string | null
          temperature: number | null
          timestamp: string
          wind_direction: number | null
          wind_speed: number | null
        }
        Insert: {
          cloud_cover?: number | null
          forecast?: boolean
          humidity?: number | null
          id?: string
          precipitation?: number | null
          site_id: string
          source?: string | null
          temperature?: number | null
          timestamp: string
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Update: {
          cloud_cover?: number | null
          forecast?: boolean
          humidity?: number | null
          id?: string
          precipitation?: number | null
          site_id?: string
          source?: string | null
          temperature?: number | null
          timestamp?: string
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_default_site_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      alert_type: "warning" | "critical" | "info"
      device_status: "online" | "offline" | "maintenance" | "error"
      device_type: "solar" | "wind" | "battery" | "grid" | "load" | "ev_charger"
      theme_preference: "light" | "dark" | "system"
      user_role: "admin" | "operator" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
