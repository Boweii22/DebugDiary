import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App'
import { getOrCreateUserId } from './lib/diaryUser'
import './index.css'

axios.interceptors.request.use((config) => {
  config.headers["X-Diary-User-Id"] = getOrCreateUserId()
  return config
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
