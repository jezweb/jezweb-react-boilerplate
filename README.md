# React Enterprise Application Boilerplate

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

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-boilerplate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Docker Setup

#### Prerequisites for Docker
- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 4GB of available RAM for Docker
- Port 4201 available on your host machine

#### Running with Docker

1. **Build and run the container:**
```bash
# Build the Docker image and start the container
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

2. **Access the application:**
- Open your browser and navigate to `http://localhost:4201`
- The development server will hot-reload on file changes

3. **View container logs:**
```bash
# View logs from the running container
docker-compose logs -f reactjs

# View only the last 100 lines
docker-compose logs --tail=100 reactjs
```

4. **Stop the container:**
```bash
# Stop the container (Ctrl+C if running in foreground)
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

#### Docker Development Workflow

1. **Entering the container shell:**
```bash
# Access the container's bash shell
docker-compose exec reactjs bash

# Run npm commands inside the container
docker-compose exec reactjs npm install <package-name>
docker-compose exec reactjs npm run test
```

2. **Rebuilding after dependency changes:**
```bash
# When you add new dependencies, rebuild the image
docker-compose build --no-cache
docker-compose up
```

3. **Using Docker volumes:**
- Your source code is mounted as a volume, so changes are reflected immediately
- Node modules are stored in a named volume to improve performance
- To reset node_modules: `docker-compose down -v && docker-compose up --build`

#### Docker Configuration Details

The project uses:
- **Base Image**: Node.js 20.x on a Java-enabled image (for potential backend integration)
- **Port**: 4201 (mapped from container to host)
- **Volumes**: 
  - Source code mounted at `/app`
  - Named volume for `node_modules` to prevent conflicts
- **Environment**: Development mode with hot-reload enabled

#### Docker Troubleshooting

**Common Issues and Solutions:**

1. **Port 4201 already in use:**
```bash
# Check what's using the port
lsof -i :4201  # Mac/Linux
netstat -ano | findstr :4201  # Windows

# Change the port in docker-compose.yml
ports:
  - "4202:4201"  # Use 4202 instead
```

2. **Container fails to start with npm errors:**
```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker system prune -f
docker-compose build --no-cache
docker-compose up
```

3. **Hot reload not working:**
```bash
# Ensure CHOKIDAR_USEPOLLING is set in docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true
```

4. **Permission issues on Linux:**
```bash
# Run with your user ID
docker-compose run --user $(id -u):$(id -g) reactjs npm install
```

5. **Out of memory errors:**
```bash
# Increase Docker memory allocation (Docker Desktop settings)
# Or add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 4G
```

6. **Slow performance on Windows/Mac:**
- Use WSL2 on Windows for better performance
- Exclude node_modules from volume mounts
- Consider using Docker Desktop's performance tuning options

## 📁 Project Structure

```
react-boilerplate/
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

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🔧 Configuration

### Environment Variables
Create a `.env` file based on `.env.example`:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_ACCESS_TOKEN=your-access-token
VITE_ACCESS_HEADER=X-Access-Token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

## 📚 Architecture & Design Patterns

This boilerplate implements several enterprise-grade design patterns to ensure scalability, maintainability, and code reusability.

### 1. Module-Based Architecture

The application follows a feature-first modular structure where each major feature is self-contained:

```
src/modules/
├── auth/                    # Authentication module
│   ├── index.tsx           # Module entry point
│   ├── components/         # Module-specific components
│   ├── pages/             # Page components (Login, Register)
│   └── layouts/           # Module layouts
├── dashboard/              # Protected dashboard module
│   ├── index.tsx          
│   ├── components/        
│   └── pages/            
└── public/                # Public pages module
    ├── index.tsx         
    ├── components/       
    └── pages/           
```

**Benefits:**
- Clear separation of concerns
- Easy to add/remove features
- Improved code organization
- Better team collaboration

### 2. Service Layer Pattern

All API communication is abstracted into service classes:

```typescript
// Example: auth.service.ts
export class AuthService {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    // API call logic
    // Store state updates
    // Event publishing
  }
}
```

**Key Features:**
- Centralized API logic
- Consistent error handling
- Integration with state management
- Request/response interceptors
- Automatic token management

### 3. State Management with Zustand

Lightweight, TypeScript-first state management with persistence:

```typescript
// Example: user.store.ts
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
```

**Store Types:**
- **Persisted Stores**: User data, preferences
- **Session Stores**: Temporary UI state
- **Event Stores**: API event tracking
- **Resettable Stores**: Form data, wizards

### 4. Component Patterns

#### a) Compound Components
Complex UI components are broken down into smaller, composable parts:

```typescript
// Example usage
<Form onSubmit={handleSubmit}>
  <Form.Input name="email" />
  <Form.Password name="password" />
  <Form.Submit>Login</Form.Submit>
</Form>
```

#### b) Container/Presentational Pattern
- **Containers**: Handle business logic and state
- **Presentational**: Pure UI components

#### c) Higher-Order Components (HOCs)
- Route guards (AuthGuard, GuestGuard)
- Error boundaries
- Loading wrappers

### 5. Form Architecture

Robust form handling with React Hook Form and Yup:

```typescript
// Reusable form components
<FormProvider {...methods}>
  <FormInput 
    name="email" 
    label="Email"
    rules={{ required: 'Email is required' }}
  />
</FormProvider>
```

**Features:**
- Centralized validation schemas
- Reusable form components
- Error handling
- Field-level validation
- Form state persistence

### 6. Routing Architecture

Modular routing with lazy loading and guards:

```typescript
// Protected routes
<Route element={<AuthGuard />}>
  <Route path="/dashboard/*" element={<DashboardModule />} />
</Route>

// Public routes
<Route element={<GuestGuard />}>
  <Route path="/auth/*" element={<AuthModule />} />
</Route>
```

### 7. API Event System

Custom event system for tracking API calls:

```typescript
// Automatic API event tracking
useApiEvent('user-fetch', {
  onSuccess: (data) => console.log('User fetched:', data),
  onError: (error) => console.error('Fetch failed:', error),
});
```

### 8. Error Handling Strategy

Multi-level error handling:
- **Component Level**: Error boundaries
- **API Level**: Axios interceptors
- **Form Level**: Validation errors
- **Global Level**: Toast notifications

### 9. Performance Patterns

- **Code Splitting**: Lazy loading for modules
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists
- **Optimistic Updates**: Immediate UI feedback

### 10. Testing Strategy

- **Unit Tests**: Components and utilities
- **Integration Tests**: API services
- **E2E Tests**: Critical user flows
- **Test Utils**: Custom render helpers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.