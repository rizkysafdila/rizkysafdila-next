/**
 * Lat/lng lookup for `careers.location` values (Supabase stores them as plain text).
 * Add a row here when a new location shows up — unknown locations are skipped on the globe.
 */
export const LOCATION_COORDS: Record<string, [number, number]> = {
  "Bandung, Indonesia": [-6.9175, 107.6191],
  "Jakarta, Indonesia": [-6.2088, 106.8456],
}
