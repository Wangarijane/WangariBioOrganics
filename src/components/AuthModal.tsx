import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-wangari-green/40 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-wangari-cream rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white flex items-center justify-center text-wangari-green hover:bg-wangari-terracotta hover:text-white transition-all duration-300 shadow-sm"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-12 sm:p-16">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-black text-wangari-green leading-tight">
              {isLogin ? 'Welcome Back' : 'Join the Harvest'}
            </h2>
            <div className="w-12 h-1 bg-wangari-terracotta mx-auto mt-6 mb-4"></div>
            <p className="text-wangari-green/60 text-sm font-medium leading-relaxed">
              {isLogin ? 'Sign in to access your curated selection' : 'Become part of a circular wellness ecosystem'}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border border-wangari-green/5 py-5 rounded-2xl text-wangari-green text-sm font-black uppercase tracking-[0.2em] hover:bg-wangari-green hover:text-white transition-all duration-500 mb-10 shadow-xl shadow-wangari-green/5 disabled:opacity-50"
          >
            <Chrome className="h-5 w-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center py-4 mb-6">
            <div className="flex-grow border-t border-wangari-green/10"></div>
            <span className="flex-shrink mx-6 text-[0.6rem] uppercase tracking-[0.4em] text-wangari-green/30 font-black">Secure Entry</span>
            <div className="flex-grow border-t border-wangari-green/10"></div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-[0.8rem] rounded-2xl font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-wangari-green/30 group-focus-within:text-wangari-terracotta transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/60 border border-wangari-green/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-wangari-terracotta focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-wangari-green/30 group-focus-within:text-wangari-terracotta transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/60 border border-wangari-green/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-wangari-terracotta focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-wangari-green/30 group-focus-within:text-wangari-terracotta transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/60 border border-wangari-green/10 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:border-wangari-terracotta focus:bg-white transition-all text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wangari-green text-wangari-cream py-6 rounded-2xl text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-wangari-terracotta transition-all duration-500 shadow-2xl shadow-wangari-green/10 disabled:opacity-50 mt-4"
            >
              {loading ? 'Validating...' : isLogin ? 'Authenticate' : 'Begin Journey'}
            </button>
          </form>

          <div className="mt-10 text-center text-[0.7rem] uppercase tracking-[0.1em] font-black text-wangari-green/40">
            {isLogin ? (
              <p>
                New to Wangari?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-wangari-terracotta hover:text-wangari-green transition-colors"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Existing Member?{' '}
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-wangari-terracotta hover:text-wangari-green transition-colors"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
