import { useCallback } from 'react'
import { api, errorMessage } from '../lib/api'
import { useToast } from '../context/ToastContext'
import { useFetch } from './useFetch'

// List + mutate helper for dashboard pages. `key` is the response property holding the list.
// Load errors render in the page; mutation results are reported with toasts so a failed
// action never blanks out the table the user is working in.
export function useResource(url, key = 'items') {
  const list = useFetch(url, { select: (body) => body[key], initial: [] })
  const toast = useToast()

  const run = useCallback(async (action, messages) => {
    try {
      await action()
      await list.reload()
      if (messages?.success) toast.success(messages.success)
      return true
    } catch (error) {
      toast.error(errorMessage(error))
      return false
    }
  }, [list, toast])

  return {
    rows: list.data,
    loading: list.loading,
    error: list.error,
    reload: list.reload,
    create: (path, body, messages) => run(() => api.post(path, body), { success: 'Created successfully.', ...messages }),
    update: (path, body, messages) => run(() => api.patch(path, body), { success: 'Changes saved.', ...messages }),
    remove: (path, messages) => run(() => api.delete(path), { success: 'Deleted successfully.', ...messages }),
  }
}
