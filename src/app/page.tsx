import { TRAILER_MODE } from "@/config/app";
import TrailerPage from "./trailer/page";
import { getMemories } from "./actions/journal";
import { ClientHome } from "./client-home";
import { WALKTHROUGH_CONTENT } from "@/config/walkthrough";

export default async function RootPage() {
  if (TRAILER_MODE) {
    return <TrailerPage />;
  }
  
  const memories = await getMemories();
  
  // Get user profile if needed, or just use config name
  // For now we'll use the gift config name for that personal touch
  const userName = WALKTHROUGH_CONTENT.metadata.name || "Jane";
  
  return <ClientHome memories={memories} userName={userName} />;
}
