import React from 'react'

export default function HomePage() {
  return (
    <div>
      {/* Minimal React conversion placeholder; keep existing HTML styling via global CSS */}
      <section id="home" className="hero" role="banner">
        <div className="container">
          <div className="hero-content">
            <h1>
              Hi, I'm <span className="highlight">Gloria UWASE</span>
            </h1>
            <h2>Full Stack Developer & Software Engineer</h2>
            <p>
              I transform complex problems into elegant digital solutions. Building scalable web applications with modern technologies.
            </p>
            <div className="hero-btns">
              <a href="/projects" className="btn btn-primary">
                View My Work
              </a>
              <a href="/messages" className="btn btn-secondary">
                Contact Me
              </a>
            </div>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" title="GitHub">
                <i className="fab fa-github" />
              </a>
              <a href="https://instagram.com/gloria_uwase" target="_blank" rel="noreferrer" title="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a
                href="https://linkedin.com/in/gloria-uwase"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">
                <i className="fab fa-twitter" />
              </a>
              <a href="mailto:uwasegloria745@gmail.com" title="Email">
                <i className="fas fa-envelope" />
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-frame">
              <img src="/Gloria.jpg" alt="Gloria UWASE - Full Stack Developer" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>3+</h3>
              <p>Years of Experience</p>
            </div>
            <div className="stat-item">
              <h3>20+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3>15+</h3>
              <p>Happy Clients</p>
            </div>
            <div className="stat-item">
              <h3>5+</h3>
              <p>Technologies Mastered</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p style={{ marginBottom: 18 }}>
            Submit the contact form to create messages that appear in <b>Messages</b> and <b>Admin</b>.
          </p>

          <form
            className="contact-form"
            id="contactForm"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const fd = new FormData(form)
              const data = Object.fromEntries(fd.entries())

              const messages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]')
              messages.push({
                id: Date.now(),
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                date: new Date().toISOString(),
                read: false,
                starred: false,
              })
              localStorage.setItem('portfolioMessages', JSON.stringify(messages))
              form.reset()
              alert('Thank you! Your message has been sent successfully.')
            }}
          >
            <div className="form-group">
              <label htmlFor="name" className="sr-only">
                Your Name
              </label>
              <input type="text" id="name" name="name" placeholder="Your Name" required aria-required="true" />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                Your Email
              </label>
              <input type="email" id="email" name="email" placeholder="Your Email" required aria-required="true" />
            </div>
            <div className="form-group">
              <label htmlFor="subject" className="sr-only">
                Subject
              </label>
              <input type="text" id="subject" name="subject" placeholder="Subject" required aria-required="true" />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="sr-only">
                Your Message
              </label>
              <textarea id="message" name="message" placeholder="Your Message" rows={5} required aria-required="true" />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

