import { StarIcon } from "./icons";
import { cx, ratingToStars } from "@/lib/format";

export function Stars({
  rating,
  size = 13,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const value = ratingToStars(rating);
  return (
    <span className={cx("inline-flex items-center gap-[2px]", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          width={size}
          height={size}
          filled={i <= Math.round(value)}
          className={i <= Math.round(value) ? "text-[#111]" : "text-[#c9c9cd]"}
        />
      ))}
    </span>
  );
}
