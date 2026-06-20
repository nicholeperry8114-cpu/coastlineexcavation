export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      activity_events: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          description: string | null;
          entity_id: string;
          entity_type: string;
          id: string;
          metadata: Json;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          description?: string | null;
          entity_id: string;
          entity_type: string;
          id?: string;
          metadata?: Json;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          description?: string | null;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "activity_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      invoice_line_items: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          invoice_id: string;
          quantity: number;
          sort_order: number;
          total_cents: number;
          unit_price_cents: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          invoice_id: string;
          quantity?: number;
          sort_order?: number;
          total_cents?: number;
          unit_price_cents?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          invoice_id?: string;
          quantity?: number;
          sort_order?: number;
          total_cents?: number;
          unit_price_cents?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          }
        ];
      };
      invoices: {
        Row: {
          created_at: string;
          created_by: string | null;
          deposit_received_cents: number;
          due_date: string;
          id: string;
          invoice_date: string;
          invoice_number: string;
          job_id: string;
          paid_at: string | null;
          public_token: string;
          remaining_balance_cents: number;
          sent_at: string | null;
          status: Database["public"]["Enums"]["invoice_status"];
          subtotal_cents: number;
          total_amount_cents: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deposit_received_cents?: number;
          due_date: string;
          id?: string;
          invoice_date?: string;
          invoice_number?: string;
          job_id: string;
          paid_at?: string | null;
          public_token?: string;
          remaining_balance_cents?: number;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          subtotal_cents?: number;
          total_amount_cents?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deposit_received_cents?: number;
          due_date?: string;
          id?: string;
          invoice_date?: string;
          invoice_number?: string;
          job_id?: string;
          paid_at?: string | null;
          public_token?: string;
          remaining_balance_cents?: number;
          sent_at?: string | null;
          status?: Database["public"]["Enums"]["invoice_status"];
          subtotal_cents?: number;
          total_amount_cents?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      jobs: {
        Row: {
          created_at: string;
          created_by: string | null;
          customer_name: string;
          email: string;
          id: string;
          job_number: string;
          notes: string | null;
          phone: string;
          property_address: string;
          proposal_id: string;
          status: Database["public"]["Enums"]["job_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          customer_name: string;
          email: string;
          id?: string;
          job_number?: string;
          notes?: string | null;
          phone: string;
          property_address: string;
          proposal_id: string;
          status?: Database["public"]["Enums"]["job_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          customer_name?: string;
          email?: string;
          id?: string;
          job_number?: string;
          notes?: string | null;
          phone?: string;
          property_address?: string;
          proposal_id?: string;
          status?: Database["public"]["Enums"]["job_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "jobs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jobs_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: true;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jobs_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      lead_attachments: {
        Row: {
          bucket: string;
          created_at: string;
          file_name: string;
          file_size: number | null;
          file_type: string | null;
          id: string;
          lead_id: string;
          storage_path: string;
          uploaded_by: string | null;
        };
        Insert: {
          bucket?: string;
          created_at?: string;
          file_name: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          lead_id: string;
          storage_path: string;
          uploaded_by?: string | null;
        };
        Update: {
          bucket?: string;
          created_at?: string;
          file_name?: string;
          file_size?: number | null;
          file_type?: string | null;
          id?: string;
          lead_id?: string;
          storage_path?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_attachments_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lead_attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      leads: {
        Row: {
          created_at: string;
          created_by: string | null;
          customer_name: string;
          email: string;
          id: string;
          job_type: string;
          lead_number: string;
          notes: string | null;
          phone: string;
          project_description: string | null;
          property_address: string;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          customer_name: string;
          email: string;
          id?: string;
          job_type: string;
          lead_number?: string;
          notes?: string | null;
          phone: string;
          project_description?: string | null;
          property_address: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          customer_name?: string;
          email?: string;
          id?: string;
          job_type?: string;
          lead_number?: string;
          notes?: string | null;
          phone?: string;
          project_description?: string | null;
          property_address?: string;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leads_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["admin_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      proposal_line_items: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          proposal_id: string;
          quantity: number;
          sort_order: number;
          total_cents: number;
          unit_price_cents: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          proposal_id: string;
          quantity?: number;
          sort_order?: number;
          total_cents?: number;
          unit_price_cents?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          proposal_id?: string;
          quantity?: number;
          sort_order?: number;
          total_cents?: number;
          unit_price_cents?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_line_items_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          }
        ];
      };
      proposals: {
        Row: {
          accepted_at: string | null;
          created_at: string;
          created_by: string | null;
          customer_response_ip: string | null;
          expiration_date: string;
          id: string;
          lead_id: string;
          proposal_date: string;
          proposal_number: string;
          public_token: string;
          public_token_expires_at: string | null;
          rejected_at: string | null;
          scope_of_work: string;
          status: Database["public"]["Enums"]["proposal_status"];
          subtotal_cents: number;
          total_cents: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          customer_response_ip?: string | null;
          expiration_date: string;
          id?: string;
          lead_id: string;
          proposal_date?: string;
          proposal_number?: string;
          public_token?: string;
          public_token_expires_at?: string | null;
          rejected_at?: string | null;
          scope_of_work: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          subtotal_cents?: number;
          total_cents?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          customer_response_ip?: string | null;
          expiration_date?: string;
          id?: string;
          lead_id?: string;
          proposal_date?: string;
          proposal_number?: string;
          public_token?: string;
          public_token_expires_at?: string | null;
          rejected_at?: string | null;
          scope_of_work?: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          subtotal_cents?: number;
          total_cents?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proposals_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proposals_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      admin_role: "admin";
      invoice_status: "draft" | "sent" | "paid";
      job_status: "active" | "final_payment_due" | "completed";
      lead_status: "new" | "contacted" | "proposal_drafted" | "closed";
      proposal_status: "draft" | "pending" | "accepted" | "rejected";
    };
    CompositeTypes: Record<string, never>;
  };
};
