import { useLocalStorage } from '@vueuse/core'


export function useLoProgress() {
  const visitedIds = useLocalStorage<number[]>('lo-visited-ids', [])

  
  const isVisited = (id: number) => {
    return visitedIds.value.includes(id)
  }


  const markAsVisited = (id: number) => {
    if (!isVisited(id)) {
      visitedIds.value.push(id)
    }
  }

  return {
    visitedIds,
    isVisited,
    markAsVisited
  }
}
