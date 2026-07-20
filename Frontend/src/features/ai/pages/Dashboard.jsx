import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../../components/Navbar';
import { generateReport, getUserReports, deleteReport } from '../services/interview.api';

const Dashboard = () => {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  // Fetch past reports on load
  const loadReports = async () => {
    try {
      setFetchingHistory(true);
      const data = await getUserReports();
      setReports(data.reports || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Job description is required.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await generateReport({
        jobDescription,
        resume,
        selfDescription
      });

      if (res && res.report) {
        navigate(`/reports/${res.report._id}`);
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to generate report. Check connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
        setReports(reports.filter((r) => r._id !== id));
      } catch (err) {
        alert('Failed to delete report.');
      }
    }
  };

  // Compute stats
  const totalReports = reports.length;
  const avgScore = totalReports > 0
    ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore || 0), 0) / totalReports)
    : 0;

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Hero Banner */}
        <section className="dashboard-hero">
          <div className="hero-title">
            <h1>AI Interview Intelligence</h1>
            <p>Paste a Job Description & Resume to generate custom questions, skill gap analysis, and a 7-day preparation roadmap.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="card" style={{ padding: '0.875rem 1.25rem', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary-600)' }}>{totalReports}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Analyses</div>
            </div>
            <div className="card" style={{ padding: '0.875rem 1.25rem', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--emerald-600)' }}>{avgScore}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Avg Score</div>
            </div>
          </div>
        </section>

        {/* Workspace Grid */}
        <div className="dashboard-grid">
          {/* Analysis Form Card */}
          <div className="card">
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>New Interview Assessment</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Fill in the fields below to trigger AI analysis.</p>
              </div>
              <span className="badge badge-indigo">Gemini 2.5 Flash</span>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--rose-50)',
                color: 'var(--rose-600)',
                border: '1px solid var(--rose-100)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="jobDescription">Target Job Description <span style={{ color: 'var(--rose-600)' }}>*</span></label>
                <textarea
                  id="jobDescription"
                  placeholder="Paste the full job post, role summary, key qualifications, or required tech stack here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="resume">Candidate Resume / CV Text</label>
                <textarea
                  id="resume"
                  placeholder="Paste candidate resume text, skills, past experience, and projects..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="selfDescription">Self Description / Specific Target Areas (Optional)</label>
                <input
                  type="text"
                  id="selfDescription"
                  placeholder="e.g. Seeking Senior React / Node.js position, want extra focus on System Design..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Generating AI Report...</span>
                  </>
                ) : (
                  'Analyze & Generate Preparation Strategy'
                )}
              </button>
            </form>
          </div>

          {/* Past Analyses History */}
          <div className="card">
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Saved Assessments</h3>
              <span className="badge badge-slate">{reports.length} Reports</span>
            </div>

            {fetchingHistory ? (
              <div className="loading-container" style={{ padding: '2rem 1rem' }}>
                <div className="loader-ring"></div>
                <p>Loading saved history...</p>
              </div>
            ) : reports.length === 0 ? (
              <div style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-app)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-light)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>No Reports Yet</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Generate your first assessment using the form to view technical questions and prep roadmaps here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                {reports.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => navigate(`/reports/${report._id}`)}
                    className="card card-hoverable"
                    style={{
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className={`badge ${
                        report.matchScore >= 80 ? 'badge-emerald' : report.matchScore >= 60 ? 'badge-amber' : 'badge-rose'
                      }`}>
                        {report.matchScore}% Match
                      </span>
                      <button
                        onClick={(e) => handleDelete(report._id, e)}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        title="Delete Report"
                      >
                        Delete
                      </button>
                    </div>

                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {report.jobDescription ? report.jobDescription.substring(0, 80) + '...' : 'Interview Analysis'}
                    </h4>

                    <div style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.75rem',
                      fontSize: '0.775rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>{new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>View Report →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
