# Components Structure

Este directorio contiene todos los componentes de React organizados por funcionalidad.

## 📁 Estructura Organizada

```
component/
├── Aliados/              # Componente de sección de aliados
│   ├── index.js          # Barrel export
│   ├── AliadosSection.js # Componente principal
│   └── AliadosSection.css # Estilos específicos
├── Blog/                 # Componente de blog
│   ├── index.js
│   └── Blog.js
├── Calculadora/          # Componente calculadora de huella de carbono
│   ├── index.js
│   └── CalculadoraSection.js
├── Contact/              # Componente de contacto
│   ├── index.js
│   └── Contact.js
├── Contribuyentes/       # Componente de contribuyentes
│   ├── index.js          # Barrel export
│   ├── Contribuyentes.js # Componente principal
│   └── Contribuyentes.css # Estilos específicos
├── Footer/               # Componente de pie de página
├── HuellaCarbono/        # Componente principal de huella de carbono
├── Navbar/               # Componente de navegación
└── Services/             # Componente de servicios
    ├── index.js
    └── Services.js
```

## 🎯 Beneficios de esta estructura

### ✅ Organización Clara
- **Cada componente en su propia carpeta**
- **Separación de estilos CSS**
- **Barrel exports para importaciones limpias**

### ✅ Mantenibilidad
- **Fácil localización de archivos**
- **Estilos colocados junto al componente**
- **Importaciones más semánticas**

### ✅ Escalabilidad
- **Fácil agregar nuevos componentes**
- **Estructura consistente**
- **Reutilización de patrones**

## 📝 Convenciones

### Estructura de cada carpeta:
```
ComponentName/
├── index.js              # Barrel export: export { default } from './ComponentName'
├── ComponentName.js      # Componente React principal
├── ComponentName.css     # Estilos específicos (opcional)
└── ComponentName.test.js # Tests unitarios (futuro)
```

### Importaciones:
```javascript
// ❌ Antes (archivo directo):
import Contribuyentes from "../../component/Contribuyentes";

// ✅ Ahora (barrel export):
import Contribuyentes from "../../component/Contribuyentes";
// Automáticamente importa desde ./Contribuyentes/index.js
```

## 🔧 Próximos pasos de mejora

1. **Crear archivos CSS** para componentes restantes
2. **Agregar tests unitarios** (.test.js)
3. **Crear Storybook** para documentación visual
4. **Implementar TypeScript** (.tsx)
5. **Agregar PropTypes** o interfaces

## 📋 Componentes pendientes de organizar

- `BosqueVerdeImage.js` → `BosqueVerdeImage/`
- `Feature.js` → `Feature/`
- `ModuleCards.js` → `ModuleCards/`
- `Switch.js` → `Switch/`
- `withRouter.js` → `utils/` (mover a carpeta utils)