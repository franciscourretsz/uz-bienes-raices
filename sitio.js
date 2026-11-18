const catalogo = window.catalogoUZ.filter(propiedad => propiedad.activa);
const filtros = {
  operacion: document.querySelector("#operation"),
  tipo: document.querySelector("#type"),
  barrio: document.querySelector("#area")
};
const tarjetas = document.querySelector("#cards");
const contador = document.querySelector("#count");
const ficha = document.querySelector("#detail");
const contenido = document.querySelector("#detail-content");
let enlaceActivo;

function elemento(etiqueta, texto, clase) {
  const nodo = document.createElement(etiqueta);
  if (texto) nodo.textContent = texto;
  if (clase) nodo.className = clase;
  return nodo;
}

function whatsapp(mensaje) {
  return "https://wa.me/5493516133282?text=" + encodeURIComponent(mensaje);
}

function imagen(foto) {
  const img = elemento("img");
  img.src = foto.src;
  img.alt = foto.alt;
  img.loading = "lazy";
  return img;
}

function abrirFicha(propiedad, enlace) {
  enlaceActivo = enlace;
  const etiqueta = elemento("p", propiedad.operacion + (propiedad.ejemplo ? " · Ficha de muestra" : ""), "label");
  const titulo = elemento("h2", propiedad.titulo);
  titulo.id = "detail-title";
  const galeria = elemento("div", "", "gallery");
  galeria.append(...propiedad.fotos.map(imagen));
  const detalles = elemento("ul", "", "facts");
  detalles.append(...propiedad.detalles.map(dato => elemento("li", dato)));
  const consulta = elemento("a", propiedad.ejemplo ? "Consultar por propiedades similares ↗" : "Consultar esta propiedad por WhatsApp ↗", "button");
  const mensaje = propiedad.ejemplo
    ? "Hola, busco una propiedad similar a la ficha de muestra «" + propiedad.titulo + "» en " + propiedad.barrio + "."
    : "Hola, quiero consultar por " + propiedad.titulo + " en " + propiedad.barrio + " (" + propiedad.id + ").";
  consulta.href = whatsapp(mensaje);
  contenido.replaceChildren(etiqueta, titulo, elemento("p", propiedad.barrio + " · Córdoba Capital"), galeria,
    elemento("p", propiedad.precio, "price"), elemento("p", propiedad.descripcion), detalles, consulta);
  if (!ficha.open) ficha.showModal();
}

function tarjeta(propiedad) {
  const article = elemento("article", "", "card");
  const cuerpo = elemento("div", "", "card-body");
  const enlace = elemento("a", "Ver ficha ↗");
  enlace.href = "#ficha-" + propiedad.id;
  enlace.setAttribute("aria-label", "Ver ficha de " + propiedad.titulo);
  enlace.addEventListener("click", evento => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
    evento.preventDefault();
    if (location.hash !== enlace.hash) history.pushState(null, "", enlace.hash);
    abrirFicha(propiedad, enlace);
  });
  cuerpo.append(
    elemento("p", propiedad.operacion + (propiedad.ejemplo ? " · Ejemplo" : ""), "label"),
    elemento("h3", propiedad.titulo),
    elemento("p", propiedad.tipo + " · " + propiedad.barrio),
    elemento("p", propiedad.precio, "price"),
    enlace
  );
  if (propiedad.fotos.length) article.append(imagen(propiedad.fotos[0]));
  article.append(cuerpo);
  return article;
}

function mostrarCatalogo() {
  const resultados = catalogo.filter(propiedad =>
    Object.entries(filtros).every(([campo, filtro]) => !filtro.value || filtro.value === propiedad[campo])
  );
  contador.textContent = resultados.length === 1 ? "1 propiedad" : resultados.length + " propiedades";
  tarjetas.replaceChildren(...resultados.map(tarjeta));
  if (!resultados.length) {
    const consulta = elemento("a", "Contanos qué estás buscando ↗");
    consulta.href = whatsapp("Hola, estoy buscando una propiedad en Córdoba.");
    const vacio = elemento("div");
    vacio.append(elemento("p", "No encontramos propiedades con estos filtros."), consulta);
    tarjetas.append(vacio);
  }
}

for (const campo of ["tipo", "barrio"]) {
  const valores = [...new Set(catalogo.map(propiedad => propiedad[campo]))];
  valores.sort((a, b) => a.localeCompare(b, "es"));
  for (const valor of valores) filtros[campo].add(new Option(valor));
}
for (const filtro of Object.values(filtros)) filtro.addEventListener("change", mostrarCatalogo);
document.querySelector("#reset").addEventListener("click", () => {
  for (const filtro of Object.values(filtros)) filtro.value = "";
  mostrarCatalogo();
});
for (const enlace of document.querySelectorAll("[data-operation]")) {
  enlace.addEventListener("click", () => {
    filtros.operacion.value = enlace.dataset.operation;
    filtros.tipo.value = "";
    filtros.barrio.value = "";
    mostrarCatalogo();
  });
}
for (const enlace of document.querySelectorAll("[data-message]")) {
  enlace.href = whatsapp(enlace.dataset.message);
}

function sincronizarFicha() {
  const propiedad = catalogo.find(item => "#ficha-" + item.id === location.hash);
  if (propiedad) abrirFicha(propiedad, tarjetas.querySelector('a[href="' + location.hash + '"]'));
  else if (ficha.open) ficha.close();
}

ficha.addEventListener("close", () => {
  if (location.hash.startsWith("#ficha-")) history.replaceState(null, "", "#propiedades");
  if (enlaceActivo) enlaceActivo.focus();
});
window.addEventListener("hashchange", sincronizarFicha);
document.querySelector("#listing-note").hidden = !catalogo.some(propiedad => propiedad.ejemplo);
mostrarCatalogo();
sincronizarFicha();
