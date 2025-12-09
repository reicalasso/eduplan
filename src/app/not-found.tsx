'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        
        {/* 404 Illustration */}
        <div className="relative mb-10">
          <div className="text-[180px] font-black bg-gradient-to-br from-primary/20 to-violet-500/20 bg-clip-text text-transparent leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-2xl shadow-primary/30">
                <Compass className="w-14 h-14 text-white animate-float" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Kaybolmuş görünüyorsunuz</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Sayfa Bulunamadı</h1>
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
          Ana sayfaya dönerek devam edebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="shadow-xl shadow-primary/20">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Ana Sayfa
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Geri Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
