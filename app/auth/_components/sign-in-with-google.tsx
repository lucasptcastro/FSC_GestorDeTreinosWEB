"use client";

import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export const SignInWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      });
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error(
        "Ocorreu um erro ao fazer login com o Google. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="h-9.5 rounded-full bg-white px-6 text-black hover:bg-white/90"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Image
            src="/google-icon.svg"
            alt=""
            width={16}
            height={16}
            className="shrink-0"
          />
          Fazer login com Google
        </>
      )}
    </Button>
  );
};
