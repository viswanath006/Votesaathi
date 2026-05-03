/**
 * @fileoverview Footer Component
 * @description Application footer with links and copyright information
 * @component
 */
import React from 'react';

/**
 * Footer component with copyright and navigation links
 */
export default function Footer() {
  return (
    <footer className="main-footer" role="contentinfo">
      <div className="footer-top">
        <div style={{ fontSize: '0.9rem' }}>© 2026 Election Commission of India. All Rights Reserved.</div>
        <div className="footer-links">
          <a href="#" aria-label="Privacy Policy">Privacy Policy</a>
          <a href="#" aria-label="Terms of Use">Terms of Use</a>
          <a href="#" aria-label="Accessibility Statement">Accessibility Statement</a>
          <a href="#" aria-label="Help">Help</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>भारत निर्वाचन आयोग की आधिकारिक वेबसाइट</span>
      </div>
    </footer>
  );
}
