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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      atendimento: {
        Row: {
          data: string
          descricao: string | null
          id_atendimento: number
          id_pessoa: number
          id_tipo: number
          id_usuario: string
          status: string
        }
        Insert: {
          data?: string
          descricao?: string | null
          id_atendimento?: never
          id_pessoa: number
          id_tipo: number
          id_usuario: string
          status?: string
        }
        Update: {
          data?: string
          descricao?: string | null
          id_atendimento?: never
          id_pessoa?: number
          id_tipo?: number
          id_usuario?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimento_id_pessoa_fkey"
            columns: ["id_pessoa"]
            isOneToOne: false
            referencedRelation: "pessoa"
            referencedColumns: ["id_pessoa"]
          },
          {
            foreignKeyName: "atendimento_id_tipo_fkey"
            columns: ["id_tipo"]
            isOneToOne: false
            referencedRelation: "tipo_atendimento"
            referencedColumns: ["id_tipo"]
          },
          {
            foreignKeyName: "atendimento_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      bairro: {
        Row: {
          id_bairro: number
          nome: string
        }
        Insert: {
          id_bairro?: never
          nome: string
        }
        Update: {
          id_bairro?: never
          nome?: string
        }
        Relationships: []
      }
      evento: {
        Row: {
          data: string
          descricao: string | null
          horario: string | null
          id_evento: number
          id_usuario: string
          local: string | null
          nome: string
          presenca_prevista: number | null
        }
        Insert: {
          data: string
          descricao?: string | null
          horario?: string | null
          id_evento?: never
          id_usuario: string
          local?: string | null
          nome: string
          presenca_prevista?: number | null
        }
        Update: {
          data?: string
          descricao?: string | null
          horario?: string | null
          id_evento?: never
          id_usuario?: string
          local?: string | null
          nome?: string
          presenca_prevista?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "evento_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      pessoa: {
        Row: {
          data_cadastro: string
          data_nascimento: string | null
          endereco: string | null
          id_bairro: number
          id_pessoa: number
          nome_completo: string
          observacoes: string | null
          telefone: string | null
        }
        Insert: {
          data_cadastro?: string
          data_nascimento?: string | null
          endereco?: string | null
          id_bairro: number
          id_pessoa?: never
          nome_completo: string
          observacoes?: string | null
          telefone?: string | null
        }
        Update: {
          data_cadastro?: string
          data_nascimento?: string | null
          endereco?: string | null
          id_bairro?: number
          id_pessoa?: never
          nome_completo?: string
          observacoes?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoa_id_bairro_fkey"
            columns: ["id_bairro"]
            isOneToOne: false
            referencedRelation: "bairro"
            referencedColumns: ["id_bairro"]
          },
        ]
      }
      tipo_atendimento: {
        Row: {
          id_tipo: number
          nome: string
        }
        Insert: {
          id_tipo?: never
          nome: string
        }
        Update: {
          id_tipo?: never
          nome?: string
        }
        Relationships: []
      }
      usuario: {
        Row: {
          cargo: string | null
          email: string
          id_usuario: string
          nome: string
        }
        Insert: {
          cargo?: string | null
          email: string
          id_usuario: string
          nome: string
        }
        Update: {
          cargo?: string | null
          email?: string
          id_usuario?: string
          nome?: string
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
    Enums: {},
  },
} as const
