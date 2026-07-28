import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * Admin Setup Page
 * 
 * Use this page ONCE to create your first admin account.
 * After creating the account, you can remove this route from App.tsx
 * 
 * Access at: /admin-setup
 */

export function AdminSetup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6e189709/admin/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage("✅ Admin account created successfully! You can now log in at /admin");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating admin account:', error);
      setMessage("❌ Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-[32px] max-w-md w-full shadow-lg">
        <h1 className="font-['Anybody',_sans-serif] text-[#191919] mb-4 text-center tracking-[-1px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 800, fontSize: '36px' }}>
          Create Admin Account
        </h1>
        
        <p className="font-['Anybody',_sans-serif] text-[#666] mb-8 text-center text-sm" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
          Set up your first admin account to manage the Cstle Livn website
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
              Password *
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="font-['Roboto_Mono',_sans-serif] uppercase text-[12px] tracking-wider">
              Confirm Password *
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-2"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-black/90 text-white rounded-[32px] py-6 font-['Roboto_Mono',_sans-serif] uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </Button>
        </form>

        {success && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Your admin account is ready!
            </p>
            <a 
              href="/#/admin" 
              className="block text-center bg-black text-white py-3 px-6 rounded-[24px] font-['Roboto_Mono',_sans-serif] uppercase text-[11px] tracking-wider hover:bg-black/90 transition-colors"
            >
              Go to Admin Login
            </a>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Important: After creating your admin account, you can remove the /admin-setup route from your App.tsx for security.
          </p>
        </div>
      </div>
    </div>
  );
}
