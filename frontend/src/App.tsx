import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'https://zkdpops8k4.execute-api.us-east-1.amazonaws.com/prod';

interface FeedbackItem {
  feedbackId: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: string;
}

interface SentimentResult {
  feedbackId: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: string;
}

function App() {
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<SentimentResult | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`);
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbackHistory(data.items || []);
    } catch (err) {
      setError('Failed to load feedback history');
      console.error('Error fetching feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeFeedback = async () => {
    if (!feedbackText.trim()) {
      setError('Please enter some feedback text');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: feedbackText }),
      });

      if (!response.ok) throw new Error('Failed to analyze sentiment');
      
      const result = await response.json();
      setCurrentResult(result);
      setFeedbackText('');
      
      // Refresh the feedback history
      await fetchFeedbackHistory();
    } catch (err) {
      setError('Failed to analyze sentiment');
      console.error('Error analyzing sentiment:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const getSentimentStats = () => {
    const total = feedbackHistory.length;
    if (total === 0) return { positive: 0, negative: 0, neutral: 0 };
    
    const positive = feedbackHistory.filter(item => item.sentiment === 'positive').length;
    const negative = feedbackHistory.filter(item => item.sentiment === 'negative').length;
    const neutral = feedbackHistory.filter(item => item.sentiment === 'neutral').length;
    
    return {
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100)
    };
  };

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  const stats = getSentimentStats();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sentiment Analysis Dashboard</h1>
        <p>Analyze customer feedback sentiment in real-time</p>
      </header>

      <main className="main-content">
        {/* Feedback Input Section */}
        <section className="feedback-input">
          <h2>Submit Feedback for Analysis</h2>
          <div className="input-group">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter customer feedback here..."
              rows={4}
              disabled={isAnalyzing}
            />
            <button 
              onClick={analyzeFeedback}
              disabled={isAnalyzing || !feedbackText.trim()}
              className="analyze-btn"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </section>

        {/* Current Result Display */}
        {currentResult && (
          <section className="current-result">
            <h2>Latest Analysis Result</h2>
            <div className="result-card">
              <div className="sentiment-display">
                <span className="sentiment-emoji">
                  {getSentimentEmoji(currentResult.sentiment)}
                </span>
                <div className="sentiment-info">
                  <h3 style={{ color: getSentimentColor(currentResult.sentiment) }}>
                    {currentResult.sentiment.toUpperCase()}
                  </h3>
                  <p>Confidence: {Math.round(currentResult.confidence * 100)}%</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Statistics Dashboard */}
        {feedbackHistory.length > 0 && (
          <section className="statistics">
            <h2>Sentiment Distribution</h2>
            <div className="stats-grid">
              <div className="stat-card positive">
                <h3>{stats.positive}%</h3>
                <p>Positive</p>
              </div>
              <div className="stat-card negative">
                <h3>{stats.negative}%</h3>
                <p>Negative</p>
              </div>
              <div className="stat-card neutral">
                <h3>{stats.neutral}%</h3>
                <p>Neutral</p>
              </div>
            </div>
          </section>
        )}

        {/* Feedback History */}
        <section className="feedback-history">
          <h2>Feedback History ({feedbackHistory.length} items)</h2>
          {isLoading ? (
            <div className="loading">Loading feedback history...</div>
          ) : feedbackHistory.length === 0 ? (
            <div className="no-data">No feedback analyzed yet. Submit some feedback above!</div>
          ) : (
            <div className="history-list">
              {feedbackHistory.map((item) => (
                <div key={item.feedbackId} className="history-item">
                  <div className="history-header">
                    <span 
                      className="sentiment-badge"
                      style={{ backgroundColor: getSentimentColor(item.sentiment) }}
                    >
                      {getSentimentEmoji(item.sentiment)} {item.sentiment}
                    </span>
                    <span className="confidence">
                      {Math.round(item.confidence * 100)}% confidence
                    </span>
                    <span className="timestamp">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="feedback-text">
                    "{item.text}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
