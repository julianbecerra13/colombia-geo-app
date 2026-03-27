'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    await ciudadesApi.create(nombre, parseInt(departamentoId));
    setNombre('');
    setDepartamentoId('');
    setOpenCreate(false);
    fetchData();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await ciudadesApi.update(editId, editNombre, parseInt(editDepartamentoId));
      setOpenEdit(false);
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta ciudad?')) {
      await ciudadesApi.delete(id);
      fetchData();
    }
  };

  const openEditDialog = (ciudad: Ciudad) => {
    setEditId(ciudad.id);
    setEditNombre(ciudad.nombre);
    setEditDepartamentoId(ciudad.departamentoId.toString());
    setOpenEdit(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Colombia Geo</h1>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Departamentos
            </Button>
            <Button variant="ghost" onClick={() => router.push('/dashboard/ciudades')}>
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

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>Nueva ciudad</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear ciudad</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
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
                  <Select value={departamentoId} onValueChange={setDepartamentoId} required>
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
                <Button type="submit" className="w-full">Crear</Button>
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
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(ciudad.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {ciudades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No hay ciudades registradas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar ciudad</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
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
              <Select value={editDepartamentoId} onValueChange={setEditDepartamentoId}>
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
            <Button type="submit" className="w-full">Guardar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
