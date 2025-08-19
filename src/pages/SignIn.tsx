import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import gayatriMata from '@/assets/gayatri-mata-illustration.png';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || password.length < 6) {
      toast({
        title: 'Error ❌',
        description: 'Please fill all fields correctly.',
      });
      return;
    }

    try {
      setLoading(true);
      // Call backend
      const response = await authService.signIn(email, password);

      // Save to AuthContext (token + user)
      login(response.token, response.user);

      toast({
        title: 'Welcome 🎉',
        description: `Hello, ${response.user.name}`,
      });

      // Redirect to dashboard/home
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Login Failed ❌',
        description: error.response?.data?.message || 'Invalid email or password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md p-8 shadow-glow">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={gayatriMata}
            alt="Gayatri Mata"
            className="w-20 h-20 mx-auto rounded-full shadow-warm border-2 border-primary/20 mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-primary/20 focus:ring-primary"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-primary/20 focus:ring-primary pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary shadow-warm"
            size="lg"
            disabled={!email || password.length < 6 || loading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary hover:text-primary-glow font-medium underline"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Blessing */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground italic">
            "सर्वे भवन्तु सुखिनः" - May all beings be happy
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
