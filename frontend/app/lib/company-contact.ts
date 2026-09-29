const whatsappMessage = "Hallo SB Power, ich möchte eine Reinigungsleistung anfragen.";

export const companyContact = {
  phoneDisplay: "+49 176 85631084",
  phone: "+4917685631084",
  whatsappDisplay: "+49 176 85631084",
  whatsapp: "4917685631084",
  email: "info@sbpower.de",
  whatsappMessage,
  phoneUrl: "tel:+4917685631084",
  emailUrl: "mailto:info@sbpower.de",
  whatsappUrl: `https://wa.me/4917685631084?text=${encodeURIComponent(whatsappMessage)}`,
} as const;
