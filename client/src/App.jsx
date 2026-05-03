import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Send, Mic, Languages, User, Bot, HelpCircle, Loader2, Compass, Award, Calendar, MapPin, Info, ShieldCheck, PlayCircle, Phone, Home, BookOpen, Clock, BarChart2, MessageSquare, Search, ChevronDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import local assets
import eciLogo from './assets/eci_logo.png';
import voteSaathiLogo from './assets/votesaathi_logo.png';
import chunaavLogo from './assets/chunaav_logo.png';

// Import extracted modules for code quality
import { SUGGESTIONS, TIMELINE, FAQS_DATA, QUIZ_QUESTIONS, LANGUAGES } from './utils/constants';
import { useChat } from './hooks/useChat';

/* Constants and data are now imported from utils/constants.js */

/* Quiz data is now imported from utils/constants.js */

/**
 * VoteSaathi Main Application Component
 * @description Root component for the Election Process Education Assistant.
 * Provides AI chat, quiz, timeline, FAQs, and educational modules.
 * @component
 */
function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState('English');
  const [showLanguages, setShowLanguages] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Use custom chat hook for clean separation of concerns
  const { messages, input, setInput, isLoading, handleSend, scrollRef } = useChat(language);

  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // FAQ State
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  /** Memoized filtered FAQs for efficiency */
  const filteredFaqs = useMemo(() =>
    FAQS_DATA.filter(faq =>
      faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.a.toLowerCase().includes(faqSearch.toLowerCase())
    ), [faqSearch]
  );

  /** Font size accessibility controls */
  const handleFontSize = useCallback((action) => {
    setFontSize(prev => {
      if (action === 'increase') return Math.min(prev + 2, 24);
      if (action === 'decrease') return Math.max(prev - 2, 12);
      return 16;
    });
  }, []);

  return (
    <div className="app-container" style={{ fontSize: `${fontSize}px` }}>
      {/* Top Banner */}
      <div className="top-banner" role="banner">
        <div className="banner-left">
          <span>🇮🇳 भारत सरकार | Government of India</span>
        </div>
        <div className="banner-right" role="toolbar" aria-label="Font size controls">
          <button onClick={() => handleFontSize('increase')} aria-label="Increase font size" title="Increase font size">A+</button>
          <button onClick={() => handleFontSize('reset')} aria-label="Reset font size" title="Reset font size">A</button>
          <button onClick={() => handleFontSize('decrease')} aria-label="Decrease font size" title="Decrease font size">A-</button>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="logo-container">
          <div className="logo-item">
            <img src={eciLogo} alt="ECI Logo" />
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

      {/* Navigation Bar */}
      <nav className="top-nav" role="navigation" aria-label="Main navigation">
        <button 
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} 
          onClick={() => setActiveTab('chat')}
          aria-current={activeTab === 'chat' ? 'page' : undefined}
          aria-label="Home - AI Assistant"
        >
          <Home size={18} aria-hidden="true" /> Home
        </button>
        <button 
          className={`nav-item ${activeTab === 'process' ? 'active' : ''}`} 
          onClick={() => setActiveTab('process')}
          aria-current={activeTab === 'process' ? 'page' : undefined}
          aria-label="Election Process"
        >
          <BookOpen size={18} aria-hidden="true" /> Election Process
        </button>
        <button 
          className={`nav-item ${activeTab === 'timeline' ? 'active' : ''}`} 
          onClick={() => setActiveTab('timeline')}
          aria-current={activeTab === 'timeline' ? 'page' : undefined}
          aria-label="Election Timeline"
        >
          <Clock size={18} aria-hidden="true" /> Timeline
        </button>
        <button 
          className={`nav-item ${activeTab === 'faqs' ? 'active' : ''}`} 
          onClick={() => setActiveTab('faqs')}
          aria-current={activeTab === 'faqs' ? 'page' : undefined}
          aria-label="Frequently Asked Questions"
        >
          <HelpCircle size={18} aria-hidden="true" /> FAQs
        </button>
        <button 
          className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} 
          onClick={() => setActiveTab('progress')}
          aria-current={activeTab === 'progress' ? 'page' : undefined}
          aria-label="My Learning Progress"
        >
          <BarChart2 size={18} aria-hidden="true" /> My Progress
        </button>
        <button 
          className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`} 
          onClick={() => setActiveTab('resources')}
          aria-current={activeTab === 'resources' ? 'page' : undefined}
          aria-label="Official Resources"
        >
          <Info size={18} aria-hidden="true" /> Resources
        </button>
        <button 
          className={`nav-item ${activeTab === 'contact' ? 'active' : ''}`} 
          onClick={() => setActiveTab('contact')}
          aria-current={activeTab === 'contact' ? 'page' : undefined}
          aria-label="Contact Us"
        >
          <Phone size={18} aria-hidden="true" /> Contact Us
        </button>
      </nav>

      {/* Dashboard Content */}
      <main id="main-content" className="dashboard-grid" role="main">
        {/* Left Sidebar */}
        <aside className="left-sidebar" role="complementary" aria-label="Sidebar navigation">
          <div className="sidebar-menu">
            <button className={`sidebar-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={18} /> AI Assistant
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'registration' ? 'active' : ''}`} 
              onClick={() => setActiveTab('registration')}
            >
              <User size={18} /> Voter Registration
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'voting' ? 'active' : ''}`} 
              onClick={() => setActiveTab('voting')}
            >
              <Compass size={18} /> Voting Process
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'evm' ? 'active' : ''}`} 
              onClick={() => setActiveTab('evm')}
            >
              <Info size={18} /> EVM information
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'results' ? 'active' : ''}`} 
              onClick={() => setActiveTab('results')}
            >
              <BarChart2 size={18} /> Results & Counting
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'quiz' ? 'active' : ''}`} 
              onClick={() => setActiveTab('quiz')}
            >
              <Award size={18} /> Quiz Zone
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'badges' ? 'active' : ''}`} 
              onClick={() => setActiveTab('badges')}
            >
              <Award size={18} /> My Badges
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                className={`sidebar-btn ${showLanguages ? 'active' : ''}`} 
                style={{ justifyContent: 'space-between' }}
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Languages size={18} /> Language / भाषा
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{language}</span>
                  <ChevronDown size={14} style={{ transform: showLanguages ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>
              
              <AnimatePresence>
                {showLanguages && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ 
                      position: 'absolute', 
                      bottom: '100%', 
                      left: '10px', 
                      right: '10px', 
                      background: 'white', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                      zIndex: 100,
                      marginBottom: '8px'
                    }}
                  >
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang}
                        className="sidebar-btn"
                        style={{ 
                          borderLeft: 'none', 
                          padding: '12px 20px', 
                          background: language === lang ? '#EEF2FF' : 'transparent',
                          color: language === lang ? '#4F46E5' : 'inherit'
                        }}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguages(false);
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="helpline-card">
            <div className="helpline-icon">
              <Phone size={24} />
            </div>
            <h4>Helpline</h4>
            <h2>1950</h2>
            <span>(Toll Free)</span>
            <span style={{ fontWeight: '600' }}>Available 24x7</span>
          </div>
        </aside>

        {/* Center Content Area */}
        <section className="chat-section">
          {activeTab === 'contact' ? (
            <div className="registration-view">
              <div className="view-header">
                <Phone size={24} color="#003366" />
                <h2>Get in Touch</h2>
              </div>

              <div className="contact-grid">
                {/* Support Info */}
                <div className="contact-info-col">
                  <div className="info-card-plain">
                    <div className="icon-circle"><Phone size={20} /></div>
                    <div className="text-box">
                      <h4>Voter Helpline</h4>
                      <p className="large-stat">1950</p>
                      <span>Toll-free number for all queries</span>
                    </div>
                    <button className="call-btn">Call Now</button>
                  </div>

                  <div className="info-card-plain">
                    <div className="icon-circle" style={{ background: '#EEF2FF', color: '#4F46E5' }}><MessageSquare size={20} /></div>
                    <div className="text-box">
                      <h4>Email Support</h4>
                      <p>support@eci.gov.in</p>
                      <span>Response within 24-48 hours</span>
                    </div>
                  </div>

                  <div className="info-card-plain">
                    <div className="icon-circle" style={{ background: '#FFF7ED', color: '#EA580C' }}><MapPin size={20} /></div>
                    <div className="text-box">
                      <h4>Office Address</h4>
                      <p>Nirvachan Sadan, Ashoka Road</p>
                      <span>New Delhi, 110001, India</span>
                    </div>
                  </div>

                  <div className="info-card-plain hours">
                    <Clock size={18} />
                    <span>Working Hours: Mon - Fri, 9:00 AM - 5:30 PM</span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="contact-form-col">
                  <div className="form-card">
                    <h3>Send a Message</h3>
                    <p>Have a specific question? Fill the form below.</p>
                    <div className="form-group">
                      <label>Your Name</label>
                      <input type="text" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea rows="4" placeholder="How can we help you?"></textarea>
                    </div>
                    <button className="primary-btn full-width">Submit Inquiry</button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'resources' ? (
            <div className="registration-view">
              <div className="view-header">
                <BookOpen size={24} color="#003366" />
                <h2>Official Election Resources</h2>
              </div>

              <div className="resources-container">
                {/* 1. Forms Section */}
                <div className="res-category">
                  <h3><FileText size={20} /> Official Forms</h3>
                  <div className="res-grid">
                    {[
                      { name: "Form 6", desc: "Registration of New Voter", link: "https://voters.eci.gov.in/" },
                      { name: "Form 6B", desc: "Aadhaar linking for Voters", link: "https://voters.eci.gov.in/" },
                      { name: "Form 8", desc: "Correction of Entries / Shifting", link: "https://voters.eci.gov.in/" }
                    ].map((res, i) => (
                      <div key={i} className="res-card">
                        <div className="res-icon-box"><FileText size={24} /></div>
                        <div className="res-info">
                          <h4>{res.name}</h4>
                          <p>{res.desc}</p>
                        </div>
                        <button className="res-action-btn" onClick={() => window.open(res.link, '_blank')}>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Guides Section */}
                <div className="res-category">
                  <h3><BookOpen size={20} /> Guides & Handbooks</h3>
                  <div className="res-grid">
                    {[
                      { name: "Voter Guide 2026", desc: "Comprehensive PDF handbook for voters.", link: "#" },
                      { name: "EVM Security Guide", desc: "Official document on EVM/VVPAT safety.", link: "#" },
                      { name: "Model Code of Conduct", desc: "Rules for political parties & candidates.", link: "#" }
                    ].map((res, i) => (
                      <div key={i} className="res-card">
                        <div className="res-icon-box" style={{ background: '#EEF2FF', color: '#4F46E5' }}><BookOpen size={24} /></div>
                        <div className="res-info">
                          <h4>{res.name}</h4>
                          <p>{res.desc}</p>
                        </div>
                        <button className="res-action-btn secondary">View PDF</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Portals Section */}
                <div className="res-category">
                  <h3><Compass size={20} /> Official Portals</h3>
                  <div className="res-grid">
                    {[
                      { name: "Voters' Service Portal", desc: "Main gateway for all citizen services.", link: "https://voters.eci.gov.in/" },
                      { name: "ECI Main Website", desc: "Official website of Election Commission.", link: "https://eci.gov.in/" },
                      { name: "Know Your Candidate", desc: "Check candidate affidavits and history.", link: "https://affidavit.eci.gov.in/" }
                    ].map((res, i) => (
                      <div key={i} className="res-card">
                        <div className="res-icon-box" style={{ background: '#FFF7ED', color: '#EA580C' }}><Compass size={24} /></div>
                        <div className="res-info">
                          <h4>{res.name}</h4>
                          <p>{res.desc}</p>
                        </div>
                        <button className="res-action-btn" onClick={() => window.open(res.link, '_blank')}>
                          Visit Portal
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'progress' ? (
            <div className="registration-view">
              <div className="view-header">
                <BarChart2 size={24} color="#003366" />
                <h2>My Learning Progress</h2>
              </div>

              <div className="progress-dashboard-grid">
                {/* 1. Overall Progress Card */}
                <div className="progress-summary-card">
                  <div className="summary-left">
                    <h3>Overall Completion</h3>
                    <div className="progress-percentage">60%</div>
                    <div className="progress-bar-container" style={{ height: '10px' }}>
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <p>3 of 5 Modules Completed</p>
                  </div>
                  <div className="summary-right">
                    <div className="stat-item">
                      <Award size={20} color="#F59E0B" />
                      <span>2 Badges Earned</span>
                    </div>
                    <div className="stat-item">
                      <HelpCircle size={20} color="#3B82F6" />
                      <span>15 Topics Covered</span>
                    </div>
                  </div>
                </div>

                {/* 2. Completed Sections */}
                <div className="reg-section">
                  <h3><ShieldCheck size={20} /> Completed Sections</h3>
                  <div className="completed-list">
                    {[
                      { name: "Voter Registration", date: "Oct 24, 2025", status: "Complete" },
                      { name: "Voting Process", date: "Oct 26, 2025", status: "Complete" },
                      { name: "EVM Information", date: "Oct 28, 2025", status: "Complete" },
                      { name: "Results & Counting", date: "-", status: "Not Started" },
                      { name: "Quiz Zone", date: "-", status: "In Progress" }
                    ].map((sec, i) => (
                      <div key={i} className="completed-item">
                        <div className={`status-dot ${sec.status.toLowerCase().replace(' ', '-')}`}></div>
                        <div className="sec-info">
                          <strong>{sec.name}</strong>
                          <span>{sec.date === '-' ? sec.status : `Finished on ${sec.date}`}</span>
                        </div>
                        {sec.status === "Complete" && <ShieldCheck size={18} color="#10B981" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Next Recommended */}
                <div className="recommendation-card">
                  <div className="rec-header">
                    <Compass size={20} /> Next Recommended Section
                  </div>
                  <h4>Results & Counting</h4>
                  <p>Learn how your vote is counted and how winners are declared in Indian elections.</p>
                  <button className="primary-btn" onClick={() => setActiveTab('results')}>
                    Start Module
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'faqs' ? (
            <div className="registration-view">
              <div className="view-header">
                <HelpCircle size={24} color="#003366" />
                <h2>Frequently Asked Questions</h2>
              </div>

              <div className="faq-search-bar">
                <Search size={20} color="#94A3B8" />
                <input 
                  type="text" 
                  placeholder="Search for questions (e.g., 'EVM', 'Register')..." 
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                />
              </div>

              <div className="faq-accordion" role="region" aria-label="FAQ list">
                {filteredFaqs.map((faq, idx) => (
                  <div key={idx} className={`faq-item ${expandedFaq === idx ? 'expanded' : ''}`}>
                    <button className="faq-question" onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} aria-expanded={expandedFaq === idx} aria-controls={`faq-answer-${idx}`}>
                      <span>{faq.q}</span>
                      <ChevronDown size={18} aria-hidden="true" style={{ transform: expandedFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="faq-answer"
                        >
                          <p>{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="faq-footer">
                <p>Couldn't find what you were looking for?</p>
                <button className="primary-btn" onClick={() => setActiveTab('chat')}>
                  <MessageSquare size={18} /> Ask AI Assistant
                </button>
              </div>
            </div>
          ) : activeTab === 'timeline' ? (
            <div className="registration-view">
              <div className="view-header">
                <Clock size={24} color="#003366" />
                <h2>Election Schedule 2026</h2>
              </div>

              <div className="timeline-horizontal">
                {TIMELINE.map((step, idx) => (
                  <div key={idx} className={`timeline-h-item ${idx === 0 ? 'current' : ''}`}>
                    <div className="h-node" style={{ background: step.color }}>
                      {idx === 0 && <div className="current-pulse" style={{ background: step.color }}></div>}
                    </div>
                    <div className="h-content">
                      <strong>{step.stage}</strong>
                      <span>{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="upcoming-events-grid">
                <div className="event-highlight-card">
                  <div className="event-tag">UPCOMING EVENT</div>
                  <div className="event-main">
                    <Calendar size={32} color="#3B82F6" />
                    <div className="event-details">
                      <h3>Final Date for Registration</h3>
                      <p>Ensure your name is on the electoral roll before the deadline.</p>
                      <div className="event-date-badge">15 January 2026</div>
                    </div>
                  </div>
                </div>

                <div className="timeline-detail-list">
                  {TIMELINE.map((item, idx) => (
                    <div key={idx} className="detail-item">
                      <div className="detail-status" style={{ background: item.color }}></div>
                      <div className="detail-info">
                        <h4>{item.stage}</h4>
                        <p>Scheduled from {item.date}</p>
                      </div>
                      <span className="phase-status">
                        {idx === 0 ? "Current Phase" : "Upcoming"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'process' ? (
            <div className="registration-view">
              <div className="view-header">
                <BookOpen size={24} color="#003366" />
                <h2>The Election Lifecycle</h2>
              </div>

              <div className="lifecycle-timeline">
                {[
                  { 
                    title: "1. Voter Registration", 
                    desc: "The foundation of democracy. Eligible citizens register to get their names on the electoral roll.", 
                    icon: <User size={24} />,
                    color: "#3B82F6"
                  },
                  { 
                    title: "2. Candidate Nomination", 
                    desc: "Interested candidates file their nomination papers and are vetted for eligibility.", 
                    icon: <FileText size={24} />,
                    color: "#F59E0B"
                  },
                  { 
                    title: "3. Election Campaign", 
                    desc: "Candidates and parties share their manifestos and vision with the public to win support.", 
                    icon: <Mic size={24} />,
                    color: "#10B981"
                  },
                  { 
                    title: "4. Voting Day", 
                    desc: "Citizens visit polling stations to cast their votes securely using EVMs.", 
                    icon: <Compass size={24} />,
                    color: "#EF4444"
                  },
                  { 
                    title: "5. Counting of Votes", 
                    desc: "Votes are counted under strict supervision in counting centers in front of candidate agents.", 
                    icon: <Clock size={24} />,
                    color: "#8B5CF6"
                  },
                  { 
                    title: "6. Result Declaration", 
                    desc: "The Returning Officer officially announces the winner and the final results are gazetted.", 
                    icon: <Award size={24} />,
                    color: "#1E293B"
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="lifecycle-card"
                  >
                    <div className="lifecycle-icon-wrapper" style={{ borderColor: item.color, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="lifecycle-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                    {idx < 5 && <div className="lifecycle-connector"></div>}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : activeTab === 'badges' ? (
            <div className="registration-view">
              <div className="view-header">
                <Award size={24} color="#003366" />
                <h2>My Achievement Badges</h2>
              </div>

              <div className="badges-progress-card">
                <div style={{ flex: 1 }}>
                  <h3>Overall Completion</h3>
                  <p>You have unlocked 2 out of 3 badges!</p>
                  <div className="progress-bar-container" style={{ height: '12px', marginTop: '10px' }}>
                    <div className="progress-fill" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div className="badge-count-circle">
                  <span>2/3</span>
                </div>
              </div>

              <div className="badges-grid">
                {[
                  { 
                    id: 1, 
                    name: "Beginner Voter", 
                    desc: "Completed the basic voting process guide.", 
                    unlocked: true, 
                    color: "#10B981", 
                    icon: <ShieldCheck size={40} /> 
                  },
                  { 
                    id: 2, 
                    name: "Smart Learner", 
                    desc: "Finished the EVM security & myths module.", 
                    unlocked: true, 
                    color: "#3B82F6", 
                    icon: <BookOpen size={40} /> 
                  },
                  { 
                    id: 3, 
                    name: "Election Expert", 
                    desc: "Score 100% in all Quiz Zone topics.", 
                    unlocked: false, 
                    color: "#F59E0B", 
                    icon: <Award size={40} /> 
                  }
                ].map((badge) => (
                  <div key={badge.id} className={`badge-card ${!badge.unlocked ? 'locked' : ''}`}>
                    <div className="badge-visual" style={{ background: badge.unlocked ? `${badge.color}15` : '#F1F5F9', color: badge.unlocked ? badge.color : '#94A3B8' }}>
                      {badge.icon}
                      {!badge.unlocked && <div className="lock-overlay"><Clock size={16} /></div>}
                    </div>
                    <div className="badge-info">
                      <h4>{badge.name}</h4>
                      <p>{badge.desc}</p>
                      <span className={`status-tag ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                        {badge.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'chat' ? (
            <>
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ color: '#003366' }}>AI Election Assistant</h3>
                  <div className="status-indicator">
                    <div className="dot"></div> Online
                  </div>
                </div>
              </div>

              <div className="chat-messages" ref={scrollRef} role="log" aria-label="Chat messages" aria-live="polite">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div style={{ fontSize: '0.7rem', textAlign: 'right', marginTop: '4px', opacity: 0.7 }}>
                      {msg.time} {msg.role === 'user' && '✓✓'}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message ai-message">
                    <Loader2 className="animate-spin" size={18} />
                  </div>
                )}
              </div>

              <div className="quick-ask">
                <h4>Quick Ask</h4>
                <div className="suggestion-btns">
                  {SUGGESTIONS.map((s, idx) => (
                    <button key={idx} className="suggestion-btn" onClick={() => handleSend(s.en)}>
                      {s.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chat-input-area">
                <div className="input-container">
                  <input 
                    type="text" 
                    placeholder="Type your question here..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button className="icon-btn" aria-label="Voice input"><Mic size={20} aria-hidden="true" /></button>
                </div>
                <button className="send-btn" onClick={() => handleSend()} aria-label="Send message">
                  <Send size={20} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : activeTab === 'quiz' ? (
            <div className="registration-view">
              <div className="view-header">
                <Award size={24} color="#003366" />
                <h2>Quiz Zone: Test Your Knowledge</h2>
              </div>

              {!quizFinished ? (
                <div className="quiz-container">
                  <div className="quiz-progress">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                    <div className="progress-bar-container" style={{ height: '8px', marginTop: '10px' }}>
                      <div 
                        className="progress-fill" 
                        style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="quiz-card">
                    <h3 className="question-text">{QUIZ_QUESTIONS[currentQuestion].question}</h3>
                    <div className="options-grid">
                      {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                        <button
                          key={idx}
                          className={`option-btn ${selectedOption === idx ? 'selected' : ''} ${
                            showExplanation && idx === QUIZ_QUESTIONS[currentQuestion].correct ? 'correct' : ''
                          } ${
                            showExplanation && selectedOption === idx && idx !== QUIZ_QUESTIONS[currentQuestion].correct ? 'wrong' : ''
                          }`}
                          onClick={() => !showExplanation && setSelectedOption(idx)}
                          disabled={showExplanation}
                        >
                          <div className="option-radio">
                            {selectedOption === idx && <div className="radio-inner"></div>}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`explanation-box ${selectedOption === QUIZ_QUESTIONS[currentQuestion].correct ? 'success' : 'error'}`}
                      >
                        <strong>{selectedOption === QUIZ_QUESTIONS[currentQuestion].correct ? 'Correct!' : 'Incorrect'}</strong>
                        <p>{QUIZ_QUESTIONS[currentQuestion].explanation}</p>
                      </motion.div>
                    )}

                    <div className="quiz-actions">
                      {!showExplanation ? (
                        <button 
                          className="primary-btn" 
                          disabled={selectedOption === null}
                          onClick={() => {
                            setShowExplanation(true);
                            if (selectedOption === QUIZ_QUESTIONS[currentQuestion].correct) {
                              setQuizScore(prev => prev + 1);
                            }
                          }}
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button 
                          className="primary-btn"
                          onClick={() => {
                            if (currentQuestion + 1 < QUIZ_QUESTIONS.length) {
                              setCurrentQuestion(prev => prev + 1);
                              setSelectedOption(null);
                              setShowExplanation(false);
                            } else {
                              setQuizFinished(true);
                            }
                          }}
                        >
                          {currentQuestion + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'View Results'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="quiz-result-view">
                  <div className="result-card">
                    <div className="result-icon">
                      <Award size={48} color="#F59E0B" />
                    </div>
                    <h3>Quiz Completed!</h3>
                    <div className="final-score">
                      <span>Your Score</span>
                      <h2>{quizScore} / {QUIZ_QUESTIONS.length}</h2>
                    </div>
                    <p>
                      {quizScore === QUIZ_QUESTIONS.length 
                        ? "Perfect score! You are a master of the election process." 
                        : "Good job! Keep learning to become a more informed citizen."}
                    </p>
                    <div className="result-actions">
                      <button 
                        className="primary-btn" 
                        onClick={() => {
                          setCurrentQuestion(0);
                          setQuizScore(0);
                          setSelectedOption(null);
                          setShowExplanation(false);
                          setQuizFinished(false);
                        }}
                      >
                        Try Again
                      </button>
                      <button className="secondary-btn" onClick={() => setActiveTab('chat')}>
                        Back to Assistant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'results' ? (
            <div className="registration-view">
              <div className="view-header">
                <BarChart2 size={24} color="#003366" />
                <h2>Results & Counting Process</h2>
              </div>

              <div className="registration-grid">
                {/* Transparency Highlight */}
                <div className="transparency-banner">
                  <ShieldCheck size={20} />
                  Every step of counting is performed in the presence of candidate agents and independent observers.
                </div>

                {/* 1. Counting Process Timeline */}
                <div className="reg-section">
                  <h3><Clock size={20} /> How Votes are Counted</h3>
                  <div className="counting-timeline">
                    {[
                      { step: 1, title: "EVM Sealing", desc: "Machines are sealed with unique paper seals after polling ends." },
                      { step: 2, title: "Strong Room", desc: "EVMs are stored in multi-layer guarded strong rooms." },
                      { step: 3, title: "Counting Center", desc: "Strong rooms are opened on counting day in front of candidates." },
                      { step: 4, title: "Round-wise Counting", desc: "Control units are activated to show candidate-wise totals." },
                      { step: 5, title: "Result Declaration", desc: "Returning Officer (RO) declares the winner after all rounds." }
                    ].map((c, i) => (
                      <div key={i} className="counting-step">
                        <div className="step-num">{c.step}</div>
                        <div className="step-info">
                          <strong>{c.title}</strong>
                          <p>{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Sample Result Format */}
                <div className="reg-section">
                  <h3><BarChart2 size={20} /> Sample Election Result Format</h3>
                  <div className="sample-chart">
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '15px' }}>Example Visualization of Candidate-wise Votes:</p>
                    <div className="chart-bar-container">
                      {[
                        { party: "Party A", votes: "45,230", color: "#F97316", width: "85%" },
                        { party: "Party B", votes: "38,110", color: "#3B82F6", width: "70%" },
                        { party: "Party C", votes: "12,400", color: "#10B981", width: "25%" },
                        { party: "Others", votes: "5,600", color: "#64748B", width: "12%" }
                      ].map((p, i) => (
                        <div key={i} className="chart-row">
                          <div className="party-label">{p.party}</div>
                          <div className="bar-bg">
                            <div className="bar-fill" style={{ width: p.width, background: p.color }}></div>
                          </div>
                          <div className="vote-count">{p.votes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'evm' ? (
            <div className="registration-view">
              <div className="view-header">
                <Info size={24} color="#003366" />
                <h2>EVM & VVPAT: Secure Voting</h2>
              </div>

              <div className="registration-grid">
                {/* 1. What is EVM */}
                <div className="reg-section">
                  <h3><Bot size={20} /> What is an EVM?</h3>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
                    An Electronic Voting Machine (EVM) is a secure device used to cast and count votes. It consists of two units: the <strong>Control Unit</strong> (with the polling officer) and the <strong>Balloting Unit</strong> (in the voting compartment).
                  </p>
                  <div className="evm-features">
                    <div className="evm-feature">
                      <ShieldCheck size={20} color="#10B981" />
                      <span>Tamper-proof hardware</span>
                    </div>
                    <div className="evm-feature">
                      <PlayCircle size={20} color="#3B82F6" />
                      <span>Simple button-press interface</span>
                    </div>
                  </div>
                </div>

                {/* 2. VVPAT */}
                <div className="reg-section" style={{ background: '#EEF2FF' }}>
                  <h3><FileText size={20} /> What is VVPAT?</h3>
                  <p style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: '1.6' }}>
                    Voter Verifiable Paper Audit Trail (VVPAT) is an independent system that allows voters to verify that their votes are cast as intended.
                  </p>
                  <ul className="doc-list" style={{ marginTop: '10px' }}>
                    <li><div className="bullet"></div> Prints a slip showing candidate name & symbol</li>
                    <li><div className="bullet"></div> Slip is visible for 7 seconds</li>
                    <li><div className="bullet"></div> Slip is automatically dropped into a sealed box</li>
                  </ul>
                </div>

                {/* 3. Safety & Security */}
                <div className="reg-section">
                  <h3><ShieldCheck size={20} /> Safety & Security</h3>
                  <div className="security-grid">
                    <div className="security-item">
                      <strong>Non-Networked</strong>
                      <p>EVMs are stand-alone machines. They have NO internet, Wi-Fi, or Bluetooth connectivity.</p>
                    </div>
                    <div className="security-item">
                      <strong>One-Time Programmable</strong>
                      <p>The software is burnt into the chip at the time of manufacture and cannot be altered.</p>
                    </div>
                  </div>
                </div>

                {/* 4. Myth vs Fact */}
                <div className="reg-section myth-fact-section">
                  <h3><Award size={20} /> Myth vs Fact</h3>
                  <div className="myth-fact-table">
                    <div className="myth-row">
                      <div className="myth">
                        <span className="label myth-label">MYTH</span>
                        <p>EVMs can be hacked via the internet or mobile phones.</p>
                      </div>
                      <div className="fact">
                        <span className="label fact-label">FACT</span>
                        <p>EVMs are NOT connected to any network. Hacking them remotely is physically impossible.</p>
                      </div>
                    </div>
                    <div className="myth-row">
                      <div className="myth">
                        <span className="label myth-label">MYTH</span>
                        <p>The machine can be pre-programmed to favor one candidate.</p>
                      </div>
                      <div className="fact">
                        <span className="label fact-label">FACT</span>
                        <p>Rigorous multi-level testing (Mock Polls) is done before every election in front of all party agents.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'voting' ? (
            <div className="registration-view">
              <div className="view-header">
                <Compass size={24} color="#003366" />
                <h2>Election Day: Voting Process</h2>
              </div>

              {/* First Time Voter Guide Highlight */}
              <div className="highlight-card">
                <div className="highlight-icon">
                  <Award size={24} />
                </div>
                <div className="highlight-content">
                  <h3>First Time Voter Guide</h3>
                  <p>Welcome to the democratic process! Follow these 6 simple steps to cast your first vote securely.</p>
                </div>
              </div>

              <div className="voting-timeline">
                {[
                  { step: 1, title: "Arrival at Booth", desc: "Arrive at your assigned polling station with a valid ID proof.", icon: <MapPin size={20} /> },
                  { step: 2, title: "Identity Verification", desc: "First polling officer checks your name and ID proof.", icon: <ShieldCheck size={20} /> },
                  { step: 3, title: "Register Check", desc: "Second officer checks your name in the electoral roll and takes your signature.", icon: <Search size={20} /> },
                  { step: 4, title: "Ink Marking", desc: "Officer marks your left index finger with indelible ink.", icon: <Info size={20} /> },
                  { step: 5, title: "Cast Your Vote", desc: "Go to the voting compartment and press the blue button on the EVM next to your candidate.", icon: <User size={20} /> },
                  { step: 6, title: "VVPAT Confirmation", desc: "A slip appears in the VVPAT window for 7 seconds showing your choice.", icon: <Bot size={20} /> }
                ].map((s, idx) => (
                  <div key={idx} className="voting-step-card">
                    <div className="step-badge">{s.step}</div>
                    <div className="step-main">
                      <div className="step-title-row">
                        <div className="step-icon-bg">{s.icon}</div>
                        <strong>{s.title}</strong>
                      </div>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="registration-view">
              <div className="view-header">
                <User size={24} color="#003366" />
                <h2>Voter Registration Portal</h2>
              </div>

              <div className="registration-grid">
                {/* 1. Eligibility */}
                <div className="reg-section">
                  <h3><ShieldCheck size={20} /> 1. Eligibility Criteria</h3>
                  <div className="eligibility-cards">
                    <div className="eligibility-card">
                      <Clock size={24} color="#3B82F6" />
                      <div>
                        <strong>Age 18+</strong>
                        <p>Must be 18 years or above</p>
                      </div>
                    </div>
                    <div className="eligibility-card">
                      <MapPin size={24} color="#10B981" />
                      <div>
                        <strong>Citizen</strong>
                        <p>Must be an Indian citizen</p>
                      </div>
                    </div>
                    <div className="eligibility-card">
                      <Info size={24} color="#F59E0B" />
                      <div>
                        <strong>One Entry</strong>
                        <p>Not registered elsewhere</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Required Documents */}
                <div className="reg-section">
                  <h3><BookOpen size={20} /> 2. Required Documents</h3>
                  <ul className="doc-list">
                    <li><div className="bullet"></div> <strong>Age Proof:</strong> Birth Certificate / 10th Certificate</li>
                    <li><div className="bullet"></div> <strong>Address Proof:</strong> Aadhaar / Electricity Bill / Passport</li>
                    <li><div className="bullet"></div> <strong>Photo:</strong> Recent Passport Size Photograph</li>
                  </ul>
                </div>

                {/* 3. Registration Process */}
                <div className="reg-section">
                  <h3><Clock size={20} /> 3. Registration Process</h3>
                  <div className="process-timeline">
                    {[
                      { step: 1, title: "Fill Form 6", desc: "Online or Offline" },
                      { step: 2, title: "Upload", desc: "Attach documents" },
                      { step: 3, title: "Submit", desc: "Final application" },
                      { step: 4, title: "Verify", desc: "BLO visit" },
                      { step: 5, title: "Receive", desc: "EPIC Card delivery" }
                    ].map((p, i) => (
                      <div key={i} className="process-step">
                        <div className="step-num">{p.step}</div>
                        <div className="step-info">
                          <strong>{p.title}</strong>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Options */}
                <div className="reg-section">
                  <h3><Compass size={20} /> 4. Registration Options</h3>
                  <div className="option-btns">
                    <button className="primary-btn">Register Online (Voter's Portal)</button>
                    <button className="secondary-btn">Find Nearby Election Office</button>
                  </div>
                </div>

                {/* 5. Status Check */}
                <div className="reg-section status-check">
                  <h3><Search size={20} /> 5. Check Application Status</h3>
                  <div className="status-form">
                    <input type="text" placeholder="Enter Application ID (e.g., ABC1234567)" />
                    <button className="check-btn">Check Status</button>
                  </div>
                  <div className="status-result">
                    Status: <span className="pending">Pending Verification</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Panel */}
        <aside className="right-panel" role="complementary" aria-label="Election information panel">
          <div className="info-card">
            <div className="card-header">
              <Calendar size={18} /> Election Timeline
            </div>
            <div className="timeline-list">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="item-label">
                    <div className="timeline-dot" style={{ background: item.color }}></div>
                    {item.stage}
                  </div>
                  <div style={{ color: '#64748B' }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card" style={{ background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
            <div className="card-header" style={{ color: '#9A3412' }}>
              <HelpCircle size={18} /> Did You Know?
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9A3412', lineHeight: '1.6' }}>
              EVMs are fully secure, reliable, and 100% tamper-proof.
            </p>
            <a href="#" style={{ color: '#003366', fontSize: '0.85rem', fontWeight: '600', marginTop: '10px', display: 'block' }}>
              Learn More →
            </a>
          </div>

          <div className="info-card">
            <div className="card-header">
              <BarChart2 size={18} /> My Progress
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Learning Progress</div>
            <div className="progress-bar-container">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: '600' }}>60%</div>
            
            <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '15px' }}>Badges Earned</div>
            <div className="badge-row">
              <div className="badge" style={{ color: '#10B981' }}><ShieldCheck size={20} /></div>
              <div className="badge" style={{ color: '#3B82F6' }}><BookOpen size={20} /></div>
              <div className="badge" style={{ color: '#F59E0B' }}><Award size={20} /></div>
            </div>
            <a href="#" style={{ color: '#003366', fontSize: '0.85rem', fontWeight: '600', marginTop: '15px', display: 'block', textAlign: 'right' }}>
              View All →
            </a>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="main-footer" role="contentinfo">
        <div className="footer-top">
          <div style={{ fontSize: '0.9rem' }}>© 2026 Election Commission of India. All Rights Reserved.</div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Accessibility Statement</a>
            <a href="#">Help</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>भारत निर्वाचन आयोग की आधिकारिक वेबसाइट</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
