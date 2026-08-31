import { SectionOpening } from "@/components/trailer/section-opening";
import { SectionWhoYouAre } from "@/components/trailer/section-who-you-are";
import { SectionLittleThings } from "@/components/trailer/section-little-things";
import { SectionMemories } from "@/components/trailer/section-memories";
import { SectionJournalReveal } from "@/components/trailer/section-journal-reveal";

export default function TrailerPage() {
  return (
    <main className="w-full bg-[#FDFCF8] text-[#3F3931] overflow-x-hidden font-sans">
      <SectionOpening />
      <SectionWhoYouAre />
      <SectionLittleThings />
      <SectionMemories />
      <SectionJournalReveal />
    </main>
  );
}
