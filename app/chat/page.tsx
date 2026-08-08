import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  const session = getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }
  return <ChatClient username={session!.username} />;
}
