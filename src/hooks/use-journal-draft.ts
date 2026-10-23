"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mood, JournalDraft } from "@/types";
import {
  getAllDrafts,
  getDraft,
  getDraftByEditMemoryId,
  saveDraft as persistDraft,
  deleteDraft,
  DRAFTS_UPDATED_EVENT,
} from "@/lib/drafts";

interface UseJournalDraftOptions {
  draftId?: string | null;
  editId?: string | null;
  values: {
    title: string;
    description: string;
    mood?: Mood;
    memoryDate: string;
    location: string;
  };
  onRestore: (draft: JournalDraft) => void;
  isInitialLoading?: boolean;
}

export type DraftStatus = "idle" | "saving" | "saved";

export function useJournalDraft({
  draftId: initialDraftId,
  editId,
  values,
  onRestore,
  isInitialLoading = false,
}: UseJournalDraftOptions) {
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialDraftId || null);
  const [status, setStatus] = useState<DraftStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [restoredDraft, setRestoredDraft] = useState<JournalDraft | null>(null);
  const [hasCheckedRestore, setHasCheckedRestore] = useState(false);
  const [draftsCount, setDraftsCount] = useState<number>(0);

  const isDirtyRef = useRef(false);
  const isFirstMountRef = useRef(true);
  const latestValuesRef = useRef(values);
  latestValuesRef.current = values;

  // Sync drafts count from storage
  const refreshDraftsCount = useCallback(() => {
    const list = getAllDrafts();
    setDraftsCount(list.length);
  }, []);

  useEffect(() => {
    refreshDraftsCount();
    const handleUpdate = () => refreshDraftsCount();
    window.addEventListener(DRAFTS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(DRAFTS_UPDATED_EVENT, handleUpdate);
  }, [refreshDraftsCount]);

  // Initial restoration check on mount
  useEffect(() => {
    if (isInitialLoading) return;
    if (hasCheckedRestore) return;

    try {
      let draftToRestore: JournalDraft | null = null;

      if (initialDraftId) {
        draftToRestore = getDraft(initialDraftId);
      } else if (editId) {
        draftToRestore = getDraftByEditMemoryId(editId);
      }

      if (draftToRestore) {
        const hasContent = Boolean(
          draftToRestore.title?.trim() ||
          draftToRestore.description?.trim() ||
          draftToRestore.location?.trim() ||
          draftToRestore.mood
        );

        if (hasContent) {
          setCurrentDraftId(draftToRestore.id);
          onRestore(draftToRestore);
          setRestoredDraft(draftToRestore);
          setLastSaved(new Date(draftToRestore.updatedAt));
          setStatus("saved");
        }
      }
    } catch (e) {
      console.warn("Failed to check draft restoration:", e);
    } finally {
      setHasCheckedRestore(true);
    }
  }, [initialDraftId, editId, isInitialLoading, hasCheckedRestore, onRestore]);

  // Actual save routine
  const executeSave = useCallback(() => {
    const currentValues = latestValuesRef.current;
    const hasContent = Boolean(
      currentValues.title?.trim() ||
      currentValues.description?.trim() ||
      currentValues.location?.trim() ||
      currentValues.mood
    );

    if (!hasContent) {
      setStatus("idle");
      return;
    }

    setStatus("saving");

    const id = currentDraftId || `draft_${Date.now()}`;
    if (!currentDraftId) {
      setCurrentDraftId(id);
    }

    const saved = persistDraft({
      id,
      title: currentValues.title,
      description: currentValues.description,
      mood: currentValues.mood,
      memoryDate: currentValues.memoryDate,
      location: currentValues.location,
      editMemoryId: editId || undefined,
    });

    isDirtyRef.current = false;
    setLastSaved(new Date(saved.updatedAt));
    setStatus("saved");
  }, [currentDraftId, editId]);

  // Mark dirty when values change
  useEffect(() => {
    if (isInitialLoading || !hasCheckedRestore) return;

    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    const hasContent = Boolean(
      values.title?.trim() ||
      values.description?.trim() ||
      values.location?.trim() ||
      values.mood
    );

    if (hasContent) {
      isDirtyRef.current = true;
      setStatus((prev) => (prev === "saved" ? "idle" : prev));
    }
  }, [values, isInitialLoading, hasCheckedRestore]);

  // Periodic Auto-Save Every 10 Seconds (10000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirtyRef.current) {
        executeSave();
      }
    }, 10000); // Save after every 10 seconds if changes were made

    return () => clearInterval(interval);
  }, [executeSave]);

  // Manual save trigger
  const saveDraftNow = useCallback(() => {
    executeSave();
  }, [executeSave]);

  // Delete current draft from storage (e.g. discard)
  const discardCurrentDraft = useCallback(() => {
    if (currentDraftId) {
      deleteDraft(currentDraftId);
    }
    isDirtyRef.current = false;
    setCurrentDraftId(null);
    setStatus("idle");
    setLastSaved(null);
    setRestoredDraft(null);
  }, [currentDraftId]);

  // Clear draft on publish
  const clearDraft = useCallback(() => {
    if (currentDraftId) {
      deleteDraft(currentDraftId);
    }
    isDirtyRef.current = false;
    setCurrentDraftId(null);
    setStatus("idle");
    setLastSaved(null);
    setRestoredDraft(null);
  }, [currentDraftId]);

  const dismissRestoredNotice = useCallback(() => {
    setRestoredDraft(null);
  }, []);

  return {
    currentDraftId,
    status,
    lastSaved,
    restoredDraft,
    draftsCount,
    saveDraftNow,
    clearDraft,
    discardCurrentDraft,
    dismissRestoredNotice,
  };
}
