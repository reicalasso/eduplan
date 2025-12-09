'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ClassroomForm } from '@/components/classrooms/classroom-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface EditClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default function EditClassroomPage({ params }: EditClassroomPageProps) {
  const { id } = use(params);
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
          <h1 className="text-3xl font-bold">Derslik Düzenle</h1>
          <p className="text-muted-foreground">Derslik bilgilerini güncelleyin</p>
        </div>
      </div>

      <ClassroomForm classroomId={parseInt(id)} />
    </div>
  );
}
