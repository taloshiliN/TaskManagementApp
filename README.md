# Task Management App

This is a modern task management application built with React, TypeScript, and Firebase. Features user authentication with Firebase Auth and data storage with Firestore.

FEATURES
- User Authentication (Login/Register) with Firebase Auth
- Task Management (Coming Soon)
- Modern UI with Tailwind CSS
- Responsive Design
- Real-time Data with Firestore

Tech Stack
- Frontend: React 19, TypeScript, Vite
- styling: Tailwind CSS
- Authentication: Firebase Auth
- Database: Firestore
- Forms: React Hook Form
- Routing: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd taskmanagementapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Copy `.env.example` to `.env` and fill in your Firebase configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure Firebase:
   - Go to your Firebase project settings
   - Copy your project configuration
   - Update the `.env` file with your Firebase config values

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add project" or use an existing project

2. **Enable Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider

3. **Enable Firestore**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" for development

4. **Get Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Web app" icon to create a new web app
   - Copy the configuration object

5. **Update Environment Variables**:
   - Copy the values from Firebase config to your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

6. **Deploy Firestore Security Rules** (Required for Registration):
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login to Firebase: `firebase login`
   - Set your project: `firebase use your-project-id`
   - Deploy security rules: `firebase deploy --only firestore:rules`
   - This is required to allow user registration to work properly

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthForm.tsx    # Base authentication form
│   ├── LoginForm.tsx   # Login form component
│   └── RegisterForm.tsx # Registration form component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # External service configurations
│   └── firebase.ts    # Firebase configuration
├── pages/             # Page components
│   ├── home.tsx       # Home page
│   ├── login.tsx      # Login page
│   └── register.tsx   # Register page
└── hooks/             # Custom React hooks
```

## Authentication Flow

1. **Registration**: Users can create accounts with email/password
2. **Login**: Users can sign in with their credentials
3. **Persistent Sessions**: Users stay logged in across browser sessions (until explicitly logged out)
4. **Session Management**: Authentication state is managed globally
5. **User Data**: User profiles are stored in Firestore

### Testing Persistent Authentication

To test that authentication persists across browser sessions:

1. **Register/Login**: Create an account or log in to an existing account
2. **Verify Login**: Check that you're logged in and can access protected content
3. **Close Browser**: Completely close the browser application
4. **Reopen Browser**: Navigate back to the application
5. **Check Persistence**: You should still be logged in without needing to sign in again

**Note**: If you're using incognito/private browsing mode, persistence may not work as expected due to browser security restrictions.

## Task Management System

The application includes a complete task management system with the following features:

### Features

- **📋 View Tasks**: Display all your tasks in a clean, organized list
- **➕ Add Tasks**: Create new tasks with title and description using the green "Add Task" button
- **👁️ View Details**: Click on any task to open a dialog showing full details
- **✏️ Edit Tasks**: Modify task title and description directly from the task dialog
- **🗑️ Delete Tasks**: Remove tasks with confirmation dialog
- **🔒 Security**: All tasks are secured - users can only access their own tasks
- **📊 Real-time**: Tasks update in real-time across all browser sessions

### Task Data Structure

Each task stored in Firestore contains:
- `title`: Task title (required)
- `description`: Task description (required)
- `createdAt`: Timestamp when task was created
- `updatedAt`: Timestamp when task was last modified
- `ownerId`: User ID of the task owner (automatically set)

### Testing Task Management

1. **Add a Task**:
   - Click the green "Add Task" button
   - Fill in a title and description
   - Click "Add Task" to save

2. **View Task Details**:
   - Click on any task in the list
   - A dialog will open showing full task details
   - View creation and update timestamps

3. **Edit a Task**:
   - In the task dialog, click the edit (pencil) icon
   - Modify the title and/or description
   - Click "Save" to update

4. **Delete a Task**:
   - In the task dialog, click the delete (trash) icon
   - Confirm deletion in the popup dialog
   - Task will be permanently removed

5. **Test Security**:
   - Create tasks with one user account
   - Log out and log in with a different account
   - Verify that tasks from the first account are not visible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
