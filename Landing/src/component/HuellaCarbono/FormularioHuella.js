import React, { useState, useRef } from "react";
import departamentosMunicipios from "../../data/departamentos_municipios.json";
import { Container, Row, Col, Card, CardBody, Button, Table, FormGroup, Label, Input } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import "../../assets/css/formulario.css";
// Endpoints API countriesnow.space
const API_COUNTRIES = "https://countriesnow.space/api/v0.1/countries/positions";
const API_STATES = "https://countriesnow.space/api/v0.1/countries/states";
const API_CITIES = "https://countriesnow.space/api/v0.1/countries/state/cities";

// Utilidad para calcular distancia haversine en km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // Radio de la tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// Función para obtener coordenadas de una ciudad usando OpenStreetMap Nominatim (ahora con ciudad, estado y país)
async function getCoords(city, state, country) {
  // Construir la consulta con todos los datos
  const params = [
    `city=${encodeURIComponent(city)}`,
    state ? `state=${encodeURIComponent(state)}` : "",
    country ? `country=${encodeURIComponent(country)}` : "",
    "format=json"
  ].filter(Boolean).join("&");
  const url = `https://nominatim.openstreetmap.org/search?${params}`;
  const response = await fetch(url);
  const data = await response.json();
  // Validar que el resultado corresponde al país y estado
  if (data.length > 0) {
    // Opcional: filtrar por país y estado si la API devuelve varios resultados
    const match = data.find(
      d => d.display_name.includes(country) && (state ? d.display_name.includes(state) : true)
    );
    if (match) {
      return { lat: parseFloat(match.lat), lon: parseFloat(match.lon) };
    }
    // Si no hay match exacto, usar el primero
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  return null;
}

// Factores de ejemplo para combustibles gaseosos
const FACTORES_GASEOSOS = [
  { nombre: "Biogas Genérico", poderCalorifico: 22.0001, factorCO2: 84364.4183, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 0.1 },
  { nombre: "Coke Gas Genérico", poderCalorifico: 15.0252, factorCO2: 40784.0416, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 0.1 },
  { nombre: "Gas Natural Cusiana", poderCalorifico: 38.6735, factorCO2: 56647.7825, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Natural Guajira", poderCalorifico: 33.4943, factorCO2: 54911.3424, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Natural Guepaje", poderCalorifico: 33.2687, factorCO2: 54689.5797, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Natural Neiva - Huila", poderCalorifico: 37.259, factorCO2: 54618.0888, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Opon Payoa", poderCalorifico: 35.4292, factorCO2: 55801.0446, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Cupiagua", poderCalorifico: 37.935, factorCO2: 56980.0106, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas La Creciente", poderCalorifico: 13.5056, factorCO2: 54667.7823, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas Natural Genérico", poderCalorifico: 35.6522, factorCO2: 55539.0869, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 3 },
  { nombre: "Gas de Pozo Cupiagua", poderCalorifico: 40.5725, factorCO2: 56225.4566, factorCH4: 1, factorN2O_est: 0.1, factorN2O_mov: 0.1 }
];

const FACTORES_SOLIDOS = [
  { nombre: "Carbón Genérico", poderCalorifico: 28.7600, factorCO2: 88136.0630, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 3101.7541 },
  { nombre: "Carbón Guajira - Cesar", poderCalorifico: 26.6220, factorCO2: 81163.1560, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 1133.7889 },
  { nombre: "Carbón Guajira", poderCalorifico: 30.4170, factorCO2: 95146.4460, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 427.5182 },
  { nombre: "Carbón Cundinamarca", poderCalorifico: 29.1720, factorCO2: 75915.0750, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 578.8202 },
  { nombre: "Carbón Cauca - Valle del Cauca", poderCalorifico: 31.2120, factorCO2: 80341.1980, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 10011.7045 },
  { nombre: "Carbón Norte de Santander", poderCalorifico: 31.2920, factorCO2: 90087.8940, factorCH4: 1.20, factorN2O: 1.50, factorSO2: 671.8226 },
  { nombre: "Carbón Córdoba-Norte de Antioquia", poderCalorifico: 20.9480, factorCO2: 90854.3910, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 1430.7775 },
  { nombre: "Carbón Santander", poderCalorifico: 33.0770, factorCO2: 77405.1450, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 11860.2824 },
  { nombre: "Carbón Santander Sogamoso", poderCalorifico: 29.2050, factorCO2: 92142.0410, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 738.9073 },
  { nombre: "Carbón Boyacá", poderCalorifico: 35.2060, factorCO2: 86711.4470, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 308.9193 },
  { nombre: "Carbón Antioquia", poderCalorifico: 24.4050, factorCO2: 93317.3110, factorCH4: 1.00, factorN2O: 1.50, factorSO2: 1399.6315 },
  { nombre: "Bagazo", poderCalorifico: 14.7430, factorCO2: 112371.9450, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 47.4357 },
  { nombre: "Fibra de palma", poderCalorifico: 16.9600, factorCO2: 115524.9500, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 240.1597 },
  { nombre: "Cuesco de palma", poderCalorifico: 18.9790, factorCO2: 107438.3300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 32.6761 },
  { nombre: "Raquis de palma", poderCalorifico: 18.9790, factorCO2: 107438.3300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 153.6714 },
  { nombre: "Cascarilla de Arroz", poderCalorifico: 14.5600, factorCO2: 103875.9900, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 122.3044 },
  { nombre: "Borra de Café", poderCalorifico: 24.5600, factorCO2: 90676.9600, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 78.0258 },
  { nombre: "Cisco de Café", poderCalorifico: 19.9500, factorCO2: 89525.0270, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 0.0000 },
  { nombre: "Leña", poderCalorifico: 16.9930, factorCO2: 89525.0270, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 0.0000 },
  { nombre: "Madera Genérico", poderCalorifico: 18.9790, factorCO2: 115524.9500, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 21.6142 },
  { nombre: "Madera Eucalipto", poderCalorifico: 18.9690, factorCO2: 103923.9300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 5.2668 },
  { nombre: "Madera Pino", poderCalorifico: 18.9690, factorCO2: 103923.9300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 21.3772 },
  { nombre: "Madera Acacia", poderCalorifico: 18.9690, factorCO2: 103923.9300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 21.3772 },
  { nombre: "Madera Melina", poderCalorifico: 18.9690, factorCO2: 103923.9300, factorCH4: 30.00, factorN2O: 4.00, factorSO2: 21.3772 },
  { nombre: "Residuos de llantas", poderCalorifico: 37.9210, factorCO2: 77577.4880, factorCH4: 30.00, factorN2O: 0.10, factorSO2: 1124.9715 }
];

// Factores completos para combustibles líquidos
const FACTORES_LIQUIDOS = [
  { nombre: "Kerosene", densidad: 0.803, poderCalorifico: 42.8168, factorCO2: 73399.639, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 42.0002 },
  { nombre: "Combustoleo", densidad: 0.97, poderCalorifico: 39.3469, factorCO2: 80460.272, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 1269.5595 },
  { nombre: "Crudo de Castilla", densidad: 0.9414, poderCalorifico: 40.6705, factorCO2: 77841.778, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 1080.8539 },
  { nombre: "Avigas", densidad: 0.696, poderCalorifico: 43.0302, factorCO2: 56337.812, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 2.4146 },
  { nombre: "Jet A1", densidad: 0.826, poderCalorifico: 43.5769, factorCO2: 88461.137, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 30.6653 },
  { nombre: "Biodiesel palma", densidad: 0.8751, poderCalorifico: 37.9079, factorCO2: 54806.487, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 2.4247 },
  { nombre: "Etanol Anhidro", densidad: 0.8208, poderCalorifico: 22.4802, factorCO2: 84758.116, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 4.0847 },
  { nombre: "Fuel Oil # 4 - Ecopetrol", densidad: 0.8493, poderCalorifico: 40.4422, factorCO2: 78281.203, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 3.0827 },
  { nombre: "Gasolina Motor", densidad: 0.7475, poderCalorifico: 45.3295, factorCO2: 69923.668, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 2.9676 },
  { nombre: "Diesel Marino", densidad: 0.8519, poderCalorifico: 42.8185, factorCO2: 74193.483, factorCH4: 1, factorN2O_est: 0.6, factorSO2: 4.3905 },
  { nombre: "Diesel B2", densidad: 0.8519, poderCalorifico: 42.8185, factorCO2: 74193.483, factorCH4: 1, factorN2O_est: 0.6, factorSO2: 3.5705 },
  { nombre: "Gasolina E10 (Comercial)", densidad: 0.745, poderCalorifico: 45.2318, factorCO2: 68911.812, factorCH4: 3, factorN2O_est: 0.6, factorSO2: 10.9589 },
  { nombre: "GLP Cartagena", densidad: 0.5599, poderCalorifico: 45.4133, factorCO2: 67174.755, factorCH4: 3, factorN2O_est: 0.1, factorSO2: 0 },
  { nombre: "GLP Barrancabermeja", densidad: 0.5599, poderCalorifico: 45.2318, factorCO2: 68911.812, factorCH4: 3, factorN2O_est: 0.1, factorSO2: 0 },
  { nombre: "GLP Cusiana", densidad: 0.5343, poderCalorifico: 45.7431, factorCO2: 65846.382, factorCH4: 3, factorN2O_est: 0.1, factorSO2: 0 },
  { nombre: "GLP Genérico", densidad: 0.5599, poderCalorifico: 45.4145, factorCO2: 67185.115, factorCH4: 3, factorN2O_est: 0.1, factorSO2: 0 }
];

const REQUIRED_FIELDS = [
  "nombreEmpresa", "nit", "direccion", "departamento", "municipio", "añoBase", "fechaReporte", "telefono", "correo", "personaElabora", "cargo"
];

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

// Factor eléctrico
const FACTOR_ELECTRICO = 0.391;

const FormularioHuella = ({ onFormComplete }) => {
  // Estado para datosEmpresa debe ir al inicio del componente
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombreEmpresa: "",
    nit: "",
    direccion: "",
    departamento: "",
    municipio: "",
    añoBase: "",
    fechaReporte: getToday(),
    telefono: "",
    correo: "",
    personaElabora: "",
    cargo: ""
  });

  // =============== TODOS LOS ESTADOS DE FORMULARIOS ===============
  // Estados para vuelos
  const [vuelos, setVuelos] = useState([
    { origen: "", destino: "", clase: "", personas: "", tipoVuelo: "", factor: "", distancia: "", emisionKg: "", emisionTon: "" }
  ]);
  
  // Estados para extintores
  const [extintores, setExtintores] = useState([
    { tipo: '', cantidad: '', pcg: '', emisionesParciales: '' }
  ]);
  
  // Estados para sólidos
  const [solidos, setSolidos] = useState([
    { tipo: '', consumo: '', factor: '', emision: '' }
  ]);
  
  // Estados para líquidos estacionarios
  const [liquidos, setLiquidos] = useState([
    { tipo: '', consumo: '', factor: '', emision: '' }
  ]);
  
  // Estados para líquidos móviles
  const [liquidosMoviles, setLiquidosMoviles] = useState([
    { tipo: '', consumo: '', factor: '', emision: '' }
  ]);
  
  // Estados para gaseosos
  const [gaseosos, setGaseosos] = useState([
    { tipo: '', consumo: '', factor: '', emision: '' }
  ]);
  
  // Estados para gaseosos móviles
  const [gaseososMoviles, setGaseososMoviles] = useState([
    { tipo: '', consumo: '', factor: '', emision: '' }
  ]);
  
  // Estados para electricidad
  const [electricidad, setElectricidad] = useState([
    { sede: '', consumo: '', factor: 0.4239, emision: '' }
  ]);

  // Estados para el control de pasos y cálculos
  const [step, setStep] = useState(1);
  const [resumenCalculado, setResumenCalculado] = useState(false);
  const resumenRef = useRef(null);

  // Datos generales
  // Estado para datosEmpresa debe ir antes de municipiosFiltrados
  // (Eliminado: declaración duplicada de datosEmpresa y setDatosEmpresa)

  // Departamentos y municipios desde el JSON (arreglo de objetos)
  const departamentos = departamentosMunicipios.map(d => d.departamento);
  const municipiosFiltrados = datosEmpresa.departamento
    ? (departamentosMunicipios.find(d => d.departamento === datosEmpresa.departamento)?.municipios || [])
    : [];

  // Selects encadenados para vuelos corporativos (igual que prueba)
  const [paisOrigenVuelo, setPaisOrigenVuelo] = useState("");
  const [estadoOrigenVuelo, setEstadoOrigenVuelo] = useState("");
  const [ciudadOrigenVuelo, setCiudadOrigenVuelo] = useState("");
  const [paisDestinoVuelo, setPaisDestinoVuelo] = useState("");
  const [estadoDestinoVuelo, setEstadoDestinoVuelo] = useState("");
  const [paisesVuelo, setPaisesVuelo] = useState([]);

  // Cargar países al montar
  React.useEffect(() => {
    fetch(API_COUNTRIES)
      .then(res => res.json())
      .then(data => {
        if (data.data) setPaisesVuelo(data.data.map(p => p.name));
      });
  }, []);

  // Origen
  React.useEffect(() => {
    if (paisOrigenVuelo) {
      fetch(API_STATES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: paisOrigenVuelo })
      })
        .then(res => res.json())
        .then(data => {
          // Estados de origen cargados pero no se usan en formulario simplificado
        });
    }
    setEstadoOrigenVuelo("");
  }, [paisOrigenVuelo]);

  React.useEffect(() => {
    if (estadoOrigenVuelo && paisOrigenVuelo) {
      fetch(API_CITIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: paisOrigenVuelo, state: estadoOrigenVuelo })
      })
        .then(res => res.json())
        .then(data => {
          // Ciudades de origen cargadas pero no se usan en formulario simplificado
        });
    }
  }, [estadoOrigenVuelo, paisOrigenVuelo]);

  // Destino
  React.useEffect(() => {
    if (paisDestinoVuelo) {
      fetch(API_STATES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: paisDestinoVuelo })
      })
        .then(res => res.json())
        .then(data => {
          // Estados de destino cargados pero no se usan en formulario simplificado
        });
    }
    setEstadoDestinoVuelo("");
  }, [paisDestinoVuelo]);

  React.useEffect(() => {
    if (estadoDestinoVuelo && paisDestinoVuelo) {
      fetch(API_CITIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: paisDestinoVuelo, state: estadoDestinoVuelo })
      })
        .then(res => res.json())
        .then(data => {
          // Ciudades de destino cargadas pero no se usan en formulario simplificado
        });
    }
  }, [estadoDestinoVuelo, paisDestinoVuelo]);

  // Factores de extintores (ejemplo)
  const FACTORES_EXTINTORES = [
    { tipo: "ABC", factor: 1.0 },
    { tipo: "CO2", factor: 1.5 }
  ];

  // Handlers mínimos para extintores y electricidad
  const handleExtintorChange = (idx, field, value) => {
    const updated = [...extintores];
    updated[idx][field] = value;
    setExtintores(updated);
  };
  const handleElectricidadChange = (idx, field, value) => {
    const updated = [...electricidad];
    updated[idx][field] = value;
    setElectricidad(updated);
  };
  const addElectricidadRow = () => setElectricidad([...electricidad, { año: '', instalacion: '', enero: '', febrero: '', marzo: '', abril: '', mayo: '', junio: '', julio: '', agosto: '', septiembre: '', octubre: '', noviembre: '', diciembre: '' }]);

  // Handler de submit
  const handleSubmit = e => {
    e.preventDefault();
    // Aquí puedes enviar los datos o hacer el cálculo final
    if (onFormComplete) onFormComplete({ datosEmpresa, extintores, electricidad, vuelos });
  };

  // Resumen de emisiones (dummy para que compile)
  // Resumen de emisiones (tabla ejemplo) y riesgos

  // Función para calcular emisiones dinámicamente basado en los datos del formulario
  const calcularEmisionesTotales = () => {
    // Emisiones de vuelos (Alcance 3)
    const emisionesVuelos = vuelos.reduce((total, vuelo) => {
      const emision = parseFloat(vuelo.emisionTon) || 0;
      return total + emision;
    }, 0);

    // Emisiones de combustibles sólidos estacionarios (Alcance 1)
    const emisionesSolidos = solidos.reduce((total, solido) => {
      const emision = parseFloat(solido.emisionesTotales) || 0;
      return total + emision;
    }, 0);

    // Emisiones de combustibles líquidos estacionarios (Alcance 1)
    const emisionesLiquidos = liquidos.reduce((total, liquido) => {
      const emision = parseFloat(liquido.emisionesTotales) || 0;
      return total + emision;
    }, 0);

    // Emisiones de combustibles gaseosos estacionarios (Alcance 1) 
    const emisionesGaseosos = gaseosos.reduce((total, gaseoso) => {
      const emision = parseFloat(gaseoso.emisionesTotales) || 0;
      return total + emision;
    }, 0);

    // Emisiones de combustibles líquidos móviles (Alcance 1)
    const emisionesLiquidosMoviles = liquidosMoviles.reduce((total, liquido) => {
      const emision = parseFloat(liquido.emisionesTotales) || 0;
      return total + emision;
    }, 0);

    // Emisiones de combustibles gaseosos móviles (Alcance 1)
    const emisionesGaseososMoviles = gaseososMoviles.reduce((total, gaseoso) => {
      const emision = parseFloat(gaseoso.emisionesTotales) || 0;
      return total + emision;
    }, 0);

    // Emisiones de extintores (Alcance 1 - Fugitivas)
    const emisionesExtintores = extintores.reduce((total, extintor) => {
      const emision = parseFloat(extintor.emisionesParciales) || 0;
      return total + (emision / 1000); // Convertir de kg a toneladas
    }, 0);

    // Emisiones de electricidad (Alcance 2)
    const emisionesElectricidad = electricidad.reduce((total, item) => {
      const consumo = parseFloat(item.consumoAnual) || 0;
      const emision = (consumo * FACTOR_ELECTRICO) / 1000; // kg a toneladas
      return total + emision;
    }, 0);

    // Totales por alcance en toneladas CO2e
    const alcance1 = emisionesSolidos + emisionesLiquidos + emisionesGaseosos + 
                     emisionesLiquidosMoviles + emisionesGaseososMoviles + emisionesExtintores;
    const alcance2 = emisionesElectricidad;
    const alcance3 = emisionesVuelos;

    return {
      alcance1: alcance1,
      alcance2: alcance2, 
      alcance3: alcance3,
    };
  };

  // Calcular emisiones dinámicamente
  const emisiones = calcularEmisionesTotales();
  const totalEmisiones = emisiones.alcance1 + emisiones.alcance2 + emisiones.alcance3;
  // Evaluación simple (puedes ajustar los umbrales)
  let evaluacion = "";
  if (totalEmisiones < 1000) evaluacion = "¡Excelente! Tu huella es baja.";
  else if (totalEmisiones < 3000) evaluacion = "Aceptable, pero hay margen de mejora.";
  else evaluacion = "Alto impacto, ¡urge reducir emisiones!";
  // Cálculo de árboles a plantar (1 árbol absorbe ~21kg CO2/año)
  const arboles = Math.ceil(totalEmisiones / 21);

  // Función para descargar pantallazo del resumen
  const addExtintorRow = () => setExtintores([...extintores, { tipo: '', cantidad: '', pcg: '', emisionesParciales: '' }]);

  const handleVueloChange = async (idx, field, value) => {
    let newRows = [...vuelos];
    newRows[idx][field] = value;
    // Replicar solo la lógica de cálculo de kms usando los campos de la fila
    const row = newRows[idx];
    if (row.ciudadOrigen && row.ciudadDestino) {
      newRows[idx].distancia = "Calculando...";
      // Usar solo la ciudad igual que el formulario de prueba
      const coordsOrigen = await getCoords(row.ciudadOrigen);
      const coordsDestino = await getCoords(row.ciudadDestino);
      if (coordsOrigen && coordsDestino) {
        const km = haversineDistance(coordsOrigen.lat, coordsOrigen.lon, coordsDestino.lat, coordsDestino.lon);
        newRows[idx].distancia = km;
      } else {
        newRows[idx].distancia = "No encontrado";
      }
    }
    // Factor de emisión según clase y distancia
    if (newRows[idx].distancia && newRows[idx].clase && !isNaN(parseFloat(newRows[idx].distancia))) {
      let factorEmision = 0;
      if (newRows[idx].clase === "Ejecutiva") {
        factorEmision = 0.237;
      } else if (newRows[idx].clase === "Economica" || newRows[idx].clase === "Económica") {
        factorEmision = 0.158;
      }
      const personas = parseFloat(newRows[idx].personas) || 0;
      newRows[idx].factor = factorEmision;
      newRows[idx].emisionKg = (personas * factorEmision * parseFloat(newRows[idx].distancia)).toFixed(2);
      newRows[idx].emisionTon = (personas * factorEmision * parseFloat(newRows[idx].distancia) / 1000).toFixed(4);
    } else {
      newRows[idx].factor = "";
      newRows[idx].emisionKg = "";
      newRows[idx].emisionTon = "";
    }
    setVuelos(newRows);
  };
  const addVueloRow = () => setVuelos([...vuelos, { origen: "", destino: "", clase: "", personas: "", tipoVuelo: "", factor: "", distancia: "", emisionKg: "", emisionTon: "" }]);
  const removeVueloRow = idx => setVuelos(vuelos.filter((_, i) => i !== idx));

  // Sólidos - funciones para manejar cambios
  const handleSolidoChange = (idx, field, value) => {
    let newRows = [...solidos];
    if (field === "combustible") {
      const found = FACTORES_SOLIDOS.find(f => f.nombre === value);
      if (found) {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: found.poderCalorifico,
          factorCO2: found.factorCO2,
          factorCH4: found.factorCH4,
          factorN2O: found.factorN2O,
          factorSO2: found.factorSO2
        };
      } else {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: "",
          factorCO2: "",
          factorCH4: "",
          factorN2O: "",
          factorSO2: ""
        };
      }
    } else {
      newRows[idx][field] = value;
    }
    setSolidos(newRows);
  };
  const addSolidoRow = () => setSolidos([...solidos, { combustible: "", consumo: "", poderCalorifico: "", factorCO2: "", factorCH4: "", factorN2O: "", factorSO2: "" }]);
  const removeSolidoRow = idx => setSolidos(solidos.filter((_, i) => i !== idx));

  // Líquidos - funciones para manejar cambios
  const handleLiquidoChange = (idx, field, value) => {
    let newRows = [...liquidos];
    if (field === "combustible") {
      const found = FACTORES_LIQUIDOS.find(f => f.nombre === value);
      if (found) {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          densidad: found.densidad,
          poderCalorifico: found.poderCalorifico,
          factorCO2: found.factorCO2,
          factorCH4: found.factorCH4,
          factorN2O: found.factorN2O_est || "",
          factorSO2: found.factorSO2
        };
      } else {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          densidad: "",
          poderCalorifico: "",
          factorCO2: "",
          factorCH4: "",
          factorN2O: "",
          factorSO2: ""
        };
      }
    } else {
      newRows[idx][field] = value;
    }
    setLiquidos(newRows);
  };
  const addLiquidoRow = () => setLiquidos([...liquidos, { combustible: "", consumo: "", densidad: "", poderCalorifico: "", factorCO2: "", factorCH4: "", factorN2O: "", factorSO2: "", masa: "", energia: "", emisionCO2: "", emisionCH4: "", emisionN2O: "", emisionSO2: "", emisionesTotales: "" }]);
  const removeLiquidoRow = idx => setLiquidos(liquidos.filter((_, i) => i !== idx));

  // Gaseosos - funciones para manejar cambios
  const handleGaseosoChange = (idx, field, value) => {
    let newRows = [...gaseosos];
    if (field === "combustible") {
      const found = FACTORES_GASEOSOS.find(f => f.nombre === value);
      if (found) {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: found.poderCalorifico,
          factorCO2: found.factorCO2,
          factorCH4: found.factorCH4,
          factorN2O: found.factorN2O_est,
          factorSO2: found.factorSO2
        };
      } else {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: "",
          factorCO2: "",
          factorCH4: "",
          factorN2O: "",
          factorSO2: ""
        };
      }
    } else {
      newRows[idx][field] = value;
    }
    setGaseosos(newRows);
  };
  const addGaseosoRow = () => setGaseosos([...gaseosos, { combustible: "", consumo: "", poderCalorifico: "", factorCO2: "", factorCH4: "", factorN2O: "", factorSO2: "" }]);
  const removeGaseosoRow = idx => setGaseosos(gaseosos.filter((_, i) => i !== idx));

  // Nuevo formulario: Alcance 1 - Emisiones Directas por Consumo de Combustibles Líquidos de Fuentes Móviles
  const handleLiquidoMovilChange = (idx, field, value) => {
    let newRows = [...liquidosMoviles];
    if (field === "combustible") {
      const found = FACTORES_LIQUIDOS.find(f => f.nombre === value);
      if (found) {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          densidad: found.densidad,
          poderCalorifico: found.poderCalorifico,
          factorCO2: found.factorCO2,
          factorCH4: found.factorCH4,
          factorN2O: found.factorN2O_mov || found.factorN2O_est || "",
          factorSO2: found.factorSO2
        };
      } else {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          densidad: "",
          poderCalorifico: "",
          factorCO2: "",
          factorCH4: "",
          factorN2O: "",
          factorSO2: ""
        };
      }
    } else {
      newRows[idx][field] = value;
    }
    setLiquidosMoviles(newRows);
  };
  const addLiquidoMovilRow = () => setLiquidosMoviles([...liquidosMoviles, { combustible: "", consumo: "", densidad: "", poderCalorifico: "", factorCO2: "", factorCH4: "", factorN2O: "", factorSO2: "", masa: "", energia: "", emisionCO2: "", emisionCH4: "", emisionN2O: "", emisionSO2: "", emisionesTotales: "" }]);
  const removeLiquidoMovilRow = idx => setLiquidosMoviles(liquidosMoviles.filter((_, i) => i !== idx));

  // Nuevo formulario: Alcance 1 - Emisiones Directas por Consumo de Combustibles Gaseosos de Fuentes Móviles
  const handleGaseosoMovilChange = (idx, field, value) => {
    let newRows = [...gaseososMoviles];
    if (field === "combustible") {
      const found = FACTORES_GASEOSOS.find(f => f.nombre === value);
      if (found) {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: found.poderCalorifico,
          factorCO2: found.factorCO2,
          factorCH4: found.factorCH4,
          factorN2O: found.factorN2O_mov,
          factorSO2: found.factorSO2
        };
      } else {
        newRows[idx] = {
          ...newRows[idx],
          combustible: value,
          poderCalorifico: "",
          factorCO2: "",
          factorCH4: "",
          factorN2O: "",
          factorSO2: ""
        };
      }
    } else {
      newRows[idx][field] = value;
    }
    setGaseososMoviles(newRows);
  };
  // Select departamento
  const handleDepartamento = e => {
    setDatosEmpresa(prev => ({ ...prev, departamento: e.target.value, municipio: "" }));
  };
  // Select municipio
  const handleMunicipio = e => {
    setDatosEmpresa(prev => ({ ...prev, municipio: e.target.value }));
  };

  // Progress
  const countFilled = () => REQUIRED_FIELDS.filter(f => datosEmpresa[f] && datosEmpresa[f].toString().trim() !== "").length;
  const progress = Math.round((countFilled() / REQUIRED_FIELDS.length) * 100);
  const canAdvance = countFilled() === REQUIRED_FIELDS.length;
  
  const addGaseosoMovilRow = () => setGaseososMoviles([...gaseososMoviles, { combustible: "", consumo: "", poderCalorifico: "", factorCO2: "", factorCH4: "", factorN2O: "", emisionCO2: "", emisionCH4: "", emisionN2O: "", emisionesTotales: "" }]);
  const removeGaseosoMovilRow = idx => setGaseososMoviles(gaseososMoviles.filter((_, i) => i !== idx));

  // Estado y lógica para Alcance 2: Electricidad
  
  // Funciones para manejar electricidad

  // Handler de datos generales
  const handleDatosEmpresa = e => {
    const { name, value } = e.target;
    setDatosEmpresa(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="section">
      <Container>
        {/* Formulario de prueba: selects encadenados país, estado, ciudad (sin conflictos) */}
        <Row className="justify-content-center mb-4">

        </Row>
        {/* ...existing code... */}
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="shadow">
              <CardBody>
                {/* Progress bar */}
                <div className="mb-4">
                  <Label>Avance del formulario: {progress}%</Label>
                  <div style={{ background: '#e9ecef', borderRadius: 4, height: 18, width: '100%' }}>
                    <div style={{ width: `${progress}%`, background: '#28a745', height: '100%', borderRadius: 4, transition: 'width 0.3s' }}></div>
                  </div>
                </div>
                {step === 1 && (
                  <form autoComplete="off" onSubmit={e => { e.preventDefault(); if (canAdvance) setStep(2); }}>
                    <h4 className="mb-4">Datos Generales</h4>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Nombre Empresa <span style={{color:'red'}}>*</span></Label>
                          <Input name="nombreEmpresa" value={datosEmpresa.nombreEmpresa} onChange={handleDatosEmpresa} required />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>NIT <span style={{color:'red'}}>*</span></Label>
                          <Input name="nit" value={datosEmpresa.nit} onChange={handleDatosEmpresa} required />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Dirección <span style={{color:'red'}}>*</span></Label>
                          <Input name="direccion" value={datosEmpresa.direccion} onChange={handleDatosEmpresa} required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Departamento <span style={{color:'red'}}>*</span></Label>
                          <Input type="select" name="departamento" value={datosEmpresa.departamento} onChange={handleDepartamento} required>
                            <option value="">Seleccione...</option>
                            {departamentos.map(dep => (
                              <option key={dep} value={dep}>{dep}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Municipio <span style={{color:'red'}}>*</span></Label>
                          <Input type="select" name="municipio" value={datosEmpresa.municipio} onChange={handleMunicipio} required disabled={!datosEmpresa.departamento}>
                            <option value="">Seleccione...</option>
                            {municipiosFiltrados.map(mun => (
                              <option key={mun} value={mun}>{mun}</option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Año Base <span style={{color:'red'}}>*</span></Label>
                          <Input name="añoBase" value={datosEmpresa.añoBase} onChange={handleDatosEmpresa} required />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}><FormGroup><Label>Fecha Reporte <span style={{color:'red'}}>*</span></Label><Input name="fechaReporte" type="date" value={datosEmpresa.fechaReporte} onChange={handleDatosEmpresa} required readOnly tabIndex={-1} /></FormGroup></Col>
                      <Col md={4}><FormGroup><Label>Teléfono <span style={{color:'red'}}>*</span></Label><Input name="telefono" value={datosEmpresa.telefono} onChange={handleDatosEmpresa} required /></FormGroup></Col>
                      <Col md={4}><FormGroup><Label>Correo <span style={{color:'red'}}>*</span></Label><Input name="correo" value={datosEmpresa.correo} onChange={handleDatosEmpresa} required type="email" /></FormGroup></Col>
                    </Row>
                    <Row>
                      <Col md={6}><FormGroup><Label>Persona que Elabora <span style={{color:'red'}}>*</span></Label><Input name="personaElabora" value={datosEmpresa.personaElabora} onChange={handleDatosEmpresa} required /></FormGroup></Col>
                      <Col md={6}><FormGroup><Label>Cargo <span style={{color:'red'}}>*</span></Label><Input name="cargo" value={datosEmpresa.cargo} onChange={handleDatosEmpresa} required /></FormGroup></Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <Button color="primary" type="submit" disabled={!canAdvance}>
                        Siguiente <FeatherIcon icon="arrow-right" className="ms-2" />
                      </Button>
                    </div>
                  </form>
                )}
                {step === 2 && (
                  <form onSubmit={handleSubmit} autoComplete="off">
                    {/* Vuelos Corporativos - ahora antes de sólidos */}
                    <h4 className="formulario-section-title">Vuelos Corporativos</h4>
                    <Table bordered responsive size="sm">
                      <thead className="table-light">
                        <tr>
                          <th style={{minWidth:140}}>País Origen</th>
                          <th style={{minWidth:140}}>Estado/Depto Origen</th>
                          <th style={{minWidth:140}}>Ciudad Origen</th>
                          <th style={{minWidth:140}}>País Destino</th>
                          <th style={{minWidth:140}}>Estado/Depto Destino</th>
                          <th style={{minWidth:140}}>Ciudad Destino</th>
                          <th style={{minWidth:140}}>Clase</th>
                          <th style={{minWidth:140}}>Número de personas</th>
                          <th style={{minWidth:140}}>Distancia (km)</th>
                          <th style={{minWidth:140}}>Factor de Emisión (kgCO2e)</th>
                          <th style={{minWidth:140}}>Emisión (tCO2e)</th>
                          <th style={{minWidth:140}}>Emisión (kgCO2e)</th>
                          <th style={{minWidth:140}}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {vuelos.map((row, idx) => (
                          <tr key={idx}>
                            {/* ...existing code... */}
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.paisOrigen || ''} onChange={async e => {
                                const value = e.target.value;
                                await handleVueloChange(idx, "paisOrigen", value);
                                let newRows = [...vuelos];
                                newRows[idx].estadoOrigen = '';
                                newRows[idx].ciudadOrigen = '';
                                newRows[idx].estadosOrigenList = [];
                                newRows[idx].ciudadesOrigenList = [];
                                if (value) {
                                  const res = await fetch(API_STATES, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ country: value })
                                  });
                                  const data = await res.json();
                                  newRows[idx].estadosOrigenList = data.data.states.map(s => s.name);
                                }
                                setVuelos(newRows);
                              }}>
                                <option value="">País...</option>
                                {paisesVuelo.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.estadoOrigen || ''} onChange={async e => {
                                const value = e.target.value;
                                await handleVueloChange(idx, "estadoOrigen", value);
                                let newRows = [...vuelos];
                                newRows[idx].ciudadOrigen = '';
                                newRows[idx].ciudadesOrigenList = [];
                                if (row.paisOrigen && value) {
                                  const res = await fetch(API_CITIES, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ country: row.paisOrigen, state: value })
                                  });
                                  const data = await res.json();
                                  newRows[idx].ciudadesOrigenList = data.data;
                                }
                                setVuelos(newRows);
                              }} disabled={!row.paisOrigen}>
                                <option value="">Estado/Depto...</option>
                                {(row.estadosOrigenList || []).map(e => <option key={e} value={e}>{e}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.ciudadOrigen || ''} onChange={e => handleVueloChange(idx, "ciudadOrigen", e.target.value)} disabled={!row.estadoOrigen}>
                                <option value="">Ciudad...</option>
                                {(row.ciudadesOrigenList || []).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.paisDestino || ''} onChange={async e => {
                                const value = e.target.value;
                                await handleVueloChange(idx, "paisDestino", value);
                                let newRows = [...vuelos];
                                newRows[idx].estadoDestino = '';
                                newRows[idx].ciudadDestino = '';
                                newRows[idx].estadosDestinoList = [];
                                newRows[idx].ciudadesDestinoList = [];
                                if (value) {
                                  const res = await fetch(API_STATES, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ country: value })
                                  });
                                  const data = await res.json();
                                  newRows[idx].estadosDestinoList = data.data.states.map(s => s.name);
                                }
                                setVuelos(newRows);
                              }}>
                                <option value="">País...</option>
                                {paisesVuelo.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.estadoDestino || ''} onChange={async e => {
                                const value = e.target.value;
                                await handleVueloChange(idx, "estadoDestino", value);
                                let newRows = [...vuelos];
                                newRows[idx].ciudadDestino = '';
                                newRows[idx].ciudadesDestinoList = [];
                                if (row.paisDestino && value) {
                                  const res = await fetch(API_CITIES, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ country: row.paisDestino, state: value })
                                  });
                                  const data = await res.json();
                                  newRows[idx].ciudadesDestinoList = data.data;
                                }
                                setVuelos(newRows);
                              }} disabled={!row.paisDestino}>
                                <option value="">Estado/Depto...</option>
                                {(row.estadosDestinoList || []).map(e => <option key={e} value={e}>{e}</option>)}
                              </select>
                            </td>
                            <td>
                              <select className="form-control" style={{minWidth:140}} value={row.ciudadDestino || ''} onChange={e => handleVueloChange(idx, "ciudadDestino", e.target.value)} disabled={!row.estadoDestino}>
                                <option value="">Ciudad...</option>
                                {(row.ciudadesDestinoList || []).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </td>
                            <td>
                              <Input type="select" value={row.clase} style={{minWidth:120}} onChange={e => handleVueloChange(idx, "clase", e.target.value)}>
                                <option value="">Selecciona</option>
                                <option value="Economica">Económica</option>
                                <option value="Ejecutiva">Ejecutiva</option>
                              </Input>
                            </td>
                            <td><Input type="number" value={row.personas} style={{minWidth:120}} onChange={e => handleVueloChange(idx, "personas", e.target.value)} min="1" /></td>
                            <td><Input value={row.distancia || ''} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td><Input value={row.factor} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td><Input value={row.emisionTon} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td><Input value={row.emisionKg} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td>
                              {vuelos.length > 1 && (
                                <Button color="danger" size="sm" onClick={() => removeVueloRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* Total acumulado de emisiones de vuelos */}
                    <div className="resultado-emisiones mb-3">
                      <strong>Total emisiones de vuelos:</strong> {
                        vuelos.reduce((acc, row) => acc + (parseFloat(row.emisionTon) || 0), 0).toFixed(4)
                      } Ton CO₂e / {
                        vuelos.reduce((acc, row) => acc + (parseFloat(row.emisionKg) || 0), 0).toFixed(2)
                      } kg CO₂e
                    </div>
                    <Button color="success" outline size="sm" onClick={addVueloRow} className="mb-3">
                      <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                    </Button>
                    {/* Sólidos */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Consumo de Combustibles Sólidos</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>#</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Combustible</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo anual <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Poder calorífico <span style={{fontWeight:'normal'}}>(MJ/kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo de energía <span style={{fontWeight:'normal'}}>(TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor CO2 <span style={{fontWeight:'normal'}}>(Kg CO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor CH4 <span style={{fontWeight:'normal'}}>(Kg CH4/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor N2O <span style={{fontWeight:'normal'}}>(Kg N2O/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor SO2 <span style={{fontWeight:'normal'}}>(Kg SO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CH4 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión N2O <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión SO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>EMISIONES TOTALES <span style={{fontWeight:'normal'}}>(Ton CO2 eq)</span></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {solidos.map((row, idx) => {
                          // Consumo de energía (TJ)
                          const energia = (parseFloat(row.consumo) && parseFloat(row.poderCalorifico)) ? (parseFloat(row.consumo) * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          // Emisiones
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          const emisionSO2 = (energia && parseFloat(row.factorSO2)) ? (energia * parseFloat(row.factorSO2)) : 0;
                          // Emisiones totales (Ton CO2 eq)
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return (
                            <tr key={idx}>
                              <td style={{minWidth:180, verticalAlign:'middle'}}>{idx + 1}</td>
                              <td style={{minWidth:180}}>
                                <Input
                                  type="select"
                                  value={row.combustible}
                                  onChange={e => handleSolidoChange(idx, "combustible", e.target.value)}
                                  style={{minWidth:180}}
                                >
                                  <option value="">Seleccione...</option>
                                  {FACTORES_SOLIDOS.map(f => (
                                    <option key={f.nombre} value={f.nombre}>{f.nombre}</option>
                                  ))}
                                </Input>
                              </td>
                              <td style={{minWidth:180}}><Input type="number" value={row.consumo} onChange={e => handleSolidoChange(idx, "consumo", e.target.value)} min="0" style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.poderCalorifico} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={energia ? energia.toFixed(6) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCO2} readOnly tabIndex={-1} disabled style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCH4} readOnly tabIndex={-1} disabled style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorN2O} readOnly tabIndex={-1} disabled style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorSO2} readOnly tabIndex={-1} disabled style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCO2 ? emisionCO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCH4 ? emisionCH4.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionN2O ? emisionN2O.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionSO2 ? emisionSO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}>
                                {solidos.length > 1 && (
                                  <Button color="danger" size="sm" onClick={() => removeSolidoRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>Emisiones Sólidos:</strong> {
                        solidos.reduce((acc, row) => {
                          const energia = (parseFloat(row.consumo) && parseFloat(row.poderCalorifico)) ? (parseFloat(row.consumo) * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          return acc + ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                        }, 0).toFixed(2)
                      } kg CO₂e
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addSolidoRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>

                    {/* Fuentes estacionarias */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Consumo de Combustibles Fósiles Líquidos de Fuentes Estacionarias</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>No.</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Combustibles</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo anual <span style={{fontWeight:'normal'}}>(gal)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Densidad <span style={{fontWeight:'normal'}}>(kg/l)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Masa de combustible <span style={{fontWeight:'normal'}}>(kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Poder calorífico <span style={{fontWeight:'normal'}}>(MJ/kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo de energía <span style={{fontWeight:'normal'}}>(TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CO2 <span style={{fontWeight:'normal'}}>(Kg CO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CH4 <span style={{fontWeight:'normal'}}>(Kg CH4/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión N2O <span style={{fontWeight:'normal'}}>(Kg N2O/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión SO2 <span style={{fontWeight:'normal'}}>(Kg SO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CH4 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión N2O <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión SO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>EMISIONES TOTALES <span style={{fontWeight:'normal'}}>(Ton CO2 eq)</span></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {liquidos.map((row, idx) => {
                          // Consumo anual (l) = consumo (gal) * 3.78541
                          const consumoLitros = row.consumo ? parseFloat(row.consumo) * 3.78541 : 0;
                          // Masa de combustible (kg) = consumo anual (l) * densidad (kg/l)
                          const masa = (consumoLitros && parseFloat(row.densidad)) ? consumoLitros * parseFloat(row.densidad) : 0;
                          // Consumo de energía (TJ) = masa * poder calorífico (MJ/kg) / 1,000,000
                          const energia = (masa && parseFloat(row.poderCalorifico)) ? (masa * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          // Emisiones
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          const emisionSO2 = (energia && parseFloat(row.factorSO2)) ? (energia * parseFloat(row.factorSO2)) : 0;
                          // Emisiones totales (Ton CO2 eq)
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return (
                            <tr key={idx}>
                              <td style={{minWidth:180, verticalAlign:'middle'}}>{idx + 1}</td>
                              <td style={{minWidth:180}}>
                                <Input
                                  type="select"
                                  value={row.combustible}
                                  onChange={e => handleLiquidoChange(idx, "combustible", e.target.value)}
                                  style={{minWidth:180}}
                                >
                                  <option value="">Seleccione...</option>
                                  {FACTORES_LIQUIDOS.map(f => (
                                    <option key={f.nombre} value={f.nombre}>{f.nombre}</option>
                                  ))}
                                </Input>
                              </td>
                              <td style={{minWidth:180}}><Input type="number" value={row.consumo} onChange={e => handleLiquidoChange(idx, "consumo", e.target.value)} min="0" style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.densidad} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={masa ? masa.toFixed(0) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.poderCalorifico} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={energia ? energia.toFixed(6) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCH4} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorN2O} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorSO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCO2 ? emisionCO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCH4 ? emisionCH4.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionN2O ? emisionN2O.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionSO2 ? emisionSO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}>
                                {liquidos.length > 1 && (
                                  <Button color="danger" size="sm" onClick={() => removeLiquidoRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>Emisiones Líquidos:</strong> {
                        liquidos.reduce((acc, row) => {
                          // Consumo anual (l) = consumo (gal) * 3.78541
                          const consumoLitros = row.consumo ? parseFloat(row.consumo) * 3.78541 : 0;
                          // Masa de combustible (kg) = consumo anual (l) * densidad (kg/l)
                          const masa = (consumoLitros && parseFloat(row.densidad)) ? consumoLitros * parseFloat(row.densidad) : 0;
                          // Consumo de energía (TJ) = masa * poder calorífico (MJ/kg) / 1,000,000
                          const energia = (masa && parseFloat(row.poderCalorifico)) ? (masa * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          // Emisiones
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          // Emisiones totales (Ton CO2 eq)
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return acc + emisionesTotales;
                        }, 0).toFixed(2)
                      } Ton CO₂e
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addLiquidoRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>

                    {/* Fuentes móviles */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Consumo de Combustibles Fósiles Líquidos de Fuentes Móviles</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>No.</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Combustibles</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo anual <span style={{fontWeight:'normal'}}>(gal)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Densidad <span style={{fontWeight:'normal'}}>(kg/l)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Masa de combustible <span style={{fontWeight:'normal'}}>(kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Poder calorífico <span style={{fontWeight:'normal'}}>(MJ/kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo de energía <span style={{fontWeight:'normal'}}>(TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CO2 <span style={{fontWeight:'normal'}}>(Kg CO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CH4 <span style={{fontWeight:'normal'}}>(Kg CH4/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión N2O <span style={{fontWeight:'normal'}}>(Kg N2O/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión SO2 <span style={{fontWeight:'normal'}}>(Kg SO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CH4 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión N2O <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión SO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>EMISIONES TOTALES <span style={{fontWeight:'normal'}}>(Ton CO2 eq)</span></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {liquidosMoviles.map((row, idx) => {
                          // Consumo anual (l) = consumo (gal) * 3.78541
                          const consumoLitros = row.consumo ? parseFloat(row.consumo) * 3.78541 : 0;
                          // Masa de combustible (kg) = consumo anual (l) * densidad (kg/l)
                          const masa = (consumoLitros && parseFloat(row.densidad)) ? consumoLitros * parseFloat(row.densidad) : 0;
                          // Consumo de energía (TJ) = masa * poder calorífico (MJ/kg) / 1,000,000
                          const energia = (masa && parseFloat(row.poderCalorifico)) ? (masa * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          // Emisiones
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          const emisionSO2 = (energia && parseFloat(row.factorSO2)) ? (energia * parseFloat(row.factorSO2)) : 0;
                          // Emisiones totales (Ton CO2 eq)
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return (
                            <tr key={idx}>
                              <td style={{minWidth:180, verticalAlign:'middle'}}>{idx + 1}</td>
                              <td style={{minWidth:180}}>
                                <Input
                                  type="select"
                                  value={row.combustible}
                                  onChange={e => handleLiquidoMovilChange(idx, "combustible", e.target.value)}
                                  style={{minWidth:180}}
                                >
                                  <option value="">Seleccione...</option>
                                  {FACTORES_LIQUIDOS.map(f => (
                                    <option key={f.nombre} value={f.nombre}>{f.nombre}</option>
                                  ))}
                                </Input>
                              </td>
                              <td style={{minWidth:180}}><Input type="number" value={row.consumo} onChange={e => handleLiquidoMovilChange(idx, "consumo", e.target.value)} min="0" style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.densidad} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={masa ? masa.toFixed(0) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.poderCalorifico} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={energia ? energia.toFixed(6) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCH4} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorN2O} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorSO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCO2 ? emisionCO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCH4 ? emisionCH4.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionN2O ? emisionN2O.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionSO2 ? emisionSO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}>
                                {liquidosMoviles.length > 1 && (
                                  <Button color="danger" size="sm" onClick={() => removeLiquidoMovilRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>Emisiones Líquidos Móviles:</strong> {
                        liquidosMoviles.reduce((acc, row) => {
                          const consumoLitros = row.consumo ? parseFloat(row.consumo) * 3.78541 : 0;
                          const masa = (consumoLitros && parseFloat(row.densidad)) ? consumoLitros * parseFloat(row.densidad) : 0;
                          const energia = (masa && parseFloat(row.poderCalorifico)) ? (masa * parseFloat(row.poderCalorifico) / 1000000) : 0;
                          const emisionCO2 = (energia && parseFloat(row.factorCO2)) ? (energia * parseFloat(row.factorCO2)) : 0;
                          const emisionCH4 = (energia && parseFloat(row.factorCH4)) ? (energia * parseFloat(row.factorCH4)) : 0;
                          const emisionN2O = (energia && parseFloat(row.factorN2O)) ? (energia * parseFloat(row.factorN2O)) : 0;
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return acc + emisionesTotales;
                        }, 0).toFixed(2)
                      } Ton CO₂e
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addLiquidoMovilRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>


                    {/* Gaseosos Estacionarias - NUEVO DISEÑO */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Consumo de Combustibles Gaseosos de Fuentes Estacionarias</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>No.</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Combustibles</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo anual <span style={{fontWeight:'normal'}}>(m³)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Poder calorífico <span style={{fontWeight:'normal'}}>(MJ/m³)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo de energía <span style={{fontWeight:'normal'}}>(TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CO2 <span style={{fontWeight:'normal'}}>(Kg CO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CH4 <span style={{fontWeight:'normal'}}>(Kg CH4/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión N2O <span style={{fontWeight:'normal'}}>(Kg N2O/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión SO2 <span style={{fontWeight:'normal'}}>(Kg SO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CH4 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión N2O <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión SO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>EMISIONES TOTALES <span style={{fontWeight:'normal'}}>(Ton CO2 eq)</span></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {gaseosos.map((row, idx) => {
                          const consumo = row.consumo ? parseFloat(row.consumo) : 0;
                          const poderCalorifico = parseFloat(row.poderCalorifico) || 0;
                          const energia = (consumo && poderCalorifico) ? (consumo * poderCalorifico / 1000000) : 0;
                          const factorCO2 = parseFloat(row.factorCO2) || 0;
                          const factorCH4 = parseFloat(row.factorCH4) || 0;
                          const factorN2O = parseFloat(row.factorN2O) || 0;
                          const factorSO2 = parseFloat(row.factorSO2) || 0;
                          const emisionCO2 = energia * factorCO2;
                          const emisionCH4 = energia * factorCH4;
                          const emisionN2O = energia * factorN2O;
                          const emisionSO2 = energia * factorSO2;
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return (
                            <tr key={idx}>
                              <td style={{minWidth:180, verticalAlign:'middle'}}>{idx + 1}</td>
                              <td style={{minWidth:180}}>
                                <Input
                                  type="select"
                                  value={row.combustible}
                                  onChange={e => handleGaseosoChange(idx, "combustible", e.target.value)}
                                  style={{minWidth:180}}
                                >
                                  <option value="">Seleccione...</option>
                                  {FACTORES_GASEOSOS.map(f => (
                                    <option key={f.nombre} value={f.nombre}>{f.nombre}</option>
                                  ))}
                                </Input>
                              </td>
                              <td style={{minWidth:180}}><Input type="number" value={row.consumo} onChange={e => handleGaseosoChange(idx, "consumo", e.target.value)} min="0" style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.poderCalorifico} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={energia ? energia.toFixed(6) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCH4} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorN2O} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorSO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCO2 ? emisionCO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCH4 ? emisionCH4.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionN2O ? emisionN2O.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionSO2 ? emisionSO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}>
                                {gaseosos.length > 1 && (
                                  <Button color="danger" size="sm" onClick={() => removeGaseosoRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>Emisiones Gaseosos Estacionarias:</strong> {
                        gaseosos.reduce((acc, row) => {
                          const consumo = row.consumo ? parseFloat(row.consumo) : 0;
                          const poderCalorifico = parseFloat(row.poderCalorifico) || 0;
                          const energia = (consumo && poderCalorifico) ? (consumo * poderCalorifico / 1000000) : 0;
                          const factorCO2 = parseFloat(row.factorCO2) || 0;
                          const factorCH4 = parseFloat(row.factorCH4) || 0;
                          const factorN2O = parseFloat(row.factorN2O) || 0;
                          const emisionCO2 = energia * factorCO2;
                          const emisionCH4 = energia * factorCH4;
                          const emisionN2O = energia * factorN2O;
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return acc + emisionesTotales;
                        }, 0).toFixed(2)
                      } Ton CO₂e
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addGaseosoRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>


                    {/* Gaseosos Móviles - NUEVO DISEÑO */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Consumo de Combustibles Gaseosos de Fuentes Móviles</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>No.</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Combustibles</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo anual <span style={{fontWeight:'normal'}}>(m³)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Poder calorífico <span style={{fontWeight:'normal'}}>(MJ/m³)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Consumo de energía <span style={{fontWeight:'normal'}}>(TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CO2 <span style={{fontWeight:'normal'}}>(Kg CO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión CH4 <span style={{fontWeight:'normal'}}>(Kg CH4/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión N2O <span style={{fontWeight:'normal'}}>(Kg N2O/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Factor de emisión SO2 <span style={{fontWeight:'normal'}}>(Kg SO2/TJ)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión CH4 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión N2O <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisión SO2 <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>EMISIONES TOTALES <span style={{fontWeight:'normal'}}>(Ton CO2 eq)</span></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {gaseososMoviles.map((row, idx) => {
                          const consumo = row.consumo ? parseFloat(row.consumo) : 0;
                          const poderCalorifico = parseFloat(row.poderCalorifico) || 0;
                          const energia = (consumo && poderCalorifico) ? (consumo * poderCalorifico / 1000000) : 0;
                          const factorCO2 = parseFloat(row.factorCO2) || 0;
                          const factorCH4 = parseFloat(row.factorCH4) || 0;
                          const factorN2O = parseFloat(row.factorN2O) || 0;
                          const factorSO2 = parseFloat(row.factorSO2) || 0;
                          const emisionCO2 = energia * factorCO2;
                          const emisionCH4 = energia * factorCH4;
                          const emisionN2O = energia * factorN2O;
                          const emisionSO2 = energia * factorSO2;
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return (
                            <tr key={idx}>
                              <td style={{minWidth:180, verticalAlign:'middle'}}>{idx + 1}</td>
                              <td style={{minWidth:180}}>
                                <Input
                                  type="select"
                                  value={row.combustible}
                                  onChange={e => handleGaseosoMovilChange(idx, "combustible", e.target.value)}
                                  style={{minWidth:180}}
                                >
                                  <option value="">Seleccione...</option>
                                  {FACTORES_GASEOSOS.map(f => (
                                    <option key={f.nombre} value={f.nombre}>{f.nombre}</option>
                                  ))}
                                </Input>
                              </td>
                              <td style={{minWidth:180}}><Input type="number" value={row.consumo} onChange={e => handleGaseosoMovilChange(idx, "consumo", e.target.value)} min="0" style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.poderCalorifico} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={energia ? energia.toFixed(6) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorCH4} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorN2O} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={row.factorSO2} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCO2 ? emisionCO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionCH4 ? emisionCH4.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionN2O ? emisionN2O.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionSO2 ? emisionSO2.toFixed(4) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{minWidth:180}} /></td>
                              <td style={{minWidth:180}}>
                                {gaseososMoviles.length > 1 && (
                                  <Button color="danger" size="sm" onClick={() => removeGaseosoMovilRow(idx)} title="Eliminar fila"><FeatherIcon icon="trash-2" size={16} /></Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>Emisiones Gaseosos Móviles:</strong> {
                        gaseososMoviles.reduce((acc, row) => {
                          const consumo = row.consumo ? parseFloat(row.consumo) : 0;
                          const poderCalorifico = parseFloat(row.poderCalorifico) || 0;
                          const energia = (consumo && poderCalorifico) ? (consumo * poderCalorifico / 1000000) : 0;
                          const factorCO2 = parseFloat(row.factorCO2) || 0;
                          const factorCH4 = parseFloat(row.factorCH4) || 0;
                          const factorN2O = parseFloat(row.factorN2O) || 0;
                          const emisionCO2 = energia * factorCO2;
                          const emisionCH4 = energia * factorCH4;
                          const emisionN2O = energia * factorN2O;
                          const emisionesTotales = ((emisionCO2 + (emisionCH4 * 25) + (emisionN2O * 298)) / 1000);
                          return acc + emisionesTotales;
                        }, 0).toFixed(2)
                      } Ton CO₂e
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addGaseosoMovilRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>

                    {/* Extintores - diseño unificado */}
                    <h4 className="formulario-section-title">Alcance 1: Emisiones Directas por Recargas de Extintores</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>No.</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Tipo de extintor</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Cantidad anual recargada <span style={{fontWeight:'normal'}}>(Kg)</span></th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Potencial de Calentamiento Global (PCG ó GWP)</th>
                          <th style={{verticalAlign:'middle', fontWeight:'bold'}}>Emisiones Parciales <span style={{fontWeight:'normal'}}>(kg CO2)</span></th>
                        </tr>
                      </thead>
                      <tbody>
                        {extintores.map((row, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td style={{minWidth:180}}>
                              <Input
                                type="select"
                                value={row.tipo}
                                onChange={e => handleExtintorChange(idx, 'tipo', e.target.value)}
                              >
                                <option value="">Seleccione...</option>
                                {FACTORES_EXTINTORES.map(f => (
                                  <option key={f.tipo} value={f.tipo}>{f.tipo}</option>
                                ))}
                              </Input>
                            </td>
                            <td><Input type="number" value={row.cantidad} onChange={e => handleExtintorChange(idx, 'cantidad', e.target.value)} min="0" /></td>
                            <td><Input value={row.pcg} readOnly tabIndex={-1} style={{background:'#e9ecef'}} /></td>
                            <td><Input value={row.emisionesParciales} readOnly tabIndex={-1} style={{background:'#e9ecef'}} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>EMISIONES TOTALES (Ton CO2 eq):</strong> {extintores.reduce((acc, curr) => acc + (parseFloat(curr.emisionesParciales) || 0), 0) / 1000.0 > 0 ? (extintores.reduce((acc, curr) => acc + (parseFloat(curr.emisionesParciales) || 0), 0) / 1000.0).toFixed(2) : '0.00'}
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addExtintorRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>
                    {/* Electricidad - Alcance 2 */}
                    <h4 className="formulario-section-title">Alcance 2: Emisiones Indirectas por Consumo de Energía Eléctrica</h4>
                    <Table bordered responsive size="sm" className="formulario-table">
                      <thead className="table-light">
                        <tr>
                          <th style={{minWidth:120}}>No.</th>
                          <th style={{minWidth:120}}>Año</th>
                          <th style={{minWidth:120}}>Instalación</th>
                          <th style={{minWidth:120}}>Enero</th>
                          <th style={{minWidth:120}}>Febrero</th>
                          <th style={{minWidth:120}}>Marzo</th>
                          <th style={{minWidth:120}}>Abril</th>
                          <th style={{minWidth:120}}>Mayo</th>
                          <th style={{minWidth:120}}>Junio</th>
                          <th style={{minWidth:120}}>Julio</th>
                          <th style={{minWidth:120}}>Agosto</th>
                          <th style={{minWidth:120}}>Septiembre</th>
                          <th style={{minWidth:120}}>Octubre</th>
                          <th style={{minWidth:120}}>Noviembre</th>
                          <th style={{minWidth:120}}>Diciembre</th>
                          <th style={{minWidth:120}}>Consumo anual (kWh)</th>
                          <th style={{minWidth:120}}>Factor de emisión CO2 (kg CO2/kWh)</th>
                          <th style={{minWidth:120}}>Emisiones Parciales (kg CO2)</th>
                          <th style={{minWidth:120}}>EMISIONES TOTALES (Ton CO2 eq)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {electricidad.map((row, idx) => {
                          // Calcular consumo anual y emisiones parciales si no están calculados
                          const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                          const consumoAnual = meses.reduce((acc, m) => acc + (parseFloat(row[m]) || 0), 0);
                          const emisionesParciales = consumoAnual * FACTOR_ELECTRICO;
                          const emisionesTotales = emisionesParciales / 1000.0;
                          return (
                          <tr key={idx}>
                            <td style={{minWidth:120}}>{idx + 1}</td>
                            <td style={{minWidth:120}}>
                              <Input type="text" value={row.año} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} />
                            </td>
                            <td style={{minWidth:120}}>
                              <Input type="text" value={row.instalacion} onChange={e => handleElectricidadChange(idx, 'instalacion', e.target.value)} style={{minWidth:120}} />
                            </td>
                            <td style={{minWidth:120}}><Input type="number" value={row.enero} onChange={e => handleElectricidadChange(idx, 'enero', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.febrero} onChange={e => handleElectricidadChange(idx, 'febrero', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.marzo} onChange={e => handleElectricidadChange(idx, 'marzo', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.abril} onChange={e => handleElectricidadChange(idx, 'abril', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.mayo} onChange={e => handleElectricidadChange(idx, 'mayo', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.junio} onChange={e => handleElectricidadChange(idx, 'junio', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.julio} onChange={e => handleElectricidadChange(idx, 'julio', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.agosto} onChange={e => handleElectricidadChange(idx, 'agosto', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.septiembre} onChange={e => handleElectricidadChange(idx, 'septiembre', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.octubre} onChange={e => handleElectricidadChange(idx, 'octubre', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.noviembre} onChange={e => handleElectricidadChange(idx, 'noviembre', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input type="number" value={row.diciembre} onChange={e => handleElectricidadChange(idx, 'diciembre', e.target.value)} min="0" style={{minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input value={consumoAnual} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input value={FACTOR_ELECTRICO} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input value={emisionesParciales ? emisionesParciales.toFixed(2) : ''} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                            <td style={{minWidth:120}}><Input value={emisionesTotales ? emisionesTotales.toFixed(2) : ''} readOnly tabIndex={-1} style={{background:'#e9ecef', minWidth:120}} /></td>
                          </tr>
                        )})}
                      </tbody>
                    </Table>
                    <div className="resultado-emisiones mb-3">
                      <strong>EMISIONES TOTALES (Ton CO2 eq):</strong> {
                        (() => {
                          const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
                          const total = electricidad.reduce((acc, row) => {
                            const consumoAnual = meses.reduce((a, m) => a + (parseFloat(row[m]) || 0), 0);
                            const emisionesParciales = consumoAnual * FACTOR_ELECTRICO;
                            return acc + (emisionesParciales / 1000.0);
                          }, 0);
                          return total > 0 ? total.toFixed(2) : '0.00';
                        })()
                      }
                    </div>
                    <div className="d-flex formulario-add-row">
                      <Button color="success" outline size="sm" onClick={addElectricidadRow}>
                        <FeatherIcon icon="plus" size={16} className="me-1" /> Agregar fila
                      </Button>
                    </div>
                  </form>
                )}
                {/* RESUMEN Y GRÁFICO DE EMISIONES GEI */}
                <div className="mt-5" id="resultados-totales">
                  {/* Mostrar botón Calcular Resumen solo en step 2 y cuando no se ha calculado el resumen */}
                  {step === 2 && !resumenCalculado && (
                    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                      <button
                        className="btn btn-success"
                        onClick={() => setResumenCalculado(true)}
                        style={{ fontSize: '1.2rem', padding: '0.7rem 2.5rem', borderRadius: '2rem', boxShadow: '0 2px 8px #b2dfdb' }}
                      >
                        Calcular Resumen
                      </button>
                    </div>
                  )}
                  {/* Mostrar resumen solo después de calcular */}
                  {resumenCalculado && (
                    <div ref={resumenRef} style={{ maxWidth: 900, margin: '2rem auto', background: '#f6fff7', borderRadius: 28, boxShadow: '0 8px 32px #b7e4c7', border: '2px solid #b7e4c7', padding: 48, textAlign: 'center' }}>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24}}>
      <div style={{background:'#d8f3dc', borderRadius:'50%', width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center', marginRight:16, boxShadow:'0 2px 8px #b7e4c7'}}>
        <FeatherIcon icon="activity" size={36} color="#1b5e20" />
      </div>
      <div>
        <h2 style={{color:'#1b5e20', fontWeight:800, margin:0, fontSize:32, letterSpacing:0.5}}>Resumen de Consumo de la Empresa</h2>
      </div>
    </div>
    <div style={{display:'flex', flexWrap:'wrap', gap:32, justifyContent:'center'}}>
      <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #d8f3dc', padding:24, minWidth:260, maxWidth:320, flex:1, border:'2px solid #b7e4c7'}}>
        <h3 style={{color:'#1b5e20', fontWeight:700, marginBottom:16, fontSize:20}}>Datos de la Empresa</h3>
        <div style={{fontSize:16, lineHeight:1.7, textAlign:'left'}}>
          <b>Nombre:</b> {datosEmpresa.nombreEmpresa || '-'}<br/>
          <b>NIT:</b> {datosEmpresa.nit || '-'}<br/>
          <b>Dirección:</b> {datosEmpresa.direccion || '-'}<br/>
          <b>Departamento:</b> {datosEmpresa.departamento || '-'}<br/>
          <b>Municipio:</b> {datosEmpresa.municipio || '-'}<br/>
          <b>Año Base:</b> {datosEmpresa.añoBase || '-'}<br/>
          <b>Fecha Reporte:</b> {datosEmpresa.fechaReporte || '-'}<br/>
          <b>Teléfono:</b> {datosEmpresa.telefono || '-'}<br/>
          <b>Correo:</b> {datosEmpresa.correo || '-'}<br/>
          <b>Responsable:</b> {datosEmpresa.personaElabora || '-'}<br/>
          <b>Cargo:</b> {datosEmpresa.cargo || '-'}
        </div>
      </div>
      <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 12px #0001', padding:24, minWidth:320, flex:1, border:'1.5px solid #e0f2f1'}}>
        <h3 style={{color:'#009688', fontWeight:700, marginBottom:16, fontSize:20, textAlign:'center'}}>Emisiones por Alcance</h3>
        <table style={{width:'100%', borderCollapse:'collapse', margin:'0 0 18px 0', fontSize:17}}>
          <thead>
            <tr style={{background:'#b7e4c7', color:'#1b5e20'}}>
              <th style={{padding:8, borderRadius:'8px 0 0 0'}}>Alcance</th>
              <th style={{padding:8, borderRadius:'0 8px 0 0'}}>Emisiones (Ton CO₂e)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{background:'#d8f3dc'}}>
              <td style={{padding:8}}>Alcance 1</td>
              <td style={{padding:8, textAlign:'right'}}>{emisiones.alcance1.toFixed(3)}</td>
            </tr>
            <tr style={{background:'#fff'}}>
              <td style={{padding:8}}>Alcance 2</td>
              <td style={{padding:8, textAlign:'right'}}>{emisiones.alcance2.toFixed(3)}</td>
            </tr>
            <tr style={{background:'#d8f3dc'}}>
              <td style={{padding:8}}>Alcance 3</td>
              <td style={{padding:8, textAlign:'right'}}>{emisiones.alcance3.toFixed(3)}</td>
            </tr>
            <tr style={{fontWeight:'bold', background:'#b7e4c7', color:'#1b5e20'}}>
              <td style={{padding:8}}>Total</td>
              <td style={{padding:8, textAlign:'right'}}>{totalEmisiones.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
        <div style={{
          margin:'18px 0 0 0',
          fontSize:20,
          fontWeight:800,
          textAlign:'center',
          color: totalEmisiones < 1000 ? '#388e3c' : totalEmisiones < 3000 ? '#43a047' : '#b7e4c7',
          background: totalEmisiones < 1000 ? '#d8f3dc' : totalEmisiones < 3000 ? '#b7e4c7' : '#f6fff7',
          borderRadius: 12,
          padding: '12px 0',
          boxShadow: '0 2px 8px #b7e4c7',
          border: '1.5px solid #b7e4c7',
          letterSpacing: 0.2
        }}>
          {evaluacion}
        </div>
        <div style={{
          margin:'12px 0 0 0',
          fontSize:16,
          color:'#1b5e20',
          background:'#e9fbe5',
          borderRadius: 10,
          padding: '8px 0',
          fontWeight:600,
          textAlign:'center',
          boxShadow:'0 1px 4px #b7e4c7',
          border:'1px solid #b7e4c7'
        }}>
          <FeatherIcon icon="tree" size={18} color="#43a047" style={{marginRight:8, marginBottom:-3}} />
          Para compensar estas emisiones, deberías plantar al menos <b style={{color:'#388e3c'}}>{arboles}</b> árboles.
        </div>
      </div>
    </div>
    <div style={{display:'flex', justifyContent:'center', marginTop:32}}>
      <button
        className="btn-download-green"
        style={{
          fontWeight: 800,
          fontSize: 17,
          borderRadius: 24,
          padding: '12px 36px',
          background: 'linear-gradient(90deg, #43a047 0%, #388e3c 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 2px 12px #b7e4c7',
          transition: 'background 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #388e3c 0%, #1b5e20 100%)';
          e.currentTarget.style.boxShadow = '0 4px 18px #43a047';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #43a047 0%, #388e3c 100%)';
          e.currentTarget.style.boxShadow = '0 2px 12px #b7e4c7';
        }}
        onClick={() => {
          // Mostrar solo la sección de resultados y cálculos al imprimir
          const originalTitle = document.title;
          document.title = 'Resumen y Cálculos Huella de Carbono';
          const printContents = document.getElementById('resultados-totales').innerHTML;
          const originalContents = document.body.innerHTML;
          document.body.innerHTML = printContents;
          window.print();
          document.body.innerHTML = originalContents;
          document.title = originalTitle;
          window.location.reload();
        }}
      >
        <FeatherIcon icon="download" className="me-2" color="#fff" /> Descargar Pantallazo
      </button>
    </div>
  </div>
)}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FormularioHuella;
