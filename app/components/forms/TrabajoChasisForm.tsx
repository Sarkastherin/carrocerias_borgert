import {
  Input,
  Textarea,
  Select,
  ToggleCheckbox,
  InputWithIcon,
} from "../Inputs";
import { Button, IconButton } from "../Buttons";
import { useTrabajoChasisForm } from "~/hooks/useTrabajoChasisForm";
import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { useUIModals } from "~/context/ModalsContext";
import { Trash2, PlusIcon } from "lucide-react";
import { FooterForm } from "./Footer";

export default function TrabajoChasisForm() {
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
    fieldsArray,
    handleRemove,
    defaulValuesEmpty,
  } = useTrabajoChasisForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset className="grid grid-cols-1 gap-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <colgroup>
              <col />
              <col />
              <col className="w-[1%]" />
            </colgroup>
            <thead className="text-xs text-gray-700 uppercase bg-indigo-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Descripción
                </th>
                <th scope="col" className="px-6 py-3">
                  Observación
                </th>
                <th scope="col" className="px-6 py-3">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {fieldsArray.fields.map((field, index) => (
                <tr
                  key={field.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th scope="row" className="py-4 ps-6 pe-2">
                    <Select
                      {...register(
                        `trabajo_chasis.${index}.tipo_trabajo` as const
                      )}
                    >
                      <option value="">Seleccionar tipo de trabajo</option>
                      <option value="tipo1">Tipo 1</option>
                      <option value="tipo2">Tipo 2</option>
                    </Select>
                  </th>
                  <td className="px-2">
                    <Input
                      placeholder="Descripción"
                      {...register(
                        `trabajo_chasis.${index}.descripcion` as const
                      )}
                    />
                  </td>
                  <td className="ps-2 pe-6">
                    <IconButton
                      type="button"
                      variant="red"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </fieldset>
      <div className="pt-4 w-fit">
        <Button
          type="button"
          variant="primary"
          onClick={() => fieldsArray.append(defaulValuesEmpty)}
        >
          <div className="flex gap-2">
            <PlusIcon className="w-5 h-5 mx-auto" />
            Agregar fila
          </div>
        </Button>
      </div>
      <FooterForm>
        <Button type="submit" variant="blue" disabled={isLoading}>
          {isLoading ? "Guardando..." : submitButtonText}
        </Button>
      </FooterForm>
    </form>
  );
}
