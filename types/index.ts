// KisanSathi TypeScript types

export interface LanguageProps {
  lang: "en" | "hi";
}

export interface NavLink {
  label: {
    en: string;
    hi: string;
  };
  href: string;
}
