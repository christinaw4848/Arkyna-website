import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Users, Target, Award, Mail, Phone, Linkedin, Github, ExternalLink, ArrowUp } from 'lucide-react';
import TeamCarousel from "./components/TeamCarousel";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'mentorship', 'projects', 'team'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const onScroll = () => {
      handleScroll();
      setShowBackToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm shadow-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/arkyna_logo.png" alt="Arkyna" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                ARKYNA
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'mentorship', label: 'Mentorship' },
                { id: 'projects', label: 'Projects' },
                { id: 'team', label: 'Our Team' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'text-red-400'
                      : 'text-gray-300 hover:text-red-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {[
                { id: 'about', label: 'About' },
                { id: 'mentorship', label: 'Mentorship' },
                { id: 'projects', label: 'Projects' },
                { id: 'team', label: 'Our Team' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-orange-400 hover:bg-gray-800 transition-colors rounded-md"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* About Section (Landing) - Dark Theme */}
      <section id="about" className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="/arkyna_logo.png" 
                alt="Arkyna" 
                className="h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 w-auto mx-auto mb-8 drop-shadow-2xl" 
              />
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-300 to-red-700 animate-gradient bg-clip-text text-transparent mb-4">
                ARKYNA
                </h1>
              <p className="text-xl md:text-2xl text-orange-200 font-light tracking-wide">
                BRINGING GENERATIONS CLOSER
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                At Arkyna, we bridge the gap between generations through innovative technology solutions. 
                Our mission is to create meaningful connections and empower communities through cutting-edge 
                software development and mentorship programs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection('mentorship')}
                  className="bg-gradient-to-r from-orange-400 to-red-700 animate-gradient text-white px-8 py-3 rounded-lg font-medium hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                >
                  Explore Mentorship
                  <ChevronRight size={20} className="ml-2" />
                </button>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="border-2 border-orange-400 text-orange-400 px-8 py-3 rounded-lg font-medium hover:bg-orange-400 hover:text-gray-900 transition-all duration-200"
                >
                  View Projects
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Section */}
      <section id="mentorship" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-600 mb-4">Summer Incubator Program</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Empowering the next generation of innovators through comprehensive mentorship and hands-on experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-200 to-red-200 border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Mentorship</h3>
              <p className="text-gray-700">
                Learn from industry professionals with years of experience in software development and entrepreneurship.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-200 to-orange-200 border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Projects</h3>
              <p className="text-gray-700">
                Work on real-world projects and build solutions that make a real impact in the community.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-200 to-red-200 border border-orange-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-700">
                Build your portfolio, network with professionals, and gain the skills needed for a successful tech career.
              </p>
            </div>
          </div>
{/* 
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Program Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-orange-500 w-4 h-4 rounded-full mr-4"></div>
                <div>
                  <span className="font-semibold text-gray-900">Week 1-2:</span>
                  <span className="text-gray-600 ml-2">Orientation and skill assessment</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-500 w-4 h-4 rounded-full mr-4"></div>
                <div>
                  <span className="font-semibold text-gray-900">Week 3-8:</span>
                  <span className="text-gray-600 ml-2">Project development and mentorship sessions</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-500 w-4 h-4 rounded-full mr-4"></div>
                <div>
                  <span className="font-semibold text-gray-900">Week 9-10:</span>
                  <span className="text-gray-600 ml-2">Project presentation and portfolio building</span>
                </div>
              </div>
            </div>
          </div> */}

          <div className="text-center">
            <div className="bg-orange-50 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent mb-4">Ready to Apply?</h3>
              <p className="text-gray-600 mb-6">
                Join our next cohort and start your journey in tech innovation.
              </p>
              <button className="w-full bg-gradient-to-r from-red-600 to-orange-400 animate-gradient text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-red-600 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Innovative solutions developed by our talented participants:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* mobilePOS Project */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 animate-gradient flex items-center justify-center">
                <div className="text-white text-5xl font-bold">mobilePOS</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">mobilePOS</h3>
                <p className="text-gray-600 mb-4">
                  A lightweight, cross-platform Point of Sale (POS) system built with Flutter, designed for both 
                  desktop and mobile (Android). This app allows users to manage inventory, process payments, 
                  view analytics, and track transactions efficiently.
                </p>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Flutter</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Dart</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">SQLite</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Cross-platform compatibility (Desktop & Mobile)</li>
                    <li>• Inventory management system</li>
                    <li>• Payment processing</li>
                    <li>• Analytics and reporting</li>
                    <li>• Transaction tracking</li>
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <a href="https://github.com/xinfay/Arkyna-mobilePOS" target = "_blank">
                  <button className="flex items-center text-orange-500 hover:text-orange-600 transition-colors">
                    <Github size={16} className="mr-1" />
                    GitHub
                  </button>
                  </a>
                </div>
              </div>
            </div>

            {/* CompanionAI Project */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-700 to-pink-500 animate-gradient flex items-center justify-center">
                <div className="text-white text-5xl font-bold">CompanionAI</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">CompanionAI</h3>
                <p className="text-gray-600 mb-4">
                  Engage in natural conversations via voice or text with your loved one's digital companion. 
                  This innovative AI solution helps bridge generational gaps by creating meaningful connections 
                  through advanced conversational AI technology.
                </p>
                {/* <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">React</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">OpenAI API</span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Speech API</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Voice and text conversation support</li>
                    <li>• Personalized AI companions</li>
                    <li>• Natural language processing</li>
                    <li>• Cross-generational communication</li>
                    <li>• Emotional intelligence integration</li>
                  </ul>
                </div> */}
                <div className="flex space-x-3">
                  <button className="flex items-center text-orange-500 hover:text-orange-600 transition-colors">
                    <ExternalLink size={16} className="mr-1" />
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}

      <TeamCarousel /> 


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/arkyna_logo.png" alt="Arkyna" className="h-8 w-auto" />
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  ARKYNA
                </div>
                <div className="text-sm text-gray-400">Bringing Generations Closer</div>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <button className="text-gray-400 hover:text-orange-400 transition-colors">
                <Mail size={20} />
              </button>
              <button className="text-gray-400 hover:text-orange-400 transition-colors">
                <Phone size={20} />
              </button>
              <button className="text-gray-400 hover:text-orange-400 transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Arkyna. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-red-400 shadow-xl rounded-full p-3 hover:bg-orange-100 transition-colors"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-6 h-6 text-red-500" />
        </button>
      )}
    </div>
  );
}

export default App;