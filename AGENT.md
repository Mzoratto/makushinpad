# Shin Shop Agent Guide

## Commands
- Build: `npm run build` - Builds the Gatsby site for production
- Develop: `npm run develop` or `npm start` - Starts the development server
- Serve: `npm run serve` - Serves the production build locally
- Clean: `npm run clean` - Clears the cache and public directories
- Typecheck: `npm run typecheck` - Runs TypeScript type checking

## Code Style Guidelines
- **TypeScript**: Strict mode is enabled. Use explicit types for all functions and interfaces.
- **Components**: Use functional components with React.FC type annotation.
- **Props**: Define interfaces for component props (e.g., ComponentNameProps).
- **Styling**: Use Tailwind CSS for styling components. Custom colors are defined in tailwind.config.js.
- **Imports**: Group imports with React first, followed by third-party libraries, then local imports.
- **Formatting**: Use 2-space indentation.
- **Naming**: Use PascalCase for components and interfaces, camelCase for variables and functions.
- **File Structure**: Components in src/components, pages in src/pages, templates in src/templates.
- **Error Handling**: Use try/catch for async operations with appropriate user feedback.