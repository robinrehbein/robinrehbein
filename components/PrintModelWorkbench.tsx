const viewerMaterials = [
  "PLA Matte",
  "PETG",
  "PETG Transparent",
  "ABS/ASA",
  "Woodfill",
  "TPU Flex",
];

export default function PrintModelWorkbench() {
  return (
    <section class="viewer-shell" data-print-viewer>
      <div class="viewer-toolbar">
        <label>
          <span>Material</span>
          <select data-viewer-material value="PLA Matte">
            {viewerMaterials.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Farbe</span>
          <input data-viewer-color type="color" value="#c85f39" />
        </label>
        <label>
          <span>Layer</span>
          <input
            data-viewer-layer
            type="number"
            min="0.05"
            max="0.6"
            step="0.01"
            value="0.2"
          />
        </label>
        <label>
          <span>Nozzle</span>
          <input
            data-viewer-nozzle
            type="number"
            min="0.2"
            max="1.2"
            step="0.05"
            value="0.4"
          />
        </label>
        <label class="viewer-toggle">
          <input data-viewer-layers type="checkbox" checked />
          <span>Layer lines</span>
        </label>
      </div>

      <div class="viewer-canvas" data-viewer-dropzone>
        <div data-viewer-mount class="viewer-mount" />
        <div class="viewer-overlay">
          <span class="viewer-status idle" data-viewer-status>Bereit</span>
          <strong data-viewer-file>Modell ablegen oder klicken</strong>
          <span data-viewer-message>STL, STEP/STP oder 3MF hier ablegen.</span>
        </div>
      </div>

      <div class="viewer-meta">
        <span data-viewer-dimensions>Noch kein Modell geladen</span>
        <span data-viewer-layer-meta>0.20 mm Layer</span>
        <span data-viewer-nozzle-meta>0.40 mm Nozzle</span>
      </div>
    </section>
  );
}
