import type { Metadata } from "next";
import { getChatGPTUser } from "../chatgpt-auth";
import { AccountClient } from "../components/account-client";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Личный кабинет", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const user = await getChatGPTUser();
  return <AccountClient user={user ? { displayName: user.displayName, email: user.email } : null} />;
}
