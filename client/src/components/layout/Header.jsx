/**
 * @fileoverview Header Component
 * @description Top banner and main header with ECI branding and font size controls
 * @component
 */
import React, { useCallback } from 'react';
import eciLogo from '../../assets/eci_logo.png';
import chunaavLogo from '../../assets/chunaav_logo.png';

/**
 * Header component with government banner, branding, and accessibility controls
 * @param {Object} props
 * @param {Function} props.onFontSizeChange - Font size control handler
 */
export default function Header({ onFontSizeChange }) {
  return (
    <>
      <div className="top-banner" role="banner">
        <div className="banner-left">
          <span>🇮🇳 भारत सरकार | Government of India</span>
        </div>
        <div className="banner-right" role="toolbar" aria-label="Font size controls">
          <button onClick={() => onFontSizeChange('increase')} aria-label="Increase font size" title="Increase font size">A+</button>
          <button onClick={() => onFontSizeChange('reset')} aria-label="Reset font size" title="Reset font size">A</button>
          <button onClick={() => onFontSizeChange('decrease')} aria-label="Decrease font size" title="Decrease font size">A-</button>
        </div>
      </div>

      <header className="main-header">
        <div className="logo-container">
          <div className="logo-item">
            <img src={eciLogo} alt="Election Commission of India Logo" />
          </div>
          <div className="logo-item" style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#003366' }}>भारत निर्वाचन आयोग</div>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Election Commission of India</div>
          </div>
        </div>

        <div className="votesaathi-brand" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <h1 style={{ color: '#003366', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>VoteSaathi</h1>
          <span style={{ color: '#003366', fontSize: '1.1rem', fontWeight: '600' }}>Election Process Education Assistant</span>
          <span style={{ color: '#003366', fontSize: '1rem', fontWeight: '500' }}>मतदाता जागरूकता, सशक्त लोकतंत्र</span>
        </div>

        <div className="logo-item">
          <img src={chunaavLogo} alt="Chunaav Logo" />
        </div>
      </header>
    </>
  );
}
