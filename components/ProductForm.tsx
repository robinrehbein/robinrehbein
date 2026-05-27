import type { Product } from "@/lib/catalog.ts";
import { CATEGORY_LABELS } from "@/lib/catalog.ts";
import VariantEditor from "@/islands/VariantEditor.tsx";

export default function ProductForm(
  { product, action }: { product?: Product; action: string },
) {
  const p = product;
  return (
    <form
      method="post"
      action={action}
      encType="multipart/form-data"
      class="grid gap-5"
    >
      <label class="block">
        <span class="eyebrow opacity-70">Slug</span>
        <input
          name="slug"
          class="field mt-1"
          value={p?.slug ?? ""}
          required
          readOnly={!!p}
        />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Name</span>
        <input name="name" class="field mt-1" value={p?.name ?? ""} required />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Kategorie</span>
        <select name="category" class="field mt-1">
          {(Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[])
            .map((c) => (
              <option key={c} value={c} selected={p?.category === c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
        </select>
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Beschreibung</span>
        <textarea name="description" class="field mt-1" rows={3}>
          {p?.description ?? ""}
        </textarea>
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Materialien (Komma-getrennt)</span>
        <input
          name="materials"
          class="field mt-1"
          value={p?.materials.join(", ") ?? ""}
        />
      </label>
      <label class="block">
        <span class="eyebrow opacity-70">Lieferzeit</span>
        <input
          name="leadTime"
          class="field mt-1"
          value={p?.leadTime ?? ""}
        />
      </label>

      <fieldset class="grid gap-3 rounded-[8px] border border-[var(--line)] p-4">
        <legend class="eyebrow px-1">
          Kategorie-Specs (nur passende werden gespeichert)
        </legend>
        <input
          name="heightMm"
          class="field"
          placeholder="Vase: Höhe (mm)"
          value={p?.category === "vase" ? String(p.heightMm) : ""}
        />
        <input
          name="volumeMl"
          class="field"
          placeholder="Vase: Volumen (ml)"
          value={p?.category === "vase" ? String(p.volumeMl) : ""}
        />
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            name="watertight"
            checked={p?.category === "vase" && p.watertight}
          />{" "}
          Vase: wasserdicht
        </label>
        <input
          name="diameterMm"
          class="field"
          placeholder="Planter: Durchmesser (mm)"
          value={p?.category === "planter" ? String(p.diameterMm) : ""}
        />
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            name="drainage"
            checked={p?.category === "planter" && p.drainage}
          />{" "}
          Planter: Drainage
        </label>
        <input
          name="profile"
          class="field"
          placeholder="Keycap: Profil"
          value={p?.category === "keycap" ? p.profile : ""}
        />
        <input
          name="switchCompat"
          class="field"
          placeholder="Keycap: Kompatibilität"
          value={p?.category === "keycap" ? p.switchCompat : ""}
        />
        <select name="legends" class="field">
          <option
            value="blank"
            selected={p?.category === "keycap" && p.legends === "blank"}
          >
            Blank
          </option>
          <option
            value="legends"
            selected={p?.category === "keycap" && p.legends === "legends"}
          >
            Mit Legenden
          </option>
        </select>
        <input
          name="dimensions"
          class="field"
          placeholder="Organisation: Maße"
          value={p?.category === "organisation" ? p.dimensions : ""}
        />
      </fieldset>

      <div>
        <span class="eyebrow opacity-70">Bilder</span>
        <input
          type="hidden"
          name="images"
          value={p?.images.join(", ") ?? ""}
        />
        <input type="file" name="image" accept="image/*" class="field mt-1" />
        <p class="mt-1 text-sm opacity-70">
          Aktuell: {p?.images.join(", ") || "—"}
        </p>
      </div>

      <div>
        <span class="eyebrow opacity-70">Varianten</span>
        <div class="mt-2">
          <VariantEditor initial={p?.variants ?? []} />
        </div>
      </div>

      <button type="submit" class="button w-fit">Speichern</button>
    </form>
  );
}
