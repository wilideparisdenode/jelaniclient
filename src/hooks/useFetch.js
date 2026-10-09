import { useCallback, useEffect, useState } from 'react'
import { api, errorMessage } from '../lib/api'

// GET helper. `select` maps the response body to the value you want to keep.
export function useFetch(url, { select = (body) => body, enabled = true, initial = null } = {}) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(Boolean(enabled && url))
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!enabled || !url) return
    setLoading(true)
    try {
      const { data: body } = await api.get(url)
      setData(select(body))
      setError('')
    } catch (requestError) {
      setError(errorMessage(requestError, 'Could not load data.'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled])

  useEffect(() => { load() }, [load])

  return { data, setData, loading, error, reload: load }
}
