// Activate only after the dialog is mounted; never read browser state during SSR.
export function activateDialogKeyboard(dialog, returnFocus, onClose) {
  const document = dialog.ownerDocument;
  const controls = () => Array.from(dialog.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(element => element.getClientRects().length > 0);

  (controls()[0] ?? dialog).focus();
  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const items = controls();
    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;
    if (!first) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }
  document.addEventListener("keydown", onKeyDown);
  return () => {
    document.removeEventListener("keydown", onKeyDown);
    if (returnFocus?.isConnected) returnFocus.focus();
  };
}
