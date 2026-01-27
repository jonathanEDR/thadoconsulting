/**
 * 🧪 TEST: Componente de Perfil Simplificado
 * Para debugging de problemas de edición
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { getMyProfile, updateMyProfile } from '../../services/profileService';

const ProfileEditorTest: React.FC = () => {
  const { getToken } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      console.log('🔍 TEST: Cargando perfil...');
      const token = await getToken();
      if (!token) {
        setMessage('No se pudo obtener el token de autenticación');
        setLoading(false);
        return;
      }
      
      const profile = await getMyProfile(token);
      
      console.log('📦 TEST: Perfil recibido:', profile);
      
      if (profile?.blogProfile) {
        const newData = {
          displayName: String(profile.blogProfile.displayName || ''),
          bio: String(profile.blogProfile.bio || ''),
          location: String(profile.blogProfile.location || ''),
          website: String(profile.blogProfile.website || '')
        };
        
        console.log('📝 TEST: Estableciendo formData:', newData);
        setFormData(newData);
      }
    } catch (error: any) {
      console.error('❌ TEST: Error:', error);
      setMessage('Error al cargar perfil: ' + (error?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`✏️ TEST: Campo ${name} = ${value}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      console.log('💾 TEST: Guardando:', formData);
      const token = await getToken();
      if (!token) {
        setMessage('❌ Error: No se pudo obtener el token');
        return;
      }
      
      await updateMyProfile(formData, token);
      setMessage('✅ Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('❌ TEST: Error al guardar:', error);
      setMessage('❌ Error: ' + (error?.message || 'Error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg shadow">
        <p>⏳ Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧪 TEST: Editor de Perfil</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre para mostrar
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu nombre"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.displayName}" (longitud: {formData.displayName.length})
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Biografía
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cuéntanos sobre ti"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.bio}" (longitud: {formData.bio.length})
          </p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu ciudad"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.location}" (longitud: {formData.location.length})
          </p>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Sitio Web
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor actual: "{formData.website}" (longitud: {formData.website.length})
          </p>
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium mb-2">🔍 Debug Info:</p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar Perfil'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>💡 Instrucciones de prueba:</strong>
        </p>
        <ol className="text-sm text-yellow-700 mt-2 space-y-1 list-decimal list-inside">
          <li>Escribe en los campos y observa si los valores cambian</li>
          <li>Revisa los valores actuales debajo de cada campo</li>
          <li>Verifica el Debug Info para ver el estado completo</li>
          <li>Abre la consola del navegador (F12) para ver los logs</li>
          <li>Si los campos NO se editan, hay un problema de estado React</li>
        </ol>
      </div>
    </div>
  );
};

export default ProfileEditorTest;
