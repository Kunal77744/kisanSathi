import { translateCrop } from "./cropTranslations";
import { slugify } from "./utils";

export function resolveCropBySlug(crops: string[], cropSlug: string): string | undefined {
  return crops.find((crop) => slugify(crop) === cropSlug);
}

export function buildCropPageMetadata(crop: string) {
  const cropEnglish = crop.trim();
  const cropHindi = translateCrop(cropEnglish, "hi");
  const cropName = cropHindi.toLocaleLowerCase() === cropEnglish.toLocaleLowerCase()
    ? cropEnglish
    : `${cropHindi} (${cropEnglish})`;

  return {
    title: `${cropName} का आज का मंडी भाव`,
    description: `भारत की प्रमुख कृषि मंडियों में ${cropName} का आज का ताज़ा मंडी भाव देखें। राज्यों और शहरों के अनुसार न्यूनतम, अधिकतम और प्रचलित बाजार भाव की तुलना करें।`,
    alternates: {
      canonical: `/mandi-bhav/crop/${slugify(cropEnglish)}`,
    },
  };
}
