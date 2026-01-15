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
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            categories: {
                Row: {
                    cover_image: string | null
                    created_at: string | null
                    id: string
                    sort_order: number | null
                    title: string
                }
                Insert: {
                    cover_image?: string | null
                    created_at?: string | null
                    id: string
                    sort_order?: number | null
                    title: string
                }
                Update: {
                    cover_image?: string | null
                    created_at?: string | null
                    id?: string
                    sort_order?: number | null
                    title?: string
                }
                Relationships: []
            }
            feedback: {
                Row: {
                    contact_info: string | null
                    content: string
                    created_at: string | null
                    device_info: Json | null
                    id: string
                    status: string | null
                }
                Insert: {
                    contact_info?: string | null
                    content: string
                    created_at?: string | null
                    device_info?: Json | null
                    id?: string
                    status?: string | null
                }
                Update: {
                    contact_info?: string | null
                    content?: string
                    created_at?: string | null
                    device_info?: Json | null
                    id?: string
                    status?: string | null
                }
                Relationships: []
            }
            scene_images: {
                Row: {
                    created_at: string
                    id: string
                    image_url: string | null
                    scene_index: number
                    status: string | null
                    story_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    scene_index: number
                    status?: string | null
                    story_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    image_url?: string | null
                    scene_index?: number
                    status?: string | null
                    story_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "scene_images_story_id_fkey"
                        columns: ["story_id"]
                        isOneToOne: false
                        referencedRelation: "stories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            scene_narrations: {
                Row: {
                    audio_url: string | null
                    created_at: string
                    episode_id: string | null
                    id: string
                    scene_index: number
                    status: string
                    story_id: string
                }
                Insert: {
                    audio_url?: string | null
                    created_at?: string
                    episode_id?: string | null
                    id?: string
                    scene_index: number
                    status?: string
                    story_id: string
                }
                Update: {
                    audio_url?: string | null
                    created_at?: string
                    episode_id?: string | null
                    id?: string
                    scene_index?: number
                    status?: string
                    story_id?: string
                }
                Relationships: []
            }
            scene_options: {
                Row: {
                    created_at: string | null
                    feedback: string
                    id: string
                    is_correct: boolean
                    scene_id: string
                    sort_order: number | null
                    text: string
                }
                Insert: {
                    created_at?: string | null
                    feedback: string
                    id?: string
                    is_correct?: boolean
                    scene_id: string
                    sort_order?: number | null
                    text: string
                }
                Update: {
                    created_at?: string | null
                    feedback?: string
                    id?: string
                    is_correct?: boolean
                    scene_id?: string
                    sort_order?: number | null
                    text?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "scene_options_scene_id_fkey"
                        columns: ["scene_id"]
                        isOneToOne: false
                        referencedRelation: "scenes"
                        referencedColumns: ["id"]
                    },
                ]
            }
            scenes: {
                Row: {
                    audio_url: string | null
                    character_state: string
                    created_at: string | null
                    environment_description: string
                    id: string
                    image_url: string | null
                    narrative: string
                    scene_index: number
                    story_id: string
                    title: string
                }
                Insert: {
                    audio_url?: string | null
                    character_state: string
                    created_at?: string | null
                    environment_description: string
                    id?: string
                    image_url?: string | null
                    narrative: string
                    scene_index: number
                    story_id: string
                    title: string
                }
                Update: {
                    audio_url?: string | null
                    character_state?: string
                    created_at?: string | null
                    environment_description?: string
                    id?: string
                    image_url?: string | null
                    narrative?: string
                    scene_index?: number
                    story_id?: string
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "scenes_story_id_fkey"
                        columns: ["story_id"]
                        isOneToOne: false
                        referencedRelation: "stories"
                        referencedColumns: ["id"]
                    },
                ]
            }
            stories: {
                Row: {
                    category_id: string | null
                    created_at: string | null
                    description: string | null
                    ending_description: string | null
                    ending_title: string | null
                    id: string
                    is_ready: boolean
                    sort_order: number | null
                    title: string
                }
                Insert: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    ending_description?: string | null
                    ending_title?: string | null
                    id: string
                    is_ready?: boolean
                    sort_order?: number | null
                    title: string
                }
                Update: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    ending_description?: string | null
                    ending_title?: string | null
                    id?: string
                    is_ready?: boolean
                    sort_order?: number | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "stories_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                ]
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
