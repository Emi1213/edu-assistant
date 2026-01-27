import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ModulesDataSource } from '../services/modules.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { IUpdateModule, Module } from '../types/modules.types'

interface UpdateModuleArgs {
  id: number
  data: IUpdateModule
}

export function useUpdateModule() {
  const queryClient = useQueryClient()
  const modulesDataSource = new ModulesDataSource()

  const { mutate: updateModule, isLoading, isError, isSuccess, error, data } = useMutation<
    Module | null,
    Error,
    UpdateModuleArgs
  >(
    ({ id, data: updatedModule }) => modulesDataSource.update(id, updatedModule),
    {
      onSuccess: (updatedModule) => {
        // Invalidate relevant queries to refetch data
        queryClient.invalidateQueries([QUERY_KEYS.MODULES.GET_ALL])
        queryClient.invalidateQueries([QUERY_KEYS.MODULES.GET_AVAILABLE])
        // Invalidate specific module query if it exists
        if (updatedModule?.id) {
          queryClient.invalidateQueries([QUERY_KEYS.MODULES.GET_BY_ID(updatedModule.id)])
        }
      },
    },
  )

  return {
    updateModule,
    isLoadingUpdateModule: isLoading,
    isErrorUpdateModule: isError,
    isSuccessUpdateModule: isSuccess,
    updateModuleError: error,
    updatedModuleData: data,
  }
}
