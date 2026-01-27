import { ref, readonly } from 'vue';
import { modulesService } from '../services/modules.service';
import { IModule } from '../types/IModule';
import { ICreateModule } from '../types/ICreateModule';
import { IUpdateModule } from '../types/IUpdateModule';

// Simple in-memory cache for modules
const modulesListCache = new Map<string, IModule[]>(); // Key can be based on teacherId or a generic identifier
const moduleByIdCache = new Map<number, IModule>();

export function useModules() {
  const modules = ref<IModule[]>([]);
  const module = ref<IModule | null>(null);
  const isLoadingModules = ref<boolean>(false);
  const modulesError = ref<unknown | null>(null);

  // --- Queries ---

  /**
   * Fetches a list of modules, optionally filtered by teacher ID.
   * Basic in-memory caching is implemented.
   * @param teacherId Optional. The ID of the teacher to filter modules.
   * @param force Optional. If true, forces a re-fetch bypassing the cache.
   */
  async function fetchModules(teacherId?: number, force = false): Promise<void> {
    const cacheKey = teacherId ? `teacher-${teacherId}` : 'all';
    if (!force && modulesListCache.has(cacheKey)) {
      modules.value = modulesListCache.get(cacheKey)!;
      return;
    }

    isLoadingModules.value = true;
    modulesError.value = null;
    try {
      const response = await modulesService.getModules(teacherId);
      if (response.data) {
        modules.value = response.data;
        modulesListCache.set(cacheKey, response.data); // Cache the result
      }
    } catch (err) {
      modulesError.value = err;
      console.error('Error fetching modules:', err);
    } finally {
      isLoadingModules.value = false;
    }
  }

  /**
   * Fetches a single module by its ID.
   * Basic in-memory caching is implemented.
   * @param id The ID of the module to fetch.
   * @param force Optional. If true, forces a re-fetch bypassing the cache.
   */
  async function fetchModuleById(id: number, force = false): Promise<void> {
    if (!force && moduleByIdCache.has(id)) {
      module.value = moduleByIdCache.get(id)!;
      return;
    }

    isLoadingModules.value = true; // Reusing loading state for simplicity
    modulesError.value = null; // Reusing error state for simplicity
    try {
      const response = await modulesService.getModuleById(id);
      if (response.data) {
        module.value = response.data;
        moduleByIdCache.set(id, response.data); // Cache the result
      }
    } catch (err) {
      modulesError.value = err;
      console.error(`Error fetching module with ID ${id}:`, err);
    } finally {
      isLoadingModules.value = false;
    }
  }


  // --- Mutations ---

  const isCreatingModule = ref<boolean>(false);
  const createModuleError = ref<unknown | null>(null);

  async function createModule(payload: ICreateModule): Promise<IModule | null> {
    isCreatingModule.value = true;
    createModuleError.value = null;
    try {
      const response = await modulesService.createModule(payload);
      if (response.data) {
        // Invalidate all modules list cache as a new module affects it
        modulesListCache.clear();
        // Invalidate single module cache if a similar module was fetched
        moduleByIdCache.clear(); // Clear all single module cache for simplicity
        return response.data;
      }
      return null;
    } catch (err) {
      createModuleError.value = err;
      console.error('Error creating module:', err);
      return null;
    } finally {
      isCreatingModule.value = false;
    }
  }

  const isUpdatingModule = ref<boolean>(false);
  const updateModuleError = ref<unknown | null>(null);

  async function updateModule(id: number, payload: IUpdateModule): Promise<IModule | null> {
    isUpdatingModule.value = true;
    updateModuleError.value = null;
    try {
      const response = await modulesService.updateModule(id, payload);
      if (response.data) {
        // Invalidate relevant caches after update
        modulesListCache.clear(); // A list might change
        moduleByIdCache.delete(id); // Specific module cache
        return response.data;
      }
      return null;
    } catch (err) {
      updateModuleError.value = err;
      console.error('Error updating module:', err);
      return null;
    } finally {
      isUpdatingModule.value = false;
    }
  }


  return {
    // Query states and functions
    modules: readonly(modules),
    module: readonly(module),
    isLoadingModules: readonly(isLoadingModules),
    modulesError: readonly(modulesError),
    fetchModules,
    fetchModuleById,

    // Mutation states and functions
    createModule,
    isCreatingModule: readonly(isCreatingModule),
    createModuleError: readonly(createModuleError),

    updateModule,
    isUpdatingModule: readonly(isUpdatingModule),
    updateModuleError: readonly(updateModuleError),
  };
}
