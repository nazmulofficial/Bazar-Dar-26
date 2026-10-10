import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Environment variables
const mongodbUrl = process.env.MONGODB_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

// Validate required environment variables
if (!mongodbUrl) {
  throw new Error("MONGODB_URL is missing.");
}

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is missing.");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is missing.");
}

// MongoDB connection
const client = new MongoClient(mongodbUrl);
const db = client.db("bazar-dar");

// Better Auth configuration
export const auth = betterAuth({
  baseURL,
  secret,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});