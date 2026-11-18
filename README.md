# UZ Bienes Raíces

Vidriera inmobiliaria estática para GitHub Pages. Abrí `index.html` para revisar la versión local.

## Actualizar el catálogo

1. Editá `propiedades.js` en GitHub con el icono del lápiz.
2. Duplicá una ficha y usá un `id` único en minúsculas, con guiones. Completá operación, tipo, barrio, título, precio, descripción y detalles.
3. Subí las fotos a una carpeta `fotos` y usá sus rutas relativas en `fotos` de la ficha. Agregá una descripción de cada imagen en `alt`.
4. Para una ficha real, poné `ejemplo: false`. Para ocultar una ficha, poné `activa: false`.
5. Guardá el cambio en la rama publicada. Cada ficha activa se puede compartir usando su enlace.

## Publicar la versión de revisión

Subí los archivos a la raíz del repositorio. En Settings → Pages, elegí Deploy from a branch, rama `main` y carpeta `/(root)`.

Antes del lanzamiento, cargá propiedades reales, desactivá las fichas de muestra, reemplazá la imagen ilustrativa de portada, completá MP XXXX en `index.html` y confirmá los destinos de WhatsApp. Cuando esté lista para aparecer en buscadores, quitá la etiqueta `noindex`.

Las imágenes de muestra se sirven desde Unsplash.


## Datos para la búsqueda guiada

En cada ficha, agregá `monto` como número y `moneda` como `"ARS"` o `"USD"` cuando el precio esté confirmado. En `caracteristicas` podés completar `cochera`, `balcon` y `jardin` con `true` o `false`. Omití los valores pendientes. Una propiedad con un requisito sin confirmar no se presenta como coincidencia.


La lista de zonas combina los barrios de las fichas activas con `zonasServicio` en `buscador.js`. Usá esa lista para incluir barrios donde UZ recibe consultas aunque todavía no tenga fichas publicadas.
