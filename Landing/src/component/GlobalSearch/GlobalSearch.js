import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIndex from "../../data/searchIndex";
import FeatherIcon from "feather-icons-react";
import "./GlobalSearch.css";

function getIcon(type) {
  switch (type) {
    case "página": return "globe";
    case "sección": return "layers";
    case "descarga": return "download";
    case "documento": return "file-text";
    case "concepto": return "book-open";
    default: return "search";
  }
}

const GlobalSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filtered = searchIndex.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(value.toLowerCase()))
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }

  const navigate = useNavigate();
  function handleSelect(item) {
    setQuery("");
    setShowResults(false);
    if (onSelect) onSelect(item);
    // Navegación SPA con estado
    if (item.action) {
      if (item.action.download) {
        window.open(item.action.download, "_blank");
      } else if (item.action.route) {
        navigate(item.action.route, {
          state: item.action.sectionId ? { sectionId: item.action.sectionId } : undefined
        });
      }
    }
  }

  return (
    <div className="global-search-container">
      <div className="global-search-input-wrapper">
        <FeatherIcon icon="search" size={18} className="global-search-icon" />
        <input
          type="text"
          className="global-search-input"
          placeholder="Buscar en toda la plataforma..."
          value={query}
          onChange={handleChange}
          onFocus={() => setShowResults(query.length > 1 && results.length > 0)}
        />
      </div>
      {showResults && results.length > 0 && (
        <ul className="global-search-results">
          {results.map((item, idx) => (
            <li key={idx} className="global-search-result-item" onClick={() => handleSelect(item)}>
              <FeatherIcon icon={getIcon(item.type)} size={18} className="global-search-result-icon" />
              <div className="global-search-result-content">
                <span className="global-search-result-title">{item.title}</span>
                <span className="global-search-result-type">{item.type}</span>
                <span className="global-search-result-desc">{item.description}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GlobalSearch;
