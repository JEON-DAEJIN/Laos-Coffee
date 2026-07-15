type BadgeVariant = "best" | "new" | "default";

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  best: "bg-amber-700 text-white",
  new: "bg-emerald-700 text-white",
  default: "bg-zinc-100 text-zinc-600",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
