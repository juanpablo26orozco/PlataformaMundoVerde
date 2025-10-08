# 📊 ANÁLISIS COMPLETO DE BASE DE DATOS POSTGRESQL
## Plataforma Mundo Verde - Sistema de Gestión Ambiental

---

## 🎯 RESUMEN EJECUTIVO

Tu aplicación maneja **DOS MÓDULOS PRINCIPALES** con datos críticos que deben almacenarse:

### 1️⃣ **HUELLA DE CARBONO** (Carbon Footprint Calculator)
- **200+ variables de cálculo** por empresa
- **Factores de emisión** de combustibles, electricidad, vuelos
- **Resultados por 3 alcances** (Scope 1, 2, 3)
- **Emisiones totales** en Ton CO₂ equivalente

### 2️⃣ **AUTOGESTIÓN DE SOSTENIBILIDAD** (Sustainability Self-Assessment)
- **200+ preguntas** distribuidas en 6 secciones (A-F)
- **Respuestas múltiples** (IMP/M/AC/NA o Siempre/Casi siempre/Algunas veces/Nunca)
- **Promedios por bloques** y secciones
- **Porcentajes finales** de cumplimiento

---

## 📁 ESQUEMA DE BASE DE DATOS PROPUESTO

### 🏢 **MÓDULO 1: GESTIÓN DE USUARIOS Y EMPRESAS**

#### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'usuario', -- 'admin', 'usuario', 'consultor'
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_sesion TIMESTAMP,
    
    CONSTRAINT email_valido CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
```

#### Tabla: `empresas`
```sql
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    
    -- Datos básicos
    nombre_empresa VARCHAR(500) NOT NULL,
    nit VARCHAR(50) NOT NULL,
    sector VARCHAR(255),
    
    -- Ubicación
    pais VARCHAR(100) DEFAULT 'Colombia',
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    direccion TEXT,
    
    -- Contacto
    telefono VARCHAR(50),
    correo_corporativo VARCHAR(255),
    sitio_web VARCHAR(255),
    
    -- Metadata
    año_base INTEGER,
    tamaño_empresa VARCHAR(50), -- 'Pequeña', 'Mediana', 'Grande'
    numero_empleados INTEGER,
    
    -- Control
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activa BOOLEAN DEFAULT true,
    
    CONSTRAINT nit_unico UNIQUE(nit),
    CONSTRAINT año_valido CHECK (año_base >= 1900 AND año_base <= 2100)
);

CREATE INDEX idx_empresas_usuario ON empresas(usuario_id);
CREATE INDEX idx_empresas_nit ON empresas(nit);
CREATE INDEX idx_empresas_activa ON empresas(activa);
```

---

### 🌱 **MÓDULO 2: HUELLA DE CARBONO**

#### Tabla: `calculos_huella_carbono`
```sql
CREATE TABLE calculos_huella_carbono (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    
    -- Identificación del cálculo
    nombre_calculo VARCHAR(255) NOT NULL,
    año_reporte INTEGER NOT NULL,
    fecha_reporte DATE NOT NULL,
    periodo_inicio DATE,
    periodo_fin DATE,
    
    -- Persona responsable
    persona_elabora VARCHAR(255),
    cargo VARCHAR(255),
    
    -- Resultados totales
    emisiones_alcance_1 DECIMAL(15,4) DEFAULT 0, -- Ton CO₂e
    emisiones_alcance_2 DECIMAL(15,4) DEFAULT 0, -- Ton CO₂e
    emisiones_alcance_3 DECIMAL(15,4) DEFAULT 0, -- Ton CO₂e
    emisiones_totales DECIMAL(15,4) GENERATED ALWAYS AS (
        emisiones_alcance_1 + emisiones_alcance_2 + emisiones_alcance_3
    ) STORED,
    
    -- Evaluación y recomendaciones
    nivel_evaluacion VARCHAR(50), -- 'Excelente', 'Aceptable', 'Alto impacto'
    arboles_compensar INTEGER, -- Árboles necesarios para compensar
    
    -- Metadata
    estado VARCHAR(50) DEFAULT 'borrador', -- 'borrador', 'finalizado', 'aprobado'
    version INTEGER DEFAULT 1,
    notas TEXT,
    
    -- Control
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT año_reporte_valido CHECK (año_reporte >= 2000 AND año_reporte <= 2100)
);

CREATE INDEX idx_huella_empresa ON calculos_huella_carbono(empresa_id);
CREATE INDEX idx_huella_fecha ON calculos_huella_carbono(fecha_reporte);
CREATE INDEX idx_huella_estado ON calculos_huella_carbono(estado);
```

#### Tabla: `combustibles_solidos`
```sql
CREATE TABLE combustibles_solidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL, -- 'Carbón Genérico', 'Carbón Guajira', etc.
    
    -- Consumo
    consumo_anual DECIMAL(15,4), -- kg/año
    unidad_medida VARCHAR(20) DEFAULT 'kg',
    
    -- Factores de emisión (automáticos según tipo)
    poder_calorifico DECIMAL(15,6), -- MJ/kg
    factor_co2 DECIMAL(15,6), -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6), -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6), -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6), -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6), -- TJ
    emision_co2 DECIMAL(15,4), -- Kg
    emision_ch4 DECIMAL(15,4), -- Kg
    emision_n2o DECIMAL(15,4), -- Kg
    emision_so2 DECIMAL(15,4), -- Kg
    emisiones_totales DECIMAL(15,4), -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_solidos_calculo ON combustibles_solidos(calculo_id);
```

#### Tabla: `combustibles_liquidos`
```sql
CREATE TABLE combustibles_liquidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL, -- 'Gasolina Motor', 'ACPM/Diesel', 'Fuel Oil', etc.
    tipo_fuente VARCHAR(50), -- 'Estacionario', 'Móvil'
    
    -- Consumo
    consumo_anual DECIMAL(15,4), -- litros/año
    densidad DECIMAL(10,6), -- kg/l
    masa_combustible DECIMAL(15,4), -- kg
    
    -- Factores de emisión
    poder_calorifico DECIMAL(15,6), -- MJ/kg
    factor_co2 DECIMAL(15,6), -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6), -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6), -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6), -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6), -- TJ
    emision_co2 DECIMAL(15,4), -- Kg
    emision_ch4 DECIMAL(15,4), -- Kg
    emision_n2o DECIMAL(15,4), -- Kg
    emision_so2 DECIMAL(15,4), -- Kg
    emisiones_totales DECIMAL(15,4), -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_liquidos_calculo ON combustibles_liquidos(calculo_id);
```

#### Tabla: `combustibles_gaseosos`
```sql
CREATE TABLE combustibles_gaseosos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de combustible
    tipo_combustible VARCHAR(255) NOT NULL, -- 'Gas Natural', 'GLP', 'Gas Propano', etc.
    tipo_fuente VARCHAR(50), -- 'Estacionario', 'Móvil'
    
    -- Consumo
    consumo_anual DECIMAL(15,4), -- m³/año
    unidad_medida VARCHAR(20) DEFAULT 'm³',
    
    -- Factores de emisión
    poder_calorifico DECIMAL(15,6), -- MJ/m³
    factor_co2 DECIMAL(15,6), -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6), -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6), -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6), -- Kg SO2/TJ
    
    -- Resultados calculados
    energia_consumida DECIMAL(15,6), -- TJ
    emision_co2 DECIMAL(15,4), -- Kg
    emision_ch4 DECIMAL(15,4), -- Kg
    emision_n2o DECIMAL(15,4), -- Kg
    emision_so2 DECIMAL(15,4), -- Kg
    emisiones_totales DECIMAL(15,4), -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gaseosos_calculo ON combustibles_gaseosos(calculo_id);
```

#### Tabla: `consumo_electricidad`
```sql
CREATE TABLE consumo_electricidad (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
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
    
    -- Totales
    consumo_anual DECIMAL(15,2) GENERATED ALWAYS AS (
        enero + febrero + marzo + abril + mayo + junio + 
        julio + agosto + septiembre + octubre + noviembre + diciembre
    ) STORED,
    
    -- Factor de emisión (Colombia: 0.391 kg CO₂/kWh según UPME)
    factor_emision_co2 DECIMAL(10,6) DEFAULT 0.391,
    
    -- Resultados
    emisiones_parciales DECIMAL(15,4), -- kg CO₂
    emisiones_totales DECIMAL(15,4), -- Ton CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_electricidad_calculo ON consumo_electricidad(calculo_id);
```

#### Tabla: `vuelos_aereos`
```sql
CREATE TABLE vuelos_aereos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Ruta
    ciudad_origen VARCHAR(255) NOT NULL,
    ciudad_destino VARCHAR(255) NOT NULL,
    pais_origen VARCHAR(100),
    pais_destino VARCHAR(100),
    
    -- Detalles del vuelo
    tipo_vuelo VARCHAR(50), -- 'Nacional', 'Internacional', 'Corta distancia', 'Larga distancia'
    clase VARCHAR(50), -- 'Económica', 'Ejecutiva'
    numero_pasajeros INTEGER DEFAULT 1,
    
    -- Distancia y factor
    distancia_km DECIMAL(15,2),
    factor_emision DECIMAL(10,6), -- kg CO₂/km/pasajero
    
    -- Resultados
    emision_kg DECIMAL(15,4), -- kg CO₂
    emision_ton DECIMAL(15,4), -- Ton CO₂
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT pasajeros_positivo CHECK (numero_pasajeros > 0)
);

CREATE INDEX idx_vuelos_calculo ON vuelos_aereos(calculo_id);
```

#### Tabla: `extintores`
```sql
CREATE TABLE extintores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_huella_carbono(id) ON DELETE CASCADE,
    
    -- Tipo de extintor
    tipo_gas VARCHAR(100) NOT NULL, -- 'HFC-23', 'HFC-134a', 'HFC-227ea', etc.
    
    -- Cantidad
    cantidad DECIMAL(15,4), -- kg
    
    -- Potencial de Calentamiento Global
    pcg INTEGER, -- GWP (Global Warming Potential)
    
    -- Resultados
    emisiones_parciales DECIMAL(15,4), -- kg CO₂ eq
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_extintores_calculo ON extintores(calculo_id);
```

---

### 🌿 **MÓDULO 3: AUTOGESTIÓN DE SOSTENIBILIDAD**

#### Tabla: `calculos_autogestion`
```sql
CREATE TABLE calculos_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    
    -- Identificación
    nombre_calculo VARCHAR(255) NOT NULL,
    año_reporte INTEGER NOT NULL,
    fecha_reporte DATE NOT NULL,
    
    -- Persona responsable
    persona_elabora VARCHAR(255),
    cargo VARCHAR(255),
    
    -- Resultados por sección (porcentajes 0-100)
    porcentaje_economico DECIMAL(5,2) DEFAULT 0, -- Sección A
    porcentaje_ambiental DECIMAL(5,2) DEFAULT 0, -- Sección B
    porcentaje_energia DECIMAL(5,2) DEFAULT 0, -- Sección C
    porcentaje_seguridad DECIMAL(5,2) DEFAULT 0, -- Sección D
    porcentaje_social DECIMAL(5,2) DEFAULT 0, -- Sección E
    porcentaje_almacen DECIMAL(5,2) DEFAULT 0, -- Sección F
    
    -- Porcentaje final
    porcentaje_final DECIMAL(5,2) GENERATED ALWAYS AS (
        (porcentaje_economico + porcentaje_ambiental + porcentaje_energia + 
         porcentaje_seguridad + porcentaje_social + porcentaje_almacen) / 6.0
    ) STORED,
    
    -- Nivel de cumplimiento
    nivel_cumplimiento VARCHAR(50), -- 'Excelente', 'Bueno', 'Regular', 'Deficiente'
    
    -- Metadata
    estado VARCHAR(50) DEFAULT 'borrador', -- 'borrador', 'finalizado', 'aprobado'
    version INTEGER DEFAULT 1,
    notas TEXT,
    
    -- Control
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT año_reporte_valido CHECK (año_reporte >= 2000 AND año_reporte <= 2100)
);

CREATE INDEX idx_autogestion_empresa ON calculos_autogestion(empresa_id);
CREATE INDEX idx_autogestion_fecha ON calculos_autogestion(fecha_reporte);
CREATE INDEX idx_autogestion_estado ON calculos_autogestion(estado);
```

#### Tabla: `respuestas_autogestion`
```sql
CREATE TABLE respuestas_autogestion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculo_id UUID NOT NULL REFERENCES calculos_autogestion(id) ON DELETE CASCADE,
    
    -- Identificación de la pregunta
    seccion CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D', 'E', 'F'
    bloque VARCHAR(10) NOT NULL, -- 'A1', 'A2', 'B1', 'B2', etc.
    pregunta_id VARCHAR(20) NOT NULL, -- 'A_q_1', 'A_q_2', etc.
    numero_pregunta INTEGER NOT NULL,
    
    -- Texto de la pregunta (para histórico)
    texto_pregunta TEXT NOT NULL,
    
    -- Respuesta
    respuesta VARCHAR(50) NOT NULL, -- 'IMP', 'M', 'AC', 'NA' o 'Siempre', 'Casi siempre', etc.
    puntaje INTEGER, -- 0, 1, 2, 3
    
    -- Metadata
    fecha_respuesta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT respuesta_valida CHECK (
        respuesta IN ('IMP', 'M', 'AC', 'NA', 'Siempre', 'Casi siempre', 'Algunas veces', 'Nunca')
    ),
    CONSTRAINT seccion_valida CHECK (seccion IN ('A', 'B', 'C', 'D', 'E', 'F'))
);

CREATE INDEX idx_respuestas_calculo ON respuestas_autogestion(calculo_id);
CREATE INDEX idx_respuestas_seccion ON respuestas_autogestion(seccion);
CREATE INDEX idx_respuestas_pregunta ON respuestas_autogestion(pregunta_id);
```

#### Tabla: `promedios_bloques_autogestion`
```sql
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
    
    CONSTRAINT seccion_valida CHECK (seccion IN ('A', 'B', 'C', 'D', 'E', 'F'))
);

CREATE INDEX idx_promedios_calculo ON promedios_bloques_autogestion(calculo_id);
CREATE INDEX idx_promedios_seccion ON promedios_bloques_autogestion(seccion);
```

---

### 📄 **MÓDULO 4: DOCUMENTOS Y REPORTES**

#### Tabla: `documentos_generados`
```sql
CREATE TABLE documentos_generados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    
    -- Relación con cálculos
    calculo_huella_id UUID REFERENCES calculos_huella_carbono(id) ON DELETE SET NULL,
    calculo_autogestion_id UUID REFERENCES calculos_autogestion(id) ON DELETE SET NULL,
    
    -- Tipo de documento
    tipo_documento VARCHAR(50) NOT NULL, -- 'PDF_HUELLA', 'PDF_AUTOGESTION', 'EXCEL_RESUMEN'
    nombre_archivo VARCHAR(500) NOT NULL,
    
    -- Almacenamiento (puedes usar S3, Azure Blob, o guardar en BD)
    ruta_archivo TEXT, -- URL o ruta del archivo
    tamaño_bytes BIGINT,
    hash_archivo VARCHAR(64), -- SHA-256 para verificar integridad
    
    -- Estado
    enviado_email BOOLEAN DEFAULT false,
    email_destinatario VARCHAR(255),
    fecha_envio_email TIMESTAMP,
    
    -- Control
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP, -- Opcional: para eliminar documentos antiguos
    
    CONSTRAINT tipo_doc_valido CHECK (
        tipo_documento IN ('PDF_HUELLA', 'PDF_AUTOGESTION', 'EXCEL_RESUMEN', 'INFORME_CUSTOM')
    )
);

CREATE INDEX idx_documentos_empresa ON documentos_generados(empresa_id);
CREATE INDEX idx_documentos_tipo ON documentos_generados(tipo_documento);
CREATE INDEX idx_documentos_fecha ON documentos_generados(fecha_generacion);
```

---

### 📊 **MÓDULO 5: FACTORES DE EMISIÓN (CATÁLOGOS)**

#### Tabla: `catalogo_combustibles_solidos`
```sql
CREATE TABLE catalogo_combustibles_solidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Factores estándar
    poder_calorifico DECIMAL(15,6) NOT NULL, -- MJ/kg
    factor_co2 DECIMAL(15,6) NOT NULL, -- Kg CO2/TJ
    factor_ch4 DECIMAL(15,6) NOT NULL, -- Kg CH4/TJ
    factor_n2o DECIMAL(15,6) NOT NULL, -- Kg N2O/TJ
    factor_so2 DECIMAL(15,6), -- Kg SO2/TJ
    
    -- Metadata
    fuente VARCHAR(500), -- 'IPCC 2006', 'EPA', 'UPME Colombia', etc.
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_solidos_nombre ON catalogo_combustibles_solidos(nombre);
CREATE INDEX idx_catalogo_solidos_activo ON catalogo_combustibles_solidos(activo);
```

#### Tabla: `catalogo_combustibles_liquidos`
```sql
CREATE TABLE catalogo_combustibles_liquidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Propiedades físicas
    densidad DECIMAL(10,6) NOT NULL, -- kg/l
    poder_calorifico DECIMAL(15,6) NOT NULL, -- MJ/kg
    
    -- Factores de emisión
    factor_co2 DECIMAL(15,6) NOT NULL,
    factor_ch4 DECIMAL(15,6) NOT NULL,
    factor_n2o DECIMAL(15,6) NOT NULL,
    factor_so2 DECIMAL(15,6),
    
    -- Metadata
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_liquidos_nombre ON catalogo_combustibles_liquidos(nombre);
```

#### Tabla: `catalogo_combustibles_gaseosos`
```sql
CREATE TABLE catalogo_combustibles_gaseosos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) UNIQUE NOT NULL,
    
    -- Factores
    poder_calorifico DECIMAL(15,6) NOT NULL, -- MJ/m³
    factor_co2 DECIMAL(15,6) NOT NULL,
    factor_ch4 DECIMAL(15,6) NOT NULL,
    factor_n2o DECIMAL(15,6) NOT NULL,
    factor_so2 DECIMAL(15,6),
    
    -- Metadata
    fuente VARCHAR(500),
    año_publicacion INTEGER,
    pais_aplicable VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_catalogo_gaseosos_nombre ON catalogo_combustibles_gaseosos(nombre);
```

#### Tabla: `factores_electricidad_pais`
```sql
CREATE TABLE factores_electricidad_pais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais VARCHAR(100) NOT NULL,
    año INTEGER NOT NULL,
    
    -- Factor de emisión (kg CO₂/kWh)
    factor_emision DECIMAL(10,6) NOT NULL,
    
    -- Fuente oficial
    fuente VARCHAR(500), -- 'UPME', 'EPA', 'IEA', etc.
    fecha_publicacion DATE,
    
    activo BOOLEAN DEFAULT true,
    
    CONSTRAINT factor_unico UNIQUE(pais, año),
    CONSTRAINT año_valido CHECK (año >= 2000 AND año <= 2100)
);

CREATE INDEX idx_factores_electricidad_pais ON factores_electricidad_pais(pais, año);
```

---

### 🔐 **MÓDULO 6: AUDITORÍA Y SEGURIDAD**

#### Tabla: `auditoria`
```sql
CREATE TABLE auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Acción realizada
    accion VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
    entidad VARCHAR(100) NOT NULL, -- 'huella_carbono', 'autogestion', 'empresa'
    entidad_id UUID,
    
    -- Detalles
    ip_address VARCHAR(50),
    user_agent TEXT,
    datos_anteriores JSONB, -- Estado antes del cambio
    datos_nuevos JSONB, -- Estado después del cambio
    
    -- Timestamp
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(fecha_accion);
CREATE INDEX idx_auditoria_entidad ON auditoria(entidad);
```

---

## 🔄 VISTAS ÚTILES PARA REPORTES

### Vista: Resumen de emisiones por empresa
```sql
CREATE VIEW vw_resumen_emisiones_empresa AS
SELECT 
    e.id AS empresa_id,
    e.nombre_empresa,
    e.nit,
    e.sector,
    COUNT(DISTINCT ch.id) AS total_calculos,
    AVG(ch.emisiones_totales) AS promedio_emisiones,
    MAX(ch.emisiones_totales) AS max_emisiones,
    MIN(ch.emisiones_totales) AS min_emisiones,
    MAX(ch.fecha_reporte) AS ultima_medicion
FROM empresas e
LEFT JOIN calculos_huella_carbono ch ON e.id = ch.empresa_id
GROUP BY e.id, e.nombre_empresa, e.nit, e.sector;
```

### Vista: Tendencia de emisiones por año
```sql
CREATE VIEW vw_tendencia_emisiones AS
SELECT 
    e.nombre_empresa,
    ch.año_reporte,
    ch.emisiones_alcance_1,
    ch.emisiones_alcance_2,
    ch.emisiones_alcance_3,
    ch.emisiones_totales,
    LAG(ch.emisiones_totales) OVER (
        PARTITION BY e.id ORDER BY ch.año_reporte
    ) AS emisiones_año_anterior,
    ((ch.emisiones_totales - LAG(ch.emisiones_totales) OVER (
        PARTITION BY e.id ORDER BY ch.año_reporte
    )) / NULLIF(LAG(ch.emisiones_totales) OVER (
        PARTITION BY e.id ORDER BY ch.año_reporte
    ), 0) * 100) AS variacion_porcentual
FROM empresas e
JOIN calculos_huella_carbono ch ON e.id = ch.empresa_id
ORDER BY e.nombre_empresa, ch.año_reporte;
```

### Vista: Ranking de sostenibilidad
```sql
CREATE VIEW vw_ranking_sostenibilidad AS
SELECT 
    e.nombre_empresa,
    e.sector,
    ca.porcentaje_final,
    ca.fecha_reporte,
    RANK() OVER (ORDER BY ca.porcentaje_final DESC) AS posicion_ranking,
    CASE 
        WHEN ca.porcentaje_final >= 80 THEN 'Excelente'
        WHEN ca.porcentaje_final >= 60 THEN 'Bueno'
        WHEN ca.porcentaje_final >= 40 THEN 'Regular'
        ELSE 'Deficiente'
    END AS nivel_cumplimiento
FROM empresas e
JOIN calculos_autogestion ca ON e.id = ca.empresa_id
WHERE ca.estado = 'finalizado'
ORDER BY ca.porcentaje_final DESC;
```

---

## 📋 LISTADO COMPLETO DE VARIABLES A GUARDAR

### ✅ **HUELLA DE CARBONO (200+ variables)**

#### **Datos de Empresa** (12 campos)
- ✓ nombreEmpresa, nit, direccion, departamento, municipio
- ✓ añoBase, fechaReporte, telefono, correo
- ✓ personaElabora, cargo, sector

#### **Combustibles Sólidos** (por fila × N filas)
- ✓ tipoCombustible, consumoAnual (kg)
- ✓ poderCalorifico, factorCO2, factorCH4, factorN2O, factorSO2
- ✓ energiaConsumida, emisionCO2, emisionCH4, emisionN2O, emisionSO2
- ✓ emisionesTotales (Ton CO₂ eq)

#### **Combustibles Líquidos Estacionarios** (por fila × N filas)
- ✓ tipoCombustible, consumoAnual (litros), densidad, masaCombustible
- ✓ poderCalorifico, factorCO2, factorCH4, factorN2O, factorSO2
- ✓ energiaConsumida, emisiones por gas, emisionesTotales

#### **Combustibles Gaseosos Estacionarios** (por fila × N filas)
- ✓ tipoCombustible, consumoAnual (m³)
- ✓ poderCalorifico, factores de emisión
- ✓ energiaConsumida, emisiones calculadas

#### **Combustibles Líquidos Móviles** (por fila × N filas)
- ✓ Misma estructura que líquidos estacionarios
- ✓ Diferenciado por tipo_fuente = 'Móvil'

#### **Combustibles Gaseosos Móviles** (por fila × N filas)
- ✓ Misma estructura que gaseosos estacionarios
- ✓ Diferenciado por tipo_fuente = 'Móvil'

#### **Electricidad** (1 registro con 12 meses)
- ✓ consumoEnero, consumoFebrero, ..., consumoDiciembre (kWh)
- ✓ consumoAnual (suma de meses)
- ✓ factorEmisionCO2 (0.391 kg CO₂/kWh)
- ✓ emisionesParciales, emisionesTotales

#### **Vuelos Aéreos** (por fila × N filas)
- ✓ ciudadOrigen, ciudadDestino, paisOrigen, paisDestino
- ✓ tipoVuelo, clase, numeroPasajeros
- ✓ distanciaKm, factorEmision
- ✓ emisionKg, emisionTon

#### **Extintores** (por fila × N filas)
- ✓ tipoGas (HFC-23, HFC-134a, etc.)
- ✓ cantidad (kg)
- ✓ PCG (Potencial Calentamiento Global)
- ✓ emisionesParciales (kg CO₂ eq)

#### **Resultados Totales**
- ✓ emisionesAlcance1 (Ton CO₂ eq)
- ✓ emisionesAlcance2 (Ton CO₂ eq)
- ✓ emisionesAlcance3 (Ton CO₂ eq)
- ✓ emisionesTotales (suma de alcances)
- ✓ nivelEvaluacion ('Excelente', 'Aceptable', 'Alto impacto')
- ✓ arbolesCompensar (calculado)

---

### ✅ **AUTOGESTIÓN DE SOSTENIBILIDAD (200+ variables)**

#### **Datos de Empresa** (12 campos)
- ✓ Mismos campos que Huella de Carbono

#### **Respuestas por Sección** (200+ preguntas)

**Sección A: Diagnóstico Económico** (26 preguntas)
- ✓ A_q_1 a A_q_26
- ✓ Respuestas: 'IMP', 'M', 'AC', 'NA'
- ✓ Puntajes: 3, 2, 1, 0

**Sección B: Gestión Ambiental** (77 preguntas)
- ✓ B_q_27 a B_q_103
- ✓ Respuestas: 'IMP', 'M', 'AC', 'NA'

**Sección C: Gestión Energía** (20 preguntas)
- ✓ C_q_104 a C_q_123
- ✓ Respuestas: 'IMP', 'M', 'AC', 'NA'

**Sección D: Seguridad y Salud** (28 preguntas)
- ✓ D_q_124 a D_q_151
- ✓ Respuestas: 'IMP', 'M', 'AC', 'NA'

**Sección E: Aspectos Sociales** (35 preguntas)
- ✓ E_q_152 a E_q_186
- ✓ Respuestas: 'Siempre', 'Casi siempre', 'Algunas veces', 'Nunca'

**Sección F: Almacén** (20 preguntas)
- ✓ F_q_187 a F_q_206
- ✓ Respuestas: 'Siempre', 'Casi siempre', 'Algunas veces', 'Nunca'

#### **Promedios por Bloques**
- ✓ Cada sección tiene múltiples bloques (A1, A2, ..., B1, B2, ...)
- ✓ Promedio por bloque (0-3)
- ✓ Total preguntas por bloque
- ✓ Preguntas respondidas

#### **Resultados Finales**
- ✓ porcentajeEconomico (Sección A)
- ✓ porcentajeAmbiental (Sección B)
- ✓ porcentajeEnergia (Sección C)
- ✓ porcentajeSeguridad (Sección D)
- ✓ porcentajeSocial (Sección E)
- ✓ porcentajeAlmacen (Sección F)
- ✓ porcentajeFinal (promedio de las 6 secciones)
- ✓ nivelCumplimiento ('Excelente', 'Bueno', 'Regular', 'Deficiente')

---

### ✅ **DOCUMENTOS GENERADOS**
- ✓ PDFs de Huella de Carbono
- ✓ PDFs de Autogestión
- ✓ Nombre archivo, ruta, tamaño
- ✓ Hash SHA-256 para integridad
- ✓ Estado de envío por email
- ✓ Email destinatario, fecha envío

---

### ✅ **CATÁLOGOS DE FACTORES DE EMISIÓN**

#### **Combustibles Sólidos** (12 tipos predefinidos)
Ejemplo: Carbón Genérico, Carbón Guajira, Coque de Petróleo, etc.

#### **Combustibles Líquidos** (10 tipos predefinidos)
Ejemplo: Gasolina Motor, ACPM/Diesel, Fuel Oil, Kerosene, etc.

#### **Combustibles Gaseosos** (7 tipos predefinidos)
Ejemplo: Gas Natural, GLP, Gas Propano, Butano, etc.

#### **Factores Electricidad por País/Año**
- ✓ Colombia: 0.391 kg CO₂/kWh (2024)
- ✓ Actualizables anualmente

---

## 🔧 FUNCIONES Y TRIGGERS ÚTILES

### Función: Calcular emisiones totales automáticamente
```sql
CREATE OR REPLACE FUNCTION calcular_emisiones_totales()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el total en calculos_huella_carbono
    UPDATE calculos_huella_carbono
    SET emisiones_alcance_1 = (
        SELECT COALESCE(SUM(emisiones_totales), 0)
        FROM (
            SELECT emisiones_totales FROM combustibles_solidos WHERE calculo_id = NEW.calculo_id
            UNION ALL
            SELECT emisiones_totales FROM combustibles_liquidos WHERE calculo_id = NEW.calculo_id
            UNION ALL
            SELECT emisiones_totales FROM combustibles_gaseosos WHERE calculo_id = NEW.calculo_id
            UNION ALL
            SELECT emisiones_parciales FROM extintores WHERE calculo_id = NEW.calculo_id
        ) AS alcance1
    )
    WHERE id = NEW.calculo_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para cada tabla
CREATE TRIGGER trg_actualizar_alcance1_solidos
AFTER INSERT OR UPDATE OR DELETE ON combustibles_solidos
FOR EACH ROW EXECUTE FUNCTION calcular_emisiones_totales();

CREATE TRIGGER trg_actualizar_alcance1_liquidos
AFTER INSERT OR UPDATE OR DELETE ON combustibles_liquidos
FOR EACH ROW EXECUTE FUNCTION calcular_emisiones_totales();

-- ... (similar para otras tablas)
```

### Función: Calcular porcentaje final autogestión
```sql
CREATE OR REPLACE FUNCTION calcular_porcentaje_autogestion()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular promedios por bloque
    -- Calcular porcentaje por sección
    -- Actualizar tabla calculos_autogestion
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 ESTADÍSTICAS Y MÉTRICAS

### Estimación de tamaño de base de datos

**Por empresa con 1 cálculo de Huella + 1 Autogestión:**

- **Usuarios y Empresas**: ~5 KB
- **Huella de Carbono**:
  - Cálculo base: ~1 KB
  - Combustibles (promedio 20 filas): ~40 KB
  - Electricidad: ~2 KB
  - Vuelos (promedio 10): ~15 KB
  - Extintores (promedio 5): ~3 KB
  - **Subtotal**: ~60 KB

- **Autogestión**:
  - Cálculo base: ~1 KB
  - Respuestas (200 preguntas): ~40 KB
  - Promedios bloques: ~5 KB
  - **Subtotal**: ~45 KB

- **Documentos** (PDFs): ~500 KB por documento

**Total por empresa**: ~610 KB (sin PDFs) o ~1.5 MB (con PDFs)

**Proyección para 1000 empresas**: ~610 MB (sin PDFs) o ~1.5 GB (con PDFs)

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

### Fase 1: Diseño y Configuración ✅
1. Revisar y aprobar este esquema de base de datos
2. Crear repositorio Git para scripts SQL
3. Configurar PostgreSQL (local o cloud: AWS RDS, Azure Database, etc.)

### Fase 2: Implementación Backend (Semana 1-2)
1. Crear API REST con Node.js + Express
2. Implementar autenticación JWT
3. Endpoints para CRUD de empresas
4. Endpoints para Huella de Carbono
5. Endpoints para Autogestión

### Fase 3: Migración de Datos (Semana 2-3)
1. Migrar localStorage a PostgreSQL
2. Crear script de migración masiva
3. Validar integridad de datos

### Fase 4: Integración Frontend (Semana 3-4)
1. Reemplazar localStorage con llamadas API
2. Implementar manejo de sesiones
3. Actualizar formularios para guardar en BD

### Fase 5: Testing y Optimización (Semana 4-5)
1. Pruebas de carga
2. Optimización de queries
3. Implementar caché (Redis opcional)

### Fase 6: Deploy y Monitoreo (Semana 5-6)
1. Deploy en producción
2. Configurar backups automáticos
3. Implementar monitoreo (Prometheus/Grafana)

---

## ✅ BUENAS PRÁCTICAS IMPLEMENTADAS

1. **UUIDs en lugar de SERIAL**: Mejor para sistemas distribuidos
2. **Soft deletes**: Mantienes histórico (campo `activo`)
3. **Timestamps automáticos**: `fecha_creacion`, `fecha_actualizacion`
4. **Constraints**: Validaciones a nivel de BD
5. **Índices estratégicos**: Optimización de queries
6. **Normalización**: Evita redundancia de datos
7. **JSONB para flexibilidad**: Auditoría con datos dinámicos
8. **Generated columns**: Cálculos automáticos
9. **Views**: Reportes precalculados
10. **Foreign keys con CASCADE**: Integridad referencial

---

## 📞 SOPORTE Y DOCUMENTACIÓN

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Node.js + PostgreSQL**: https://node-postgres.com/
- **Prisma ORM** (recomendado): https://www.prisma.io/
- **TypeORM** (alternativa): https://typeorm.io/

---

**¿Listo para implementar? Puedo ayudarte con:**
1. Scripts SQL completos para crear todas las tablas
2. Código backend Node.js con TypeScript
3. Servicios de migración de localStorage a PostgreSQL
4. Endpoints REST documentados con Swagger
5. Tests unitarios e integración

**¡Vamos a transformar tu aplicación con una base de datos profesional! 🚀**
