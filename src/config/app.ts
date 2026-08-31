/**
 * ==========================================
 * MASTER APP LAUNCH CONFIGURATION
 * ==========================================
 * 
 * TRAILER_MODE = true: 
 *   - Roots to Trailer. 
 *   - All journal functionality (/journal, /gallery, etc.) is strictly locked via middleware.
 * 
 * TRAILER_MODE = false:
 *   - Roots to the Main Journal App Dashboard.
 *   - All functionality is unlocked (requires authentication).
 */
export const TRAILER_MODE: boolean = true;
