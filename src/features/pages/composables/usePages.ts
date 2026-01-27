import { ref, readonly } from 'vue';
import { pagesService } from '../services/pages.service';
import { IPage } from '../interfaces/IPage';
import { ICreatePage } from '../interfaces/ICreatePage';
import { IUpdatePage } from '../interfaces/IUpdatePage';
import { IReorderPagePayload } from '../interfaces/IReorderPage';

// Simple in-memory cache for pages by moduleId
const pagesCache = new Map<number, IPage[]>();

export function usePages() {
  const pages = ref<IPage[]>([]);
  const isLoadingPages = ref<boolean>(false);
  const pagesError = ref<unknown | null>(null);

  // --- Queries ---

  /**
   * Fetches pages for a given module ID.
   * Basic in-memory caching is implemented.
   * @param moduleId The ID of the module.
   */
  async function fetchPages(moduleId: number, force = false): Promise<void> {
    if (!force && pagesCache.has(moduleId)) {
      pages.value = pagesCache.get(moduleId)!;
      return;
    }

    isLoadingPages.value = true;
    pagesError.value = null;
    try {
      const response = await pagesService.getPages(moduleId);
      if (response.data) {
        pages.value = response.data;
        pagesCache.set(moduleId, response.data); // Cache the result
      }
    } catch (err) {
      pagesError.value = err;
      console.error('Error fetching pages:', err);
    } finally {
      isLoadingPages.value = false;
    }
  }

  // --- Mutations ---

  const isCreatingPage = ref<boolean>(false);
  const createPageError = ref<unknown | null>(null);

  async function createPage(payload: ICreatePage): Promise<IPage | null> {
    isCreatingPage.value = true;
    createPageError.value = null;
    try {
      const response = await pagesService.createPage(payload);
      if (response.data) {
        // Invalidate cache for this moduleId and refetch to update the list
        pagesCache.delete(payload.moduleId);
        await fetchPages(payload.moduleId, true); 
        return response.data;
      }
      return null;
    } catch (err) {
      createPageError.value = err;
      console.error('Error creating page:', err);
      return null;
    } finally {
      isCreatingPage.value = false;
    }
  }

  const isUpdatingPage = ref<boolean>(false);
  const updatePageError = ref<unknown | null>(null);

  async function updatePage(id: number, payload: IUpdatePage): Promise<IPage | null> {
    isUpdatingPage.value = true;
    updatePageError.value = null;
    try {
      const response = await pagesService.updatePage(id, payload);
      if (response.data) {
        // Invalidate cache for the specific moduleId
        pagesCache.delete(response.data.moduleId);
        await fetchPages(response.data.moduleId, true); // Re-fetch to update the list
        return response.data;
      }
      return null;
    } catch (err) {
      updatePageError.value = err;
      console.error('Error updating page:', err);
      return null;
    } finally {
      isUpdatingPage.value = false;
    }
  }

  const isReorderingPages = ref<boolean>(false);
  const reorderPagesError = ref<unknown | null>(null);

  async function reorderPages(moduleId: number, payload: IReorderPagePayload[]): Promise<boolean> {
    isReorderingPages.value = true;
    reorderPagesError.value = null;
    try {
      await pagesService.reorderPages(payload);
      // Invalidate cache for the specific moduleId and refetch
      pagesCache.delete(moduleId);
      await fetchPages(moduleId, true);
      return true;
    } catch (err) {
      reorderPagesError.value = err;
      console.error('Error reordering pages:', err);
      return false;
    } finally {
      isReorderingPages.value = false;
    }
  }


  return {
    // Query states and functions
    pages: readonly(pages),
    isLoadingPages: readonly(isLoadingPages),
    pagesError: readonly(pagesError),
    fetchPages,

    // Mutation states and functions
    createPage,
    isCreatingPage: readonly(isCreatingPage),
    createPageError: readonly(createPageError),

    updatePage,
    isUpdatingPage: readonly(isUpdatingPage),
    updatePageError: readonly(updatePageError),

    reorderPages,
    isReorderingPages: readonly(isReorderingPages),
    reorderPagesError: readonly(reorderPagesError),
  };
}
