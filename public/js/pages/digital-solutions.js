/**
 * Zabbro Digital Solutions (Services) Dedicated Landing Page Module
 * Displays:
 *  - Digital Agency Header / Showcase
 *  - Digital Solutions & Innovation Services (Web, Data, AI, Chatbots)
 *  - Interactive Service Inquiry & Consultation CTA
 */

function renderServicesPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Digital Solutions & Innovation Services Section -->
    <section class="section" id="services-page-section" style="background:var(--white);padding-top:40px;padding-bottom:60px" aria-label="Zabbro Digital Solutions & Services">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="section-label">Digital Solutions &amp; Innovation</div>
          <h2 class="section-title">Zabbro Digital Solutions</h2>
          <p class="section-subtitle">Empowering modern businesses and individuals with intelligent technology, custom web engineering, AI automations, and bespoke digital systems.</p>
        </div>

        <!-- Alternating Split Capsule Services List (Image on One Side + Point-wise Offerings on the Other) -->
        <div class="split-services-container">
          
          <!-- 1. Website Services (Image Left) -->
          <div class="split-service-card fade-in" style="animation-delay:.05s">
            <div class="split-service-media">
              <img src="/images/services/web.jpg" alt="Website Services & E-Commerce Development" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Web &amp; E-Commerce</span>
              <h3 class="split-service-title">Website Services</h3>
              <p class="split-service-desc">
                We design and build bespoke, high-performance web systems and digital storefronts engineered to convert visitors into loyal clients.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> Custom responsive web application architecture</li>
                <li><i data-lucide="check-circle-2"></i> High-conversion e-commerce storefronts &amp; checkout funnels</li>
                <li><i data-lucide="check-circle-2"></i> Core Web Vitals optimization with sub-second page loads</li>
                <li><i data-lucide="check-circle-2"></i> SEO-structured semantic markup &amp; clean code standards</li>
              </ul>
              <a href="https://zabbroworks.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn btn-primary split-service-btn">
                <span>Explore Designs</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

          <!-- 2. Data Analysis & Reporting (Image Right - Reverse) -->
          <div class="split-service-card split-reverse fade-in" style="animation-delay:.1s">
            <div class="split-service-media">
              <img src="/images/services/data.jpg" alt="Data Analysis and Business Intelligence Reporting" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Analytics &amp; Insights</span>
              <h3 class="split-service-title">Data Analysis &amp; Reporting</h3>
              <p class="split-service-desc">
                We unlock raw enterprise data into actionable business intelligence through real-time KPI trackers, automated pipelines, and predictive metrics.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> Automated executive KPI &amp; financial dashboards</li>
                <li><i data-lucide="check-circle-2"></i> Revenue, customer churn, and inventory forecasting</li>
                <li><i data-lucide="check-circle-2"></i> Multi-channel marketing performance analytics</li>
                <li><i data-lucide="check-circle-2"></i> Cloud data pipeline integration &amp; automated reporting</li>
              </ul>
              <a href="#/about#contact" class="btn btn-primary split-service-btn">
                <span>Learn More</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

          <!-- 3. AI Services & Models (Image Left) -->
          <div class="split-service-card fade-in" style="animation-delay:.15s">
            <div class="split-service-media">
              <img src="/images/services/ai.jpg" alt="AI Services, Machine Learning and Automation" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Artificial Intelligence</span>
              <h3 class="split-service-title">AI Services &amp; Models</h3>
              <p class="split-service-desc">
                We integrate state-of-the-art machine learning algorithms and custom LLM workflows to automate repetitive tasks and supercharge organizational speed.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> Custom LLM &amp; transformer fine-tuning for your domain</li>
                <li><i data-lucide="check-circle-2"></i> Automated workflow pipelines &amp; robotic process automation</li>
                <li><i data-lucide="check-circle-2"></i> Natural language document extraction &amp; summary agents</li>
                <li><i data-lucide="check-circle-2"></i> Predictive intelligence models for proactive business choices</li>
              </ul>
              <a href="#/about#contact" class="btn btn-primary split-service-btn">
                <span>Get AI Solutions</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

          <!-- 4. Intelligent Chatbot Systems (Image Right - Reverse) -->
          <div class="split-service-card split-reverse fade-in" style="animation-delay:.2s">
            <div class="split-service-media">
              <img src="/images/services/chatbots.jpg" alt="Intelligent Chatbot Systems & WhatsApp Automation" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Conversational AI</span>
              <h3 class="split-service-title">Intelligent Chatbot Systems</h3>
              <p class="split-service-desc">
                We deploy intelligent AI agents that handle client inquiries 24/7 across your website, WhatsApp, and social channels with human-like precision.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> 24/7 automated multilingual customer support bots</li>
                <li><i data-lucide="check-circle-2"></i> Instant lead qualification &amp; automatic CRM synchronization</li>
                <li><i data-lucide="check-circle-2"></i> Official WhatsApp Business Cloud API automated flows</li>
                <li><i data-lucide="check-circle-2"></i> Human agent fallback with intelligent conversation routing</li>
              </ul>
              <a href="#/about#contact" class="btn btn-primary split-service-btn">
                <span>Deploy Chatbot</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

          <!-- 5. Digital Marketing (Image Left) -->
          <div class="split-service-card fade-in" style="animation-delay:.25s">
            <div class="split-service-media">
              <img src="/images/services/marketing.jpg" alt="Performance Digital Marketing and SEO" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Growth &amp; Performance</span>
              <h3 class="split-service-title">Digital Marketing</h3>
              <p class="split-service-desc">
                We craft hyper-targeted digital campaigns and revenue-focused acquisition strategies that place your brand directly in front of active buyers.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> High-intent Search Engine Optimization (SEO &amp; GEO)</li>
                <li><i data-lucide="check-circle-2"></i> Laser-targeted Google Search &amp; Meta Performance Ads</li>
                <li><i data-lucide="check-circle-2"></i> Conversion Rate Optimization (CRO) &amp; A/B funnel testing</li>
                <li><i data-lucide="check-circle-2"></i> Retention email marketing &amp; automated customer lifecycle flows</li>
              </ul>
              <a href="#/about#contact" class="btn btn-primary split-service-btn">
                <span>Grow Your Brand</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

          <!-- 6. Social Media Handling (Image Right - Reverse) -->
          <div class="split-service-card split-reverse fade-in" style="animation-delay:.3s">
            <div class="split-service-media">
              <img src="/images/services/social.jpg" alt="Social Media Management and Brand Growth" loading="lazy">
            </div>
            <div class="split-service-details">
              <span class="split-service-tag">Brand Presence &amp; Engagement</span>
              <h3 class="split-service-title">Social Media Handling</h3>
              <p class="split-service-desc">
                We curate high-engagement creative feeds, manage daily brand interactions, and build active, authentic communities around your business.
              </p>
              <ul class="split-service-points">
                <li><i data-lucide="check-circle-2"></i> Creative content calendar planning &amp; visual storytelling</li>
                <li><i data-lucide="check-circle-2"></i> High-converting short-form video (Reels/Shorts) strategy</li>
                <li><i data-lucide="check-circle-2"></i> Active daily audience engagement &amp; direct message handling</li>
                <li><i data-lucide="check-circle-2"></i> Monthly growth metrics, reach benchmarking, and sentiment audit</li>
              </ul>
              <a href="#/about#contact" class="btn btn-primary split-service-btn">
                <span>Elevate Social Presence</span>
                <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- Direct Consultation Box -->
        <div style="margin-top:60px;background:var(--bg);border-radius:var(--radius-lg);padding:40px;border:1px solid var(--border);text-align:center">
          <h3 style="font-family:var(--font-serif);font-size:1.85rem;margin-bottom:12px">Need a Custom Software or AI Solution?</h3>
          <p style="color:var(--text-secondary);max-width:580px;margin:0 auto 24px">
            Speak directly with our engineering team at Zabbro Digital Solutions to architect, design, and deploy your next digital product.
          </p>
          <a href="#/about#contact" class="btn btn-primary" style="padding:12px 32px">
            Schedule a Consultation
          </a>
        </div>
      </div>
    </section>
  `;

  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}
