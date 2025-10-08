/**
 * OPTIMIZED SUSTAINABILITY ASSESSMENT STORAGE FUNCTION
 * Replaces the existing guardarAutogestion function
 * Stores only section summaries + JSON instead of 210 individual responses
 */
async function saveOptimizedSustainabilityAssessment(assessmentData) {
  try {
    console.log('💾 Saving optimized sustainability assessment...');
    
    // Generate tracking code
    const trackingCode = await generarCodigoSeguimiento('AG');
    
    // Extract company data
    const company = assessmentData.empresa || assessmentData.datosEmpresa || {};
    const results = assessmentData.resultados || {};
    
    // Simple query for main table with 6 section summaries
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
    
    // Create executive summary JSON (instead of 210 individual records)
    const executiveSummary = {
      version: '2.0_optimized',
      calculation_date: new Date().toISOString(),
      sections: {
        A: { name: 'Economic Management', percentage: results.porcentajeEconomico || 0 },
        B: { name: 'Environmental Management', percentage: results.porcentajeAmbiental || 0 },
        C: { name: 'Energy Management', percentage: results.porcentajeEnergia || 0 },
        D: { name: 'Safety & Health', percentage: results.porcentajeSeguridad || 0 },
        E: { name: 'Social Management', percentage: results.porcentajeSocial || 0 },
        F: { name: 'Warehouse & Logistics', percentage: results.porcentajeAlmacen || 0 }
      },
      block_averages: assessmentData.promediosBloques || [],
      detailed_responses: 'All 210 responses are stored in the PDF generated separately'
    };
    
    const params = [
      trackingCode,
      company.nombre || company.nombreEmpresa || '',
      company.nit || '',
      company.sector || '',
      company.departamento || '',
      company.municipio || '',
      company.direccion || '',
      company.telefono || '',
      company.correo || '',
      company.personaElabora || '',
      company.cargo || '',
      assessmentData.añoReporte || new Date().getFullYear(),
      assessmentData.fechaReporte || new Date().toISOString().split('T')[0],
      parseFloat(results.porcentajeEconomico) || 0,
      parseFloat(results.porcentajeAmbiental) || 0,
      parseFloat(results.porcentajeEnergia) || 0,
      parseFloat(results.porcentajeSeguridad) || 0,
      parseFloat(results.porcentajeSocial) || 0,
      parseFloat(results.porcentajeAlmacen) || 0,
      results.nivelCumplimiento || 'Under Development',
      JSON.stringify(executiveSummary)
    ];
    
    const result = await executeQuery(query, params);
    const savedAssessment = result.rows[0];
    
    console.log('✅ Optimized assessment saved:', savedAssessment.codigo_seguimiento);
    console.log('📊 Only 6 main summaries stored (not 210 individual responses)');
    
    // Register in audit
    await registrarAuditoria('AUTOGESTION', savedAssessment.codigo_seguimiento, 'CREADO');
    
    return {
      success: true,
      data: {
        id: savedAssessment.id,
        trackingCode: savedAssessment.codigo_seguimiento,
        finalPercentage: savedAssessment.porcentaje_final,
        optimized: true,
        individualResponses: 'Available in PDF generated separately'
      },
      message: 'Sustainability assessment saved in optimized format'
    };
  } catch (error) {
    console.error('❌ Error saving assessment:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error saving sustainability assessment'
    };
  }
}