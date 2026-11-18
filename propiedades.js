// Editá este archivo para publicar, actualizar o retirar una propiedad.
// Las imágenes pueden ser rutas relativas como "fotos/casa-frente.webp".
window.catalogoUZ = [
  {
    id: "casa-parque-capital",
    ejemplo: true,
    activa: true,
    operacion: "Venta",
    tipo: "Casa",
    barrio: "Parque Capital",
    titulo: "Casa con jardín",
    precio: "USD 145.000",
    monto: 145000,
    moneda: "USD",
    caracteristicas: { cochera: true, jardin: true },
    descripcion: "Ejemplo de una casa con espacios abiertos y jardín. La ficha muestra cómo se presenta una propiedad de venta.",
    detalles: ["3 dormitorios", "2 baños", "180 m² cubiertos", "Cochera"],
    fotos: [
      { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1100&q=80", alt: "Fachada de una casa contemporánea" }
    ]
  },
  {
    id: "departamento-nueva-cordoba",
    ejemplo: true,
    activa: true,
    operacion: "Alquiler",
    tipo: "Departamento",
    barrio: "Nueva Córdoba",
    titulo: "Departamento luminoso",
    precio: "Consultar precio",
    caracteristicas: { balcon: true },
    descripcion: "Ejemplo de una ficha de alquiler con datos de superficie y ambientes.",
    detalles: ["1 dormitorio", "1 baño", "52 m² cubiertos"],
    fotos: [
      { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=80", alt: "Living luminoso con sofá y ventanales" }
    ]
  },
  {
    id: "casa-villa-belgrano",
    ejemplo: true,
    activa: true,
    operacion: "Venta",
    tipo: "Casa",
    barrio: "Villa Belgrano",
    titulo: "Casa con pileta",
    precio: "USD 220.000",
    monto: 220000,
    moneda: "USD",
    caracteristicas: { cochera: true, jardin: true },
    descripcion: "Ejemplo de una ficha de venta para una casa con jardín y pileta.",
    detalles: ["3 dormitorios", "3 baños", "210 m² cubiertos", "Cochera"],
    fotos: [
      { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1100&q=80", alt: "Casa de dos plantas con pileta" }
    ]
  }
];
