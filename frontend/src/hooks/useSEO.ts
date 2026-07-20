import { useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const useSEO = (pageKey: 'home' | 'about' | 'programs' | 'events' | 'contact') => {
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then((data) => {
        const title = data[`seo_title_${pageKey}`];
        const desc = data[`seo_desc_${pageKey}`];
        const keywords = data[`seo_keywords_${pageKey}`];

        // Update Title
        if (title) {
          document.title = title;
        }

        // Update Meta Description
        if (desc) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', desc);
        }

        // Update Meta Keywords
        if (keywords) {
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.setAttribute('content', keywords);
        }
      })
      .catch((err) => {
        console.warn('SEO Hook: Failed to load dynamic SEO settings, using static fallbacks', err);
      });
  }, [pageKey]);
};
