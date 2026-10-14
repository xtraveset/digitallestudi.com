# Digitall Estudi — landing estática

Página estática en HTML y CSS, sin JavaScript, frameworks ni fuentes remotas. Las fotografías se sirven en WebP con tamaños adaptables; el resto de imágenes tiene alternativas de texto y dimensiones para evitar saltos durante la carga. El contacto utiliza `mailto:` para abrir la aplicación de correo de cada visitante.

## SEO incluido

- Título y descripción de búsqueda, URL canónica y metadatos Open Graph/Twitter.
- Datos estructurados `WebSite` y `Person` en JSON-LD.
- `robots.txt`, `sitemap.xml`, un solo H1 y texto alternativo para las imágenes informativas.
- Carga diferida en imágenes fuera del primer bloque y prioridad alta para la imagen principal.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta (`index.html`, `styles.css`, `assets/`, `robots.txt`, `sitemap.xml` y este README) a la raíz del repositorio `xtraveset/digitallestudi.com`.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/(root)`.
4. Guarda los cambios. GitHub Pages publicará la web en la URL que muestra esa pantalla.

La URL canónica está preparada para `https://digitallestudi.com/`. Cuando conectes el dominio desde **Settings → Pages → Custom domain**, configura en cdmon los registros web que indique GitHub Pages. Conserva los registros MX de Zoho para que siga funcionando el correo.

## Verificación pendiente tras publicar

Al estar aún en preparación para publicación, no hay una medición PageSpeed real del alojamiento. Una vez activa la URL pública, ejecútala en PageSpeed Insights en móvil y escritorio, y añade `https://digitallestudi.com/sitemap.xml` a Google Search Console. Las puntuaciones de laboratorio pueden variar según la red y el dispositivo; los datos de experiencia real aparecen cuando Google dispone de suficientes visitas.
