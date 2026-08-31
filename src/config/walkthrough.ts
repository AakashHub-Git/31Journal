export interface WalkthroughSlide {
  text: string;
  image?: string;
  caption?: string;
}

export interface WalkthroughConfig {
  metadata: {
    name: string;
    launchDate: string;
  };

  // Section 1: The Opening Hero
  hero: {
    greeting: string;
    subtext: string;
    coverPhoto: string; // High quality portrait or favorite memory
  };

  // Section 2: Her Traits / Personality
  personality: {
    title: string;
    items: WalkthroughSlide[];
  };

  // Section 3: The Little Things she loves
  littleThings: {
    title: string;
    items: WalkthroughSlide[];
  };

  // Section 4: Highlighted Memories
  memories: {
    title: string;
    items: WalkthroughSlide[];
  };

  // Section 6: The Final Invitation to the app
  closing: {
    message: string;
    buttonText: string;
    finalPhoto: string;
  };
}

export const WALKTHROUGH_CONTENT: WalkthroughConfig = {
  metadata: {
    name: "Sweety", // Replace with her name
    launchDate: "August 31, 2026",
  },

  hero: {
    greeting: "Welcome to your digital space.",
    subtext: "A quiet corner for your thoughts, photos, and life's little moments.",
    coverPhoto: "/images/IMG_20251224_160345.jpg",
    // Replace with a beautiful landscape or portrait
  },

  personality: {
    title: "Who you are.",
    items: [
      {
        text: "You always notice the quiet beauty in everyday things.",
        image: "/images/PXL_20250926_141541164.MP~2.jpg",
      },
      {
        text: "You have a smile that makes the whole room brighter.",
        image: "/images/IMG_20251218_144337.jpg",
      },
      {
        text: "You care deeply about the people you love.",
        image: "/images/PXL_20251222_100857564.jpg",
      }
    ]
  },

  littleThings: {
    title: "The little things.",
    items: [
      {
        text: "Quiet mornings with a warm cup of coffee.",
        image: "/images/PXL_20251218_155133753~2.jpg",
      },
      {
        text: "Sunsets that paint the sky in impossible colors.",
        image: "/images/PXL_20251223_114312303.MP.jpg",
      },
      {
        text: "Late night conversations about everything and nothing.",
        image: "/images/PXL_20251225_065420023.jpg",
      },
      {
        text: "Getting lost in a really good book.",
        image: "/images/PXL_20251221_055349559~2.jpg",
      }
    ]
  },

  memories: {
    title: "Your memories.",
    items: [
      {
        image: "/images/PXL_20251218_152800373_exported_339_1766749827928~2.jpg",
        caption: "The trip to the Manali.",
        text: "December 2025"
      },
      {
        image: "/images/PXL_20251223_170020842.NIGHT~2.jpg",
        caption: "That perfect Amritsar Night.",
        text: "December 2025"
      },
      {
        image: "/images/PXL_20251215_215853987~2.jpg",
        caption: "Celebrating your Sleep.",
        text: "December 2025"
      }
    ]
  },

  closing: {
    message: "Every day with you is a page worth saving. Here's to all the memories we haven't made yet. This journal is yours.",
    buttonText: "Open your journal",
    finalPhoto: "/images/IMG_20251221_130830.jpg",
  }
};
