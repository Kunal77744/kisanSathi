import React from "react";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function PMKisanIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />
      
      {/* Soil */}
      <path d="M20 120 C 60 115, 140 125, 180 120" stroke="#774032" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 125 C 70 122, 130 128, 170 125" stroke="#a86958" strokeWidth="4" strokeLinecap="round" />

      {/* Growing Plant */}
      <path d="M100 120 V 70" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
      {/* Leaf 1 */}
      <path d="M100 95 C 80 90, 75 75, 80 70 C 85 75, 95 85, 100 95Z" fill="#15803d" />
      {/* Leaf 2 */}
      <path d="M100 85 C 120 80, 125 65, 120 60 C 115 65, 105 75, 100 85Z" fill="#15803d" />
      {/* Leaf 3 (Top) */}
      <path d="M100 70 C 90 55, 100 45, 100 45 C 100 45, 110 55, 100 70Z" fill="#22c55e" />

      {/* Coins falling */}
      <circle cx="65" cy="55" r="10" fill="#ca8a04" />
      <circle cx="65" cy="55" r="7" fill="#facc15" />
      <path d="M62 55 H 68 M65 52 V 58" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />

      <circle cx="135" cy="45" r="12" fill="#ca8a04" />
      <circle cx="135" cy="45" r="9" fill="#facc15" />
      <path d="M131 45 H 139 M135 41 V 49" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />

      <circle cx="100" cy="30" r="8" fill="#ca8a04" />
      <circle cx="100" cy="30" r="5" fill="#facc15" />
    </svg>
  );
}

export function PMFBYIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />

      {/* Cloud & Rain (The Risk) */}
      <path d="M50 55 C 50 45, 65 40, 75 48 C 83 40, 98 42, 100 52 C 108 52, 112 60, 105 66 C 100 70, 50 70, 50 55Z" fill="#cbd5e1" className="dark:fill-stone-800" />
      {/* Raindrops */}
      <line x1="60" y1="75" x2="55" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="80" y1="78" x2="75" y2="88" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="75" x2="95" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Plant under protection */}
      <path d="M130 110 V 85" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
      <path d="M130 98 C 120 95, 115 88, 120 85 C 122 88, 128 93, 130 98Z" fill="#15803d" />
      <path d="M130 90 C 140 87, 142 80, 138 77 C 136 80, 132 85, 130 90Z" fill="#15803d" />

      {/* Protective Golden Shield */}
      <path
        d="M100 115 C 115 105, 150 95, 150 65 V 45 L 100 30 L 50 45 V 65 C 50 95, 85 105, 100 115Z"
        stroke="#ca8a04"
        strokeWidth="5"
        strokeLinejoin="round"
        className="animate-pulse"
      />
      <path
        d="M100 107 C 112 98, 140 90, 140 65 V 50 L 100 37 L 60 50 V 65 C 60 90, 88 98, 100 107Z"
        fill="#ca8a04"
        fillOpacity="0.1"
      />
    </svg>
  );
}

export function KCCIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#fbf9f4" className="dark:fill-stone-900/50" />

      {/* Two Coins behind card */}
      <circle cx="140" cy="50" r="16" fill="#ca8a04" />
      <circle cx="140" cy="50" r="12" fill="#facc15" />
      <circle cx="60" cy="110" r="14" fill="#ca8a04" />
      <circle cx="60" cy="110" r="10" fill="#facc15" />

      {/* Credit Card Graphic */}
      <g transform="rotate(-10 100 75)">
        <rect x="40" y="45" width="120" height="75" rx="10" fill="#15803d" stroke="#166534" strokeWidth="3" />
        {/* Card details / Chip */}
        <rect x="52" y="60" width="18" height="14" rx="3" fill="#facc15" />
        {/* Card lines */}
        <rect x="52" y="85" width="50" height="6" rx="2" fill="#a7f3d0" fillOpacity="0.4" />
        <rect x="52" y="97" width="30" height="6" rx="2" fill="#a7f3d0" fillOpacity="0.4" />
        {/* Contactless indicator */}
        <path d="M140 60 C 143 63, 143 67, 140 70 M 144 57 C 149 61, 149 69, 144 73" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
        {/* Leaf Emblem on Card */}
        <path d="M125 105 C 135 105, 140 95, 138 85 C 130 90, 125 98, 125 105Z" fill="#4ade80" />
      </g>
    </svg>
  );
}

export function SoilHealthIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />

      {/* Soil layers at bottom */}
      <path d="M25 125 H 175 V 135 H 25 Z" fill="#774032" />
      <path d="M25 115 C 60 118, 140 112, 175 115 V 125 H 25 Z" fill="#a86958" />

      {/* Lab Beaker / Flask */}
      <path d="M80 50 H 120 M 95 50 V 70 L 65 110 H 135 L 105 70 V 50" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Liquid inside Beaker */}
      <path d="M72 100 C 85 98, 115 102, 128 100 L 132 106 H 68 Z" fill="#15803d" fillOpacity="0.8" />

      {/* Sparkles / Science stars */}
      <path d="M55 45 L 57 50 L 62 52 L 57 54 L 55 59 L 53 54 L 48 52 L 53 50 Z" fill="#ca8a04" />
      <path d="M145 75 L 147 78 L 152 80 L 147 82 L 145 85 L 143 82 L 138 80 L 143 78 Z" fill="#ca8a04" />

      {/* Leaf growing from the science flask */}
      <path d="M100 50 C 100 30, 115 20, 115 20 C 115 20, 105 35, 100 50Z" fill="#22c55e" />
      <path d="M100 42 C 100 25, 88 15, 88 15 C 88 15, 95 30, 100 42Z" fill="#16a34a" />
    </svg>
  );
}

export function PMKUSUMIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#fbf9f4" className="dark:fill-stone-900/50" />

      {/* Sun */}
      <circle cx="150" cy="45" r="20" fill="#ca8a04" className="animate-spin-slow" />
      <circle cx="150" cy="45" r="16" fill="#facc15" />
      {/* Sun Rays */}
      <path d="M150 15 V 21 M150 69 V 75 M120 45 H 126 M174 45 H 180" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />

      {/* Solar Panel grid */}
      <g transform="skewX(-15) translate(40 40)">
        <rect x="25" y="45" width="70" height="40" rx="4" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="3" />
        {/* Panel lines */}
        <line x1="60" y1="45" x2="60" y2="85" stroke="#60a5fa" strokeWidth="2" />
        <line x1="25" y1="58" x2="95" y2="58" stroke="#60a5fa" strokeWidth="1.5" />
        <line x1="25" y1="71" x2="95" y2="71" stroke="#60a5fa" strokeWidth="1.5" />
      </g>

      {/* Water pump and pipe */}
      <rect x="35" y="100" width="30" height="25" rx="5" fill="#475569" />
      <path d="M50 100 V 85 H 110 V 110" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
      
      {/* Water droplets */}
      <path d="M110 118 C 110 122, 107 125, 105 125 C 103 125, 100 122, 110 118Z" fill="#3b82f6" />
      <path d="M118 120 C 118 124, 115 127, 113 127 C 111 127, 108 124, 118 120Z" fill="#3b82f6" />
    </svg>
  );
}

export function ENAMIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background shape */}
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />

      {/* Harvest basket */}
      <path d="M120 120 H 170 L 175 90 H 115 Z" fill="#a86958" />
      {/* Grain/Fruit circles in basket */}
      <circle cx="130" cy="88" r="10" fill="#ca8a04" />
      <circle cx="145" cy="85" r="12" fill="#eab308" />
      <circle cx="160" cy="88" r="10" fill="#ca8a04" />

      {/* Mobile trading screen */}
      <rect x="35" y="35" width="60" height="100" rx="10" fill="#475569" stroke="#334155" strokeWidth="4" />
      {/* Screen area */}
      <rect x="40" y="42" width="50" height="75" rx="4" fill="#ffffff" className="dark:fill-stone-950" />
      
      {/* Line Chart on screen */}
      <path d="M45 100 L 55 85 L 68 90 L 80 65 L 85 70" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="65" r="3" fill="#22c55e" />

      {/* Digital checkmark symbol */}
      <circle cx="95" cy="40" r="12" fill="#22c55e" />
      <path d="M91 40 L 94 43 L 100 37" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
