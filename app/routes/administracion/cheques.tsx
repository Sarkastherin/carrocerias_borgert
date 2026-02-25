import { useEffect, useState } from "react";
import type { Route } from "../+types/home";
import { useData } from "~/context/DataContext";
import { ButtonLink } from "~/components/Buttons";
import { PlusIcon } from "lucide-react";
import { EntityTable } from "~/components/EntityTable";
import type { TableColumn } from "react-data-table-component";
import LoadingComponent from "~/components/LoadingComponent";
import type { ChequesEnrichWithCtaCte } from "~/types/ctas_corrientes";
import { capitalize } from "~/config/settingsConfig";
import { formatDateUStoES } from "~/utils/formatDate";
import { BadgeStatusCheque } from "~/components/Badge";
import { useNavigate } from "react-router";
import { Subheader } from "~/components/Headers";
import { Banknote } from "lucide-react";
import {
  optionsStatusCheque,
  optionsTipoCheque,
} from "~/types/ctas_corrientes";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cheques" },
    { name: "description", content: "Bienvenido a la gestión de cheques" },
  ];
}

const chequesColumns: TableColumn<ChequesEnrichWithCtaCte>[] = [
  {
    name: "Fecha de pago",
    selector: (row) => formatDateUStoES(row.fecha_cobro),
    sortable: true,
    width: "150px",
    sortFunction: (rowA, rowB) => {
      const dateA = new Date(rowA.fecha_cobro);
      const dateB = new Date(rowB.fecha_cobro);
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    name: "Tipo de Cheque",
    selector: (row) => capitalize(row.tipo),
    width: "150px",
  },
  {
    name: "Banco",
    selector: (row) => row.nombre_banco || "-",
    sortable: true,
    width: "150px",
  },
  {
    name: "Número",
    selector: (row) => row.numero,
    sortable: true,
  },
  {
    name: "Importe",
    selector: (row) =>
      row.importe.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    sortable: true,
    width: "150px",
  },
  {
    name: "Origen",
    selector: (row) => row.ctaCte.razon_social,
    sortable: true,
  },
  {
    name: "Destino",
    selector: (row) => row.proveedor?.razon_social || "-",
    sortable: true,
  },
  {
    name: "Estado",
    cell: (row) => (
      <BadgeStatusCheque status={row.status}>
        {capitalize(row.status) || "-"}
      </BadgeStatusCheque>
    ),
    width: "120px",
    sortable: true,
  },
];

export default function Cheques() {
  const navigate = useNavigate();
  const { getCtasCtes, ctasCtes } = useData();
  const [chequesEnrichedWithCtaCte, setChequesEnrichedWithCtaCte] = useState<
    ChequesEnrichWithCtaCte[] | null
  >(null);
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  useEffect(() => {
    if (!ctasCtes) return;
    const allCheques: ChequesEnrichWithCtaCte[] = ctasCtes.flatMap((cta) =>
      cta.movimientos.flatMap((mvto) =>
        mvto.cheques
          ? mvto.cheques.map((cheque) => ({ ...cheque, ctaCte: cta }))
          : [],
      ),
    );
    setChequesEnrichedWithCtaCte(allCheques);
  }, [ctasCtes]);
  const handleRowClick = (row: ChequesEnrichWithCtaCte) => {
    openModalActionCheque(row);
  };
  const openModalActionCheque = (row: ChequesEnrichWithCtaCte) => {
    navigate(`/administracion/${row.id}`, { state: { cheque: row } });
  };
  if (!chequesEnrichedWithCtaCte) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando cheques..." />
        </div>
      </div>
    );
  }

  return (
    <>
      {chequesEnrichedWithCtaCte.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col text-center space-y-3 text-text-secondary">
            <img
              src="/search.png"
              alt="No hay cheques"
              className="w-48 h-48 mx-auto mb-4"
            />
            <p className="text-xl font-semibold">No hay cheques.</p>
            <p className="text-sm">
              Puede agregar Clientes creando un nuevo movimiento desde Cuentas
              Corrientes
            </p>
            <div className="w-fit mx-auto">
              <ButtonLink
                variant="primary"
                to="/administracion/nuevo-movimiento"
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Ir a Cuentas Corrientes
                </div>
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <Subheader
            title="Cheques"
            icon={{
              component: Banknote,
              color: "text-green-500 dark:text-green-400",
            }}
            back_path="/"
          />
          <EntityTable
            data={chequesEnrichedWithCtaCte}
            columns={chequesColumns}
            onRowClick={(row) => handleRowClick(row)}
            inactiveField="activo" // Campo para identificar clientes inactivos
            filterFields={[
              {
                key: "ctaCte.razon_social",
                label: "Razón Social",
                autoFilter: true,
              },
              {
                key: "numero",
                label: "Número de Cheque",
                autoFilter: true,
              },
              {
                key: "tipo",
                label: "Tipo de Cheque",
                type: "select",
                options: (
                  <>
                    <option value="">Todos</option>
                    {optionsTipoCheque.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </>
                ),
                autoFilter: true,
              },
              {
                key: "status",
                label: "Estado",
                type: "select",
                options: (
                  <>
                    <option value="">Todos</option>
                    {optionsStatusCheque.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </>
                ),
                autoFilter: true,
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
