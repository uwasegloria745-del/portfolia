import React from 'react'

import '../../css/about.css'

export default function AboutPage() {
  return (
    <>
      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <h1>About Us</h1>
          <p className="subtitle">Get to know the developer behind the work</p>
        </div>

        <div className="container">
          <div className="about-main">
            <div className="about-grid">
              <div className="about-image-section">
                <div className="about-image-wrapper">
                  <img
                    src="/Gloria.jpg"
                    alt="Gloria UWASE - Professional Portrait"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="about-content-section">
                <h2>Hi, I'm Gloria UWASE</h2>
                <h3>Full Stack Developer & Software Engineer</h3>
                <p className="lead">
                  I transform ideas into powerful digital solutions—building
                  scalable applications and creating smooth, user-friendly
                  experiences.
                </p>
                <p>
                  With over 3 years of experience, I focus on crafting
                  robust, efficient, and maintainable systems that perform
                  well in real-world environments.
                </p>
                <p>
                  I care about clean architecture, reliable code, and continuous
                  learning—so every project improves my craft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="section-title">My Journey</h2>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>2024 - Present</h3>
                <h4>Senior Full Stack Developer</h4>
                <p>
                  Leading development of enterprise web applications, mentoring
                  junior developers, and implementing best practices for code
                  quality and performance optimization.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>2023 - 2024</h3>
                <h4>Full Stack Developer</h4>
                <p>
                  Built and maintained client projects using React, Node.js,
                  and Python. Collaborated across teams to deliver high-
                  quality solutions.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>2022 - 2023</h3>
                <h4>Frontend Developer</h4>
                <p>
                  Specialized in responsive, user-friendly interfaces using
                  modern JavaScript frameworks and UI/UX best practices.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h3>2021 - 2022</h3>
                <h4>Junior Developer</h4>
                <p>
                  Started with static websites and steadily grew into modern
                  web development—strengthening my passion for problem-solving
                  and clean code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="skills-overview">
        <div className="container">
          <h2 className="section-title">Technical Expertise</h2>

          <div className="skills-overview-grid">
            <div className="skill-category-card">
              <i className="fas fa-paint-brush" />
              <h3>Frontend</h3>
              <p>
                React, Vue.js, HTML5, CSS3, JavaScript, TypeScript, Tailwind
              </p>
            </div>

            <div className="skill-category-card">
              <i className="fas fa-server" />
              <h3>Backend</h3>
              <p>Node.js, Python, Django, Express, REST APIs, GraphQL</p>
            </div>

            <div className="skill-category-card">
              <i className="fas fa-database" />
              <h3>Database</h3>
              <p>MongoDB, PostgreSQL, MySQL, Firebase, Redis</p>
            </div>

            <div className="skill-category-card">
              <i className="fas fa-tools" />
              <h3>Tools</h3>
              <p>Git, Docker, AWS, CI/CD, Linux, VS Code</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="interests-section">
        <div className="container">
          <h2 className="section-title">What I Love</h2>

          <div className="interests-grid">
            <div className="interest-card">
              <i className="fas fa-code" />
              <h3>Coding</h3>
              <p>Writing clean, efficient code and solving complex problems</p>
            </div>

            <div className="interest-card">
              <i className="fas fa-laptop" />
              <h3>Web Design</h3>
              <p>Creating beautiful, responsive user interfaces</p>
            </div>

            <div className="interest-card">
              <i className="fas fa-book" />
              <h3>Learning</h3>
              <p>Exploring new technologies and staying updated</p>
            </div>

            <div className="interest-card">
              <i className="fas fa-users" />
              <h3>Collaboration</h3>
              <p>Working with teams to build amazing products</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start a Project?</h2>
          <p>
            Let’s discuss your ideas and bring them to life. I’m available
            for freelance work and full-time opportunities.
          </p>
          <a href="/" className="btn btn-primary">
            Get In Touch
          </a>
        </div>
      </section>
    </>
  )
}


