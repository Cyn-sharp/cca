// Copies text to the clipboard. Returns true if it worked.
export async function copyText(text) {
  // Modern API — needs HTTPS and permission
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fall through to the older method
  }

  // Older method — works in more places (e.g. inside embedded previews)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}
