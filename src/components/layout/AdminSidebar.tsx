import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Ticket, 
  ShoppingCart, 
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/productos', label: 'Productos', icon: Package },
  { path: '/categorias', label: 'Categorías', icon: FolderTree },
  { path: '/cupones', label: 'Cupones', icon: Ticket },
  { path: '/ventas', label: 'Ventas', icon: ShoppingCart },
  { path: '/pagos', label: 'Config. Pagos', icon: CreditCard },
];

export function AdminSidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-sidebar-accent-foreground">
            Admin Panel
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full text-sidebar-foreground hover:text-destructive hover:bg-sidebar-accent",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-3">Cerrar sesión</span>}
        </Button>
      </div>
    </aside>
  );
}
