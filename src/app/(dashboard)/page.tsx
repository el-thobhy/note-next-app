import { cookies } from "next/headers";
import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = await cookieStore.get("token")?.value;
  if(!token){
    redirect("/signin");
  }
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        
      </div>
    </div>
  );
}
