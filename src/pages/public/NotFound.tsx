import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Página no encontrada - THADO Consulting</title>
        <meta name="description" content="La página que buscas no existe o ha sido movida." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          textAlign: 'center',
          backgroundColor: 'var(--color-background, #FFFFFF)'
        }}
      >
        <h1
          style={{
            fontSize: '6rem',
            fontWeight: 700,
            color: 'var(--color-primary, #2554a3)',
            marginBottom: '0.5rem',
            lineHeight: 1
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: '1.5rem',
            color: 'var(--color-text, #1F2937)',
            marginBottom: '1rem',
            fontWeight: 600
          }}
        >
          Página no encontrada
        </h2>
        <p
          style={{
            color: 'var(--color-text-secondary, #6b7280)',
            marginBottom: '2rem',
            maxWidth: '400px',
            lineHeight: 1.6
          }}
        >
          La página que buscas no existe o ha sido movida. Puedes volver al inicio o explorar nuestros servicios.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              background: 'var(--color-primary, #2554a3)',
              color: '#FFFFFF',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            Volver al inicio
          </Link>
          <Link
            to="/servicios"
            style={{
              border: '2px solid var(--color-primary, #2554a3)',
              color: 'var(--color-primary, #2554a3)',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: 'transparent'
            }}
          >
            Ver servicios
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
