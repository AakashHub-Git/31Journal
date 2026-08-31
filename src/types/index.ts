export type Mood = "happy" | "calm" | "sad" | "anxious" | "excited" | "reflective" | "tired";

export interface Photo {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  dateAdded: string;
}

export interface Location {
  name: string;
  lat?: number;
  lng?: number;
}

export interface BaseMemory {
  id: string;
  date: string;
  title?: string;
  description?: string;
  photos?: Photo[];
  mood?: Mood;
  location?: Location;
  tags?: string[];
  isFavorite?: boolean;
}

export interface JournalEntry extends BaseMemory {
  content: string; // The full text of the journal entry
}

export interface Memory extends BaseMemory {
  title: string; // A memory must have a title
  coverPhoto?: Photo; // Optional specific cover photo, otherwise first from `photos`
  relatedEntries?: string[]; // IDs of related journal entries
}

export interface StoryChapter {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  coverPhoto: Photo;
  summary: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string; // e.g. "0:30"
  dateAdded: string;
}

export interface BirthdayMessage {
  id: string;
  title: string;
  message: string;
  date: string;
  photos?: Photo[];
  videos?: Video[];
}

export interface OpenWhenLetter {
  id: string;
  trigger: string; // e.g. "Open when you miss me"
  message: string;
  photos?: Photo[];
  isOpened: boolean;
}

export interface RelationshipMemory extends Memory {
  anniversaryYear?: number;
  specialSignificance?: string;
}
