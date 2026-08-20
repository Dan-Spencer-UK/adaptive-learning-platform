export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      assertion_curriculum_mappings: {
        Row: {
          assertion_id: string
          created_at: string
          curriculum_node_id: string
          id: string
          mapping_type: string
        }
        Insert: {
          assertion_id: string
          created_at?: string
          curriculum_node_id: string
          id?: string
          mapping_type: string
        }
        Update: {
          assertion_id?: string
          created_at?: string
          curriculum_node_id?: string
          id?: string
          mapping_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assertion_curriculum_mappings_assertion_id_fkey"
            columns: ["assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assertion_curriculum_mappings_curriculum_node_id_fkey"
            columns: ["curriculum_node_id"]
            isOneToOne: false
            referencedRelation: "curriculum_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      assertion_provenance_links: {
        Row: {
          assertion_version_id: string
          created_at: string
          id: string
          provenance_role: string
          source_locator_id: string
        }
        Insert: {
          assertion_version_id: string
          created_at?: string
          id?: string
          provenance_role: string
          source_locator_id: string
        }
        Update: {
          assertion_version_id?: string
          created_at?: string
          id?: string
          provenance_role?: string
          source_locator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assertion_provenance_links_assertion_version_id_fkey"
            columns: ["assertion_version_id"]
            isOneToOne: false
            referencedRelation: "assertion_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assertion_provenance_links_source_locator_id_fkey"
            columns: ["source_locator_id"]
            isOneToOne: false
            referencedRelation: "source_locators"
            referencedColumns: ["id"]
          },
        ]
      }
      assertion_relationships: {
        Row: {
          created_at: string
          from_assertion_id: string
          id: string
          relationship_type: string
          strength: string | null
          to_assertion_id: string
        }
        Insert: {
          created_at?: string
          from_assertion_id: string
          id?: string
          relationship_type: string
          strength?: string | null
          to_assertion_id: string
        }
        Update: {
          created_at?: string
          from_assertion_id?: string
          id?: string
          relationship_type?: string
          strength?: string | null
          to_assertion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assertion_relationships_from_assertion_id_fkey"
            columns: ["from_assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assertion_relationships_to_assertion_id_fkey"
            columns: ["to_assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
        ]
      }
      assertion_versions: {
        Row: {
          assertion_id: string
          created_at: string
          id: string
          statement: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          assertion_id: string
          created_at?: string
          id?: string
          statement: string
          status?: string
          updated_at?: string
          version: number
        }
        Update: {
          assertion_id?: string
          created_at?: string
          id?: string
          statement?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "assertion_versions_assertion_id_fkey"
            columns: ["assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
        ]
      }
      assertions: {
        Row: {
          created_at: string
          domain_id: string
          id: string
          identifier: string
          superseded_by_assertion_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain_id: string
          id?: string
          identifier: string
          superseded_by_assertion_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain_id?: string
          id?: string
          identifier?: string
          superseded_by_assertion_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assertions_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assertions_superseded_by_assertion_id_fkey"
            columns: ["superseded_by_assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
        ]
      }
      curricula: {
        Row: {
          awarding_body: string | null
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          awarding_body?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          awarding_body?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_nodes: {
        Row: {
          code: string
          created_at: string
          curriculum_version_id: string
          id: string
          node_type: string
          parent_node_id: string | null
          sequence_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          curriculum_version_id: string
          id?: string
          node_type: string
          parent_node_id?: string | null
          sequence_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          curriculum_version_id?: string
          id?: string
          node_type?: string
          parent_node_id?: string | null
          sequence_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_nodes_curriculum_version_id_fkey"
            columns: ["curriculum_version_id"]
            isOneToOne: false
            referencedRelation: "curriculum_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_nodes_parent_node_id_curriculum_version_id_fkey"
            columns: ["parent_node_id", "curriculum_version_id"]
            isOneToOne: false
            referencedRelation: "curriculum_nodes"
            referencedColumns: ["id", "curriculum_version_id"]
          },
        ]
      }
      curriculum_versions: {
        Row: {
          created_at: string
          curriculum_id: string
          effective_date: string | null
          id: string
          status: string
          superseded_date: string | null
          updated_at: string
          version_label: string
        }
        Insert: {
          created_at?: string
          curriculum_id: string
          effective_date?: string | null
          id?: string
          status?: string
          superseded_date?: string | null
          updated_at?: string
          version_label: string
        }
        Update: {
          created_at?: string
          curriculum_id?: string
          effective_date?: string | null
          id?: string
          status?: string
          superseded_date?: string | null
          updated_at?: string
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_versions_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curricula"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      learner_attempt_events: {
        Row: {
          answer_revealed_before_attempt: boolean
          attempt_index: number
          client_correct: boolean
          client_evidence_strength: string | null
          client_misconception_identifier: string | null
          client_recorded_at: string
          content_release: string
          given_answer: Json
          id: string
          learner_id: string
          lesson_id: string
          lesson_instance_id: string
          lesson_version: number
          question_blueprint_id: string
          question_blueprint_version: number
          question_seed: number
          server_received_at: string
          server_seq: number
          session_key: string
          step_id: string
        }
        Insert: {
          answer_revealed_before_attempt: boolean
          attempt_index: number
          client_correct: boolean
          client_evidence_strength?: string | null
          client_misconception_identifier?: string | null
          client_recorded_at: string
          content_release: string
          given_answer: Json
          id?: string
          learner_id: string
          lesson_id: string
          lesson_instance_id: string
          lesson_version: number
          question_blueprint_id: string
          question_blueprint_version: number
          question_seed: number
          server_received_at?: string
          server_seq?: never
          session_key: string
          step_id: string
        }
        Update: {
          answer_revealed_before_attempt?: boolean
          attempt_index?: number
          client_correct?: boolean
          client_evidence_strength?: string | null
          client_misconception_identifier?: string | null
          client_recorded_at?: string
          content_release?: string
          given_answer?: Json
          id?: string
          learner_id?: string
          lesson_id?: string
          lesson_instance_id?: string
          lesson_version?: number
          question_blueprint_id?: string
          question_blueprint_version?: number
          question_seed?: number
          server_received_at?: string
          server_seq?: never
          session_key?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_attempt_events_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_isolation_probe: {
        Row: {
          created_at: string
          id: string
          learner_id: string
          note: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          learner_id: string
          note: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          learner_id?: string
          note?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learner_isolation_probe_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learner_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_profiles: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      misconception_assertion_conflicts: {
        Row: {
          assertion_id: string
          created_at: string
          id: string
          misconception_id: string
        }
        Insert: {
          assertion_id: string
          created_at?: string
          id?: string
          misconception_id: string
        }
        Update: {
          assertion_id?: string
          created_at?: string
          id?: string
          misconception_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "misconception_assertion_conflicts_assertion_id_fkey"
            columns: ["assertion_id"]
            isOneToOne: false
            referencedRelation: "assertions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "misconception_assertion_conflicts_misconception_id_fkey"
            columns: ["misconception_id"]
            isOneToOne: false
            referencedRelation: "misconceptions"
            referencedColumns: ["id"]
          },
        ]
      }
      misconceptions: {
        Row: {
          created_at: string
          description: string
          id: string
          identifier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          identifier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          identifier?: string
          updated_at?: string
        }
        Relationships: []
      }
      source_locators: {
        Row: {
          chapter: string | null
          clause: string | null
          created_at: string
          figure_reference: string | null
          id: string
          locator_summary: string
          page: string | null
          paragraph: string | null
          part: string | null
          section: string | null
          source_version_id: string
          subsection: string | null
          table_reference: string | null
          updated_at: string
          web_anchor: string | null
        }
        Insert: {
          chapter?: string | null
          clause?: string | null
          created_at?: string
          figure_reference?: string | null
          id?: string
          locator_summary: string
          page?: string | null
          paragraph?: string | null
          part?: string | null
          section?: string | null
          source_version_id: string
          subsection?: string | null
          table_reference?: string | null
          updated_at?: string
          web_anchor?: string | null
        }
        Update: {
          chapter?: string | null
          clause?: string | null
          created_at?: string
          figure_reference?: string | null
          id?: string
          locator_summary?: string
          page?: string | null
          paragraph?: string | null
          part?: string | null
          section?: string | null
          source_version_id?: string
          subsection?: string | null
          table_reference?: string | null
          updated_at?: string
          web_anchor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_locators_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      source_versions: {
        Row: {
          checksum: string | null
          created_at: string
          edition: string | null
          effective_date: string | null
          id: string
          publication_date: string | null
          revision: string | null
          rights_classification: string
          source_id: string
          status: string
          superseded_date: string | null
          updated_at: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          edition?: string | null
          effective_date?: string | null
          id?: string
          publication_date?: string | null
          revision?: string | null
          rights_classification: string
          source_id: string
          status?: string
          superseded_date?: string | null
          updated_at?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          edition?: string | null
          effective_date?: string | null
          id?: string
          publication_date?: string | null
          revision?: string | null
          rights_classification?: string
          source_id?: string
          status?: string
          superseded_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_versions_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          access_location: string | null
          canonical_reference: string | null
          created_at: string
          id: string
          jurisdiction: string | null
          publisher: string | null
          source_family: string | null
          source_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_location?: string | null
          canonical_reference?: string | null
          created_at?: string
          id?: string
          jurisdiction?: string | null
          publisher?: string | null
          source_family?: string | null
          source_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_location?: string | null
          canonical_reference?: string | null
          created_at?: string
          id?: string
          jurisdiction?: string | null
          publisher?: string | null
          source_family?: string | null
          source_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

