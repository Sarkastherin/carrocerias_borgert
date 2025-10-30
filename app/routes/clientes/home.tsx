import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { Spinning } from "~/components/Spinning";
import { Button, ButtonLink, ButtonLinkAdd } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { ClientesBD } from "~/types/clientes";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import LoadingComponent from "~/components/LoadingComponent";

// Función para formatear CUIT: "12345678901" -> "12-34567890-1"
const formatCuit = (cuit: string): string => {
  if (!cuit) return "";
  const cleaned = cuit.replace(/\D/g, ""); // Solo números
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 10) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10, 11)}`;
};
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clientes" },
    { name: "description", content: "Bienvenido a la gestión de clientes" },
  ];
}
const clienteColumns: TableColumn<ClientesBD>[] = [
  {
    name: "Razón Social",
    selector: (row) => row.razon_social,
  },
  {
    name: "Nombre de Contacto",
    selector: (row) => row.nombre_contacto,
  },
  {
    name: "Teléfono",
    selector: (row) => row.telefono,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "CUIT/CUIL",
    selector: (row) => formatCuit(row.cuit_cuil || ""),
  },
];
export default function ClientesHome() {
  const { getClientes, clientes, setCliente } = useData();
  const navigate = useNavigate();
  useEffect(() => {
    setCliente(null);
    if (!clientes) getClientes();
  }, []);
  const handleRowClick = (row: ClientesBD) => {
    setCliente(row);
    navigate(`/clientes/${row.id}`);
  };
  if (!clientes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando clientes..." />
        </div>
      </div>
    );
  }
  return (
    <>
      {clientes.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col text-center space-y-3 text-text-secondary">
            <img
              src="/search.png"
              alt="No hay Clientes"
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-xl font-semibold">No hay Clientes.</p>
            <p className="text-sm">
              Puede agregar Clientes haciendo clic en el botón de abajo
            </p>
            <div className="w-fit mx-auto">
              <ButtonLink variant="primary" to="/clientes/nuevo">
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Agregar Cliente
                </div>
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <EntityTable
            data={clientes}
            columns={clienteColumns}
            onRowClick={(row) => handleRowClick(row)}
            inactiveField="activo" // Campo para identificar clientes inactivos
            filterFields={[
              {
                key: "razon_social",
                label: "Razón Social",
                autoFilter: true,
              },
            ]}
          />
          <ButtonLinkAdd to="/clientes/nuevo">Nuevo Cliente</ButtonLinkAdd>
        </div>
      )}
    </>
  );
}
