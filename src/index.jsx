import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('Index.jsx loaded');
console.log('React version:', React.version);
console.log('ReactDOM available:', typeof ReactDOM);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            {this.state.error && this.state.error.toString()}
          </details>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

let hasRendered = false;

// Wait for DOM to be ready
const renderApp = () => {
  if (hasRendered) return;
  hasRendered = true;

  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }

  console.log('Root element found, rendering app...');
  
  try {
    ReactDOM.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>, 
      rootElement
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    // Fallback rendering
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Loading Error</h1>
        <p>Failed to load the application. Please refresh the page.</p>
        <button onclick="window.location.reload()">Refresh</button>
        <details style="margin-top: 20px; text-align: left;">
          <summary>Error Details</summary>
          <pre>${error.toString()}</pre>
        </details>
      </div>
    `;
  }
};

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}