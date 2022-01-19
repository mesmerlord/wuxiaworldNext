import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl } from "../../../components/utils/siteName";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Wuxiaworld",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "username",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(`${apiUrl}/dj-rest-auth/login/`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US",
          },
        });

        const user = await res.json();
        console.log(user);
        if (!res.ok) {
          throw new Error(user.exception);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  //   pages: {
  //     signIn: "/login",
  //   },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.key,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "", // Hex color code #33FF5D
    logo: "/apple-touch-icon.png", // Absolute URL to image
  },
  debug: process.env.NODE_ENV === "development",
});
