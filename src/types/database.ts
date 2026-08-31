export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          birthday: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          birthday?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          birthday?: string | null
          timezone?: string | null
          updated_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          user_id: string
          title: string | null
          description: string | null
          memory_date: string
          location: string | null
          mood: string | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          description?: string | null
          memory_date?: string
          location?: string | null
          mood?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          description?: string | null
          memory_date?: string
          location?: string | null
          mood?: string | null
          is_favorite?: boolean
          updated_at?: string
        }
      }
      memory_media: {
        Row: {
          id: string
          memory_id: string
          user_id: string
          type: string
          url: string
          storage_path: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          memory_id: string
          user_id: string
          type: string
          url: string
          storage_path: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          memory_id?: string
          user_id?: string
          type?: string
          url?: string
          storage_path?: string
          position?: number
        }
      }
    }
  }
}
