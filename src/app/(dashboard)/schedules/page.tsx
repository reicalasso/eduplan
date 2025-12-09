'use client';

import { useMemo, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useSchedules } from '@/hooks/use-schedules';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const DAYS_TR: Record<string, string> = {
  Monday: 'Pazartesi',
  Tuesday: 'Salı',
  Wednesday: 'Çarşamba',
  Thursday: 'Perşembe',
  Friday: 'Cuma',
};

const TIME_SLOTS = [
  '08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00',
  '10:00-10:30', '10:30-11:00', '11:00-11:30', '11:30-12:00',
  '12:00-12:30', '12:30-13:00', '13:00-13:30', '13:30-14:00',
  '14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00',
  '16:00-16:30', '16:30-17:00',
];

export default function SchedulesPage() {
  const { schedules, isLoading, deleteByDays, fetchSchedules } = useSchedules();
  const { isAdmin } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Build schedule grid
  const scheduleGrid = useMemo(() => {
    const grid: Record<string, Record<string, typeof schedules>> = {};
    
    DAYS.forEach((day) => {
      grid[day] = {};
      TIME_SLOTS.forEach((slot) => {
        grid[day][slot] = [];
      });
    });

    schedules.forEach((schedule) => {
      const { day, time_range } = schedule;
      if (!DAYS.includes(day as typeof DAYS[number])) return;

      const [start, end] = time_range.split('-');
      const toMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const startMin = toMinutes(start);
      const endMin = toMinutes(end);

      TIME_SLOTS.forEach((slot) => {
        const [slotStart, slotEnd] = slot.split('-');
        const slotStartMin = toMinutes(slotStart);
        const slotEndMin = toMinutes(slotEnd);

        if (slotStartMin >= startMin && slotEndMin <= endMin) {
          grid[day][slot].push(schedule);
        }
      });
    });

    return grid;
  }, [schedules]);

  const handleDeleteAll = async () => {
    const uniqueDays = [...new Set(schedules.map((s) => s.day))];
    await deleteByDays(uniqueDays);
    setDeleteConfirm(false);
    fetchSchedules();
  };

  const getCapacityColor = (schedule: typeof schedules[0]) => {
    if (!schedule.classroom || !schedule.course) return '';
    const studentCount = schedule.course.student_count || 0;
    const capacity = schedule.classroom.capacity || 0;
    if (capacity === 0) return '';
    const ratio = (studentCount / capacity) * 100;
    if (ratio > 90) return 'bg-red-100 border-red-300';
    if (ratio > 75) return 'bg-orange-100 border-orange-300';
    if (ratio > 50) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ders Programı</h1>
          <p className="text-muted-foreground">Haftalık ders programını görüntüleyin</p>
        </div>
        {isAdmin && schedules.length > 0 && (
          <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Tüm Programı Sil
          </Button>
        )}
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">Ders programı bulunamadı.</p>
            <p className="text-sm text-muted-foreground">
              Program oluşturmak için Program Oluşturucu&apos;yu kullanın.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Program</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-muted p-2 text-left font-medium">Saat</th>
                  {DAYS.map((day) => (
                    <th key={day} className="border bg-muted p-2 text-center font-medium">
                      {DAYS_TR[day]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((slot) => (
                  <tr key={slot}>
                    <td className="border bg-muted/50 p-2 font-medium">{slot}</td>
                    {DAYS.map((day) => {
                      const items = scheduleGrid[day][slot];
                      return (
                        <td key={`${day}-${slot}`} className="border p-1">
                          {items.length === 0 ? (
                            <div className="h-8" />
                          ) : (
                            items.map((item, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  'rounded border p-1 text-xs',
                                  getCapacityColor(item)
                                )}
                                title={`${item.course?.name || ''} (${item.course?.code || ''})\n${item.classroom?.name || ''}\n${item.course?.student_count || 0} / ${item.classroom?.capacity || 0}`}
                              >
                                <div className="font-medium truncate">
                                  {item.course?.name}
                                </div>
                                <div className="text-muted-foreground truncate">
                                  {item.classroom?.name}
                                </div>
                              </div>
                            ))
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Kapasite Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-green-300 bg-green-100" />
                <span>%50 altı</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-yellow-300 bg-yellow-100" />
                <span>%50-75</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-orange-300 bg-orange-100" />
                <span>%75-90</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-red-300 bg-red-100" />
                <span>%90 üstü</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tüm Programı Sil</DialogTitle>
            <DialogDescription>
              Tüm ders programını silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteAll}>
              Tümünü Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
