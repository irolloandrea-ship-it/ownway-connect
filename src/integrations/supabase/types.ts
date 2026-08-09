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
      city_feed_posts: {
        Row: {
          category: string
          city: string
          contributor_id: string | null
          contributor_type: string | null
          country: string | null
          created_at: string
          description: string | null
          event_date: string | null
          expiration_date: string | null
          id: string
          source: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          city: string
          contributor_id?: string | null
          contributor_type?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          expiration_date?: string | null
          id?: string
          source?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          contributor_id?: string | null
          contributor_type?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          expiration_date?: string | null
          id?: string
          source?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      early_access_signups: {
        Row: {
          base_position: number | null
          confirm_token_expires_at: string | null
          confirm_token_hash: string | null
          confirm_token_used_at: string | null
          consent_marketing: boolean
          consent_marketing_at: string | null
          consent_policy_version: string | null
          consent_source: string | null
          consent_to_updates: boolean
          created_at: string
          destination: string | null
          email: string
          email_normalized: string | null
          email_verified_at: string | null
          id: string
          membership_provenance:
            | Database["public"]["Enums"]["membership_provenance"]
            | null
          priority_score: number | null
          referral_code: string
          referral_count: number
          referred_by: string | null
          role: string
          source: string | null
          updated_at: string
        }
        Insert: {
          base_position?: number | null
          confirm_token_expires_at?: string | null
          confirm_token_hash?: string | null
          confirm_token_used_at?: string | null
          consent_marketing?: boolean
          consent_marketing_at?: string | null
          consent_policy_version?: string | null
          consent_source?: string | null
          consent_to_updates?: boolean
          created_at?: string
          destination?: string | null
          email: string
          email_normalized?: string | null
          email_verified_at?: string | null
          id?: string
          membership_provenance?:
            | Database["public"]["Enums"]["membership_provenance"]
            | null
          priority_score?: number | null
          referral_code: string
          referral_count?: number
          referred_by?: string | null
          role?: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          base_position?: number | null
          confirm_token_expires_at?: string | null
          confirm_token_hash?: string | null
          confirm_token_used_at?: string | null
          consent_marketing?: boolean
          consent_marketing_at?: string | null
          consent_policy_version?: string | null
          consent_source?: string | null
          consent_to_updates?: boolean
          created_at?: string
          destination?: string | null
          email?: string
          email_normalized?: string | null
          email_verified_at?: string | null
          id?: string
          membership_provenance?:
            | Database["public"]["Enums"]["membership_provenance"]
            | null
          priority_score?: number | null
          referral_code?: string
          referral_count?: number
          referred_by?: string | null
          role?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      explorer_trip_requests: {
        Row: {
          accommodation_area: string | null
          admin_notes: string | null
          already_planned_text: string | null
          authenticity_comfort_score: number | null
          budget_style: string | null
          completed_at: string | null
          consent_to_match: boolean
          created_at: string
          destination_city: string
          destination_country: string | null
          email: string
          famous_hidden_score: number | null
          first_name: string | null
          first_time_destination: string | null
          food_preferences: string | null
          id: string
          interests: string[] | null
          matched_at: string | null
          matching_prompt_packet: string | null
          mobility_constraints: string | null
          movement_score: number | null
          planning_spontaneity_score: number | null
          preferred_languages: string[] | null
          private_trip_space_token: string
          queue_tolerance_score: number | null
          safety_concerns: string | null
          slow_intense_score: number | null
          specific_request_text: string | null
          status: string
          travel_end_date: string | null
          travel_group: string | null
          travel_start_date: string | null
          trip_duration: string
          updated_at: string
        }
        Insert: {
          accommodation_area?: string | null
          admin_notes?: string | null
          already_planned_text?: string | null
          authenticity_comfort_score?: number | null
          budget_style?: string | null
          completed_at?: string | null
          consent_to_match?: boolean
          created_at?: string
          destination_city: string
          destination_country?: string | null
          email: string
          famous_hidden_score?: number | null
          first_name?: string | null
          first_time_destination?: string | null
          food_preferences?: string | null
          id?: string
          interests?: string[] | null
          matched_at?: string | null
          matching_prompt_packet?: string | null
          mobility_constraints?: string | null
          movement_score?: number | null
          planning_spontaneity_score?: number | null
          preferred_languages?: string[] | null
          private_trip_space_token?: string
          queue_tolerance_score?: number | null
          safety_concerns?: string | null
          slow_intense_score?: number | null
          specific_request_text?: string | null
          status?: string
          travel_end_date?: string | null
          travel_group?: string | null
          travel_start_date?: string | null
          trip_duration: string
          updated_at?: string
        }
        Update: {
          accommodation_area?: string | null
          admin_notes?: string | null
          already_planned_text?: string | null
          authenticity_comfort_score?: number | null
          budget_style?: string | null
          completed_at?: string | null
          consent_to_match?: boolean
          created_at?: string
          destination_city?: string
          destination_country?: string | null
          email?: string
          famous_hidden_score?: number | null
          first_name?: string | null
          first_time_destination?: string | null
          food_preferences?: string | null
          id?: string
          interests?: string[] | null
          matched_at?: string | null
          matching_prompt_packet?: string | null
          mobility_constraints?: string | null
          movement_score?: number | null
          planning_spontaneity_score?: number | null
          preferred_languages?: string[] | null
          private_trip_space_token?: string
          queue_tolerance_score?: number | null
          safety_concerns?: string | null
          slow_intense_score?: number | null
          specific_request_text?: string | null
          status?: string
          travel_end_date?: string | null
          travel_group?: string | null
          travel_start_date?: string | null
          trip_duration?: string
          updated_at?: string
        }
        Relationships: []
      }
      matched_waymakers: {
        Row: {
          admin_match_reason: string | null
          created_at: string
          explorer_selected: boolean
          explorer_trip_request_id: string
          id: string
          selected_at: string | null
          status: string
          waymaker_profile_id: string
        }
        Insert: {
          admin_match_reason?: string | null
          created_at?: string
          explorer_selected?: boolean
          explorer_trip_request_id: string
          id?: string
          selected_at?: string | null
          status?: string
          waymaker_profile_id: string
        }
        Update: {
          admin_match_reason?: string | null
          created_at?: string
          explorer_selected?: boolean
          explorer_trip_request_id?: string
          id?: string
          selected_at?: string | null
          status?: string
          waymaker_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matched_waymakers_explorer_trip_request_id_fkey"
            columns: ["explorer_trip_request_id"]
            isOneToOne: false
            referencedRelation: "explorer_trip_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matched_waymakers_waymaker_profile_id_fkey"
            columns: ["waymaker_profile_id"]
            isOneToOne: false
            referencedRelation: "waymaker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prelaunch_analytics_events: {
        Row: {
          button_location: string | null
          button_text: string | null
          created_at: string
          event_name: string
          id: string
          metadata: Json | null
          page_path: string | null
          page_url: string | null
          referrer: string | null
          source: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          button_location?: string | null
          button_text?: string | null
          created_at?: string
          event_name: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          button_location?: string | null
          button_text?: string | null
          created_at?: string
          event_name?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          page_url?: string | null
          referrer?: string | null
          source?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      referral_credits: {
        Row: {
          awarded_at: string | null
          created_at: string
          id: string
          referred_signup_id: string
          referrer_signup_id: string
          status: string
        }
        Insert: {
          awarded_at?: string | null
          created_at?: string
          id?: string
          referred_signup_id: string
          referrer_signup_id: string
          status?: string
        }
        Update: {
          awarded_at?: string | null
          created_at?: string
          id?: string
          referred_signup_id?: string
          referrer_signup_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_credits_referred_signup_id_fkey"
            columns: ["referred_signup_id"]
            isOneToOne: true
            referencedRelation: "early_access_signups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_credits_referrer_signup_id_fkey"
            columns: ["referrer_signup_id"]
            isOneToOne: false
            referencedRelation: "early_access_signups"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_notification_outbox: {
        Row: {
          attempts: number
          claimed_at: string | null
          created_at: string
          id: string
          last_error: string | null
          provider_accepted_at: string | null
          provider_message_id: string | null
          recipient_signup_id: string
          referral_credit_id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          attempts?: number
          claimed_at?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          provider_accepted_at?: string | null
          provider_message_id?: string | null
          recipient_signup_id: string
          referral_credit_id: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          attempts?: number
          claimed_at?: string | null
          created_at?: string
          id?: string
          last_error?: string | null
          provider_accepted_at?: string | null
          provider_message_id?: string | null
          recipient_signup_id?: string
          referral_credit_id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_notification_outbox_recipient_signup_id_fkey"
            columns: ["recipient_signup_id"]
            isOneToOne: false
            referencedRelation: "early_access_signups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_notification_outbox_referral_credit_id_fkey"
            columns: ["referral_credit_id"]
            isOneToOne: true
            referencedRelation: "referral_credits"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      trip_feedback: {
        Row: {
          accuracy_score: number | null
          admin_review_status: string
          advice_quality_score: number | null
          created_at: string
          explorer_trip_request_id: string
          id: string
          improvement_text: string | null
          internal_match_feedback: string | null
          internal_match_score: number | null
          most_useful_text: string | null
          overall_experience_score: number | null
          public_review_permission: boolean
          understanding_score: number | null
          usefulness_score: number | null
          waymaker_profile_id: string | null
        }
        Insert: {
          accuracy_score?: number | null
          admin_review_status?: string
          advice_quality_score?: number | null
          created_at?: string
          explorer_trip_request_id: string
          id?: string
          improvement_text?: string | null
          internal_match_feedback?: string | null
          internal_match_score?: number | null
          most_useful_text?: string | null
          overall_experience_score?: number | null
          public_review_permission?: boolean
          understanding_score?: number | null
          usefulness_score?: number | null
          waymaker_profile_id?: string | null
        }
        Update: {
          accuracy_score?: number | null
          admin_review_status?: string
          advice_quality_score?: number | null
          created_at?: string
          explorer_trip_request_id?: string
          id?: string
          improvement_text?: string | null
          internal_match_feedback?: string | null
          internal_match_score?: number | null
          most_useful_text?: string | null
          overall_experience_score?: number | null
          public_review_permission?: boolean
          understanding_score?: number | null
          usefulness_score?: number | null
          waymaker_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_feedback_explorer_trip_request_id_fkey"
            columns: ["explorer_trip_request_id"]
            isOneToOne: false
            referencedRelation: "explorer_trip_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_feedback_waymaker_profile_id_fkey"
            columns: ["waymaker_profile_id"]
            isOneToOne: false
            referencedRelation: "waymaker_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waymaker_applications: {
        Row: {
          admin_notes: string | null
          availability: string | null
          blog_url: string | null
          consent_to_profile_review: boolean
          created_at: string
          email: string
          first_name: string
          google_maps_url: string | null
          id: string
          instagram_url: string | null
          languages: string[] | null
          linkedin_url: string | null
          main_location: string
          motivation_text: string | null
          other_url: string | null
          preferred_contact_method: string | null
          preferred_help_methods: string[] | null
          status: string
          travel_style_description: string | null
          travel_style_tags: string[] | null
          updated_at: string
          useful_advice_text: string | null
        }
        Insert: {
          admin_notes?: string | null
          availability?: string | null
          blog_url?: string | null
          consent_to_profile_review?: boolean
          created_at?: string
          email: string
          first_name: string
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          main_location: string
          motivation_text?: string | null
          other_url?: string | null
          preferred_contact_method?: string | null
          preferred_help_methods?: string[] | null
          status?: string
          travel_style_description?: string | null
          travel_style_tags?: string[] | null
          updated_at?: string
          useful_advice_text?: string | null
        }
        Update: {
          admin_notes?: string | null
          availability?: string | null
          blog_url?: string | null
          consent_to_profile_review?: boolean
          created_at?: string
          email?: string
          first_name?: string
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          main_location?: string
          motivation_text?: string | null
          other_url?: string | null
          preferred_contact_method?: string | null
          preferred_help_methods?: string[] | null
          status?: string
          travel_style_description?: string | null
          travel_style_tags?: string[] | null
          updated_at?: string
          useful_advice_text?: string | null
        }
        Relationships: []
      }
      waymaker_destinations: {
        Row: {
          city: string
          confidence_level: number | null
          country: string | null
          created_at: string
          id: string
          is_verified: boolean
          relationship_to_destination: string | null
          waymaker_id: string
        }
        Insert: {
          city: string
          confidence_level?: number | null
          country?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          relationship_to_destination?: string | null
          waymaker_id: string
        }
        Update: {
          city?: string
          confidence_level?: number | null
          country?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          relationship_to_destination?: string | null
          waymaker_id?: string
        }
        Relationships: []
      }
      waymaker_profiles: {
        Row: {
          best_for_tags: string[] | null
          bio: string | null
          completed_helps_count: number
          created_at: string
          id: string
          is_public: boolean
          languages: string[] | null
          level: string
          main_location: string | null
          public_name: string
          travel_style_tags: string[] | null
          updated_at: string
          way_score_average: number | null
          waymaker_application_id: string | null
        }
        Insert: {
          best_for_tags?: string[] | null
          bio?: string | null
          completed_helps_count?: number
          created_at?: string
          id?: string
          is_public?: boolean
          languages?: string[] | null
          level?: string
          main_location?: string | null
          public_name: string
          travel_style_tags?: string[] | null
          updated_at?: string
          way_score_average?: number | null
          waymaker_application_id?: string | null
        }
        Update: {
          best_for_tags?: string[] | null
          bio?: string | null
          completed_helps_count?: number
          created_at?: string
          id?: string
          is_public?: boolean
          languages?: string[] | null
          level?: string
          main_location?: string | null
          public_name?: string
          travel_style_tags?: string[] | null
          updated_at?: string
          way_score_average?: number | null
          waymaker_application_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waymaker_profiles_waymaker_application_id_fkey"
            columns: ["waymaker_application_id"]
            isOneToOne: false
            referencedRelation: "waymaker_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_referral_notifications: {
        Args: { p_limit?: number }
        Returns: {
          attempts: number
          outbox_id: string
          provider_accepted_at: string
          recipient_signup_id: string
          referral_credit_id: string
        }[]
      }
      confirm_email_and_award: {
        Args: { p_token_hash: string }
        Returns: {
          credit_awarded: boolean
          outcome: string
          referral_code: string
        }[]
      }
      confirm_email_status: { Args: { p_token_hash: string }; Returns: string }
      create_or_get_signup: {
        Args: {
          p_confirm_token_expires_at: string
          p_confirm_token_hash: string
          p_consent_policy_version: string
          p_consent_source: string
          p_email: string
          p_referred_by: string
          p_role: string
          p_source: string
        }
        Returns: {
          confirm_token_stored: boolean
          email_verified: boolean
          referral_code: string
          signup_id: string
          was_inserted: boolean
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      mark_referral_notification: {
        Args: {
          p_accepted?: boolean
          p_error?: string
          p_outbox_id: string
          p_provider_message_id?: string
          p_status: string
        }
        Returns: undefined
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      waitlist_position: { Args: { p_signup_id: string }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      membership_provenance: "legacy_grandfathered" | "email_link_confirmed"
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
      app_role: ["admin", "moderator", "user"],
      membership_provenance: ["legacy_grandfathered", "email_link_confirmed"],
    },
  },
} as const
