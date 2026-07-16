interface BreathingLogoProps {
  size?: number;
  className?: string;
}

/**
 * The app's signature element: a soft dot that "breathes" on a slow
 * 3.2s cycle — the same visual metaphor used both as the tiny brand
 * mark and as the typing indicator, so the calm-breathing idea is
 * something the user actually feels, not just reads about.
 */
export function BreathingLogo({ size = 28, className = "" }: BreathingLogoProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0 rounded-full bg-sage-300 animate-breathe"
        style={{ animationDelay: "-1.6s" }}
      />
      <span className="relative rounded-full bg-sage-500" style={{ width: size * 0.55, height: size * 0.55 }} />
    </span>
  );
}
