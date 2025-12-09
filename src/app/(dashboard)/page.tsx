'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import { statisticsApi, schedulerApi } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/ui/skeleton';
import type { Statistics, SchedulerStatus } from '@/types';

const statCards = [
  {
    title: 'Öğretmenler',
    key: 'teacherCount' as const,
    icon: Users,
    href: '/teachers',
    gradient: 'from-blue-500 to-blue-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Dersler',
    key: 'courseCount' as const,
    icon: BookOpen,
    href: '/courses',
    gradient: 'from-emerald-500 to-emerald-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Derslikler',
    key: 'classroomCount' as const,
    icon: Building2,
    href: '/classrooms',
    gradient: 'from-violet-500 to-violet-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/30',
    iconColor: 'text-violet-500',
  },
  {
    title: 'Programlar',
    key: 'scheduleCount' as const,
    icon: Calendar,
    href: '/schedules',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    iconColor: 'text-amber-500',
  },
];

const quickActions = [
  { label: 'Öğretmen Ekle', href: '/teachers/new', icon: Users, color: 'bg-blue-500' },
  { label: 'Ders Ekle', href: '/courses/new', icon: BookOpen, color: 'bg-emerald-500' },
  { label: 'Derslik Ekle', href: '/classrooms/new', icon: Building2, color: 'bg-violet-500' },
  { label: 'Program Oluştur', href: '/scheduler', icon: Zap, color: 'bg-amber-500' },
];

const recentActivities = [
  { action: 'Yeni ders eklendi', item: 'Veri Yapıları', time: '2 dk önce', type: 'success', icon: CheckCircle2 },
  { action: 'Program güncellendi', item: 'Pazartesi', time: '15 dk önce', type: 'info', icon: Activity },
  { action: 'Çakışma tespit edildi', item: 'BIL101 - BIL102', time: '1 saat önce', type: 'warning', icon: AlertTriangle },
  { action: 'Öğretmen eklendi', item: 'Dr. Ayşe Yılmaz', time: '3 saat önce', type: 'success', icon: CheckCircle2 },
];

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<Statistics>({
    teacherCount: 0,
    courseCount: 0,
    classroomCount: 0,
    scheduleCount: 0,
  });
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, statusData] = await Promise.all([
          statisticsApi.get(),
          isAdmin ? schedulerApi.getStatus() : Promise.resolve(null),
        ]);
        setStats(statsData);
        setSchedulerStatus(statusData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-violet-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium text-white/80">PlanEdu v2.0</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {user?.username}!
            </h1>
            <p className="text-white/80 max-w-md">
              Ders programı yönetim sisteminize hoş geldiniz. İşte bugünkü özetiniz.
            </p>
          </div>
          {isAdmin && (
            <Link href="/scheduler">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                <Play className="mr-2 h-5 w-5" />
                Program Oluştur
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.key} href={stat.href}>
              <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-white/80 transition-colors">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold mt-2 group-hover:text-white transition-colors">
                        {stats[stat.key]}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.lightBg} group-hover:bg-white/20 transition-colors`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor} group-hover:text-white transition-colors`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-white/70 transition-colors">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Bu ay aktif</span>
                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scheduler Status */}
          {isAdmin && schedulerStatus && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Program Durumu</CardTitle>
                      <CardDescription>Ders programı oluşturma durumu</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={schedulerStatus.completion_percentage === 100 ? 'success' : 'secondary'}
                    className="px-3 py-1"
                  >
                    {schedulerStatus.completion_percentage === 100 ? '✓ Tamamlandı' : '⏳ Devam Ediyor'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tamamlanma Oranı</span>
                    <span className="font-bold text-lg">{schedulerStatus.completion_percentage}%</span>
                  </div>
                  <Progress 
                    value={schedulerStatus.completion_percentage} 
                    variant={schedulerStatus.completion_percentage === 100 ? 'success' : 'default'}
                    className="h-3"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{schedulerStatus.total_active_courses}</p>
                    <p className="text-xs text-muted-foreground mt-1">Aktif Ders</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{schedulerStatus.total_active_sessions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Toplam Oturum</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/50 dark:to-violet-900/30">
                    <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{schedulerStatus.scheduled_sessions}</p>
                    <p className="text-xs text-muted-foreground mt-1">Programlanan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                    <CardDescription>Sık kullanılan işlemlere hızlı erişim</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link key={action.label} href={action.href}>
                        <div className="group p-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center">
                          <div className={`inline-flex p-3 rounded-xl ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-medium">{action.label}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.key} href={stat.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${stat.lightBg}`}>
                          <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{stat.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {stat.title} bilgilerini görüntüle ve yönet
                          </p>
                          <div className="flex items-center text-sm text-primary font-medium">
                            Görüntüle
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Son Aktiviteler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        activity.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.item}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-violet-500 to-pink-500" />
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pro İpucu</h3>
                  <p className="text-sm text-muted-foreground">
                    Klavye kısayollarını kullanarak daha hızlı gezinebilirsiniz.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <kbd className="px-2 py-1 text-xs bg-muted rounded-md font-mono">⌘</kbd>
                    <span className="text-xs text-muted-foreground">+</span>
                    <kbd className="px-2 py-1 text-xs bg-muted rounded-md font-mono">K</kbd>
                    <span className="text-xs text-muted-foreground ml-2">Hızlı arama</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
