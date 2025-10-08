-- ============================================================================
-- FUNCIONES Y TRIGGERS DE BASE DE DATOS
-- ============================================================================
-- Versión: 1.0.0
-- Fecha: 3 de Octubre, 2025
-- Descripción: Funciones auxiliares, triggers y procedimientos almacenados
-- ============================================================================

\c mundoverde_db

-- ============================================================================
-- FUNCIÓN: Generar código de seguimiento único
-- Formato: HC-2025-000001 para Huella, AG-2025-000001 para Autogestión
-- ============================================================================

CREATE OR REPLACE FUNCTION generar_codigo_seguimiento(
    p_prefijo VARCHAR(5)  -- 'HC' o 'AG'
) RETURNS VARCHAR(20) AS $$
DECLARE
    v_año VARCHAR(4);
    v_secuencia INTEGER;
    v_codigo VARCHAR(20);
BEGIN
    -- Obtener año actual
    v_año := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    -- Obtener siguiente número de la secuencia correspondiente
    IF p_prefijo = 'HC' THEN
        v_secuencia := nextval('seq_huella_carbono_codigo');
    ELSIF p_prefijo = 'AG' THEN
        v_secuencia := nextval('seq_autogestion_codigo');
    ELSE
        RAISE EXCEPTION 'Prefijo inválido: %. Use HC o AG', p_prefijo;
    END IF;
    
    -- Formatear código: PREFIJO-YYYY-NNNNNN (6 dígitos con ceros a la izquierda)
    v_codigo := p_prefijo || '-' || v_año || '-' || LPAD(v_secuencia::VARCHAR, 6, '0');
    
    RETURN v_codigo;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generar_codigo_seguimiento IS 'Genera códigos únicos HC-YYYY-NNNNNN o AG-YYYY-NNNNNN';

-- ============================================================================
-- FUNCIÓN: Calcular emisiones de combustibles sólidos
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_emisiones_solidos()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular energía consumida (TJ)
    NEW.energia_consumida := (NEW.consumo_anual * NEW.poder_calorifico) / 1000000;
    
    -- Calcular emisiones individuales (kg)
    NEW.emision_co2 := NEW.energia_consumida * NEW.factor_co2 / 1000;
    NEW.emision_ch4 := NEW.energia_consumida * NEW.factor_ch4 / 1000;
    NEW.emision_n2o := NEW.energia_consumida * NEW.factor_n2o / 1000;
    
    IF NEW.factor_so2 IS NOT NULL THEN
        NEW.emision_so2 := NEW.energia_consumida * NEW.factor_so2 / 1000;
    ELSE
        NEW.emision_so2 := 0;
    END IF;
    
    -- Calcular emisiones totales en CO₂ equivalente (Ton)
    -- GWP: CH4=25, N2O=298, SO2=0 (no es GEI pero se registra)
    NEW.emisiones_totales := (
        NEW.emision_co2 + 
        (NEW.emision_ch4 * 25) + 
        (NEW.emision_n2o * 298)
    ) / 1000;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_emisiones_solidos
    BEFORE INSERT OR UPDATE ON combustibles_solidos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_emisiones_solidos();

COMMENT ON FUNCTION calcular_emisiones_solidos IS 'Calcula automáticamente emisiones de combustibles sólidos';

-- ============================================================================
-- FUNCIÓN: Calcular emisiones de combustibles líquidos
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_emisiones_liquidos()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular masa del combustible (kg)
    NEW.masa_combustible := NEW.consumo_anual * NEW.densidad;
    
    -- Calcular energía consumida (TJ)
    NEW.energia_consumida := (NEW.masa_combustible * NEW.poder_calorifico) / 1000000;
    
    -- Calcular emisiones individuales (kg)
    NEW.emision_co2 := NEW.energia_consumida * NEW.factor_co2 / 1000;
    NEW.emision_ch4 := NEW.energia_consumida * NEW.factor_ch4 / 1000;
    NEW.emision_n2o := NEW.energia_consumida * NEW.factor_n2o / 1000;
    
    IF NEW.factor_so2 IS NOT NULL THEN
        NEW.emision_so2 := NEW.energia_consumida * NEW.factor_so2 / 1000;
    ELSE
        NEW.emision_so2 := 0;
    END IF;
    
    -- Calcular emisiones totales en CO₂ equivalente (Ton)
    -- GWP: CH4=25, N2O=298
    NEW.emisiones_totales := (
        NEW.emision_co2 + 
        (NEW.emision_ch4 * 25) + 
        (NEW.emision_n2o * 298)
    ) / 1000;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_emisiones_liquidos
    BEFORE INSERT OR UPDATE ON combustibles_liquidos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_emisiones_liquidos();

COMMENT ON FUNCTION calcular_emisiones_liquidos IS 'Calcula automáticamente emisiones de combustibles líquidos';

-- ============================================================================
-- FUNCIÓN: Calcular emisiones de combustibles gaseosos
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_emisiones_gaseosos()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular energía consumida (TJ)
    NEW.energia_consumida := (NEW.consumo_anual * NEW.poder_calorifico) / 1000000;
    
    -- Calcular emisiones individuales (kg)
    NEW.emision_co2 := NEW.energia_consumida * NEW.factor_co2 / 1000;
    NEW.emision_ch4 := NEW.energia_consumida * NEW.factor_ch4 / 1000;
    NEW.emision_n2o := NEW.energia_consumida * NEW.factor_n2o / 1000;
    
    IF NEW.factor_so2 IS NOT NULL THEN
        NEW.emision_so2 := NEW.energia_consumida * NEW.factor_so2 / 1000;
    ELSE
        NEW.emision_so2 := 0;
    END IF;
    
    -- Calcular emisiones totales en CO₂ equivalente (Ton)
    -- GWP: CH4=25, N2O=298
    NEW.emisiones_totales := (
        NEW.emision_co2 + 
        (NEW.emision_ch4 * 25) + 
        (NEW.emision_n2o * 298)
    ) / 1000;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_emisiones_gaseosos
    BEFORE INSERT OR UPDATE ON combustibles_gaseosos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_emisiones_gaseosos();

COMMENT ON FUNCTION calcular_emisiones_gaseosos IS 'Calcula automáticamente emisiones de combustibles gaseosos';

-- ============================================================================
-- FUNCIÓN: Calcular emisiones de electricidad
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_emisiones_electricidad()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular emisiones parciales (kg CO₂)
    NEW.emisiones_parciales := NEW.consumo_anual * NEW.factor_emision_co2;
    
    -- Convertir a toneladas CO₂
    NEW.emisiones_totales := NEW.emisiones_parciales / 1000;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_emisiones_electricidad
    BEFORE INSERT OR UPDATE ON consumo_electricidad
    FOR EACH ROW
    EXECUTE FUNCTION calcular_emisiones_electricidad();

COMMENT ON FUNCTION calcular_emisiones_electricidad IS 'Calcula automáticamente emisiones del consumo eléctrico';

-- ============================================================================
-- FUNCIÓN: Calcular emisiones de vuelos aéreos
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_emisiones_vuelos()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular emisión en kg CO₂
    NEW.emision_kg := NEW.distancia_km * NEW.factor_emision * NEW.numero_pasajeros;
    
    -- Convertir a toneladas
    NEW.emision_ton := NEW.emision_kg / 1000;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_emisiones_vuelos
    BEFORE INSERT OR UPDATE ON vuelos_aereos
    FOR EACH ROW
    EXECUTE FUNCTION calcular_emisiones_vuelos();

COMMENT ON FUNCTION calcular_emisiones_vuelos IS 'Calcula automáticamente emisiones de vuelos aéreos';

-- ============================================================================
-- FUNCIÓN: Actualizar totales en calculos_huella_carbono
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_totales_huella()
RETURNS TRIGGER AS $$
DECLARE
    v_calculo_id UUID;
    v_total_alcance_1 DECIMAL(15,4);
    v_total_alcance_2 DECIMAL(15,4);
    v_total_alcance_3 DECIMAL(15,4);
BEGIN
    -- Determinar el ID del cálculo según la tabla
    IF TG_TABLE_NAME IN ('combustibles_solidos', 'combustibles_liquidos', 'combustibles_gaseosos', 'extintores') THEN
        IF TG_OP = 'DELETE' THEN
            v_calculo_id := OLD.calculo_id;
        ELSE
            v_calculo_id := NEW.calculo_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'consumo_electricidad' THEN
        IF TG_OP = 'DELETE' THEN
            v_calculo_id := OLD.calculo_id;
        ELSE
            v_calculo_id := NEW.calculo_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'vuelos_aereos' THEN
        IF TG_OP = 'DELETE' THEN
            v_calculo_id := OLD.calculo_id;
        ELSE
            v_calculo_id := NEW.calculo_id;
        END IF;
    END IF;
    
    -- Calcular Alcance 1: Combustibles + Extintores
    SELECT COALESCE(SUM(emisiones_totales), 0) INTO v_total_alcance_1
    FROM (
        SELECT COALESCE(SUM(emisiones_totales), 0) as emisiones_totales
        FROM combustibles_solidos WHERE calculo_id = v_calculo_id
        UNION ALL
        SELECT COALESCE(SUM(emisiones_totales), 0)
        FROM combustibles_liquidos WHERE calculo_id = v_calculo_id
        UNION ALL
        SELECT COALESCE(SUM(emisiones_totales), 0)
        FROM combustibles_gaseosos WHERE calculo_id = v_calculo_id
        UNION ALL
        SELECT COALESCE(SUM(emisiones_parciales), 0) / 1000
        FROM extintores WHERE calculo_id = v_calculo_id
    ) t;
    
    -- Calcular Alcance 2: Electricidad
    SELECT COALESCE(SUM(emisiones_totales), 0) INTO v_total_alcance_2
    FROM consumo_electricidad
    WHERE calculo_id = v_calculo_id;
    
    -- Calcular Alcance 3: Vuelos
    SELECT COALESCE(SUM(emision_ton), 0) INTO v_total_alcance_3
    FROM vuelos_aereos
    WHERE calculo_id = v_calculo_id;
    
    -- Actualizar totales en calculos_huella_carbono
    UPDATE calculos_huella_carbono
    SET 
        emisiones_alcance_1 = v_total_alcance_1,
        emisiones_alcance_2 = v_total_alcance_2,
        emisiones_alcance_3 = v_total_alcance_3,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE id = v_calculo_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar totales automáticamente
CREATE TRIGGER trg_actualizar_huella_solidos
    AFTER INSERT OR UPDATE OR DELETE ON combustibles_solidos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

CREATE TRIGGER trg_actualizar_huella_liquidos
    AFTER INSERT OR UPDATE OR DELETE ON combustibles_liquidos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

CREATE TRIGGER trg_actualizar_huella_gaseosos
    AFTER INSERT OR UPDATE OR DELETE ON combustibles_gaseosos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

CREATE TRIGGER trg_actualizar_huella_electricidad
    AFTER INSERT OR UPDATE OR DELETE ON consumo_electricidad
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

CREATE TRIGGER trg_actualizar_huella_vuelos
    AFTER INSERT OR UPDATE OR DELETE ON vuelos_aereos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

CREATE TRIGGER trg_actualizar_huella_extintores
    AFTER INSERT OR UPDATE OR DELETE ON extintores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_totales_huella();

COMMENT ON FUNCTION actualizar_totales_huella IS 'Recalcula automáticamente los totales por alcance en la huella de carbono';

-- ============================================================================
-- FUNCIÓN: Actualizar timestamp de fecha_actualizacion
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fecha_huella
    BEFORE UPDATE ON calculos_huella_carbono
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_fecha_autogestion
    BEFORE UPDATE ON calculos_autogestion
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

COMMENT ON FUNCTION actualizar_fecha_modificacion IS 'Actualiza automáticamente la fecha de modificación de registros';

-- ============================================================================
-- FUNCIÓN: Registrar en auditoría
-- ============================================================================

CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_accion VARCHAR(100);
    v_entidad VARCHAR(100);
BEGIN
    -- Determinar la acción
    IF TG_OP = 'INSERT' THEN
        v_accion := 'CREATE';
    ELSIF TG_OP = 'UPDATE' THEN
        v_accion := 'UPDATE';
    ELSIF TG_OP = 'DELETE' THEN
        v_accion := 'DELETE';
    END IF;
    
    -- Determinar la entidad
    v_entidad := TG_TABLE_NAME;
    
    -- Insertar en auditoría
    IF TG_OP = 'DELETE' THEN
        INSERT INTO auditoria (accion, entidad, entidad_id, datos_anteriores)
        VALUES (v_accion, v_entidad, OLD.id, row_to_json(OLD));
    ELSE
        INSERT INTO auditoria (accion, entidad, entidad_id, datos_anteriores, datos_nuevos)
        VALUES (
            v_accion, 
            v_entidad, 
            NEW.id, 
            CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
            row_to_json(NEW)
        );
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoría a tablas principales
CREATE TRIGGER trg_audit_huella
    AFTER INSERT OR UPDATE OR DELETE ON calculos_huella_carbono
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trg_audit_autogestion
    AFTER INSERT OR UPDATE OR DELETE ON calculos_autogestion
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

COMMENT ON FUNCTION registrar_auditoria IS 'Registra todas las operaciones en la tabla de auditoría';

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: Resumen de emisiones por empresa
CREATE OR REPLACE VIEW v_resumen_emisiones AS
SELECT 
    h.id,
    h.codigo_seguimiento,
    h.nombre_empresa,
    h.nit,
    h.año_reporte,
    h.fecha_reporte,
    h.emisiones_alcance_1,
    h.emisiones_alcance_2,
    h.emisiones_alcance_3,
    h.emisiones_totales,
    h.nivel_evaluacion,
    h.arboles_compensar,
    
    -- Contadores por tipo de fuente
    (SELECT COUNT(*) FROM combustibles_solidos WHERE calculo_id = h.id) as num_solidos,
    (SELECT COUNT(*) FROM combustibles_liquidos WHERE calculo_id = h.id) as num_liquidos,
    (SELECT COUNT(*) FROM combustibles_gaseosos WHERE calculo_id = h.id) as num_gaseosos,
    (SELECT COUNT(*) FROM consumo_electricidad WHERE calculo_id = h.id) as num_instalaciones_elect,
    (SELECT COUNT(*) FROM vuelos_aereos WHERE calculo_id = h.id) as num_vuelos,
    (SELECT COUNT(*) FROM extintores WHERE calculo_id = h.id) as num_extintores
FROM calculos_huella_carbono h
ORDER BY h.fecha_reporte DESC;

COMMENT ON VIEW v_resumen_emisiones IS 'Vista consolidada de emisiones con contadores por tipo de fuente';

-- Vista: Ranking de empresas por emisiones
CREATE OR REPLACE VIEW v_ranking_empresas AS
SELECT 
    nit,
    nombre_empresa,
    COUNT(*) as total_calculos,
    AVG(emisiones_totales) as promedio_emisiones,
    MAX(emisiones_totales) as max_emisiones,
    MIN(emisiones_totales) as min_emisiones,
    MAX(año_reporte) as ultimo_año
FROM calculos_huella_carbono
GROUP BY nit, nombre_empresa
ORDER BY promedio_emisiones DESC;

COMMENT ON VIEW v_ranking_empresas IS 'Ranking de empresas por emisiones promedio';

-- Vista: Histórico de autogestión por empresa
CREATE OR REPLACE VIEW v_historico_autogestion AS
SELECT 
    a.id,
    a.codigo_seguimiento,
    a.nombre_empresa,
    a.nit,
    a.año_reporte,
    a.fecha_reporte,
    a.porcentaje_economico,
    a.porcentaje_ambiental,
    a.porcentaje_energia,
    a.porcentaje_seguridad,
    a.porcentaje_social,
    a.porcentaje_almacen,
    a.porcentaje_final,
    a.nivel_cumplimiento,
    
    -- Total de respuestas
    (SELECT COUNT(*) FROM respuestas_autogestion WHERE calculo_id = a.id) as total_respuestas
FROM calculos_autogestion a
ORDER BY a.nit, a.año_reporte DESC;

COMMENT ON VIEW v_historico_autogestion IS 'Histórico de autogestión con métricas consolidadas';

-- ============================================================================
-- FUNCIÓN: Obtener factor de emisión de combustible
-- ============================================================================

CREATE OR REPLACE FUNCTION obtener_factor_combustible(
    p_tipo VARCHAR(10),  -- 'solido', 'liquido', 'gaseoso'
    p_nombre VARCHAR(255)
) RETURNS JSONB AS $$
DECLARE
    v_resultado JSONB;
BEGIN
    IF p_tipo = 'solido' THEN
        SELECT jsonb_build_object(
            'poder_calorifico', poder_calorifico,
            'factor_co2', factor_co2,
            'factor_ch4', factor_ch4,
            'factor_n2o', factor_n2o,
            'factor_so2', factor_so2
        ) INTO v_resultado
        FROM catalogo_combustibles_solidos
        WHERE nombre = p_nombre AND activo = true;
        
    ELSIF p_tipo = 'liquido' THEN
        SELECT jsonb_build_object(
            'densidad', densidad,
            'poder_calorifico', poder_calorifico,
            'factor_co2', factor_co2,
            'factor_ch4', factor_ch4,
            'factor_n2o', factor_n2o,
            'factor_so2', factor_so2
        ) INTO v_resultado
        FROM catalogo_combustibles_liquidos
        WHERE nombre = p_nombre AND activo = true;
        
    ELSIF p_tipo = 'gaseoso' THEN
        SELECT jsonb_build_object(
            'poder_calorifico', poder_calorifico,
            'factor_co2', factor_co2,
            'factor_ch4', factor_ch4,
            'factor_n2o', factor_n2o,
            'factor_so2', factor_so2
        ) INTO v_resultado
        FROM catalogo_combustibles_gaseosos
        WHERE nombre = p_nombre AND activo = true;
    ELSE
        RAISE EXCEPTION 'Tipo de combustible inválido: %', p_tipo;
    END IF;
    
    IF v_resultado IS NULL THEN
        RAISE EXCEPTION 'Combustible no encontrado: % - %', p_tipo, p_nombre;
    END IF;
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION obtener_factor_combustible IS 'Obtiene factores de emisión de catálogos';

-- ============================================================================
-- FUNCIÓN: Obtener factor de electricidad
-- ============================================================================

CREATE OR REPLACE FUNCTION obtener_factor_electricidad(
    p_pais VARCHAR(100) DEFAULT 'Colombia',
    p_año INTEGER DEFAULT NULL
) RETURNS DECIMAL(10,6) AS $$
DECLARE
    v_factor DECIMAL(10,6);
    v_año_usar INTEGER;
BEGIN
    -- Si no se especifica año, usar el actual
    IF p_año IS NULL THEN
        v_año_usar := EXTRACT(YEAR FROM CURRENT_DATE);
    ELSE
        v_año_usar := p_año;
    END IF;
    
    -- Buscar factor para el país y año especificado
    SELECT factor_emision INTO v_factor
    FROM factores_electricidad_pais
    WHERE pais = p_pais 
    AND año = v_año_usar
    AND activo = true;
    
    -- Si no se encuentra, buscar el año más reciente disponible
    IF v_factor IS NULL THEN
        SELECT factor_emision INTO v_factor
        FROM factores_electricidad_pais
        WHERE pais = p_pais
        AND activo = true
        ORDER BY año DESC
        LIMIT 1;
    END IF;
    
    -- Si aún no hay factor, usar Colombia por defecto
    IF v_factor IS NULL THEN
        v_factor := 0.391;  -- Colombia 2024
    END IF;
    
    RETURN v_factor;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION obtener_factor_electricidad IS 'Obtiene factor de emisión de electricidad por país y año';

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- Listar todas las funciones creadas
SELECT 
    p.proname as "Función",
    pg_get_function_result(p.oid) as "Retorna",
    d.description as "Descripción"
FROM pg_proc p
LEFT JOIN pg_description d ON p.oid = d.objoid
WHERE p.pronamespace = 'public'::regnamespace
AND p.prokind = 'f'
ORDER BY p.proname;

-- Listar todos los triggers
SELECT 
    t.tgname as "Trigger",
    c.relname as "Tabla",
    p.proname as "Función"
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relnamespace = 'public'::regnamespace
AND NOT t.tgisinternal
ORDER BY c.relname, t.tgname;

-- ============================================================================
-- FIN DEL SCRIPT DE FUNCIONES
-- ============================================================================

\echo '✅ Funciones y triggers creados exitosamente!'
\echo ''
\echo '📊 RESUMEN:'
\echo '- Función generación códigos: generar_codigo_seguimiento()'
\echo '- Triggers de cálculo automático: 6'
\echo '- Trigger de actualización totales: 6'
\echo '- Triggers de auditoría: 2'
\echo '- Vistas creadas: 3'
\echo '- Funciones auxiliares: 3'
\echo ''
\echo 'La base de datos está COMPLETA y lista para usar!'
