import { motion } from "framer-motion";
import type { SupabaseCategory } from "@/hooks/useCategories";

interface CategoryFilterProps {
  categories: SupabaseCategory[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
          selected === null
            ? "bg-foreground text-background"
            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
        }`}
      >
        Semua
      </button>
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          onClick={() => onSelect(cat.id === selected ? null : cat.id)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            selected === cat.id
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
