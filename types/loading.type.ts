export type LoadingVariant = "progress" | "dot-wave" | "letter-drop" | "bracket-scan";

export interface LoadingScreenProps {
  variant?: LoadingVariant;
  /** Override the display name shown in the loader */
  name?: string;
  /** Override the accent label (e.g. "safdila") */
  accent?: string;
  /** Subtitle shown beneath the name */
  subtitle?: string;
  /** Fires when the exit animation completes */
  onComplete?: () => void;
  /** Force-hide the loader (triggers exit animation) */
  isLoaded?: boolean;
}
