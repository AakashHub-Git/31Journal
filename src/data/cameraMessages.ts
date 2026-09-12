export const CAMERA_MESSAGES = {
  open: [
    "Okayyy, camera time 📸",
    "Let's capture this moment ✨",
    "Evidence that today happened.",
    "Ready for your closeup? 👀",
  ],
  postCapture: [
    "Hmm... this one is cute.",
    "Okay model 😭",
    "Wait, this is actually adorable.",
    "Saving this moment 📸",
    "10/10 diary material.",
    "Should we keep this one? 👀",
  ],
  denied: [
    "Looks like the camera is taking a little nap 😴",
    "No camera access? That's okay!",
  ]
};

export function getRandomMessage(type: keyof typeof CAMERA_MESSAGES): string {
  const messages = CAMERA_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
}
