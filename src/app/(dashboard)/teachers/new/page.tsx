'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { TeacherForm } from '@/components/teachers/teacher-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewTeacherPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/teachers');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teachers">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Öğretmen</h1>
          <p className="text-muted-foreground">Yeni bir öğretmen ekleyin</p>
        </div>
      </div>

      <TeacherForm />
    </div>
  );
}
