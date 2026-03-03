import React from 'react';
import DashboardSeo from '../../components/DashboardSeo';
import ProfilePage from '../../components/profile/ProfilePage';

const Profile: React.FC = () => {
  return (
      <DashboardSeo
        pageName="profile"
        fallbackTitle="Mi Perfil - THADO Consulting"
        fallbackDescription="Gestiona tu información personal y configuraciones de privacidad"
      >
        {/* ProfilePage ya incluye su propio header y layout */}
        <ProfilePage />
      </DashboardSeo>
  );
};

export default Profile;