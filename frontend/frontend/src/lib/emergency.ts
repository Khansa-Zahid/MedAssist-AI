import type { EmergencyRegion } from "../types";

// UK: 999 is the general emergency number (ambulance/police/fire).
// UAE: 998 is specifically ambulance; 999 is police. We default to
// 998 here since this app's context is health/medical emergencies.
export const EMERGENCY_NUMBERS: Record<EmergencyRegion, string> = {
  uk: "999",
  uae: "998",
};
