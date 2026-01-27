# 💬 Floating Chat Widget - Documentación

## 📋 Resumen

Implementación completa de un **chatbot flotante** para asistencia con IA integrada (SCUTI AI). El widget está disponible globalmente en todas las páginas del dashboard y puede agregarse fácilmente a páginas públicas.

---

## 🎯 Características

✅ **Botón flotante animado** con efectos hover y pulse  
✅ **Badge de notificaciones** para mensajes no leídos  
✅ **Ventana de chat compacta y responsive** (normal/expandida)  
✅ **Reutiliza componentes existentes** (ChatInput, MessageBubble)  
✅ **Conectado al backend** (GerenteGeneral → ServicesAgent)  
✅ **Gestión de sesiones persistentes** por usuario  
✅ **Mensajes de bienvenida** con sugerencias rápidas  
✅ **Animaciones suaves** de entrada/salida  
✅ **Dark mode compatible**  
✅ **Estados de loading** y manejo de errores  

---

## 📁 Estructura de Archivos

```
frontend/src/
├── components/
│   ├── floating-chat/
│   │   ├── FloatingChatButton.tsx      # Botón flotante animado
│   │   ├── FloatingChatWindow.tsx      # Ventana del chat
│   │   ├── FloatingChatWidget.tsx      # Contenedor principal
│   │   └── index.ts                    # Exports
│   ├── SmartDashboardLayout.tsx        # Layout con widget integrado
│   └── PublicLayout.tsx                # Layout público con widget
└── hooks/
    └── useFloatingChat.ts              # Hook de lógica del chat
```

---

## 🚀 Uso

### En Dashboard (Ya integrado)

El widget ya está integrado automáticamente en `SmartDashboardLayout`, por lo que aparece en todas las páginas del dashboard:

```tsx
// No se requiere ninguna acción adicional
// El widget aparece automáticamente en todas las páginas del dashboard
```

### En Páginas Públicas (Opcional)

Puedes usar el `PublicLayout` para agregar el widget en páginas públicas:

```tsx
import PublicLayout from '../components/PublicLayout';

function MiPaginaPublica() {
  return (
    <PublicLayout>
      {/* Tu contenido aquí */}
    </PublicLayout>
  );
}
```

### Uso Manual (Componente Individual)

Si necesitas agregar el widget manualmente en cualquier componente:

```tsx
import { FloatingChatWidget } from '../components/floating-chat';

function MiComponente() {
  return (
    <div>
      {/* Tu contenido */}
      <FloatingChatWidget />
    </div>
  );
}
```

---

## 🎨 Personalización

### Posición del Botón

El botón está fijado en `bottom-6 right-6`. Para cambiar la posición, edita:

```tsx
// FloatingChatButton.tsx - línea 27
className="fixed bottom-6 right-6 z-50"
```

### Tamaño de la Ventana

Tamaños por defecto:
- **Normal:** `w-96 h-[600px]`
- **Expandida:** `w-[90vw] h-[85vh] max-w-4xl`

Editar en `FloatingChatWindow.tsx`:

```tsx
// FloatingChatWindow.tsx - línea 68
${isExpanded 
  ? 'bottom-6 right-6 w-[90vw] h-[85vh] max-w-4xl' 
  : 'bottom-24 right-6 w-96 h-[600px]'
}
```

### Colores del Tema

El widget usa gradientes de azul-púrpura. Para cambiar:

```tsx
// FloatingChatButton.tsx
bg-gradient-to-br from-blue-600 to-purple-600
hover:from-blue-700 hover:to-purple-700
```

### Mensajes de Bienvenida

Editar los botones de sugerencias rápidas en `FloatingChatWindow.tsx`:

```tsx
// FloatingChatWindow.tsx - línea 122
<button onClick={() => onSendMessage('¿Qué servicios ofrecen?')}>
  💼 ¿Qué servicios ofrecen?
</button>
```

---

## 🔧 Configuración Backend

### Agente de Ventas

El widget está configurado para usar el **ServicesAgent** como agente de ventas. Este agente maneja:

- ✅ Consultas sobre servicios
- ✅ Cotizaciones y precios
- ✅ Propuestas comerciales
- ✅ Análisis de servicios
- ✅ Chat conversacional sobre servicios

**Keywords detectadas automáticamente por GerenteGeneral:**
```javascript
// backend/agents/core/GerenteGeneral.js
keywords: [
  'servicio', 'precio', 'paquete', 'oferta',
  'pricing', 'cotización', 'propuesta', 'portafolio',
  'consultoría', 'desarrollo', 'diseño', 'marketing digital'
]
```

### Flujo de Comunicación

```
Usuario → FloatingChatWidget
         ↓
      useFloatingChat (hook)
         ↓
      scutiAIService.sendMessage()
         ↓
      Backend: GerenteGeneral
         ↓
      ServicesAgent (si detecta keywords de servicios)
         ↓
      Respuesta → FloatingChatWidget
```

---

## 🧪 Testing

### Pruebas Sugeridas

1. **Funcionalidad Básica:**
   ```
   - Click en botón flotante
   - Verificar apertura/cierre de ventana
   - Enviar mensaje de prueba
   - Verificar respuesta del backend
   ```

2. **Notificaciones:**
   ```
   - Cerrar ventana
   - Enviar mensaje desde otro lugar
   - Verificar badge de notificaciones
   - Abrir ventana y verificar que badge desaparece
   ```

3. **Responsive:**
   ```
   - Probar en diferentes tamaños de pantalla
   - Verificar expansión de ventana
   - Verificar scroll de mensajes
   ```

4. **Estados:**
   ```
   - Verificar loading al enviar mensaje
   - Verificar mensajes de error
   - Verificar mensajes de bienvenida
   ```

---

## 📝 Mantenimiento

### Actualizar Mensajes de Bienvenida

Editar en `FloatingChatWindow.tsx` (línea 111-136):

```tsx
<h3>¡Hola! Soy SCUTI AI 👋</h3>
<p>Tu asistente virtual para servicios, consultas y cotizaciones.</p>
```

### Agregar Nuevas Sugerencias Rápidas

```tsx
<button
  onClick={() => onSendMessage('Tu mensaje aquí')}
  className="w-full px-4 py-2 bg-white..."
>
  🎯 Tu texto aquí
</button>
```

### Modificar Límite de Mensajes

Por defecto, los mensajes se mantienen en memoria durante la sesión. Para cambiar:

```tsx
// useFloatingChat.ts
const MAX_MESSAGES = 50; // Agregar límite

setMessages(prev => {
  const updated = [...prev, newMessage];
  return updated.slice(-MAX_MESSAGES); // Mantener solo últimos N mensajes
});
```

---

## 🐛 Troubleshooting

### El widget no aparece

1. Verificar que estés en una página que usa `SmartDashboardLayout`
2. Verificar que el usuario esté autenticado (Clerk)
3. Revisar consola del navegador para errores

### Los mensajes no se envían

1. Verificar conexión con el backend
2. Verificar que `scutiAIService` esté funcionando
3. Revisar logs del backend para errores del GerenteGeneral

### El badge de notificaciones no funciona

1. Verificar que `isOpen` esté en `false` cuando llega el mensaje
2. Verificar que el mensaje sea del asistente (`role === 'assistant'`)

### Errores de TypeScript

1. Verificar que todos los tipos estén importados correctamente
2. Ejecutar: `npm run type-check` en el frontend

---

## 🎯 Próximos Pasos (Opcional)

### Mejoras Futuras

- [ ] **Persistencia de mensajes** en base de datos
- [ ] **Notificaciones push** cuando hay mensajes nuevos
- [ ] **Soporte para archivos adjuntos**
- [ ] **Historial de conversaciones** en el perfil del usuario
- [ ] **Modo offline** con cola de mensajes
- [ ] **Typing indicator** más sofisticado
- [ ] **Reacciones a mensajes**
- [ ] **Búsqueda en conversaciones**
- [ ] **Exportar conversaciones** (PDF, TXT)
- [ ] **Audio messages** (voz a texto)

---

## 👥 Soporte

Para problemas o preguntas sobre el chatbot flotante:

1. Revisar esta documentación
2. Revisar logs del backend (`backend/logs/`)
3. Consultar con el equipo de desarrollo

---

## 📄 Licencia

Este componente es parte del proyecto SCUTI Company y sigue la misma licencia del proyecto principal.

---

**Última actualización:** Noviembre 19, 2025  
**Versión:** 1.0.0  
**Autor:** SCUTI Development Team
