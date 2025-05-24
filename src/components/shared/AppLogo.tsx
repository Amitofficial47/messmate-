import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface AppLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function AppLogo({
  size = 24,
  className,
  showText = true,
}: AppLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-primary ${className}`}
    >
      <UtensilsCrossed size={size} strokeWidth={2.5} />
      {showText && <span className="text-xl font-bold">MessMate</span>}
    </Link>
  );
}
