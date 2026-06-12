import React, { useMemo, useState } from 'react'

const projects = [
  {
    id: 1,
    category: 'webapp',
    title: 'E-Commerce Platform',
    subtitle: 'Web App',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    description:
      'A full-featured online shopping platform with cart functionality, secure payment integration via Stripe, user authentication, and comprehensive admin dashboard for inventory management.',
  },
  {
    id: 2,
    category: 'website',
    title: 'Personal Portfolio',
    subtitle: 'Website',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    description:
      'A modern, responsive portfolio website with smooth animations, dark/light mode toggle, and contact form integration.',
  },
]

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return projects
    return projects.filter((p) => p.category === filter)
  }, [filter])

  return (
    <div>
      <section className="projects-hero">
        <div className="container">
          <h1>My Projects</h1>
          <p className="subtitle">Showcasing my work and creative solutions</p>
        </div>
      </section>

      <section className="projects-filter">
        <div className="container">
          <div className="filter-buttons">
            {[
              ['all', 'All'],
              ['webapp', 'Web Apps'],
              ['website', 'Websites'],
              ['mobile', 'Mobile'],
              ['api', 'APIs'],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-main">
        <div className="container">
          <div className="projects-grid">
            {filtered.map((p) => (
              <div key={p.id} className="project-card" data-category={p.category}>
                <div className="project-image">
                  <img src="/Screenshot 2026-03-11 233114.png" alt={p.title} loading="lazy" />
                  <div className="project-overlay">
                    <a href="#" className="overlay-btn">
                      <i className="fas fa-external-link-alt" /> Live Demo
                    </a>
                    <a href="#" className="overlay-btn">
                      <i className="fab fa-github" /> Source Code
                    </a>
                  </div>
                </div>

                <div className="project-content">
                  <span className="project-category">{p.subtitle}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="project-tech">
                    {p.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="projects-cta">
        <div className="container">
          <h2>Have a Project in Mind?</h2>
          <p>Let's work together to bring your ideas to life. I'm excited to collaborate on innovative projects.</p>
          <a href="/#contact" className="btn btn-primary">
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  )
}

