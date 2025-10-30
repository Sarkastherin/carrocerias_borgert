import {
  Input,
  Textarea,
  Select,
  InputWithIcon,
  CurrencyInput,
} from "../Inputs";
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

export default function PedidosForm() {
  const { vendedores, getVendedores } = useData();
  const { openModal } = useUIModals();
  
  const { isLoading: isLoadingData } = useDataLoader({
    loaders: getVendedores,
    dependencies: [vendedores],
    errorMessage: "Error loading vendedores"
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
                          value={watch("cliente_id")}
                          onChange={(value) =>
                            setValue("cliente_id", value, { shouldDirty: true })
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
                  >
                    <option value="">Seleccione un vendedor</option>
                    {vendedores?.filter(item=> item.activo).map((vendedor) => (
                      <option key={vendedor.id} value={vendedor.id}>
                        {`${vendedor.nombre} ${vendedor.apellido}`}
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
                  >
                    <option value="">Seleccione un status</option>
                    <option value="nuevo">🆕 Nuevo</option>
                    <option value="en_produccion">🛠️ En Producción</option>
                    <option value="finalizado">✅ Finalizado</option>
                    <option value="entregado">📦 Entregado</option>
                    <option value="cancelado">🚫 Cancelado</option>
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
                  error={errors.fecha_entrega_estimada?.message}
                />
                <CurrencyInput
                  label="Precio total"
                  value={watch("precio_total")}
                  onChange={(value) =>
                    setValue("precio_total", value === "" ? 0 : value, {
                      shouldDirty: true,
                    })
                  }
                  error={errors.precio_total?.message}
                />
                <input
                  type="hidden"
                  {...register("precio_total", {
                    required: "Este campo es requerido",
                    valueAsNumber: true,
                  })}
                />
                <div className="md:col-span-2">
                  <Select
                    label="Forma de pago"
                    {...register("forma_pago", {
                      required: "Este campo es requerido",
                    })}
                    error={errors.forma_pago?.message}
                  >
                    <option value="">Seleccione una forma de pago</option>
                    <option value="6 cheques/echeqs 0-150 días (Precio Neto)">
                      6 cheques/echeqs 0-150 días (Precio Neto)
                    </option>
                    <option value="Entrega del 40% + 4 cheques/echeqs (5% de descuento)">
                      Entrega del 40% + 4 cheques/echeqs (5% de descuento)
                    </option>
                    <option value="Contado/transferencia (10% de descuento)">
                      Contado/transferencia (10% de descuento)
                    </option>
                  </Select>
                </div>
              </fieldset>
            </CardToggle>
            <FooterForm>
              <Button type="submit" variant="blue" disabled={isLoading || isLoadingData}>
                {isLoading ? "Guardando..." : submitButtonText}
              </Button>
            </FooterForm>
          </form>
        </>
      )}
    </>
  );
}
