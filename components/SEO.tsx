
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({ title, description, image, type = 'website', schema }) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | GlowHub Pakistan`;

    // Update Meta Tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setOgMeta = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setOgMeta('og:title', title);
    setOgMeta('og:description', description);
    setOgMeta('og:type', type);
    if (image) setOgMeta('og:image', image);

    // Inject JSON-LD Schema
    if (schema) {
      let script = document.querySelector('#json-ld-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'json-ld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    return () => {
      // Cleanup if necessary (optional for simple apps)
    };
  }, [title, description, image, type, schema]);

  return null;
};
