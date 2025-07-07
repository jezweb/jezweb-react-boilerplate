# React Enterprise Application Template

A comprehensive boilerplate for building enterprise React applications with TypeScript, featuring modern state management, robust form handling, and scalable architecture patterns.

## 🏗️ Architecture Overview

This template implements a modular, feature-based architecture with clear separation of concerns and enterprise-grade patterns for state management, API communication, routing, and UI components.

### Key Technologies
- **React 19** with TypeScript
- **Vite** for blazing-fast builds
- **Zustand** for state management
- **React Router v7** for routing
- **React Hook Form + Yup** for forms
- **Axios** for HTTP requests
- **PrimeReact + Tailwind CSS** for UI
- **Framer Motion** for animations

## 📁 Project Structure

```
your-app-name/
├── src/
│   ├── assets/              # Static assets (images, fonts, styles)
│   ├── components/          # Shared UI components
│   ├── core/                # Core utilities and constants
│   ├── guards/              # Route guards for authentication
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layout components
│   ├── models/              # TypeScript interfaces and DTOs
│   ├── modules/             # Feature-based modules
│   ├── routes/              # Route configuration
│   ├── services/            # API services and business logic
│   └── stores/              # Zustand state management
├── public/                  # Public assets
├── .env                     # Environment variables
├── docker-compose.yml       # Docker configuration
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd your-app-name

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the app at http://localhost:4201
```

## 🏛️ Architecture Patterns

### 1. State Management (Zustand)

#### Basic Store Pattern
```typescript
// src/stores/user.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  user: User | null;
  updateUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
    }
  )
);
```

#### Resettable Store Pattern
```typescript
// src/stores/resettable-store.ts
export const createResettableStore = <T extends object>(
  initialState: Partial<T>,
  storeCreator: (set: any, get: any) => Partial<T>
) => {
  return create<T & { reset: () => void }>()((set, get) => {
    const resetFn = () => {
      const currentState = get();
      const methodsToKeep = {} as Partial<T>;
      
      Object.keys(currentState).forEach(key => {
        if (typeof currentState[key] === 'function' && key !== 'reset') {
          methodsToKeep[key as keyof T] = currentState[key];
        }
      });
      
      set({ ...initialState, ...methodsToKeep, reset: resetFn });
    };
    
    return {
      ...initialState,
      ...storeCreator(set, get),
      reset: resetFn
    };
  });
};
```

#### API Event Store (Pub-Sub Pattern)
```typescript
// src/stores/api-event-store.ts
interface ApiEvent {
  type: ApiEventType;
  status: ApiEventStatus;
  message?: string;
  spinner?: boolean;
  toast?: boolean;
}

export const useApiEventStore = create<ApiEventStore>((set, get) => ({
  currentEvent: null,
  subscribers: [],
  sendEvent: (event: ApiEvent) => {
    set({ currentEvent: event });
    get().subscribers.forEach(callback => callback(event));
  },
  subscribe: (callback: (event: ApiEvent | null) => void) => {
    set({ subscribers: [...get().subscribers, callback] });
    return () => {
      set({ subscribers: get().subscribers.filter(cb => cb !== callback) });
    };
  },
}));
```

### 2. HTTP Service Layer

#### Axios Configuration
```typescript
// src/services/axios-client.ts
import axios from 'axios';

const axiosApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
const handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    incrementRequests(); // Call Zustand action
    // Add common headers or logic here
    config.headers['Content-Type'] = 'application/json'; // Example custom header
    config.headers['Accept-Language'] = 'en'; // Example custom header


    if(!config.url) {
        return config;
    }

    config = processRequestUrl(config);
    config = addAuthorizationHeader(config);
    config = addAccessTokenHeader(config);

    return config;
};

const processRequestUrl = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // const matcher = API_URL_REGEX.exec(config.url);

    // config.url = `${BASE_API_URL}/${config.url}`
    config.url = `${BASE_API_URL}/${config.url}`

    return config;
}

const addAccessTokenHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const ACCESS_TOKEN_HEADER = import.meta.env.VITE_ACCESS_HEADER;

  const utcMillis = getUtcMillis();

  const encryptedToken =`${ACCESS_TOKEN}-${utcMillis}`;
  config.headers[ACCESS_TOKEN_HEADER] = encryptedToken; // Example custom header

  return config;
}

const addAuthorizationHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if(!isAuthUrl(config.url)) {
    const token = LocalStorageControl.get(CONST.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
  }

  return config;
}

const handleResponse = (response: AxiosResponse): AxiosResponse => {
  decrementRequests(); // Call Zustand action
  return response;
};

const handleResponseError = (error: any): Promise<AxiosResponse> => { // <--- MODIFIED return type
  decrementRequests(); // Call Zustand action

  const originalRequestConfig: InternalAxiosRequestConfig | undefined = error.config;

  // Ensure originalRequestConfig exists, it's a 401, and the message matches
  if (
    originalRequestConfig &&
    error.response?.status === 401 &&
    error.response?.data?.message === "Expired JWT Token"
  ) {
    // If handleTokenRefresh is successful, it returns a Promise<AxiosResponse>
    // from the retried request. This is now compatible with the function's return type.
    // If handleTokenRefresh itself fails (e.g., refresh token is invalid),
    // it will return a rejected promise, which will correctly propagate as an error
    // to the caller of the original axiosApiClient request.
    return handleTokenRefresh(originalRequestConfig);
  }

  // For all other errors, or if originalRequestConfig is missing,
  // reject the promise with the original error.
  return Promise.reject(error);
};


axiosApiClient.interceptors.request.use(handleRequest, (error) => Promise.reject(error)); // Simplified error handling for request interceptor setup
axiosApiClient.interceptors.response.use(handleResponse, handleResponseError);

export default axiosApiClient;
```

#### Service Pattern with API Events
```typescript
export enum ApiEventStatus {
    DEFAULT,
    IN_PROGRESS,
    COMPLETED,
    ERROR,
}


export interface ApiEvent {
    type: ApiEventType;
    status: ApiEventStatus;
    title?: string;
    message?: string;
    spinner?: boolean;
    popup?: boolean;
    toast?: boolean;
    targetId?: string | number;
}


export enum ApiEventType {
    DEFAULT,
}


// src/services/user.service.ts
export const userService = {
  async getUsers(): Promise<User[]> {
    const eventType = ApiEventType.GET_USERS;
    const apiEventStore = useApiEventStore.getState();
    
    // Send loading event
    apiEventStore.sendEvent({
      type: eventType,
      status: ApiEventStatus.IN_PROGRESS,
      spinner: true,
    });
    
    try {
      const response = await axiosApiClient.get('/users');
      
      // Send success event
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.COMPLETED,
        spinner: false,
      });
      
      return response.data;
    } catch (error) {
      // Send error event
      apiEventStore.sendEvent({
        type: eventType,
        status: ApiEventStatus.ERROR,
        message: 'Failed to fetch users',
        spinner: false,
        toast: true,
      });
      throw error;
    }
  },
};
```

### 3. Routing with Guards

#### Route Configuration
```typescript
// src/routes/index.tsx
import { RouteObject } from 'react-router';
import { lazy } from 'react';

const PublicModule = lazy(() => import('../modules/public'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicModule />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <AuthGuard><DashboardModule /></AuthGuard>,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
];

*Note use RouteObject for routing
```

#### Auth Guard Implementation
```typescript
// src/guards/AuthGuard.tsx
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('access-token');
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
```

### 4. Form Handling

#### Form Setup with React Hook Form + Yup
```typescript
// src/modules/auth/pages/LoginPage.tsx
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const LoginPage = () => {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      navigate('/dashboard');
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormInput name="email" label="Email" />
        <FormPassword name="password" label="Password" />
        <Button type="submit" disabled={!methods.formState.isValid}>
          Sign In
        </Button>
      </form>
    </FormProvider>
  );
};
```

#### Reusable Form Components
```typescript
// src/components/forms/FormInput.tsx
import { Controller, useFormContext } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, ...props }) => {
  const { control, formState: { errors } } = useFormContext();
  
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <InputText
              id={name}
              {...field}
              {...props}
              className={fieldState.invalid ? 'p-invalid' : ''}
            />
            {fieldState.error && (
              <small className="p-error">{fieldState.error.message}</small>
            )}
          </>
        )}
      />
    </div>
  );
};
```

### 5. Event Callback Patterns

#### Cross-Component Communication
```typescript

export enum ApiEventStatus {
    DEFAULT,
    IN_PROGRESS,
    COMPLETED,
    ERROR,
}


export interface ApiEvent {
    type: ApiEventType;
    status: ApiEventStatus;
    title?: string;
    message?: string;
    spinner?: boolean;
    popup?: boolean;
    toast?: boolean;
    targetId?: string | number;
}


export enum ApiEventType {
    DEFAULT,
}

// Component A - Sending events
const handleAction = () => {
  const apiEventStore = useApiEventStore.getState();
  apiEventStore.sendEvent({
    type: ApiEventType.USER_ACTION,
    status: ApiEventStatus.COMPLETED,
    message: 'Action completed successfully',
    toast: true,
  });
};

// Component B - Listening to events

const apiEventStore = useApiEventStore();

useEffect(() => {
  const unsubscribe = apiEventStore.subscribe((event) => {
            if (!event) return;
            // Use the factory pattern to handle different event statuses
            const eventStatusHandleMap = createEventStatusHandleMap(event);
            const handleEvent = eventStatusHandleMap[event.status] || (() => {});
            handleEvent();
          });
          return () => {
            unsubscribe(); 

          };
}, []);

const createEventStatusHandleMap = (
        apiEvent: ApiEvent, 
      ): { [key in ApiEventStatus]?: () => void } => {
        return {
          [ApiEventStatus.COMPLETED]: () => {
            // Event type handler map
            const eventTypeHandleMap: { [key in ApiEventType]?: () => void } = {
              [ApiEventType.GET_WORDPRESS_CONFERENCE_COMPLETE_ASSETS]: async () => {

              },
              [ApiEventType.ANOTHER_EVENT_TYPE]: async () => {
              
              },
            };
            const handleEventType = eventTypeHandleMap[apiEvent.type] || (() => {});
            handleEventType();
          },
          [ApiEventStatus.ERROR]: () => { },
          [ApiEventStatus.IN_PROGRESS]: () => {
          },
          [ApiEventStatus.DEFAULT]: () => {
          }
        };
    };
```

## 🧩 Module Structure

Each feature module follows this structure:

```
modules/
└── feature-name/
    ├── index.tsx           # Module entry point
    ├── routes.tsx          # Module routes
    ├── components/         # Module-specific components
    ├── pages/              # Page components
    ├── hooks/              # Module-specific hooks
    └── services/           # Module-specific services
```

### Module Template
```typescript
// src/modules/feature-name/index.tsx
import { Outlet } from 'react-router';
import { FeatureLayout } from './layouts/FeatureLayout';

const FeatureModule = () => {
  return (
    <FeatureLayout>
      <Outlet />
    </FeatureLayout>
  );
};

export default FeatureModule;
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_ACCESS_TOKEN=your-access-token
VITE_ACCESS_HEADER=X-Access-Token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4201,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./src/assets/*"]
    }
  }
}
```

## 📦 Key Dependencies

### Core
- `react`: ^19.0.0
- `typescript`: ^5.6.3
- `vite`: ^6.0.5

### State Management
- `zustand`: ^5.0.2

### Routing
- `react-router`: ^7.0.3

### Forms
- `react-hook-form`: ^7.54.2
- `yup`: ^1.6.1
- `@hookform/resolvers`: ^3.9.1

### UI Framework
- `primereact`: ^10.9.1
- `tailwindcss`: ^3.4.17

### HTTP Client
- `axios`: ^1.7.9

### Utilities
- `lodash`: ^4.17.21
- `dayjs`: ^1.11.13
- `framer-motion`: ^11.17.0

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **API Keys**: Use server-side proxy for third-party APIs
3. **Authentication**: Implement JWT refresh token rotation
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Always use HTTPS in production
6. **CSP Headers**: Configure Content Security Policy

## 📚 Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use composition over inheritance
   - Implement proper error boundaries

2. **State Management**
   - Use Zustand for global state
   - Keep component state local when possible
   - Implement proper cleanup in useEffect

3. **Performance**
   - Lazy load modules and components
   - Use React.memo for expensive components
   - Implement virtual scrolling for large lists

4. **Code Quality**
   - Follow consistent naming conventions
   - Write meaningful commit messages
   - Document complex business logic

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with patterns inspired by enterprise React applications
- Special thanks to the React, Zustand, and PrimeReact communities

---

For more information, please refer to the documentation or contact the development team.