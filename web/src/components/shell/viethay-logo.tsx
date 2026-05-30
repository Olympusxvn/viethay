import { cn } from "@/lib/utils";

export function VietHayLogo({
  size = "md",
  showText = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}) {
  const box =
    size === "sm" ? "size-8 rounded-xl" : size === "lg" ? "size-14 rounded-2xl" : "size-10 rounded-xl";
  const icon = size === "sm" ? 20 : size === "lg" ? 34 : 26;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          box,
          "flex items-center justify-center bg-gradient-to-br from-[#ff4d4d] via-[#ff8a3d] to-[#ffd15c] shadow-lg shadow-[#ff4d4d]/25"
        )}
      >
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 34 34"
          fill="none"
          aria-hidden
        >
          <path
            d="M7 7L17 27L27 7"
            stroke="rgba(11,13,18,.92)"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 9.5C12 6.5 8.5 5 6.5 7"
            stroke="rgba(11,13,18,.92)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M21 9.5C22 6.5 25.5 5 27.5 7"
            stroke="rgba(11,13,18,.92)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="5.6" cy="7.8" r="1.7" fill="rgba(11,13,18,.92)" />
          <circle cx="28.4" cy="7.8" r="1.7" fill="rgba(11,13,18,.92)" />
        </svg>
      </div>
      {showText && (
        <div>
          <div className="font-semibold tracking-tight text-[#f5f5f7]">VietHay</div>
          {size !== "sm" && (
            <div className="text-xs text-[#e9eaf2]/60">AI Video Marketing</div>
          )}
        </div>
      )}
    </div>
  );
}
