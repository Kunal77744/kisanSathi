import React from "react";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function RainCloudIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />
      
      {/* Sun behind cloud */}
      <circle cx="130" cy="55" r="18" fill="#eab308" />
      
      {/* Dry cracked soil */}
      <path d="M20 120 H 180" stroke="#774032" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 120 L 60 135 M90 120 L 85 130 M130 120 L 140 138" stroke="#a86958" strokeWidth="2" />

      {/* Cloud */}
      <path d="M50 80 C 50 68, 65 62, 75 70 C 83 62, 98 64, 100 75 C 108 75, 112 85, 105 92 C 100 97, 50 97, 50 80Z" fill="#cbd5e1" className="dark:fill-stone-700" />
      
      {/* Weak raindrops */}
      <line x1="60" y1="104" x2="57" y2="112" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="106" x2="82" y2="114" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CoinsIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />

      {/* Money bag */}
      <path d="M80 115 C 70 115, 60 100, 60 85 C 60 65, 75 60, 100 60 C 125 60, 140 65, 140 85 C 140 100, 130 115, 120 115 Z" fill="#15803d" />
      {/* Tie */}
      <path d="M85 65 Q 100 70 115 65" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />

      {/* Rupee Symbol on bag */}
      <path d="M93 78 H 107 M93 84 H 107 M100 78 V 95 M100 84 C 105 84, 107 88, 107 92" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

      {/* Falling Coins */}
      <circle cx="65" cy="40" r="10" fill="#ca8a04" />
      <circle cx="65" cy="40" r="7" fill="#facc15" />
      
      <circle cx="135" cy="45" r="12" fill="#ca8a04" />
      <circle cx="135" cy="45" r="9" fill="#facc15" />
    </svg>
  );
}

export function AdvisoryIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="200" height="150" rx="24" fill="#fbf9f4" className="dark:fill-stone-900/50" />

      {/* Clipboard */}
      <rect x="65" y="40" width="70" height="90" rx="8" fill="#ffffff" stroke="#475569" strokeWidth="3" className="dark:fill-stone-950" />
      <rect x="85" y="32" width="30" height="12" rx="3" fill="#64748b" />

      {/* Checklist Lines */}
      <line x1="80" y1="65" x2="120" y2="65" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="80" x2="120" y2="80" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="95" x2="110" y2="95" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

      {/* Checkmarks */}
      <path d="M74 65 L 76 67 L 80 63" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 80 L 76 82 L 80 78" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M74 95 L 76 97 L 80 93" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Leaf icon at corner */}
      <path d="M125 115 C 135 115, 140 105, 138 95 C 130 100, 125 108, 125 115Z" fill="#22c55e" />
    </svg>
  );
}

export function MSPIllustration({ className, ...props }: SVGProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="200" height="150" rx="24" fill="#f0fdf4" className="dark:fill-stone-900/50" />

      {/* Wheat Stalk */}
      <path d="M100 120 V 45" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
      {/* Wheat grains */}
      <path d="M100 95 Q 85 85 92 75 Q 100 85 100 95" fill="#eab308" />
      <path d="M100 95 Q 115 85 108 75 Q 100 85 100 95" fill="#eab308" />
      
      <path d="M100 80 Q 85 70 92 60 Q 100 70 100 80" fill="#eab308" />
      <path d="M100 80 Q 115 70 108 60 Q 100 70 100 80" fill="#eab308" />
      
      <path d="M100 65 Q 85 55 92 45 Q 100 55 100 65" fill="#eab308" />
      <path d="M100 65 Q 115 55 108 45 Q 100 55 100 65" fill="#eab308" />

      {/* Upward Price Arrow */}
      <path d="M50 110 L 80 80 H 115 L 145 50" stroke="#15803d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrowhead */}
      <path d="M130 50 H 145 V 65" stroke="#15803d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
