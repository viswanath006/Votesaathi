/**
 * @fileoverview Navigation Component
 * @description Top navigation bar with ARIA-compliant tab switching
 * @component
 */
import React from 'react';
import { Home, BookOpen, Clock, HelpCircle, BarChart2, Info, Phone } from 'lucide-react';

/** Navigation tab configuration */
const NAV_ITEMS = [
  { id: 'chat', label: 'Home', ariaLabel: 'Home - AI Assistant', icon: Home },
  { id: 'process', label: 'Election Process', ariaLabel: 'Election Process', icon: BookOpen },
  { id: 'timeline', label: 'Timeline', ariaLabel: 'Election Timeline', icon: Clock },
  { id: 'faqs', label: 'FAQs', ariaLabel: 'Frequently Asked Questions', icon: HelpCircle },
  { id: 'progress', label: 'My Progress', ariaLabel: 'My Learning Progress', icon: BarChart2 },
  { id: 'resources', label: 'Resources', ariaLabel: 'Official Resources', icon: Info },
  { id: 'contact', label: 'Contact Us', ariaLabel: 'Contact Us', icon: Phone },
];

/**
 * Top navigation bar component
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab ID
 * @param {Function} props.onTabChange - Tab change handler
 */
export default function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="top-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ id, label, ariaLabel, icon: Icon }) => (
        <button
          key={id}
          className={`nav-item ${activeTab === id ? 'active' : ''}`}
          onClick={() => onTabChange(id)}
          aria-current={activeTab === id ? 'page' : undefined}
          aria-label={ariaLabel}
        >
          <Icon size={18} aria-hidden="true" /> {label}
        </button>
      ))}
    </nav>
  );
}
