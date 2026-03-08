import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { SalesProfile } from "@/hooks/useSalesProfile";

interface SalesCardProps {
  sales: SalesProfile;
}

export default function SalesCard({ sales }: SalesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary overflow-hidden">
        <img
          src={sales.photo}
          alt={sales.name}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h2 className="truncate text-base font-semibold text-foreground">
            {sales.name}
          </h2>
          <BadgeCheck className="h-4 w-4 shrink-0 text-whatsapp" />
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          {sales.role}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {sales.bio}
        </p>
      </div>
    </motion.div>
  );
}
