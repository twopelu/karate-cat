#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"

if command -v hostname >/dev/null 2>&1; then
  IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
else
  IP=""
fi

if [ -z "${IP}" ]; then
  IP="<IP_DE_TU_PC>"
fi

echo "🚀 Karate Cat server iniciado"
echo "- Local:   http://localhost:${PORT}"
echo "- Móvil:   http://${IP}:${PORT}"
echo "(Móvil y PC deben estar en la misma red Wi-Fi)"
echo

exec python3 -m http.server "${PORT}" --bind 0.0.0.0
