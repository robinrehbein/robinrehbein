import { materials } from "@/lib/content.ts";
import ModelFileDropzone from "@/islands/ModelFileDropzone.tsx";

export type RequestMessage = {
  type: "success" | "error";
  text: string;
} | null;

export default function PrintRequestForm(
  { message }: { message: RequestMessage },
) {
  return (
    <form
      class="card grid gap-5 p-5 md:p-7"
      encType="multipart/form-data"
      method="post"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2">
          <span class="eyebrow">Name</span>
          <input class="field" name="name" autocomplete="name" required />
        </label>
        <label class="grid gap-2">
          <span class="eyebrow">E-Mail</span>
          <input
            class="field"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
        </label>
      </div>
      <ModelFileDropzone />
      <div class="grid gap-4 md:grid-cols-2">
        <label class="grid gap-2">
          <span class="eyebrow">Material</span>
          <select class="field" name="material" required>
            <option value="">Bitte auswaehlen</option>
            {materials.map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </label>
        <label class="grid gap-2">
          <span class="eyebrow">Farbe / Finish</span>
          <input class="field" name="finish" placeholder="z.B. schwarz matt" />
        </label>
      </div>
      <label class="grid gap-2">
        <span class="eyebrow">Einsatzzweck & Hinweise</span>
        <textarea
          class="field min-h-36 resize-y"
          name="notes"
          placeholder="Toleranzen, Belastung, Stueckzahl, Termin, Sichtseite ..."
          required
        />
      </label>
      <button class="button" type="submit">Anfrage zur Pruefung senden</button>
      {message && (
        <p
          class={`rounded-[6px] border px-4 py-3 text-sm ${
            message.type === "error"
              ? "border-[var(--oxide)] text-[var(--oxide)]"
              : "border-[var(--sage)] text-[var(--steel)]"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
