import { useState } from 'react';
import { ShoppingCart, Menu, X, Leaf, Recycle, Handshake, ArrowRight } from 'lucide-react';
import { Logo } from './components/Logo';

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
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
              <button className="relative p-2 text-wangari-green hover:text-wangari-terracotta transition-colors group">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-wangari-terracotta rounded-full">
                    {cartCount}
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

        {/* Featured Products Section */}
        <section id="botanicals" className="py-24 bg-wangari-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-wangari-green mb-4">Our Harvest</h2>
              <div className="w-24 h-1 bg-wangari-terracotta mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
              {/* Product Card 1 */}
              <div className="group flex flex-col bg-white rounded-none shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-wangari-green/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="https://images.pexels.com/photos/5987947/pexels-photo-5987947.jpeg" 
                    alt="Premium Sun-Dried Hibiscus" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-wangari-green text-wangari-cream text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    Phase 1
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-wangari-green mb-1">Premium Sun-Dried Hibiscus</h3>
                      <p className="text-sm text-wangari-terracotta font-medium tracking-wide uppercase">Sourced from Murang'a</p>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">KES 850</span>
                  </div>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                    Meticulously sorted, bioactive hibiscus. Perfect for antioxidant-rich teas and wellness infusions. Hand-harvested at peak potency.
                  </p>
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 px-6 bg-wangari-green text-wangari-cream font-medium hover:bg-[#1f382c] transition-colors duration-300 flex justify-center items-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="group flex flex-col bg-white rounded-none shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-wangari-green/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img 
                    src="https://i.pinimg.com/736x/71/db/44/71db44ac2ef7ff7637576a79322697e4.jpg" 
                    alt="Avocado Seed Extract Oil" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-gray-800 text-wangari-cream text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    Phase 2
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-gray-800 mb-1">Avocado Seed Extract Oil</h3>
                      <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">In Development</p>
                    </div>
                    <span className="text-xl font-semibold text-gray-400">TBA</span>
                  </div>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                    Upcycled, cold-pressed bioactive extraction for deeply nourished skin. Transforming agricultural byproducts into premium skincare.
                  </p>
                  <button 
                    disabled
                    className="w-full py-4 px-6 bg-gray-200 text-gray-500 font-medium cursor-not-allowed flex justify-center items-center"
                  >
                    Join Waitlist
                  </button>
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
              <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
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
    </div>
  );
}
