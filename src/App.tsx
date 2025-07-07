import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { Spinner } from './components/ui/Spinner';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

// PrimeReact imports
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const router = createBrowserRouter(routes);

function App() {
  const toast = useRef<Toast>(null);

  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner size="80px" />
          </div>
        }
      >
        <RouterProvider router={router} />
        <LoadingOverlay />
        <Toast ref={toast} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;