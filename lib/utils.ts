import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export const WHATSAPP_NUMBER = "923084703973";
export const WHATSAPP_MESSAGE = "Bhai Matric Mastery website se aya hun";

export function whatsappLink(customMessage?: string) {
  const msg = encodeURIComponent(customMessage || WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
