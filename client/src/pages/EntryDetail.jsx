import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MOOD_EMOJI = {
  frustrated: '😤',
  curious: '🤔',
  embarrassed: '😳',
  enlightened: '💡',
  relieved: '😮‍💨',
}

const SEVERITY_COLOR = {
  low: '#27ae60',
  medium: '#e8a020',
  high: '#c0392b',
}

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOriginal, setShowOriginal] = useState(false)

  useEffect(() => {
    axios.get('/api/entries')
      .then(r => {
        const found = r.data.find(e => e.id === id)
        if (!found) navigate('/dashboard')
        else setEntry(found)
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this entry?')) return
    await axios.delete(`/api/entries/${id}`)
    toast.success('Entry deleted.')
    navigate('/dashboard')
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{
        width: 32, height: 32,
        border: '2px solid var(--paper-dark)',
        borderTopColor: 'var(--amber)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )

  if (!entry) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 32px 80px' }}>
      {/* Back */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 40 }}
      >
        <Link to="/dashboard" style={{
          color: 'var(--muted)',
          textDecoration: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'color 0.2s',
        }}>
          ← back to diary
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 48 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            letterSpacing: '0.05em',
          }}>
            {format(new Date(entry.createdAt), 'MMMM d, yyyy · HH:mm')}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: 2,
            background: `${SEVERITY_COLOR[entry.severity]}18`,
            color: SEVERITY_COLOR[entry.severity],
            border: `1px solid ${SEVERITY_COLOR[entry.severity]}33`,
          }}>
            {entry.severity}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: 2,
            background: 'var(--paper-dark)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
          }}>
            {entry.language}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <span style={{ fontSize: '2.5rem', lineHeight: 1, marginTop: 4 }}>
            {MOOD_EMOJI[entry.mood] || '📝'}
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--ink)',
          }}>
            {entry.title}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
          {(entry.tags || []).map(tag => (
            <span key={tag} className="tag amber">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Original description */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ ...sectionStyle, marginBottom: 28 }}
      >
        <h2 style={sectionHeading}>What you described</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic' }}>
          "{entry.description}"
        </p>
      </motion.section>

      {/* What went wrong */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ ...sectionStyle, marginBottom: 28 }}
      >
        <h2 style={sectionHeading}>What went wrong</h2>
        <p style={{ color: 'var(--ink)', fontSize: '0.95rem', lineHeight: 1.75 }}>
          {entry.whatWentWrong}
        </p>
      </motion.section>

      {/* Code comparison */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
          <h2 style={{ ...sectionHeading, marginBottom: 0 }}>The fix</h2>
          <button
            onClick={() => setShowOriginal(v => !v)}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'transparent',
              color: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {showOriginal ? 'show fix' : 'show original'}
          </button>
        </div>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            background: '#1a1814',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: showOriginal ? '#c0392b' : '#27ae60', transition: 'background 0.3s' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,240,232,0.4)' }}>
              {showOriginal ? 'original (broken)' : 'fixed'}
            </span>
          </div>
          <SyntaxHighlighter
            language={entry.language === 'react' ? 'jsx' : entry.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '0.85rem',
              background: '#1a1814',
              padding: '20px 16px',
            }}
          >
            {showOriginal ? entry.code : entry.fix}
          </SyntaxHighlighter>
        </div>
      </motion.section>

      {/* Deeper lesson */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ ...sectionStyle, marginBottom: 28, borderLeft: '3px solid var(--amber)', paddingLeft: 24 }}
      >
        <h2 style={{ ...sectionHeading, color: 'var(--amber-dim)' }}>The deeper lesson</h2>
        <p style={{ color: 'var(--ink)', fontSize: '1rem', lineHeight: 1.8 }}>
          {entry.deeperLesson}
        </p>
      </motion.section>

      {/* Pattern warning */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          marginBottom: 40,
          background: 'var(--ink)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          display: 'flex', gap: 16, alignItems: 'flex-start',
        }}
      >
        <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: 2 }}>⚡</span>
        <div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--amber)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Remember this
          </p>
          <p style={{
            color: 'var(--paper)',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.15rem',
            lineHeight: 1.5,
          }}>
            "{entry.patternWarning}"
          </p>
        </div>
      </motion.section>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link to="/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 24px',
          background: 'var(--amber)',
          color: 'var(--ink)',
          textDecoration: 'none',
          borderRadius: 'var(--radius)',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'background 0.2s',
        }}>
          Log another bug →
        </Link>

        <button
          onClick={handleDelete}
          style={{
            padding: '12px 20px',
            background: 'transparent',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          Delete entry
        </button>
      </motion.div>
    </div>
  )
}

const sectionStyle = {
  padding: '24px',
  background: 'var(--paper-dark)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border)',
}

const sectionHeading = {
  fontFamily: 'var(--font-serif)',
  fontSize: '1.1rem',
  marginBottom: 12,
  color: 'var(--ink)',
  fontWeight: 400,
}
