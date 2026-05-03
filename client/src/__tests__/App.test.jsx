/**
 * @fileoverview Client-side tests for VoteSaathi App
 * @description Comprehensive test suite covering rendering, navigation,
 * accessibility features, ARIA compliance, and user interactions.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const filteredProps = { ...props };
      delete filteredProps.initial;
      delete filteredProps.animate;
      delete filteredProps.exit;
      delete filteredProps.transition;
      return <div {...filteredProps}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock image imports
vi.mock('../assets/eci_logo.png', () => ({ default: 'eci_logo.png' }));
vi.mock('../assets/votesaathi_logo.png', () => ({ default: 'votesaathi_logo.png' }));
vi.mock('../assets/chunaav_logo.png', () => ({ default: 'chunaav_logo.png' }));

// Mock fetch API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ response: 'Test AI response' }),
  })
);

describe('VoteSaathi App', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByText('VoteSaathi')).toBeInTheDocument();
    });

    it('renders the main header with branding', () => {
      render(<App />);
      expect(screen.getByText('Election Process Education Assistant')).toBeInTheDocument();
      expect(screen.getByText('मतदाता जागरूकता, सशक्त लोकतंत्र')).toBeInTheDocument();
    });

    it('renders AI chat welcome message on home tab', () => {
      render(<App />);
      expect(screen.getByText(/I am your VoteSaathi Assistant/)).toBeInTheDocument();
    });

    it('renders quick ask suggestion buttons', () => {
      render(<App />);
      expect(screen.getByText('How to vote?')).toBeInTheDocument();
      expect(screen.getByText('What is EVM?')).toBeInTheDocument();
      expect(screen.getByText('Required documents')).toBeInTheDocument();
    });

    it('renders sidebar with menu items', () => {
      render(<App />);
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText('Quiz Zone')).toBeInTheDocument();
      expect(screen.getByText('My Badges')).toBeInTheDocument();
    });

    it('renders helpline card with number 1950', () => {
      render(<App />);
      const helpline = screen.getByText('Helpline');
      expect(helpline).toBeInTheDocument();
      expect(screen.getByText('(Toll Free)')).toBeInTheDocument();
    });

    it('renders the footer with copyright', () => {
      render(<App />);
      expect(screen.getByText(/© 2026 Election Commission of India/)).toBeInTheDocument();
    });

    it('renders ECI logo with alt text', () => {
      render(<App />);
      expect(screen.getByAltText('Election Commission of India Logo')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('renders all navigation items', () => {
      render(<App />);
      expect(screen.getByLabelText('Home - AI Assistant')).toBeInTheDocument();
      expect(screen.getByLabelText('Election Process')).toBeInTheDocument();
      expect(screen.getByLabelText('Election Timeline')).toBeInTheDocument();
      expect(screen.getByLabelText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByLabelText('My Learning Progress')).toBeInTheDocument();
      expect(screen.getByLabelText('Official Resources')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact Us')).toBeInTheDocument();
    });

    it('navigates to FAQs tab and shows questions', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Frequently Asked Questions'));
      expect(screen.getByText('Who can vote in India?')).toBeInTheDocument();
      expect(screen.getByText('How to register as a new voter?')).toBeInTheDocument();
    });

    it('navigates to Timeline tab', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Election Timeline'));
      expect(screen.getByText('Election Schedule 2026')).toBeInTheDocument();
    });

    it('navigates to Election Process tab', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Election Process'));
      expect(screen.getByText('The Election Lifecycle')).toBeInTheDocument();
    });

    it('navigates to Contact Us tab', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Contact Us'));
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    });

    it('navigates to Resources tab', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Official Resources'));
      expect(screen.getByText('Official Election Resources')).toBeInTheDocument();
    });

    it('navigates to My Progress tab', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('My Learning Progress'));
      expect(screen.getByText('My Learning Progress')).toBeInTheDocument();
    });
  });

  describe('Chat Functionality', () => {
    it('has chat input with correct placeholder', () => {
      render(<App />);
      expect(screen.getByPlaceholderText('Type your question here...')).toBeInTheDocument();
    });

    it('has send button with aria-label', () => {
      render(<App />);
      expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    });

    it('has voice input button with aria-label', () => {
      render(<App />);
      expect(screen.getByLabelText('Voice input')).toBeInTheDocument();
    });

    it('allows typing in chat input', () => {
      render(<App />);
      const input = screen.getByPlaceholderText('Type your question here...');
      fireEvent.change(input, { target: { value: 'How to register?' } });
      expect(input.value).toBe('How to register?');
    });

    it('shows online status indicator', () => {
      render(<App />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has font size increase button', () => {
      render(<App />);
      expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
    });

    it('has font size reset button', () => {
      render(<App />);
      expect(screen.getByLabelText('Reset font size')).toBeInTheDocument();
    });

    it('has font size decrease button', () => {
      render(<App />);
      expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
    });

    it('font size increase works', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Increase font size'));
      const container = document.querySelector('.app-container');
      expect(container.style.fontSize).toBe('18px');
    });

    it('font size decrease works', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Decrease font size'));
      const container = document.querySelector('.app-container');
      expect(container.style.fontSize).toBe('14px');
    });

    it('has main content target for skip link', () => {
      const { container } = render(<App />);
      expect(container.querySelector('#main-content')).toBeInTheDocument();
    });

    it('has navigation with proper ARIA role and label', () => {
      render(<App />);
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('has main landmark role', () => {
      render(<App />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('has footer with contentinfo role', () => {
      render(<App />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('has banner role on top bar', () => {
      const { container } = render(<App />);
      const banner = container.querySelector('[role="banner"]');
      expect(banner).toBeInTheDocument();
    });

    it('chat messages area has aria-live', () => {
      const { container } = render(<App />);
      const chatMessages = container.querySelector('[aria-live="polite"]');
      expect(chatMessages).toBeInTheDocument();
    });

    it('active nav item has aria-current=page', () => {
      render(<App />);
      const homeBtn = screen.getByLabelText('Home - AI Assistant');
      expect(homeBtn).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('FAQ Interaction', () => {
    it('FAQ accordion items have aria-expanded', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Frequently Asked Questions'));
      const faqButtons = screen.getAllByRole('button').filter(btn =>
        btn.classList.contains('faq-question')
      );
      expect(faqButtons.length).toBeGreaterThan(0);
      expect(faqButtons[0]).toHaveAttribute('aria-expanded', 'false');
    });

    it('FAQ search filters questions', () => {
      render(<App />);
      fireEvent.click(screen.getByLabelText('Frequently Asked Questions'));
      const searchInput = screen.getByPlaceholderText(/Search for questions/);
      fireEvent.change(searchInput, { target: { value: 'EVM' } });
      expect(screen.getByText('What is an EVM?')).toBeInTheDocument();
    });
  });

  describe('Quiz Zone', () => {
    it('navigates to quiz zone', () => {
      render(<App />);
      const quizBtn = screen.getByText('Quiz Zone');
      fireEvent.click(quizBtn);
      expect(screen.getByText('Quiz Zone: Test Your Knowledge')).toBeInTheDocument();
    });

    it('shows quiz question with options', () => {
      render(<App />);
      fireEvent.click(screen.getByText('Quiz Zone'));
      expect(screen.getByText(/minimum age to be eligible/)).toBeInTheDocument();
      expect(screen.getByText('18 years')).toBeInTheDocument();
    });
  });
});
