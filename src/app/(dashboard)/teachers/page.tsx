'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronRight, Loader2, Pencil, Trash2, Users, Building2, GraduationCap } from 'lucide-react';
import { useTeachers } from '@/hooks/use-teachers';
import { useAuth } from '@/contexts/auth-context';
import { FACULTIES, getDepartmentsByFaculty, getFacultyName, getDepartmentName } from '@/constants/faculties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Teacher } from '@/types';

type ViewLevel = 'faculties' | 'departments' | 'teachers';

export default function TeachersPage() {
  const { teachers, isLoading, deleteTeacher } = useTeachers();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; teacher: Teacher | null }>({
    show: false,
    teacher: null,
  });

  const viewLevel: ViewLevel = selectedDepartment
    ? 'teachers'
    : selectedFaculty
    ? 'departments'
    : 'faculties';

  // Group teachers by faculty and department
  const groupedData = useMemo(() => {
    const grouped: Record<string, Record<string, Teacher[]>> = {};

    teachers.forEach((teacher) => {
      const facultyName = getFacultyName(teacher.faculty);
      const deptName = getDepartmentName(teacher.faculty, teacher.department);

      if (!grouped[facultyName]) {
        grouped[facultyName] = {};
      }
      if (!grouped[facultyName][deptName]) {
        grouped[facultyName][deptName] = [];
      }
      grouped[facultyName][deptName].push(teacher);
    });

    return grouped;
  }, [teachers]);

  // Filter based on search term
  const filteredFaculties = useMemo(() => {
    const faculties = Object.keys(groupedData);
    if (!searchTerm || viewLevel !== 'faculties') return faculties.sort();
    return faculties
      .filter((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [groupedData, searchTerm, viewLevel]);

  const filteredDepartments = useMemo(() => {
    if (!selectedFaculty || !groupedData[selectedFaculty]) return [];
    const departments = Object.keys(groupedData[selectedFaculty]);
    if (!searchTerm || viewLevel !== 'departments') return departments.sort();
    return departments
      .filter((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [groupedData, selectedFaculty, searchTerm, viewLevel]);

  const filteredTeachers = useMemo(() => {
    if (!selectedFaculty || !selectedDepartment) return [];
    const deptTeachers = groupedData[selectedFaculty]?.[selectedDepartment] || [];
    if (!searchTerm) return deptTeachers.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    return deptTeachers
      .filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  }, [groupedData, selectedFaculty, selectedDepartment, searchTerm]);

  const handleDeleteClick = (teacher: Teacher) => {
    setDeleteConfirm({ show: true, teacher });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.teacher) {
      await deleteTeacher(deleteConfirm.teacher.id);
      setDeleteConfirm({ show: false, teacher: null });
    }
  };

  const getPlaceholder = () => {
    switch (viewLevel) {
      case 'faculties':
        return 'Fakülte ara...';
      case 'departments':
        return 'Bölüm ara...';
      case 'teachers':
        return 'Öğretmen ara...';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Öğretmenler</h1>
            <p className="text-muted-foreground">
              {teachers.length} öğretmen kayıtlı
            </p>
          </div>
        </div>
        {isAdmin && (
          <Link href="/teachers/new">
            <Button size="lg" className="shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Yeni Öğretmen
            </Button>
          </Link>
        )}
      </div>

      {/* Breadcrumb */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button
            onClick={() => {
              setSelectedFaculty(null);
              setSelectedDepartment(null);
              setSearchTerm('');
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              !selectedFaculty 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Fakülteler
          </button>
          {selectedFaculty && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <button
                onClick={() => {
                  setSelectedDepartment(null);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  !selectedDepartment 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Building2 className="h-4 w-4" />
                {selectedFaculty}
              </button>
            </>
          )}
          {selectedDepartment && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium">
                <Users className="h-4 w-4" />
                {selectedDepartment}
              </span>
            </>
          )}
        </div>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 text-base"
        />
      </div>

      {/* Content */}
      {viewLevel === 'faculties' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fakülte Adı</TableHead>
                <TableHead>Bölüm Sayısı</TableHead>
                <TableHead>Öğretmen Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculties.map((faculty) => {
                const departments = groupedData[faculty] || {};
                const deptCount = Object.keys(departments).length;
                const teacherCount = Object.values(departments).flat().length;

                return (
                  <TableRow key={faculty}>
                    <TableCell className="font-medium">{faculty}</TableCell>
                    <TableCell>{deptCount}</TableCell>
                    <TableCell>{teacherCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFaculty(faculty);
                          setSearchTerm('');
                        }}
                      >
                        Detayları Gör
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredFaculties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Fakülte bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {viewLevel === 'departments' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bölüm Adı</TableHead>
                <TableHead>Öğretmen Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => {
                const teacherCount = groupedData[selectedFaculty!]?.[department]?.length || 0;

                return (
                  <TableRow key={department}>
                    <TableCell className="font-medium">{department}</TableCell>
                    <TableCell>{teacherCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setSearchTerm('');
                        }}
                      >
                        Detayları Gör
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Bölüm bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {viewLevel === 'teachers' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  <Badge variant={teacher.is_active !== false ? 'success' : 'secondary'}>
                    {teacher.is_active !== false ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{teacher.email}</p>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <Link href={`/teachers/${teacher.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="mr-2 h-4 w-4" />
                        Düzenle
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(teacher)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {filteredTeachers.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              Öğretmen bulunamadı
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, teacher: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
            <DialogDescription>
              <strong>{deleteConfirm.teacher?.name}</strong> adlı öğretmeni silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ show: false, teacher: null })}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
