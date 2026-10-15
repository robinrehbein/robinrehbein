import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
export default defineConfig({publicDir:"static",resolve:{alias:{"@":fileURLToPath(new URL(".",import.meta.url))}},plugins:[reactRouter(),tailwindcss()]});
