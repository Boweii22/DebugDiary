import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Layout() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(245,240,232,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 32px',
      }}>
        <nav style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 64,
        }}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28,
                background: 'var(--ink)',
                borderRadius: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'var(--amber)', fontSize: 14, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>d</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
              }}>
                Debug<em>Diary</em>
              </span>
            </div>
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/new', label: 'New Entry', primary: true },
            ].map(({ to, label, primary }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  padding: primary ? '8px 18px' : '8px 14px',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  fontWeight: primary ? 600 : 500,
                  letterSpacing: '0.01em',
                  background: primary
                    ? isActive ? 'var(--amber-dim)' : 'var(--amber)'
                    : isActive ? 'var(--paper-dark)' : 'transparent',
                  color: primary ? 'var(--ink)' : isActive ? 'var(--ink)' : 'var(--muted)',
                  border: primary ? 'none' : '1px solid transparent',
                  transition: 'all 0.2s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main style={{ flex: 1, paddingTop: 64 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 32px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          DebugDiary — powered by Google Gemini · every bug is a teacher
        </p>
      </footer>
    </div>
  )
}
