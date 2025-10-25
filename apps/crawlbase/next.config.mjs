import fs from "fs";
import path from "path";
import { config as loadEnvConfig } from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../");
const rootEnvFiles = [".env.local", ".env"];

for (const filename of rootEnvFiles) {
  const fullPath = path.join(repoRoot, filename);
  if (fs.existsSync(fullPath)) {
    loadEnvConfig({ path: fullPath, override: false });
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
