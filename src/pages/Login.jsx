import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await signInWithEmail(email)
      setStatus('sent')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text mb-1">Muscle Gain Tracker</h1>
        <p className="text-text-dim text-sm mb-8">
          Sign in with your email — no password needed. You'll get a magic link.
        </p>

        {status === 'sent' ? (
          <div className="bg-surface border border-border rounded-xl p-4 text-sm text-text">
            Check your inbox for <span className="text-accent">{email}</span> and tap the
            link to sign in. You can close this tab.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-4 py-3 text-text placeholder:text-text-dim focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-accent text-black font-medium py-3 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending link...' : 'Send magic link'}
            </button>
            {status === 'error' && (
              <p className="text-danger text-sm">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
