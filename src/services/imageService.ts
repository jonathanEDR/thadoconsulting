// Auth helper
let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getTokenFunction = getter;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (getTokenFunction) {
    try {
      const token = await getTokenFunction();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
  }

  return headers;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tipos TypeScript
export interface ImageData {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  mimetype: string;
  size: number;
  width?: number;
  height?: number;
  category: 'hero' | 'logo' | 'service' | 'gallery' | 'icon' | 'banner' | 'avatar' | 'thumbnail' | 'blog' | 'other';
  tags: string[];
  title?: string;
  description?: string;
  alt?: string;
  uploadedBy: string;
  usedIn: Array<{
    model: string;
    documentId: string;
    field: string;
    addedAt: Date;
  }>;
  isOrphan: boolean;
  uploadedAt: Date;
  updatedAt: Date;
  sizeFormatted?: string;
  dimensions?: string;
  isInUse?: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ListImagesResponse {
  success: boolean;
  images: ImageData[];
  pagination: PaginationInfo;
}

export interface ImageStatsResponse {
  success: boolean;
  data: {
    total: number;
    totalSize: number;
    totalSizeFormatted: string;
    orphans: number;
    byCategory: Array<{ _id: string; count: number }>;
    byMimetype: Array<{ _id: string; count: number }>;
  };
}

export interface UploadImageOptions {
  file: File;
  category?: string;
  title?: string;
  description?: string;
  alt?: string;
  tags?: string[];
}

export interface UpdateImageMetadata {
  title?: string;
  description?: string;
  alt?: string;
  category?: string;
  tags?: string[];
}

export interface ListImagesOptions {
  category?: string;
  isOrphan?: boolean;
  uploadedBy?: string;
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

/**
 * Subir una nueva imagen
 */
export const uploadImage = async (options: UploadImageOptions): Promise<ImageData> => {
  const formData = new FormData();
  formData.append('image', options.file);
  
  if (options.category) formData.append('category', options.category);
  if (options.title) formData.append('title', options.title);
  if (options.description) formData.append('description', options.description);
  if (options.alt) formData.append('alt', options.alt);
  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  const headers = await getAuthHeaders();
  const headerObj = headers as Record<string, string>;
  delete headerObj['Content-Type']; // Dejar que el navegador establezca el boundary

  // Log de debug en desarrollo
  if (import.meta.env.DEV) {
    console.log('📤 [ImageService] Iniciando upload:', {
      fileName: options.file.name,
      fileSize: `${(options.file.size / 1024 / 1024).toFixed(2)}MB`,
      category: options.category,
      apiUrl: `${API_URL}/upload/image`,
      hasAuth: !!headerObj['Authorization']
    });
  }

  const response = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: headerObj,
    body: formData
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      
      console.error('🔍 [ImageService] Upload Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: `${API_URL}/upload/image`,
        fileName: options.file.name,
        fileSize: options.file.size,
        requestHeaders: Object.keys(headerObj)
      });
    } catch (parseError: any) {
      console.error('🔍 [ImageService] Upload Error (failed to parse response):', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_URL}/upload/image`,
        parseError: parseError?.message || String(parseError)
      });
    }
    
    // Crear mensaje de error más específico según el status
    if (response.status === 401) {
      errorMessage = 'No tienes permisos para subir imágenes. Verifica tu sesión.';
    } else if (response.status === 403) {
      errorMessage = 'Acceso denegado. Tu rol no permite subir archivos.';
    } else if (response.status === 413) {
      errorMessage = 'El archivo es demasiado grande. Máximo 5MB permitido.';
    } else if (response.status === 415) {
      errorMessage = 'Tipo de archivo no soportado. Solo se permiten imágenes JPG, PNG, GIF, WEBP.';
    } else if (response.status === 503) {
      errorMessage = 'Servicio de almacenamiento temporalmente no disponible. Intenta más tarde.';
    } else if (response.status === 504) {
      errorMessage = 'Tiempo de espera agotado. El archivo puede ser muy grande o la conexión lenta.';
    } else if (response.status >= 500) {
      errorMessage = 'Error del servidor. Contacta al administrador si persiste.';
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  // Log de éxito en desarrollo
  if (import.meta.env.DEV) {
    console.log('✅ [ImageService] Upload exitoso:', {
      imageId: data.data._id,
      url: data.data.url,
      fileName: data.data.originalName,
      size: `${(data.data.size / 1024 / 1024).toFixed(2)}MB`
    });
  }
  
  return data.data;
};

/**
 * Listar imágenes con filtros y paginación
 */
export const listImages = async (options: ListImagesOptions = {}): Promise<ListImagesResponse> => {
  const params = new URLSearchParams();
  
  if (options.category) params.append('category', options.category);
  if (options.isOrphan !== undefined) params.append('isOrphan', String(options.isOrphan));
  if (options.uploadedBy) params.append('uploadedBy', options.uploadedBy);
  if (options.tags) params.append('tags', options.tags);
  if (options.search) params.append('search', options.search);
  if (options.page) params.append('page', String(options.page));
  if (options.limit) params.append('limit', String(options.limit));
  if (options.sortBy) params.append('sortBy', options.sortBy);

  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images?${params.toString()}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Obtener una imagen por ID
 */
export const getImageById = async (id: string): Promise<ImageData> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/${id}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

/**
 * Actualizar metadatos de una imagen
 */
export const updateImageMetadata = async (
  id: string,
  metadata: UpdateImageMetadata
): Promise<ImageData> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al actualizar' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

/**
 * Eliminar una imagen
 */
export const deleteImage = async (id: string, force: boolean = false): Promise<void> => {
  const headers = await getAuthHeaders();
  const url = force 
    ? `${API_URL}/upload/images/${id}?force=true`
    : `${API_URL}/upload/images/${id}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al eliminar' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
};

/**
 * Buscar imágenes
 */
export const searchImages = async (query: string, limit: number = 10): Promise<ImageData[]> => {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams({ q: query, limit: String(limit) });

  const response = await fetch(`${API_URL}/upload/images/search?${params.toString()}`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

/**
 * Obtener estadísticas de imágenes
 */
export const getImageStatistics = async (): Promise<ImageStatsResponse['data']> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/stats`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

/**
 * Obtener imágenes huérfanas
 */
export const getOrphanImages = async (): Promise<{
  count: number;
  totalSize: number;
  totalSizeFormatted: string;
  data: ImageData[];
}> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/orphans`, {
    headers
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

/**
 * Limpiar imágenes huérfanas
 */
export const cleanupOrphanImages = async (dryRun: boolean = false): Promise<{
  message: string;
  deleted?: number;
  count?: number;
  totalSize?: number;
  totalSizeFormatted?: string;
}> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/cleanup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ dryRun })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al limpiar' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Agregar referencia de uso a una imagen
 */
export const addImageReference = async (
  imageId: string,
  model: string,
  documentId: string,
  field: string
): Promise<ImageData> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/${imageId}/reference`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, documentId, field })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

/**
 * Eliminar referencia de uso de una imagen
 */
export const removeImageReference = async (
  imageId: string,
  model: string,
  documentId: string,
  field: string
): Promise<ImageData> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/upload/images/${imageId}/reference`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ model, documentId, field })
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

export default {
  uploadImage,
  listImages,
  getImageById,
  updateImageMetadata,
  deleteImage,
  searchImages,
  getImageStatistics,
  getOrphanImages,
  cleanupOrphanImages,
  addImageReference,
  removeImageReference
};
