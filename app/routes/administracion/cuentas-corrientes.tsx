import { useEffect } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { ButtonLink, ButtonLinkAdd } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import LoadingComponent from "~/components/LoadingComponent";
import type { CtaCte } from "~/types/ctas_corrientes";
import { formatCuit } from "~/components/Inputs";
import { Subheader } from "~/components/Headers";
import { Wallet } from "lucide-react";
// Función para formatear CUIT: "12345678901" -> "12-34567890-1"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cuentas Corrientes" },
    {
      name: "description",
      content: "Bienvenido a la gestión de cuentas corrientes",
    },
  ];
}

const ctasCorrientes: TableColumn<CtaCte>[] = [
  {
    name: "Razón Social",
    selector: (row) => row.razon_social,
    sortable: true,
  },
  {
    name: "CUIT/CUIL",
    selector: (row) => formatCuit(row.cuit_cuil || ""),
    sortable: true,
  },
  {
    name: "Debe",
    selector: (row) =>
      row.debe
        .toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
    sortable: true,
  },
  {
    name: "Haber",
    selector: (row) => row.haber.toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
    sortable: true,
  },
  {
    name: "Saldo",
    selector: (row) => (row.saldo).toLocaleString("es-AR", { style: "currency", currency: "ARS" }),
    sortable: true,
  },
];
export default function CuentasCorrientes() {
  const { getCtasCtes, ctasCtes, setCtaCte, ctaCte} =
    useData();
  const navigate = useNavigate();
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  const handleRowClick = (row: CtaCte) => {
    setCtaCte(row);
    navigate(`${row.id}`, {state: { ctaCte: row }});
  };
  if (!ctasCtes) {
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
      {ctasCtes.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col text-center space-y-3 text-text-secondary">
            <img
              src="/search.png"
              alt="No hay Clientes"
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-xl font-semibold">No hay movimientos.</p>
            <p className="text-sm">
              Puede agregar movimientos a una cuenta corriente haciendo clic en
              el botón de abajo
            </p>
            <div className="w-fit mx-auto">
              <ButtonLink variant="primary" to="/administracion/nuevo-movimiento">
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Agregar Movimiento
                </div>
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <Subheader
            title="Cuentas Corrientes"
            icon={{
              component: Wallet,
              color: "text-yellow-500 dark:text-yellow-400",
            }}
            back_path="/"
          />
          <EntityTable
            data={ctasCtes}
            columns={ctasCorrientes}
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
            ]}
          />
          <ButtonLinkAdd variant="yellow" to="/administracion/nuevo-movimiento">Nuevo Movimiento</ButtonLinkAdd>
        </div>
      )}
    </>
  );
}
