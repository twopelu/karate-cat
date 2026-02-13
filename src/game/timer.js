export function createCountdown(seconds, onTick, onEnd) {
  let remaining = seconds;
  let start = performance.now();
  let stopped = false;
  onTick(remaining);

  const id = setInterval(() => {
    const elapsed = Math.floor((performance.now() - start) / 1000);
    const next = Math.max(0, seconds - elapsed);
    if (next !== remaining) {
      remaining = next;
      onTick(remaining);
    }
    if (remaining <= 0) {
      clearInterval(id);
      if (!stopped) {
        onEnd();
      }
    }
  }, 100);

  return () => {
    stopped = true;
    clearInterval(id);
  };
}
