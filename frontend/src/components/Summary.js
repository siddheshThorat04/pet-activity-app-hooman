import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
    
    
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/api/summary/today');
      setSummary(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = ({ value, max, label, unit }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    return (
      <div className="progress-item">
        <div className="progress-label">
          <span>{label}: </span>
          <strong>
            {value} {unit}
            {value !== 1 && unit === 'time' ? 's' : ''}
          </strong>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="summary-loading">Loading summary...</div>;
  if (error) return <div className="summary-error">{error}</div>;

  return (
    <div className="summary">
      <h2>Today's Summary</h2>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>🚶 Walks</h3>
          <p className="summary-value">
            {summary.walk.count} walk{summary.walk.count !== 1 ? 's' : ''}
          </p>
          <p className="summary-duration">
            Total: {summary.walk.totalDuration} minutes
          </p>
          <ProgressBar 
            value={summary.walk.count} 
            max={Math.max(3, summary.walk.count)} 
            label="Walks" 
            unit="time"
          />
        </div>

        <div className="summary-card">
          <h3>🍗 Meals</h3>
          <p className="summary-value">
            {summary.meal.count} meal{summary.meal.count !== 1 ? 's' : ''}
          </p>
          <ProgressBar 
            value={summary.meal.count} 
            max={Math.max(2, summary.meal.count)} 
            label="Meals" 
            unit="time"
          />
        </div>

        <div className="summary-card">
          <h3>💊 Medications</h3>
          <p className="summary-value">
            {summary.medication.count} dose{summary.medication.count !== 1 ? 's' : ''}
          </p>
          <ProgressBar 
            value={summary.medication.count} 
            max={Math.max(1, summary.medication.count)} 
            label="Meds" 
            unit="time"
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;