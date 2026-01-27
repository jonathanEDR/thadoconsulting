/**
 * 📦 Category Service (Sin Cache)
 * 
 * Servicio para categorías - Direct API calls sin almacenamiento en memoria
 */

import type { Categoria } from './categoriasApi';

class CategoryService {
  /**
   * Obtener categorías - siempre hace query directa a API
   */
  async getCategories(
    fetchFn: () => Promise<Categoria[]>
  ): Promise<Categoria[]> {
    return fetchFn();
  }

  /**
   * Obtener categoría por ID - siempre hace query directa a API
   */
  async getCategory(
    categoryId: string,
    fetchFn: (id: string) => Promise<Categoria>
  ): Promise<Categoria> {
    return fetchFn(categoryId);
  }

  /**
   * Noop - sin cache
   */
  invalidateAll(): void {
    // Sin cache
  }

  /**
   * Noop - sin cache
   */
  invalidate(_key: string): void {
    // Sin cache
  }

  /**
   * Noop - sin cache
   */
  invalidateAfterCreate(): void {
    // Sin cache
  }

  /**
   * Obtener estadísticas
   */
  getStats() {
    return {
      size: 0,
      entries: [],
      totalMemory: '0 KB'
    };
  }

  /**
   * Debug
   */
  debug(): void {
    console.log('📦 [CategoryService] Sin cache - directo a API');
  }
}

// Instancia singleton
export const categoryCache = new CategoryService();

export default CategoryService;
