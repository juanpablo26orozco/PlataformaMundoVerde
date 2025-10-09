-- ============================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - PLATAFORMA MUNDO VERDE
-- ============================================================================
-- Versión: 1.1.0
-- Fecha: 9 de Octubre, 2025 (actualizado)
-- Descripción: Esquema completo para sistema de gestión ambiental
-- Incluye: 21 tablas + índices + constraints + funciones
-- Actualización: Se agregó tabla factores_vuelos faltante
-- ============================================================================

-- ============================================================================
-- CONFIGURACIÓN INICIAL
-- ============================================================================

-- Asegurarnos de estar en la base de datos correcta
\c mundoverde_db

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLA: calculos_huella_carbono
-- Descripción: Almacena los cálculos principales de huella de carbono
-- ============================================================================

CREATE TABLE calculos_huella_carbono (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(20) UNIQUE NOT NULL,
    
    -- Datos de empresa (guardado directo, sin foreign keys)
    nombre_empresa VARCHAR(500) NOT NULL,
    nit VARCHAR(50) NOT NULL,
    sector VARCHAR(255),
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    
    -- Persona responsable
    persona_elabora VARCHAR(255),
    cargo VARCHAR(255),
    
    -- Año y fechas
    año_reporte INTEGER NOT NULL,
    fecha_reporte DATE NOT NULL,
    periodo_inicio DATE,
    periodo_fin DATE,
    
    -- Resultados totales por alcance
    emisiones_alcance_1 DECIMAL(15,4) DEFAULT 0,  -- Ton CO₂e
    emisiones_alcance_2 DECIMAL(15,4) DEFAULT 0,  -- Ton CO₂e
    emisiones_alcance_3 DECIMAL(15,4) DEFAULT 0,  -- Ton CO₂e
    emisiones_totales DECIMAL(15,4) GENERATED ALWAYS AS (
        emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3
    ) STORED,
    
    -- Evaluación y recomendaciones
    nivel_evaluacion VARCHAR(50),  -- 'Excelente', 'Aceptable', 'Alto impacto'
    arboles_compensar INTEGER,
    
    -- Metadata
    estado VARCHAR(50) DEFAULT 'finalizado',
    version INTEGER DEFAULT 1,
    notas TEXT,
    
    -- Control de fechas
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT año_reporte_valido CHECK (año_reporte >= 2000 AND año_reporte <= 2100),
    CONSTRAINT codigo_formato_valido CHECK (codigo_seguimiento ~ '^HC-[0-9]{4}-[0-9]{6}$')
);

-- Índices para optimización
CREATE INDEX idx_huella_codigo ON calculos_huella_carbono(codigo_seguimiento);
CREATE INDEX idx_huella_nit ON calculos_huella_carbono(nit);
CREATE INDEX idx_huella_fecha ON calculos_huella_carbono(fecha_reporte);
CREATE INDEX idx_huella_año ON calculos_huella_carbono(año_reporte);

COMMENT ON TABLE calculos_huella_carbono IS 'Cálculos principales de huella de carbono por empresa';
COMMENT ON COLUMN calculos_huella_carbono.codigo_seguimiento IS 'Código único formato: HC-YYYY-NNNNNN';

-- ============================================================================
-- TABLA: combustibles_solidos
-- Descripción: Consumo de combustibles sólidos (carbón, biomasa, etc.)
-- ============================================================================

CREATE TABLE combustibles_solidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL,
    
    -- Consumo
    consumo_anual DECIMAL(15,4),  -- kg/año
    unidad_medida VARCHAR(20) DEFAULT 'kg',
    
    -- Factores de emisión (automáticos según tipo)
    poder_calorifico DECIMAL(15,6),  -- MJ/kg
    factor_co2 DECIMAL(15,6),  -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6),  -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6),  -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6),  -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6),  -- TJ
    emision_co2 DECIMAL(15,4),  -- Kg
    emision_ch4 DECIMAL(15,4),  -- Kg
    emision_n2o DECIMAL(15,4),  -- Kg
    emision_so2 DECIMAL(15,4),  -- Kg
    emisiones_totales DECIMAL(15,4),  -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_solidos_calculo ON combustibles_solidos(calculo_id);
CREATE INDEX idx_solidos_tipo ON combustibles_solidos(tipo_combustible);

COMMENT ON TABLE combustibles_solidos IS 'Consumo de combustibles sólidos estacionarios';

-- ============================================================================
-- TABLA: combustibles_liquidos
-- Descripción: Consumo de combustibles líquidos (gasolina, diesel, etc.)
-- ============================================================================

CREATE TABLE combustibles_liquidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL,
    tipo_fuente VARCHAR(50),  -- 'Estacionario' o 'Móvil'
    
    -- Consumo
    consumo_anual DECIMAL(15,4),  -- litros/año
    densidad DECIMAL(10,6),  -- kg/l
    masa_combustible DECIMAL(15,4),  -- kg
    
    -- Factores de emisión
    poder_calorifico DECIMAL(15,6),  -- MJ/kg
    factor_co2 DECIMAL(15,6),  -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6),  -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6),  -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6),  -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6),  -- TJ
    emision_co2 DECIMAL(15,4),  -- Kg
    emision_ch4 DECIMAL(15,4),  -- Kg
    emision_n2o DECIMAL(15,4),  -- Kg
    emision_so2 DECIMAL(15,4),  -- Kg
    emisiones_totales DECIMAL(15,4),  -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT tipo_fuente_valido CHECK (tipo_fuente IN ('Estacionario', 'Móvil'))
);

CREATE INDEX idx_liquidos_calculo ON combustibles_liquidos(calculo_id);
CREATE INDEX idx_liquidos_tipo ON combustibles_liquidos(tipo_combustible);
CREATE INDEX idx_liquidos_fuente ON combustibles_liquidos(tipo_fuente);

COMMENT ON TABLE combustibles_liquidos IS 'Consumo de combustibles líquidos estacionarios y móviles';

-- ============================================================================
-- TABLA: combustibles_gaseosos
-- Descripción: Consumo de combustibles gaseosos (gas natural, GLP, etc.)
-- ============================================================================

CREATE TABLE combustibles_gaseosos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL,
    tipo_fuente VARCHAR(50),  -- 'Estacionario' o 'Móvil'
    
    -- Consumo
    consumo_anual DECIMAL(15,4),  -- m³/año
    unidad_medida VARCHAR(20) DEFAULT 'm³',
    
    -- Factores de emisión
    poder_calorifico DECIMAL(15,6),  -- MJ/m³
    factor_co2 DECIMAL(15,6),  -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6),  -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6),  -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6),  -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6),  -- TJ
    emision_co2 DECIMAL(15,4),  -- Kg
    emision_ch4 DECIMAL(15,4),  -- Kg
    emision_n2o DECIMAL(15,4),  -- Kg
    emision_so2 DECIMAL(15,4),  -- Kg
    emisiones_totales DECIMAL(15,4),  -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT tipo_fuente_valido CHECK (tipo_fuente IN ('Estacionario', 'Móvil'))
);

CREATE INDEX idx_gaseosos_calculo ON combustibles_gaseosos(calculo_id);
CREATE INDEX idx_gaseosos_tipo ON combustibles_gaseosos(tipo_combustible);
CREATE INDEX idx_gaseosos_fuente ON combustibles_gaseosos(tipo_fuente);

COMMENT ON TABLE combustibles_gaseosos IS 'Consumo de combustibles gaseosos estacionarios y móviles';

-- ============================================================================
-- TABLA: consumo_electricidad
-- Descripción: Consumo mensual de electricidad (Alcance 2)
-- ============================================================================

CREATE TABLE consumo_electricidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Información de la instalación
    año INTEGER,
    instalacion VARCHAR(255),
    
    -- Consumo mensual (kWh)
    enero DECIMAL(15,2) DEFAULT 0,
    febrero DECIMAL(15,2) DEFAULT 0,
    marzo DECIMAL(15,2) DEFAULT 0,
    abril DECIMAL(15,2) DEFAULT 0,
    mayo DECIMAL(15,2) DEFAULT 0,
    junio DECIMAL(15,2) DEFAULT 0,
    julio DECIMAL(15,2) DEFAULT 0,
    agosto DECIMAL(15,2) DEFAULT 0,
    septiembre DECIMAL(15,2) DEFAULT 0,
    octubre DECIMAL(15,2) DEFAULT 0,
    noviembre DECIMAL(15,2) DEFAULT 0,
    diciembre DECIMAL(15,2) DEFAULT 0,
    
    -- Totales calculados automáticamente
    consumo_anual DECIMAL(15,2) GENERATED ALWAYS AS (
        enero + febrero + marzo + abril + mayo + junio + 
        julio + agosto + septiembre + octubre + noviembre + diciembre
    ) STORED,
    
    -- Factor de emisión (Colombia: 0.391 kg CO₂/kWh según UPME 2024)
    factor_emision_co2 DECIMAL(10,6) DEFAULT 0.391,
    
    -- Resultados
    emisiones_parciales DECIMAL(15,4),  -- kg CO₂
    emisiones_totales DECIMAL(15,4),  -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_electricidad_calculo ON consumo_electricidad(calculo_id);
CREATE INDEX idx_electricidad_año ON consumo_electricidad(año);

COMMENT ON TABLE consumo_electricidad IS 'Consumo mensual de electricidad por instalación';
COMMENT ON COLUMN consumo_electricidad.factor_emision_co2 IS 'Factor para Colombia UPME 2024: 0.391 kg CO2/kWh';

-- ============================================================================
-- TABLA: vuelos_aereos
-- Descripción: Vuelos corporativos (Alcance 3)
-- ============================================================================

CREATE TABLE vuelos_aereos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Ruta
    ciudad_origen VARCHAR(255) NOT NULL,
    ciudad_destino VARCHAR(255) NOT NULL,
    pais_origen VARCHAR(100),
    pais_destino VARCHAR(100),
    
    -- Detalles del vuelo
    tipo_vuelo VARCHAR(50),  -- 'Nacional', 'Internacional', 'Corta distancia', 'Larga distancia'
    clase VARCHAR(50),  -- 'Económica', 'Ejecutiva'
    numero_pasajeros INTEGER DEFAULT 1,
    
    -- Distancia y factor
    distancia_km DECIMAL(15,2),
    factor_emision DECIMAL(10,6),  -- kg CO₂/km/pasajero
    
    -- Resultados
    emision_kg DECIMAL(15,4),  -- kg CO₂
    emision_ton DECIMAL(15,4),  -- Ton CO₂
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pasajeros_positivo CHECK (numero_pasajeros > 0),
    CONSTRAINT distancia_positiva CHECK (distancia_km > 0)
);

CREATE INDEX idx_vuelos_calculo ON vuelos_aereos(calculo_id);
CREATE INDEX idx_vuelos_tipo ON vuelos_aereos(tipo_vuelo);

COMMENT ON TABLE vuelos_aereos IS 'Vuelos corporativos - emisiones Alcance 3';

-- ============================================================================
-- TABLA: extintores
-- Descripción: Recargas de extintores (emisiones fugitivas)
-- ============================================================================

CREATE TABLE extintores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de extintor/gas
    tipo_gas VARCHAR(100) NOT NULL,
    
    -- Cantidad recargada
    cantidad DECIMAL(15,4),  -- kg
    
    -- Potencial de Calentamiento Global
    pcg INTEGER,  -- GWP (Global Warming Potential)
    
    -- Resultados
    emisiones_parciales DECIMAL(15,4),  -- kg CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cantidad_positiva CHECK (cantidad >= 0),
    CONSTRAINT pcg_positivo CHECK (pcg >= 0)
);

CREATE INDEX idx_extintores_calculo ON extintores(calculo_id);
CREATE INDEX idx_extintores_tipo ON extintores(tipo_gas);

COMMENT ON TABLE extintores IS 'Recargas de extintores - emisiones fugitivas Alcance 1';
COMMENT ON COLUMN extintores.pcg IS 'Potencial de Calentamiento Global (GWP)';

-- ============================================================================
-- TABLA: calculos_autogestion
-- Descripción: Autodiagnóstico de sostenibilidad
-- ============================================================================

CREATE TABLE calculos_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_seguimiento VARCHAR(20) UNIQUE NOT NULL,
    
    -- Datos de empresa (guardado directo)
    nombre_empresa VARCHAR(500) NOT NULL,
    nit VARCHAR(50) NOT NULL,
    sector VARCHAR(255),
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    direccion TEXT,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    
    -- Persona responsable
    persona_elabora VARCHAR(255),
    cargo VARCHAR(255),
    
    -- Año y fechas
    año_reporte INTEGER NOT NULL,
    fecha_reporte DATE NOT NULL,
    
    -- Resultados por sección (porcentajes 0-100)
    porcentaje_economico DECIMAL(5,2) DEFAULT 0,  -- Sección A
    porcentaje_ambiental DECIMAL(5,2) DEFAULT 0,  -- Sección B
    porcentaje_energia DECIMAL(5,2) DEFAULT 0,  -- Sección C
    porcentaje_seguridad DECIMAL(5,2) DEFAULT 0,  -- Sección D
    porcentaje_social DECIMAL(5,2) DEFAULT 0,  -- Sección E
    porcentaje_almacen DECIMAL(5,2) DEFAULT 0,  -- Sección F
    
    -- Porcentaje final calculado automáticamente
    porcentaje_final DECIMAL(5,2) GENERATED ALWAYS AS (
        (porcentaje_economico + porcentaje_ambiental + porcentaje_energia + 
         porcentaje_seguridad + porcentaje_social + porcentaje_almacen) / 6.0
    ) STORED,
    
    -- Nivel de cumplimiento
    nivel_cumplimiento VARCHAR(50),
    
    -- COLUMNAS PARA PDF Y DATOS OPTIMIZADOS
    pdf_report BYTEA,
    executive_summary JSONB,
    
    -- Metadata
    estado VARCHAR(50) DEFAULT 'finalizado',
    version INTEGER DEFAULT 1,
    notas TEXT,
    
    -- Control
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT año_reporte_valido CHECK (año_reporte >= 2000 AND año_reporte <= 2100),
    CONSTRAINT codigo_formato_valido CHECK (codigo_seguimiento ~ '^AG-[0-9]{4}-[0-9]{6}$'),
    CONSTRAINT porcentajes_validos CHECK (
        porcentaje_economico BETWEEN 0 AND 100 AND
        porcentaje_ambiental BETWEEN 0 AND 100 AND
        porcentaje_energia BETWEEN 0 AND 100 AND
        porcentaje_seguridad BETWEEN 0 AND 100 AND
        porcentaje_social BETWEEN 0 AND 100 AND
        porcentaje_almacen BETWEEN 0 AND 100
    )
);

CREATE INDEX idx_autogestion_codigo ON calculos_autogestion(codigo_seguimiento);
CREATE INDEX idx_autogestion_nit ON calculos_autogestion(nit);
CREATE INDEX idx_autogestion_fecha ON calculos_autogestion(fecha_reporte);
CREATE INDEX idx_autogestion_año ON calculos_autogestion(año_reporte);
CREATE INDEX idx_autogestion_executive_summary ON calculos_autogestion USING gin(executive_summary);

COMMENT ON TABLE calculos_autogestion IS 'Autodiagnósticos de sostenibilidad empresarial';
COMMENT ON COLUMN calculos_autogestion.codigo_seguimiento IS 'Código único formato: AG-YYYY-NNNNNN';
COMMENT ON COLUMN calculos_autogestion.pdf_report IS 'Stores PDF with all 210 detailed responses';
COMMENT ON COLUMN calculos_autogestion.executive_summary IS 'JSON with section summaries and metadata';

-- ============================================================================
-- TABLA: respuestas_autogestion
-- Descripción: Respuestas individuales del autodiagnóstico
-- ============================================================================

CREATE TABLE respuestas_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_autogestion(id) ON DELETE CASCADE,
    
    -- Identificación de la pregunta
    seccion CHAR(1) NOT NULL,  -- 'A', 'B', 'C', 'D', 'E', 'F'
    bloque VARCHAR(10) NOT NULL,  -- 'A1', 'A2', 'B1', 'B2', etc.
    pregunta_id VARCHAR(20) NOT NULL,  -- 'A_q_1', 'A_q_2', etc.
    numero_pregunta INTEGER NOT NULL,
    
    -- Texto de la pregunta (para histórico)
    texto_pregunta TEXT NOT NULL,
    
    -- Respuesta
    respuesta VARCHAR(50) NOT NULL,
    puntaje INTEGER,  -- 0, 1, 2, 3
    
    -- Metadata
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT respuesta_valida CHECK (
        respuesta IN ('IMP', 'M', 'AC', 'NA', 'Siempre', 'Casi siempre', 'Algunas veces', 'Nunca')
    ),
    CONSTRAINT seccion_valida CHECK (seccion IN ('A', 'B', 'C', 'D', 'E', 'F')),
    CONSTRAINT puntaje_valido CHECK (puntaje BETWEEN 0 AND 3)
);

CREATE INDEX idx_respuestas_calculo ON respuestas_autogestion(calculo_id);
CREATE INDEX idx_respuestas_seccion ON respuestas_autogestion(seccion);
CREATE INDEX idx_respuestas_bloque ON respuestas_autogestion(bloque);
CREATE INDEX idx_respuestas_pregunta ON respuestas_autogestion(pregunta_id);

COMMENT ON TABLE respuestas_autogestion IS 'Respuestas individuales de cada pregunta del autodiagnóstico';

-- ============================================================================
-- TABLA: promedios_bloques_autogestion
-- Descripción: Promedios calculados por bloque
-- ============================================================================

CREATE TABLE promedios_bloques_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_autogestion(id) ON DELETE CASCADE,
    
    -- Identificación del bloque
    seccion CHAR(1) NOT NULL,
    bloque VARCHAR(10) NOT NULL,
    nombre_bloque VARCHAR(255),
    
    -- Promedio del bloque (0-3)
    promedio_bloque DECIMAL(5,3),
    
    -- Cantidad de preguntas
    total_preguntas INTEGER,
    preguntas_respondidas INTEGER,
    
    fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT seccion_valida CHECK (seccion IN ('A', 'B', 'C', 'D', 'E', 'F')),
    CONSTRAINT promedio_valido CHECK (promedio_bloque BETWEEN 0 AND 3)
);

CREATE INDEX idx_promedios_calculo ON promedios_bloques_autogestion(calculo_id);
CREATE INDEX idx_promedios_seccion ON promedios_bloques_autogestion(seccion);
CREATE INDEX idx_promedios_bloque ON promedios_bloques_autogestion(bloque);

COMMENT ON TABLE promedios_bloques_autogestion IS 'Promedios calculados por bloque de preguntas';

-- ============================================================================
-- TABLA: documentos_generados
-- Descripción: Registro de PDFs y documentos generados
-- ============================================================================

CREATE TABLE documentos_generados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación con cálculos
    calculo_huella_id UUID REFERENCES calculos_huella_carbono(id) ON DELETE SET NULL,
    calculo_autogestion_id UUID REFERENCES calculos_autogestion(id) ON DELETE SET NULL,
    
    -- Tipo de documento
    tipo_documento VARCHAR(50) NOT NULL,
    nombre_archivo VARCHAR(500) NOT NULL,
    
    -- Almacenamiento
    ruta_archivo TEXT,
    tamaño_bytes BIGINT,
    hash_archivo VARCHAR(64),  -- SHA-256 para verificar integridad
    
    -- Estado de envío
    enviado_email BOOLEAN DEFAULT false,
    email_destinatario VARCHAR(255),
    fecha_envio_email TIMESTAMP,
    
    -- Control
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    
    -- Constraints
    CONSTRAINT tipo_doc_valido CHECK (
        tipo_documento IN ('PDF_HUELLA', 'PDF_AUTOGESTION', 'EXCEL_RESUMEN', 'INFORME_CUSTOM')
    ),
    CONSTRAINT un_calculo_minimo CHECK (
        (calculo_huella_id IS NOT NULL) OR (calculo_autogestion_id IS NOT NULL)
    )
);

CREATE INDEX idx_documentos_huella ON documentos_generados(calculo_huella_id);
CREATE INDEX idx_documentos_autogestion ON documentos_generados(calculo_autogestion_id);
CREATE INDEX idx_documentos_tipo ON documentos_generados(tipo_documento);
CREATE INDEX idx_documentos_fecha ON documentos_generados(fecha_generacion);

COMMENT ON TABLE documentos_generados IS 'Registro de todos los documentos PDF generados';

-- ============================================================================
-- TABLAS DE CATÁLOGOS: Factores de Emisión Predefinidos
-- ============================================================================

-- ============================================================================
-- TABLA: catalogo_combustibles_solidos
-- ============================================================================

CREATE TABLE catalogo_combustibles_solidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Factores estándar
    poder_calorifico DECIMAL(15,6) NOT NULL,  -- MJ/kg
    factor_co2 DECIMAL(15,6) NOT NULL,  -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6) NOT NULL,  -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6) NOT NULL,  -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6),  -- Kg SO2/TJ
    
    -- Metadata
    fuente VARCHAR(500),  -- 'IPCC 2006', 'EPA', 'UPME Colombia', etc.
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_solidos_nombre ON catalogo_combustibles_solidos(nombre);
CREATE INDEX idx_catalogo_solidos_activo ON catalogo_combustibles_solidos(activo);

COMMENT ON TABLE catalogo_combustibles_solidos IS 'Catálogo de factores de emisión para combustibles sólidos';

-- ============================================================================
-- TABLA: catalogo_combustibles_liquidos
-- ============================================================================

CREATE TABLE catalogo_combustibles_liquidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Propiedades físicas
    densidad DECIMAL(10,6) NOT NULL,  -- kg/l
    poder_calorifico DECIMAL(15,6) NOT NULL,  -- MJ/kg
    
    -- Factores de emisión
    factor_co2 DECIMAL(15,6) NOT NULL,
    factor_ch4 DECIMAL(15,6) NOT NULL,
    factor_n2o DECIMAL(15,6) NOT NULL,
    factor_so2 DECIMAL(15,6),
    
    -- Metadata
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_liquidos_nombre ON catalogo_combustibles_liquidos(nombre);
CREATE INDEX idx_catalogo_liquidos_activo ON catalogo_combustibles_liquidos(activo);

COMMENT ON TABLE catalogo_combustibles_liquidos IS 'Catálogo de factores de emisión para combustibles líquidos';

-- ============================================================================
-- TABLA: catalogo_combustibles_gaseosos
-- ============================================================================

CREATE TABLE catalogo_combustibles_gaseosos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Factores
    poder_calorifico DECIMAL(15,6) NOT NULL,  -- MJ/m³
    factor_co2 DECIMAL(15,6) NOT NULL,
    factor_ch4 DECIMAL(15,6) NOT NULL,
    factor_n2o DECIMAL(15,6) NOT NULL,
    factor_so2 DECIMAL(15,6),
    
    -- Metadata
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_gaseosos_nombre ON catalogo_combustibles_gaseosos(nombre);
CREATE INDEX idx_catalogo_gaseosos_activo ON catalogo_combustibles_gaseosos(activo);

COMMENT ON TABLE catalogo_combustibles_gaseosos IS 'Catálogo de factores de emisión para combustibles gaseosos';

-- ============================================================================
-- TABLA: factores_electricidad_pais
-- ============================================================================

CREATE TABLE factores_electricidad_pais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais VARCHAR(100) NOT NULL,
    año INTEGER NOT NULL,
    
    -- Factor de emisión (kg CO₂/kWh)
    factor_emision DECIMAL(10,6) NOT NULL,
    
    -- Fuente oficial
    fuente VARCHAR(500),
    fecha_publicacion DATE,
    
    activo BOOLEAN DEFAULT true,
    
    CONSTRAINT factor_unico UNIQUE(pais, año),
    CONSTRAINT año_valido CHECK (año >= 2000 AND año <= 2100),
    CONSTRAINT factor_positivo CHECK (factor_emision > 0)
);

CREATE INDEX idx_factores_electricidad_pais ON factores_electricidad_pais(pais, año);
CREATE INDEX idx_factores_electricidad_activo ON factores_electricidad_pais(activo);

COMMENT ON TABLE factores_electricidad_pais IS 'Factores de emisión de electricidad por país y año';

-- ============================================================================
-- TABLA: factores_vuelos
-- Descripción: Catálogo de factores de emisión para vuelos aéreos por clase
-- ============================================================================

CREATE TABLE factores_vuelos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clase VARCHAR(100) NOT NULL,
    
    -- Factor de emisión único (sin distinción de distancia)
    factor_emision DECIMAL(10,6) NOT NULL,
    
    -- Fuente oficial
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT factor_positivo CHECK (factor_emision > 0)
);

CREATE INDEX idx_factores_vuelos_clase ON factores_vuelos(clase);
CREATE INDEX idx_factores_vuelos_activo ON factores_vuelos(activo);

COMMENT ON TABLE factores_vuelos IS 'Catálogo de factores de emisión para vuelos aéreos por clase';
COMMENT ON COLUMN factores_vuelos.factor_emision IS 'kg CO2e por pasajero por km (factor único, sin distinción de distancia)';

-- ============================================================================
-- TABLA: auditoria
-- Descripción: Log de auditoría para trazabilidad completa
-- ============================================================================

CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Acción realizada
    accion VARCHAR(100) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'
    entidad VARCHAR(100) NOT NULL,  -- 'huella_carbono', 'autogestion', etc.
    entidad_id UUID,
    
    -- Detalles
    ip_address VARCHAR(50),
    user_agent TEXT,
    datos_anteriores JSONB,  -- Estado antes del cambio
    datos_nuevos JSONB,  -- Estado después del cambio
    
    -- Timestamp
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_accion);
CREATE INDEX idx_auditoria_entidad ON auditoria(entidad);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);

COMMENT ON TABLE auditoria IS 'Log de auditoría para trazabilidad de todas las operaciones';

-- ============================================================================
-- SECUENCIAS PARA CÓDIGOS DE SEGUIMIENTO
-- ============================================================================

-- Secuencia para códigos de Huella de Carbono
CREATE SEQUENCE seq_huella_carbono_codigo
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    CACHE 1;

-- Secuencia para códigos de Autogestión
CREATE SEQUENCE seq_autogestion_codigo
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    CACHE 1;

COMMENT ON SEQUENCE seq_huella_carbono_codigo IS 'Secuencia para generar números únicos en códigos HC-YYYY-NNNNNN';
COMMENT ON SEQUENCE seq_autogestion_codigo IS 'Secuencia para generar números únicos en códigos AG-YYYY-NNNNNN';

-- ============================================================================
-- TABLAS DE TRATAMIENTO DE DATOS Y PRIVACIDAD (GDPR/Ley 1581)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLA: consentimientos_usuario
-- Descripción: Registra todos los consentimientos otorgados por los usuarios
--              Cumple con GDPR Art. 7 y Ley 1581 de 2012 (Colombia)
-- ----------------------------------------------------------------------------

CREATE TABLE consentimientos_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación del usuario (null si no hay sistema de auth todavía)
    usuario_id UUID,
    email_usuario VARCHAR(255),
    nombre_usuario VARCHAR(255),
    
    -- Tipos de consentimiento
    acepta_terminos BOOLEAN NOT NULL DEFAULT false,
    acepta_privacidad BOOLEAN NOT NULL DEFAULT false,
    acepta_cookies_necesarias BOOLEAN NOT NULL DEFAULT true,
    acepta_cookies_analiticas BOOLEAN DEFAULT false,
    acepta_cookies_marketing BOOLEAN DEFAULT false,
    acepta_emails_promocionales BOOLEAN DEFAULT false,
    
    -- Versiones de documentos aceptados
    version_terminos VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    version_privacidad VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    
    -- Datos de auditoría legal (obligatorio GDPR Art. 30)
    ip_address VARCHAR(50),
    user_agent TEXT,
    navegador VARCHAR(100),
    sistema_operativo VARCHAR(100),
    
    -- Timestamps
    fecha_consentimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    
    -- Revocación de consentimiento (GDPR Art. 7.3)
    consentimiento_revocado BOOLEAN DEFAULT false,
    fecha_revocacion TIMESTAMP,
    motivo_revocacion TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint: Ambos consentimientos obligatorios deben ser true
    CONSTRAINT consentimiento_valido CHECK (
        acepta_terminos = true AND acepta_privacidad = true
    )
);

CREATE INDEX idx_consenti_usuario ON consentimientos_usuario(usuario_id);
CREATE INDEX idx_consenti_email ON consentimientos_usuario(email_usuario);
CREATE INDEX idx_consenti_fecha ON consentimientos_usuario(fecha_consentimiento);
CREATE INDEX idx_consenti_revocado ON consentimientos_usuario(consentimiento_revocado);

COMMENT ON TABLE consentimientos_usuario IS 'Registro de consentimientos GDPR/Ley 1581 - Auditoría legal de aceptaciones';

-- ----------------------------------------------------------------------------
-- TABLA: historial_politicas
-- Descripción: Almacena versiones históricas de políticas y términos legales
--              Permite demostrar qué versión aceptó cada usuario
-- ----------------------------------------------------------------------------

CREATE TABLE historial_politicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Tipo de documento legal
    tipo VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    
    -- Contenido completo del documento
    titulo VARCHAR(500) NOT NULL,
    contenido TEXT NOT NULL,
    resumen TEXT,
    
    -- Cambios importantes en esta versión
    cambios_principales TEXT,
    
    -- Vigencia
    fecha_vigencia DATE NOT NULL,
    fecha_fin_vigencia DATE,
    activa BOOLEAN DEFAULT true,
    
    -- Metadata
    creado_por VARCHAR(255),
    aprobado_por VARCHAR(255),
    fecha_aprobacion TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint de unicidad
    UNIQUE(tipo, version),
    
    -- Constraint de tipos válidos
    CONSTRAINT tipo_politica_valido CHECK (
        tipo IN ('TERMINOS', 'PRIVACIDAD', 'COOKIES', 'CONFIDENCIALIDAD')
    )
);

CREATE INDEX idx_politicas_tipo ON historial_politicas(tipo);
CREATE INDEX idx_politicas_activa ON historial_politicas(activa);
CREATE INDEX idx_politicas_vigencia ON historial_politicas(fecha_vigencia);

COMMENT ON TABLE historial_politicas IS 'Versiones históricas de términos legales - Trazabilidad de cambios';

-- ----------------------------------------------------------------------------
-- TABLA: log_acceso_datos
-- Descripción: Registro de auditoría de accesos a datos sensibles
--              Obligatorio GDPR Art. 30 - Registro de actividades de tratamiento
-- ----------------------------------------------------------------------------

CREATE TABLE log_acceso_datos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación
    usuario_id UUID,
    email_usuario VARCHAR(255),
    empresa_id UUID,
    calculo_id UUID,
    
    -- Tipo de operación realizada
    accion VARCHAR(100) NOT NULL,
    tipo_dato VARCHAR(100) NOT NULL,
    descripcion TEXT,
    
    -- Detalles del acceso
    endpoint VARCHAR(500),
    metodo_http VARCHAR(10),
    parametros JSONB,
    resultado VARCHAR(50),
    
    -- Datos de auditoría
    ip_address VARCHAR(50),
    user_agent TEXT,
    ubicacion_geografica VARCHAR(255),
    
    -- Timestamps
    fecha_acceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duracion_ms INTEGER,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint de acciones válidas
    CONSTRAINT accion_valida CHECK (
        accion IN (
            'VIEW', 'VIEW_ALL', 'EXPORT', 'EXPORT_PDF', 'EXPORT_JSON',
            'DELETE', 'DELETE_ALL', 'MODIFY', 'CREATE',
            'DOWNLOAD', 'SHARE', 'PRINT'
        )
    ),
    
    -- Constraint de tipos de datos
    CONSTRAINT tipo_dato_valido CHECK (
        tipo_dato IN (
            'DATOS_EMPRESA', 'CALCULO_HUELLA', 'CALCULO_AUTOGESTION',
            'COMBUSTIBLES', 'ELECTRICIDAD', 'VUELOS', 'EXTINTORES',
            'RESPUESTAS_AUTOGESTION', 'DOCUMENTOS_PDF', 'REPORTES',
            'DATOS_PERSONALES', 'CONSENTIMIENTOS', 'PERFIL_USUARIO'
        )
    )
);

CREATE INDEX idx_log_usuario ON log_acceso_datos(usuario_id);
CREATE INDEX idx_log_email ON log_acceso_datos(email_usuario);
CREATE INDEX idx_log_empresa ON log_acceso_datos(empresa_id);
CREATE INDEX idx_log_fecha ON log_acceso_datos(fecha_acceso);
CREATE INDEX idx_log_accion ON log_acceso_datos(accion);
CREATE INDEX idx_log_tipo_dato ON log_acceso_datos(tipo_dato);

COMMENT ON TABLE log_acceso_datos IS 'Auditoría GDPR Art. 30 - Log de accesos a datos sensibles';

-- ----------------------------------------------------------------------------
-- TABLA: solicitudes_eliminacion
-- Descripción: Gestión de solicitudes de eliminación de datos (Derecho al Olvido)
--              GDPR Art. 17 - Right to Erasure
--              Ley 1581 Art. 15 - Derecho de supresión
-- ----------------------------------------------------------------------------

CREATE TABLE solicitudes_eliminacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación del solicitante
    usuario_id UUID,
    email_solicitante VARCHAR(255) NOT NULL,
    nombre_solicitante VARCHAR(255),
    empresa_solicitante VARCHAR(500),
    
    -- Tipo de eliminación solicitada
    tipo_eliminacion VARCHAR(100) NOT NULL,
    alcance TEXT,
    
    -- Motivo de la solicitud
    motivo TEXT,
    categoria_motivo VARCHAR(100),
    
    -- Estado del proceso
    estado VARCHAR(50) DEFAULT 'PENDIENTE' NOT NULL,
    prioridad VARCHAR(20) DEFAULT 'NORMAL',
    
    -- Fechas del proceso
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_limite_legal TIMESTAMP,
    fecha_inicio_procesamiento TIMESTAMP,
    fecha_completada TIMESTAMP,
    
    -- Responsable del procesamiento
    procesado_por VARCHAR(255),
    procesado_por_email VARCHAR(255),
    
    -- Detalles del procesamiento
    notas_admin TEXT,
    acciones_realizadas JSONB,
    datos_eliminados JSONB,
    
    -- Evidencia de eliminación (para auditorías)
    certificado_eliminacion TEXT,
    hash_verificacion VARCHAR(255),
    
    -- Datos de contacto para notificaciones
    telefono_contacto VARCHAR(50),
    metodo_notificacion_preferido VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT estado_valido CHECK (
        estado IN (
            'PENDIENTE', 'EN_REVISION', 'APROBADA', 'PROCESANDO',
            'COMPLETADA', 'RECHAZADA', 'CANCELADA'
        )
    ),
    
    CONSTRAINT tipo_eliminacion_valido CHECK (
        tipo_eliminacion IN (
            'CUENTA_COMPLETA', 'CALCULOS_ESPECIFICOS', 'DATOS_EMPRESA',
            'CONSENTIMIENTOS', 'HISTORIAL_COMPLETO', 'DATOS_PERSONALES'
        )
    ),
    
    CONSTRAINT prioridad_valida CHECK (
        prioridad IN ('BAJA', 'NORMAL', 'ALTA', 'URGENTE')
    )
);

CREATE INDEX idx_elim_email ON solicitudes_eliminacion(email_solicitante);
CREATE INDEX idx_elim_usuario ON solicitudes_eliminacion(usuario_id);
CREATE INDEX idx_elim_estado ON solicitudes_eliminacion(estado);
CREATE INDEX idx_elim_fecha_solicitud ON solicitudes_eliminacion(fecha_solicitud);
CREATE INDEX idx_elim_fecha_limite ON solicitudes_eliminacion(fecha_limite_legal);

COMMENT ON TABLE solicitudes_eliminacion IS 'Gestión de Derecho al Olvido GDPR Art. 17 - Solicitudes de eliminación';

-- ============================================================================
-- TRIGGERS PARA TABLAS DE PRIVACIDAD
-- ============================================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las nuevas tablas
CREATE TRIGGER trigger_consenti_updated_at
    BEFORE UPDATE ON consentimientos_usuario
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_politicas_updated_at
    BEFORE UPDATE ON historial_politicas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_elim_updated_at
    BEFORE UPDATE ON solicitudes_eliminacion
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para calcular fecha límite legal (30 días) en solicitudes
CREATE OR REPLACE FUNCTION calcular_fecha_limite_eliminacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.fecha_limite_legal IS NULL THEN
        NEW.fecha_limite_legal = NEW.fecha_solicitud + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_fecha_limite_eliminacion
    BEFORE INSERT ON solicitudes_eliminacion
    FOR EACH ROW
    EXECUTE FUNCTION calcular_fecha_limite_eliminacion();

-- Trigger para registrar en log cuando se revoca un consentimiento
CREATE OR REPLACE FUNCTION registrar_revocacion_consentimiento()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.consentimiento_revocado = true AND OLD.consentimiento_revocado = false THEN
        INSERT INTO log_acceso_datos (
            usuario_id,
            email_usuario,
            accion,
            tipo_dato,
            descripcion,
            resultado
        ) VALUES (
            NEW.usuario_id,
            NEW.email_usuario,
            'MODIFY',
            'CONSENTIMIENTOS',
            'Revocación de consentimiento - Motivo: ' || COALESCE(NEW.motivo_revocacion, 'No especificado'),
            'SUCCESS'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_revocacion
    AFTER UPDATE ON consentimientos_usuario
    FOR EACH ROW
    EXECUTE FUNCTION registrar_revocacion_consentimiento();

-- ============================================================================
-- VISTAS ÚTILES PARA REPORTING DE PRIVACIDAD
-- ============================================================================

-- Vista: Consentimientos activos
CREATE OR REPLACE VIEW vista_consentimientos_activos AS
SELECT 
    id,
    email_usuario,
    nombre_usuario,
    acepta_terminos,
    acepta_privacidad,
    acepta_cookies_analiticas,
    acepta_emails_promocionales,
    version_terminos,
    version_privacidad,
    fecha_consentimiento,
    fecha_actualizacion
FROM consentimientos_usuario
WHERE consentimiento_revocado = false;

COMMENT ON VIEW vista_consentimientos_activos IS 'Consentimientos vigentes - Para reportes de cumplimiento';

-- Vista: Solicitudes pendientes de eliminación
CREATE OR REPLACE VIEW vista_eliminaciones_pendientes AS
SELECT 
    id,
    email_solicitante,
    nombre_solicitante,
    tipo_eliminacion,
    estado,
    fecha_solicitud,
    fecha_limite_legal,
    EXTRACT(DAY FROM (fecha_limite_legal - CURRENT_TIMESTAMP)) as dias_restantes,
    prioridad
FROM solicitudes_eliminacion
WHERE estado IN ('PENDIENTE', 'EN_REVISION', 'APROBADA', 'PROCESANDO')
ORDER BY fecha_limite_legal ASC;

COMMENT ON VIEW vista_eliminaciones_pendientes IS 'Solicitudes de eliminación pendientes - Alertas de plazos legales';

-- Vista: Resumen de accesos recientes
CREATE OR REPLACE VIEW vista_accesos_recientes AS
SELECT 
    email_usuario,
    accion,
    tipo_dato,
    fecha_acceso,
    ip_address,
    resultado
FROM log_acceso_datos
WHERE fecha_acceso >= CURRENT_TIMESTAMP - INTERVAL '30 days'
ORDER BY fecha_acceso DESC;

COMMENT ON VIEW vista_accesos_recientes IS 'Log de accesos últimos 30 días - Auditoría continua';

-- ============================================================================
-- DATOS INICIALES - POLÍTICAS VERSIÓN 1.0
-- ============================================================================

-- Insertar política de términos inicial
INSERT INTO historial_politicas (
    tipo,
    version,
    titulo,
    contenido,
    resumen,
    cambios_principales,
    fecha_vigencia,
    activa,
    creado_por
) VALUES (
    'TERMINOS',
    'v1.0',
    'Términos y Condiciones de Uso - Plataforma Mundo Verde',
    'TÉRMINOS Y CONDICIONES DE USO

1. ACEPTACIÓN: Al utilizar esta plataforma, acepta estar vinculado por estos términos.

2. SERVICIOS: Mundo Verde proporciona herramientas para cálculo de huella de carbono y autodiagnóstico de sostenibilidad.

3. CONFIDENCIALIDAD: Todos los datos empresariales son confidenciales y no se compartirán con terceros.

4. USO PERMITIDO: Debe proporcionar información veraz y mantener confidencialidad de credenciales.

5. PROPIEDAD INTELECTUAL: Los algoritmos y contenido son propiedad de Mundo Verde.

6. RESPONSABILIDAD: Los resultados son estimaciones basadas en factores reconocidos internacionalmente.

7. RETENCIÓN DE DATOS: Puede eliminar sus datos en cualquier momento.

8. MODIFICACIONES: Los cambios serán notificados con 30 días de anticipación.

9. LEY APLICABLE: Leyes de Colombia y Ley 1581 de 2012.

10. CONTACTO: legal@mundoverde.com',
    'Términos de uso de la plataforma de gestión ambiental Mundo Verde',
    'Primera versión oficial de términos y condiciones',
    '2025-10-03',
    true,
    'Sistema'
);

-- Insertar política de privacidad inicial
INSERT INTO historial_politicas (
    tipo,
    version,
    titulo,
    contenido,
    resumen,
    cambios_principales,
    fecha_vigencia,
    activa,
    creado_por
) VALUES (
    'PRIVACIDAD',
    'v1.0',
    'Política de Privacidad y Protección de Datos',
    'POLÍTICA DE PRIVACIDAD

1. RESPONSABLE: Mundo Verde S.A.S., privacidad@mundoverde.com

2. DATOS RECOPILADOS:
   - Datos personales: nombre, email, teléfono, cargo
   - Datos empresariales: NIT, sector, ubicación, consumos energéticos
   - Datos técnicos: IP, navegador, cookies

3. FINALIDAD: Proveer servicios de cálculo de huella de carbono, generar reportes, almacenar historial.

4. BASE LEGAL: Consentimiento explícito, ejecución contractual, interés legítimo.

5. COMPARTICIÓN: NO compartimos con terceros excepto proveedores de infraestructura con NDA.

6. SEGURIDAD: Cifrado AES-256, SSL/TLS, WAF, control de acceso, backups diarios.

7. SUS DERECHOS (GDPR/Ley 1581):
   - Acceso, rectificación, supresión (derecho al olvido)
   - Oposición, portabilidad, limitación
   - Revocar consentimiento

8. RETENCIÓN:
   - Cuenta activa: Mientras esté activa
   - Cálculos: 5 años o hasta eliminación
   - Logs: 2 años
   - Cuenta eliminada: 30 días

9. COOKIES: Necesarias (autenticación), analíticas (opcional), marketing (NO usamos).

10. TRANSFERENCIAS: Servidores UE/USA bajo estándares GDPR.

11. CONTACTO DPO: dpo@mundoverde.com

12. AUTORIDAD: Superintendencia de Industria y Comercio (Colombia)',
    'Protección de datos según GDPR y Ley 1581 de 2012',
    'Primera versión oficial de política de privacidad',
    '2025-10-03',
    true,
    'Sistema'
);

-- Insertar política de cookies inicial
INSERT INTO historial_politicas (
    tipo,
    version,
    titulo,
    contenido,
    resumen,
    cambios_principales,
    fecha_vigencia,
    activa,
    creado_por
) VALUES (
    'COOKIES',
    'v1.0',
    'Política de Cookies',
    'POLÍTICA DE COOKIES

1. QUÉ SON: Pequeños archivos de texto almacenados en su dispositivo.

2. TIPOS QUE USAMOS:
   a) Cookies Estrictamente Necesarias (obligatorias):
      - Autenticación de sesión
      - Seguridad CSRF
      - Preferencias de idioma
   
   b) Cookies Analíticas (opcionales):
      - Google Analytics
      - Métricas de uso
   
   c) Cookies de Marketing: NO USAMOS

3. DURACIÓN:
   - Sesión: Se eliminan al cerrar navegador
   - Persistentes: Hasta 1 año

4. GESTIÓN: Puede configurar preferencias en el banner de cookies.

5. DESHABILITAR: Puede bloquear cookies en su navegador, pero afectará funcionalidad.

6. TERCEROS: Solo Google Analytics (si acepta cookies analíticas).

7. CONTACTO: cookies@mundoverde.com',
    'Uso de cookies en la plataforma',
    'Primera versión de política de cookies',
    '2025-10-03',
    true,
    'Sistema'
);

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Mostrar resumen de tablas creadas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

COMMENT ON DATABASE mundoverde_db IS 'Base de datos profesional para Plataforma Mundo Verde - Sistema de Gestión Ambiental con Cumplimiento GDPR/Ley 1581';

\echo '✅ Script ejecutado exitosamente!'
\echo '📊 Tablas creadas: 21 (17 operativas + 4 legales/privacidad)'
\echo '🔑 Índices creados: Sí'
\echo '✔️ Constraints aplicados: Sí'
\echo '🔢 Secuencias creadas: 2'
\echo '🛡️ Tablas GDPR/Ley 1581: 4'
\echo '👁️ Vistas creadas: 3'
\echo '⚡ Triggers creados: Sí'
\echo ''
\echo 'Próximos pasos:'
\echo '1. Ejecutar seed_factores.sql para insertar factores de emisión'
\echo '2. Ejecutar functions.sql para crear funciones auxiliares'
\echo '3. Configurar el archivo .env con las credenciales'
