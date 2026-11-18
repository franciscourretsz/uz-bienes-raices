const buscador = document.querySelector("#guided-form");
const resultadosGuiados = document.querySelector("#guided-results");
const estadoGuiado = document.querySelector("#guided-status");
const tarjetasGuiadas = document.querySelector("#guided-cards");
const enviarBusqueda = document.querySelector("#guided-whatsapp");
const resumenZonas = document.querySelector("#guided-zone-summary");
const todasZonas = document.querySelector("#guided-all-zones");
const otraZona = document.querySelector("#guided-other-zone");
const etiquetaOtraZona = document.querySelector("#guided-other-label");
const campoOtraZona = document.querySelector("#guided-other-input");
const opcionesZonas = document.querySelector("#guided-zone-options");
const barriosOfrecidos = new Set([...opcionesZonas.querySelectorAll('[name="zonas"]')].map(opcion => normalizarZona(opcion.value)));
for (const propiedad of catalogo) {
  const barrio = normalizarZona(propiedad.barrio);
  if (!barrio || barriosOfrecidos.has(barrio)) continue;
  barriosOfrecidos.add(barrio);
  const opcion = document.createElement("input");
  opcion.type = "checkbox";
  opcion.name = "zonas";
  opcion.value = propiedad.barrio;
  const etiqueta = document.createElement("label");
  etiqueta.append(opcion, " " + propiedad.barrio);
  opcionesZonas.insertBefore(etiqueta, otraZona.closest("label"));
}
const atributosBusqueda = { cochera: "cochera", balcon: "balcón", jardin: "jardín" };

function normalizarZona(zona) {
  return zona.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function leerBusqueda(datos) {
  const zonas = datos.getAll("zonas");
  const otra = (datos.get("otraZona") || "").trim();
  if (otra) zonas.push(otra);
  return {
    operacion: datos.get("operacion"),
    presupuesto: Number(datos.get("presupuesto")) || null,
    moneda: datos.get("moneda"),
    zonas,
    requisitos: Object.keys(atributosBusqueda).filter(clave => datos.get(clave) === "requisito"),
    preferencias: Object.keys(atributosBusqueda).filter(clave => datos.get(clave) === "preferencia")
  };
}

function buscarPropiedades(propiedades, busqueda) {
  const zonas = busqueda.zonas.map(normalizarZona);
  return propiedades.filter(propiedad => {
    const caracteristicas = propiedad.caracteristicas ?? {};
    return propiedad.operacion === busqueda.operacion
      && (!zonas.length || zonas.includes(normalizarZona(propiedad.barrio)))
      && (!busqueda.presupuesto || (
        propiedad.moneda === busqueda.moneda
        && Number.isFinite(propiedad.monto)
        && propiedad.monto > 0
        && propiedad.monto <= busqueda.presupuesto
      ))
      && busqueda.requisitos.every(clave => caracteristicas[clave] === true);
  }).map(propiedad => {
    const caracteristicas = propiedad.caracteristicas ?? {};
    return {
      propiedad,
      preferencias: busqueda.preferencias.filter(clave => caracteristicas[clave] === true),
      pendientes: busqueda.preferencias.filter(clave => typeof caracteristicas[clave] !== "boolean")
    };
  }).sort((a, b) => b.preferencias.length - a.preferencias.length);
}

function mensajeBusqueda(busqueda) {
  const accion = busqueda.operacion === "Venta" ? "comprar" : "alquilar";
  const lineas = ["Hola, UZ. Estoy buscando una propiedad para " + accion + "."];
  if (busqueda.presupuesto) lineas.push("Presupuesto máximo: " + busqueda.moneda + " " + busqueda.presupuesto.toLocaleString("es-AR"));
  if (busqueda.zonas.length) lineas.push("Zonas: " + busqueda.zonas.join(", "));
  if (busqueda.requisitos.length) lineas.push("Imprescindible: " + busqueda.requisitos.map(clave => atributosBusqueda[clave]).join(", "));
  if (busqueda.preferencias.length) lineas.push("Deseable: " + busqueda.preferencias.map(clave => atributosBusqueda[clave]).join(", "));
  lineas.push("¿Tienen alguna opción que encaje?");
  return lineas.join("\n");
}

function actualizarMensaje() {
  const busqueda = leerBusqueda(new FormData(buscador));
  resumenZonas.textContent = busqueda.zonas.length ? busqueda.zonas.join(", ") : "Todos";
  enviarBusqueda.href = whatsapp(mensajeBusqueda(busqueda));
}

function sincronizarZonas(origen) {
  const barrios = [...opcionesZonas.querySelectorAll('[name="zonas"]')];
  if (origen === todasZonas && todasZonas.checked) {
    for (const barrio of barrios) barrio.checked = false;
    otraZona.checked = false;
  }
  todasZonas.checked = !otraZona.checked && !barrios.some(barrio => barrio.checked);
  etiquetaOtraZona.hidden = !otraZona.checked;
  campoOtraZona.disabled = !otraZona.checked;
  campoOtraZona.required = otraZona.checked;
  campoOtraZona.setCustomValidity(otraZona.checked && !campoOtraZona.value.trim()
    ? "Escribí el barrio o zona que buscás."
    : "");
}

buscador.addEventListener("input", evento => {
  sincronizarZonas(evento.target);
  actualizarMensaje();
  resultadosGuiados.hidden = true;
  tarjetasGuiadas.replaceChildren();
});
enviarBusqueda.addEventListener("click", evento => {
  if (!buscador.reportValidity()) evento.preventDefault();
});
buscador.addEventListener("submit", evento => {
  evento.preventDefault();
  const busqueda = leerBusqueda(new FormData(buscador));
  const resultados = buscarPropiedades(catalogo, busqueda);
  const total = resultados.length;
  estadoGuiado.textContent = total
    ? total + (total === 1 ? " propiedad coincide" : " propiedades coinciden") + " con tus requisitos."
    : "No hay coincidencias confirmadas. Podés ajustar la búsqueda o mandársela a UZ.";
  tarjetasGuiadas.replaceChildren(...resultados.map(resultado => {
    const ficha = tarjeta(resultado.propiedad);
    const cuerpo = ficha.querySelector(".card-body");
    if (busqueda.requisitos.length) cuerpo.append(elemento("p", "Cumple los requisitos que marcaste."));
    if (busqueda.preferencias.length) cuerpo.append(elemento("p", resultado.preferencias.length + " de " + busqueda.preferencias.length + " preferencias confirmadas."));
    if (resultado.pendientes.length) cuerpo.append(elemento("p", "Por confirmar: " + resultado.pendientes.map(clave => atributosBusqueda[clave]).join(", ") + "."));
    return ficha;
  }));
  resultadosGuiados.hidden = false;
  actualizarMensaje();
});
sincronizarZonas();
actualizarMensaje();
