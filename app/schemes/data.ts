export interface Scheme {
  slug: string;
  nameHindi: string;
  nameEnglish: string;
  shortDescHindi: string;
  shortDescEnglish: string;
  benefitHindi: string;
  benefitEnglish: string;
  eligibilityHindi: string[];
  eligibilityEnglish: string[];
  applyStepsHindi: string[];
  applyStepsEnglish: string[];
  officialUrl: string;
  iconName: "Coins" | "Shield" | "CreditCard" | "Leaf" | "Sun" | "ShoppingBag";
}

export const schemesData: Scheme[] = [
  {
    slug: "pm-kisan",
    nameHindi: "पीएम किसान सम्मान निधि योजना",
    nameEnglish: "PM Kisan Samman Nidhi",
    shortDescHindi: "छोटे और सीमांत किसानों को प्रति वर्ष ₹6,000 की न्यूनतम आय सहायता।",
    shortDescEnglish: "Direct income support of ₹6,000/year to all landholding farmer families.",
    benefitHindi: "किसानों को सालाना ₹6,000 की वित्तीय सहायता ₹2,000 की तीन बराबर किस्तों में सीधे बैंक खाते में दी जाती है। 20 जून 2026 को योजना की 23वीं किस्त जारी की गई (9.44 करोड़ किसानों को ₹18,880 करोड़ स्थानांतरित)। अगली किस्त अक्टूबर 2026 के आसपास अपेक्षित है।",
    benefitEnglish: "Annual financial support of ₹6,000 is transferred directly into bank accounts in three equal installments of ₹2,000. The 23rd installment was released on 20 June 2026, distributing ₹18,880 crore to 9.44 crore farmers. Next installment is expected around October 2026.",
    eligibilityHindi: [
      "सभी छोटे और सीमांत भूमिधारक किसान परिवार जिनके नाम पर खेती योग्य भूमि है।",
      "संस्थागत भूमि धारक, सरकारी पदों पर कार्यरत व्यक्ति या आयकर दाता इसके पात्र नहीं हैं।",
      "आधार कार्ड, भूलेख दस्तावेज (खसरा/खतौनी), और सक्रिय बैंक खाता आवश्यक है।"
    ],
    eligibilityEnglish: [
      "All small and marginal farmer families who own cultivable land in their names.",
      "Institutional landholders, government employees, and income taxpayers are excluded.",
      "Aadhaar card, land ownership records (Khasra/Khatauni), and an active bank account are mandatory."
    ],
    applyStepsHindi: [
      "पीएम-किसान की आधिकारिक वेबसाइट (pmkisan.gov.in) पर जाएं।",
      "वहाँ 'New Farmer Registration' पर क्लिक करें और ग्रामीण/शहरी क्षेत्र चुनें।",
      "अपना आधार नंबर और मोबाइल नंबर दर्ज करें और ओटीपी सत्यापित करें।",
      "राज्य, जिला, ब्लॉक और गांव सिलेक्ट करें, और अपनी जमीन के विवरण (खसरा नंबर, खाता नंबर) भरें।",
      "भूमि दस्तावेज और बैंक विवरण अपलोड करें, और आवेदन जमा करें।"
    ],
    applyStepsEnglish: [
      "Go to the official PM-Kisan website (pmkisan.gov.in).",
      "Click on 'New Farmer Registration' and choose Rural/Urban registration.",
      "Enter Aadhaar and Mobile numbers, and verify via OTP.",
      "Select your state, district, block, and village, and fill land ownership details.",
      "Upload land documents and bank details, then submit the application."
    ],
    officialUrl: "https://pmkisan.gov.in/",
    iconName: "Coins",
  },
  {
    slug: "pmfby",
    nameHindi: "प्रधानमंत्री फसल बीमा योजना",
    nameEnglish: "Pradhan Mantri Fasal Bima Yojana",
    shortDescHindi: "प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल नुकसान से वित्तीय सुरक्षा।",
    shortDescEnglish: "Crop insurance scheme protecting farmers against crop damage due to disasters.",
    benefitHindi: "प्राकृतिक आपदाओं (सूखा, बाढ़, ओलावृष्टि, कीट आक्रमण) से होने वाले नुकसान की भरपाई। किसानों के लिए प्रीमियम दरें बहुत कम हैं: खरीफ फसलों के लिए केवल 2%, रबी फसलों के लिए 1.5% और वाणिज्यिक/बागवानी फसलों के लिए 5%।",
    benefitEnglish: "Comprehensive risk insurance cover against crop damage from natural disasters (drought, flood, hailstorms, pests). Farmers pay extremely low premiums: only 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops.",
    eligibilityHindi: [
      "सभी किसान जो अधिसूचित क्षेत्रों में अधिसूचित फसलें उगा रहे हैं (पट्टेदार और बटाईदार किसानों सहित)।",
      "गैर-ऋणी किसान भी स्वैच्छिक रूप से फसल बीमा करा सकते हैं।"
    ],
    eligibilityEnglish: [
      "All farmers growing notified crops in notified areas, including tenant and sharecropper farmers.",
      "Non-loanee farmers can also opt for crop insurance voluntarily."
    ],
    applyStepsHindi: [
      "पीएमएफबीवाई (pmfby.gov.in) पोर्टल पर जाएं या अपने नजदीकी सीएससी (Common Service Centre) पर जाएं।",
      "फसल बीमा फॉर्म भरें और अपनी बोई गई फसल और बुवाई की तारीख की जानकारी दें।",
      "आवश्यक दस्तावेज: आधार कार्ड, जमीन का रिकॉर्ड (खसरा/खतौनी), बैंक पासबुक, और बुवाई का प्रमाण पत्र।",
      "ऑनलाइन या बैंक/सीएससी के माध्यम से निर्धारित मामूली प्रीमियम राशि का भुगतान करें और रसीद प्राप्त करें।"
    ],
    applyStepsEnglish: [
      "Visit the official PMFBY portal (pmfby.gov.in) or go to the nearest CSC (Common Service Centre).",
      "Fill out the crop insurance form specifying the sown crop and sowing date details.",
      "Required documents: Aadhaar card, land records (Khasra), bank passbook, and sowing certificate.",
      "Pay the calculated nominal premium amount online or via CSC/bank and obtain your receipt."
    ],
    officialUrl: "https://pmfby.gov.in/",
    iconName: "Shield",
  },
  {
    slug: "kcc",
    nameHindi: "किसान क्रेडिट कार्ड योजना",
    nameEnglish: "Kisan Credit Card (KCC)",
    shortDescHindi: "खेती-बाड़ी, फसल उत्पादन और कृषि यंत्रों की खरीद के लिए रियायती ब्याज दर पर ऋण।",
    shortDescEnglish: "Access to low-interest, short-term agricultural credit/loans for farming inputs.",
    benefitHindi: "किसानों को खेती की जरूरतों के लिए 4% की रियायती ब्याज दर पर ₹3 लाख तक का अल्पकालिक ऋण दिया जाता है (समय पर भुगतान करने पर 3% की अतिरिक्त छूट के साथ)। ऋण राशि से खाद, बीज और कृषि उपकरण खरीदे जा सकते हैं।",
    benefitEnglish: "Access to short-term loans up to ₹3 Lakhs at a subsidized interest rate of 4% (inclusive of a 3% prompt repayment discount). Loans can be utilized to purchase fertilizers, seeds, pesticides, and tools.",
    eligibilityHindi: [
      "सभी व्यक्तिगत/संयुक्त किसान जो खेती योग्य भूमि के मालिक हैं।",
      "बटाईदार, किरायेदार किसान और स्वयं सहायता समूह (SHG) भी पात्र हैं।",
      "पशुपालन, डेयरी और मत्स्य पालन करने वाले किसान भी ऋण के हकदार हैं।"
    ],
    eligibilityEnglish: [
      "All individual or joint owner-cultivators owning cultivable land.",
      "Tenant farmers, sharecroppers, and Self Help Groups (SHGs) are also eligible.",
      "Farmers engaged in animal husbandry, dairy, and fisheries can also apply."
    ],
    applyStepsHindi: [
      "अपने नजदीकी सहकारी या सरकारी बैंक शाखा पर जाएं या myScheme पोर्टल पर जाएं।",
      "केसीसी आवेदन पत्र (KCC Application Form) भरें।",
      "आधार कार्ड, पैन कार्ड, पते का प्रमाण, भूमि रिकॉर्ड (ऋण पुस्तिका) और बोई गई फसल का विवरण जमा करें।",
      "बैंक द्वारा भूमि सत्यापन और क्रेडिट स्कोर की जांच के बाद केसीसी कार्ड जारी कर दिया जाएगा।"
    ],
    applyStepsEnglish: [
      "Visit your nearest cooperative or commercial bank branch, or apply via the myScheme portal.",
      "Fill out the KCC application form.",
      "Submit Aadhaar card, PAN card, address proof, land record copy (Bahi), and crop sowing details.",
      "Following bank land verification and credit score checking, the KCC card will be issued."
    ],
    officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
    iconName: "CreditCard",
  },
  {
    slug: "soil-health-card",
    nameHindi: "मृदा स्वास्थ्य कार्ड योजना",
    nameEnglish: "Soil Health Card Scheme",
    shortDescHindi: "मिट्टी की जांच कराकर खाद और उर्वरक का सही मात्रा में उपयोग करने की सलाह।",
    shortDescEnglish: "Get your soil tested and receive recommendations on customized fertilizer usage.",
    benefitHindi: "किसानों को उनके खेत की मिट्टी के स्वास्थ्य की रिपोर्ट (12 प्रमुख पोषक तत्वों की जांच) मुफ्त में दी जाती है। इससे मिट्टी की पोषक क्षमता बढ़ाने के लिए आवश्यक खाद और उर्वरकों की सही मात्रा की जानकारी मिलती है, जिससे कृषि लागत में कमी आती है।",
    benefitEnglish: "Provides free soil reports detailing status of 12 crucial macro and micro-nutrients. Includes recommended dosage of fertilizers and organic manure, helping reduce input costs and improve soil quality.",
    eligibilityHindi: [
      "भारत के सभी किसान जिनके पास खेती योग्य भूमि है, इस योजना के लिए पात्र हैं।"
    ],
    eligibilityEnglish: [
      "All farmers across India who own cultivable land are eligible for this free soil testing report."
    ],
    applyStepsHindi: [
      "अपने जिले की कृषि विभाग प्रयोगशाला या कृषि विस्तार अधिकारी (Extension Officer) से संपर्क करें।",
      "अपने खेत के अलग-अलग कोनों से मिट्टी का नमूना (Soil Sample) एकत्र करें (विभाग के दिशा-निर्देशों के अनुसार)।",
      "मिट्टी का नमूना एकत्र कर प्रयोगशाला में जमा करें।",
      "जांच पूरी होने पर मृदा स्वास्थ्य कार्ड (Soil Health Card) प्राप्त करें और उसमें दी गई खाद की मात्रा के अनुसार ही खेती करें।"
    ],
    applyStepsEnglish: [
      "Contact your district agriculture department laboratory or Block Agriculture Extension Officer.",
      "Collect soil samples from different grid points of your field according to standard guidelines.",
      "Submit the soil sample bag to the testing lab.",
      "Download or collect the Soil Health Card showing nutrient ratings and customized fertilizer recommendations."
    ],
    officialUrl: "https://soilhealth.dac.gov.in/",
    iconName: "Leaf",
  },
  {
    slug: "pm-kusum",
    nameHindi: "पीएम कुसुम योजना (सोलर पंप)",
    nameEnglish: "PM-KUSUM Scheme",
    shortDescHindi: "खेतों में सिंचाई के लिए सब्सिडी पर सोलर पंप और बंजर भूमि पर सोलर प्लांट लगाने की योजना।",
    shortDescEnglish: "Subsidized solar pumps for irrigation and grid-connected solar power plants.",
    benefitHindi: "सिंचाई के लिए सोलर पंप लगाने पर केंद्र और राज्य सरकार द्वारा 60% तक की भारी सब्सिडी दी जाती है, जबकि किसान को केवल 10% राशि का भुगतान करना पड़ता है (शेष 30% बैंक ऋण)। बंजर भूमि पर सोलर प्लांट लगाकर बिजली बेचकर किसान अतिरिक्त कमाई कर सकते हैं।",
    benefitEnglish: "Offers up to 60% subsidy for setting up solar irrigation pumps (30% Central + 30% State Govt). The farmer only contributes 10%, and the remaining 30% can be financed via bank loans. Farmers can also generate income by selling solar power from barren lands.",
    eligibilityHindi: [
      "सभी व्यक्तिगत किसान, सहकारी समितियां, पंचायतों और किसानों के समूह (FPOs) पात्र हैं।",
      "सोलर पंप लगाने के लिए सिंचाई के लिए पानी का स्रोत और कृषि भूमि होनी चाहिए।"
    ],
    eligibilityEnglish: [
      "All individual farmers, cooperatives, panchayats, and Farmer Producer Organizations (FPOs) are eligible.",
      "Must own agricultural land with a source of water available for irrigation."
    ],
    applyStepsHindi: [
      "अपने राज्य के ऊर्जा विकास निगम या नवीन और नवीकरणीय ऊर्जा विभाग की आधिकारिक वेबसाइट (pmkusum.mnre.gov.in) पर जाएं।",
      "कुसुम योजना के तहत 'सोलर पंप आवेदन' फॉर्म भरें।",
      "आवश्यक दस्तावेज: आधार कार्ड, जमीन की नकल (खसरा खतौनी), बैंक खाता विवरण, और मोबाइल नंबर।",
      "सब्सिडी स्वीकृत होने पर किसान की 10% हिस्सेदारी की राशि जमा करें, जिसके बाद सोलर पंप लगा दिया जाएगा।"
    ],
    applyStepsEnglish: [
      "Visit the official PM-KUSUM portal (pmkusum.mnre.gov.in) or state green energy department portal.",
      "Register and fill out the subsidized solar pump application form.",
      "Required documents: Aadhaar card, land ownership copy (Khasra), bank details, and mobile number.",
      "Upon subsidy approval, pay the 10% farmer share to initiate solar pump installation."
    ],
    officialUrl: "https://pmkusum.mnre.gov.in/",
    iconName: "Sun",
  },
  {
    slug: "e-nam",
    nameHindi: "ई-नाम (राष्ट्रीय कृषि बाजार)",
    nameEnglish: "e-NAM (National Agriculture Market)",
    shortDescHindi: "फसलों को ऑनलाइन बेचने और देशभर के खरीदारों से सीधे संपर्क करने का डिजिटल मंच।",
    shortDescEnglish: "Pan-India electronic trading portal uniting APMC mandis for online bidding.",
    benefitHindi: "देशभर की कृषि मंडियों को जोड़ने वाला डिजिटल ट्रेडिंग प्लेटफॉर्म। किसान अपनी फसल के नमूने की गुणवत्ता जांच कराकर देशभर के व्यापारियों से ऑनलाइन बोलियां प्राप्त कर सकते हैं, जिससे उन्हें फसल का सबसे अच्छा दाम मिलता है और भुगतान सीधे बैंक खाते में होता है।",
    benefitEnglish: "A pan-India electronic trading platform integrating APMC mandis online. Farmers get access to direct bidding from traders across the country based on crop quality assaying, guaranteeing transparent and higher prices.",
    eligibilityHindi: [
      "भारत के सभी किसान जो अधिसूचित मंडियों में अपनी कृषि उपज बेचना चाहते हैं, वे ई-नाम पर पंजीकरण के लिए पात्र हैं।"
    ],
    eligibilityEnglish: [
      "All farmers in India seeking to trade and sell their agricultural produce in unified markets are eligible."
    ],
    applyStepsHindi: [
      "ई-नाम की आधिकारिक वेबसाइट (enam.gov.in) पर जाएं या मोबाइल ऐप डाउनलोड करें।",
      "रजिस्ट्रेशन विकल्प में 'Farmer' चुनें और अपनी व्यक्तिगत जानकारी, मोबाइल नंबर और बैंक पासबुक की कॉपी दर्ज करें।",
      "अपनी उपज को नजदीकी ई-नाम मंडी (e-NAM APMC Mandi) में लाएं, जहाँ उसकी गुणवत्ता जांच (Assaying) होगी।",
      "गुणवत्ता रिपोर्ट अपलोड होने के बाद, देश भर के खरीदार ऑनलाइन बोली लगाएंगे। किसान सबसे ऊंची बोली स्वीकार कर सीधे खाते में भुगतान प्राप्त कर सकते हैं।"
    ],
    applyStepsEnglish: [
      "Visit the e-NAM portal (enam.gov.in) or download the e-NAM mobile app.",
      "Click register, select 'Farmer' category, and fill details along with bank account proof.",
      "Bring your crop produce to the nearest registered e-NAM APMC mandi for quality testing.",
      "Traders across India will place online bids based on the test report. Approve the highest bid and get payment directly in your account."
    ],
    officialUrl: "https://enam.gov.in/",
    iconName: "ShoppingBag",
  }
];
