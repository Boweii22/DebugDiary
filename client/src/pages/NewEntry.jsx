import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'react', 'node',
  'css', 'html', 'sql', 'go', 'rust', 'java', 'c++', 'other'
]

const LOADING_PHRASES = [
  'Reading the crime scene…',
  'Consulting the Gemini oracle…',
  'Diagnosing your chaos…',
  'Finding the lesson beneath the bug…',
  'Writing your diary entry…',
]

export default function NewEntry() {
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [loadingPhrase, setLoadingPhrase] = useState(0)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!code.trim() || !description.trim()) {
      toast.error('Paste your code and describe the bug first.')
      return
    }

    setLoading(true)
    const interval = setInterval(() => {
      setLoadingPhrase(p => (p + 1) % LOADING_PHRASES.length)
    }, 1800)

    try {
      const { data } = await axios.post('/api/entries', { code, description, language })
      clearInterval(interval)
      toast.success('Diary entry created!')
      navigate(`/entry/${data.id}`)
    } catch (err) {
      clearInterval(interval)
      const msg = err.response?.data?.error || err.message || 'Something went wrong.'
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 32px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--amber-dim)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--amber)' }}/>
            New Entry
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}>
            What broke today?
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 560 }}>
            Paste the buggy code, describe what went wrong in plain English, 
            and Gemini will write a diary entry that turns this mistake into a lesson.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 28 }}>
          {/* Language selector */}
          <div>
            <label style={labelStyle}>Language / Context</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius)',
                    border: language === lang ? '1.5px solid var(--amber)' : '1.5px solid var(--border)',
                    background: language === lang ? 'var(--amber-glow)' : 'transparent',
                    color: language === lang ? 'var(--amber-dim)' : 'var(--muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: language === lang ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              Describe the bug
              <span style={{ color: 'var(--muted)', fontWeight: 400, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginLeft: 8 }}>
                in plain English — what did you expect vs what happened?
              </span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. I expected the user data to log to the console but got undefined. I was fetching from an API and forgot to await the promise..."
              style={{
                ...textareaStyle,
                minHeight: 100,
              }}
            />
          </div>

          {/* Code */}
          <div>
            <label style={labelStyle}>
              Paste the buggy code
              <span style={{ color: 'var(--muted)', fontWeight: 400, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginLeft: 8 }}>
                the broken version — Gemini will figure out the fix
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 12, left: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--amber)',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
                zIndex: 1,
              }}>
                {language}
              </div>
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={`// paste your ${language} code here...`}
                style={{
                  ...textareaStyle,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  minHeight: 260,
                  background: 'var(--ink)',
                  color: 'rgba(245,240,232,0.85)',
                  paddingTop: 36,
                  lineHeight: 1.7,
                  caretColor: 'var(--amber)',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div style={{ paddingTop: 8 }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 28px',
                    background: 'var(--ink)',
                    borderRadius: 'var(--radius)',
                    width: 'fit-content',
                  }}
                >
                  <div style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(232,160,32,0.3)',
                    borderTopColor: 'var(--amber)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    flexShrink: 0,
                  }} />
                  <motion.span
                    key={loadingPhrase}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      color: 'var(--paper)',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '0.95rem',
                    }}
                  >
                    {LOADING_PHRASES[loadingPhrase]}
                  </motion.span>
                </motion.div>
              ) : (
                <motion.button
                  key="submit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={!code.trim() || !description.trim()}
                  style={{
                    padding: '16px 36px',
                    background: code.trim() && description.trim() ? 'var(--ink)' : 'var(--paper-dark)',
                    color: code.trim() && description.trim() ? 'var(--paper)' : 'var(--muted)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    cursor: code.trim() && description.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { if (code.trim() && description.trim()) e.currentTarget.style.background = 'var(--amber)' }}
                  onMouseLeave={e => { if (code.trim() && description.trim()) e.currentTarget.style.background = 'var(--ink)' }}
                >
                  Analyse & write entry →
                </motion.button>
              )}
            </AnimatePresence>
            <p style={{
              marginTop: 12,
              color: 'var(--muted)', fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
            }}>
              powered by Gemini 1.5 Flash · takes ~5 seconds
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--ink)',
  marginBottom: 10,
  letterSpacing: '0.01em',
}

const textareaStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'var(--paper-dark)',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--ink)',
  fontSize: '0.9rem',
  resize: 'vertical',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  lineHeight: 1.6,
}
