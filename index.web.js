import { registerRootComponent } from 'expo';
import React, { useState, useRef, useEffect, ErrorBoundary } from 'react';
import App from './App.web'; // Use original App.web since we fixed the issue
import CuratorApp from './CuratorApp';

// Error Boundary Component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// App Wrapper that intercepts bundle clicks
function AppWrapper({ onBundleClick }) {
  const appRef = useRef();

  return (
    <AppErrorBoundary>
      <div style={{ position: 'relative' }}>
        <App ref={appRef} />
      </div>
    </AppErrorBoundary>
  );
}

// Main Router Component
function MainRouter() {
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'bundle'
  const [selectedBundle, setSelectedBundle] = useState(null);

  const handleBundleNavigation = (bundleData) => {
    // Convert App.web.js bundle format to CuratorApp bundle format
    const curatorBundle = {
      id: bundleData.id,
      title: bundleData.title,
      creator: bundleData.creator?.name || bundleData.creator,
      verified: bundleData.creator?.verified || bundleData.verified,
      image: bundleData.coverImage || bundleData.image,
      description: `Curated by ${bundleData.creator?.name || bundleData.creator}`,
      items: bundleData.products ? bundleData.products.map(p => p.title) : [
        'Premium luggage set with 360° wheels',
        'Noise-canceling headphones', 
        'Universal travel adapter',
        'Compact packing cubes',
        'Travel-sized skincare essentials'
      ],
      tags: ['curated', 'premium'],
      price: `$${Math.floor(Math.random() * 2000 + 1000)}`
    };
    
    setSelectedBundle(curatorBundle);
    setCurrentView('bundle');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedBundle(null);
  };

  if (currentView === 'bundle') {
    return <CuratorApp onBack={handleBackToMain} selectedBundle={selectedBundle} />;
  }

  return <AppWrapper onBundleClick={handleBundleNavigation} />;
}

// Register the router as the main component
registerRootComponent(MainRouter); 