'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl relative overflow-hidden">
          <Sun className={cn(
            "h-5 w-5 transition-all duration-300",
            resolvedTheme === 'dark' ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} />
          <Moon className={cn(
            "absolute h-5 w-5 transition-all duration-300",
            resolvedTheme === 'dark' ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )} />
          <span className="sr-only">Tema değiştir</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="rounded-lg cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          Açık
          {theme === 'light' && <Check className="ml-auto h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="rounded-lg cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4 text-violet-500" />
          Koyu
          {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="rounded-lg cursor-pointer"
        >
          <Monitor className="mr-2 h-4 w-4 text-blue-500" />
          Sistem
          {theme === 'system' && <Check className="ml-auto h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
