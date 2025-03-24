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
      ai_models: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          last_trained: string
          name: string
          parameters: Json | null
          type: string
          version: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          last_trained?: string
          name: string
          parameters?: Json | null
          type: string
          version: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          last_trained?: string
          name?: string
          parameters?: Json | null
          type?: string
          version?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          applied_by: string | null
          confidence: number | null
          created_at: string
          description: string
          id: string
          potential_savings: string | null
          priority: string
          site_id: string | null
          title: string
          type: string
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number | null
          created_at?: string
          description: string
          id?: string
          potential_savings?: string | null
          priority: string
          site_id?: string | null
          title: string
          type: string
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number | null
          created_at?: string
          description?: string
          id?: string
          potential_savings?: string | null
          priority?: string
          site_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          device_id: string
          id: string
          message: string
          resolved_at: string | null
          severity: string | null
          source: string | null
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
          severity?: string | null
          source?: string | null
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
          severity?: string | null
          source?: string | null
          timestamp?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          allowed_ips: string[] | null
          api_key: string
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          last_used: string | null
          permissions: Json | null
          service: string
          usage_count: number | null
        }
        Insert: {
          allowed_ips?: string[] | null
          api_key: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used?: string | null
          permissions?: Json | null
          service: string
          usage_count?: number | null
        }
        Update: {
          allowed_ips?: string[] | null
          api_key?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used?: string | null
          permissions?: Json | null
          service?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          affected_data: Json | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          affected_data?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          status: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          affected_data?: Json | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      authentication_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_name: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      backup_configurations: {
        Row: {
          backup_type: string
          created_at: string
          id: string
          include_data: string[]
          last_backup: string | null
          name: string
          retention_period: number
          schedule: string
          status: string
          storage_location: string
          updated_at: string
        }
        Insert: {
          backup_type: string
          created_at?: string
          id?: string
          include_data?: string[]
          last_backup?: string | null
          name: string
          retention_period: number
          schedule: string
          status?: string
          storage_location: string
          updated_at?: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          id?: string
          include_data?: string[]
          last_backup?: string | null
          name?: string
          retention_period?: number
          schedule?: string
          status?: string
          storage_location?: string
          updated_at?: string
        }
        Relationships: []
      }
      backup_logs: {
        Row: {
          backup_id: string | null
          completed_at: string | null
          file_location: string | null
          id: string
          log_details: string | null
          size_bytes: number | null
          started_at: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          backup_id?: string | null
          completed_at?: string | null
          file_location?: string | null
          id?: string
          log_details?: string | null
          size_bytes?: number | null
          started_at?: string
          status: string
          triggered_by?: string | null
        }
        Update: {
          backup_id?: string | null
          completed_at?: string | null
          file_location?: string | null
          id?: string
          log_details?: string | null
          size_bytes?: number | null
          started_at?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backup_logs_backup_id_fkey"
            columns: ["backup_id"]
            isOneToOne: false
            referencedRelation: "backup_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      billing: {
        Row: {
          billing_period: string | null
          cost_per_kwh: number | null
          created_at: string | null
          id: string
          paid: boolean | null
          site_id: string | null
          total_cost: number | null
          total_energy: number | null
        }
        Insert: {
          billing_period?: string | null
          cost_per_kwh?: number | null
          created_at?: string | null
          id?: string
          paid?: boolean | null
          site_id?: string | null
          total_cost?: number | null
          total_energy?: number | null
        }
        Update: {
          billing_period?: string | null
          cost_per_kwh?: number | null
          created_at?: string | null
          id?: string
          paid?: boolean | null
          site_id?: string | null
          total_cost?: number | null
          total_energy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      bms_data: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          system_name: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          system_name?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          system_name?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      device_data: {
        Row: {
          current: number | null
          device_id: string | null
          id: number
          power_kw: number | null
          soc_percent: number | null
          temperature: number | null
          timestamp: string
          voltage: number | null
        }
        Insert: {
          current?: number | null
          device_id?: string | null
          id?: number
          power_kw?: number | null
          soc_percent?: number | null
          temperature?: number | null
          timestamp: string
          voltage?: number | null
        }
        Update: {
          current?: number | null
          device_id?: string | null
          id?: number
          power_kw?: number | null
          soc_percent?: number | null
          temperature?: number | null
          timestamp?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "device_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_models: {
        Row: {
          capacity: number | null
          category: string
          certifications: string[] | null
          compatible_with: string[] | null
          connectivity: Json | null
          created_at: string | null
          datasheets: Json | null
          description: string | null
          device_type: string
          dimensions: string | null
          firmware_version: string | null
          id: string
          images: Json | null
          manuals: Json | null
          manufacturer: string
          model_number: string
          name: string
          power_rating: number | null
          protocol: string | null
          release_date: string | null
          specifications: Json | null
          support_level: string
          updated_at: string | null
          videos: Json | null
          warranty: string | null
          weight: number | null
        }
        Insert: {
          capacity?: number | null
          category: string
          certifications?: string[] | null
          compatible_with?: string[] | null
          connectivity?: Json | null
          created_at?: string | null
          datasheets?: Json | null
          description?: string | null
          device_type: string
          dimensions?: string | null
          firmware_version?: string | null
          id?: string
          images?: Json | null
          manuals?: Json | null
          manufacturer: string
          model_number: string
          name: string
          power_rating?: number | null
          protocol?: string | null
          release_date?: string | null
          specifications?: Json | null
          support_level?: string
          updated_at?: string | null
          videos?: Json | null
          warranty?: string | null
          weight?: number | null
        }
        Update: {
          capacity?: number | null
          category?: string
          certifications?: string[] | null
          compatible_with?: string[] | null
          connectivity?: Json | null
          created_at?: string | null
          datasheets?: Json | null
          description?: string | null
          device_type?: string
          dimensions?: string | null
          firmware_version?: string | null
          id?: string
          images?: Json | null
          manuals?: Json | null
          manufacturer?: string
          model_number?: string
          name?: string
          power_rating?: number | null
          protocol?: string | null
          release_date?: string | null
          specifications?: Json | null
          support_level?: string
          updated_at?: string | null
          videos?: Json | null
          warranty?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          capacity: number
          config: Json | null
          connection_info: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          enabled: boolean | null
          firmware: string | null
          firmware_version: string | null
          id: string
          installation_date: string | null
          ip_address: string | null
          last_seen: string | null
          last_updated: string
          lat: number | null
          lng: number | null
          location: string | null
          metrics: Json | null
          modbus_config: Json | null
          name: string
          protocol: string | null
          site_id: string | null
          status: Database["public"]["Enums"]["device_status"]
          tags: Json | null
          type: Database["public"]["Enums"]["device_type"]
        }
        Insert: {
          capacity: number
          config?: Json | null
          connection_info?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          firmware?: string | null
          firmware_version?: string | null
          id?: string
          installation_date?: string | null
          ip_address?: string | null
          last_seen?: string | null
          last_updated?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          modbus_config?: Json | null
          name: string
          protocol?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"]
          tags?: Json | null
          type: Database["public"]["Enums"]["device_type"]
        }
        Update: {
          capacity?: number
          config?: Json | null
          connection_info?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          firmware?: string | null
          firmware_version?: string | null
          id?: string
          installation_date?: string | null
          ip_address?: string | null
          last_seen?: string | null
          last_updated?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          modbus_config?: Json | null
          name?: string
          protocol?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"]
          tags?: Json | null
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
      encryption_keys: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          expiry_date: string | null
          id: string
          key_name: string
          key_status: string
          key_type: string
          last_rotated: string | null
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          key_name: string
          key_status?: string
          key_type: string
          last_rotated?: string | null
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          key_name?: string
          key_status?: string
          key_type?: string
          last_rotated?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      energy_baselines: {
        Row: {
          baseline_value: number
          category: string
          created_at: string | null
          id: string
          site_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          baseline_value: number
          category: string
          created_at?: string | null
          id?: string
          site_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          baseline_value?: number
          category?: string
          created_at?: string | null
          id?: string
          site_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_baselines_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_forecasts: {
        Row: {
          cloud_cover: number | null
          confidence: number | null
          consumption_forecast: number
          created_at: string
          forecast_time: string
          generation_forecast: number
          id: string
          site_id: string
          source: string
          temperature: number | null
          timestamp: string
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          cloud_cover?: number | null
          confidence?: number | null
          consumption_forecast?: number
          created_at?: string
          forecast_time: string
          generation_forecast?: number
          id?: string
          site_id: string
          source?: string
          temperature?: number | null
          timestamp?: string
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          cloud_cover?: number | null
          confidence?: number | null
          consumption_forecast?: number
          created_at?: string
          forecast_time?: string
          generation_forecast?: number
          id?: string
          site_id?: string
          source?: string
          temperature?: number | null
          timestamp?: string
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_forecasts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_predictions: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          model_version: string | null
          predicted_consumption: number | null
          predicted_generation: number | null
          prediction_time: string
          site_id: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          predicted_consumption?: number | null
          predicted_generation?: number | null
          prediction_time: string
          site_id?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          model_version?: string | null
          predicted_consumption?: number | null
          predicted_generation?: number | null
          prediction_time?: string
          site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_predictions_site_id_fkey"
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
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "energy_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_readings_daily: {
        Row: {
          created_at: string | null
          date: string
          device_id: string
          granularity: string | null
          total_energy: number
        }
        Insert: {
          created_at?: string | null
          date: string
          device_id: string
          granularity?: string | null
          total_energy: number
        }
        Update: {
          created_at?: string | null
          date?: string
          device_id?: string
          granularity?: string | null
          total_energy?: number
        }
        Relationships: [
          {
            foreignKeyName: "energy_readings_daily_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "energy_readings_daily_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string | null
          id: string
          manufacturer: string | null
          model: string | null
          name: string
          space_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          name: string
          space_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manufacturer?: string | null
          model?: string | null
          name?: string
          space_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      faults: {
        Row: {
          created_at: string | null
          description: string | null
          device_id: string | null
          id: string
          resolved_at: string | null
          severity: string | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          device_id?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          device_id?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faults_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faults_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      fdd_alarms: {
        Row: {
          device_id: string | null
          id: string
          resolved: boolean | null
          resolved_at: string | null
          rule_id: string | null
          triggered_at: string | null
        }
        Insert: {
          device_id?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          rule_id?: string | null
          triggered_at?: string | null
        }
        Update: {
          device_id?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          rule_id?: string | null
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fdd_alarms_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fdd_alarms_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fdd_alarms_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "fdd_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      fdd_rules: {
        Row: {
          alert_source: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          operator: string
          parameter: string
          severity: string | null
          threshold: number
        }
        Insert: {
          alert_source?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          operator: string
          parameter: string
          severity?: string | null
          threshold: number
        }
        Update: {
          alert_source?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          operator?: string
          parameter?: string
          severity?: string | null
          threshold?: number
        }
        Relationships: []
      }
      historical_data: {
        Row: {
          current: number | null
          energy_kwh: number | null
          id: string
          power_kw: number | null
          site_id: string | null
          timestamp: string | null
          voltage: number | null
        }
        Insert: {
          current?: number | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          site_id?: string | null
          timestamp?: string | null
          voltage?: number | null
        }
        Update: {
          current?: number | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          site_id?: string | null
          timestamp?: string | null
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "historical_data_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
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
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      meters: {
        Row: {
          created_at: string | null
          equipment_id: string | null
          id: string
          meter_type: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          meter_type?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          meter_type?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "meters_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      modbus_cleaned: {
        Row: {
          created_at: string | null
          current: number | null
          device_id: string | null
          energy_kwh: number | null
          id: string
          power_kw: number | null
          timestamp: string | null
          voltage: number | null
        }
        Insert: {
          created_at?: string | null
          current?: number | null
          device_id?: string | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp?: string | null
          voltage?: number | null
        }
        Update: {
          created_at?: string | null
          current?: number | null
          device_id?: string | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp?: string | null
          voltage?: number | null
        }
        Relationships: []
      }
      modbus_devices: {
        Row: {
          id: string
          inserted_at: string | null
          ip: string
          is_active: boolean
          name: string | null
          port: number
          unit_id: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          inserted_at?: string | null
          ip: string
          is_active?: boolean
          name?: string | null
          port?: number
          unit_id?: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          inserted_at?: string | null
          ip?: string
          is_active?: boolean
          name?: string | null
          port?: number
          unit_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      modbus_normalized: {
        Row: {
          created_at: string
          current: number
          device_id: string
          energy_kwh: number
          id: string
          power_kw: number
          timestamp: string
          voltage: number
        }
        Insert: {
          created_at?: string
          current: number
          device_id: string
          energy_kwh: number
          id?: string
          power_kw: number
          timestamp?: string
          voltage: number
        }
        Update: {
          created_at?: string
          current?: number
          device_id?: string
          energy_kwh?: number
          id?: string
          power_kw?: number
          timestamp?: string
          voltage?: number
        }
        Relationships: []
      }
      modbus_raw: {
        Row: {
          created_at: string | null
          current: number | null
          device_id: string | null
          energy_kwh: number | null
          id: string
          power_kw: number | null
          timestamp: string | null
          voltage: number | null
        }
        Insert: {
          created_at?: string | null
          current?: number | null
          device_id?: string | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp?: string | null
          voltage?: number | null
        }
        Update: {
          created_at?: string | null
          current?: number | null
          device_id?: string | null
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp?: string | null
          voltage?: number | null
        }
        Relationships: []
      }
      modbus_readings: {
        Row: {
          created_at: string | null
          current: number | null
          device_id: string
          energy_kwh: number | null
          id: string
          power_kw: number | null
          timestamp: string
          voltage: number | null
        }
        Insert: {
          created_at?: string | null
          current?: number | null
          device_id: string
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp: string
          voltage?: number | null
        }
        Update: {
          created_at?: string | null
          current?: number | null
          device_id?: string
          energy_kwh?: number | null
          id?: string
          power_kw?: number | null
          timestamp?: string
          voltage?: number | null
        }
        Relationships: []
      }
      optimization_results: {
        Row: {
          cost_estimate: number | null
          id: number
          schedule_json: Json | null
          source_data_hash: string | null
          timestamp_end: string | null
          timestamp_start: string | null
          user_id: string | null
        }
        Insert: {
          cost_estimate?: number | null
          id?: number
          schedule_json?: Json | null
          source_data_hash?: string | null
          timestamp_end?: string | null
          timestamp_start?: string | null
          user_id?: string | null
        }
        Update: {
          cost_estimate?: number | null
          id?: number
          schedule_json?: Json | null
          source_data_hash?: string | null
          timestamp_end?: string | null
          timestamp_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "optimization_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          conditions: Json | null
          created_at: string
          description: string | null
          id: string
          permission_name: string
          resource_type: string
        }
        Insert: {
          action: string
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          permission_name: string
          resource_type: string
        }
        Update: {
          action?: string
          conditions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          permission_name?: string
          resource_type?: string
        }
        Relationships: []
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
          role_created_at: string | null
          role_description: string | null
          role_permissions: Json | null
          role_updated_at: string | null
          role_updated_by: string | null
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
          role_created_at?: string | null
          role_description?: string | null
          role_permissions?: Json | null
          role_updated_at?: string | null
          role_updated_by?: string | null
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
          role_created_at?: string | null
          role_description?: string | null
          role_permissions?: Json | null
          role_updated_at?: string | null
          role_updated_by?: string | null
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
      role_permissions: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          permission_id: string
          role: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission_id: string
          role: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
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
      spaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spaces_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tariffs: {
        Row: {
          id: number
          price_eur_kwh: number
          source: string | null
          timestamp: string
          type: string | null
        }
        Insert: {
          id?: number
          price_eur_kwh: number
          source?: string | null
          timestamp: string
          type?: string | null
        }
        Update: {
          id?: number
          price_eur_kwh?: number
          source?: string | null
          timestamp?: string
          type?: string | null
        }
        Relationships: []
      }
      telemetry_log: {
        Row: {
          created_at: string | null
          device_id: string | null
          id: string
          message: Json
          received_at: string | null
          severity: string | null
          source: string | null
          topic: string
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          message: Json
          received_at?: string | null
          severity?: string | null
          source?: string | null
          topic: string
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          id?: string
          message?: Json
          received_at?: string | null
          severity?: string | null
          source?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "telemetry_log_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          contact_email: string | null
          created_at: string | null
          id: string
          name: string
          space_id: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          id?: string
          name: string
          space_id?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          id?: string
          name?: string
          space_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          account_status: string
          created_at: string
          failed_login_attempts: number | null
          id: string
          last_password_change: string | null
          locked_until: string | null
          must_change_password: boolean | null
          password_expiry: string | null
          recovery_email: string | null
          security_questions: Json | null
          updated_at: string
        }
        Insert: {
          account_status?: string
          created_at?: string
          failed_login_attempts?: number | null
          id: string
          last_password_change?: string | null
          locked_until?: string | null
          must_change_password?: boolean | null
          password_expiry?: string | null
          recovery_email?: string | null
          security_questions?: Json | null
          updated_at?: string
        }
        Update: {
          account_status?: string
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          last_password_change?: string | null
          locked_until?: string | null
          must_change_password?: boolean | null
          password_expiry?: string | null
          recovery_email?: string | null
          security_questions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_alert_preferences: {
        Row: {
          created_at: string | null
          id: string
          muted_severities: string[] | null
          muted_sources: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          muted_severities?: string[] | null
          muted_sources?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          muted_severities?: string[] | null
          muted_sources?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_alert_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          max_soc: number | null
          min_soc: number | null
          priority_device_ids: string[] | null
          time_window_end: string | null
          time_window_start: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          max_soc?: number | null
          min_soc?: number | null
          priority_device_ids?: string[] | null
          time_window_end?: string | null
          time_window_start?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          max_soc?: number | null
          min_soc?: number | null
          priority_device_ids?: string[] | null
          time_window_end?: string | null
          time_window_start?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
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
      device_view: {
        Row: {
          capacity: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          firmware: string | null
          id: string | null
          installation_date: string | null
          last_updated: string | null
          lat: number | null
          lng: number | null
          location: string | null
          metrics: Json | null
          name: string | null
          site_id: string | null
          status: Database["public"]["Enums"]["device_status"] | null
          type: Database["public"]["Enums"]["device_type"] | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          firmware?: string | null
          id?: string | null
          installation_date?: string | null
          last_updated?: string | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          name?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"] | null
          type?: Database["public"]["Enums"]["device_type"] | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          firmware?: string | null
          id?: string | null
          installation_date?: string | null
          last_updated?: string | null
          lat?: number | null
          lng?: number | null
          location?: string | null
          metrics?: Json | null
          name?: string | null
          site_id?: string | null
          status?: Database["public"]["Enums"]["device_status"] | null
          type?: Database["public"]["Enums"]["device_type"] | null
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
    }
    Functions: {
      evaluate_fdd_expression: {
        Args: {
          expression: string
          device_id: string
        }
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_default_site_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role:
        | {
            Args: Record<PropertyKey, never>
            Returns: string
          }
        | {
            Args: {
              user_id: string
            }
            Returns: string
          }
      rpc_evaluate_fdd_rules: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      ai_recommendation_priority: "low" | "medium" | "high"
      ai_recommendation_type:
        | "optimization"
        | "system"
        | "behavioral"
        | "maintenance"
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
