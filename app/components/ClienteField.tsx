import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { SelectFieldCustom } from "./Inputs";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "~/context/ModalsContext";
import ClienteNuevoModal from "./modals/customs/ClienteNuevoModal";
import { set, type UseFormSetValue } from "react-hook-form";
import { UserRoundPlus } from "lucide-react";
export default function ClienteField({
  value,
  required = false,
  setValue,
  errors,
  register
}: {
  value?: string;
  required?: boolean;
  setValue: UseFormSetValue<any>;
  errors: any;
  register: any;
}) {
  const { clientes, getClientes } = useData();
  const { openModal, closeModal } = useUIModals();
  useEffect(() => {
    if (!clientes) {
      getClientes();
    }
  }, []);
  const handleOpenClienteModal = () => {
    openModal("CUSTOM", {
      component: ClienteNuevoModal,
      props: {
        handleSelectedCliente: (item: ClientesBD) => handleSelectedCliente(item)
      },
    });
  };
  const handleSelectedCliente = (selectItem: ClientesBD) => {
    const clienteId = selectItem.id;
    if (clienteId) {
      openModal("LOADING", {
        title: "Cargando datos del cliente...",
        message: "",
      });
      setValue("cliente", selectItem, { shouldDirty: true });
      //setValue("cliente.id", clienteId, { shouldDirty: true });
      setValue("cliente_id", clienteId, { shouldDirty: true });
      /* setValue("cliente.razon_social", selectItem.razon_social, {
        shouldDirty: true,
      }); */
      /* setValue("cliente.vendedor_id", selectItem.vendedor_id || "", {
        shouldDirty: true,
      }); */
      closeModal();
    }
  };
  return (
    <div className="flex gap-1 items-end">
      <div className="w-full">
        <SelectFieldCustom
          label="Cliente"
          requiredField={required}
          disabled={!clientes}
          placeholderMainInput="Seleccione un cliente"
          data={clientes || []}
          keyOfData="razon_social"
          initialValue={value}
          onChange={(selectItem) => handleSelectedCliente(selectItem)}
        />
        {errors.cliente?.id && (
          <span className="block mt-0.5 text-red-500 text-xs">
            {errors.cliente.id.message}
          </span>
        )}
        <input
          type="hidden"
          {...register("cliente.id", {
            required: "Debe seleccionar un cliente",
          })}
        />{/*  */}
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
  );
}
