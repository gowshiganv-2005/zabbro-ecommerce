/**
 * About Us Page Module
 */
function renderAboutPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <section class="about-page container">
      <div class="about-hero fade-in-up">
        <div class="section-label">Our Story</div>
        <h1>About ZABBRO</h1>
        <p>We believe in the power of thoughtful design. Every product in our collection is carefully curated for quality, sustainability, and timeless aesthetics. Our mission is to elevate everyday living through premium craftsmanship.</p>
      </div>

      <div class="about-grid">
        <div class="about-card fade-in" style="animation-delay:.1s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Quality Guaranteed</h3>
          <p>Every product undergoes rigorous quality checks. We partner with artisans and brands who share our commitment to excellence and durability.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.2s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Worldwide Shipping</h3>
          <p>We deliver to over 50 countries with tracked shipping. Orders over $100 qualify for free express delivery, arriving within 3-5 business days.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.3s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          </div>
          <h3>Sustainable Practices</h3>
          <p>We prioritize eco-friendly materials and ethical sourcing. Our packaging is 100% recyclable, and we offset our carbon footprint for every shipment.</p>
        </div>
      </div>

      <div class="about-grid" style="margin-bottom:64px">
        <div class="about-card fade-in" style="animation-delay:.4s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </div>
          <h3>Easy Returns</h3>
          <p>Not satisfied? Return any item within 30 days for a full refund. No questions asked. We make the return process simple and hassle-free.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.5s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>Community First</h3>
          <p>Join thousands of design enthusiasts. Our community of curators, designers, and customers helps shape the products we bring to our collection.</p>
        </div>
        <div class="about-card fade-in" style="animation-delay:.6s">
          <div class="about-card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h3>Expert Support</h3>
          <p>Our dedicated support team is available 7 days a week. Whether you need styling advice or have a question about an order, we're here to help.</p>
        </div>
      </div>

      <div class="cta-banner fade-in">
        <h2>Ready to Elevate Your Space?</h2>
        <p>Browse our curated collection of premium lifestyle products.</p>
        <a href="#/products" class="btn btn-primary btn-lg">Shop Now</a>
      </div>
    </section>
  `;
}
