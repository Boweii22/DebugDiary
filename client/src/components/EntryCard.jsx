import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

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

export default function EntryCard({ entry }) {
  return (
    <Link to={`/entry/${entry.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 20px',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: 'var(--shadow-sm)',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.4rem' }}>
            {MOOD_EMOJI[entry.mood] || '📝'}
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: 2,
              background: `${SEVERITY_COLOR[entry.severity]}18`,
              color: SEVERITY_COLOR[entry.severity],
              border: `1px solid ${SEVERITY_COLOR[entry.severity]}33`,
            }}>
              {entry.severity}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: 2,
              background: 'var(--paper-dark)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
            }}>
              {entry.language}
            </span>
          </div>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '1.2rem',
          color: 'var(--ink)',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}>
          {entry.title}
        </h3>

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {entry.whatWentWrong}
        </p>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {(entry.tags || []).slice(0, 3).map(tag => (
            <span key={tag} style={{
              padding: '2px 8px',
              borderRadius: 2,
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              background: 'var(--amber-glow)',
              color: 'var(--amber-dim)',
              border: '1px solid rgba(232,160,32,0.25)',
            }}>{tag}</span>
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'rgba(138,126,106,0.6)',
          paddingTop: 4,
          borderTop: '1px solid var(--border)',
        }}>
          {format(new Date(entry.createdAt), 'MMM d, yyyy')}
        </div>
      </motion.div>
    </Link>
  )
}
