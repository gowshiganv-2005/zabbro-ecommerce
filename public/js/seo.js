/**
 * SEO Module - Dynamic Meta, OpenGraph, Canonical, FAQ & Schema.org Management for ZABBRO
 */
const SEO = (function () {
    'use strict';

    const BASE_URL = 'https://zabbro.space';
    const DEFAULT_TITLE = 'ZABBRO — Official Store | Digital Solutions, E-Commerce & Innovation';
    const DEFAULT_DESC = 'Official store of ZABBRO (Zabbro Digital Solutions & Zabbro Group of Companies). Shop premium lifestyle collections, AI solutions, web services, and tech accessories with worldwide express shipping.';
    const DEFAULT_IMAGE = `${BASE_URL}/og-image.png?v=8`;

    function update({ title, description, keywords, canonicalPath, ogImage, ogType, schema }) {
        // 1. Page Title
        const fullTitle = title ? (title.includes('ZABBRO') ? title : `${title} | ZABBRO`) : DEFAULT_TITLE;
        document.title = fullTitle;

        // 2. Meta Description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description || DEFAULT_DESC);
        }

        // 3. Meta Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // 4. Canonical URL
        const canonicalUrl = canonicalPath ? `${BASE_URL}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}` : `${BASE_URL}/`;
        let canonicalEl = document.querySelector('link[rel="canonical"]');
        if (!canonicalEl) {
            canonicalEl = document.createElement('link');
            canonicalEl.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalEl);
        }
        canonicalEl.setAttribute('href', canonicalUrl);

        // 5. OpenGraph Tags
        setMetaProperty('og:title', fullTitle);
        setMetaProperty('og:description', description || DEFAULT_DESC);
        setMetaProperty('og:url', canonicalUrl);
        setMetaProperty('og:image', ogImage || DEFAULT_IMAGE);
        setMetaProperty('og:type', ogType || 'website');
        setMetaProperty('og:site_name', 'ZABBRO');

        // 6. Twitter Card Tags
        setMetaProperty('twitter:title', fullTitle);
        setMetaProperty('twitter:description', description || DEFAULT_DESC);
        setMetaProperty('twitter:image', ogImage || DEFAULT_IMAGE);

        // 7. Dynamic Schema (JSON-LD)
        updateDynamicSchema(schema);
    }

    function setMetaProperty(property, content) {
        let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
        if (el) {
            el.setAttribute('content', content);
        } else {
            el = document.createElement('meta');
            el.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
            el.setAttribute('content', content);
            document.head.appendChild(el);
        }
    }

    function updateDynamicSchema(schemaObj) {
        const existingScript = document.getElementById('dynamic-page-schema');
        if (existingScript) existingScript.remove();

        if (schemaObj) {
            const script = document.createElement('script');
            script.id = 'dynamic-page-schema';
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schemaObj);
            document.head.appendChild(script);
        }
    }

    function getHomeFAQSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is ZABBRO and what products/services do you offer?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ZABBRO (operated by Zabbro Digital Solutions & Zabbro Group of Companies) is a premier digital solutions and lifestyle platform offering custom website development, AI & chatbot engineering, premium apparel, tech accessories, and smart products."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Does ZABBRO deliver worldwide?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, ZABBRO delivers to over 50 countries worldwide with tracked express shipping. Domestic orders in India arrive within 3-5 business days."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can I order custom software, web design, or AI services from ZABBRO?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You can explore our Website, AI, and Automation service collections directly through our store or reach out through our Contact page for customized enterprise requirements."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is ZABBRO's return and refund policy?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "ZABBRO offers a 30-day hassle-free return and refund guarantee on all eligible physical lifestyle and accessory products."
                    }
                }
            ]
        };
    }

    function updateProductSchema(product) {
        if (!product) return;
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.image ? [product.image] : [`${BASE_URL}/og-image.png`],
            "description": product.description || `Buy ${product.name} at ZABBRO official store.`,
            "sku": `ZABBRO-${product.id}`,
            "brand": {
                "@type": "Brand",
                "name": product.brand || "ZABBRO"
            },
            "offers": {
                "@type": "Offer",
                "url": `${BASE_URL}/#/product/${product.id}`,
                "priceCurrency": "INR",
                "price": product.price,
                "priceValidUntil": "2027-12-31",
                "itemCondition": "https://schema.org/NewCondition",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "ZABBRO"
                }
            }
        };

        if (product.rating) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount || 1,
                "bestRating": 5,
                "worstRating": 1
            };
        }

        update({
            title: `${product.name} — Buy Online | ZABBRO`,
            description: `${product.description ? product.description.slice(0, 155) : `Buy ${product.name} at ZABBRO.`} Free delivery on qualified orders.`,
            canonicalPath: `#/product/${product.id}`,
            ogImage: product.image || DEFAULT_IMAGE,
            ogType: 'product',
            schema: schema
        });
    }

    return {
        update,
        updateProductSchema,
        getHomeFAQSchema,
        DEFAULT_TITLE,
        DEFAULT_DESC,
        BASE_URL
    };
})();

// Expose globally
window.SEO = SEO;
