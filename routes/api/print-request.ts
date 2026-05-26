import { define } from "@/utils.ts";
import { materials } from "@/lib/content.ts";

const allowedExtensions = [".stl", ".step", ".stp", ".3mf"];

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const name = form.get("name")?.toString().trim();
    const email = form.get("email")?.toString().trim();
    const material = form.get("material")?.toString();
    const notes = form.get("notes")?.toString().trim();
    const model = form.get("model");

    if (!name || !email || !material || !notes) {
      return Response.json({ error: "Bitte alle Pflichtfelder ausfuellen." }, {
        status: 400,
      });
    }

    if (!materials.includes(material)) {
      return Response.json({
        error: "Bitte ein gueltiges Material auswaehlen.",
      }, { status: 400 });
    }

    if (!(model instanceof File) || !model.name) {
      return Response.json({
        error: "Bitte eine STL-, STP-, STEP- oder 3MF-Datei hochladen.",
      }, {
        status: 400,
      });
    }

    const lowerName = model.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      lowerName.endsWith(extension)
    );

    if (!hasAllowedExtension) {
      return Response.json({
        error: "Erlaubt sind nur .stl, .stp, .step und .3mf Dateien.",
      }, {
        status: 400,
      });
    }

    if (model.size > 50 * 1024 * 1024) {
      return Response.json({
        error: "Die Datei darf maximal 50 MB gross sein.",
      }, {
        status: 400,
      });
    }

    const requestId = `RR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    return Response.json({
      requestId,
      received: {
        name,
        email,
        material,
        fileName: model.name,
        size: model.size,
      },
    });
  },
});
