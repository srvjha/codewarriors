import env from "@/config/env";

export const getLogo = (company: string) => {
  return `https://img.logo.dev/name/${company.toLowerCase()}?token=${env.VITE_LOGO_DEV_PUBLIC_KEY}&fallback=404`;
};
