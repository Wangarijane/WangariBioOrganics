import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Leaf, Recycle, Handshake, ArrowRight, Plus, Minus, Trash2, MessageCircle, Send, Bot, ShieldCheck, Sprout, Droplets } from 'lucide-react';
import { Logo } from './components/Logo';

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
    image: 'https://images.unsplash.com/photo-1596755431610-18e388bd669f?auto=format&fit=crop&q=80',
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
    image: 'https://images.unsplash.com/photo-1615397323286-9a259c402ac4?auto=format&fit=crop&q=80',
    badge: 'Zero Waste',
    description: 'Invigorating exfoliating scrub made from repurposed coffee husks. Promotes circulation and reveals a radiant complexion.'
  },
  {
    id: 'rosemary-mist-004',
    name: 'Rosemary Fortifying Hair Mist',
    price: 1200,
    category: 'Hair & Body Care',
    image: 'https://images.unsplash.com/photo-1632906806536-f084ba33faeb?auto=format&fit=crop&q=80',
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

  const handleCheckout = () => {
    const itemsList = cartItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const message = `Hello Wangari Bio Organics! I would like to order: ${itemsList} - Total: KES ${cartTotal}.`;
    const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText.trim()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsAiTyping(true);

    // Simulated API Call
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Connecting to Gemini AI...'
      }]);
      setIsAiTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col selection:bg-wangari-green selection:text-wangari-cream">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-wangari-cream/90 backdrop-blur-md border-b border-wangari-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="flex items-center gap-3 group">
                <Logo className="w-10 h-10 sm:w-12 sm:h-12 transform group-hover:scale-105 transition-transform duration-300" />
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-wangari-green tracking-tight leading-none">
                    Wangari Bio Organics
                  </span>
                  <span className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-wangari-terracotta mt-1.5 font-medium">
                    Radiate from within
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-gray-800 hover:text-wangari-terracotta transition-colors">Home</a>
              <a href="#botanicals" className="text-sm font-medium text-gray-800 hover:text-wangari-terracotta transition-colors">Shop Botanicals</a>
              <a href="#farmers" className="text-sm font-medium text-gray-800 hover:text-wangari-terracotta transition-colors">Our Farmers</a>
              <a href="#impact" className="text-sm font-medium text-gray-800 hover:text-wangari-terracotta transition-colors">Zero Waste Impact</a>
            </div>

            {/* Cart & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-wangari-green hover:text-wangari-terracotta transition-colors group"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCountTotal > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-wangari-terracotta rounded-full min-w-[1.25rem]">
                    {cartCountTotal}
                  </span>
                )}
              </button>
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-wangari-green hover:text-wangari-terracotta focus:outline-none p-2"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-wangari-cream border-b border-wangari-green/10 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-wangari-terracotta hover:bg-wangari-green/5 rounded-md">Home</a>
              <a href="#botanicals" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-wangari-terracotta hover:bg-wangari-green/5 rounded-md">Shop Botanicals</a>
              <a href="#farmers" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-wangari-terracotta hover:bg-wangari-green/5 rounded-md">Our Farmers</a>
              <a href="#impact" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-wangari-terracotta hover:bg-wangari-green/5 rounded-md">Zero Waste Impact</a>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.pexels.com/photos/8101134/pexels-photo-8101134.jpeg" 
              alt="Organic farm landscape" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-wangari-green/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-wangari-green/90 via-wangari-green/40 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-16">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-wangari-cream leading-tight mb-6 drop-shadow-lg">
              Rooted in Nature.<br/>
              <span className="text-wangari-terracotta/90 italic">Packaged with Purpose.</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-wangari-cream/90 max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
              Experience East Africa's finest organic wellness. Direct from our farmers to you, in 100% post-consumer recycled packaging.
            </p>
            <div className="flex justify-center">
              <a 
                href="#botanicals"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-wangari-terracotta hover:bg-[#8B5A2B] rounded-none transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Shop Organic Botanicals
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
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
        <section id="botanicals" className="py-24 bg-wangari-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-wangari-green mb-4">Our Harvest</h2>
              <div className="w-24 h-1 bg-wangari-terracotta mx-auto mb-10"></div>
              
              {/* Category Filters */}
              <div className="flex overflow-x-auto pb-4 gap-3 justify-start sm:justify-center" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category 
                        ? 'bg-wangari-green text-wangari-cream shadow-md' 
                        : 'bg-transparent text-wangari-green border border-wangari-green hover:bg-wangari-green/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map(product => (
                <div key={product.id} className="group flex flex-col bg-white rounded-none shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-wangari-green/10">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute top-4 right-4 text-wangari-cream text-xs font-bold px-3 py-1 uppercase tracking-wider backdrop-blur-sm ${
                      product.badge === 'Upcycled' 
                        ? 'bg-wangari-terracotta/90' 
                        : (product.badge === 'Zero Waste' || product.badge === '100% Recycled')
                          ? 'bg-[#1a2e25]/90'
                          : 'bg-wangari-green/90'
                    }`}>
                      {product.badge}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-wangari-green mb-1">{product.name}</h3>
                        <p className="text-xs text-wangari-terracotta font-medium tracking-wide uppercase">{product.category}</p>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 whitespace-nowrap ml-4">KES {product.price}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs mb-4">
                      <Leaf className="w-3 h-3 mr-1" />
                      <span>Packaged in PCR materials</span>
                    </div>
                    <p className="text-gray-600 mb-8 flex-grow leading-relaxed text-sm">
                      {product.description}
                    </p>
                    <button 
                      onClick={() => handleAddToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      })}
                      className="w-full py-3 px-6 bg-wangari-green text-wangari-cream font-medium hover:bg-[#1f382c] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex justify-center items-center"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Farmers Section */}
        <section id="farmers" className="py-24 bg-white border-t border-wangari-green/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1595806659616-c3cc265aa8de?auto=format&fit=crop&q=80" 
                    alt="Kenyan Farmers" 
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-wangari-green/10 mix-blend-multiply"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-wangari-green mb-6">Meet Our Farmers</h2>
                <div className="w-16 h-1 bg-wangari-terracotta mb-8"></div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  At Wangari Bio Organics, our relationship with the land starts with the people who cultivate it. We partner directly with smallholder farmers across Kenya's most fertile regions, ensuring fair trade practices and sustainable agricultural methods.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  By eliminating the middlemen, we empower rural communities with equitable income while securing the purest, most potent organic botanicals for your wellness routine. Every harvest tells a story of dedication, heritage, and respect for nature.
                </p>
                <div>
                  <span className="inline-flex items-center text-wangari-terracotta font-bold uppercase tracking-wider text-sm">
                    100% Direct Trade <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Circular Economy Model Section */}
        <section id="impact" className="py-24 bg-wangari-green text-wangari-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Our Circular Economy Model</h2>
              <p className="text-wangari-cream/80 max-w-2xl mx-auto text-lg">We believe in leaving the earth better than we found it. Every step of our process is designed with intention.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {/* Feature 1 */}
              <div className="flex flex-col items-center p-6">
                <div className="w-20 h-20 rounded-full bg-wangari-cream/10 flex items-center justify-center mb-6 text-wangari-terracotta">
                  <Handshake className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Direct Trade Farming</h3>
                <p className="text-wangari-cream/80 leading-relaxed">
                  Fair prices directly to local growers. We partner with smallholder farmers in Kenya to ensure equitable growth.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center p-6">
                <div className="w-20 h-20 rounded-full bg-wangari-cream/10 flex items-center justify-center mb-6 text-wangari-terracotta">
                  <Recycle className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">100% Recycled Packaging</h3>
                <p className="text-wangari-cream/80 leading-relaxed">
                  Zero virgin plastics, ever. Our packaging is made entirely from post-consumer recycled materials and is fully compostable.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center p-6">
                <div className="w-20 h-20 rounded-full bg-wangari-cream/10 flex items-center justify-center mb-6 text-wangari-terracotta">
                  <Leaf className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3">Upcycled Agriculture</h3>
                <p className="text-wangari-cream/80 leading-relaxed">
                  Transforming crop waste into premium wellness. We extract value from what others leave behind.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2e25] text-wangari-cream py-16 border-t border-wangari-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 lg:col-span-2">
              <a href="#" className="flex items-center gap-3 mb-6 group inline-flex">
                <Logo 
                  className="w-14 h-14" 
                  leafColor="#F9F6F0" 
                  sunburstColor="#A0522D" 
                  bgColor="#1a2e25" 
                />
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-2xl font-bold text-white tracking-tight leading-none">
                    Wangari Bio Organics
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-wangari-terracotta mt-1.5 font-medium">
                    Radiate from within
                  </span>
                </div>
              </a>
              <p className="text-wangari-cream/70 max-w-md mb-6">
                Rooted in Nature. Packaged with Purpose. Authentic agricultural and wellness brand based in Kenya.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Explore</h4>
              <ul className="space-y-2 text-wangari-cream/70">
                <li><a href="#" className="hover:text-wangari-terracotta transition-colors">Shop Botanicals</a></li>
                <li><a href="#" className="hover:text-wangari-terracotta transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-wangari-terracotta transition-colors">Zero Waste Impact</a></li>
                <li><a href="#" className="hover:text-wangari-terracotta transition-colors">Journal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Newsletter</h4>
              <p className="text-wangari-cream/70 mb-4 text-sm">Join our community for 10% off your first harvest.</p>
              {isSubscribed ? (
                <div className="bg-wangari-terracotta/20 border border-wangari-terracotta/40 text-wangari-cream px-4 py-3 rounded-sm text-sm font-medium">
                  Thank you! You are on the waitlist.
                </div>
              ) : (
                <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address" 
                    className="bg-wangari-cream/10 border border-wangari-cream/20 text-white px-4 py-2 focus:outline-none focus:border-wangari-terracotta transition-colors"
                    required
                  />
                  <button 
                    type="submit" 
                    className="bg-wangari-terracotta text-white px-4 py-2 font-medium hover:bg-[#8B5A2B] transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="pt-8 border-t border-wangari-cream/10 flex flex-col md:flex-row justify-between items-center text-sm text-wangari-cream/50">
            <p>&copy; 2026 Wangari Bio Organics. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Chatbot */}
      {/* Floating Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-40 bg-wangari-green text-wangari-cream p-4 rounded-full shadow-[0_8px_16px_-4px_rgba(42,75,60,0.4)] hover:bg-[#1f382c] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        aria-label="Toggle AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-wangari-green/10 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isChatOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-wangari-green p-4 flex items-center justify-between text-wangari-cream">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-serif font-bold tracking-wide">Wangari AI Assistant</h3>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="hover:text-wangari-terracotta transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-wangari-cream/20 flex flex-col gap-3 h-80">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-wangari-terracotta text-white rounded-tr-none' 
                    : 'bg-white border border-wangari-green/10 text-gray-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-wangari-green/10 text-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm text-sm flex gap-1.5 items-center h-10">
                <span className="animate-bounce inline-block w-1.5 h-1.5 bg-wangari-green/50 rounded-full" style={{ animationDelay: '0s' }}></span>
                <span className="animate-bounce inline-block w-1.5 h-1.5 bg-wangari-green/50 rounded-full" style={{ animationDelay: '0.2s' }}></span>
                <span className="animate-bounce inline-block w-1.5 h-1.5 bg-wangari-green/50 rounded-full" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-wangari-green/10 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about our botanicals..."
            className="flex-1 bg-wangari-cream/10 border border-wangari-green/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-wangari-terracotta transition-colors text-gray-800 placeholder:text-gray-400"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-wangari-green text-wangari-cream p-2 rounded-md hover:bg-wangari-terracotta disabled:opacity-50 disabled:hover:bg-wangari-green transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Cart Slide-out Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-wangari-cream shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-wangari-green/10 bg-white">
              <h2 className="font-serif text-2xl font-bold text-wangari-green">Your Harvest</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-wangari-green hover:text-wangari-terracotta transition-colors"
                aria-label="Close cart"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                  <ShoppingCart className="h-12 w-12 mb-4 opacity-20 text-wangari-green" />
                  <p className="text-lg">Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-wangari-terracotta hover:text-[#8B5A2B] font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-sm border border-wangari-green/5 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-sm" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-wangari-green/80 font-medium mt-1 text-sm">KES {item.price}</p>
                        
                        <div className="flex items-center gap-3 mt-3">
                           <div className="flex items-center border border-gray-200 rounded-sm">
                             <button
                               onClick={() => updateQuantity(item.id, -1)}
                               className="p-1 text-gray-500 hover:text-wangari-terracotta transition-colors"
                             >
                               {item.quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                             </button>
                             <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                             <button
                               onClick={() => updateQuantity(item.id, 1)}
                               className="p-1 text-gray-500 hover:text-wangari-terracotta transition-colors"
                             >
                               <Plus className="h-4 w-4" />
                             </button>
                           </div>
                        </div>
                      </div>
                      <div className="text-right font-bold text-gray-900 self-start">
                        KES {item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t border-wangari-green/10 p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                  <span>Subtotal</span>
                  <span>KES {cartTotal}</span>
                </div>
                <p className="text-gray-500 text-xs mb-6">Delivery calculated by our team via WhatsApp.</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 px-6 bg-wangari-green text-wangari-cream font-medium hover:bg-[#1f382c] transition-colors duration-300 flex justify-center items-center rounded-sm"
                >
                  Checkout via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
