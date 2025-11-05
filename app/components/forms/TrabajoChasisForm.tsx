import {
  Input,
  Select,
} from "../Inputs";
import { Button, IconButton } from "../Buttons";
import { useTrabajoChasisForm } from "~/hooks/useTrabajoChasisForm";
import { useData } from "~/context/DataContext";
import { Trash2, PlusIcon } from "lucide-react";
import { FooterForm } from "./Footer";
import LoadingComponent from "../LoadingComponent";
import { useDataLoader } from "~/hooks/useDataLoader";

export default function TrabajoChasisForm() {
  const { configTrabajosChasis, getConfigTrabajosChasis } = useData();
  
  const { isLoading: isLoadingData } = useDataLoader({
    loaders: getConfigTrabajosChasis,
    forceLoad: true,
    errorMessage: "Error loading config trabajos chasis"
  });
  const {
    register,
    handleSubmit,
    onSubmit,
    isLoading,
    submitButtonText,
    fieldsArray,
    handleRemove,
    defaultValuesEmpty,
  } = useTrabajoChasisForm();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="grid grid-cols-1 gap-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col  className="w-[30%]"/>
                  <col />
                  <col className="w-[1%]" />
                </colgroup>
                <thead className="text-xs text-gray-700 uppercase bg-[var(--brand-primary-50)] dark:bg-gray-700 dark:text-gray-400">
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
                            `trabajo_chasis.${index}.tipo_trabajo_id` as const
                          )}
                        >
                          <option value="">Seleccionar tipo de trabajo</option>
                          {configTrabajosChasis?.filter(item => item.activo).map((trabajo: any) => (
                            <option key={trabajo.id} value={trabajo.id}>
                              {trabajo.nombre}
                            </option>
                          ))}
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
                          variant="outlineRed"
                          size="md"
                          onClick={() => handleRemove(index)}
                        >
                          <Trash2 className="size-4 mx-auto" />
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
              variant="outlinePrimary"
              onClick={() => fieldsArray.append(defaultValuesEmpty)}
            >
              <div className="flex gap-2">
                <PlusIcon className="size-5 mx-auto" />
                Agregar trabajo
              </div>
            </Button>
          </div>
          <FooterForm>
            <Button type="submit" variant="blue" disabled={isLoading || isLoadingData}>
              {isLoading ? "Guardando..." : submitButtonText}
            </Button>
          </FooterForm>
        </form>
      )}
    </>
  );
}
