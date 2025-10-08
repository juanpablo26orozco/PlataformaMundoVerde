// ============================================================================
// SERVICIO PRINCIPAL DE BASE DE DATOS
// ============================================================================
// Descripción: Servicio completo para gestionar todos los cálculos y datos
// ============================================================================

const { pool, ejecutarTransaccion } = require('./config');
const queries = require('./queries');

class DatabaseService {
    
    // ========================================================================
    // HUELLA DE CARBONO
    // ========================================================================
    
    /**
     * Guarda un cálculo completo de huella de carbono
     * @param {Object} datos - Datos completos del formulario
     * @returns {Promise<{success: boolean, codigo: string, id: string}>}
     */
    async guardarHuellaCarbono(datos) {
        console.log('💾 Guardando cálculo de huella de carbono...');
        
        return await ejecutarTransaccion(async (client) => {
            
            // 1. Generar código de seguimiento único
            const codigoResult = await client.query(
                "SELECT generar_codigo_seguimiento('HC') as codigo"
            );
            const codigoSeguimiento = codigoResult.rows[0].codigo;
            console.log(`🔖 Código generado: ${codigoSeguimiento}`);
            
            // 2. Insertar registro principal de cálculo
            const calculoResult = await client.query(queries.insertarCalculoHuella, [
                codigoSeguimiento,
                datos.empresa.nombre,
                datos.empresa.nit,
                datos.empresa.sector || null,
                datos.empresa.departamento || null,
                datos.empresa.municipio || null,
                datos.empresa.direccion || null,
                datos.empresa.telefono || null,
                datos.empresa.correo || null,
                datos.empresa.personaElabora || null,
                datos.empresa.cargo || null,
                datos.añoReporte,
                datos.fechaReporte,
                datos.periodoInicio || null,
                datos.periodoFin || null,
                datos.evaluacion?.nivel || null,
                datos.evaluacion?.arbolesCompensar || null,
                datos.notas || null
            ]);
            
            const calculoId = calculoResult.rows[0].id;
            console.log(`✅ Cálculo principal creado: ${calculoId}`);
            
            // 3. Guardar combustibles sólidos
            if (datos.combustiblesSolidos && datos.combustiblesSolidos.length > 0) {
                console.log(`📦 Guardando ${datos.combustiblesSolidos.length} combustibles sólidos...`);
                for (const combustible of datos.combustiblesSolidos) {
                    await client.query(queries.insertarCombustibleSolido, [
                        calculoId,
                        combustible.tipo,
                        combustible.consumoAnual,
                        combustible.unidad || 'kg',
                        combustible.factores.poderCalorifico,
                        combustible.factores.factorCO2,
                        combustible.factores.factorCH4,
                        combustible.factores.factorN2O,
                        combustible.factores.factorSO2 || null
                    ]);
                }
            }
            
            // 4. Guardar combustibles líquidos
            if (datos.combustiblesLiquidos && datos.combustiblesLiquidos.length > 0) {
                console.log(`🚗 Guardando ${datos.combustiblesLiquidos.length} combustibles líquidos...`);
                for (const combustible of datos.combustiblesLiquidos) {
                    await client.query(queries.insertarCombustibleLiquido, [
                        calculoId,
                        combustible.tipo,
                        combustible.tipoFuente, // 'Estacionario' o 'Móvil'
                        combustible.consumoAnual,
                        combustible.factores.densidad,
                        combustible.factores.poderCalorifico,
                        combustible.factores.factorCO2,
                        combustible.factores.factorCH4,
                        combustible.factores.factorN2O,
                        combustible.factores.factorSO2 || null
                    ]);
                }
            }
            
            // 5. Guardar combustibles gaseosos
            if (datos.combustiblesGaseosos && datos.combustiblesGaseosos.length > 0) {
                console.log(`🔥 Guardando ${datos.combustiblesGaseosos.length} combustibles gaseosos...`);
                for (const combustible of datos.combustiblesGaseosos) {
                    await client.query(queries.insertarCombustibleGaseoso, [
                        calculoId,
                        combustible.tipo,
                        combustible.tipoFuente, // 'Estacionario' o 'Móvil'
                        combustible.consumoAnual,
                        combustible.unidad || 'm³',
                        combustible.factores.poderCalorifico,
                        combustible.factores.factorCO2,
                        combustible.factores.factorCH4,
                        combustible.factores.factorN2O,
                        combustible.factores.factorSO2 || null
                    ]);
                }
            }
            
            // 6. Guardar consumo de electricidad
            if (datos.electricidad && datos.electricidad.length > 0) {
                console.log(`⚡ Guardando ${datos.electricidad.length} instalaciones eléctricas...`);
                for (const instalacion of datos.electricidad) {
                    await client.query(queries.insertarConsumoElectricidad, [
                        calculoId,
                        instalacion.año || datos.añoReporte,
                        instalacion.nombreInstalacion,
                        instalacion.consumoMensual.enero || 0,
                        instalacion.consumoMensual.febrero || 0,
                        instalacion.consumoMensual.marzo || 0,
                        instalacion.consumoMensual.abril || 0,
                        instalacion.consumoMensual.mayo || 0,
                        instalacion.consumoMensual.junio || 0,
                        instalacion.consumoMensual.julio || 0,
                        instalacion.consumoMensual.agosto || 0,
                        instalacion.consumoMensual.septiembre || 0,
                        instalacion.consumoMensual.octubre || 0,
                        instalacion.consumoMensual.noviembre || 0,
                        instalacion.consumoMensual.diciembre || 0,
                        instalacion.factorEmision || 0.391 // Colombia 2024
                    ]);
                }
            }
            
            // 7. Guardar vuelos aéreos
            if (datos.vuelosAereos && datos.vuelosAereos.length > 0) {
                console.log(`✈️ Guardando ${datos.vuelosAereos.length} vuelos aéreos...`);
                for (const vuelo of datos.vuelosAereos) {
                    await client.query(queries.insertarVueloAereo, [
                        calculoId,
                        vuelo.origen.ciudad,
                        vuelo.destino.ciudad,
                        vuelo.origen.pais || 'Colombia',
                        vuelo.destino.pais || 'Colombia',
                        vuelo.tipoVuelo,
                        vuelo.clase,
                        vuelo.numeroPasajeros || 1,
                        vuelo.distanciaKm,
                        vuelo.factorEmision
                    ]);
                }
            }
            
            // 8. Guardar extintores
            if (datos.extintores && datos.extintores.length > 0) {
                console.log(`🧯 Guardando ${datos.extintores.length} recargas de extintores...`);
                for (const extintor of datos.extintores) {
                    await client.query(queries.insertarExtintor, [
                        calculoId,
                        extintor.tipoGas,
                        extintor.cantidad,
                        extintor.pcg // Potencial de Calentamiento Global
                    ]);
                }
            }
            
            // 9. Obtener totales calculados automáticamente por los triggers
            const totalesResult = await client.query(
                `SELECT emisiones_alcance_1, emisiones_alcance_2, emisiones_alcance_3, emisiones_totales
                 FROM calculos_huella_carbono WHERE id = $1`,
                [calculoId]
            );
            
            console.log('✅ Huella de carbono guardada exitosamente!');
            console.log(`📊 Emisiones totales: ${totalesResult.rows[0].emisiones_totales} Ton CO₂e`);
            
            return {
                id: calculoId,
                codigo: codigoSeguimiento,
                emisiones: totalesResult.rows[0]
            };
        });
    }
    
    /**
     * Obtiene un cálculo de huella por código de seguimiento
     * @param {string} codigo - Código formato HC-YYYY-NNNNNN
     * @returns {Promise<Object>}
     */
    async obtenerHuellaPorCodigo(codigo) {
        console.log(`🔍 Buscando huella con código: ${codigo}`);
        
        const client = await pool.connect();
        try {
            // Obtener cálculo principal
            const calculoResult = await client.query(queries.obtenerCalculoHuellaPorCodigo, [codigo]);
            
            if (calculoResult.rows.length === 0) {
                return { success: false, error: 'Cálculo no encontrado' };
            }
            
            const calculo = calculoResult.rows[0];
            
            // Obtener todos los detalles
            const [solidos, liquidos, gaseosos, electricidad, vuelos, extintores] = await Promise.all([
                client.query(queries.obtenerCombustiblesSolidos, [calculo.id]),
                client.query(queries.obtenerCombustiblesLiquidos, [calculo.id]),
                client.query(queries.obtenerCombustiblesGaseosos, [calculo.id]),
                client.query(queries.obtenerConsumoElectricidad, [calculo.id]),
                client.query(queries.obtenerVuelosAereos, [calculo.id]),
                client.query(queries.obtenerExtintores, [calculo.id])
            ]);
            
            return {
                success: true,
                data: {
                    ...calculo,
                    combustiblesSolidos: solidos.rows,
                    combustiblesLiquidos: liquidos.rows,
                    combustiblesGaseosos: gaseosos.rows,
                    electricidad: electricidad.rows,
                    vuelosAereos: vuelos.rows,
                    extintores: extintores.rows
                }
            };
            
        } finally {
            client.release();
        }
    }
    
    // ========================================================================
    // AUTOGESTIÓN
    // ========================================================================
    
    /**
     * Guarda un autodiagnóstico completo de sostenibilidad
     * @param {Object} datos - Datos completos del formulario de autogestión
     * @returns {Promise<{success: boolean, codigo: string, id: string}>}
     */
    async guardarAutogestion(datos) {
        console.log('💾 Guardando autodiagnóstico de sostenibilidad...');
        
        return await ejecutarTransaccion(async (client) => {
            
            // 1. Generar código de seguimiento único
            const codigoResult = await client.query(
                "SELECT generar_codigo_seguimiento('AG') as codigo"
            );
            const codigoSeguimiento = codigoResult.rows[0].codigo;
            console.log(`🔖 Código generado: ${codigoSeguimiento}`);
            
            // 2. Insertar registro principal
            const calculoResult = await client.query(queries.insertarCalculoAutogestion, [
                codigoSeguimiento,
                datos.empresa.nombre,
                datos.empresa.nit,
                datos.empresa.sector || null,
                datos.empresa.departamento || null,
                datos.empresa.municipio || null,
                datos.empresa.direccion || null,
                datos.empresa.telefono || null,
                datos.empresa.correo || null,
                datos.empresa.personaElabora || null,
                datos.empresa.cargo || null,
                datos.añoReporte,
                datos.fechaReporte,
                datos.resultados.porcentajeEconomico,
                datos.resultados.porcentajeAmbiental,
                datos.resultados.porcentajeEnergia,
                datos.resultados.porcentajeSeguridad,
                datos.resultados.porcentajeSocial,
                datos.resultados.porcentajeAlmacen,
                datos.resultados.nivelCumplimiento || null,
                datos.notas || null
            ]);
            
            const calculoId = calculoResult.rows[0].id;
            console.log(`✅ Autogestión creada: ${calculoId}`);
            
            // 3. Guardar todas las respuestas individuales
            if (datos.respuestas && datos.respuestas.length > 0) {
                console.log(`📝 Guardando ${datos.respuestas.length} respuestas...`);
                
                for (const respuesta of datos.respuestas) {
                    await client.query(queries.insertarRespuestaAutogestion, [
                        calculoId,
                        respuesta.seccion,
                        respuesta.bloque,
                        respuesta.preguntaId,
                        respuesta.numeroPregunta,
                        respuesta.textoPregunta,
                        respuesta.respuesta,
                        respuesta.puntaje
                    ]);
                }
            }
            
            // 4. Guardar promedios por bloque
            if (datos.promediosBloques && datos.promediosBloques.length > 0) {
                console.log(`📊 Guardando ${datos.promediosBloques.length} promedios de bloques...`);
                
                for (const promedio of datos.promediosBloques) {
                    await client.query(queries.insertarPromedioBloque, [
                        calculoId,
                        promedio.seccion,
                        promedio.bloque,
                        promedio.nombreBloque,
                        promedio.promedioBloque,
                        promedio.totalPreguntas,
                        promedio.preguntasRespondidas
                    ]);
                }
            }
            
            console.log('✅ Autogestión guardada exitosamente!');
            
            return {
                id: calculoId,
                codigo: codigoSeguimiento,
                resultados: datos.resultados
            };
        });
    }
    
    /**
     * Obtiene un autodiagnóstico por código de seguimiento
     * @param {string} codigo - Código formato AG-YYYY-NNNNNN
     * @returns {Promise<Object>}
     */
    async obtenerAutogestionPorCodigo(codigo) {
        console.log(`🔍 Buscando autogestión con código: ${codigo}`);
        
        const client = await pool.connect();
        try {
            // Obtener cálculo principal
            const calculoResult = await client.query(queries.obtenerCalculoAutogestionPorCodigo, [codigo]);
            
            if (calculoResult.rows.length === 0) {
                return { success: false, error: 'Autogestión no encontrada' };
            }
            
            const calculo = calculoResult.rows[0];
            
            // Obtener respuestas y promedios
            const [respuestas, promedios] = await Promise.all([
                client.query(queries.obtenerRespuestasAutogestion, [calculo.id]),
                client.query(queries.obtenerPromediosBloques, [calculo.id])
            ]);
            
            return {
                success: true,
                data: {
                    ...calculo,
                    respuestas: respuestas.rows,
                    promediosBloques: promedios.rows
                }
            };
            
        } finally {
            client.release();
        }
    }
    
    // ========================================================================
    // CATÁLOGOS (Factores de Emisión)
    // ========================================================================
    
    /**
     * Obtiene todos los combustibles sólidos del catálogo
     */
    async obtenerCatalogoCombustiblesSolidos() {
        const result = await pool.query(queries.obtenerCatalogoCombustiblesSolidos);
        return result.rows;
    }
    
    /**
     * Obtiene todos los combustibles líquidos del catálogo
     */
    async obtenerCatalogoCombustiblesLiquidos() {
        const result = await pool.query(queries.obtenerCatalogoCombustiblesLiquidos);
        return result.rows;
    }
    
    /**
     * Obtiene todos los combustibles gaseosos del catálogo
     */
    async obtenerCatalogoCombustiblesGaseosos() {
        const result = await pool.query(queries.obtenerCatalogoCombustiblesGaseosos);
        return result.rows;
    }
    
    /**
     * Obtiene factor de emisión de electricidad
     * @param {string} pais - País (default: Colombia)
     * @param {number} año - Año (default: año actual)
     */
    async obtenerFactorElectricidad(pais = 'Colombia', año = null) {
        const result = await pool.query(
            'SELECT obtener_factor_electricidad($1, $2) as factor',
            [pais, año]
        );
        return result.rows[0].factor;
    }
    
    // ========================================================================
    // DOCUMENTOS GENERADOS
    // ========================================================================
    
    /**
     * Registra un documento PDF generado
     * @param {Object} documento - Datos del documento
     */
    async registrarDocumentoGenerado(documento) {
        const result = await pool.query(queries.insertarDocumentoGenerado, [
            documento.calculoHuellaId || null,
            documento.calculoAutogestionId || null,
            documento.tipoDocumento,
            documento.nombreArchivo,
            documento.rutaArchivo || null,
            documento.tamañoBytes || null,
            documento.hashArchivo || null,
            documento.emailDestinatario || null
        ]);
        
        return result.rows[0];
    }
    
    // ========================================================================
    // ESTADÍSTICAS Y REPORTES
    // ========================================================================
    
    /**
     * Obtiene resumen de emisiones de una empresa por NIT
     */
    async obtenerResumenEmpresa(nit) {
        const result = await pool.query(queries.obtenerResumenPorNIT, [nit]);
        return result.rows;
    }
    
    /**
     * Obtiene estadísticas generales de la plataforma
     */
    async obtenerEstadisticasGenerales() {
        const client = await pool.connect();
        try {
            const [huella, autogestion, empresas] = await Promise.all([
                client.query('SELECT COUNT(*) as total FROM calculos_huella_carbono'),
                client.query('SELECT COUNT(*) as total FROM calculos_autogestion'),
                client.query('SELECT COUNT(DISTINCT nit) as total FROM calculos_huella_carbono')
            ]);
            
            return {
                totalCalculosHuella: parseInt(huella.rows[0].total),
                totalCalculosAutogestion: parseInt(autogestion.rows[0].total),
                totalEmpresas: parseInt(empresas.rows[0].total)
            };
        } finally {
            client.release();
        }
    }
}

// ============================================================================
// EXPORTAR INSTANCIA ÚNICA (SINGLETON)
// ============================================================================

module.exports = new DatabaseService();
