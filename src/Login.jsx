import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signInWithEmail, verifyOtp } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await signInWithEmail(email)
      setStep('code')
      setStatus('idle')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await verifyOtp(email, code)
      // On success, the AuthContext session listener picks this up
      // automatically and the app moves past the login screen.
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-text mb-1">Muscle Gain Tracker</h1>

        {step === 'email' ? (
          <>
            <p className="text-text-dim text-sm mb-8">
              Sign in with your email — no password needed. You'll get a 6-digit code.
            </p>
            <form onSubmit={handleSendCode} className="space-y-3">
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
                {status === 'sending' ? 'Sending code...' : 'Send code'}
              </button>
              {status === 'error' && <p className="text-danger text-sm">{errorMsg}</p>}
            </form>
          </>
        ) : (
          <>
            <p className="text-text-dim text-sm mb-8">
              Check <span className="text-accent">{email}</span> for a 6-digit code, and enter
              it below. (On iPhone: enter it here, in this app — don't tap a link from the
              email, since that opens a separate copy of Safari that won't be signed into
              this home-screen app.)
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                autoFocus
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg bg-surface border border-border px-4 py-3 text-text text-center text-2xl tracking-[0.3em] placeholder:text-text-dim placeholder:tracking-normal focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-lg bg-accent text-black font-medium py-3 disabled:opacity-60"
              >
                {status === 'sending' ? 'Verifying...' : 'Verify & sign in'}
              </button>
              {status === 'error' && <p className="text-danger text-sm">{errorMsg}</p>}
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setStatus('idle')
                }}
                className="w-full text-text-dim text-sm py-2"
              >
                Use a different email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
