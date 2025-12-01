import { Input, Select, CurrencyInput, SelectFieldCustom } from "../Inputs";
import { Button } from "../Buttons";
import { usePedidosForm } from "~/hooks/usePedidosForm";
import { CardToggle } from "../CardToggle";
import ClienteField from "../ClienteField";
import { useData } from "~/context/DataContext";
import { UserRoundPlus } from "lucide-react";
import { useDataLoader } from "~/hooks/useDataLoader";
import { useUIModals } from "~/context/ModalsContext";
import ClienteNuevoModal from "../modals/customs/ClienteNuevoModal";
import { FooterForm } from "./Footer";
import LoadingComponent from "../LoadingComponent";
import { formaPagoOptions, statusOptions } from "~/types/pedidos";
import type { ClientesBD } from "~/types/clientes";

export default function PedidosForm() {
  const { personal, getPersonal } = useData();
  const { openModal, closeModal } = useUIModals();

  const { isLoading: isLoadingData } = useDataLoader({
    loaders: getPersonal,
    dependencies: [personal],
    errorMessage: "Error loading vendedores",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
    watch,
    setValue,
    isEditMode,
  } = usePedidosForm();
  const handleOpenClienteModal = () => {
    openModal("CUSTOM", {
      component: ClienteNuevoModal,
      props: {},
    });
  };
  const handleSelectedCliente = (selectItem: ClientesBD) => {
    const clienteId = selectItem.id;
    if (clienteId) {
      openModal("LOADING", {
        title: "Cargando datos del cliente...",
        message: "",
      });
      setValue("cliente_id", clienteId, { shouldDirty: true });
      setValue("cliente_nombre", selectItem.razon_social, {
        shouldDirty: true,
      });
      setValue("vendedor_id", selectItem.vendedor_id || "", {
        shouldDirty: true,
      });
      closeModal();
    }
  };
  const handlePrecioChange = () => {
    const valorTasacion = watch("valor_tasacion") || 0;
    const precioTotal = watch("precio_total") || 0;
    const saldoRestante = precioTotal - valorTasacion;
    setValue("saldo_restante", saldoRestante, { shouldDirty: true });
  };
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingComponent content="Cargando parametros..." />
        </div>
      </div>
    );
  }
  return (
    <>
      {!isLoadingData && (
        <>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardToggle title="Información del Pedido">
              <fieldset className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    label="Fecha de pedido"
                    type="date"
                    {...register("fecha_pedido")}
                    error={errors.fecha_pedido?.message}
                  />
                  <div className="flex-1">
                    <div className="flex gap-1 items-end">
                      <div className="w-full">
                        <ClienteField
                          value={watch("cliente_nombre")}
                          onChange={(selectItem) =>
                            handleSelectedCliente(selectItem)
                          }
                          required={true}
                        />
                        {errors.cliente_id && (
                          <span className="block mt-0.5 text-red-500 text-xs">
                            {errors.cliente_id.message}
                          </span>
                        )}
                        <input
                          type="hidden"
                          {...register("cliente_id", {
                            required: "Debe seleccionar un cliente",
                          })}
                        />
                      </div>
                      <div className="w-fit">
                        <button
                          type="button"
                          className="w-full cursor-pointer text-center rounded-lg text-text-secondary bg-white border border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600 p-3"
                          onClick={handleOpenClienteModal}
                        >
                          <UserRoundPlus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Vendedor"
                    {...register("vendedor_id", {
                      required: "Este campo es requerido",
                    })}
                    error={errors.vendedor_id?.message}
                    requiredField={true}
                  >
                    <option value="">Seleccione un vendedor</option>
                    {personal
                      ?.filter(
                        (item) => item.activo && item.sector === "ventas"
                      )
                      .map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                          {`${empleado.nombre} ${empleado.apellido}`}
                        </option>
                      ))}
                  </Select>
                  <Select
                    label={!isEditMode ? "🔒 Status" : "Status"}
                    {...register("status", {
                      required: "Este campo es requerido",
                    })}
                    disabled={!isEditMode}
                    error={errors.status?.message}
                    requiredField={true}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </fieldset>
            </CardToggle>
            <CardToggle title="Condiciones de Pago">
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fecha prevista"
                  type="date"
                  {...register("fecha_entrega_estimada")}
                />
                <CurrencyInput
                  label="Precio total"
                  value={watch("precio_total")}
                  onChange={(value) => {
                    setValue("precio_total", value === "" ? 0 : value, {
                      shouldDirty: true,
                    });

                    handlePrecioChange();
                  }}
                  error={errors.precio_total?.message}
                  requiredField={true}
                />
                <input
                  type="hidden"
                  {...register("precio_total", {
                    required: "Este campo es requerido",
                    valueAsNumber: true,
                  })}
                />
                
                <CurrencyInput
                  label="Valor de tasación (aplica a carrocería usada)"
                  value={watch("valor_tasacion")}
                  placeholder="Ingrese el valor de tasación"
                  onChange={(value) => {
                    setValue("valor_tasacion", value === "" ? 0 : value, {
                      shouldDirty: true,
                    });
                    handlePrecioChange();
                  }}
                  error={errors.valor_tasacion?.message}
                />
                <input
                  type="hidden"
                  {...register("valor_tasacion", {
                    valueAsNumber: true,
                  })}
                />
                <CurrencyInput
                  label="Saldo restante (solo lectura)"
                  value={watch("saldo_restante")}
                  disabled={watch("forma_pago") !== "Carrocería usada"}
                  placeholder={"Saldo restante, calculado automáticamente"}
                  readOnly={true}
                  error={errors.saldo_restante?.message}
                  onChange={() => console.log("cambié")}
                />
                <input
                  type="hidden"
                  {...register("saldo_restante", {
                    valueAsNumber: true,
                  })}
                />
                <div className="col-span-2">
                  <Input
                    label="Especifique la forma de pago"
                    placeholder="Ejemp.: Entre 40% + 4 Cheques + Carroceria usada"
                    {...register("forma_pago_otros")}
                  />
                </div>
              </fieldset>
            </CardToggle>
            <FooterForm>
              <Button
                type="submit"
                variant="blue"
                disabled={isLoading || isLoadingData}
              >
                {isLoading ? "Guardando..." : submitButtonText}
              </Button>
            </FooterForm>
          </form>
        </>
      )}
    </>
  );
}
