// ============================================================================
// CONFIGURACIÓN DE CONEXIÓN A POSTGRESQL
// ============================================================================
// Descripción: Configuración del pool de conexiones a PostgreSQL
// ============================================================================

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// ============================================================================
// CONFIGURACIÓN DEL POOL
// ============================================================================

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mundoverde_db',
    
    // Configuración del pool
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    
    // Timeouts
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    
    // SSL (deshabilitado para desarrollo local)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ============================================================================
// EVENTOS DEL POOL
// ============================================================================

pool.on('connect', (client) => {
    console.log('✅ Nueva conexión establecida con PostgreSQL');
});

pool.on('error', (err, client) => {
    console.error('❌ Error inesperado en el pool de conexiones:', err);
});

pool.on('remove', (client) => {
    console.log('🔌 Cliente removido del pool de conexiones');
});

// ============================================================================
// FUNCIÓN: Verificar conexión
// ============================================================================

async function verificarConexion() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as hora_actual, current_database() as base_datos, version() as version_postgres');
        
        console.log('\n🎉 ¡CONEXIÓN EXITOSA A POSTGRESQL!');
        console.log('================================================');
        console.log(`📅 Hora del servidor: ${result.rows[0].hora_actual}`);
        console.log(`🗄️  Base de datos: ${result.rows[0].base_datos}`);
        console.log(`🐘 Versión: ${result.rows[0].version_postgres.split(',')[0]}`);
        console.log('================================================\n');
        
        client.release();
        return true;
    } catch (error) {
        console.error('\n❌ ERROR AL CONECTAR CON POSTGRESQL:');
        console.error('================================================');
        console.error(`Mensaje: ${error.message}`);
        console.error(`Host: ${process.env.DB_HOST || 'localhost'}`);
        console.error(`Puerto: ${process.env.DB_PORT || '5432'}`);
        console.error(`Base de datos: ${process.env.DB_NAME || 'mundoverde_db'}`);
        console.error(`Usuario: ${process.env.DB_USER || 'postgres'}`);
        console.error('================================================');
        console.error('\n⚠️  SOLUCIONES POSIBLES:');
        console.error('1. Verifica que PostgreSQL esté instalado y corriendo');
        console.error('2. Verifica las credenciales en el archivo .env');
        console.error('3. Verifica que la base de datos "mundoverde_db" exista');
        console.error('4. Ejecuta: psql -U postgres -c "CREATE DATABASE mundoverde_db;"\n');
        return false;
    }
}

// ============================================================================
// FUNCIÓN: Ejecutar query con manejo de errores
// ============================================================================

async function ejecutarQuery(sql, params = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(sql, params);
        return { success: true, data: result.rows, rowCount: result.rowCount };
    } catch (error) {
        console.error('❌ Error ejecutando query:', error.message);
        console.error('SQL:', sql);
        console.error('Parámetros:', params);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

// ============================================================================
// FUNCIÓN: Ejecutar transacción
// ============================================================================

async function ejecutarTransaccion(callback) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const resultado = await callback(client);
        await client.query('COMMIT');
        return { success: true, data: resultado };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error en transacción:', error.message);
        return { success: false, error: error.message };
    } finally {
        client.release();
    }
}

// ============================================================================
// EXPORTAR
// ============================================================================

module.exports = {
    pool,
    verificarConexion,
    ejecutarQuery,
    ejecutarTransaccion
};
