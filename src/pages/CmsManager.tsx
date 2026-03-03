import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import CmsManager from '../components/cms/CmsManager';
import DashboardSeo from '../components/DashboardSeo';

const CmsManagerPage: React.FC = () => {
  return (
    <SignedIn>
      <DashboardSeo
        pageName="cms"
        fallbackTitle="CMS Manager - THADO Consulting"
        fallbackDescription="Gestor de contenido, SEO y temas para tu página web."
      >
          <CmsManager />
      </DashboardSeo>
    </SignedIn>
  );
};

export default CmsManagerPage;
