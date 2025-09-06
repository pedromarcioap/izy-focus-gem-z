// @ts-ignore
import React from './react.js';
// @ts-ignore
import { createRoot } from './react-dom-client.js';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(App, null)
  )
);