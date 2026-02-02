import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ModulesDataSource } from "../../services/modules.services";
import { useToast } from "@/shared/composables/use-toast";
import { QUERY_KEYS } from "@/shared/composables/query-key";

const modulesDataSource = new ModulesDataSource()

export function useDeleteModule() {
    const queryClient = useQueryClient()
    const toast = useToast()
    
    return useMutation({
        mutationFn: (id: number) => modulesDataSource.delete(id),
        onSuccess: () => {
            toast.success('Módulo eliminado exitosamente')
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el módulo'
            toast.error(errorMessage)
        },
    })
}
