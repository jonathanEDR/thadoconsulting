/**
 * 🏢 Constantes de Marca Thado Consulting
 * Datos corporativos para usar en lugar de autores individuales
 * 
 * IMPORTANTE: Este archivo centraliza toda la información de marca
 * que se muestra en el blog como "autor" de los posts.
 */

export const BRAND_AUTHOR = {
  // Información básica
  name: 'Thado Consulting',
  displayName: 'Thado Consulting',
  firstName: 'Thado',
  lastName: 'Consulting',
  
  // Visual - Logo/Avatar
  logo: '/FAVICON.png',
  avatar: '/FAVICON.png',
  profileImage: '/FAVICON.png',
  
  // Descripción y rol
  role: 'Consultoría Empresarial',
  bio: 'Thado Consulting es tu aliado estratégico en transformación digital y crecimiento empresarial. Expertos en planeamiento tributario, desarrollo de software y soluciones tecnológicas innovadoras para impulsar tu negocio.',
  
  // Contacto
  website: 'https://www.thadoconsulting.com',
  email: 'contacto@thadoconsulting.com',
  
  // Ubicación
  location: 'Perú',
  
  // Redes sociales
  social: {
    linkedin: 'https://www.linkedin.com/company/thadoconsulting',
    facebook: 'https://www.facebook.com/thadoconsulting',
    instagram: 'https://www.instagram.com/thadoconsulting',
    twitter: 'https://twitter.com/thadoconsulting',
    tiktok: ''
  },
  
  // Expertise/Especialidades
  expertise: [
    'Planeamiento Tributario',
    'Transformación Digital',
    'Desarrollo de Software',
    'Inteligencia Artificial',
    'Consultoría Empresarial'
  ],
  
  // Estructura compatible con blogProfile (para AuthorCard)
  blogProfile: {
    displayName: 'Thado Consulting',
    bio: 'Thado Consulting es tu aliado estratégico en transformación digital y crecimiento empresarial. Expertos en planeamiento tributario, desarrollo de software y soluciones tecnológicas innovadoras.',
    avatar: '/FAVICON.png',
    isPublicProfile: false, // No redirigir a perfil de usuario
    website: 'https://www.thadoconsulting.com',
    location: 'Perú',
    expertise: [
      'Planeamiento Tributario',
      'Transformación Digital',
      'Desarrollo de Software',
      'Inteligencia Artificial',
      'Consultoría Empresarial'
    ],
    social: {
      linkedin: 'https://www.linkedin.com/company/thadoconsulting',
      facebook: 'https://www.facebook.com/thadoconsulting',
      instagram: 'https://www.instagram.com/thadoconsulting',
      twitter: 'https://twitter.com/thadoconsulting',
      tiktok: ''
    }
  }
};

/**
 * Helper para obtener datos del autor de marca
 * Reemplaza cualquier autor con datos corporativos
 */
export function getBrandAuthor() {
  return { ...BRAND_AUTHOR };
}

/**
 * Helper para obtener nombre de marca
 */
export function getBrandName(): string {
  return BRAND_AUTHOR.displayName;
}

/**
 * Helper para obtener logo de marca
 */
export function getBrandLogo(): string {
  return BRAND_AUTHOR.logo;
}

/**
 * Helper para obtener bio de marca
 */
export function getBrandBio(): string {
  return BRAND_AUTHOR.bio;
}

export default BRAND_AUTHOR;
