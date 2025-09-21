'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  ExternalLink,
  Heart,
  Code,
  Shield,
  Zap,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Contributions', href: '/contributions' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const resources = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api-docs' },
    { name: 'Developer Guide', href: '/guide' },
    { name: 'Community', href: '/community' },
  ];

  const company = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press', href: '/press' },
  ];

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Security', href: '/security' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/gitcare' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/gitcare' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/gitcare' },
  ];

  return (
    <footer className="relative mt-20 glass-nav border-t border-white/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105 w-fit">
                <div className="relative">
                  <Image 
                    src="/gitcare-logo.png" 
                    width={40} 
                    height={40} 
                    alt="GitCare Logo" 
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-orange-300">
                  GitCare
                </span>
              </Link>
              
              <p className="text-gray-300 leading-relaxed max-w-sm">
                Empowering developers in the Avalanche ecosystem with innovative contribution tracking, 
                rewards, and community building tools.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Fast</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>Decentralized</span>
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  Stay Updated
                </h4>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter your email" 
                    className="flex-1 glass-base border-white/20 focus:border-purple-400/50 bg-white/5"
                  />
                  <Button className="glass-button-primary px-4">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-400" />
                Platform
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="group-hover:text-purple-400 transition-colors duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Resources</h3>
              <ul className="space-y-3">
                {resources.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="group-hover:text-blue-400 transition-colors duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Company</h3>
              <ul className="space-y-3">
                {company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="group-hover:text-orange-400 transition-colors duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Legal</h3>
              <ul className="space-y-3">
                {legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="group-hover:text-green-400 transition-colors duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <span>© {currentYear} GitCare. Made with</span>
                <Heart className="h-4 w-4 text-red-400 animate-pulse" />
                <span>for the Avalanche community.</span>
              </div>

              {/* Contact Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span>hello@gitcare.dev</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full glass-base border-white/20 hover:border-white/40 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 group"
                  >
                    <social.icon className="h-5 w-5 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>


      </div>
    </footer>
  );
}