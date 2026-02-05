import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { ButtonLink, ButtonLinkAdd } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { ClientesBD } from "~/types/clientes";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import LoadingComponent from "~/components/LoadingComponent";
import { formatCuit } from "~/components/Inputs";
import { Subheader } from "~/components/Headers";
import { Users } from "lucide-react";
import type { ProveedoresBD } from "~/types/proveedores";
import UploadFile from "../developer";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Proveedores" },
    { name: "description", content: "Bienvenido a la gestión de proveedores" },
  ];
}
const proveedorColumns: TableColumn<ProveedoresBD>[] = [
  {
    name: "Razón Social",
    selector: (row) => row.razon_social,
    sortable: true,
  },
  {
    name: "Teléfono",
    selector: (row) => row.telefono,
  },
  {
    name: "Provincia",
    selector: (row) => row.provincia,
    sortable: true,
  },
  {
    name: "Localidad",
    selector: (row) => row.localidad,
    sortable: true,
  },
  {
    name: "CUIT/CUIL",
    selector: (row) => formatCuit(row.cuit_cuil || ""),
    sortable: true,
  },
];
export default function ProveedoresHome() {
  const { getProveedores, proveedores, setProveedor } = useData();
  const navigate = useNavigate();
  useEffect(() => {
    setProveedor(null);
    if (!proveedores) getProveedores();
  }, []);
  const handleRowClick = (row: ProveedoresBD) => {
    setProveedor(row);
    navigate(`/proveedores/${row.id}`);
  };
  if (!proveedores) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando proveedores..." />
        </div>
      </div>
    );
  }
  const uniqueProvincias = Array.from(
    new Set(
      proveedores
        .map((c) => c.provincia)
        .filter((p) => p)
        .sort((a, b) => a.localeCompare(b))
    )
  );
  const uniqueLocalidades = Array.from(
    new Set(
      proveedores
        .map((c) => c.localidad)
        .filter((l) => l)
        .sort((a, b) => a.localeCompare(b))
    )
  );
  return (
    <>
      {proveedores.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col text-center space-y-3 text-text-secondary">
            <img
              src="/search.png"
              alt="No hay Proveedores"
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-xl font-semibold">No hay Proveedores.</p>
            <p className="text-sm">
              Puede agregar Proveedores haciendo clic en el botón de abajo
            </p>
            <div className="w-fit mx-auto">
              <ButtonLink variant="primary" to="/proveedores/nuevo">
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Agregar Proveedor
                </div>
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <UploadFile/>
          <Subheader
            title="Proveedores"
            icon={{
              component: Users,
              color: "text-orange-600 dark:text-orange-400",
            }}
            back_path="/"
          />
          <EntityTable
            data={proveedores}
            columns={proveedorColumns}
            onRowClick={(row) => handleRowClick(row)}
            inactiveField="activo" // Campo para identificar clientes inactivos
            filterFields={[
              {
                key: "razon_social",
                label: "Razón Social",
                autoFilter: true,
              },
              {
                key: "cuit_cuil",
                label: "CUIT/CUIL",
                autoFilter: true,
              },
              {
                key: "provincia",
                label: "Provincia",
                autoFilter: true,
                type: "select",
                options: (
                  <>
                    <option value="">Todas</option>
                    {uniqueProvincias.map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </>
                ),
              },
              {
                key: "localidad",
                label: "Localidad",
                autoFilter: true,
                type: "select",
                options: (
                  <>
                    <option value="">Todas</option>
                    {uniqueLocalidades.map((localidad) => (
                      <option key={localidad} value={localidad}>
                        {localidad}
                      </option>
                    ))}
                  </>
                ),
              },
            ]}
          />
          <ButtonLinkAdd variant="orange" to="/proveedores/nuevo">Nuevo Proveedor</ButtonLinkAdd>
        </div>
      )}
    </>
  );
}
