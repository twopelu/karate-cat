export function createEmitter() {
  const listeners = new Map();

  function on(event, handler) {
    const group = listeners.get(event) ?? [];
    group.push(handler);
    listeners.set(event, group);
    return () => off(event, handler);
  }

  function off(event, handler) {
    const group = listeners.get(event);
    if (!group) return;
    listeners.set(
      event,
      group.filter((listener) => listener !== handler)
    );
  }

  function emit(event, payload) {
    const group = listeners.get(event) ?? [];
    group.forEach((handler) => handler(payload));
  }

  return { on, off, emit };
}
