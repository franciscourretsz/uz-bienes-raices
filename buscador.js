const buscador = document.querySelector("#guided-form");
const resultadosGuiados = document.querySelector("#guided-results");
const estadoGuiado = document.querySelector("#guided-status");
const tarjetasGuiadas = document.querySelector("#guided-cards");
const enviarBusqueda = document.querySelector("#guided-whatsapp");
const atributosBusqueda = { cochera: "cochera", balcon: "balcón", jardin: "jardín" };

function normalizarZona(zona) {
  return zona.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function leerBusqueda(datos) {
  return {
    operacion: datos.get("operacion"),
    presupuesto: Number(datos.get("presupuesto")) || null,
    moneda: datos.get("moneda"),
    zonas: (datos.get("zonas") || "").split(",").map(zona => zona.trim()).filter(Boolean),
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
  enviarBusqueda.href = whatsapp(mensajeBusqueda(busqueda));
}

buscador.addEventListener("input", () => {
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
actualizarMensaje();
