export const CAMERA_PROMPTS = [
  "Take a photo of something that made you smile today.",
  "Show me today's little win ✨",
  "What's your view right now?",
  "Capture something ordinary.",
  "Proof you survived today 😂",
  "What's making today feel nice?",
  "Take a completely unnecessary photo. You deserve it.",
];

export function getRandomPrompt(): string {
  return CAMERA_PROMPTS[Math.floor(Math.random() * CAMERA_PROMPTS.length)];
}
