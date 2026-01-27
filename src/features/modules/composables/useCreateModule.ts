import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ModulesDataSource } from '../services/modules.services'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import type { ICreateModule } from '../types/modules.types'
import type { Module } from '../types/modules.types'

export function useCreateModule() {
  const queryClient = useQueryClient()
  const modulesDataSource = new ModulesDataSource()

  const { mutate: createModule, isLoading, isError, isSuccess, error, data } = useMutation<
    Module | null,
    Error,
    ICreateModule
  >(
    (newModule: ICreateModule) => modulesDataSource.create(newModule),
    {
      onSuccess: () => {
        // Invalidate relevant queries to refetch data
        queryClient.invalidateQueries([QUERY_KEYS.MODULES.GET_ALL])
        queryClient.invalidateQueries([QUERY_KEYS.MODULES.GET_AVAILABLE])
      },
    },
  )

  return {
    createModule,
    isLoadingCreateModule: isLoading,
    isErrorCreateModule: isError,
    isSuccessCreateModule: isSuccess,
    createModuleError: error,
    createdModuleData: data,
  }
}
