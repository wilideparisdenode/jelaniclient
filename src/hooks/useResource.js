import { useCallback, useState } from 'react'
import { api, errorMessage } from '../lib/api'
import { useFetch } from './useFetch'

// List + mutate helper for dashboard pages. `key` is the response property holding the list.
export function useResource(url, key = 'items') {
  const list = useFetch(url, { select: (body) => body[key], initial: [] })
  const [actionError, setActionError] = useState('')

  const run = useCallback(async (action) => {
    setActionError('')
    try {
      await action()
      await list.reload()
      return true
    } catch (error) {
      setActionError(errorMessage(error))
      return false
    }
  }, [list])

  return {
    rows: list.data,
    loading: list.loading,
    error: list.error || actionError,
    reload: list.reload,
    create: (path, body) => run(() => api.post(path, body)),
    update: (path, body) => run(() => api.patch(path, body)),
    remove: (path) => run(() => api.delete(path)),
  }
}
