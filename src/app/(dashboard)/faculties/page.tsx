'use client';

import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { FACULTIES, getDepartmentsByFaculty } from '@/constants/faculties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function FacultiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  const filteredFaculties = FACULTIES.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = selectedFaculty ? getDepartmentsByFaculty(selectedFaculty) : [];
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fakülteler & Programlar</h1>
        <p className="text-muted-foreground">
          Fakülte ve bölüm listesini görüntüleyin
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => {
            setSelectedFaculty(null);
            setSearchTerm('');
          }}
          className={`hover:text-primary ${!selectedFaculty ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
        >
          Fakülteler
        </button>
        {selectedFaculty && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-primary">
              {FACULTIES.find((f) => f.id === selectedFaculty)?.name}
            </span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={selectedFaculty ? 'Bölüm ara...' : 'Fakülte ara...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {!selectedFaculty ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fakülte Adı</TableHead>
                <TableHead>Bölüm Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculties.map((faculty) => {
                const deptCount = getDepartmentsByFaculty(faculty.id).length;
                return (
                  <TableRow key={faculty.id}>
                    <TableCell className="font-medium">{faculty.name}</TableCell>
                    <TableCell>{deptCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFaculty(faculty.id);
                          setSearchTerm('');
                        }}
                      >
                        Bölümleri Gör
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredFaculties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Fakülte bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bölüm Adı</TableHead>
                <TableHead>Bölüm Kodu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-muted-foreground">{dept.id}</TableCell>
                </TableRow>
              ))}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Bölüm bulunamadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
