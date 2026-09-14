"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { deleteMemory } from "@/app/actions/journal";

export function JournalOptions({ id }: { id: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/journal/new?edit=${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this cute memory? 🥺")) return;
    setIsDeleting(true);
    try {
      await deleteMemory(id);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <IconButton 
        variant="ghost" 
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting}
      >
        <MoreVertical className="w-5 h-5" />
      </IconButton>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border/50 rounded-xl shadow-paper overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
          >
            <Edit2 className="w-4 h-4 text-primary" />
            Edit Memory
          </button>
          <div className="h-px w-full bg-border/50" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors text-left"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
