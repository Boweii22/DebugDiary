import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import axios from 'axios'
import EntryCard from '../components/EntryCard'

const SEVERITY_COLOR = { low: '#27ae60', medium: '#e8a020', high: '#c0392b' }

export default function Dashboard() {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/entries'),
      axios.get('/api/stats'),
    ]).then(([e, s]) => {
      setEntries(e.data)
      setStats(s.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const allTags = [...new Set(entries.flatMap(e => e.tags || []))]

  const filtered = filter === 'all'
    ? entries
    : entries.filter(e => (e.tags || []).includes(filter))

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

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px 80px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 48 }}
      >
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
          Your Dashboard
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          letterSpacing: '-0.02em',
        }}>
          The mirror doesn't lie.
        </h1>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 48,
          }}
        >
          {[
            {
              label: 'Total entries',
              value: stats.total,
              sub: 'bugs documented',
              icon: '📓',
            },
            {
              label: 'Top weakness',
              value: stats.topWeakness || '—',
              sub: stats.topWeakness ? `${stats.tagCounts[stats.topWeakness]}x hit` : 'no data yet',
              icon: '🎯',
              mono: true,
            },
            {
              label: 'Current streak',
              value: `${stats.streak}d`,
              sub: 'consecutive days',
              icon: '🔥',
            },
            {
              label: 'Unique error types',
              value: Object.keys(stats.tagCounts || {}).length,
              sub: 'categories found',
              icon: '🗂️',
            },
          ].map(({ label, value, sub, icon, mono }, i) => (
            <div key={i} style={{
              background: 'var(--paper)',
              padding: '28px 24px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 12 }}>{icon}</div>
              <div style={{
                fontFamily: mono ? 'var(--font-mono)' : 'var(--font-serif)',
                fontStyle: mono ? 'normal' : 'italic',
                fontSize: mono ? '1.1rem' : '2rem',
                color: 'var(--ink)',
                marginBottom: 4,
                letterSpacing: '-0.01em',
              }}>
                {value}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.02em' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(138,126,106,0.6)', marginTop: 2 }}>
                {sub}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Tag breakdown bar */}
      {stats && Object.keys(stats.tagCounts || {}).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginBottom: 48,
            padding: '24px',
            background: 'var(--paper-dark)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.1rem',
            marginBottom: 20,
          }}>
            Error type breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(stats.tagCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([tag, count]) => {
                const pct = Math.round((count / stats.total) * 100)
                return (
                  <div key={tag}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink)' }}>{tag}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {count}x · {pct}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', background: 'var(--amber)', borderRadius: 2 }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </motion.div>
      )}

      {/* Entries list */}
      <div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12,
        }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
            All entries
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--muted)',
              fontStyle: 'normal',
              marginLeft: 10,
            }}>
              ({filtered.length})
            </span>
          </h2>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              style={filterBtnStyle(filter === 'all')}
            >all</button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                style={filterBtnStyle(filter === tag)}
              >{tag}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '80px 32px',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--muted)', marginBottom: 16 }}>
              {entries.length === 0 ? 'No entries yet.' : 'No entries with this tag.'}
            </p>
            {entries.length === 0 && (
              <Link to="/new" style={{
                display: 'inline-flex',
                padding: '12px 24px',
                background: 'var(--ink)',
                color: 'var(--paper)',
                textDecoration: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}>
                Write your first entry →
              </Link>
            )}
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <EntryCard entry={entry} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const filterBtnStyle = (active) => ({
  padding: '5px 12px',
  borderRadius: 'var(--radius)',
  border: active ? '1.5px solid var(--amber)' : '1.5px solid var(--border)',
  background: active ? 'var(--amber-glow)' : 'transparent',
  color: active ? 'var(--amber-dim)' : 'var(--muted)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  cursor: 'pointer',
  transition: 'all 0.15s',
})
