import { Helmet } from 'react-helmet-async';

/**
 * 🏢 Schema.org - Datos Estructurados para Google Rich Results
 * 
 * Estos schemas permiten que Google muestre tu sitio con:
 * - Logo en resultados
 * - Información de empresa
 * - Breadcrumbs mejorados
 * - FAQs expandibles
 * - Artículos con autor y fecha
 */

// ====================================
// SCHEMA: ORGANIZACIÓN (Global)
// ====================================
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "THADO Consulting",
    "alternateName": "THADO",
    "url": "https://www.thadoconsulting.com",
    "logo": "https://www.thadoconsulting.com/FAVICON.png",
    "description": "Estudio contable especializado en servicios contables, tributarios y financieros para MYPES en Perú. Expertos en SUNAT, PDT y libros electrónicos.",
    "foundingDate": "2024",
    "sameAs": [
      "https://www.linkedin.com/company/thadoconsulting",
      "https://www.facebook.com/thadoconsulting/",
      "https://twitter.com/thadoconsulting",
      "https://www.instagram.com/thadoconsulting"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contacto@thadoconsulting.pe",
      "contactType": "customer service",
      "availableLanguage": ["Spanish"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Peru"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: WEBSITE (Para búsquedas)
// ====================================
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "THADO Consulting",
    "url": "https://www.thadoconsulting.com",
    "description": "Servicios contables, tributarios y financieros para MYPES en Perú",
    "publisher": {
      "@type": "Organization",
      "name": "THADO Consulting"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.thadoconsulting.com/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: LOCAL BUSINESS (Empresa de Software)
// ====================================
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.thadoconsulting.com/#organization",
    "name": "THADO Consulting",
    "alternateName": ["THADO", "THADO Contadores", "THADO Consultoría"],
    "image": "https://www.thadoconsulting.com/FAVICON.png",
    "url": "https://www.thadoconsulting.com",
    "email": "contacto@thadoconsulting.pe",
    "description": "Estudio contable especializado en servicios contables, tributarios y financieros para MYPES en Perú. Expertos en declaraciones SUNAT, PDT, libros electrónicos y planificación fiscal.",
    "slogan": "Tu socio contable y tributario de confianza para MYPES en Perú",
    "knowsAbout": [
      "Contabilidad para MYPES",
      "Declaraciones SUNAT",
      "Tributación Empresarial",
      "Libros Electrónicos PLE",
      "Planificación Fiscal",
      "Gestión Financiera",
      "Auditoría Contable",
      "Consultoría Empresarial"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios Contables y Tributarios",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Contabilidad para MYPES",
            "description": "Registro contable, libros electrónicos y estados financieros para micro y pequeñas empresas"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Asesoría Tributaria SUNAT",
            "description": "Declaraciones PDT, planificación fiscal y cumplimiento tributario ante SUNAT"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Consultoría Financiera",
            "description": "Análisis financiero, presupuestos y estrategia de crecimiento empresarial"
          }
        }
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima",
      "addressRegion": "Lima"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.0464,
      "longitude": -77.0428
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Perú"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Latinoamérica"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "PEN, USD",
    "paymentAccepted": "Transferencia Bancaria, PayPal, Tarjeta de Crédito",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "47",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: BREADCRUMB
// ====================================
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: ARTÍCULO DE BLOG
// ====================================
interface BlogArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string; // 🏢 Ya no se usa - siempre es Thado Consulting
  url: string;
  keywords?: string[];  // ✅ Agregado para SEO
  focusKeyphrase?: string;  // ✅ Palabra clave principal
}

export const BlogArticleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  // authorName ya no se usa - siempre es Thado Consulting
  url,
  keywords,
  focusKeyphrase
}: BlogArticleSchemaProps) => {
  // ✅ Construir keywords para Schema.org: focusKeyphrase primero, luego keywords (sin duplicados)
  const allKeywords = [...new Set([focusKeyphrase, ...(keywords || [])].filter(Boolean))];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || "https://www.thadoconsulting.com/favicon-512x512.png",
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": "Thado Consulting",
      "url": "https://www.thadoconsulting.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.thadoconsulting.com/FAVICON.png"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "THADO Consulting",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.thadoconsulting.com/favicon-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    // ✅ Keywords para Google - Muy importante para SEO
    ...(allKeywords.length > 0 && { "keywords": allKeywords.join(', ') }),
    // ✅ About: Indica de qué trata el artículo (mejora Rich Results)
    ...(focusKeyphrase && {
      "about": {
        "@type": "Thing",
        "name": focusKeyphrase
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: SERVICIO
// ====================================
interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  priceRange?: string;
}

export const ServiceSchema = ({
  name,
  description,
  url,
  image,
  priceRange = "$$"
}: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "image": image || "https://www.thadoconsulting.com/favicon-512x512.png",
    "provider": {
      "@type": "Organization",
      "name": "THADO Consulting",
      "url": "https://www.thadoconsulting.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Peru"
    },
    "priceRange": priceRange
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA: FAQ (Preguntas frecuentes)
// ====================================
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// ====================================
// SCHEMA COMBINADO PARA HOME
// ====================================
export const HomePageSchema = () => {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
    </>
  );
};
