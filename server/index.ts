import express from "express";
import { createRequestHandler } from "@react-router/express";
const app = express();
app.disable("x-powered-by");
app.use((_req,res,next)=>{res.set({"X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin"});next();});
// dev.robinrehbein.de stays out of search results so it never competes with the live site.
app.use((req,res,next)=>{if(req.hostname.startsWith("dev."))res.set("X-Robots-Tag","noindex, nofollow");next();});
// URLs from earlier versions of the site: moved pages redirect permanently, retired ones (shop, admin) are gone for good.
const MOVED:Record<string,string>={"/blog":"/work","/hub":"/","/disclaimer":"/imprint","/impressum":"/imprint","/datenschutz":"/privacy","/contact":"/#contact","/index.html":"/"};
const GONE=/^\/(shop|checkout|printauftrag|admin|api)(\/|$)/;
app.use((req,res,next)=>{
  const q=req.originalUrl.slice(req.path.length);
  if(req.path.length>1&&req.path.endsWith("/"))return res.redirect(301,"/"+req.path.replace(/^\/+|\/+$/g,"")+q);  // leading slashes collapsed: "//host/" must not leave the site
  const to=MOVED[req.path]??(req.path.startsWith("/blog/")?"/work":undefined);
  if(to)return res.redirect(301,to);
  if(GONE.test(req.path))return res.status(410).type("text").send("Gone");
  next();
});
app.use("/assets",express.static("build/client/assets",{immutable:true,maxAge:"1y"}));
app.use(express.static("build/client",{index:false}));
app.use(createRequestHandler({build:()=>import("../build/server/index.js"),mode:"production"}));
const server=app.listen(Number(process.env.PORT??8000),"0.0.0.0",()=>console.log("Production server ready"));
process.on("SIGTERM",()=>server.close());
