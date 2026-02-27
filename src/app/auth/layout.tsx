import type { Metadata } from "next";
import { AppToaster } from "@/components/layout/app-toaster";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
