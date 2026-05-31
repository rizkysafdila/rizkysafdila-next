import { Tables } from "@/types/database.types";

// Row shape from the `careers` table (Supabase generated types).
export type CareerEntry = Tables<"careers">;

export interface CareerStats {
  label: string;
  value: string;
  suffix?: string;
}
