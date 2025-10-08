// ============================================================================
// QUERIES SQL ORGANIZADAS
// ============================================================================
// Descripción: Todas las consultas SQL en un solo archivo centralizado
// ============================================================================

module.exports = {
    
    // ========================================================================
    // CÁLCULOS DE HUELLA DE CARBONO
    // ========================================================================
    
    insertarCalculoHuella: `
        INSERT INTO calculos_huella_carbono (
            codigo_seguimiento, nombre_empresa, nit, sector, departamento, municipio,
            direccion, telefono, correo, persona_elabora, cargo,
            año_reporte, fecha_reporte, periodo_inicio, periodo_fin,
            nivel_evaluacion, arboles_compensar, notas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id
    `,
    
    obtenerCalculoHuellaPorCodigo: `
        SELECT * FROM calculos_huella_carbono
        WHERE codigo_seguimiento = $1
    `,
    
    obtenerCalculoHuellaPorId: `
        SELECT * FROM calculos_huella_carbono
        WHERE id = $1
    `,
    
    // ========================================================================
    // COMBUSTIBLES SÓLIDOS
    // ========================================================================
    
    insertarCombustibleSolido: `
        INSERT INTO combustibles_solidos (
            calculo_id, tipo_combustible, consumo_anual, unidad_medida,
            poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `,
    
    obtenerCombustiblesSolidos: `
        SELECT * FROM combustibles_solidos
        WHERE calculo_id = $1
        ORDER BY fecha_registro
    `,
    
    // ========================================================================
    // COMBUSTIBLES LÍQUIDOS
    // ========================================================================
    
    insertarCombustibleLiquido: `
        INSERT INTO combustibles_liquidos (
            calculo_id, tipo_combustible, tipo_fuente, consumo_anual,
            densidad, poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
    `,
    
    obtenerCombustiblesLiquidos: `
        SELECT * FROM combustibles_liquidos
        WHERE calculo_id = $1
        ORDER BY fecha_registro
    `,
    
    // ========================================================================
    // COMBUSTIBLES GASEOSOS
    // ========================================================================
    
    insertarCombustibleGaseoso: `
        INSERT INTO combustibles_gaseosos (
            calculo_id, tipo_combustible, tipo_fuente, consumo_anual, unidad_medida,
            poder_calorifico, factor_co2, factor_ch4, factor_n2o, factor_so2
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
    `,
    
    obtenerCombustiblesGaseosos: `
        SELECT * FROM combustibles_gaseosos
        WHERE calculo_id = $1
        ORDER BY fecha_registro
    `,
    
    // ========================================================================
    // CONSUMO DE ELECTRICIDAD
    // ========================================================================
    
    insertarConsumoElectricidad: `
        INSERT INTO consumo_electricidad (
            calculo_id, año, instalacion,
            enero, febrero, marzo, abril, mayo, junio,
            julio, agosto, septiembre, octubre, noviembre, diciembre,
            factor_emision_co2
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id
    `,
    
    obtenerConsumoElectricidad: `
        SELECT * FROM consumo_electricidad
        WHERE calculo_id = $1
        ORDER BY instalacion
    `,
    
    // ========================================================================
    // VUELOS AÉREOS
    // ========================================================================
    
    insertarVueloAereo: `
        INSERT INTO vuelos_aereos (
            calculo_id, ciudad_origen, ciudad_destino, pais_origen, pais_destino,
            tipo_vuelo, clase, numero_pasajeros, distancia_km, factor_emision
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
    `,
    
    obtenerVuelosAereos: `
        SELECT * FROM vuelos_aereos
        WHERE calculo_id = $1
        ORDER BY fecha_registro
    `,
    
    // ========================================================================
    // EXTINTORES
    // ========================================================================
    
    insertarExtintor: `
        INSERT INTO extintores (
            calculo_id, tipo_gas, cantidad, pcg
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
    `,
    
    obtenerExtintores: `
        SELECT * FROM extintores
        WHERE calculo_id = $1
        ORDER BY fecha_registro
    `,
    
    // ========================================================================
    // CÁLCULOS DE AUTOGESTIÓN
    // ========================================================================
    
    insertarCalculoAutogestion: `
        INSERT INTO calculos_autogestion (
            codigo_seguimiento, nombre_empresa, nit, sector, departamento, municipio,
            direccion, telefono, correo, persona_elabora, cargo,
            año_reporte, fecha_reporte,
            porcentaje_economico, porcentaje_ambiental, porcentaje_energia,
            porcentaje_seguridad, porcentaje_social, porcentaje_almacen,
            nivel_cumplimiento, notas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING id
    `,
    
    obtenerCalculoAutogestionPorCodigo: `
        SELECT * FROM calculos_autogestion
        WHERE codigo_seguimiento = $1
    `,
    
    obtenerCalculoAutogestionPorId: `
        SELECT * FROM calculos_autogestion
        WHERE id = $1
    `,
    
    // ========================================================================
    // RESPUESTAS DE AUTOGESTIÓN
    // ========================================================================
    
    insertarRespuestaAutogestion: `
        INSERT INTO respuestas_autogestion (
            calculo_id, seccion, bloque, pregunta_id, numero_pregunta,
            texto_pregunta, respuesta, puntaje
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `,
    
    obtenerRespuestasAutogestion: `
        SELECT * FROM respuestas_autogestion
        WHERE calculo_id = $1
        ORDER BY seccion, numero_pregunta
    `,
    
    // ========================================================================
    // PROMEDIOS DE BLOQUES
    // ========================================================================
    
    insertarPromedioBloque: `
        INSERT INTO promedios_bloques_autogestion (
            calculo_id, seccion, bloque, nombre_bloque,
            promedio_bloque, total_preguntas, preguntas_respondidas
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `,
    
    obtenerPromediosBloques: `
        SELECT * FROM promedios_bloques_autogestion
        WHERE calculo_id = $1
        ORDER BY seccion, bloque
    `,
    
    // ========================================================================
    // CATÁLOGOS DE FACTORES DE EMISIÓN
    // ========================================================================
    
    obtenerCatalogoCombustiblesSolidos: `
        SELECT * FROM catalogo_combustibles_solidos
        WHERE activo = true
        ORDER BY nombre
    `,
    
    obtenerCatalogoCombustiblesLiquidos: `
        SELECT * FROM catalogo_combustibles_liquidos
        WHERE activo = true
        ORDER BY nombre
    `,
    
    obtenerCatalogoCombustiblesGaseosos: `
        SELECT * FROM catalogo_combustibles_gaseosos
        WHERE activo = true
        ORDER BY nombre
    `,
    
    obtenerFactoresElectricidad: `
        SELECT * FROM factores_electricidad_pais
        WHERE activo = true
        ORDER BY pais, año DESC
    `,
    
    obtenerFactorElectricidadPorPais: `
        SELECT factor_emision FROM factores_electricidad_pais
        WHERE pais = $1 AND año = $2 AND activo = true
    `,
    
    // ========================================================================
    // DOCUMENTOS GENERADOS
    // ========================================================================
    
    insertarDocumentoGenerado: `
        INSERT INTO documentos_generados (
            calculo_huella_id, calculo_autogestion_id, tipo_documento,
            nombre_archivo, ruta_archivo, tamaño_bytes, hash_archivo,
            email_destinatario
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `,
    
    obtenerDocumentosPorHuella: `
        SELECT * FROM documentos_generados
        WHERE calculo_huella_id = $1
        ORDER BY fecha_generacion DESC
    `,
    
    obtenerDocumentosPorAutogestion: `
        SELECT * FROM documentos_generados
        WHERE calculo_autogestion_id = $1
        ORDER BY fecha_generacion DESC
    `,
    
    // ========================================================================
    // CONSULTAS PARA REPORTES Y ESTADÍSTICAS
    // ========================================================================
    
    obtenerResumenPorNIT: `
        SELECT 
            codigo_seguimiento,
            año_reporte,
            fecha_reporte,
            emisiones_alcance_1,
            emisiones_alcance_2,
            emisiones_alcance_3,
            emisiones_totales,
            nivel_evaluacion
        FROM calculos_huella_carbono
        WHERE nit = $1
        ORDER BY año_reporte DESC, fecha_reporte DESC
    `,
    
    obtenerTopEmisores: `
        SELECT 
            nit,
            nombre_empresa,
            COUNT(*) as total_calculos,
            AVG(emisiones_totales) as promedio_emisiones,
            MAX(emisiones_totales) as max_emisiones
        FROM calculos_huella_carbono
        GROUP BY nit, nombre_empresa
        ORDER BY promedio_emisiones DESC
        LIMIT $1
    `,
    
    obtenerEstadisticasPorAño: `
        SELECT 
            año_reporte,
            COUNT(*) as total_calculos,
            SUM(emisiones_totales) as emisiones_totales,
            AVG(emisiones_totales) as promedio_emisiones,
            MIN(emisiones_totales) as min_emisiones,
            MAX(emisiones_totales) as max_emisiones
        FROM calculos_huella_carbono
        GROUP BY año_reporte
        ORDER BY año_reporte DESC
    `,
    
    obtenerResumenAutogestionPorNIT: `
        SELECT 
            codigo_seguimiento,
            año_reporte,
            fecha_reporte,
            porcentaje_economico,
            porcentaje_ambiental,
            porcentaje_energia,
            porcentaje_seguridad,
            porcentaje_social,
            porcentaje_almacen,
            porcentaje_final,
            nivel_cumplimiento
        FROM calculos_autogestion
        WHERE nit = $1
        ORDER BY año_reporte DESC, fecha_reporte DESC
    `,
    
    // ========================================================================
    // VISTAS (lectura directa)
    // ========================================================================
    
    obtenerResumenEmisiones: `
        SELECT * FROM v_resumen_emisiones
        ORDER BY fecha_reporte DESC
        LIMIT $1
    `,
    
    obtenerRankingEmpresas: `
        SELECT * FROM v_ranking_empresas
        LIMIT $1
    `,
    
    obtenerHistoricoAutogestion: `
        SELECT * FROM v_historico_autogestion
        ORDER BY año_reporte DESC, fecha_reporte DESC
        LIMIT $1
    `
};
