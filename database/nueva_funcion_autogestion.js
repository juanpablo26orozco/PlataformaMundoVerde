/**
 * NUEVA FUNCIÓN OPTIMIZADA PARA AUTOGESTIÓN
 * Reemplaza la función guardarAutogestion existente
 */
async function guardarAutogestionOptimizada(datosCalculo) {
  try {
    console.log('💾 Guardando autogestión optimizada...');
    
    // Generar código de seguimiento
    const codigoSeguimiento = await generarCodigoSeguimiento('AG');
    
    // Extraer datos de empresa
    const empresa = datosCalculo.empresa || datosCalculo.datosEmpresa || {};
    const resultados = datosCalculo.resultados || {};
    
    // Query simple para la tabla principal con los 6 resúmenes
    const query = `
      INSERT INTO calculos_autogestion (
        codigo_seguimiento,
        nombre_empresa,
        nit,
        sector,
        departamento,
        municipio,
        direccion,
        telefono,
        correo,
        persona_elabora,
        cargo,
        año_reporte,
        fecha_reporte,
        porcentaje_economico,
        porcentaje_ambiental,
        porcentaje_energia,
        porcentaje_seguridad,
        porcentaje_social,
        porcentaje_almacen,
        nivel_cumplimiento,
        resumen_ejecutivo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING id, codigo_seguimiento, fecha_creacion, porcentaje_final
    `;
    
    // Crear resumen ejecutivo JSON (en lugar de 210 registros individuales)
    const resumenEjecutivo = {
      version: '2.0_optimizada',
      fecha_calculo: new Date().toISOString(),
      secciones: {
        A: { nombre: 'Gestión Económica', porcentaje: resultados.porcentajeEconomico || 0 },
        B: { nombre: 'Gestión Ambiental', porcentaje: resultados.porcentajeAmbiental || 0 },
        C: { nombre: 'Gestión de Energía', porcentaje: resultados.porcentajeEnergia || 0 },
        D: { nombre: 'Seguridad y Salud', porcentaje: resultados.porcentajeSeguridad || 0 },
        E: { nombre: 'Gestión Social', porcentaje: resultados.porcentajeSocial || 0 },
        F: { nombre: 'Almacén y Logística', porcentaje: resultados.porcentajeAlmacen || 0 }
      },
      promedios_bloques: datosCalculo.promediosBloques || [],
      total_respuestas_pdf: 'Las 210 respuestas están en el PDF generado por separado'
    };
    
    const params = [
      codigoSeguimiento,
      empresa.nombre || empresa.nombreEmpresa || '',
      empresa.nit || '',
      empresa.sector || '',
      empresa.departamento || '',
      empresa.municipio || '',
      empresa.direccion || '',
      empresa.telefono || '',
      empresa.correo || '',
      empresa.personaElabora || '',
      empresa.cargo || '',
      datosCalculo.añoReporte || new Date().getFullYear(),
      datosCalculo.fechaReporte || new Date().toISOString().split('T')[0],
      parseFloat(resultados.porcentajeEconomico) || 0,
      parseFloat(resultados.porcentajeAmbiental) || 0,
      parseFloat(resultados.porcentajeEnergia) || 0,
      parseFloat(resultados.porcentajeSeguridad) || 0,
      parseFloat(resultados.porcentajeSocial) || 0,
      parseFloat(resultados.porcentajeAlmacen) || 0,
      resultados.nivelCumplimiento || 'En Desarrollo',
      JSON.stringify(resumenEjecutivo)
    ];
    
    const result = await executeQuery(query, params);
    const calculoGuardado = result.rows[0];
    
    console.log('✅ Autogestión optimizada guardada:', calculoGuardado.codigo_seguimiento);
    console.log('📊 Solo guardados los 6 resúmenes principales (no las 210 respuestas)');
    
    // Registrar en auditoría
    await registrarAuditoria('AUTOGESTION', calculoGuardado.codigo_seguimiento, 'CREADO');
    
    return {
      success: true,
      data: {
        id: calculoGuardado.id,
        codigo: calculoGuardado.codigo_seguimiento,
        porcentajeFinal: calculoGuardado.porcentaje_final,
        optimizado: true,
        respuestasIndividuales: 'Se pueden obtener del PDF generado por separado'
      },
      message: 'Autogestión guardada de forma optimizada'
    };
  } catch (error) {
    console.error('❌ Error guardando Autogestión:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al guardar el autodiagnóstico'
    };
  }
}