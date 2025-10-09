# 🗄️ Base de Datos PostgreSQL - Plataforma Mundo Verde

## 📋 Tabla de Contenidos

1. [Esquema General](#esquema-general)
2. [Tablas Operativas](#tablas-operativas)
3. [Tablas Legales](#tablas-legales)
4. [Funciones y Triggers](#funciones-triggers)
5. [Índices y Optimización](#indices)
6. [Códigos de Seguimiento](#codigos-seguimiento)

---

## 🎯 Esquema General

**Base de datos:** `mundoverde_db`  
**PostgreSQL:** 14.0 o superior  
**Extensiones:**
- `uuid-ossp` - Generación de UUIDs
- `pgcrypto` - Funciones criptográficas

**Total de tablas:** 25
- ✅ 21 tablas operativas
- ✅ 4 tablas legales (GDPR/Ley 1581)

---

## 📊 Tablas Operativas

### 1. `calculos_huella_carbono`
**Propósito:** Registro principal de cálculos de huella de carbono  
**Relaciones:** 1 → N con todas las tablas de combustibles

**Columnas principales:**
```sql
id                      UUID PRIMARY KEY          -- Identificador único
codigo_seguimiento      VARCHAR(20) UNIQUE        -- HC-YYYY-NNNNNN
nombre_empresa          VARCHAR(500)              -- Razón social
nit                     VARCHAR(50)               -- NIT/RUT
sector                  VARCHAR(255)              -- Sector económico
año_reporte             INTEGER                   -- Año del reporte
fecha_reporte           DATE                      -- Fecha del cálculo

-- Resultados por alcance
emisiones_alcance_1     DECIMAL(15,4)             -- Ton CO₂e directas
emisiones_alcance_2     DECIMAL(15,4)             -- Ton CO₂e indirectas energía
emisiones_alcance_3     DECIMAL(15,4)             -- Ton CO₂e otras indirectas
emisiones_totales       DECIMAL(15,4) GENERATED   -- Suma automática

nivel_evaluacion        VARCHAR(50)               -- 'Excelente', 'Aceptable', 'Alto impacto'
arboles_compensar       INTEGER                   -- Árboles para compensar

fecha_creacion          TIMESTAMP                 -- Timestamp inserción
```

**Constraints:**
```sql
-- Código único formato HC-YYYY-NNNNNN
CHECK (codigo_seguimiento ~ '^HC-[0-9]{4}-[0-9]{6}$')

-- Año válido
CHECK (año_reporte >= 2000 AND año_reporte <= 2100)
```

**Índices:**
```sql
idx_huella_codigo       ON codigo_seguimiento    -- Búsqueda por código
idx_huella_nit          ON nit                   -- Búsqueda por empresa
idx_huella_fecha        ON fecha_reporte         -- Búsqueda temporal
idx_huella_año          ON año_reporte           -- Filtro por año
```

---

### 2. `combustibles_solidos`
**Propósito:** Combustibles sólidos (carbón, biomasa)  
**Relación:** N → 1 con `calculos_huella_carbono`

**Columnas:**
```sql
id                      UUID PRIMARY KEY
calculo_id              UUID REFERENCES calculos_huella_carbono
tipo_combustible        VARCHAR(255)              -- "Carbón Bituminoso", "Leña", etc.

-- Consumo
consumo_anual           DECIMAL(15,4)             -- kg/año
unidad_medida           VARCHAR(20)               -- 'kg'

-- Factores de emisión IPCC 2006
poder_calorifico        DECIMAL(15,6)             -- MJ/kg
factor_co2              DECIMAL(15,6)             -- Kg CO2/TJ
factor_ch4              DECIMAL(15,6)             -- Kg CH4/TJ
factor_n2o              DECIMAL(15,6)             -- Kg N2O/TJ
factor_so2              DECIMAL(15,6)             -- Kg SO2/TJ

-- Resultados
energia_consumida       DECIMAL(15,6)             -- TJ
emision_co2             DECIMAL(15,4)             -- Kg
emision_ch4             DECIMAL(15,4)             -- Kg
emision_n2o             DECIMAL(15,4)             -- Kg
emisiones_totales       DECIMAL(15,4)             -- Ton CO₂ eq
```

---

### 3. `combustibles_liquidos`
**Propósito:** Combustibles líquidos (gasolina, diesel, fuel oil)  
**Tipos:** Estacionarios y Móviles

**Columnas específicas:**
```sql
tipo_fuente             VARCHAR(50)               -- 'Estacionario' o 'Móvil'
consumo_anual           DECIMAL(15,4)             -- litros/año
densidad                DECIMAL(10,6)             -- kg/l
masa_combustible        DECIMAL(15,4)             -- kg (calculado)

CONSTRAINT tipo_fuente_valido CHECK (tipo_fuente IN ('Estacionario', 'Móvil'))
```

**Diferencias:**
- **Estacionarios:** Generadores, calderas
- **Móviles:** Vehículos, maquinaria transportable

---

### 4. `combustibles_gaseosos`
**Propósito:** Combustibles gaseosos (gas natural, GLP, GNC)  
**Unidad:** m³/año

**Columnas específicas:**
```sql
consumo_anual           DECIMAL(15,4)             -- m³/año
poder_calorifico        DECIMAL(15,6)             -- MJ/m³ (no MJ/kg)
```

---

### 5. `consumo_electricidad`
**Propósito:** Consumo eléctrico mensual (Alcance 2)

**Columnas:**
```sql
calculo_id              UUID REFERENCES calculos_huella_carbono
nombre_instalacion      VARCHAR(255)              -- "Oficina Principal", "Planta"
año                     INTEGER                   -- 2024, 2025

-- Consumo mensual en kWh
consumo_enero           DECIMAL(15,2)
consumo_febrero         DECIMAL(15,2)
consumo_marzo           DECIMAL(15,2)
...
consumo_diciembre       DECIMAL(15,2)

-- Totales
consumo_total_kwh       DECIMAL(15,2)             -- Suma de 12 meses
consumo_total_mwh       DECIMAL(15,4)             -- kWh / 1000

-- Factor de emisión
factor_emision          DECIMAL(10,6)             -- kg CO₂/kWh (0.391 para Colombia 2024)
pais                    VARCHAR(100)              -- 'Colombia'

-- Resultados
emisiones_totales       DECIMAL(15,4)             -- Ton CO₂ eq
```

**Cálculo:**
```sql
emisiones = (consumo_total_kwh * factor_emision) / 1000  -- Ton CO₂
```

---

### 6. `vuelos_aereos`
**Propósito:** Vuelos corporativos (Alcance 3)

**Columnas:**
```sql
calculo_id              UUID REFERENCES calculos_huella_carbono
origen                  VARCHAR(255)              -- "Bogotá", "Madrid"
destino                 VARCHAR(255)
clase_vuelo             VARCHAR(50)               -- 'Economica', 'Ejecutiva'
distancia_km            DECIMAL(15,2)             -- Calculado o manual
numero_pasajeros        INTEGER

-- Factor de emisión
factor_emision          DECIMAL(10,6)             -- kg CO₂/pasajero/km
                                                  -- Económica: 0.158
                                                  -- Ejecutiva: 0.237

-- Resultados
emisiones_totales       DECIMAL(15,4)             -- Ton CO₂ eq
```

**Cálculo:**
```sql
emisiones = (distancia_km * numero_pasajeros * factor_emision) / 1000
```

---

### 7. `extintores`
**Propósito:** Recargas de extintores (emisiones fugitivas - Alcance 1)

**Columnas:**
```sql
calculo_id              UUID REFERENCES calculos_huella_carbono
tipo_agente             VARCHAR(100)              -- "CO2", "Polvo químico", "HFC-227ea"
cantidad_recargada      DECIMAL(10,3)             -- kg
factor_emision          DECIMAL(15,6)             -- kg CO₂ eq/kg agente
emisiones_totales       DECIMAL(15,4)             -- Ton CO₂ eq
```

**Factores:**
- **CO₂:** 1.0 (directo)
- **HFC-227ea:** 3220 (alto GWP)
- **Polvo químico:** 0 (no es GEI)

---

### 8. `calculos_autogestion`
**Propósito:** Autodiagnósticos de sostenibilidad (210 preguntas)  
**Optimización:** 1 registro único con PDF embebido

**Columnas principales:**
```sql
id                      UUID PRIMARY KEY
codigo_seguimiento      VARCHAR(20) UNIQUE        -- AG-YYYY-NNNNNN
nombre_empresa          VARCHAR(500)
nit                     VARCHAR(50)

-- PDF completo embebido
pdf_reporte             BYTEA                     -- Buffer del PDF (156KB típico)

-- Resumen ejecutivo JSON
resumen_ejecutivo       JSONB                     -- Porcentajes y promedios
/*
{
  "porcentajeEconomico": 85.5,
  "porcentajeAmbiental": 78.2,
  "porcentajeEnergia": 82.0,
  "porcentajeSeguridad": 90.1,
  "porcentajeSocial": 75.5,
  "porcentajeAlmacen": 80.0,
  "porcentajeFinal": 81.8,
  "nivelCumplimiento": "Bueno"
}
*/

-- 210 respuestas en columnas JSON (opcionales)
respuestas_seccion_a    JSONB                     -- 26 preguntas económicas
respuestas_seccion_b    JSONB                     -- 77 preguntas ambientales
respuestas_seccion_c    JSONB                     -- 20 preguntas energía
respuestas_seccion_d    JSONB                     -- 28 preguntas seguridad
respuestas_seccion_e    JSONB                     -- 35 preguntas sociales
respuestas_seccion_f    JSONB                     -- 20 preguntas almacén

fecha_creacion          TIMESTAMP
```

**Optimización vs versión anterior:**
```
Antes: 241 registros (1 principal + 210 respuestas + 30 promedios)
Ahora: 1 registro único
Reducción: 99%
```

---

### 9. Catálogos de Factores de Emisión

#### `catalogo_combustibles_solidos`
**Registros:** 25 tipos  
**Fuente:** IPCC 2006 Guidelines

**Ejemplo:**
```sql
INSERT INTO catalogo_combustibles_solidos VALUES
('Carbón Genérico', 28.76, 88136.063, 1.0, 1.5, 0.7, 'IPCC 2006'),
('Carbón Bituminoso', 25.80, 94600, 1.0, 1.5, 0.7, 'IPCC 2006'),
('Leña', 15.60, 112000, 30.0, 4.0, 1.5, 'IPCC 2006');
```

#### `catalogo_combustibles_liquidos`
**Registros:** 16 tipos

**Ejemplo:**
```sql
('Gasolina corriente', 0.740, 43.02, 69300, 3.0, 0.6, 0.5, 'IPCC 2006'),
('ACPM/Diesel', 0.845, 42.60, 74036, 3.9, 0.6, 0.5, 'IPCC 2006');
```

#### `catalogo_combustibles_gaseosos`
**Registros:** 11 tipos

**Ejemplo:**
```sql
('Gas Natural', 38.00, 56100, 1.0, 0.1, 0, 'IPCC 2006'),
('GLP', 47.30, 63100, 1.0, 0.1, 0, 'IPCC 2006');
```

#### `factores_electricidad_pais`
**Registros:** 14 (Colombia 2020-2024)

**Ejemplo:**
```sql
('Colombia', 2024, 0.391, 'kg CO₂/kWh', 'UPME');
('Colombia', 2023, 0.176, 'kg CO₂/kWh', 'UPME');
```

---

## 🔒 Tablas Legales (GDPR/Ley 1581)

### 10. `consentimientos_usuario`
**Propósito:** Registro de aceptaciones de términos (GDPR Art. 7)

**Columnas:**
```sql
id                          UUID PRIMARY KEY
email_usuario               VARCHAR(255)
nombre_usuario              VARCHAR(255)

-- Consentimientos
acepta_terminos             BOOLEAN NOT NULL
acepta_privacidad           BOOLEAN NOT NULL
acepta_cookies_necesarias   BOOLEAN DEFAULT true
acepta_cookies_analiticas   BOOLEAN DEFAULT false
acepta_emails_promocionales BOOLEAN DEFAULT false

-- Versión de políticas
version_terminos            VARCHAR(50) DEFAULT 'v1.0'
version_privacidad          VARCHAR(50) DEFAULT 'v1.0'

-- Auditoría (GDPR Art. 30)
ip_address                  VARCHAR(100)
user_agent                  TEXT
navegador                   VARCHAR(100)          -- Detectado: "Chrome", "Firefox"
sistema_operativo           VARCHAR(100)          -- Detectado: "Windows", "Mac OS"
fecha_aceptacion            TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- Revocación
consentimiento_revocado     BOOLEAN DEFAULT false
fecha_revocacion            TIMESTAMP
motivo_revocacion           TEXT
```

**Detección automática:**
```javascript
// En setupProxy.js
const userAgent = req.headers['user-agent'];
const navegador = detectarNavegador(userAgent);  // "Chrome 120", "Firefox 121"
const sistemaOperativo = detectarSO(userAgent);  // "Windows 10", "Mac OS 14"
```

---

### 11. `historial_politicas`
**Propósito:** Versiones de términos y políticas

**Columnas:**
```sql
id                      UUID PRIMARY KEY
tipo_documento          VARCHAR(50)               -- 'terminos', 'privacidad', 'cookies'
version                 VARCHAR(50)               -- 'v1.0', 'v1.1'
titulo                  VARCHAR(500)
contenido               TEXT                      -- HTML o Markdown
fecha_vigencia_inicio   DATE
fecha_vigencia_fin      DATE
activo                  BOOLEAN DEFAULT true
```

---

### 12. `log_acceso_datos`
**Propósito:** Auditoría de accesos (GDPR Art. 30)

**Columnas:**
```sql
id                      UUID PRIMARY KEY
email_usuario           VARCHAR(255)
tipo_acceso             VARCHAR(100)              -- 'consulta', 'modificacion', 'eliminacion'
tabla_afectada          VARCHAR(100)
registro_id             UUID
ip_address              VARCHAR(100)
fecha_acceso            TIMESTAMP
resultado               VARCHAR(50)               -- 'exitoso', 'denegado'
```

---

### 13. `solicitudes_eliminacion`
**Propósito:** Derecho al olvido (GDPR Art. 17)

**Columnas:**
```sql
id                      UUID PRIMARY KEY
email_usuario           VARCHAR(255) NOT NULL
nombre_usuario          VARCHAR(255)
motivo                  TEXT
estado                  VARCHAR(50)               -- 'pendiente', 'en_proceso', 'completada'
fecha_solicitud         TIMESTAMP
fecha_procesamiento     TIMESTAMP
fecha_completada        TIMESTAMP
procesado_por           VARCHAR(255)              -- Admin que procesó
notas_procesamiento     TEXT
```

---

## ⚙️ Funciones y Triggers

### Función: `generar_codigo_seguimiento()`
**Propósito:** Generar códigos únicos HC-YYYY-NNNNNN / AG-YYYY-NNNNNN

```sql
CREATE OR REPLACE FUNCTION generar_codigo_seguimiento(tipo TEXT)
RETURNS TEXT AS $$
DECLARE
    año INTEGER;
    contador INTEGER;
    codigo TEXT;
BEGIN
    año := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Obtener siguiente número de secuencia
    IF tipo = 'HC' THEN
        SELECT nextval('seq_huella_carbono_codigo') INTO contador;
    ELSIF tipo = 'AG' THEN
        SELECT nextval('seq_autogestion_codigo') INTO contador;
    ELSE
        RAISE EXCEPTION 'Tipo inválido. Use HC o AG';
    END IF;
    
    -- Formato: HC-2025-000001
    codigo := tipo || '-' || año || '-' || LPAD(contador::TEXT, 6, '0');
    
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;
```

**Uso:**
```sql
SELECT generar_codigo_seguimiento('HC');  -- HC-2025-000001
SELECT generar_codigo_seguimiento('AG');  -- AG-2025-000001
```

---

### Trigger: Actualizar `emisiones_totales` en `calculos_huella_carbono`

```sql
CREATE OR REPLACE FUNCTION actualizar_emisiones_alcance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE calculos_huella_carbono
    SET 
        emisiones_alcance_1 = (
            SELECT COALESCE(SUM(emisiones_totales), 0)
            FROM (
                SELECT emisiones_totales FROM combustibles_solidos WHERE calculo_id = NEW.calculo_id
                UNION ALL
                SELECT emisiones_totales FROM combustibles_liquidos WHERE calculo_id = NEW.calculo_id
                ...
            ) AS alcance_1
        ),
        emisiones_alcance_2 = (
            SELECT COALESCE(SUM(emisiones_totales), 0)
            FROM consumo_electricidad WHERE calculo_id = NEW.calculo_id
        ),
        emisiones_alcance_3 = (
            SELECT COALESCE(SUM(emisiones_totales), 0)
            FROM vuelos_aereos WHERE calculo_id = NEW.calculo_id
        )
    WHERE id = NEW.calculo_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_emisiones_solidos
AFTER INSERT OR UPDATE OR DELETE ON combustibles_solidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_emisiones_alcance();
```

---

## 🚀 Índices y Optimización

### Índices de búsqueda principal
```sql
-- Códigos de seguimiento (búsqueda más frecuente)
CREATE INDEX idx_huella_codigo ON calculos_huella_carbono(codigo_seguimiento);
CREATE INDEX idx_autogestion_codigo ON calculos_autogestion(codigo_seguimiento);

-- NITs de empresa
CREATE INDEX idx_huella_nit ON calculos_huella_carbono(nit);
CREATE INDEX idx_autogestion_nit ON calculos_autogestion(nit);

-- Fechas (reportes temporales)
CREATE INDEX idx_huella_fecha ON calculos_huella_carbono(fecha_reporte);
CREATE INDEX idx_autogestion_fecha ON calculos_autogestion(fecha_creacion);
```

### Índices de foreign keys
```sql
CREATE INDEX idx_solidos_calculo ON combustibles_solidos(calculo_id);
CREATE INDEX idx_liquidos_calculo ON combustibles_liquidos(calculo_id);
CREATE INDEX idx_gaseosos_calculo ON combustibles_gaseosos(calculo_id);
CREATE INDEX idx_electricidad_calculo ON consumo_electricidad(calculo_id);
```

---

## 🔢 Códigos de Seguimiento

### Secuencias PostgreSQL
```sql
-- Huella de Carbono
CREATE SEQUENCE seq_huella_carbono_codigo START 1;

-- Autogestión
CREATE SEQUENCE seq_autogestion_codigo START 1;
```

### Formato
```
HC-YYYY-NNNNNN  (Huella de Carbono)
AG-YYYY-NNNNNN  (Autogestión)

Ejemplo:
HC-2025-000001
HC-2025-000002
...
AG-2025-000001
AG-2025-000002
```

### Características
- ✅ **Único por tipo y año**
- ✅ **Reinicio automático cada año**
- ✅ **6 dígitos numéricos** (hasta 999,999 cálculos/año)
- ✅ **Regex validation:** `^(HC|AG)-[0-9]{4}-[0-9]{6}$`

---

**Última actualización:** Octubre 9, 2025  
**Versión BD:** 1.0.0  
**Total tablas:** 25 (21 operativas + 4 legales)
