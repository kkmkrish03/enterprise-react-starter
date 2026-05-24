export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  isProtected?: boolean;
  permissions?: string[];
  layout?: 'dashboard' | 'public' | 'auth';
  children?: RouteConfig[];
}

class RouteRegistryService {
  private routes: RouteConfig[] = [];

  register(route: RouteConfig | RouteConfig[]) {
    if (Array.isArray(route)) {
      this.routes.push(...route);
    } else {
      this.routes.push(route);
    }
  }

  getRoutes(): RouteConfig[] {
    return this.routes;
  }
}

export const RouteRegistry = new RouteRegistryService();
