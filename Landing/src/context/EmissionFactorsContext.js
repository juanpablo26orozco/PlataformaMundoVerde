import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Context to manage emission factors globally
 * Loads factors ONCE on app startup
 * Stores in localStorage to avoid repeated DB queries (24h cache)
 */

const EmissionFactorsContext = createContext();

/**
 * Custom hook to use the emission factors context
 * @throws {Error} If used outside EmissionFactorsProvider
 */
export const useEmissionFactors = () => {
  const context = useContext(EmissionFactorsContext);
  if (!context) {
    throw new Error('useEmissionFactors must be used within EmissionFactorsProvider');
  }
  return context;
};

export const EmissionFactorsProvider = ({ children }) => {
  const [factors, setFactors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load factors on component mount
  useEffect(() => {
    loadFactors();
  }, []);

  /**
   * Loads emission factors from localStorage cache or API
   * @param {boolean} forceReload - Force reload from API ignoring cache
   */
  const loadFactors = async (forceReload = false) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check localStorage cache if not forcing reload
      if (!forceReload) {
        const cachedFactors = localStorage.getItem('emission_factors');
        const cacheDate = localStorage.getItem('emission_factors_date');
        
        if (cachedFactors && cacheDate) {
          const cachedTime = new Date(cacheDate);
          const now = new Date();
          const hoursPassed = (now - cachedTime) / (1000 * 60 * 60);
          
          // Use cache if less than 24 hours old
          if (hoursPassed < 24) {
            const parsedFactors = JSON.parse(cachedFactors);
            
            // ⚠️ VALIDACIÓN: Verificar que el cache tiene todos los datos necesarios
            if (!parsedFactors.vuelos || parsedFactors.vuelos.length === 0) {
              console.log('⚠️ Cache incomplete (missing vuelos data), reloading...');
              localStorage.removeItem('emission_factors');
              localStorage.removeItem('emission_factors_date');
              // Continuar con la carga desde API (no return)
            } else {
              console.log('✅ Emission factors loaded from localStorage (valid cache)');
              setFactors(parsedFactors);
              setLastUpdate(cachedTime);
              setLoading(false);
              return;
            }
          } else {
            console.log('⚠️ Cache expired (>24h), reloading...');
          }
        }
      }

      // 2. If no cache or forced reload, fetch from API
      console.log('📡 Fetching emission factors from API...');
      const response = await fetch('/api/factores/todos');
      
      if (!response.ok) {
        throw new Error('Failed to load emission factors');
      }

      const data = await response.json();
      
      if (data.success && data.factores) {
        // 3. Save to state
        setFactors(data.factores);
        
        // 4. Save to localStorage
        localStorage.setItem('emission_factors', JSON.stringify(data.factores));
        localStorage.setItem('emission_factors_date', new Date().toISOString());
        
        setLastUpdate(new Date());
        console.log('✅ Emission factors loaded and cached:', Object.keys(data.factores).length, 'categories');
      } else {
        throw new Error('Invalid response format');
      }

    } catch (err) {
      console.error('❌ Error loading emission factors:', err);
      setError(err.message);
      
      // If error, try using expired cache as fallback
      const cachedFactors = localStorage.getItem('emission_factors');
      if (cachedFactors) {
        console.log('⚠️ Using expired cache due to network error');
        setFactors(JSON.parse(cachedFactors));
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gets a specific emission factor by type and name
   * @param {string} type - 'solid', 'liquid', 'gas', 'electricity', 'flights'
   * @param {string} name - Exact fuel name (e.g., 'Gasolina para motor')
   * @returns {Object|null} - Found factor or null
   */
  const getFactorByName = (type, name) => {
    if (!factors) return null;
    
    const typeMap = {
      'solid': 'combustibles_solidos',
      'liquid': 'combustibles_liquidos',
      'gas': 'combustibles_gaseosos',
      'electricity': 'electricidad',
      'flights': 'vuelos'
    };
    
    const list = factors[typeMap[type]];
    if (!list || !Array.isArray(list)) return null;
    
    // Search by name (case-insensitive)
    return list.find(f => 
      f.nombre?.toLowerCase() === name.toLowerCase() ||
      f.pais?.toLowerCase() === name.toLowerCase() ||
      f.clase?.toLowerCase() === name.toLowerCase()
    );
  };
  
  /**
   * Gets electricity emission factor by country and year
   * @param {string} country - Country name (e.g., 'Colombia')
   * @param {number} year - Year (e.g., 2024)
   * @returns {Object|null} - Found factor or null
   */
  const getElectricityFactor = (country = 'Colombia', year = new Date().getFullYear()) => {
    if (!factors || !factors.electricidad) return null;
    
    return factors.electricidad.find(f => 
      f.pais?.toLowerCase() === country.toLowerCase() && f.año === year
    );
  };

  /**
   * Gets flight emission factor by cabin class
   * @param {string} cabinClass - 'Economica' or 'Ejecutiva'
   * @returns {Object|null} - Found factor or null
   */
  const getFlightFactor = (cabinClass = 'Economica') => {
    if (!factors || !factors.vuelos) {
      return null;
    }
    
    // Normalize class name (remove accents, lowercase)
    const normalizedClass = cabinClass
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents
    
    return factors.vuelos.find(f => {
      const normalizedFactorClass = f.clase
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedFactorClass === normalizedClass;
    });
  };

  /**
   * Clears cache and reloads factors from API
   */
  const reloadFactors = () => {
    localStorage.removeItem('emission_factors');
    localStorage.removeItem('emission_factors_date');
    loadFactors(true);
  };

  const value = {
    factors,
    loading,
    error,
    lastUpdate,
    getFactorByName,
    getElectricityFactor,
    getFlightFactor,
    reloadFactors,
    loadFactors
  };

  return (
    <EmissionFactorsContext.Provider value={value}>
      {children}
    </EmissionFactorsContext.Provider>
  );
};

export default EmissionFactorsContext;
