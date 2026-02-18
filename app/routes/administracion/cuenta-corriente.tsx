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
  type CtaCte,
  type MvtosWithCheques,
} from "~/types/ctas_corrientes";
import { capitalize } from "~/config/settingsConfig";
import { formatDateUStoES } from "~/utils/formatDate";
import { formatCuit } from "~/components/Inputs";
import ButtonsActionsCtaCte from "~/components/ButtonsActionsCtaCte";
import { useParams } from "react-router";
import { Banknote, FileArchive } from "lucide-react";
import { useUIModals } from "~/context/ModalsContext";
import MovimientoModal from "~/components/modals/customs/MovimientoModal";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cuenta Corriente" },
    {
      name: "description",
      content: "Revisión y Gestión de Cuentas Corrientes",
    },
  ];
}
const columns: TableColumn<MvtosWithCheques>[] = [
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
  {
    name: "Doc.",
    width: "95px",
    cell: (row) => {
      if (row.documentos?.length || 0> 0) {
        return (
          <div className={"flex gap-2 text-blue-600 dark:text-blue-400"}>
            {row.documentos?.length} <FileArchive className="w-5 h-5" />
          </div>
        );
      } else {
        return null;
      }
    },
  },
];
export default function CuentaCorriente() {
  const { getCtasCtes, ctasCtes } = useData();
  const { ctaCteId } = useParams();

  const { openModal } = useUIModals();
  const [currentCtaCte, setCurrentCtaCte] = useState<CtaCte | null>(null);
  const updateCurrentCtaCte = (ctaCteId: string) => {
    if (!ctasCtes) return;
    const resumenCliente = ctasCtes.find((c) => c.id === ctaCteId);
    if (resumenCliente) {
      setCurrentCtaCte(resumenCliente);
    }
  };
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  useEffect(() => {
    if (ctaCteId) {
      updateCurrentCtaCte(ctaCteId);
    }
  }, [ctasCtes, ctaCteId]);
  const handleRowClick = (row: MvtosWithCheques) => {
    openModal("CUSTOM", {
      component: MovimientoModal,
      props: {
        data: row,
        client: currentCtaCte,
        mode: "edit",
      },
    });
  };
  if (!currentCtaCte) {
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
      {currentCtaCte && (
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
                    {currentCtaCte?.razon_social}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    CUIT: {formatCuit(currentCtaCte.cuit_cuil)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cond. IVA: {currentCtaCte?.condicion_iva}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Saldo actual
                </span>
                <div
                  className={`mt-2 inline-flex items-center px-4 py-3 rounded-2xl text-white text-2xl font-bold ${currentCtaCte.saldo < 0 ? "bg-red-500" : currentCtaCte.saldo > 0 ? "bg-green-500" : "bg-gray-500"}`}
                >
                  {currentCtaCte.saldo.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
          <div className="w-full mt-6">
            <ButtonsActionsCtaCte clienteId={currentCtaCte.id} ctaCte={currentCtaCte}/>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Movimientos
            </h2>
            <EntityTable
              columns={columns}
              data={currentCtaCte.movimientos}
              onRowClick={handleRowClick}
              filterFields={[
                {
                  key: "fecha_movimiento",
                  label: "Fecha",
                  type: "dateRange",
                  autoFilter: true,
                },
                {
                  key: "tipo_movimiento",
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
