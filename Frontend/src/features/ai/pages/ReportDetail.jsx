import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import Navbar from '../../../components/Navbar';
import { getReportById } from '../services/interview.api';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Accordion toggle states
  const [openTechIndex, setOpenTechIndex] = useState(0);
  const [openBehIndex, setOpenBehIndex] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReportById(id);
        setReport(data.report);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to load interview report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleCopy = (text, itemKey) => {
    navigator.clipboard.writeText(text);
    setCopiedId(itemKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="loading-container" style={{ padding: '6rem 1rem' }}>
            <div className="loader-ring"></div>
            <p style={{ fontWeight: '500' }}>Analyzing interview report data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Report Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error || 'This report may have been removed or does not exist.'}</p>
            <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const score = report.matchScore || 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreBadge = (s) => {
    if (s >= 85) return { text: 'Excellent Alignment', class: 'badge-emerald' };
    if (s >= 70) return { text: 'Strong Candidate', class: 'badge-emerald' };
    if (s >= 50) return { text: 'Moderate Fit', class: 'badge-amber' };
    return { text: 'High Skill Gap', class: 'badge-rose' };
  };

  const scoreBadge = getScoreBadge(score);

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Header Bar */}
        <section className="report-header">
          <div className="header-details">
            <Link to="/" className="back-link">
              ← Back to Workspace
            </Link>
            <h1>Interview Strategy Assessment</h1>
            <div className="meta">
              <span>Generated on {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              <span>•</span>
              <span className={`badge ${scoreBadge.class}`}>{scoreBadge.text}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
            <button onClick={() => window.print()} className="btn btn-secondary">
              🖨️ Export PDF / Print
            </button>
          </div>
        </section>

        {/* Top Grid: Match Score Gauge + Skill Gaps */}
        <div className="report-grid">
          {/* Match Score Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="score-ring">
              <svg width="120" height="120">
                <circle className="circle-bg" cx="60" cy="60" r={radius} />
                <circle
                  className="circle-progress"
                  cx="60"
                  cy="60"
                  r={radius}
                  style={{ strokeDasharray: circumference, strokeDashoffset }}
                />
              </svg>
              <div className="score-text">
                <span className="number">{score}%</span>
                <span className="label">Match</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Role Compatibility</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Based on key qualifications extracted from the job posting compared against the candidate experience profile.
              </p>
              <div style={{ marginTop: '0.75rem' }}>
                <span className={`badge ${scoreBadge.class}`}>{score}% Compatibility Score</span>
              </div>
            </div>
          </div>

          {/* Skill Gaps Card */}
          <div className="card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Key Skill Gaps</h3>
              <span className="badge badge-slate">{report.skillGaps ? report.skillGaps.length : 0} Identified</span>
            </div>

            {!report.skillGaps || report.skillGaps.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No critical skill gaps detected.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {report.skillGaps.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    <span>{item.skill}</span>
                    <span className={`badge ${
                      item.severity === 'high' ? 'badge-rose' : item.severity === 'medium' ? 'badge-amber' : 'badge-slate'
                    }`}>
                      {item.severity} priority
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Technical Questions Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Technical Interview Questions</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Custom question set with interviewer intent and high-scoring answers.</p>
            </div>
          </div>

          <div>
            {report.technicalQuestions && report.technicalQuestions.map((q, idx) => {
              const isOpen = openTechIndex === idx;
              const itemKey = `tech-${idx}`;
              return (
                <div key={idx} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="accordion-header"
                    onClick={() => setOpenTechIndex(isOpen ? -1 : idx)}
                  >
                    <span>Q{idx + 1}. {q.question}</span>
                    <span className="accordion-icon">▼</span>
                  </button>

                  {isOpen && (
                    <div className="accordion-body">
                      {q.intention && (
                        <div className="intention-box">
                          <strong>💡 Interviewer Intention:</strong> {q.intention}
                        </div>
                      )}

                      <div className="answer-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ color: 'var(--primary-700)', fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Model Solution
                          </strong>
                          <button
                            onClick={() => handleCopy(`Question: ${q.question}\n\nAnswer: ${q.answer}`, itemKey)}
                            className="btn btn-secondary btn-sm no-print"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedId === itemKey ? 'Copied! ✓' : '📋 Copy'}
                          </button>
                        </div>
                        <p style={{ whiteSpace: 'pre-line' }}>{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Behavioral Questions Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Behavioral & Leadership Scenarios</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>STAR method guidelines tailored to team dynamics and problem-solving.</p>
          </div>

          <div>
            {report.behavioralQuestions && report.behavioralQuestions.map((q, idx) => {
              const isOpen = openBehIndex === idx;
              const itemKey = `beh-${idx}`;
              return (
                <div key={idx} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="accordion-header"
                    onClick={() => setOpenBehIndex(isOpen ? -1 : idx)}
                  >
                    <span>Q{idx + 1}. {q.question}</span>
                    <span className="accordion-icon">▼</span>
                  </button>

                  {isOpen && (
                    <div className="accordion-body">
                      {q.intention && (
                        <div className="intention-box">
                          <strong>💡 Evaluation Focus:</strong> {q.intention}
                        </div>
                      )}

                      <div className="answer-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ color: 'var(--emerald-700)', fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            STAR Strategy & Framework
                          </strong>
                          <button
                            onClick={() => handleCopy(`Question: ${q.question}\n\nAnswer: ${q.answer}`, itemKey)}
                            className="btn btn-secondary btn-sm no-print"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedId === itemKey ? 'Copied! ✓' : '📋 Copy'}
                          </button>
                        </div>
                        <p style={{ whiteSpace: 'pre-line' }}>{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7-Day Preparation Roadmap */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>7-Day Preparation Roadmap</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Structured daily milestones to master candidate readiness.</p>
          </div>

          <div className="timeline">
            {report.preparationPlan && report.preparationPlan.map((plan, idx) => (
              <div key={idx} className="timeline-item">
                <div className="day-badge">Day {plan.day || idx + 1}</div>
                <h4>{plan.focus}</h4>
                <p>{plan.task}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportDetail;
