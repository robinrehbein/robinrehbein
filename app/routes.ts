import { index, route, type RouteConfig } from "@react-router/dev/routes";
export default [index("routes/index.tsx"),route("work","routes/work.tsx"),route("about","routes/about.tsx"),route("imprint","routes/imprint.tsx"),route("privacy","routes/privacy.tsx"),route("*","routes/_404.tsx")] satisfies RouteConfig;
