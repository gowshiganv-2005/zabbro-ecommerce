/**
 * About Us Page Module
 */
function renderAboutPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="about-page container" itemscope itemtype="https://schema.org/AboutPage">
      <div class="about-hero fade-in-up" style="text-align:center">
        <div style="margin-bottom:16px"><img src="/images/logo-dark.png" alt="ZABBRO — Innovate. Automate. Elevate." class="brand-logo-img" style="height:36px;max-width:260px"></div>
        <div class="section-label">Our Story &amp; Vision</div>
        <h1 itemprop="name">About ZABBRO</h1>
        <p itemprop="description">ZABBRO (operated by <strong>Zabbro Digital Solutions &amp; Zabbro Group of Companies</strong>) is an innovation-first lifestyle and technology brand. We combine thoughtful physical craftsmanship with modern web architectures and intelligent AI automations to elevate everyday living and enterprise productivity.</p>
      </div>

      <div class="about-grid">
        <div class="about-card fade-in" style="animation-delay:.1s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Quality Guaranteed</h3>
          <p>Every product and software module undergoes rigorous quality checks. We partner with vetted artisans and developers who share our commitment to durability and excellence.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.2s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          <h3>Worldwide Express Shipping</h3>
          <p>We deliver to over 50 countries with full tracking. Domestic deliveries across India arrive in 3-5 business days, backed by secure packaging.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.3s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
          <h3>Sustainable &amp; Ethical</h3>
          <p>We prioritize eco-conscious materials, minimal packaging waste, and ethical development standards for all physical and digital operations.</p>
        </div>
      </div>

      <div class="about-grid" style="margin-bottom:64px">
        <div class="about-card fade-in" style="animation-delay:.4s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </div>
          <h3>30-Day Easy Returns</h3>
          <p>Not completely satisfied? Return any eligible item within 30 days for a full refund or exchange with simple, hassle-free processing.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.5s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>Customer First Philosophy</h3>
          <p>Join thousands of happy customers and businesses who rely on ZABBRO for modern lifestyle essentials and intelligent digital automations.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.6s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h3>Direct Expert Support</h3>
          <p>Our dedicated support and engineering team is reachable 6 days a week to help with products, orders, and custom business solutions.</p>
        </div>
      </div>

      <div class="cta-banner fade-in">
        <h2>Ready to Experience ZABBRO?</h2>
        <p>Browse our curated collection of lifestyle products and digital engineering services.</p>
        <a href="#/products" class="btn btn-primary btn-lg" aria-label="Shop ZABBRO Collection">Shop Collection</a>
      </div>

      <div id="contact" class="contact-section fade-in" style="margin-top:80px;padding-bottom:100px" itemscope itemtype="https://schema.org/LocalBusiness">
        <meta itemprop="name" content="ZABBRO - Zabbro Digital Solutions">
        <meta itemprop="image" content="https://zabbro.space/images/logo-dark.png">
        <meta itemprop="priceRange" content="$$">
        <div class="section-label">Get in Touch</div>
        <h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:48px">Contact ZABBRO Support &amp; HQ</h2>
        <div class="contact-grid">
          <div class="contact-info">
            <div style="margin-bottom:32px">
              <h3 style="font-size:1.125rem;margin-bottom:12px">Support Hours</h3>
              <p style="color:var(--text-secondary)">Monday – Friday: 9am – 6pm IST<br>Saturday: 10am – 4pm IST<br>Sunday: Closed</p>
            </div>
            <div style="margin-bottom:32px" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
              <h3 style="font-size:1.125rem;margin-bottom:12px">Headquarters</h3>
              <p style="color:var(--text-secondary)">
                <span itemprop="streetAddress">2/78G, Ayyar Bunglow, Kulamangalam Main Road</span><br>
                <span itemprop="addressLocality">Madurai</span>, <span itemprop="addressRegion">Tamil Nadu</span>, <span itemprop="addressCountry">India</span> - <span itemprop="postalCode">625017</span>
              </p>
            </div>
            <div>
              <h3 style="font-size:1.125rem;margin-bottom:12px">Direct Contact</h3>
              <p style="color:var(--text-secondary)">Email: <a href="mailto:support@zabbro.com" itemprop="email" style="color:inherit">support@zabbro.com</a><br>Phone: <a href="tel:+919025361098" itemprop="telephone" style="color:inherit">+91 9025361098</a> / <a href="tel:+918248957918" style="color:inherit">+91 8248957918</a></p>
            </div>
          </div>
          <div class="contact-form-wrap">
            <form id="contact-form" onsubmit="event.preventDefault(); Toast.show('Message sent! We will get back to you soon.', 'success'); this.reset();">
              <div class="contact-form-row-inner">
                <div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" required placeholder="Your Name"></div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" required placeholder="your@email.com"></div>
              </div>
              <div class="form-group"><label class="form-label">Subject</label><input type="text" class="form-input" required placeholder="How can we help?"></div>
              <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" required placeholder="Tell us more about your inquiry..."></textarea></div>
              <button type="submit" class="btn btn-primary btn-full" aria-label="Send message to ZABBRO">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}
