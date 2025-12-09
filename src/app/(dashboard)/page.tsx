'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, Building2, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { statisticsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Statistics } from '@/types';

const statCards = [
  {
    title: 'Öğretmenler',
    key: 'teacherCount' as const,
    icon: Users,
    href: '/teachers',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Dersler',
    key: 'courseCount' as const,
    icon: BookOpen,
    href: '/courses',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Derslikler',
    key: 'classroomCount' as const,
    icon: Building2,
    href: '/classrooms',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Programlar',
    key: 'scheduleCount' as const,
    icon: Calendar,
    href: '/schedules',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics>({
    teacherCount: 0,
    courseCount: 0,
    classroomCount: 0,
    scheduleCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticsApi.get();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast.error('İstatistikler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PlanEdu&apos;ya Hoş Geldiniz</h1>
        <p className="text-muted-foreground">Eğitim Yönetimi Otomasyon Sistemi</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.key} href={stat.href}>
              <Card className="transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      stats[stat.key]
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/teachers"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <span>Öğretmenleri Yönet</span>
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>Dersleri Yönet</span>
            </Link>
            <Link
              href="/classrooms"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <Building2 className="h-5 w-5 text-purple-600" />
              <span>Derslikleri Yönet</span>
            </Link>
            <Link
              href="/schedules"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Ders Programını Görüntüle</span>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Bilgisi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versiyon</span>
              <span className="font-medium">2.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">Next.js 15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">UI</span>
              <span className="font-medium">Tailwind CSS + shadcn/ui</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
