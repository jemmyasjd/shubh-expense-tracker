import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calculator, 
  BarChart3, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import gayatriMata from '@/assets/gayatri-mata-illustration.png';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
    const { toast } = useToast(); 

  const toggleSidebar = () => setIsOpen(!isOpen);

   const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out 🚪",
      description: "You've been successfully logged out.",
    });
    navigate('/signin');
    setIsOpen(false);
  };


  const authenticatedNavigation = [
    { name: 'Welcome', href: '/', icon: Home },
    { name: 'Expense Calculator', href: '/expenses', icon: Calculator },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const unauthenticatedNavigation = [
    { name: 'Welcome', href: '/', icon: Home },
    { name: 'Sign In', href: '/signin', icon: LogIn },
    { name: 'Sign Up', href: '/signup', icon: UserPlus },
  ];

  const navigation = isAuthenticated ? authenticatedNavigation : unauthenticatedNavigation;

  return (
    <>
      {/* Mobile menu button - shown only when sidebar is closed */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-40 shadow-warm"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 gradient-subtle border-r z-40 transform transition-transform duration-300 ease-in-out shadow-soft
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo and close button */}
          <div className="p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={gayatriMata}
                alt="Gayatri Mata"
                className="w-10 h-10 rounded-full border-2 border-primary/20"
              />
              <div>
                <h1 className="text-lg font-bold text-primary leading-none">
                  Gayatri Expense
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Sacred Finance Tracker
                </p>
              </div>
            </div>
            
            {/* Close button - shown only on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'gradient-primary text-primary-foreground shadow-warm'
                          : 'text-foreground hover:bg-muted hover:text-accent-foreground'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}

              {/* Logout button for authenticated users */}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-foreground hover:bg-muted hover:text-accent-foreground"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Blessed by Gayatri Mata
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;