import { Github, Linkedin, Twitter, Heart, Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-1.5 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                MeetDev
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Connecting developers worldwide.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Made with</span>
              <Heart size={12} className="text-red-500 fill-red-500" />
              <span>by developers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <div className="flex flex-col gap-1">
              <a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                About Us
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <div className="flex gap-2">
              <a
                href="https://x.com/abhiInnovates"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 transition-all duration-200"
              >
                <Twitter size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-sankhwar/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                <Linkedin size={16} className="text-gray-400 hover:text-white" />
              </a>
              <a
                href="https://github.com/Abhishek220801"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                <Github size={16} className="text-gray-400 hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} MeetDev. All rights reserved.</p>
            <p className="text-gray-500">React • Node.js • MongoDB • AWS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;