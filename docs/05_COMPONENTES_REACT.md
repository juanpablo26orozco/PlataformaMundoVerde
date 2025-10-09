# ⚛️ Componentes React - Plataforma Mundo Verde

## 📋 Tabla de Contenidos

1. [Estructura de Componentes](#estructura)
2. [Componentes Principales](#principales)
3. [Context API](#context)
4. [Servicios](#servicios)
5. [Hooks Personalizados](#hooks)
6. [Optimizaciones](#optimizaciones)

---

## 🏗️ Estructura de Componentes

```
src/
├── component/
│   ├── HuellaCarbono/
│   │   ├── FormularioHuella.js          ⭐ PRINCIPAL
│   │   ├── ResultadoHuella.js           Dashboard de resultados
│   │   ├── CalculadoraSection.js        Landing section
│   │   └── EmisionesGEIChart.js         Gráfico Chart.js
│   │
│   ├── Autogestion/
│   │   ├── FormularioAutogestion.js     ⭐ 210 PREGUNTAS
│   │   ├── ResultadoAutogestion.js      Dashboard resultados
│   │   └── SeccionPreguntas.js          Bloques de preguntas
│   │
│   ├── Legal/
│   │   ├── ModalPoliticas.js            ⭐ GDPR/Ley 1581
│   │   ├── TerminosCondiciones.js       Contenido términos
│   │   └── PoliticasPrivacidad.js       Contenido privacidad
│   │
│   ├── Navbar/
│   │   ├── Navigation.js                Menú principal
│   │   └── LanguageSwitcher.js          Selector idioma
│   │
│   └── Common/
│       ├── LoadingSpinner.js
│       ├── ErrorBoundary.js
│       └── NotificationToast.js
│
├── pages/
│   ├── LandingPage.js                   Home
│   ├── HuellaCarbono/
│   │   └── HuellaCarbono.js             Página calculadora
│   └── Autogestion/
│       └── AutogestionPage.js           Página autogestión
│
├── context/
│   └── EmissionFactorsContext.js        ⭐ CACHÉ 24H
│
├── services/
│   ├── DatabaseService.js               Queries PostgreSQL
│   ├── CalculationService.js            Cálculos emisiones
│   └── EmailService.js                  SendGrid
│
└── database/
    ├── config.js                        Pool PostgreSQL
    └── queries.js                       40+ queries SQL
```

---

## 🎯 Componentes Principales

### 1. FormularioHuella.js

**Ubicación:** `src/component/HuellaCarbono/FormularioHuella.js`  
**Propósito:** Formulario principal de cálculo de huella de carbono  
**Líneas:** ~800

**Estados principales:**
```javascript
const [datosEmpresa, setDatosEmpresa] = useState({
  nombreEmpresa: '',
  nit: '',
  sector: '',
  departamento: '',
  municipio: '',
  direccion: '',
  telefono: '',
  correo: '',
  personaElabora: '',
  cargo: ''
});

const [fecha, setFecha] = useState('');
const [solidos, setSolidos] = useState([]);
const [liquidos, setLiquidos] = useState([]);
const [gaseosos, setGaseosos] = useState([]);
const [electricidad, setElectricidad] = useState([]);
const [vuelos, setVuelos] = useState([]);
const [extintores, setExtintores] = useState([]);
const [resultados, setResultados] = useState(null);
const [codigoSeguimiento, setCodigoSeguimiento] = useState(null);
```

**Tabs implementados:**
```javascript
const [activeTab, setActiveTab] = useState('solidos');

// Tabs: 'solidos', 'liquidos', 'gaseosos', 'electricidad', 'vuelos', 'extintores'
```

**Flujo de guardado:**
```javascript
const handleGuardarResumen = async () => {
  // 1. Validar datos
  if (!datosEmpresa.nombreEmpresa || !datosEmpresa.nit) {
    alert('Faltan datos de empresa');
    return;
  }

  // 2. Preparar JSON completo
  const datosCompletos = {
    datosEmpresa,
    fecha,
    añoReporte: new Date(fecha).getFullYear(),
    solidos,
    liquidos,
    gaseosos,
    electricidad,
    vuelos,
    extintores,
    totalEmisiones: resultados.total
  };

  // 3. Enviar a backend
  const response = await fetch('/api/guardar-huella', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCompletos)
  });

  const data = await response.json();

  // 4. Guardar código de seguimiento
  if (data.success) {
    setCodigoSeguimiento(data.codigo);  // HC-2025-000001
    alert(`✅ Guardado exitosamente. Código: ${data.codigo}`);
  }
};
```

**Cálculo de emisiones:**
```javascript
const calcularEmisionesTotal = () => {
  let alcance1 = 0;
  let alcance2 = 0;
  let alcance3 = 0;

  // Alcance 1: Combustibles (sólidos, líquidos, gaseosos)
  solidos.forEach(s => {
    alcance1 += s.emisionesTotales || 0;
  });
  liquidos.forEach(l => {
    alcance1 += l.emisionesTotales || 0;
  });
  gaseosos.forEach(g => {
    alcance1 += g.emisionesTotales || 0;
  });
  extintores.forEach(e => {
    alcance1 += e.emisionesTotales || 0;
  });

  // Alcance 2: Electricidad
  electricidad.forEach(e => {
    alcance2 += e.emisionesTotales || 0;
  });

  // Alcance 3: Vuelos
  vuelos.forEach(v => {
    alcance3 += v.emisionesTotales || 0;
  });

  const total = alcance1 + alcance2 + alcance3;

  // Nivel de evaluación
  let nivel;
  if (total < 50) nivel = 'Excelente';
  else if (total < 100) nivel = 'Aceptable';
  else nivel = 'Alto impacto';

  // Árboles para compensar (1 árbol absorbe 0.445 Ton CO₂/año)
  const arboles = Math.ceil(total / 0.445);

  setResultados({
    alcance1,
    alcance2,
    alcance3,
    total,
    nivel,
    arboles
  });
};
```

**Integración con EmissionFactorsContext:**
```javascript
const { factors } = useEmissionFactors();

// Cargar factores automáticamente al seleccionar combustible
const handleSelectCombustible = (tipo) => {
  const factor = factors.solidos.find(f => f.nombre === tipo);
  if (factor) {
    setCurrentCombustible({
      tipo,
      poderCalorifico: factor.poder_calorifico,
      factorCO2: factor.factor_co2,
      factorCH4: factor.factor_ch4,
      factorN2O: factor.factor_n2o
    });
  }
};
```

---

### 2. FormularioAutogestion.js

**Ubicación:** `src/component/Autogestion/FormularioAutogestion.js`  
**Propósito:** 210 preguntas de autodiagnóstico  
**Líneas:** ~1200

**Estructura de preguntas:**
```javascript
const esquemas = {
  A: {  // Gestión Económica (26 preguntas)
    A1: {
      nombre: "Planificación Estratégica",
      preguntas: [
        {
          id: "A_q_1",
          texto: "¿La empresa tiene un plan estratégico definido?",
          opciones: ["IMP", "M", "AC", "NA"]  // Implementado, Mejora, A cumplir, No aplica
        }
        // ... más preguntas
      ]
    },
    A2: { /* ... */ }
  },
  B: {  // Gestión Ambiental (77 preguntas)
    B1: { /* ... */ },
    B2: { /* ... */ }
  },
  C: {  // Gestión de Energía (20 preguntas)
  },
  D: {  // Seguridad y Salud (28 preguntas)
  },
  E: {  // Gestión Social (35 preguntas)
  },
  F: {  // Almacén y Logística (20 preguntas)
  }
};
```

**Estado de respuestas:**
```javascript
const [respuestas, setRespuestas] = useState({});
// Formato: { "A_q_1": "IMP", "A_q_2": "M", ... }

const [promedios, setPromedios] = useState({
  A: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 26 },
  B: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 77 },
  C: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 20 },
  D: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 28 },
  E: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 35 },
  F: { porcentajeFinal: 0, puntajeObtenido: 0, totalPreguntas: 20 }
});
```

**Sistema de puntajes:**
```javascript
const puntajes = {
  // Secciones A-D
  "IMP": 3,   // Implementado
  "M": 2,     // En mejora
  "AC": 1,    // A cumplir
  "NA": 0,    // No aplica

  // Secciones E-F
  "Siempre": 3,
  "Casi siempre": 2,
  "Algunas veces": 1,
  "Nunca": 0
};

const calcularPorcentaje = (seccion) => {
  const preguntas = esquemas[seccion];
  let puntajeObtenido = 0;
  let puntajeMaximo = 0;

  Object.values(preguntas).forEach(bloque => {
    bloque.preguntas.forEach(pregunta => {
      const respuesta = respuestas[pregunta.id];
      if (respuesta && respuesta !== "NA") {
        puntajeObtenido += puntajes[respuesta];
        puntajeMaximo += 3;
      }
    });
  });

  return (puntajeObtenido / puntajeMaximo) * 100;
};
```

**Guardar con PDF embebido:**
```javascript
const handleGuardarResumen = async () => {
  // 1. Validar 210 respuestas completas
  const totalRespuestas = Object.keys(respuestas).length;
  if (totalRespuestas < 210) {
    alert(`Faltan ${210 - totalRespuestas} preguntas por responder`);
    return;
  }

  // 2. Calcular promedios finales
  const promediosCalculados = {};
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(seccion => {
    promediosCalculados[seccion] = {
      porcentajeFinal: calcularPorcentaje(seccion)
    };
  });

  const porcentajeFinal = Object.values(promediosCalculados)
    .reduce((sum, p) => sum + p.porcentajeFinal, 0) / 6;

  // 3. Preparar datos completos
  const datosCompletos = {
    datosEmpresa,
    respuestas: Object.entries(respuestas).map(([id, respuesta]) => ({
      preguntaId: id,
      respuesta,
      puntaje: puntajes[respuesta]
    })),
    promedios: promediosCalculados,
    porcentajeFinal,
    esquemas,
    opciones: puntajes
  };

  // 4. Enviar a backend (genera PDF automáticamente)
  const response = await fetch('/api/guardar-autogestion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCompletos)
  });

  const data = await response.json();

  if (data.success) {
    setCodigoSeguimiento(data.codigo);  // AG-2025-000001
    alert(`✅ Guardado. Código: ${data.codigo}\nPDF de ${(data.pdf_size/1024).toFixed(0)}KB almacenado en BD`);
  }
};
```

---

### 3. ModalPoliticas.js

**Ubicación:** `src/component/Legal/ModalPoliticas.js`  
**Propósito:** Consentimiento GDPR/Ley 1581  
**Líneas:** ~300

**Estado:**
```javascript
const [modalOpen, setModalOpen] = useState(false);
const [aceptaTerminos, setAceptaTerminos] = useState(false);
const [scrollCompleto, setScrollCompleto] = useState(false);
```

**Flujo:**
```javascript
useEffect(() => {
  // Verificar si ya aceptó previamente
  const consentimiento = localStorage.getItem('consentimientoAceptado');
  if (!consentimiento) {
    setModalOpen(true);  // Mostrar modal
  }
}, []);

const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  if (bottom) {
    setScrollCompleto(true);  // Habilitar checkbox
  }
};

const handleAceptar = async () => {
  if (!aceptaTerminos) {
    alert('Debes aceptar los términos');
    return;
  }

  // Registrar en BD
  const response = await fetch('/api/consentimiento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      acepta_terminos: true,
      acepta_privacidad: true,
      email_usuario: null,  // Opcional
      nombre_usuario: null
    })
  });

  if (response.ok) {
    localStorage.setItem('consentimientoAceptado', 'true');
    setModalOpen(false);
  }
};
```

**Detección automática backend:**
```javascript
// En setupProxy.js
const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
const userAgent = req.headers['user-agent'];
const navegador = detectarNavegador(userAgent);  // "Chrome 120"
const sistemaOperativo = detectarSO(userAgent);  // "Windows 10"

// Se guarda automáticamente en BD
```

---

## 🌐 Context API

### EmissionFactorsContext.js

**Ubicación:** `src/context/EmissionFactorsContext.js`  
**Propósito:** Caché de factores de emisión (24h)

**Implementación:**
```javascript
const EmissionFactorsContext = createContext();

export const EmissionFactorsProvider = ({ children }) => {
  const [factors, setFactors] = useState({
    solidos: [],
    liquidos: [],
    gaseosos: [],
    electricidad: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CACHE_KEY = 'emission_factors';
  const CACHE_DATE_KEY = 'emission_factors_date';
  const CACHE_DURATION = 24 * 60 * 60 * 1000;  // 24 horas

  useEffect(() => {
    // Intentar cargar desde caché
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);

    if (cachedData && cachedDate) {
      const now = new Date().getTime();
      const cacheTime = new Date(cachedDate).getTime();

      if (now - cacheTime < CACHE_DURATION) {
        // Caché válido
        setFactors(JSON.parse(cachedData));
        setLoading(false);
        console.log('✅ Factores cargados desde caché');
        return;
      }
    }

    // Caché expirado o no existe - Recargar desde API
    fetchFactors();
  }, []);

  const fetchFactors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/catalogos/combustibles');
      const data = await response.json();

      if (data.success) {
        setFactors(data.data);
        
        // Guardar en caché
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
        localStorage.setItem(CACHE_DATE_KEY, new Date().toISOString());
        
        console.log('✅ Factores cargados desde API y almacenados en caché');
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Error cargando factores:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_DATE_KEY);
    fetchFactors();
  };

  return (
    <EmissionFactorsContext.Provider value={{ factors, loading, error, clearCache }}>
      {children}
    </EmissionFactorsContext.Provider>
  );
};

export const useEmissionFactors = () => useContext(EmissionFactorsContext);
```

**Uso en componentes:**
```javascript
import { useEmissionFactors } from '../../context/EmissionFactorsContext';

function FormularioHuella() {
  const { factors, loading, error } = useEmissionFactors();

  if (loading) return <LoadingSpinner />;
  if (error) return <Error mensaje={error} />;

  // Usar factors.solidos, factors.liquidos, etc.
}
```

---

## 🛠️ Servicios

### CalculationService.js

**Ubicación:** `src/services/CalculationService.js`  
**Propósito:** Cálculos complejos de emisiones

**Funciones principales:**
```javascript
class CalculationService {
  // Combustibles sólidos
  static calcularEmisionesSolidos(combustible) {
    const { consumoAnual, poderCalorifico, factorCO2, factorCH4, factorN2O } = combustible;

    // Energía consumida (TJ)
    const energiaTJ = (consumoAnual * poderCalorifico) / 1000000;

    // Emisiones por gas (Kg)
    const emisionCO2 = (energiaTJ * factorCO2) / 1000;
    const emisionCH4 = (energiaTJ * factorCH4) / 1000;
    const emisionN2O = (energiaTJ * factorN2O) / 1000;

    // Conversión a CO₂ equivalente
    const GWP_CH4 = 25;
    const GWP_N2O = 298;

    const totalKg = emisionCO2 + (emisionCH4 * GWP_CH4) + (emisionN2O * GWP_N2O);
    const totalTon = totalKg / 1000;

    return {
      energiaTJ,
      emisionCO2,
      emisionCH4,
      emisionN2O,
      emisionesTotales: totalTon
    };
  }

  // Vuelos aéreos
  static calcularEmisionesVuelo(vuelo) {
    const { distanciaKm, pasajeros, clase } = vuelo;

    // Factores según clase
    const factores = {
      'Economica': 0.158,   // kg CO₂/pasajero/km
      'Ejecutiva': 0.237
    };

    const factor = factores[clase] || factores['Economica'];
    const emisionesKg = distanciaKm * pasajeros * factor;
    const emisionesTon = emisionesKg / 1000;

    return {
      factorEmision: factor,
      emisionesTotales: emisionesTon
    };
  }

  // Electricidad
  static calcularEmisionesElectricidad(consumo) {
    const { consumoMensual, factorEmision } = consumo;

    // Sumar 12 meses
    const totalKWh = Object.values(consumoMensual)
      .reduce((sum, kwh) => sum + (kwh || 0), 0);

    const totalMWh = totalKWh / 1000;
    const emisionesTon = (totalKWh * factorEmision) / 1000;

    return {
      totalKWh,
      totalMWh,
      emisionesTotales: emisionesTon
    };
  }
}

export default CalculationService;
```

---

## 🎣 Hooks Personalizados

### useFormValidation.js

```javascript
import { useState, useEffect } from 'react';

export const useFormValidation = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [values]);

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setValues(initialState);
    setErrors({});
  };

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleReset,
    setValues
  };
};
```

---

## ⚡ Optimizaciones

### 1. React.memo para componentes pesados

```javascript
const EmisionesGEIChart = React.memo(({ data }) => {
  // Gráfico Chart.js - solo re-renderiza si data cambia
  return <canvas id="emisionesChart" />;
});
```

### 2. useMemo para cálculos costosos

```javascript
const emisionesTotales = useMemo(() => {
  return combustibles.reduce((sum, c) => sum + c.emisionesTotales, 0);
}, [combustibles]);
```

### 3. useCallback para funciones

```javascript
const handleAgregarCombustible = useCallback((nuevo) => {
  setSolidos(prev => [...prev, nuevo]);
}, []);
```

### 4. Lazy loading de páginas

```javascript
import { lazy, Suspense } from 'react';

const HuellaCarbono = lazy(() => import('./pages/HuellaCarbono/HuellaCarbono'));
const AutogestionPage = lazy(() => import('./pages/Autogestion/AutogestionPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/calculadora" element={<HuellaCarbono />} />
        <Route path="/autogestion" element={<AutogestionPage />} />
      </Routes>
    </Suspense>
  );
}
```

---

**Última actualización:** Octubre 9, 2025  
**Versión:** 2.3.0  
**Total componentes:** 30+
