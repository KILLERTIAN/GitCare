// components/navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X, Github } from 'lucide-react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();



  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Bounties', href: '/bounties' },
    { name: 'Reputation', href: '/reputation' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Analytics', href: '/analytics' },
  ];

  const formatUsername = (username: string) => {
    return username.length > 12 ? `${username.slice(0, 12)}...` : username;
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav shadow-lg shadow-black/10">
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
              <NavigationMenuList className="space-x-1">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-accessible transition-all duration-300 hover:text-high-contrast hover:bg-white/10 hover:backdrop-blur-sm hover:border hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/20 glass-focus active:scale-95"
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* GitHub Authentication */}
            {session ? (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full glass-base border-white/30 hover:bg-white/15 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 glass-focus">
                  <Github className="h-4 w-4 text-orange-400 drop-shadow-sm" />
                  <span className="text-sm font-medium text-high-contrast">
                    {formatUsername(session.user?.login || session.user?.name || 'User')}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-red-400/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 backdrop-blur-sm transition-all duration-300 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('github')}
                className="hidden sm:flex glass-button-primary text-white border-0 rounded-full px-6 py-2 font-medium transition-all duration-300 hover:scale-105"
              >
                <Github className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-full glass-base border-white/30 hover:bg-white/15 hover:border-white/40 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                >
                  {isOpen ? (
                    <X className="h-5 w-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
                  ) : (
                    <Menu className="h-5 w-5 transition-transform duration-300" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] glass-nav border-l border-white/20 shadow-2xl shadow-black/20">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-white/20">
                    <Link
                      href="/"
                      className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative">
                        <Image src="/gitcare-logo.png" width={24} height={24} alt='logo' className="transition-transform duration-300 group-hover:rotate-12"></Image>
                      </div>
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-orange-300">
                        GitCare
                      </span>
                    </Link>
                  </div>
                  <nav className="flex-1 space-y-2 p-4">
                    {navigationItems.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group flex py-3 px-4 rounded-xl text-accessible hover:text-high-contrast glass-base hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-95 glass-focus"
                        onClick={() => setIsOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-white/20 space-y-3">
                    {session ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 px-3 py-2 rounded-full glass-base border-white/30 hover:bg-white/15 hover:border-white/40 transition-all duration-300 glass-focus">
                          <Github className="h-4 w-4 text-orange-400 drop-shadow-sm" />
                          <span className="text-sm font-medium text-high-contrast">
                            {formatUsername(session.user?.login || session.user?.name || 'User')}
                          </span>
                        </div>
                        <Button
                          onClick={() => signOut()}
                          className="w-full rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 border border-red-400/40 hover:border-red-400/60 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => signIn('github')}
                        className="w-full glass-button-primary rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Sign In with GitHub
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