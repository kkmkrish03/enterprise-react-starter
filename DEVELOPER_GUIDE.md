# Developer Guide & Manual

Welcome to your Enterprise Frontend Platform! Because this project uses an **NX Monorepo Architecture**, the codebase is split into highly modular libraries rather than a single monolithic `src` folder. This ensures the app remains scalable, maintainable, and robust.

This document will teach you exactly how to use the platform and where to go to make specific changes.

---

## 🚀 How to Run the Project

### 1. Initial Setup
The project provides automated setup scripts that create environment configuration files and install workspace dependencies:

- **On Windows (PowerShell):**
  ```powershell
  ./setup.ps1
  ```
- **On Linux / macOS (Bash):**
  ```bash
  chmod +x setup.sh
  ./setup.sh
  ```

#### 📦 Client-Side Database (SQLite WASM)
In development mode, the platform runs a local-first SQL database running directly in the browser via `sql.js` (WebAssembly-based SQLite).
- All DTO CRUD queries are executed directly on the client.
- The binary database file is automatically exported and base64-encoded to `localStorage` (`mock_sqlite_db_base64`) on mutations, keeping mock data persistent across page reloads.
- To clear the database and restore default records, clear your browser's local storage.

### 2. Start the Development Server
To run the admin application locally with Hot Module Replacement (HMR):
```bash
npm run dev
```
Navigate to **`http://localhost:4200`** in your browser.
*(Login with `admin@example.com` / `password`)*

### 3. Other Useful Commands
- **`npm run build`**: Compiles the application for production (output goes to `dist/apps/admin`).
- **`npm run lint`**: Runs ESLint across all apps and libraries.
- **`npm run format`**: Formats all code using Prettier.

---

## 🗺️ Where to Make Changes

If you want to modify a specific part of the application, look for the corresponding section below to find the exact file.

### 📍 1. Routing & Adding New Pages
*Where do I add a new route (e.g., `/reports`) or change the route guard?*

- **File to Edit:** `apps/admin/src/app/app.tsx`
- **What it does:** This is the brain of the application. It initializes React Router v7, wraps the app in Global Contexts (Auth, Tenant, Theme), and maps URL paths to your feature components.
- **How to add a page:** Import your new feature component and add a `<Route path="/reports" element={<Reports />} />` inside the `<Routes>` block.

### 📍 2. Layouts, Sidebars, and Navbars
*Where do I add a new link to the sidebar, change the header, or alter the shell layout?*

- **File to Edit:** `libs/platform/ui/src/lib/layouts/DashboardLayout.tsx`
- **What it does:** This provides the main App Shell (Sidebar, Header, Main Content Area) for all protected routes. 
- **To change the login screen layout:** Edit `libs/platform/ui/src/lib/layouts/AuthLayout.tsx`

### 📍 3. Creating a New Feature
*Where should I write the code for a brand new page like "Invoices"?*

1. **Do not put it in `apps/admin`!** Keep the monorepo modular.
2. **Generate a new library:** Run this command in your terminal:
   ```bash
   npx nx g @nx/react:lib libs/features/invoices --bundler=vite --unitTestRunner=vitest --style=css
   ```
3. **Write your code:** Navigate to `libs/features/invoices/src/lib/invoices.tsx` and build your React component.
4. **Wire it up:** Go back to `apps/admin/src/app/app.tsx`, import your new `Invoices` component, and add it to a Route.

### 📍 4. Authentication Logic
*Where do I connect the app to my real backend, Firebase, Auth0, or JWT API?*

- **File to Edit:** `libs/platform/core/src/lib/auth/MockAuthAdapter.ts`
- **What it does:** Currently, this file hardcodes `admin@example.com` and `password`. 
- **How to change it:** Create a new adapter (e.g., `FirebaseAuthAdapter.ts`) that implements the `AuthAdapter` interface. Then, open `apps/admin/src/app/app.tsx` and swap `const authAdapter = new MockAuthAdapter();` with your new real adapter.

### 📍 5. Global Styles, Tailwind & Theming
*Where do I change the default fonts, global CSS, or Tailwind config?*

- **Tailwind Config:** `tailwind.config.js` (Root level)
- **Global CSS & CSS Variables:** `apps/admin/src/styles.css`
- **Dynamic Theming (MUI + Tailwind):** `libs/platform/ui/src/lib/theme/ThemeContext.tsx`
  - *Note: The Theme Context automatically injects CSS variables like `--primary-color` into the document root so Tailwind can use them dynamically for white-labeling.*

### 📍 6. API Services & Backend Integration
*Where do I connect the app to my real backend (Spring Boot, Node.js, etc.)?*

All data fetching has been centralized into **Core API Services** located at `libs/platform/core/src/lib/api/services/`.
These services use a pre-configured Axios instance (`apiClient.ts`) that automatically attaches authentication tokens.

The platform expects your backend to expose the following REST endpoints (or you can edit the services to match your backend's paths):

1. **`HttpAuthAdapter.ts`**:
   - `POST /auth/login`: Expects `{ email, password }` and returns `{ user: UserDTO, token: string }`.
   - `POST /auth/logout`: Invalidates the session.
   - `GET /auth/me`: Validates the token and returns the current `UserDTO`.
   - `POST /auth/refresh`: Returns a new `{ token: string }`.
2. **`UserService.ts`**:
   - `GET /users`: Returns a list of users (`UserDTO[]`).
   - `POST /users`, `PUT /users/:id`: For managing users.
3. **`RoleService.ts`**:
   - `GET /roles`: Returns available roles (`RoleDTO[]`).
   - `GET /permissions`: Returns granular system permissions.
4. **`TenantService.ts`**:
   - `GET /tenants`: Returns the list of tenants and their dynamic white-labeling configurations (`TenantDTO[]`).
5. **`ConfigService.ts`**:
   - `GET /config`: Returns system operational parameters (e.g., `ENABLE_MFA`).

To change the base URL for these requests, edit the `baseURL` property inside `libs/platform/core/src/lib/api/apiClient.ts`.

### 📍 7. Role-Based Access Control (RBAC)
*How do I restrict certain UI elements or pages so only Admins can see them?*

The platform includes a powerful `<RoleGuard>` component. When your backend returns the `UserDTO` object upon login, it must include an array of `roles` and `permissions`.

**Example Backend User Payload:**
```json
{
  "id": "1",
  "email": "admin@bodhika.com",
  "roles": ["ADMIN", "OPERATOR"],
  "permissions": ["manage_users", "manage_tenants", "manage_config"]
}
```

**How to secure your UI:**
Import `RoleGuard` from `libs/platform/core/src/lib/auth/RoleGuard.tsx` and wrap it around sensitive elements:

```tsx
<RoleGuard allowedPermissions={['manage_config']}>
  <button>Save Global Settings</button>
</RoleGuard>
```
If the currently logged-in user does not have `manage_config` in their permissions array, that button will simply disappear from the DOM.

### 📍 8. Global Notifications & State (Zustand)
*Where do I change how the toast popups look, or add new global state?*

- **The Logic (Zustand Store):** `libs/platform/core/src/lib/store/notificationStore.ts`
- **The UI Component:** `libs/platform/ui/src/lib/components/NotificationToast.tsx`
- **How to use it anywhere:**
  ```tsx
  import { useNotificationStore } from '../../../../platform/core/src/lib/store/notificationStore';
  
  const addNotification = useNotificationStore(state => state.addNotification);
  addNotification({ type: 'success', message: 'It works!' });
  ```

### 📍 8. Multi-Tenant Configuration
*Where is the logic that decides which tenant is currently active?*

- **File to Edit:** `libs/platform/core/src/lib/tenant/TenantContext.tsx`
- **What it does:** Simulates fetching a tenant's configuration based on the user or domain. This allows the app to dynamically know which features are enabled, and what the branding colors should be.
