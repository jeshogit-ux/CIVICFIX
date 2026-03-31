import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', background: '#000', minHeight: '100vh' }}>
          <h2>React Crash Report:</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
