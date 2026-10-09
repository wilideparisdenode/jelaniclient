import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, Clock3, X } from 'lucide-react'
import { api } from '../lib/api'
import Button from '../components/common/Button'
import AuthCard from '../components/common/AuthCard'

// The browser redirect is informational only. The order status shown here is read from the
// database, which is updated exclusively by the signature-verified Stripe webhook.
export default function PaymentReturnPage({ cancelled = false }) {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  const [status, setStatus] = useState(cancelled ? 'cancelled' : 'checking')

  useEffect(() => {
    if (cancelled || !sessionId) return undefined
    let tries = 0
    let timer
    const poll = async () => {
      try {
        const { data } = await api.get(`/student/orders/session/${encodeURIComponent(sessionId)}`)
        if (data.order.status === 'confirmed') { setStatus('confirmed'); return }
        if (data.order.status === 'cancelled') { setStatus('cancelled'); return }
      } catch { /* keep polling */ }
      if (++tries < 10) timer = setTimeout(poll, 2000)
      else setStatus('processing')
    }
    poll()
    return () => clearTimeout(timer)
  }, [cancelled, sessionId])

  const view = {
    confirmed: { icon: <Check size={40} color="var(--success)" />, title: 'You are registered!', text: 'Payment received. Your course is now available in your dashboard.', cta: ['/dashboard', 'Go to my learning'] },
    cancelled: { icon: <X size={40} color="var(--danger)" />, title: 'Payment not completed', text: 'No payment was taken and your place was not booked.', cta: ['/courses', 'Back to courses'] },
    processing: { icon: <Clock3 size={40} color="var(--accent)" />, title: 'Payment is processing', text: 'We are still confirming your payment. Your dashboard will update shortly.', cta: ['/dashboard', 'Go to my learning'] },
    checking: { icon: <Clock3 size={40} color="var(--accent)" />, title: 'Confirming your payment…', text: 'This usually takes a few seconds.', cta: null },
  }[status]

  return (
    <AuthCard title={view.title} subtitle={view.text}>
      {view.icon}
      {view.cta && <Button to={view.cta[0]} variant="dark" block>{view.cta[1]}</Button>}
    </AuthCard>
  )
}
