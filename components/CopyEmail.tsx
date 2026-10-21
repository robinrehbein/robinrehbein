import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => { setReady(Boolean(navigator.clipboard?.writeText)); }, []);
  return ready ? <span className="copy-email">
    <button type="button" className="text-button copy-email-button" onClick={async () => {
      try { await navigator.clipboard.writeText(email); setStatus("Email copied."); }
      catch { setStatus("Could not copy. Please select the email address or use the email link."); }
    }} aria-label="Copy email address" title="Copy email address"><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/></svg></button>
    <span role="status" className="copy-status">{status}</span>
  </span> : null;
}
