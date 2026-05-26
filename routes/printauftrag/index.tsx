import { Head } from "fresh/runtime";
import PrintRequestForm, {
  type RequestMessage,
} from "@/components/PrintRequestForm.tsx";
import { materials } from "@/lib/content.ts";
import { define } from "@/utils.ts";

const allowedExtensions = [".stl", ".step", ".stp"];

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
      text: "Bitte eine STL-, STP- oder STEP-Datei hochladen.",
    };
  }

  const lowerName = model.name.toLowerCase();
  const hasAllowedExtension = allowedExtensions.some((extension) =>
    lowerName.endsWith(extension)
  );

  if (!hasAllowedExtension) {
    return {
      type: "error",
      text: "Erlaubt sind nur .stl, .stp und .step Dateien.",
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
      <section class="shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="eyebrow text-[var(--clay)]">STL / STEP Upload</p>
          <h1 class="display mt-5 text-7xl font-semibold md:text-9xl">
            Lass dein Modell drucken.
          </h1>
          <p class="mt-6 text-xl leading-8">
            Lade eine STL-, STP- oder STEP-Datei hoch, waehle ein Material und
            beschreibe kurz, wofuer das Teil gedacht ist. Danach kann daraus ein
            Angebot mit Material, Druckzeit und Nachbearbeitung entstehen.
          </p>
          <div class="mt-8 grid gap-3">
            {[
              "Datei pruefen",
              "Material und Finish abschaetzen",
              "Angebot erstellen",
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
        <PrintRequestForm message={data.message} />
      </section>
    </>
  );
});
