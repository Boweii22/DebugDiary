import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import EntryCard from '../components/EntryCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const MOODS = {
  frustrated: '😤',
  curious: '🤔',
  embarrassed: '😳',
  enlightened: '💡',
  relieved: '😮‍💨',
}

export default function Home() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/entries')
      .then(r => setEntries(r.data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '80px 32px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 80,
        alignItems: 'center',
        minHeight: 'calc(80vh - 64px)',
      }}>
        <div>
          <motion.div {...fadeUp(0.1)} style={{ marginBottom: 16 }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--amber-dim)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                display: 'inline-block', width: 24, height: 1,
                background: 'var(--amber)',
              }}/>
              AI-Powered Dev Journal
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            color: 'var(--ink)',
          }}>
            Stop fixing bugs.<br />
            <em style={{ color: 'var(--amber-dim)' }}>Start learning</em><br />
            from them.
          </motion.h1>

          <motion.p {...fadeUp(0.3)} style={{
            fontSize: '1.1rem',
            color: 'var(--muted)',
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 460,
          }}>
            Paste your broken code. Describe what went wrong. Gemini turns it into 
            a personal diary entry that reveals your patterns, your blind spots, 
            and the lesson underneath every bug.
          </motion.p>

          <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px',
              background: 'var(--ink)',
              color: 'var(--paper)',
              textDecoration: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.02em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--amber)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
            >
              Write your first entry →
            </Link>
            <Link to="/dashboard" style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 1,
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              View Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Decorative card preview */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative' }}
        >
          <div style={{
            position: 'absolute', inset: -2,
            background: 'linear-gradient(135deg, var(--amber-glow), transparent)',
            borderRadius: 'var(--radius-lg)',
            filter: 'blur(20px)',
          }}/>
          <div style={{
            background: 'var(--ink)',
            borderRadius: 'var(--radius-lg)',
            padding: 28,
            position: 'relative',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* fake diary entry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                color: 'var(--amber)', fontSize: '1.1rem'
              }}>
                The Async Blind Spot
              </span>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 'var(--radius)',
              padding: 14,
              marginBottom: 16,
              borderLeft: '2px solid var(--amber)',
            }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'rgba(245,240,232,0.5)',
                lineHeight: 1.8,
              }}>
                <span style={{ color: 'var(--amber)', opacity: 0.7 }}>// before</span><br />
                <span style={{ color: '#e06c75' }}>const</span> <span style={{ color: '#61dafb' }}>data</span> = fetch(<span style={{ color: '#98c379' }}>'/api/user'</span>)<br />
                console.log(data.name) <span style={{ color: '#e06c75' }}>// undefined 🤦</span>
              </p>
            </div>
            <p style={{
              color: 'rgba(245,240,232,0.55)',
              fontSize: '0.82rem',
              lineHeight: 1.65,
              marginBottom: 16,
            }}>
              You've hit this pattern 3 times now. Under time pressure, you revert to synchronous thinking. The fix is simple — the lesson is: <em style={{ color: 'rgba(232,160,32,0.8)' }}>slow down when chaining API calls.</em>
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['async-error', 'promise-hell'].map(t => (
                <span key={t} style={{
                  padding: '2px 8px',
                  borderRadius: 2,
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(232,160,32,0.1)',
                  color: 'rgba(232,160,32,0.7)',
                  border: '1px solid rgba(232,160,32,0.2)',
                }}>{t}</span>
              ))}
              <span style={{
                marginLeft: 'auto',
                padding: '2px 8px',
                borderRadius: 2,
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#e06c75',
                background: 'rgba(192,57,43,0.1)',
                border: '1px solid rgba(192,57,43,0.2)',
              }}>high</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>

      {/* Feature strip */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 32px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          {[
            {
              icon: '🔍',
              title: 'Root cause analysis',
              desc: "Gemini doesn't just fix — it explains the why behind every bug with clinical precision.",
            },
            {
              icon: '🧠',
              title: 'Pattern recognition',
              desc: 'Over time, your diary reveals which mistakes you keep making and why.',
            },
            {
              icon: '📈',
              title: 'Growth dashboard',
              desc: 'Visualize your bug history, your most common error types, and your learning streak.',
            },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: 'var(--paper)',
                padding: '32px 28px',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: 14 }}>{icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                marginBottom: 10,
                color: 'var(--ink)',
              }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Recent entries */}
      {entries.length > 0 && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 32,
          }}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}
            >
              Recent entries
            </motion.h2>
            <Link to="/dashboard" style={{
              color: 'var(--amber-dim)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-mono)',
            }}>
              view all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <EntryCard entry={entry} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 80px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--ink)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber)', marginBottom: 12, letterSpacing: '0.08em' }}>
              READY TO START?
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2rem',
              color: 'var(--paper)',
              lineHeight: 1.2,
            }}>
              Your next bug is also<br /><em>your next lesson.</em>
            </h2>
          </div>
          <Link
            to="/new"
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px',
              background: 'var(--amber)',
              color: 'var(--ink)',
              textDecoration: 'none',
              borderRadius: 'var(--radius)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f5b833'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--amber)'}
          >
            Write an entry →
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
