import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@kibo-ui/react": path.resolve(__dirname, "src/kibo"),
            "@components": path.resolve(__dirname, "src/components"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@lib": path.resolve(__dirname, "src/lib")
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:" + (process.env.BACKEND_PORT ?? "5051"),
                changeOrigin: true
            }
        }
    }
});
