

// @ts-ignore
import React from '../react.js';

export const PlayIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M8 5v14l11-7z" })
  )
);

export const StopIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M6 6h12v12H6z" })
  )
);

export const EditIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" })
  )
);

export const DeleteIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" })
  )
);

export const AddIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" })
  )
);

export const ChartIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" })
  )
);

export const HomeIcon = ({ className }) => (
  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" })
  )
);

export const PlantIcon = ({ level = 0, className }) => {
  const plantLevels = [
    // Level 0: Seedling
    React.createElement("path", { key: "0", d: "M12 16v-1c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v1H10v-1c0-1.1.9-2 2-2h0c.55 0 1 .45 1 1", fill: "currentColor" }),

    // Level 1: Sprout
    React.createElement("g", { key: "1" },
      React.createElement("path", { d: "M12 18v-6" }),
      React.createElement("path", { d: "M12 12c-1.1 0-2-.9-2-2s2-4 2-4s2 1.9 2 4s-.9 2-2 2z", fill: "currentColor" })
    ),

    // Level 2: Small plant
    React.createElement("g", { key: "2" },
      React.createElement("path", { d: "M12 20v-9" }),
      React.createElement("path", { d: "M12 11c-2.21 0-4-1.79-4-4s4-6 4-6s4 3.79 4 6-1.79 4-4 4z", fill: "currentColor" }),
      React.createElement("path", { d: "M15 14s-2-1-2-3" }),
      React.createElement("path", { d: "M9 14s2-1 2-3" })
    ),

    // Level 3: Bushy plant
    React.createElement("g", { key: "3" },
      React.createElement("path", { d: "M12 22v-12" }),
      React.createElement("path", { d: "M12 10a5 5 0 0 0-5 5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3a5 5 0 0 0-5-5z", fill: "currentColor" }),
      React.createElement("path", { d: "M17 15s-2-1.5-2-4" }),
      React.createElement("path", { d: "M7 15s2-1.5 2-4" })
    ),

    // Level 4: Tree
    React.createElement("g", { key: "4" },
      React.createElement("path", { d: "M12 22V10", strokeWidth: "2" }),
      React.createElement("path", { d: "M12 10C8.69 10 6 7.31 6 4s2.69-4 6-4s6 2.69 6 4-2.69 6-6 6z", fill: "currentColor" })
    )
  ];

  return (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
      plantLevels[level] || plantLevels[0]
    )
  );
};