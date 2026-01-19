"use client";


import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    
    // Broadcast auth change to other listeners
    if (typeof window !== "undefined") {
      const channel = new BroadcastChannel("auth");
      channel.postMessage({ type: "AUTH_CHANGE" });
      channel.close();
    }
    
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="shadow-[10px_6.5px_0px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow"
    >
      Logout
    </Button >
  )
}