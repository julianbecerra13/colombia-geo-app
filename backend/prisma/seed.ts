import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const departamentosConCiudades = [
  { nombre: 'Amazonas', ciudades: ['Leticia', 'Puerto Nariño'] },
  { nombre: 'Antioquia', ciudades: ['Medellín', 'Bello', 'Envigado', 'Itagüí', 'Rionegro'] },
  { nombre: 'Arauca', ciudades: ['Arauca', 'Saravena', 'Tame'] },
  { nombre: 'Atlántico', ciudades: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'] },
  { nombre: 'Bolívar', ciudades: ['Cartagena', 'Magangué', 'Turbaco', 'El Carmen de Bolívar'] },
  { nombre: 'Boyacá', ciudades: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'] },
  { nombre: 'Caldas', ciudades: ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría'] },
  { nombre: 'Caquetá', ciudades: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'] },
  { nombre: 'Casanare', ciudades: ['Yopal', 'Aguazul', 'Villanueva', 'Tauramena'] },
  { nombre: 'Cauca', ciudades: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'] },
  { nombre: 'Cesar', ciudades: ['Valledupar', 'Aguachica', 'Bosconia', 'Codazzi'] },
  { nombre: 'Chocó', ciudades: ['Quibdó', 'Istmina', 'Condoto', 'Tadó'] },
  { nombre: 'Córdoba', ciudades: ['Montería', 'Cereté', 'Lorica', 'Sahagún'] },
  { nombre: 'Cundinamarca', ciudades: ['Bogotá', 'Soacha', 'Girardot', 'Zipaquirá', 'Facatativá'] },
  { nombre: 'Guainía', ciudades: ['Inírida'] },
  { nombre: 'Guaviare', ciudades: ['San José del Guaviare', 'Calamar'] },
  { nombre: 'Huila', ciudades: ['Neiva', 'Pitalito', 'Garzón', 'La Plata'] },
  { nombre: 'La Guajira', ciudades: ['Riohacha', 'Maicao', 'Uribia', 'Manaure'] },
  { nombre: 'Magdalena', ciudades: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'] },
  { nombre: 'Meta', ciudades: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'] },
  { nombre: 'Nariño', ciudades: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'] },
  { nombre: 'Norte de Santander', ciudades: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'] },
  { nombre: 'Putumayo', ciudades: ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez'] },
  { nombre: 'Quindío', ciudades: ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida'] },
  { nombre: 'Risaralda', ciudades: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'] },
  { nombre: 'San Andrés y Providencia', ciudades: ['San Andrés', 'Providencia'] },
  { nombre: 'Santander', ciudades: ['Bucaramanga', 'Floridablanca', 'Girón', 'Barrancabermeja'] },
  { nombre: 'Sucre', ciudades: ['Sincelejo', 'Corozal', 'San Marcos', 'Tolú'] },
  { nombre: 'Tolima', ciudades: ['Ibagué', 'Espinal', 'Melgar', 'Honda'] },
  { nombre: 'Valle del Cauca', ciudades: ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga'] },
  { nombre: 'Vaupés', ciudades: ['Mitú', 'Carurú'] },
  { nombre: 'Vichada', ciudades: ['Puerto Carreño', 'La Primavera', 'Cumaribo'] },
];

async function main() {
  console.log('Iniciando seed...');

  for (const depto of departamentosConCiudades) {
    const departamento = await prisma.departamento.create({
      data: {
        nombre: depto.nombre,
        ciudades: {
          create: depto.ciudades.map((ciudad) => ({ nombre: ciudad })),
        },
      },
    });

    console.log(`Creado: ${departamento.nombre} con ${depto.ciudades.length} ciudades`);
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
