/**
 * 📋 SCHEMAS DE VALIDACIÓN PARA SERVICIOS
 * Validaciones con Zod para formularios de servicios y paquetes
 */

import { z } from 'zod';

// ============================================
// SCHEMAS BASE
// ============================================

/**
 * Schema para duración del servicio
 */
export const duracionSchema = z.object({
  valor: z.number().min(1, 'El valor debe ser mayor a 0'),
  unidad: z.enum(['horas', 'días', 'semanas', 'meses', 'años']),
}).optional();

/**
 * Schema para crear/actualizar servicio
 */
export const servicioSchema = z.object({
  // Información básica (requerida)
  titulo: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .trim(),
  
  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .trim(),
  
  descripcionCorta: z.string()
    .max(200, 'La descripción corta no puede exceder 200 caracteres')
    .trim()
    .optional(),

  // Categoría y estado
  categoria: z.enum([
    'desarrollo',
    'diseño',
    'marketing',
    'consultoría',
    'mantenimiento',
    'otro'
  ], {
    message: 'Debes seleccionar una categoría válida',
  }),

  estado: z.enum([
    'activo',
    'desarrollo',
    'pausado',
    'descontinuado',
    'agotado'
  ]),

  // Precio
  tipoPrecio: z.enum([
    'fijo',
    'rango',
    'paquetes',
    'personalizado',
    'suscripcion'
  ]),

  moneda: z.enum(['USD', 'MXN', 'EUR']),

  precio: z.number()
    .min(0, 'El precio no puede ser negativo')
    .optional(),

  precioMin: z.number()
    .min(0, 'El precio mínimo no puede ser negativo')
    .optional(),

  precioMax: z.number()
    .min(0, 'El precio máximo no puede ser negativo')
    .optional(),

  // Duración
  duracion: duracionSchema,

  // Visual
  icono: z.string()
    .min(1, 'El icono es requerido')
    .max(10, 'El icono no puede exceder 10 caracteres')
    .default('🚀'),

  iconoType: z.enum(['emoji', 'url', 'icon-name']).default('emoji'),

  colorIcono: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido (formato: #RRGGBB)')
    .default('#8B5CF6'),

  colorFondo: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido (formato: #RRGGBB)')
    .default('#EEF2FF'),

  // Características y etiquetas
  caracteristicas: z.array(z.string()).default([]),
  
  tecnologias: z.array(z.string()).optional(),
  
  etiquetas: z.array(z.string()).default([]),

  // Opciones
  destacado: z.boolean().default(false),
  
  activo: z.boolean().default(true),
  
  visibleEnWeb: z.boolean().default(true),
  
  requiereContacto: z.boolean().optional(),

  // SEO (opcional)
  metaTitle: z.string()
    .max(60, 'El meta título no puede exceder 60 caracteres')
    .optional(),

  metaDescription: z.string()
    .max(160, 'La meta descripción no puede exceder 160 caracteres')
    .optional(),

  // Otros campos opcionales
  slug: z.string().optional(),
  orden: z.number().optional(),
  departamento: z.string().optional(),
  imagenPrincipal: z.string().optional(),
  imagenes: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // Validación: Si tipoPrecio es 'fijo', precio debe estar presente
    if (data.tipoPrecio === 'fijo' && !data.precio) {
      return false;
    }
    return true;
  },
  {
    message: 'El precio es requerido cuando el tipo de precio es "fijo"',
    path: ['precio'],
  }
).refine(
  (data) => {
    // Validación: Si tipoPrecio es 'rango' o 'paquetes', precioMin y precioMax deben estar presentes
    if ((data.tipoPrecio === 'rango' || data.tipoPrecio === 'paquetes')) {
      if (!data.precioMin || !data.precioMax) {
        return false;
      }
      // Validar que precioMin < precioMax
      if (data.precioMin >= data.precioMax) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Para tipo de precio "rango" o "paquetes", debes especificar precio mínimo y máximo (min < max)',
    path: ['precioMin'],
  }
);

// ============================================
// SCHEMA PARA PAQUETES
// ============================================

/**
 * Schema para crear/actualizar paquete de servicio
 */
export const paqueteSchema = z.object({
  // Información básica
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  descripcion: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .trim(),

  // Precio
  precio: z.number()
    .min(0, 'El precio no puede ser negativo'),

  precioOriginal: z.number()
    .min(0, 'El precio original no puede ser negativo')
    .optional(),

  moneda: z.enum(['USD', 'MXN', 'EUR']).default('USD'),

  // Duración y características
  duracion: duracionSchema,

  caracteristicas: z.array(z.string())
    .min(1, 'Debes agregar al menos una característica'),

  // Opciones
  destacado: z.boolean().default(false),
  
  popular: z.boolean().default(false),
  
  activo: z.boolean().default(true),

  // Visual
  colorFondo: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido (formato: #RRGGBB)')
    .optional(),

  icono: z.string().optional(),

  // Metadata
  orden: z.number().optional(),
  etiquetas: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // Validación: Si precioOriginal existe, debe ser mayor que precio
    if (data.precioOriginal && data.precioOriginal <= data.precio) {
      return false;
    }
    return true;
  },
  {
    message: 'El precio original debe ser mayor al precio actual',
    path: ['precioOriginal'],
  }
);

// ============================================
// TIPOS INFERIDOS
// ============================================

export type ServicioFormData = z.infer<typeof servicioSchema>;
export type PaqueteFormData = z.infer<typeof paqueteSchema>;

// ============================================
// SCHEMAS PARA FILTROS
// ============================================

/**
 * Schema para filtros de búsqueda
 */
export const filtrosSchema = z.object({
  search: z.string().optional(),
  categoria: z.enum([
    'desarrollo',
    'diseño',
    'marketing',
    'consultoría',
    'mantenimiento',
    'otro'
  ]).optional(),
  estado: z.enum([
    'activo',
    'desarrollo',
    'pausado',
    'descontinuado',
    'agotado'
  ]).optional(),
  precioMin: z.number().min(0).optional(),
  precioMax: z.number().min(0).optional(),
  destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
  visibleEnWeb: z.boolean().optional(),
});

export type FiltrosFormData = z.infer<typeof filtrosSchema>;
