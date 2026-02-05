import type { Route } from "../+types/home";
import { GlassCard } from "~/components/GlassCard";
import LoadingComponent from "~/components/LoadingComponent";
import { useData } from "~/context/DataContext";
import { useEffect, useState } from "react";
import { EntityTable } from "~/components/EntityTable";
import type { TableColumn } from "react-data-table-component";
import {
  optionsMedioPago,
  optionsTypeMov,
  type CtasCtesDB,
  type CtaCteConCliente,
  type ChequesDB,
  type CtasCtesWithCheque,
} from "~/types/ctas_corrientes";
import { capitalize } from "~/config/settingsConfig";
import { formatDateUStoES } from "~/utils/formatDate";
import { formatCuit } from "~/components/Inputs";
import ButtonsActionsCtaCte from "~/components/ButtonsActionsCtaCte";
import { useParams } from "react-router";
import { Banknote } from "lucide-react";
import { useUIModals } from "~/context/ModalsContext";
import EditMovimientoModal from "~/components/modals/customs/EditMovimientoModal";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cuenta Corriente" },
    {
      name: "description",
      content: "Revisión y Gestión de Cuentas Corrientes",
    },
  ];
}
const columns: TableColumn<CtasCtesWithCheque>[] = [
  {
    name: "Fecha",
    selector: (row) => formatDateUStoES(row.fecha_movimiento),
  },
  {
    name: "Tipo",
    selector: (row) => capitalize(row.tipo_movimiento),
    sortable: true,
  },
  { name: "Origen", selector: (row) => capitalize(row.origen), sortable: true },
  {
    name: "Medio de pago",
    selector: (row) => capitalize(row.medio_pago) || "-",
    sortable: true,
  },
  {
    name: "Debe",
    selector: (row) =>
      (row.debe || 0).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    sortable: true,
  },
  {
    name: "Haber",
    selector: (row) =>
      (row.haber || 0).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    sortable: true,
  },
  {
    name: "Cheques",
    width: "95px",
    cell: (row) => {
      if (row.medio_pago === "cheque") {
        return (
          <div className={"flex gap-2 text-green-600 dark:text-green-400"}>
            {row.cheques?.length} <Banknote className="w-5 h-5" />
          </div>
        );
      } else {
        return null;
      }
    },
  },
];
export default function CuentaCorriente() {
  const { ctaCteId } = useParams();
  const {
    ctasCtesByClientes,
    getCtasCtesByClientes,
    ctaCteWithCheques,
    getCtaCteWithCheques,
  } = useData();
  const { openModal } = useUIModals();
  const [currentSaldo, setCurrentSaldo] = useState(0);
  const [currentClient, setCurrentClient] =
    useState<CtaCteConCliente | null>(null);

  useEffect(() => {
    if (!ctaCteWithCheques) getCtaCteWithCheques();
  }, [getCtaCteWithCheques]);
  useEffect(() => {
    if (ctaCteWithCheques) {
      getCtasCtesByClientes();
    }
  }, [ctaCteWithCheques]);
  useEffect(() => {
    if (ctasCtesByClientes && ctaCteId) {
      const resumenCliente = ctasCtesByClientes.find(
        (c) => c.cliente_id === ctaCteId,
      );
      if (resumenCliente) {
        setCurrentClient(resumenCliente);
        setCurrentSaldo(resumenCliente.debe - resumenCliente.haber);
      }
    }
  }, [ctasCtesByClientes, ctaCteId]);

  const saldoColor =
    currentSaldo > 0
      ? "bg-green-600 dark:bg-green-500"
      : currentSaldo < 0
        ? "bg-orange-600 dark:bg-orange-500"
        : "bg-gray-600";
  const handleRowClick = (row: CtasCtesDB) => {
    openModal("CUSTOM", {
      component: EditMovimientoModal,
      props: { data: row, client: currentClient },
    });
  };
  if (!currentClient && !ctaCteWithCheques) {
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
      {ctaCteId && currentClient && (
        <div className="px-6 py-8 w-full flex flex-col items-center max-w-7xl mx-auto">
          <GlassCard
            size="full"
            blur="lg"
            opacity="low"
            padding="md"
            className="!border-gray-300/80 dark:!border-white/20"
          >
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Razón social
                  </p>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {currentClient?.razon_social}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    CUIT: {formatCuit(currentClient.cuit_cuil)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cond. IVA: {currentClient?.condicion_iva}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Saldo actual
                </span>
                <div
                  className={`mt-2 inline-flex items-center px-4 py-3 rounded-2xl text-white text-2xl font-bold ${saldoColor}`}
                >
                  {currentSaldo.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
          <div className="w-full mt-6">
            <ButtonsActionsCtaCte clienteId={ctaCteId} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Movimientos
            </h2>
            <EntityTable
              columns={columns}
              data={
                ctaCteWithCheques?.filter((c) => c.cliente_id === ctaCteId) ||
                []
              }
              onRowClick={handleRowClick}
              filterFields={[
                {
                  key: "fecha_movimiento",
                  label: "Fecha",
                  type: "dateRange",
                  autoFilter: true,
                },
                {
                  key: "tipo",
                  label: "Tipo de movimiento",
                  type: "select",
                  options: (
                    <>
                      <option value="">Todos</option>
                      {optionsTypeMov.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </>
                  ),
                  autoFilter: true,
                },
                {
                  key: "medio_pago",
                  label: "Medio de pago",
                  type: "select",
                  options: (
                    <>
                      <option value="">Todos</option>
                      {optionsMedioPago.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </>
                  ),
                  autoFilter: true,
                },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
