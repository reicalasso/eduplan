'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ClassroomForm } from '@/components/classrooms/classroom-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewClassroomPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/classrooms');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/classrooms">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Yeni Derslik</h1>
          <p className="text-muted-foreground">Yeni bir derslik ekleyin</p>
        </div>
      </div>

      <ClassroomForm />
    </div>
  );
}
