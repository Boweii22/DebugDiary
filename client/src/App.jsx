import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import NewEntry from './pages/NewEntry'
import Dashboard from './pages/Dashboard'
import EntryDetail from './pages/EntryDetail'

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0e0d0b',
            color: '#f5f0e8',
            fontFamily: 'Syne, sans-serif',
            fontSize: '0.875rem',
            border: '1px solid rgba(232,160,32,0.3)',
            borderRadius: '4px',
          },
          success: {
            iconTheme: { primary: '#e8a020', secondary: '#0e0d0b' },
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entry/:id" element={<EntryDetail />} />
        </Route>
      </Routes>
    </>
  )
}
