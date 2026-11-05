type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        { id: string; full_name: string; created_at: string; updated_at: string },
        { id: string; full_name?: string; created_at?: string; updated_at?: string },
        { full_name?: string; updated_at?: string }
      >;
      households: Table<
        {
          id: string;
          name: string;
          created_by: string;
          is_synthetic: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          created_by: string;
          is_synthetic?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        { name?: string; is_synthetic?: boolean; updated_at?: string }
      >;
      household_memberships: Table<
        {
          household_id: string;
          user_id: string;
          role: "owner" | "parent" | "caregiver";
          added_by: string;
          created_at: string;
        },
        {
          household_id: string;
          user_id: string;
          role: "owner" | "parent" | "caregiver";
          added_by: string;
          created_at?: string;
        },
        { role?: "owner" | "parent" | "caregiver" }
      >;
      children: Table<
        {
          id: string;
          owner_id: string;
          household_id: string | null;
          first_name: string;
          last_name: string;
          preferred_name: string | null;
          birth_date: string;
          is_synthetic: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          owner_id: string;
          household_id?: string | null;
          first_name: string;
          last_name: string;
          preferred_name?: string | null;
          birth_date: string;
          is_synthetic?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          owner_id?: string;
          household_id?: string | null;
          first_name?: string;
          last_name?: string;
          preferred_name?: string | null;
          birth_date?: string;
          is_synthetic?: boolean;
          updated_at?: string;
        }
      >;
      child_memberships: Table<
        {
          child_id: string;
          user_id: string;
          member_email: string;
          role: "caregiver";
          created_by: string;
          created_at: string;
        },
        {
          child_id: string;
          user_id: string;
          member_email: string;
          role?: "caregiver";
          created_by: string;
          created_at?: string;
        },
        { role?: "caregiver" }
      >;
      child_invitations: Table<
        {
          token: string;
          child_id: string;
          invite_email: string;
          invited_by: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        },
        {
          token?: string;
          child_id: string;
          invite_email: string;
          invited_by: string;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
        },
        { expires_at?: string; accepted_at?: string | null }
      >;
      vaccination_records: Table<
        {
          id: string;
          child_id: string;
          vaccine_name: string;
          dose_label: string;
          administered_on: string;
          notes: string;
          is_synthetic: boolean;
          created_at: string;
        },
        {
          id?: string;
          child_id: string;
          vaccine_name: string;
          dose_label: string;
          administered_on: string;
          notes?: string;
          is_synthetic?: boolean;
          created_at?: string;
        },
        {
          vaccine_name?: string;
          dose_label?: string;
          administered_on?: string;
          notes?: string;
          is_synthetic?: boolean;
        }
      >;
      growth_measurements: Table<
        {
          id: string;
          child_id: string;
          measured_on: string;
          weight_kg: number;
          height_cm: number;
          notes: string;
          is_synthetic: boolean;
          created_at: string;
        },
        {
          id?: string;
          child_id: string;
          measured_on: string;
          weight_kg: number;
          height_cm: number;
          notes?: string;
          is_synthetic?: boolean;
          created_at?: string;
        },
        {
          measured_on?: string;
          weight_kg?: number;
          height_cm?: number;
          notes?: string;
          is_synthetic?: boolean;
        }
      >;
      health_timeline_events: Table<
        {
          id: string;
          child_id: string;
          event_type: string;
          title: string;
          details: string;
          occurred_at: string;
          is_synthetic: boolean;
          created_at: string;
        },
        {
          id?: string;
          child_id: string;
          event_type: string;
          title: string;
          details?: string;
          occurred_at: string;
          is_synthetic?: boolean;
          created_at?: string;
        },
        {
          event_type?: string;
          title?: string;
          details?: string;
          occurred_at?: string;
          is_synthetic?: boolean;
        }
      >;
      appointments: Table<
        {
          id: string;
          child_id: string;
          title: string;
          provider_name: string;
          scheduled_at: string;
          status: "scheduled" | "completed" | "cancelled";
          notes: string;
          is_synthetic: boolean;
          created_at: string;
        },
        {
          id?: string;
          child_id: string;
          title: string;
          provider_name: string;
          scheduled_at: string;
          status?: "scheduled" | "completed" | "cancelled";
          notes?: string;
          is_synthetic?: boolean;
          created_at?: string;
        },
        {
          title?: string;
          provider_name?: string;
          scheduled_at?: string;
          status?: "scheduled" | "completed" | "cancelled";
          notes?: string;
          is_synthetic?: boolean;
        }
      >;
      medical_documents: Table<
        {
          id: string;
          child_id: string;
          document_name: string;
          mime_type: string;
          storage_path: string;
          description: string;
          uploaded_at: string;
          is_synthetic: boolean;
        },
        {
          id?: string;
          child_id: string;
          document_name: string;
          mime_type: string;
          storage_path: string;
          description?: string;
          uploaded_at?: string;
          is_synthetic?: boolean;
        },
        {
          document_name?: string;
          mime_type?: string;
          storage_path?: string;
          description?: string;
          uploaded_at?: string;
          is_synthetic?: boolean;
        }
      >;
      notifications: Table<
        {
          id: string;
          user_id: string;
          child_id: string | null;
          title: string;
          message: string;
          read_at: string | null;
          created_at: string;
          is_synthetic: boolean;
        },
        {
          id?: string;
          user_id: string;
          child_id?: string | null;
          title: string;
          message: string;
          read_at?: string | null;
          created_at?: string;
          is_synthetic?: boolean;
        },
        { read_at?: string | null }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      accept_child_invitation: {
        Args: { invitation_token: string };
        Returns: string;
      };
      can_access_child: {
        Args: { target_child_id: string };
        Returns: boolean;
      };
      owns_child: {
        Args: { target_child_id: string };
        Returns: boolean;
      };
      can_manage_child: {
        Args: { target_child_id: string };
        Returns: boolean;
      };
      is_household_member: {
        Args: { target_household_id: string; allowed_roles: string[] };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
