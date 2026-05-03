/**
 * @fileoverview RightPanel Component
 * @description Right sidebar with election timeline, trivia, and progress tracking
 * @component
 */
import React from 'react';
import { Calendar, HelpCircle, BarChart2, ShieldCheck, BookOpen, Award } from 'lucide-react';
import { TIMELINE } from '../../utils/constants';

/**
 * Right information panel with timeline, facts, and progress
 */
export default function RightPanel() {
  return (
    <aside className="right-panel" role="complementary" aria-label="Election information panel">
      <div className="info-card">
        <div className="card-header">
          <Calendar size={18} aria-hidden="true" /> Election Timeline
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
          <HelpCircle size={18} aria-hidden="true" /> Did You Know?
        </div>
        <p style={{ fontSize: '0.9rem', color: '#9A3412', lineHeight: '1.6' }}>
          EVMs are fully secure, reliable, and 100% tamper-proof.
        </p>
        <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#003366', fontSize: '0.85rem', fontWeight: '600', marginTop: '10px', display: 'block' }}>
          Learn More →
        </a>
      </div>

      <div className="info-card">
        <div className="card-header">
          <BarChart2 size={18} aria-hidden="true" /> My Progress
        </div>
        <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Learning Progress</div>
        <div className="progress-bar-container" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} aria-label="Learning progress">
          <div className="progress-fill" style={{ width: '60%' }}></div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.85rem', fontWeight: '600' }}>60%</div>

        <div style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '15px' }}>Badges Earned</div>
        <div className="badge-row">
          <div className="badge" style={{ color: '#10B981' }}><ShieldCheck size={20} aria-hidden="true" /></div>
          <div className="badge" style={{ color: '#3B82F6' }}><BookOpen size={20} aria-hidden="true" /></div>
          <div className="badge" style={{ color: '#F59E0B' }}><Award size={20} aria-hidden="true" /></div>
        </div>
      </div>
    </aside>
  );
}
