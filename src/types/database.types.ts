import { Json } from "@/lib/database.types"

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      farms: {
        Row: {
          breeder_name: string | null
          contact_facebook: string | null
          contact_instagram: string | null
          contact_line: string | null
          contact_wechat: string | null
          contact_whatsapp: string | null
          created_at: string | null
          id: number
          information: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          breeder_name?: string | null
          contact_facebook?: string | null
          contact_instagram?: string | null
          contact_line?: string | null
          contact_wechat?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          id?: number
          information?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          breeder_name?: string | null
          contact_facebook?: string | null
          contact_instagram?: string | null
          contact_line?: string | null
          contact_wechat?: string | null
          contact_whatsapp?: string | null
          created_at?: string | null
          id?: number
          information?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      morph_categories: {
        Row: {
          color_hex: string | null
          id: number
          name: string
        }
        Insert: {
          color_hex?: string | null
          id?: number
          name: string
        }
        Update: {
          color_hex?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      morph_sub_categories: {
        Row: {
          category_id: number
          color_hex: string | null
          id: number
          name: string
        }
        Insert: {
          category_id: number
          color_hex?: string | null
          id?: number
          name: string
        }
        Update: {
          category_id?: number
          color_hex?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "morph_sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "morph_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      morph_sub_sub_categories: {
        Row: {
          color_hex: string | null
          id: number
          name: string
          sub_category_id: number
        }
        Insert: {
          color_hex?: string | null
          id?: number
          name: string
          sub_category_id: number
        }
        Update: {
          color_hex?: string | null
          id?: number
          name?: string
          sub_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "morph_sub_sub_categories_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "morph_sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      morphs: {
        Row: {
          category_id: number
          id: number
          name: string
          sub_category_id: number | null
          sub_sub_category_id: number | null
        }
        Insert: {
          category_id: number
          id?: number
          name: string
          sub_category_id?: number | null
          sub_sub_category_id?: number | null
        }
        Update: {
          category_id?: number
          id?: number
          name?: string
          sub_category_id?: number | null
          sub_sub_category_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "morphs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "morph_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "morphs_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "morph_sub_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "morphs_sub_sub_category_id_fkey"
            columns: ["sub_sub_category_id"]
            isOneToOne: false
            referencedRelation: "morph_sub_sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_morphs: {
        Row: {
          morph_id: number
          product_id: number
        }
        Insert: {
          morph_id: number
          product_id: number
        }
        Update: {
          morph_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_morphs_morph_id_fkey"
            columns: ["morph_id"]
            isOneToOne: false
            referencedRelation: "morphs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_morphs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          farm_id: number
          id: number
          image_urls: string[] | null
          name: string
          price: number | null
          product_id: string | null
          sex: string | null
          status: string
          updated_at: string | null
          user_id: string
          year: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          farm_id: number
          id?: never
          image_urls?: string[] | null
          name: string
          price?: number | null
          product_id?: string | null
          sex?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          year?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          farm_id?: number
          id?: never
          image_urls?: string[] | null
          name?: string
          price?: number | null
          product_id?: string | null
          sex?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_morphs_structured: {
        Args: Record<PropertyKey, never>
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
    Enums: {},
  },
} as const
