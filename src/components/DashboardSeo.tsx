import React from 'react';
import { useSeo } from '../hooks/useSeo';

interface DashboardSeoProps {
  pageName: string;
  fallbackTitle: string;
  fallbackDescription: string;
  children: React.ReactNode;
}

/**
 * 🎯 Wrapper que aplica SEO dinámico a páginas del dashboard
 * Centraliza la configuración de SEO para evitar repetir código
 */
export const DashboardSeo: React.FC<DashboardSeoProps> = ({
  pageName,
  fallbackTitle,
  fallbackDescription,
  children
}) => {
  const { SeoHelmet } = useSeo({
    pageName,
    fallbackTitle,
    fallbackDescription
  });

  return (
    <>
      {/* 🎯 SEO Dinámico automático */}
      <SeoHelmet />
      {children}
    </>
  );
};

export default DashboardSeo;