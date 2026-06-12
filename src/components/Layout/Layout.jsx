import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import styles from './layout.module.css'

export default function Layout({ children }) {
  const location = useLocation()

  // Keep current markup mostly similar to your existing HTML navbar/footer,
  // but switch internal links to React Router.
  return (
    <div className={styles.page}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            GW
          </Link>

          <ul className="nav-links" role="navigation" aria-label="Main navigation">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/skills"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Skills
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messages"
                title="Messages"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <i className="fas fa-envelope" />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Login
              </NavLink>
            </li>

          </ul>

          <div className="hamburger" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <button className="theme-toggle" aria-label="Toggle dark/light mode" title="Toggle theme">
            <i className="fas fa-moon" />
          </button>
        </div>
      </nav>

      <main id="main-content" data-route={location.pathname}>
        {children}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Gloria UWASE</h3>
              <p>Full Stack Developer</p>
            </div>

            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/skills">Skills</Link>
              <Link to="/projects">Projects</Link>
            </div>

            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <i className="fab fa-github" />
              </a>
              <a href="https://linkedin.com/in/gloria-uwase" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter" />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Gloria UWASE. All rights reserved.</p>
            <p>
              Designed &amp; Built with <i className="fas fa-heart" /> by Gloria UWASE
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

