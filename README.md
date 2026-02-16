# 🚀 TaskFlow

**TaskFlow** is a high-fidelity, standalone SaaS task management application built with a modern React stack. It features a completely decoupled architecture, using browser `localStorage` for data persistence, making it a perfect example of a robust, backend-less web application.

![TaskFlow Header](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/layout-dashboard.svg)

## ✨ Features

- **🎯 Workspaces & Boards**: Organize your projects into high-level workspaces and detailed boards.
- **🔄 Drag & Drop**: Seamlessly move tasks between lists with a smooth, interactive experience powered by `@dnd-kit`.
- **🔐 Mock Authentication**: Fully functional login and registration system that persists users locally.
- **💾 Local Persistence**: All your data—workspaces, boards, lists, and cards—is saved in your browser's local storage.
- **🎨 Premium UI/UX**: Built with Tailwind CSS, featuring a clean, responsive, and accessible design with Lucide icons.
- **⚡ High Performance**: Powered by Vite for near-instant development and optimized production builds.

## 🛠️ Tech Stack

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Drag-and-Drop**: [@dnd-kit](https://dnd-kit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/taskflow.git
   cd taskflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

Since the application uses mock authentication, you can use the following pre-loaded credentials to explore the features immediately:

- **Email**: `demo@example.com`
- **Password**: `demo123` (or any string)

## 🏗️ Architecture

The app uses a **Mock Service Layer** to replace a traditional backend:
- **`src/lib/mockStorage.ts`**: Acts as the local database, handling all CRUD operations with `localStorage`.
- **`src/features/*/services/`**: Services are implemented to interact with the `mockStorage` instead of making API calls, ensuring a fast and zero-config experience.

## 📂 Project Structure

```bash
src/
├── api/             # API client configuration (mocked)
├── components/      # Shared UI components (Button, Input, etc.)
├── features/        # Feature-based modules (Auth, Boards, Cards)
│   ├── */components # Feature-specific UI
│   ├── */hooks      # Custom business logic hooks
│   ├── */services   # Mocked backend interactions
│   └── */store      # State management (Zustand)
├── lib/             # Core utilities and Mock Storage
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
