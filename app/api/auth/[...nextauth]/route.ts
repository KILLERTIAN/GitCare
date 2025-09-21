import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger, session }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        const githubProfile = profile as {
          login?: string;
          avatar_url?: string;
          public_repos?: number;
          followers?: number;
          following?: number;
        };
        token.login = githubProfile.login;
        token.avatar_url = githubProfile.avatar_url;
        token.public_repos = githubProfile.public_repos;
        token.followers = githubProfile.followers;
        token.following = githubProfile.following;
      }
      
      // Handle wallet address updates from client
      if (trigger === "update" && session?.walletAddress) {
        token.walletAddress = session.walletAddress;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.login = token.login as string;
        session.user.avatar_url = token.avatar_url as string;
        session.user.public_repos = token.public_repos as number;
        session.user.followers = token.followers as number;
        session.user.following = token.following as number;
        session.user.walletAddress = token.walletAddress as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
