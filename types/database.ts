export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'moderator' | 'contributor' | 'user'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type BarrierCategory =
  | 'broken_footpath'
  | 'missing_ramp'
  | 'blocked_sidewalk'
  | 'broken_elevator'
  | 'unsafe_crossing'
export type BarrierStatus = 'pending' | 'verified' | 'rejected' | 'resolved'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          role: UserRole
          avatar_url: string | null
          trust_score: number
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          role?: UserRole
          avatar_url?: string | null
          trust_score?: number
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          role?: UserRole
          avatar_url?: string | null
          trust_score?: number
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string
          created_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string
          coordinates: unknown
          category_id: string | null
          accessibility_score: number
          verification_status: VerificationStatus
          created_by: string | null
          verified_by: string | null
          created_at: string
          updated_at: string
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address: string
          coordinates: unknown
          category_id?: string | null
          accessibility_score?: number
          verification_status?: VerificationStatus
          created_by?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string
          coordinates?: unknown
          category_id?: string | null
          accessibility_score?: number
          verification_status?: VerificationStatus
          created_by?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
          search_vector?: unknown | null
        }
      }
      accessibility_features: {
        Row: {
          location_id: string
          wheelchair_access: boolean
          ramp_available: boolean
          elevator_available: boolean
          accessible_restroom: boolean
          accessible_parking: boolean
          stair_free_entry: boolean
          door_accessible: boolean
          verified: boolean
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          location_id: string
          wheelchair_access?: boolean
          ramp_available?: boolean
          elevator_available?: boolean
          accessible_restroom?: boolean
          accessible_parking?: boolean
          stair_free_entry?: boolean
          door_accessible?: boolean
          verified?: boolean
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          location_id?: string
          wheelchair_access?: boolean
          ramp_available?: boolean
          elevator_available?: boolean
          accessible_restroom?: boolean
          accessible_parking?: boolean
          stair_free_entry?: boolean
          door_accessible?: boolean
          verified?: boolean
          updated_by?: string | null
          updated_at?: string
        }
      }
      location_photos: {
        Row: {
          id: string
          location_id: string
          url: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          location_id: string
          url: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          url?: string
          uploaded_by?: string | null
          created_at?: string
        }
      }
      barrier_reports: {
        Row: {
          id: string
          category: BarrierCategory
          description: string
          image_url: string | null
          coordinates: unknown
          status: BarrierStatus
          reporter_id: string | null
          reviewed_by: string | null
          review_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: BarrierCategory
          description: string
          image_url?: string | null
          coordinates: unknown
          status?: BarrierStatus
          reporter_id?: string | null
          reviewed_by?: string | null
          review_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: BarrierCategory
          description?: string
          image_url?: string | null
          coordinates?: unknown
          status?: BarrierStatus
          reporter_id?: string | null
          reviewed_by?: string | null
          review_note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          location_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          location_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          location_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          location_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          location_id?: string
          created_at?: string
        }
      }
      contribution_history: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          status?: string
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      search_locations: {
        Args: {
          query?: string | null
          user_lat?: number | null
          user_lng?: number | null
          radius_m?: number | null
          category_ids?: string[] | null
          features?: Json | null
          min_score?: number | null
          sort_by?: string | null
          page_num?: number | null
          page_size?: number | null
        }
        Returns: {
          id: string
          name: string
          description: string | null
          address: string
          latitude: number
          longitude: number
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          accessibility_score: number
          verification_status: VerificationStatus
          distance_m: number | null
          total_count: number
          wheelchair_access: boolean
          ramp_available: boolean
          elevator_available: boolean
          accessible_restroom: boolean
          accessible_parking: boolean
          stair_free_entry: boolean
          door_accessible: boolean
        }[]
      }
      locations_in_bbox: {
        Args: {
          min_lng: number
          min_lat: number
          max_lng: number
          max_lat: number
          zoom_level?: number
        }
        Returns: Json
      }
      barriers_near_line: {
        Args: {
          route_geojson: Json
          buffer_meters?: number
        }
        Returns: {
          id: string
          category: BarrierCategory
          description: string
          image_url: string | null
          status: BarrierStatus
          distance_to_route: number
          latitude: number
          longitude: number
        }[]
      }
      get_analytics_summary: {
        Args: Record<string, never>
        Returns: Json
      }
      get_category_distribution: {
        Args: Record<string, never>
        Returns: {
          category_id: string
          name: string
          slug: string
          icon: string
          location_count: number
        }[]
      }
      get_monthly_trends: {
        Args: Record<string, never>
        Returns: {
          month: string
          locations_added: number
          barriers_reported: number
        }[]
      }
      get_barrier_hotspots: {
        Args: {
          limit_num?: number
        }
        Returns: {
          grid_lat: number
          grid_lng: number
          barrier_count: number
          primary_category: BarrierCategory
        }[]
      }
    }
  }
}
