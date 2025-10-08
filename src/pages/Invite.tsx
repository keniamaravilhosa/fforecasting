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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      brand_invites: {
        Row: {
          brand_email: string
          brand_id: string | null
          brand_name: string
          created_at: string
          expires_at: string
          id: string
          invite_code: string
          status: Database["public"]["Enums"]["invite_status"]
          stylist_id: string
          updated_at: string
        }
        Insert: {
          brand_email: string
          brand_id?: string | null
          brand_name: string
          created_at?: string
          expires_at?: string
          id?: string
          invite_code: string
          status?: Database["public"]["Enums"]["invite_status"]
          stylist_id: string
          updated_at?: string
        }
        Update: {
          brand_email?: string
          brand_id?: string | null
          brand_name?: string
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          status?: Database["public"]["Enums"]["invite_status"]
          stylist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_invites_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_invites_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "stylists"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_name: string
          business_model: Database["public"]["Enums"]["business_model"]
          created_at: string
          id: string
          main_challenges: string | null
          price_range: Database["public"]["Enums"]["price_range"]
          profile_id: string
          target_audience: Database["public"]["Enums"]["target_audience"]
          updated_at: string
        }
        Insert: {
          brand_name: string
          business_model: Database["public"]["Enums"]["business_model"]
          created_at?: string
          id?: string
          main_challenges?: string | null
          price_range: Database["public"]["Enums"]["price_range"]
          profile_id: string
          target_audience: Database["public"]["Enums"]["target_audience"]
          updated_at?: string
        }
        Update: {
          brand_name?: string
          business_model?: Database["public"]["Enums"]["business_model"]
          created_at?: string
          id?: string
          main_challenges?: string | null
          price_range?: Database["public"]["Enums"]["price_range"]
          profile_id?: string
          target_audience?: Database["public"]["Enums"]["target_audience"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      stylists: {
        Row: {
          created_at: string
          experience: Database["public"]["Enums"]["experience_level"]
          id: string
          portfolio: string | null
          premium_access: boolean
          profile_id: string
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience: Database["public"]["Enums"]["experience_level"]
          id?: string
          portfolio?: string | null
          premium_access?: boolean
          profile_id: string
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience?: Database["public"]["Enums"]["experience_level"]
          id?: string
          portfolio?: string | null
          premium_access?: boolean
          profile_id?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stylists_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validate_invite_code: {
        Args: { invite_code_param: string }
        Returns: Json
      }
    }
    Enums: {
      brand_interests:
        | "aumentar_ticket_medio"
        | "atrair_publico"
        | "consolidar_publico"
        | "aumentar_categorias"
        | "melhorar_producao"
      business_model: "b2b" | "b2c" | "marketplace" | "atacado_varejo"
      clients_inspiration:
        | "instagram"
        | "pinterest"
        | "tik_tok"
        | "famosos"
        | "desfiles"
      delivery: "3_dias" | "4_7_dias" | "8_15_dias" | "mais_15_dias"
      experience_level:
        | "iniciante"
        | "1-3_anos"
        | "3-5_anos"
        | "5-10_anos"
        | "mais_10_anos"
      favorite_clothes:
        | "calca_jeans"
        | "saia_longa"
        | "blusa_alça"
        | "blusa_manga"
        | "regata"
        | "vestido_curto"
        | "vestido_longo"
        | "calça_alfaiataria"
        | "short"
        | "cropped"
        | "bermuda"
        | "legging"
        | "saia_curta"
        | "saia_reta"
        | "camisa"
        | "jaqueta"
        | "blusa_frio"
        | "biquine"
        | "maio"
        | "body"
        | "saida_de_praia"
      invite_status: "pending" | "accepted" | "expired" | "used"
      life_style:
        | "classica"
        | "urbana"
        | "fashionista"
        | "minimalista"
        | "executiva"
        | "boemia"
      price_range: "popular_100" | "medio_300" | "alto_600" | "luxo"
      production_model:
        | "pronta_entrega"
        | "sob_encomenda"
        | "pre_venda"
        | "dropshipping"
      segment:
        | "luxo"
        | "premium"
        | "fast_fashion"
        | "sustentavel"
        | "praia"
        | "fitness"
        | "jeanswear"
      target_audience:
        | "15-19_anos"
        | "20-29_anos"
        | "30-45_anos"
        | "46-60_anos"
        | "60+_anos"
      user_type: "brand" | "stylist"
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
      brand_interests: [
        "aumentar_ticket_medio",
        "atrair_publico",
        "consolidar_publico",
        "aumentar_categorias",
        "melhorar_producao",
      ],
      business_model: ["b2b", "b2c", "marketplace", "atacado_varejo"],
      clients_inspiration: [
        "instagram",
        "pinterest",
        "tik_tok",
        "famosos",
        "desfiles",
      ],
      delivery: ["3_dias", "4_7_dias", "8_15_dias", "mais_15_dias"],
      experience_level: [
        "iniciante",
        "1-3_anos",
        "3-5_anos",
        "5-10_anos",
        "mais_10_anos",
      ],
      favorite_clothes: [
        "calca_jeans",
        "saia_longa",
        "blusa_alça",
        "blusa_manga",
        "regata",
        "vestido_curto",
        "vestido_longo",
        "calça_alfaiataria",
        "short",
        "cropped",
        "bermuda",
        "legging",
        "saia_curta",
        "saia_reta",
        "camisa",
        "jaqueta",
        "blusa_frio",
        "biquine",
        "maio",
        "body",
        "saida_de_praia",
      ],
      invite_status: ["pending", "accepted", "expired", "used"],
      life_style: [
        "classica",
        "urbana",
        "fashionista",
        "minimalista",
        "executiva",
        "boemia",
      ],
      price_range: ["popular_100", "medio_300", "alto_600", "luxo"],
      production_model: [
        "pronta_entrega",
        "sob_encomenda",
        "pre_venda",
        "dropshipping",
      ],
      segment: [
        "luxo",
        "premium",
        "fast_fashion",
        "sustentavel",
        "praia",
        "fitness",
        "jeanswear",
      ],
      target_audience: [
        "15-19_anos",
        "20-29_anos",
        "30-45_anos",
        "46-60_anos",
        "60+_anos",
      ],
      user_type: ["brand", "stylist"],
    },
  },
} as const
