import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 20,
  height: 20,
  ...props,
});

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />
  </svg>
);

export const CartIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5h2l1.6 10.2a1.6 1.6 0 0 0 1.6 1.4h7.9a1.6 1.6 0 0 0 1.6-1.3L20 8H6.2" />
    <circle cx="10" cy="20" r="1.2" />
    <circle cx="17.5" cy="20" r="1.2" />
  </svg>
);

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const ArrowLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const TrashIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M9 7V5h6v2M6.5 7l.8 12.1A1.6 1.6 0 0 0 8.9 20.6h6.2a1.6 1.6 0 0 0 1.6-1.5L17.5 7" />
  </svg>
);

export const FilterIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7h10v10H3zM13 10h4l3 3v4h-7z" />
    <circle cx="7" cy="18.5" r="1.4" />
    <circle cx="17" cy="18.5" r="1.4" />
  </svg>
);

export const ReturnIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 10a8 8 0 1 1 1.6 6" />
    <path d="M4 4v6h6" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5 19 6v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const SupportIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
    <path d="M5 13h2.2v5H6a2 2 0 0 1-2-2v-1.5A1.5 1.5 0 0 1 5 13ZM19 13h-2.2v5H18a2 2 0 0 0 2-2v-1.5a1.5 1.5 0 0 0-1-1.5Z" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg
    {...base(p)}
    strokeWidth={1.2}
    fill={filled ? "currentColor" : "none"}
    width={p.width ?? 14}
    height={p.height ?? 14}
  >
    <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.3L12 16.1 7.4 18.6l.9-5.3L4.5 9.6l5.2-.7z" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" />
  </svg>
);

export const TelegramIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 5 3.5 11.6l4.9 1.6L20 6.5l-9 8.4.3 4.1 2.6-3.2 3.6 2.7z" />
  </svg>
);

export const YoutubeIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="12" rx="3.5" />
    <path d="m11 9.8 3.8 2.2-3.8 2.2z" fill="currentColor" />
  </svg>
);

export const ZoomIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M11 8.5v5M8.5 11h5M20 20l-4-4" />
  </svg>
);

export const PlayIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m10.5 9 5 3-5 3z" fill="currentColor" />
  </svg>
);

export const SpinnerIcon = (p: P) => (
  <svg {...base(p)} className={`animate-spin ${p.className ?? ""}`}>
    <path d="M12 4a8 8 0 1 0 8 8" />
  </svg>
);
