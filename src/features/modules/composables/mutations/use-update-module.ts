import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { UpdateModule } from "../../types/modules.types";
import { ModulesDataSource } from "../../services/modules.service";
import { useToast } from "@/shared/composables/use-toast";
import { QUERY_KEYS } from "@/shared/composables/query-key";

const modulesDataSource = new ModulesDataSource()

export function useUpdateModule() {
    const queryClient = useQueryClient()
    const toast = useToast()
    
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateModule }) => 
            modulesDataSource.update(id, payload),
        onSuccess: () => {
            toast.success('Módulo actualizado exitosamente')
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES() })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AVAILABLE_MODULES() })
        },
        onError: (error: unknown) => {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el módulo'
            toast.error(errorMessage)
        },
    })
}
