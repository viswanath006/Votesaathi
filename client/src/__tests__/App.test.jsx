/**
 * @fileoverview Client-side tests for VoteSaathi App
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
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
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('VoteSaathi')).toBeInTheDocument();
  });

  it('renders the main header', () => {
    render(<App />);
    expect(screen.getByText('Election Process Education Assistant')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<App />);
    expect(screen.getByLabelText('Home - AI Assistant')).toBeInTheDocument();
    expect(screen.getByLabelText('Election Process')).toBeInTheDocument();
    expect(screen.getByLabelText('Election Timeline')).toBeInTheDocument();
    expect(screen.getByLabelText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('renders AI chat welcome message', () => {
    render(<App />);
    expect(screen.getByText(/I am your VoteSaathi Assistant/)).toBeInTheDocument();
  });

  it('renders sidebar navigation', () => {
    render(<App />);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Quiz Zone')).toBeInTheDocument();
  });

  it('renders the helpline card', () => {
    render(<App />);
    expect(screen.getByText('1950')).toBeInTheDocument();
    expect(screen.getByText('(Toll Free)')).toBeInTheDocument();
  });

  it('navigates to FAQs tab', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('Frequently Asked Questions'));
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Who can vote in India?')).toBeInTheDocument();
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

  it('has chat input with correct placeholder', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Type your question here...');
    expect(input).toBeInTheDocument();
  });

  it('has send button with aria-label', () => {
    render(<App />);
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('has voice input button with aria-label', () => {
    render(<App />);
    expect(screen.getByLabelText('Voice input')).toBeInTheDocument();
  });

  it('has accessibility font size controls', () => {
    render(<App />);
    expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
  });

  it('font size controls work', () => {
    render(<App />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    fireEvent.click(increaseBtn);
    const container = document.querySelector('.app-container');
    expect(container.style.fontSize).toBe('18px');
  });

  it('renders skip navigation link', () => {
    const { container } = render(<App />);
    // Skip link is in index.html, not in React. We test the main content target.
    const main = container.querySelector('#main-content');
    expect(main).toBeInTheDocument();
  });

  it('has proper ARIA roles', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders quick ask suggestions', () => {
    render(<App />);
    expect(screen.getByText('How to vote?')).toBeInTheDocument();
    expect(screen.getByText('What is EVM?')).toBeInTheDocument();
  });

  it('renders right panel with timeline', () => {
    render(<App />);
    expect(screen.getByText('Election Timeline')).toBeInTheDocument();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
  });

  it('renders footer with proper role', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
