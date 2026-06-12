import React from 'react'

export default function SkillsPage() {
  return (
    <section className="skills-hero">
      <div className="container">
        <h1>My Skills</h1>
        <p className="subtitle">Technologies I work with</p>
      </div>

      <section className="skills-main">
        <div className="container">
          <div className="skills-category">
            <h2 className="category-title">
              <i className="fas fa-code" /> Frontend Development
            </h2>
            <div className="skills-grid">
              {[
                ['HTML5', 'Semantic markup, accessibility, SEO optimization', 'fab fa-html5', '95%'],
                ['CSS3', 'Responsive design, animations, flexbox, grid', 'fab fa-css3-alt', '90%'],
                ['JavaScript', 'ES6+, DOM manipulation, async/await', 'fab fa-js', '85%'],
                ['React', 'Hooks, Redux, Context API, Next.js', 'fab fa-react', '80%'],
              ].map(([title, desc, icon, width]) => (
                <div key={title} className="skill-card">
                  <div className="skill-icon">
                    <i className={icon} />
                  </div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="skill-level">
                    <div className="skill-progress" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

