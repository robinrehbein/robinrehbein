import { useRef, useState } from "preact/hooks";

const acceptedExtensions = [".stl", ".step", ".stp", ".3mf"];

function isAccepted(file: File) {
  const name = file.name.toLowerCase();
  return acceptedExtensions.some((extension) => name.endsWith(extension));
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function ModelFileDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");

  function updateSelection(file: File) {
    setSelectedFile(file.name);
    setSelectedSize(formatFileSize(file.size));
    setError("");
  }

  function assignDroppedFile(file: File) {
    if (!isAccepted(file)) {
      setError("Bitte STL, STEP, STP oder 3MF verwenden.");
      return;
    }

    const input = inputRef.current;
    if (input) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    updateSelection(file);
  }

  return (
    <div class="grid gap-2">
      <span class="eyebrow">STL, STEP oder 3MF Datei</span>
      <label
        class={`file-dropzone ${isDragging ? "is-dragging" : ""} ${
          error ? "has-error" : ""
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer?.files?.[0];
          if (file) assignDroppedFile(file);
        }}
      >
        <input
          ref={inputRef}
          class="sr-only"
          name="model"
          type="file"
          accept={acceptedExtensions.join(",")}
          required
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            if (!isAccepted(file)) {
              event.currentTarget.value = "";
              setError("Bitte STL, STEP, STP oder 3MF verwenden.");
              return;
            }
            updateSelection(file);
          }}
        />
        <span class="file-dropzone__icon" aria-hidden="true">STL</span>
        <span class="file-dropzone__copy">
          <strong>
            {selectedFile || "Modelldatei auswaehlen"}
          </strong>
          <span>
            {selectedFile
              ? `${selectedSize} bereit fuer die technische Pruefung`
              : "STL, STEP/STP oder 3MF per Drag-and-drop oder Klick hochladen"}
          </span>
        </span>
      </label>
      {error && <p class="file-dropzone__error">{error}</p>}
    </div>
  );
}
