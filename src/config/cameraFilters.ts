export type CameraFilter = {
  id: string;
  name: string;
  icon: string;
  description?: string;
  cssFilter: string; // The CSS filter string to apply to the video/canvas
};

export const CAMERA_FILTERS: CameraFilter[] = [
  {
    id: "normal",
    name: "Normal",
    icon: "📷",
    cssFilter: "none",
  },
  {
    id: "soft_dream",
    name: "Soft Dream",
    icon: "✨",
    cssFilter: "brightness(1.1) contrast(0.95) saturate(1.1) sepia(0.1)",
  },
  {
    id: "lavender",
    name: "Lavender",
    icon: "🌸",
    cssFilter: "brightness(1.05) contrast(0.9) hue-rotate(45deg) saturate(1.2)",
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    icon: "💕",
    cssFilter: "brightness(1.1) contrast(1.05) hue-rotate(330deg) saturate(1.3)",
  },
  {
    id: "vintage_diary",
    name: "Vintage",
    icon: "📻",
    cssFilter: "sepia(0.4) contrast(0.85) brightness(1.1) saturate(1.2)",
  },
  {
    id: "sunshine",
    name: "Sunshine",
    icon: "☀️",
    cssFilter: "brightness(1.15) contrast(1.1) saturate(1.4) sepia(0.2)",
  },
  {
    id: "midnight",
    name: "Midnight",
    icon: "🌙",
    cssFilter: "brightness(0.9) contrast(1.2) saturate(0.8) hue-rotate(200deg)",
  },
  {
    id: "black_white",
    name: "B&W",
    icon: "🎞",
    cssFilter: "grayscale(1) contrast(1.2)",
  },
  {
    id: "chaos",
    name: "Chaos",
    icon: "🌈",
    cssFilter: "hue-rotate(90deg) saturate(2) contrast(1.5)",
  }
];
