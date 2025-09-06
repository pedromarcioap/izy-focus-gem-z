

// @ts-ignore
import React from '../react.js';
import { HomeIcon, ChartIcon } from './icons.tsx';

const Header = ({ currentView, setView }) => {
  const NavButton = ({ view, targetView, onClick, children }) => (
    React.createElement("button", {
      onClick: onClick,
      className: `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
        view === targetView
          ? 'bg-brand text-navy'
          : 'text-lightest-slate hover:bg-light-navy hover:text-brand'
      }`,
      "aria-current": view === targetView ? 'page' : undefined
    },
      children
    )
  );

  return (
    React.createElement("header", { className: "bg-light-navy/80 backdrop-blur-sm sticky top-0 z-20 flex-shrink-0" },
      React.createElement("nav", { className: "flex justify-between items-center p-3" },
        React.createElement("h1", { className: "text-lg font-bold text-lightest-slate tracking-tighter" },
          "Izy ", React.createElement("span", { className: "text-brand" }, "Focus")
        ),
        React.createElement("div", { className: "flex items-center gap-2" },
          React.createElement(NavButton, { view: currentView, targetView: "DASHBOARD", onClick: () => setView('DASHBOARD') },
            React.createElement(HomeIcon, { className: "w-5 h-5" }),
            React.createElement("span", { className: "text-xs" }, "Dashboard")
          ),
          React.createElement(NavButton, { view: currentView, targetView: "STATS", onClick: () => setView('STATS') },
            React.createElement(ChartIcon, { className: "w-5 h-5" }),
            React.createElement("span", { className: "text-xs" }, "Stats")
          )
        )
      )
    )
  );
};

export default Header;