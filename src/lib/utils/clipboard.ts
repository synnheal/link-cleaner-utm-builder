export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

export async function shareUrl(url: string, title?: string): Promise<boolean> {
  if (!canShare()) return false;
  try {
    await navigator.share({ title: title || "Link Toolkit", url });
    return true;
  } catch {
    return false;
  }
}
