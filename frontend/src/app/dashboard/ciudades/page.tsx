'use client';

import { useEffect, useState } from 'react';
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ciudadesApi, departamentosApi } from '@/lib/api';

interface Departamento {
  id: number;
  nombre: string;
}

interface Ciudad {
  id: number;
  nombre: string;
  departamentoId: number;
  departamento: Departamento;
}

export default function CiudadesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [nombre, setNombre] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDepartamentoId, setEditDepartamentoId] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Estado para confirmar eliminación
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNombre, setDeleteNombre] = useState('');
  const [openDelete, setOpenDelete] = useState(false);

  const fetchData = async () => {
    try {
      const [ciudadesData, deptosData] = await Promise.all([
        ciudadesApi.getAll(),
        departamentosApi.getAll(),
      ]);
      setCiudades(ciudadesData);
      setDepartamentos(deptosData);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!departamentoId) {
      setError('Debes seleccionar un departamento');
      return;
    }
    setSubmitting(true);
    try {
      await ciudadesApi.create(nombre, parseInt(departamentoId));
      toast.success('Ciudad creada correctamente');
      setNombre('');
      setDepartamentoId('');
      setOpenCreate(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!editDepartamentoId) {
      setError('Debes seleccionar un departamento');
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await ciudadesApi.update(editId, editNombre, parseInt(editDepartamentoId));
        toast.success('Ciudad actualizada correctamente');
        setOpenEdit(false);
        fetchData();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (ciudad: Ciudad) => {
    setDeleteId(ciudad.id);
    setDeleteNombre(ciudad.nombre);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await ciudadesApi.delete(deleteId);
      toast.success('Ciudad eliminada correctamente');
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (ciudad: Ciudad) => {
    setEditId(ciudad.id);
    setEditNombre(ciudad.nombre);
    setEditDepartamentoId(ciudad.departamentoId.toString());
    setError('');
    setOpenEdit(true);
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
          <p className="text-gray-600">Cargando ciudades...</p>
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
          <h2 className="text-2xl font-semibold">Ciudades</h2>

          <Dialog open={openCreate} onOpenChange={(open) => { setOpenCreate(open); setError(''); setNombre(''); setDepartamentoId(''); }}>
            <DialogTrigger render={<Button />}>
              Nueva ciudad
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear ciudad</DialogTitle>
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
                    placeholder="Nombre de la ciudad"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select value={departamentoId} onValueChange={(v) => setDepartamentoId(v ?? '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id.toString()}>
                          {depto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Creando...' : 'Crear'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ciudades.map((ciudad) => (
                <TableRow key={ciudad.id}>
                  <TableCell>{ciudad.id}</TableCell>
                  <TableCell className="font-medium">{ciudad.nombre}</TableCell>
                  <TableCell>{ciudad.departamento.nombre}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(ciudad)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete(ciudad)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {ciudades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No hay ciudades registradas.{' '}
                    <button onClick={() => setOpenCreate(true)} className="text-blue-600 hover:underline">
                      Crear una
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal editar ciudad */}
      <Dialog open={openEdit} onOpenChange={(open) => { setOpenEdit(open); setError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar ciudad</DialogTitle>
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
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select value={editDepartamentoId} onValueChange={(v) => setEditDepartamentoId(v ?? '')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((depto) => (
                    <SelectItem key={depto.id} value={depto.id.toString()}>
                      {depto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            ¿Estás seguro de eliminar la ciudad <strong>{deleteNombre}</strong>?
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
    </div>
  );
}
