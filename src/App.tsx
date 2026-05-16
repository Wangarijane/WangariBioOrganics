import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, Menu, X, Leaf, Recycle, Handshake, 
  ArrowRight, Plus, Minus, Trash2, MessageCircle, 
  Send, Bot, ShieldCheck, Sprout, Droplets, User as UserIcon,
  LogOut, ShoppingBag, Info, Users, Home
} from 'lucide-react';
import { Logo } from './components/Logo';
import { AuthModal } from './components/AuthModal';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  badge: string;
  description: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: 'hibiscus-001',
    name: 'Premium Sun-Dried Hibiscus',
    price: 850,
    category: 'Botanical Teas',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80',
    badge: 'Direct Trade',
    description: 'Meticulously sorted, bioactive hibiscus. Perfect for antioxidant-rich teas and wellness infusions. Hand-harvested at peak potency.'
  },
  {
    id: 'avocado-glow-002',
    name: 'Avocado Seed Glow Oil',
    price: 1500,
    category: 'Bioactive Oils',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80',
    badge: 'Upcycled',
    description: 'Upcycled, cold-pressed bioactive extraction for deeply nourished skin. Transforming agricultural byproducts into premium skincare.'
  },
  {
    id: 'coffee-scrub-003',
    name: 'Coffee Husk Exfoliating Scrub',
    price: 1000,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1559591937-e68fb330555d?auto=format&fit=crop&q=80',
    badge: 'Zero Waste',
    description: 'Invigorating exfoliating scrub made from repurposed coffee husks. Promotes circulation and reveals a radiant complexion.'
  },
  {
    id: 'rosemary-mist-004',
    name: 'Rosemary Fortifying Hair Mist',
    price: 1200,
    category: 'Hair & Body Care',
    image: 'https://images.unsplash.com/photo-1596464875322-ea1c32729931?auto=format&fit=crop&q=80',
    badge: '100% Recycled',
    description: 'A strengthening botanical mist to promote scalp health and hair vitality. Distilled from fresh farm-grown rosemary.'
  },
  {
    id: 'moringa-mask-005',
    name: 'Moringa Detox Clay Mask',
    price: 1300,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80',
    badge: 'Direct Trade',
    description: 'Purifying bentonite and nutrient-dense moringa leaf blended to deeply cleanse pores and rejuvenate tired skin.'
  },
  {
    id: 'lemongrass-balm-006',
    name: 'Lemongrass Soothing Body Balm',
    price: 950,
    category: 'Hair & Body Care',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80',
    badge: 'Zero Waste',
    description: 'A calming balm with essential oils to soothe dry skin and ease tension. Infused with farm-fresh lemongrass.'
  },
  {
    id: 'baobab-butter-007',
    name: 'Raw Baobab Whipped Butter',
    price: 1800,
    category: 'Bioactive Oils',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80',
    badge: 'Upcycled',
    description: 'Intensely hydrating baobab fruit butter, whipped to perfection. Rich in Vitamin C and essential fatty acids.'
  },
  {
    id: 'spearmint-tea-008',
    name: 'Highland Spearmint Loose Leaf',
    price: 600,
    category: 'Botanical Teas',
    image: 'https://images.unsplash.com/photo-1533282211824-4b9e9f67566b?auto=format&fit=crop&q=80',
    badge: 'Direct Trade',
    description: 'Refreshing spearmint harvested from the Aberdare highlands. Naturally caffeine-free and digestive-friendly.'
  }
];

const CATEGORIES = ['All', 'Botanical Teas', 'Bioactive Oils', 'Skincare', 'Hair & Body Care'];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'ai', text: 'Jambo! I am the Wangari AI Assistant. How can I help you radiate wellness today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const filteredProducts = selectedCategory === 'All' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      const stored = localStorage.getItem('wangari_subscribers');
      const subscribers = stored ? JSON.parse(stored) : [];
      subscribers.push(newsletterEmail.trim());
      localStorage.setItem('wangari_subscribers', JSON.stringify(subscribers));
      
      setIsSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      console.error('Error saving subscriber', err);
    }
  };

  const handleAddToCart = (product: { id: string, name: string, price: number, image: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCountTotal = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const itemsList = cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const message = `Hello Wangari Bio Organics! I would like to order: ${itemsList} - Total: KES ${cartTotal}.`;
    
    // Save order to Firestore if logged in
    if (user) {
      try {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email,
          items: cartItems,
          total: cartTotal,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'orders');
      }
    }

    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;

    const userMessageText = inputText.trim();
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessageText
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsAiTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessageText,
          history: messages.slice(-10) // Send recent history for context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI Assistant");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.text || "I'm sorry, I couldn't generate a response right now."
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Jambo! I'm having a little trouble connecting right now. Please try again or reach out to us via WhatsApp for immediate support."
      }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="min-h-screen font-sans flex flex-col selection:bg-wangari-green selection:text-wangari-cream">
      {/* Navigation Bar */}
      <nav 
        className={`sticky top-0 z-[60] transition-all duration-500 ${
          isScrolled 
            ? 'bg-wangari-cream/95 backdrop-blur-xl border-b border-wangari-green/20 py-2 shadow-sm' 
            : 'bg-transparent border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="flex items-center gap-3 group">
                <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                  <Logo className="w-10 h-10 sm:w-12 sm:h-12 transform group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className={`font-serif leading-none transition-all duration-300 ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-bold text-wangari-green tracking-tight`}>
                    Wangari Bio Organics
                  </span>
                  <span className={`text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.4em] text-wangari-terracotta mt-1.5 font-black transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                    RADIATE FROM WITHIN
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {[
                { name: 'Home', href: '#', icon: Home },
                { name: 'Botanicals', href: '#botanicals', icon: ShoppingBag },
                { name: 'Our Farmers', href: '#farmers', icon: Users },
                { name: 'Impact', href: '#impact', icon: Info },
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="nav-link text-[0.75rem] font-bold text-wangari-green uppercase tracking-[0.1em] transition-all duration-300 flex items-center gap-2 hover:text-wangari-terracotta"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Cart & Profile Controls */}
            <div className="flex items-center gap-3 sm:gap-6">
              {user ? (
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-[0.65rem] font-black text-wangari-green uppercase tracking-[0.15em]">{user.displayName || 'Wellness Seeker'}</p>
                    <button 
                      onClick={handleLogout}
                      className="text-[0.55rem] text-wangari-terracotta font-bold uppercase tracking-widest hover:text-wangari-green transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-wangari-green text-wangari-cream flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 p-0.5 border-2 border-wangari-cream">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-wangari-green text-wangari-cream text-[0.7rem] font-black uppercase tracking-[0.2em] hover:bg-wangari-terracotta transition-all duration-500 rounded-full shadow-lg hover:shadow-wangari-terracotta/20"
                >
                  Join Us
                </button>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-white/50 border border-wangari-green/10 rounded-full text-wangari-green hover:bg-wangari-green hover:text-wangari-cream transition-all duration-300 shadow-sm group"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCountTotal > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-wangari-terracotta text-[0.65rem] font-black text-white shadow-lg animate-bounce">
                    {cartCountTotal}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 bg-wangari-green/5 rounded-full text-wangari-green hover:bg-wangari-green hover:text-wangari-cream transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden bg-wangari-cream/98 backdrop-blur-xl border-t border-wangari-green/10 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-4">
                {[
                  { name: 'Home', href: '#', icon: Home },
                  { name: 'Botanicals', href: '#botanicals', icon: ShoppingBag },
                  { name: 'Our Farmers', href: '#farmers', icon: Users },
                  { name: 'Impact', href: '#impact', icon: Info },
                ].map((item, idx) => (
                  <motion.a 
                    key={item.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 text-[0.85rem] font-black uppercase tracking-[0.2em] text-wangari-green hover:bg-wangari-green hover:text-wangari-cream rounded-2xl transition-all duration-300"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </motion.a>
                ))}
                {!user && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-5 bg-wangari-terracotta text-wangari-cream text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl"
                  >
                    <UserIcon className="h-5 w-5" />
                    Sign In / Register
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: 'linear' }}
              src="https://images.pexels.com/photos/8101134/pexels-photo-8101134.jpeg" 
              alt="Organic farm landscape" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-wangari-green/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-wangari-green/30 via-transparent to-wangari-green/90"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-wangari-terracotta text-[0.7rem] sm:text-xs font-black uppercase tracking-[0.4em] mb-8 bg-wangari-cream/10 backdrop-blur-md px-6 py-2 rounded-full border border-wangari-cream/20">
                Ethically Sourced • Bioactive • Zero Waste
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black text-wangari-cream leading-[1.05] tracking-tighter mb-8 drop-shadow-2xl">
                Radiate from <br />
                <span className="text-wangari-terracotta italic font-normal">the Inside</span> Out
              </h1>
              <p className="text-wangari-cream/80 text-lg sm:text-xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed drop-shadow-md">
                Experience East Africa's finest organic wellness. Discover botanical wisdom, perfected by tradition and delivered in circular packaging.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <a 
                  href="#botanicals"
                  className="w-full sm:w-auto px-12 py-5 bg-wangari-cream text-wangari-green rounded-full text-[0.85rem] font-black uppercase tracking-[0.2em] hover:bg-wangari-terracotta hover:text-wangari-cream transition-all duration-500 shadow-2xl hover:shadow-wangari-terracotta/40 transform hover:-translate-y-1 group"
                >
                  Shop the Collection
                  <ArrowRight className="inline-block ml-3 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                </a>
                <a 
                  href="#farmers" 
                  className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-wangari-cream/30 text-wangari-cream rounded-full text-[0.85rem] font-black uppercase tracking-[0.2em] hover:bg-wangari-cream hover:text-wangari-green transition-all duration-500 backdrop-blur-sm"
                >
                  Our Philosophy
                </a>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-wangari-cream/40 text-[0.6rem] uppercase tracking-[0.3em] font-bold">Discover</span>
            <div className="w-px h-16 bg-gradient-to-b from-wangari-cream/40 via-wangari-cream/20 to-transparent"></div>
          </motion.div>
        </section>

        {/* Trust Banner */}
        <section className="w-full bg-wangari-green/5 border-b border-wangari-green/10 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left group">
                <ShieldCheck className="h-6 w-6 text-wangari-terracotta flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold text-wangari-green uppercase tracking-wider">KEBS Certified Standards</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left group">
                <Recycle className="h-6 w-6 text-wangari-terracotta flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold text-wangari-green uppercase tracking-wider">100% Recycled Packaging</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left group">
                <Sprout className="h-6 w-6 text-wangari-terracotta flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold text-wangari-green uppercase tracking-wider">Locally Upcycled Ingredients</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left group">
                <Droplets className="h-6 w-6 text-wangari-terracotta flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-bold text-wangari-green uppercase tracking-wider">Zero Synthetic Chemicals</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="botanicals" className="py-32 bg-wangari-cream overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-wangari-terracotta text-[0.6rem] font-black uppercase tracking-[0.4em] mb-4">The Selection</span>
              <h2 className="font-serif text-4xl md:text-5xl font-black text-wangari-green mb-8">Seasonal Harvest</h2>
              <div className="w-16 h-1 bg-wangari-terracotta mx-auto mb-12"></div>
              
              {/* Category Filters */}
              <div className="flex overflow-x-auto pb-4 gap-4 justify-start lg:justify-center no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-8 py-3 rounded-full text-[0.7rem] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 border ${
                      selectedCategory === category 
                        ? 'bg-wangari-green text-wangari-cream border-wangari-green shadow-xl shadow-wangari-green/20 scale-105' 
                        : 'bg-white text-wangari-green border-wangari-green/10 hover:border-wangari-terracotta hover:text-wangari-terracotta'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, idx) => (
                  <motion.div 
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group flex flex-col bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(42,75,60,0.08)] hover:shadow-[0_20px_50px_-15px_rgba(42,75,60,0.15)] hover:-translate-y-3 transition-all duration-700 overflow-hidden border border-wangari-green/5"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className={`absolute top-6 right-6 text-wangari-cream text-[0.6rem] font-black px-4 py-2 uppercase tracking-[0.2em] rounded-full backdrop-blur-md shadow-lg ${
                        product.badge === 'Upcycled' 
                          ? 'bg-wangari-terracotta/90' 
                          : (product.badge === 'Zero Waste' || product.badge === '100% Recycled')
                            ? 'bg-[#1a2e25]/90'
                            : 'bg-wangari-green/90'
                      }`}>
                        {product.badge}
                      </div>
                    </div>
                    <div className="p-10 flex flex-col flex-grow">
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[0.65rem] text-wangari-terracotta font-black tracking-[0.2em] uppercase">{product.category}</p>
                          <span className="text-lg font-serif font-black text-wangari-green">KES {product.price}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-black text-wangari-green mb-3 leading-tight group-hover:text-wangari-terracotta transition-colors duration-300">{product.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-10 flex-grow leading-relaxed text-sm font-medium">
                        {product.description}
                      </p>
                      
                      <div className="pt-6 border-t border-wangari-green/5">
                        <button 
                          onClick={() => handleAddToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image
                          })}
                          className="w-full py-5 px-8 bg-wangari-green text-wangari-cream text-[0.7rem] font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-wangari-terracotta transition-all duration-500 shadow-lg hover:shadow-wangari-terracotta/20 flex justify-center items-center group/btn"
                        >
                          Add to Cart
                          <Plus className="ml-2 h-4 w-4 transform group-hover/btn:rotate-90 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Our Farmers Section */}
        <section id="farmers" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-wangari-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1595806659616-c3cc265aa8de?auto=format&fit=crop&q=80" 
                    alt="Kenyan Farmers" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-wangari-green/20 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0"></div>
                  <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-2">Our Root Source</p>
                    <p className="text-white/80 text-xs italic">Highlands of Kenya</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
              >
                <span className="inline-block text-wangari-terracotta text-[0.6rem] font-black uppercase tracking-[0.4em] mb-4">Direct Partnerships</span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-wangari-green mb-8 leading-tight">Soil-to-Soul <br />Integrity</h2>
                <div className="w-16 h-1 bg-wangari-terracotta mb-10"></div>
                <p className="text-gray-600 text-lg font-medium leading-relaxed mb-6">
                  At Wangari, our relationship with the land starts with the people who cultivate it. We partner directly with smallholder farmers across Kenya's most fertile regions, ensuring fair trade practices and sustainable agricultural methods.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-10">
                  By eliminating the middlemen, we empower rural communities with equitable income while securing the purest, most potent organic botanicals for your wellness routine.
                </p>
                <div className="flex gap-10 mb-10">
                  <div className="text-center">
                    <div className="text-3xl font-black text-wangari-green mb-1">100%</div>
                    <div className="text-[0.6rem] uppercase tracking-widest text-wangari-terracotta font-bold">Direct trade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-wangari-green mb-1">500+</div>
                    <div className="text-[0.6rem] uppercase tracking-widest text-wangari-terracotta font-bold">Farmers empowered</div>
                  </div>
                </div>
                <a href="#botanicals" className="self-start px-10 py-5 bg-wangari-green text-wangari-cream rounded-full text-[0.7rem] font-black uppercase tracking-[0.25em] hover:bg-wangari-terracotta transition-all duration-500 shadow-xl shadow-wangari-green/10">
                  Shop the Harvest
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Circular Economy Model Section */}
        <section id="impact" className="py-32 bg-wangari-green relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block text-wangari-terracotta text-[0.6rem] font-black uppercase tracking-[0.4em] mb-4"
              >
                Sustainability First
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-5xl lg:text-7xl font-black text-wangari-cream mb-8 tracking-tighter"
              >
                Circular by Design
              </motion.h2>
              <div className="w-20 h-1.5 bg-wangari-terracotta mx-auto mb-12 rounded-full"></div>
              <p className="text-wangari-cream/80 max-w-2xl mx-auto text-lg font-medium leading-relaxed">We believe in leaving the earth better than we found it. Every step of our process is designed with radical intention and ecological integrity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { 
                  title: 'Upcycled Ingredients', 
                  desc: 'We transform agricultural extraction byproducts like coffee husks and avocado seeds into bioactive skincare.',
                  icon: Recycle
                },
                { 
                  title: 'PCR Packaging', 
                  desc: 'Every container is made from 100% Post-Consumer Recycled materials, designed for circular return systems.',
                  icon: Leaf
                },
                { 
                  title: 'Direct Trade Farming', 
                  desc: 'Eliminating the middleman to ensure 100% of the value reaches our partner farmers directly.',
                  icon: Handshake
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 text-center group hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-full bg-wangari-terracotta text-white flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-black text-wangari-cream mb-4">{item.title}</h3>
                  <p className="text-wangari-cream/60 leading-relaxed text-sm font-medium">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-[#0e1a15] text-wangari-cream py-24 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-wangari-terracotta/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <a href="#" className="flex items-center gap-4 mb-8 group inline-flex">
                <Logo 
                  className="w-16 h-16 transform group-hover:rotate-12 transition-transform duration-500" 
                  leafColor="#F9F6F0" 
                  sunburstColor="#A0522D" 
                  bgColor="#0e1a15" 
                />
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-3xl font-black text-white tracking-tighter leading-none">
                    Wangari Bio Organics
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.4em] text-wangari-terracotta mt-2 font-black">
                    Soil-to-Soul Wellness
                  </span>
                </div>
              </a>
              <p className="text-wangari-cream/60 max-w-md mb-10 leading-relaxed font-medium">
                Pioneering bioactive upcycling and circular wellness in East Africa. Our mission is to restore harmony between humans and the earth through premium, zero-waste organic botanicals.
              </p>
              <div className="flex gap-4">
                 {/* Social links placeholder bubbles */}
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-wangari-terracotta hover:border-wangari-terracotta transition-all duration-300 cursor-pointer">
                     <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                   </div>
                 ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-[0.7rem] font-black uppercase tracking-[0.3em] mb-8 text-wangari-terracotta">Explore</h4>
              <ul className="space-y-4 text-wangari-cream/70 font-medium">
                <li><a href="#botanicals" className="hover:text-white transition-colors duration-300">Shop Harvest</a></li>
                <li><a href="#farmers" className="hover:text-white transition-colors duration-300">Farmer Stories</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors duration-300">Circular Impact</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Wholesale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[0.7rem] font-black uppercase tracking-[0.3em] mb-8 text-wangari-terracotta">Newsletter</h4>
              <p className="text-wangari-cream/60 mb-6 text-sm font-medium">Receive seasonal updates and exclusive harvest access.</p>
              {isSubscribed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-wangari-terracotta/20 border border-wangari-terracotta/40 text-wangari-cream px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-[0.1em]"
                >
                  Welcome to the Community
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubscribe}>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Email address" 
                      className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-wangari-terracotta focus:ring-1 focus:ring-wangari-terracotta transition-all placeholder:text-wangari-cream/30 text-sm"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-wangari-terracotta text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[0.7rem] hover:bg-white hover:text-wangari-green transition-all duration-500 shadow-xl shadow-wangari-terracotta/20"
                  >
                    Join the Harvest
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[0.65rem] uppercase tracking-[0.25em] font-black text-wangari-cream/40">
            <p>&copy; 2026 Wangari Bio Organics • Made with Integrity in Kenya</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Shipment</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* AI Assistant Chatbot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 z-50 bg-wangari-green text-wangari-cream w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-wangari-terracotta transition-all duration-500 transform hover:-translate-y-2 group"
        aria-label="Toggle AI Assistant"
      >
        <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 z-50 w-[90vw] sm:w-[400px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] border border-wangari-green/5 flex flex-col overflow-hidden h-[600px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-wangari-green p-8 flex items-center justify-between text-wangari-cream">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="h-6 w-6 text-wangari-terracotta" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-black tracking-tight">Wangari AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[0.6rem] uppercase tracking-widest font-black opacity-60">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-wangari-terracotta transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-8 overflow-y-auto bg-wangari-cream/10 flex flex-col gap-6 no-scrollbar">
              {messages.map(msg => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm font-medium ${
                      msg.role === 'user' 
                        ? 'bg-wangari-terracotta text-white rounded-tr-none' 
                        : 'bg-white border border-wangari-green/5 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-wangari-green/5 text-gray-800 p-5 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-2 items-center">
                    <span className="animate-bounce w-2 h-2 bg-wangari-terracotta/40 rounded-full"></span>
                    <span className="animate-bounce w-2 h-2 bg-wangari-terracotta/40 rounded-full [animation-delay:0.2s]"></span>
                    <span className="animate-bounce w-2 h-2 bg-wangari-terracotta/40 rounded-full [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-wangari-green/5 flex gap-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="How can we help?"
                className="flex-1 bg-wangari-cream/20 border border-wangari-green/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-wangari-terracotta focus:ring-1 focus:ring-wangari-terracotta transition-all text-gray-800 placeholder:text-gray-400 font-medium"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-wangari-green text-wangari-cream w-14 h-14 rounded-full flex items-center justify-center hover:bg-wangari-terracotta disabled:opacity-50 disabled:hover:bg-wangari-green transition-all shadow-xl shadow-wangari-green/20"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Slide-out Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-wangari-green/40 backdrop-blur-md transition-opacity"
              onClick={() => setIsCartOpen(false)}
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 w-full max-w-lg bg-wangari-cream shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col pointer-events-auto"
            >
              <div className="flex items-center justify-between px-10 py-8 border-b border-wangari-green/5 bg-white">
                <div>
                  <h2 className="font-serif text-3xl font-black text-wangari-green mb-1">Your Harvest</h2>
                  <p className="text-[0.65rem] uppercase tracking-widest text-wangari-terracotta font-black">{cartCountTotal} Items Selected</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-wangari-green hover:bg-wangari-green/5 transition-all"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-24 h-24 rounded-full bg-wangari-green/5 flex items-center justify-center mb-6">
                      <ShoppingBag className="h-10 w-10 text-wangari-green" />
                    </div>
                    <p className="text-xl font-bold text-wangari-green">Empty Harvest</p>
                    <p className="text-sm mt-2">Start adding organic botanicals to your cart</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-8 text-wangari-terracotta font-black uppercase tracking-widest text-xs border-b-2 border-wangari-terracotta pb-1"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-8">
                    {cartItems.map((item) => (
                      <motion.li 
                        layout
                        key={item.id} 
                        className="flex gap-6 group"
                      >
                        <div className="w-24 h-28 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-wangari-green text-lg leading-tight">{item.name}</h4>
                            <button 
                              onClick={() => updateQuantity(item.id, -item.quantity)}
                              className="text-gray-300 hover:text-wangari-terracotta transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-wangari-terracotta font-black text-sm mb-6 whitespace-nowrap">KES {item.price}</p>
                          
                          <div className="flex items-center gap-6">
                             <div className="flex items-center bg-white rounded-full border border-wangari-green/5 shadow-sm px-4 py-2">
                               <button
                                 onClick={() => updateQuantity(item.id, -1)}
                                 className="p-1 px-2 text-gray-400 hover:text-wangari-terracotta transition-colors"
                               >
                                 <Minus className="h-4 w-4" />
                               </button>
                               <span className="w-8 text-center text-sm font-black text-wangari-green">{item.quantity}</span>
                               <button
                                 onClick={() => updateQuantity(item.id, 1)}
                                 className="p-1 px-2 text-gray-400 hover:text-wangari-terracotta transition-colors"
                               >
                                 <Plus className="h-4 w-4" />
                               </button>
                             </div>
                             <span className="text-sm font-black text-wangari-green/40">= KES {item.price * item.quantity}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <div className="p-10 bg-white border-t border-wangari-green/5 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-widest font-black text-wangari-terracotta mb-1">Estimated Total</p>
                      <h3 className="text-4xl font-serif font-black text-wangari-green">KES {cartTotal}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-6 px-10 bg-wangari-green text-wangari-cream text-[0.8rem] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-wangari-terracotta transition-all duration-500 shadow-2xl shadow-wangari-green/20 flex justify-center items-center group"
                  >
                    Confirm Harvest
                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-center text-[0.65rem] text-gray-400 mt-6 uppercase tracking-widest font-bold">Checkout is handled via Secure WhatsApp Business</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
