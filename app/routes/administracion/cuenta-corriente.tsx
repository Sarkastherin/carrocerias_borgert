import type { Route } from "../+types/home";
import { GlassCard } from "~/components/GlassCard";
import { useLocation } from "react-router";
import LoadingComponent from "~/components/LoadingComponent";
import { useData } from "~/context/DataContext";
import { useEffect, useState } from "react";
import { EntityTable } from "~/components/EntityTable";
import type { TableColumn } from "react-data-table-component";
import type { CtasCorrientesDB } from "~/types/ctas_corrientes";
import { capitalize } from "~/config/settingsConfig";
import { formatDateUStoES } from "~/utils/formatDate";
import { Button, IconButton } from "~/components/Buttons";
import MovimientoModal from "~/components/modals/customs/MovimientoModal";
import { useUIModals } from "~/context/ModalsContext";
import { formatCuit } from "~/components/Inputs";
import { Banknote, HandCoins, Truck } from "lucide-react";
import type { TipoMovimiento } from "~/components/modals/customs/MovimientoModal";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cuenta Corriente" },
    {
      name: "description",
      content: "Revisión y Gestión de Cuentas Corrientes",
    },
  ];
}
const columns: TableColumn<CtasCorrientesDB>[] = [
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
];
export default function CuentaCorriente() {
  const { openModal } = useUIModals();
  const location = useLocation();
  const cliente = location.state?.cliente || null;
  const saldo = cliente ? cliente.haber - cliente.debe : 0;
  const [currentSaldo, setCurrentSaldo] = useState(saldo);
  const {
    cuentasCorrientes,
    getCuentasCorrientes,
    ctasCorrientesByClientes,
    getCuentasCorrientesByClientes,
  } = useData();
  useEffect(() => {
    if (!cuentasCorrientes) getCuentasCorrientes();
  }, [getCuentasCorrientes]);
  useEffect(() => {
    if (cuentasCorrientes) {
      getCuentasCorrientesByClientes();
    }
  }, [cuentasCorrientes]);
  useEffect(() => {
    if (ctasCorrientesByClientes && cliente) {
      const resumenCliente = ctasCorrientesByClientes.find(
        (c) => c.cliente_id === cliente.cliente_id
      );
      if (resumenCliente) {
        setCurrentSaldo(resumenCliente.haber - resumenCliente.debe);
      }
    }
  }, [ctasCorrientesByClientes, cliente]);

  const saldoColor =
    saldo > 0
      ? "bg-green-600 dark:bg-green-500"
      : saldo < 0
        ? "bg-red-600 dark:bg-red-500"
        : "bg-gray-600";
  const handleMovimientoModal = (type: TipoMovimiento) => {
    openModal("CUSTOM", {
      component: MovimientoModal,
      props: {
        type: type,
        clienteId: cliente.cliente_id,
      },
    });
  };

  if (!cliente && !cuentasCorrientes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando clientes..." />
        </div>
      </div>
    );
  }

  return (
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
                {cliente.razon_social}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                CUIT: {formatCuit(cliente.cuit_cuil)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cond. IVA: {cliente.condicion_iva}
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
        <div className="flex justify-between gap-4 mb-4">
          <fieldset className="flex w-full gap-4 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
            <legend className="px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              💳 Registrar movimientos
            </legend>
            <IconButton
              variant="light"
              onClick={() => handleMovimientoModal("deuda")}
            >
              <Banknote className="w-5 h-5 mr-2" />
              Deuda
            </IconButton>
            <IconButton
              variant="dark"
              onClick={() => handleMovimientoModal("nota_credito")}
            >
              <Banknote className="w-5 h-5 mr-2" />
              Nota de crédito
            </IconButton>

            <IconButton
              variant="green"
              onClick={() => handleMovimientoModal("cheque")}
            >
              <Banknote className="w-5 h-5 mr-2" />
              Cheque
            </IconButton>
            <IconButton
              variant="blue"
              onClick={() => handleMovimientoModal("efectivo")}
            >
              <HandCoins className="w-5 h-5 mr-2" />
              Efectivo/Tranferencia
            </IconButton>
            <IconButton
              variant="yellow"
              onClick={() => handleMovimientoModal("carroceria_usada")}
            >
              <Truck className="w-5 h-5 mr-2" />
              Carrocería
            </IconButton>
          </fieldset>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Movimientos
        </h2>
        <EntityTable
          columns={columns}
          data={cuentasCorrientes || []}
          filterFields={[
            { key: "fecha_movimiento", label: "Fecha", autoFilter: true },
            { key: "origen", label: "Origen", autoFilter: true },
          ]}
        />
      </div>
    </div>
  );
}
