import { JournalDraft } from "@/types";

const DRAFTS_STORAGE_KEY = "journal_drafts_v1";
const LEGACY_DRAFT_KEY = "journal_draft_new";

export const DRAFTS_UPDATED_EVENT = "journal_drafts_updated";

function notifyDraftsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DRAFTS_UPDATED_EVENT));
  }
}

/**
 * Retrieve all saved drafts from localStorage, sorted by newest updatedAt first.
 */
export function getAllDrafts(): JournalDraft[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    let drafts: JournalDraft[] = raw ? JSON.parse(raw) : [];

    // Check for legacy single-draft key and migrate if present
    const legacy = localStorage.getItem(LEGACY_DRAFT_KEY);
    if (legacy) {
      try {
        const legacyData = JSON.parse(legacy);
        const hasContent = Boolean(
          legacyData.title?.trim() ||
          legacyData.description?.trim() ||
          legacyData.location?.trim() ||
          legacyData.mood
        );

        if (hasContent) {
          const migratedDraft: JournalDraft = {
            id: `draft_${legacyData.updatedAt || Date.now()}`,
            title: legacyData.title || "",
            description: legacyData.description || "",
            mood: legacyData.mood,
            memoryDate: legacyData.memoryDate || new Date().toISOString().split("T")[0],
            location: legacyData.location || "",
            createdAt: legacyData.updatedAt || Date.now(),
            updatedAt: legacyData.updatedAt || Date.now(),
          };

          // Avoid duplicate if already migrated
          if (!drafts.some((d) => d.id === migratedDraft.id)) {
            drafts.unshift(migratedDraft);
            localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
          }
        }
      } catch {
        // Ignore parse error on legacy
      }
      localStorage.removeItem(LEGACY_DRAFT_KEY);
    }

    return drafts.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (e) {
    console.warn("Failed to load drafts from localStorage:", e);
    return [];
  }
}

/**
 * Retrieve a specific draft by its ID.
 */
export function getDraft(id: string): JournalDraft | null {
  if (typeof window === "undefined" || !id) return null;
  const drafts = getAllDrafts();
  return drafts.find((d) => d.id === id) || null;
}

/**
 * Find a draft associated with editing a specific memory.
 */
export function getDraftByEditMemoryId(editMemoryId: string): JournalDraft | null {
  if (typeof window === "undefined" || !editMemoryId) return null;
  const drafts = getAllDrafts();
  return drafts.find((d) => d.editMemoryId === editMemoryId) || null;
}

/**
 * Save or update a draft in localStorage.
 */
export function saveDraft(
  data: Omit<JournalDraft, "createdAt" | "updatedAt"> & {
    createdAt?: number;
    updatedAt?: number;
  }
): JournalDraft {
  const drafts = getAllDrafts();
  const now = Date.now();
  const existingIndex = drafts.findIndex((d) => d.id === data.id);

  let updatedDraft: JournalDraft;

  if (existingIndex >= 0) {
    updatedDraft = {
      ...drafts[existingIndex],
      ...data,
      updatedAt: now,
    };
    drafts[existingIndex] = updatedDraft;
  } else {
    updatedDraft = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };
    drafts.unshift(updatedDraft);
  }

  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    notifyDraftsUpdated();
  } catch (e) {
    console.warn("Failed to persist draft to localStorage:", e);
  }

  return updatedDraft;
}

/**
 * Delete a specific draft by ID.
 */
export function deleteDraft(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const drafts = getAllDrafts().filter((d) => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    notifyDraftsUpdated();
  } catch (e) {
    console.warn("Failed to delete draft from localStorage:", e);
  }
}

/**
 * Delete draft associated with an edit memory ID after save.
 */
export function clearDraftForMemory(memoryId: string): void {
  if (typeof window === "undefined" || !memoryId) return;
  const draft = getDraftByEditMemoryId(memoryId);
  if (draft) {
    deleteDraft(draft.id);
  }
}
