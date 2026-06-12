import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'

// Pages will be implemented next
const HomePage = React.lazy(() => import('./pages/HomePage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const SkillsPage = React.lazy(() => import('./pages/SkillsPage'))
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'))
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'))
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))


export default function App() {
  return (
    <React.Suspense fallback={<div className="app-loading" />}> 
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </React.Suspense>
  )
}

