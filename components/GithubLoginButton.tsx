"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";

export default function GithubLoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img 
            src={session.user.avatar_url || session.user.image || ''} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {session.user.name || session.user.login}
            </span>
            <span className="text-xs text-gray-500">
              @{session.user.login}
            </span>
          </div>
        </div>
        <Button 
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => signIn("github")}
      className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white"
    >
      <Github className="mr-2 h-4 w-4" />
      Sign in with GitHub
    </Button>
  );
}
