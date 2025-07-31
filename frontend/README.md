# Frontend Application

This directory contains the frontend application for ClickML's drag-and-drop interface.

## Structure

- `src/` - Source code for the frontend application
  - `components/` - Reusable React/Vue components for pipeline building
  - `pages/` - Main pages (dashboard, pipeline editor, model management)
  - `hooks/` - Custom hooks for state management
  - `utils/` - Utility functions and helpers
  - `assets/` - Static assets (images, styles, etc.)
- `public/` - Public assets and index.html
- `tests/` - Frontend test files

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Technologies

- React/Vue.js for UI framework
- TypeScript for type safety
- Axios for API communication
- React Flow/Vue Flow for drag-and-drop pipeline builder
- Tailwind CSS for styling