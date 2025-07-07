import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About This Template</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Architecture Overview</h2>
          <p className="text-gray-600 mb-4">
            This template implements a modular, feature-based architecture with clear separation of concerns
            and enterprise-grade patterns for state management, API communication, routing, and UI components.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Modern React with TypeScript for type safety</li>
            <li>Vite for fast development and optimized builds</li>
            <li>Zustand for lightweight state management</li>
            <li>React Router v7 for declarative routing</li>
            <li>React Hook Form with Yup validation</li>
            <li>Axios with interceptors for API communication</li>
            <li>PrimeReact and Tailwind CSS for UI</li>
            <li>Docker support for containerization</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
          <p className="text-gray-600 mb-4">
            The project follows a modular structure with feature-based organization:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><code>src/modules/</code> - Feature modules with their own pages, components, and services</li>
            <li><code>src/stores/</code> - Zustand state management stores</li>
            <li><code>src/services/</code> - API services and business logic</li>
            <li><code>src/components/</code> - Shared UI components</li>
            <li><code>src/guards/</code> - Route guards for authentication</li>
            <li><code>src/hooks/</code> - Custom React hooks</li>
            <li><code>src/core/</code> - Core utilities and constants</li>
          </ul>
        </section>
      </div>
    </div>
  );
};