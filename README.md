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

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the app at http://localhost:4201
```

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

## 📚 Architecture Patterns

### State Management (Zustand)
The project uses Zustand for lightweight state management with persistence support and resettable stores.

### API Service Layer
Axios is configured with interceptors for authentication, error handling, and automatic token refresh.

### Form Handling
React Hook Form with Yup validation provides robust form management with reusable form components.

### Routing with Guards
React Router v7 with authentication guards ensures protected routes are secure.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.