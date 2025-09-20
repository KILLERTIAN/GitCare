// components/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Moon, Sun, Menu, X, Wallet, Github, Mountain } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Contributions', href: '/contributions' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Analytics', href: '/analytics' },
  ];

  // Core Wallet Connection for Avalanche Fuji
  const connectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    setIsConnecting(true);
    try {
      // Check if Core Wallet is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        // Switch to Avalanche Fuji Testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA869' }], // Fuji testnet chain ID
          });
        } catch (switchError: any) {
          // If the chain doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xA869',
                  chainName: 'Avalanche Fuji Testnet',
                  nativeCurrency: {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18,
                  },
                  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
                },
              ],
            });
          }
        }

        setWalletAddress(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      } else {
        alert('Please install Core Wallet to connect');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('walletAddress');
  };

  // Check for existing wallet connection
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress && typeof window.ethereum !== 'undefined') {
      setWalletAddress(savedAddress);
    }
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/5 shadow-lg shadow-black/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
           <Image src="/gitcare-logo.png" width={30} height={30} alt='logo'></Image>

              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                GitCare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href} className={navigationMenuTriggerStyle()}>
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Wallet Connection */}
            {walletAddress ? (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <Mountain className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-white">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-red-400/30 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-6"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect Core'}
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-full border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/20 backdrop-blur-xl border-l border-white/10">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <Link 
                      href="/" 
                      className="flex items-center space-x-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative">
                        <Github className="h-6 w-6 text-blue-400" />
                        <Mountain className="h-3 w-3 text-orange-400 absolute -top-1 -right-1" />
                      </div>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                        OpenSource Hub
                      </span>
                    </Link>
                  </div>
                  <nav className="flex-1 space-y-2 p-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex py-3 px-4 rounded-md text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-white/10 space-y-3">
                    {walletAddress ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                          <Mountain className="h-4 w-4 text-orange-400" />
                          <span className="text-sm font-medium text-white">
                            {formatAddress(walletAddress)}
                          </span>
                        </div>
                        <Button
                          onClick={disconnectWallet}
                          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30"
                        >
                          Disconnect Wallet
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        {isConnecting ? 'Connecting...' : 'Connect Core Wallet'}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}