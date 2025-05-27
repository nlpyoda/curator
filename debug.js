// Debug script to check for common React Native Web issues
const fs = require('fs');
const path = require('path');

// Check if main.js file exists and has content
try {
  const mainJsPath = path.join(__dirname, 'web-build/static/js/main.ebfd71ef.js');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
  
  console.log('Main JS file exists and has content:', mainJsContent.length > 0);
  
  // Check for common React Native Web issues
  const hasReactNativeWeb = mainJsContent.includes('react-native-web');
  const hasAppRoot = mainJsContent.includes('curatorapp52');
  const hasAppComponent = mainJsContent.includes('App');
  
  console.log('Contains react-native-web references:', hasReactNativeWeb);
  console.log('Contains app root references:', hasAppRoot);
  console.log('Contains App component references:', hasAppComponent);
  
  // Check for potential entry point issues
  const indexHtmlPath = path.join(__dirname, 'web-build/index.html');
  const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  
  console.log('Root div exists:', indexHtmlContent.includes('<div id="root"></div>'));
  
} catch (error) {
  console.error('Error checking files:', error);
}

// Check if App.web.js is correctly named as the entry point
try {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('Main entry point in package.json:', packageJson.main);
  console.log('Is App.web.js the entry point:', packageJson.main === 'App.web.js');
  
} catch (error) {
  console.error('Error checking package.json:', error);
} 