import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/gerar" element={<GeneratePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
