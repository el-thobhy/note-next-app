import VerificationForm from "@/components/auth/VerificationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Verification Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return <VerificationForm />;
}
