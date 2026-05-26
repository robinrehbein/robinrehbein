import { Head } from "fresh/runtime";
import PrintRequestForm, {
  type RequestMessage,
} from "@/components/PrintRequestForm.tsx";
import PrintModelWorkbench from "@/components/PrintModelWorkbench.tsx";
import PrintModelController from "@/islands/PrintModelController.tsx";
import { materials } from "@/lib/content.ts";
import { define } from "@/utils.ts";

const allowedExtensions = [".stl", ".step", ".stp", ".3mf"];

function validatePrintRequest(form: FormData): RequestMessage {
  const name = form.get("name")?.toString().trim();
  const email = form.get("email")?.toString().trim();
  const material = form.get("material")?.toString();
  const notes = form.get("notes")?.toString().trim();
  const model = form.get("model");

  if (!name || !email || !material || !notes) {
    return { type: "error", text: "Bitte alle Pflichtfelder ausfuellen." };
  }

  if (!materials.includes(material)) {
    return { type: "error", text: "Bitte ein gueltiges Material auswaehlen." };
  }

  if (!(model instanceof File) || !model.name) {
    return {
      type: "error",
      text: "Bitte eine STL-, STP-, STEP- oder 3MF-Datei hochladen.",
    };
  }

  const lowerName = model.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((extension) =>
    lowerName.endsWith(extension)
  );

  if (!hasAllowedExtension) {
    return {
      type: "error",
      text: "Erlaubt sind nur .stl, .stp, .step und .3mf Dateien.",
    };
  }

  if (model.size > 50 * 1024 * 1024) {
    return { type: "error", text: "Die Datei darf maximal 50 MB gross sein." };
  }

  const requestId = `RR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return {
    type: "success",
    text:
      `Anfrage ${requestId} ist vorbereitet. Ich pruefe Datei, Material und Druckzeit als naechstes.`,
  };
}

export const handler = define.handlers({
  GET() {
    return { data: { message: null as RequestMessage } };
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    return { data: { message: validatePrintRequest(form) } };
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <>
      <Head>
        <title>Druckauftrag - Robin Rehbein 3D Print Studio</title>
      </Head>
      <section class="shell py-16">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p class="eyebrow text-[var(--clay)]">3D Print Workbench</p>
            <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
              Modell laden, Druck planen.
            </h1>
          </div>
          <p class="max-w-2xl text-xl leading-8">
            Zieh STL, STEP/STP oder 3MF direkt in den Viewer. Material, Farbe,
            Layerhoehe und Nozzle-Durchmesser werden live am Modell sichtbar und
            in die Anfrage uebernommen.
          </p>
        </div>

        <div class="mt-10 grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <PrintModelWorkbench />
          <PrintModelController />
          <div class="grid content-start gap-5">
            <PrintRequestForm message={data.message} />
            <div class="card p-5">
              <p class="eyebrow text-[var(--clay)]">Ablauf</p>
              <div class="mt-5 grid gap-3">
                {[
                  "Datei im Viewer pruefen",
                  "Material, Farbe und Layer definieren",
                  "Kontakt und Einsatzzweck absenden",
                ].map((item, index) => (
                  <div class="flex items-center gap-3" key={item}>
                    <span class="grid size-9 place-items-center rounded-[6px] bg-[var(--ink)] text-[var(--paper)]">
                      {index + 1}
                    </span>
                    <span class="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section pt-0">
        <div class="shell grid gap-6 md:grid-cols-3">
          <div class="card p-5">
            <p class="eyebrow text-[var(--clay)]">STL</p>
            <p class="mt-3">
              Direktes Mesh-Rendering fuer schnelle Druckbarkeit-Checks und
              farbige Materialvorschau.
            </p>
          </div>
          <div class="card p-5">
            <p class="eyebrow text-[var(--clay)]">STEP / STP</p>
            <p class="mt-3">
              Browserseitige OpenCascade-Triangulation fuer CAD-Dateien, ohne
              Upload vor der Vorschau.
            </p>
          </div>
          <div class="card p-5">
            <p class="eyebrow text-[var(--clay)]">3MF</p>
            <p class="mt-3">
              3MF-Dateien werden mit Three.js geladen und koennen ebenfalls als
              Angebotsbasis gesendet werden.
            </p>
          </div>
        </div>
      </section>
    </>
  );
});
