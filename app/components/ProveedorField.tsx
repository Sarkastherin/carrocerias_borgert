import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { SelectFieldCustom } from "./Inputs";
import { useUIModals } from "~/context/ModalsContext";
import type { UseFormSetValue } from "react-hook-form";
import { UserRoundPlus } from "lucide-react";
import type { ProveedoresBD } from "~/types/proveedores";
import ProveedorNuevoModal from "./modals/customs/ProveedorNuevoModal";
export default function ProveedorField({
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
  const { proveedores, getProveedores } = useData();
  const { openModal, closeModal } = useUIModals();
  useEffect(() => {
    if (!proveedores) {
      getProveedores();
    }
  }, []);
  const handleOpenProveedorModal = () => {
    openModal("CUSTOM", {
      component: ProveedorNuevoModal,
      props: {
        handleSelectedProveedor: (item: ProveedoresBD) => handleSelectedProveedor(item)
      },
    });
  };
  const handleSelectedProveedor = (selectItem: ProveedoresBD) => {
    const proveedorId = selectItem.id;
    if (proveedorId) {
      openModal("LOADING", {
        title: "Cargando datos del proveedor...",
        message: "",
      });
      setValue("proveedor_id", proveedorId, { shouldDirty: true });
      setValue("proveedor.razon_social", selectItem.razon_social, {
        shouldDirty: true,
      });
      closeModal();
    }
  };
  return (
    <div className="flex gap-1 items-end">
      <div className="w-full">
        <SelectFieldCustom
          label="Proveedor"
          requiredField={required}
          disabled={!proveedores}
          placeholderMainInput="Seleccione un proveedor"
          data={proveedores || []}
          keyOfData="razon_social"
          initialValue={value}
          onChange={(selectItem) => handleSelectedProveedor(selectItem)}
        />
        {errors.proveedor_id && (
          <span className="block mt-0.5 text-red-500 text-xs">
            {errors.proveedor_id.message}
          </span>
        )}
        <input
          type="hidden"
          {...register("proveedor_id", {
            required: {
              value: required,
              message: "Requerido",
            },
          })}
        />{/*  */}
      </div>
      <div className="w-fit">
        <button
          type="button"
          className="w-full cursor-pointer text-center rounded-lg text-text-secondary bg-white border border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-600 p-3"
          onClick={handleOpenProveedorModal}
        >
          <UserRoundPlus className="size-4" />
        </button>
      </div>
    </div>
  );
}
