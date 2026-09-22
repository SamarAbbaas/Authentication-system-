'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

// Supabase and Utils Imports
import { supabase } from "@/lib/supabase";
import { waitForSession } from "@/lib/auth-utils";

// Shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Icons Components
const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

// Floating Label Input Component
const FloatingLabelInput: React.FC<{
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  required?: boolean;
}> = ({ id, type, value, onChange, placeholder, icon, rightIcon, onRightIconClick, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
        <div className="absolute top-[50vh] right-[50vw] h-screen w-screen bg-sidebar-primary opacity-10 rounded-2xl blur-3xl"></div>
      <div className="absolute bottom-[50vh] left-[50vw] h-screen w-screenbg-sidebar-primary opacity-10 rounded-2xl blur-3xl"></div>
      {/* Left Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-foreground">
        {icon}
      </div>
      
      {/* Input Field */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 peer placeholder-transparent"
        placeholder={placeholder}
      />
      
      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none text-sm font-medium ${
          isFocused || value
            ? '-top-2 text-xs bg-white dark:bg-black px-2 text-foreground rounded-sm'
            : 'top-2.5 text-muted-foreground'
        }`}
      >
        {placeholder}
      </label>
      
      {/* Right Action Icon */}
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!name.trim()) {
      return toast.error("Please enter your full name");
    }
    if (email.length < 5 || password.length < 6) {
      return toast.error(
        "Please enter a valid email and a password of at least 6 characters",
      );
    }
    
    setLoading(true);
    try {
      // Name aur Phone number ko options.data me bheja hai taake Supabase raw_user_meta_data me save ho jaye
      const { error, data } = await supabase.auth.signUp({
        email: email,
        password: password,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        toast.error(`Error signing up: ${error.message}`);
      } else if (data.user) {
        toast.success("Signed up successfully!");
        
        const session = await waitForSession(supabase);
        if (session) {
          router.push("/dashboard");
        } else {
          toast("Check your email to confirm your account");
        }
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error(`An unexpected error occurred. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-6">
      <Card className="w-full max-w-sm border border-border/70 bg-card/90 p-2 shadow-sm transition-all duration-200 hover:shadow-md">
        
        {/* Header */}
        <CardHeader className="flex flex-col space-y-2 text-center mb-2">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        
        {/* Content & Form */}
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Name Input */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                icon={<UserIcon />}
                required
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                required={true} 
                icon={<PhoneIcon />}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                icon={<MailIcon />}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                icon={<LockIcon />}
                rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                onRightIconClick={togglePasswordVisibility}
                required
              />
            </div>
      
            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Footer / Redirect Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="underline underline-offset-4 text-foreground hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
              </span>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}