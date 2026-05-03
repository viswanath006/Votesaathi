/**
 * @fileoverview Sidebar Component
 * @description Left sidebar with navigation menu, language selector, and helpline card
 * @component
 */
import React from 'react';
import { MessageSquare, User, Compass, Info, BarChart2, Award, Languages, ChevronDown, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../../utils/constants';

/** Sidebar menu items configuration */
const SIDEBAR_ITEMS = [
  { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  { id: 'registration', label: 'Voter Registration', icon: User },
  { id: 'voting', label: 'Voting Process', icon: Compass },
  { id: 'evm', label: 'EVM information', icon: Info },
  { id: 'results', label: 'Results & Counting', icon: BarChart2 },
  { id: 'quiz', label: 'Quiz Zone', icon: Award },
  { id: 'badges', label: 'My Badges', icon: Award },
];

/**
 * Left sidebar component with menu, language picker, and helpline
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Tab change handler
 * @param {string} props.language - Current language
 * @param {Function} props.onLanguageChange - Language change handler
 * @param {boolean} props.showLanguages - Language dropdown visibility
 * @param {Function} props.onToggleLanguages - Language dropdown toggle
 */
export default function Sidebar({ activeTab, onTabChange, language, onLanguageChange, showLanguages, onToggleLanguages }) {
  return (
    <aside className="left-sidebar" role="complementary" aria-label="Sidebar navigation">
      <div className="sidebar-menu">
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
            aria-label={label}
          >
            <Icon size={18} aria-hidden="true" /> {label}
          </button>
        ))}

        <div style={{ position: 'relative' }}>
          <button
            className={`sidebar-btn ${showLanguages ? 'active' : ''}`}
            style={{ justifyContent: 'space-between' }}
            onClick={onToggleLanguages}
            aria-expanded={showLanguages}
            aria-label="Select language"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Languages size={18} aria-hidden="true" /> Language / भाषा
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{language}</span>
              <ChevronDown size={14} aria-hidden="true" style={{ transform: showLanguages ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </button>

          <AnimatePresence>
            {showLanguages && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute', bottom: '100%', left: '10px', right: '10px',
                  background: 'white', borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #E2E8F0', overflow: 'hidden', zIndex: 100, marginBottom: '8px'
                }}
                role="listbox"
                aria-label="Language options"
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    className="sidebar-btn"
                    role="option"
                    aria-selected={language === lang}
                    style={{
                      borderLeft: 'none', padding: '12px 20px',
                      background: language === lang ? '#EEF2FF' : 'transparent',
                      color: language === lang ? '#4F46E5' : 'inherit'
                    }}
                    onClick={() => onLanguageChange(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="helpline-card" aria-label="Voter helpline information">
        <div className="helpline-icon">
          <Phone size={24} aria-hidden="true" />
        </div>
        <h4>Helpline</h4>
        <h2>1950</h2>
        <span>(Toll Free)</span>
        <span style={{ fontWeight: '600' }}>Available 24x7</span>
      </div>
    </aside>
  );
}
