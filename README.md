# Karate Cat

## Probar en local

```bash
npm test
```

## Probar en móvil (misma red Wi-Fi)

```bash
npm run serve:mobile
```

Opcional: puerto custom.

```bash
bash scripts/run-mobile.sh 8080
```

Abre en tu Android la URL que imprime el script (por ejemplo `http://192.168.1.10:4173`).

## Despliegue en GitHub Pages con Actions

Este repo incluye el workflow `.github/workflows/deploy-pages.yml` para desplegar automáticamente en GitHub Pages cuando hay push a `main`.

### Activación (una sola vez)

1. Ve a **Settings → Pages** en tu repositorio.
2. En **Source**, selecciona **GitHub Actions**.
3. Haz push a `main` (o lanza el workflow manualmente desde **Actions**).

### Resultado

GitHub publicará el juego en una URL como:

`https://<tu-usuario>.github.io/<tu-repo>/`

Esa URL funciona desde móvil sin estar en la misma red local.
