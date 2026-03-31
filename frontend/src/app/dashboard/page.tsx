'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { departamentosApi, ciudadesApi } from '@/lib/api';

interface Ciudad {
  id: number;
  nombre: string;
}

interface Departamento {
  id: number;
  nombre: string;
  ciudades: Ciudad[];
}

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nombre, setNombre] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Paginación y búsqueda
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const LIMIT = 10;

  // Estado para gestionar ciudades de un departamento
  const [selectedDepto, setSelectedDepto] = useState<Departamento | null>(null);
  const [openCiudades, setOpenCiudades] = useState(false);
  const [nuevaCiudad, setNuevaCiudad] = useState('');
  const [submittingCiudad, setSubmittingCiudad] = useState(false);

  // Estado para confirmar eliminación
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNombre, setDeleteNombre] = useState('');
  const [openDelete, setOpenDelete] = useState(false);

  const fetchDepartamentos = useCallback(async (p: number = page, s: string = search) => {
    try {
      const res = await departamentosApi.getAll(p, LIMIT, s || undefined);
      setDepartamentos(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
      setPage(res.page);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [page, search, router]);

  useEffect(() => {
    fetchDepartamentos(1, '');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    fetchDepartamentos(1, searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
    fetchDepartamentos(1, '');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await departamentosApi.create(nombre);
      toast.success('Departamento creado correctamente');
      setNombre('');
      setOpenCreate(false);
      fetchDepartamentos(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editId) {
        await departamentosApi.update(editId, editNombre);
        toast.success('Departamento actualizado correctamente');
        setOpenEdit(false);
        fetchDepartamentos(page, search);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (depto: Departamento) => {
    setDeleteId(depto.id);
    setDeleteNombre(depto.nombre);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await departamentosApi.delete(deleteId);
      toast.success('Departamento eliminado correctamente');
      setOpenDelete(false);
      fetchDepartamentos(page, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (depto: Departamento) => {
    setEditId(depto.id);
    setEditNombre(depto.nombre);
    setError('');
    setOpenEdit(true);
  };

  const openCiudadesDialog = (depto: Departamento) => {
    setSelectedDepto(depto);
    setNuevaCiudad('');
    setOpenCiudades(true);
  };

  const handleAddCiudad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepto || !nuevaCiudad.trim()) return;
    setSubmittingCiudad(true);
    try {
      await ciudadesApi.create(nuevaCiudad, selectedDepto.id);
      toast.success(`Ciudad "${nuevaCiudad}" agregada a ${selectedDepto.nombre}`);
      setNuevaCiudad('');
      const updated = await departamentosApi.getOne(selectedDepto.id);
      setSelectedDepto(updated);
      fetchDepartamentos(page, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear ciudad');
    } finally {
      setSubmittingCiudad(false);
    }
  };

  const handleDeleteCiudad = async (ciudadId: number, ciudadNombre: string) => {
    try {
      await ciudadesApi.delete(ciudadId);
      toast.success(`Ciudad "${ciudadNombre}" eliminada`);
      if (selectedDepto) {
        const updated = await departamentosApi.getOne(selectedDepto.id);
        setSelectedDepto(updated);
        fetchDepartamentos(page, search);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar ciudad');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando departamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Colombia Geo</h1>
          <div className="flex gap-2 items-center">
            <Button
              variant={pathname === '/dashboard' ? 'default' : 'ghost'}
              onClick={() => router.push('/dashboard')}
            >
              Departamentos
            </Button>
            <Button
              variant={pathname === '/dashboard/ciudades' ? 'default' : 'ghost'}
              onClick={() => router.push('/dashboard/ciudades')}
            >
              Ciudades
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Departamentos</h2>

          <Dialog open={openCreate} onOpenChange={(open) => { setOpenCreate(open); setError(''); setNombre(''); }}>
            <DialogTrigger render={<Button />}>
              Nuevo departamento
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear departamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre del departamento"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Creando...' : 'Crear'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Búsqueda */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre..."
            className="max-w-sm"
          />
          <Button type="submit" variant="outline">Buscar</Button>
          {search && (
            <Button type="button" variant="ghost" onClick={clearSearch}>
              Limpiar
            </Button>
          )}
        </form>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ciudades</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departamentos.map((depto) => (
                <TableRow key={depto.id}>
                  <TableCell>{depto.id}</TableCell>
                  <TableCell className="font-medium">{depto.nombre}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => openCiudadesDialog(depto)}
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {depto.ciudades.length} ciudades
                    </button>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openCiudadesDialog(depto)}>
                      Ciudades
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(depto)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(depto)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {departamentos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    {search ? 'No se encontraron resultados.' : 'No hay departamentos registrados.'}
                    {!search && (
                      <>
                        {' '}
                        <button onClick={() => setOpenCreate(true)} className="text-blue-600 hover:underline">
                          Crear uno
                        </button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Mostrando página {page} de {totalPages} ({total} registros)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => { const p = page - 1; setPage(p); fetchDepartamentos(p, search); }}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => { const p = page + 1; setPage(p); fetchDepartamentos(p, search); }}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal editar departamento */}
      <Dialog open={openEdit} onOpenChange={(open) => { setOpenEdit(open); setError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar departamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="editNombre">Nombre</Label>
              <Input
                id="editNombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal confirmar eliminación */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            ¿Estás seguro de eliminar <strong>{deleteNombre}</strong> y todas sus ciudades?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal gestionar ciudades del departamento */}
      <Dialog open={openCiudades} onOpenChange={setOpenCiudades}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ciudades de {selectedDepto?.nombre}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCiudad} className="flex gap-2">
            <Input
              value={nuevaCiudad}
              onChange={(e) => setNuevaCiudad(e.target.value)}
              placeholder="Nueva ciudad..."
              required
            />
            <Button type="submit" disabled={submittingCiudad}>
              {submittingCiudad ? '...' : 'Agregar'}
            </Button>
          </form>

          <div className="max-h-64 overflow-y-auto mt-2">
            {selectedDepto?.ciudades.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Este departamento no tiene ciudades. Agrega una arriba.
              </p>
            )}
            {selectedDepto?.ciudades.map((ciudad) => (
              <div key={ciudad.id} className="flex justify-between items-center py-2 px-1 border-b last:border-b-0">
                <span>{ciudad.nombre}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteCiudad(ciudad.id, ciudad.nombre)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
