import { useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: number;
  username: string;
  name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "teams";
  plan_expires_at: string | null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      return res.json() as Promise<{ user: User | null }>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const login = () => {
    window.location.href = "/api/auth/github";
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  return {
    user: data?.user ?? null,
    isLoading,
    isLoggedIn: !!data?.user,
    isPro: data?.user?.plan === "pro" || data?.user?.plan === "teams",
    isTeams: data?.user?.plan === "teams",
    login,
    logout,
  };
}
