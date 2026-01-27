import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/composables/query-key'
import { EnrollmentsDataSource } from '../../services/enrollment.service'
import type {
  CreateEnrollmentPayload,
  BulkEnrollStudentsPayload,
  UpdateEnrollmentPayload,
  Enrollment,
} from '../types/enrollments.types'

const enrollmentsDataSource = new EnrollmentsDataSource()

export function useSelfEnrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEnrollmentPayload) =>
      enrollmentsDataSource.selfEnroll(payload),
    onSuccess: (data) => {
      if (data && data.moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

export function useBulkEnrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BulkEnrollStudentsPayload) =>
      enrollmentsDataSource.bulkEnrollStudents(payload),
    onSuccess: (data) => {
      if (data && data.length > 0 && data[0].moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data[0].moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

export function useUpdateEnrollmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEnrollmentPayload }) =>
      enrollmentsDataSource.updateEnrollment(id, payload),
    onSuccess: (data) => {
      if (data && data.moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

export function useRemoveEnrollmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => enrollmentsDataSource.removeEnrollment(id),
    onSuccess: (data) => {
      if (data && data.moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}

export function useSelfUnenrollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (moduleId: number) => enrollmentsDataSource.selfUnenroll(moduleId),
    onSuccess: (data) => {
      if (data && data.moduleId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MODULE_ENROLLMENTS(data.moduleId),
        })
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ENROLLMENTS() })
    },
  })
}
