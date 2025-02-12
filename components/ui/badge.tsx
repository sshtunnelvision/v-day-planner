import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export function Badge({
  children,
  onClick,
  isSelected,
  className,
}: BadgeProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
