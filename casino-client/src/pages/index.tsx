"use client"
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src="/etherlink.png" 
              alt="Etherlink Logo" 
              width={32} 
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-3xl font-bold">Etherlink Casino</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
            Welcome to the Casino
          </h2>
          <p className="text-xl text-gray-300">
            Discover our exciting games and win rewards
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blackjack Card */}
          <Card 
            className="relative overflow-hidden bg-gray-800 border-gray-700 hover:border-emerald-500 transition-all duration-300"
            onMouseEnter={() => setHoveredGame('blackjack')}
            onMouseLeave={() => setHoveredGame(null)}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <CreditCard className="h-12 w-12 text-emerald-400" />
                <h3 className="text-2xl font-bold">Blackjack</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Test your luck and strategy in this classic card game
              </p>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                onClick={() => window.location.href = '/blackjack'}
              >
                Play Now
              </Button>
            </div>
            {hoveredGame === 'blackjack' && (
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />
            )}
          </Card>

          {/* More games can be added here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>© 2024 Etherlink Casino. All rights reserved.</p>
      </footer>
    </div>
  );
}
