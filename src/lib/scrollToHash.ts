/** Scrolls to a section id inside the snap container, also works on regular pages. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  // Try a few times in case the target page is still mounting after navigation.
  let tries = 0;
  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (tries++ < 20) setTimeout(tick, 80);
  };
  tick();
}
