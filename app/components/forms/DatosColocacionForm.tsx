import {
  Select,
  ToggleCheckbox,
  InputWithIcon,
  Input,
  PhoneInput,
} from "../Inputs";
import { Button, IconButton } from "../Buttons";
import { CardToggle } from "../CardToggle";
import { useData } from "~/context/DataContext";
import { RulerDimensionLine, Trash2, PlusIcon } from "lucide-react";
import { useDataLoader } from "~/hooks/useDataLoader";
import { FooterForm } from "./Footer";
import LoadingComponent from "../LoadingComponent";
import {
  cintasOptions,
  tiposBoquillasOptions,
  ubicacionOptions,
} from "~/config/atributosMetadata";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { CarroceriaBD, CamionBD, TrabajoChasisBD } from "~/types/pedidos";
import {
  trabajoChasisAPI,
  carroceriaAPI,
  camionAPI,
} from "~/backend/sheetServices";
import { useUIModals } from "~/context/ModalsContext";
import { prepareUpdatePayload } from "~/utils/prepareUpdatePayload";

type DatosColocacionFormProps = {
  carroceriaData?: CarroceriaBD;
  camionData?: CamionBD;
  trabajoChasisData?: TrabajoChasisBD[];
};

export default function DatosColocacionForm() {
  const { showSuccess, showError, showLoading, showInfo } = useUIModals();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const {
    pedido,
    getPedidos,
    refreshPedidoByIdAndTable,
    configTrabajosChasis,
    getConfigTrabajosChasis,
  } = useData();
  const { isLoading: isLoadingData } = useDataLoader({
    loaders: getConfigTrabajosChasis,
    forceLoad: true,
    errorMessage: "Error loading config trabajos chasis",
  });
  const { camion, carroceria, trabajo_chasis, ...rest } = pedido || {};
  const existingPedido = { camion, carroceria, trabajo_chasis, ...rest };
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<DatosColocacionFormProps>({
    defaultValues: existingPedido
      ? {
          camionData: {
            ...camion,
          },
          carroceriaData: {
            ...carroceria,
          },
          trabajoChasisData: trabajo_chasis || [],
        }
      : {
          camionData: {
            patente: "",
            contacto_nombre: "",
            contacto_telefono: "",
          },
          carroceriaData: {
            alargue_tipo_1: "N/A",
            cant_alargue_1: 0,
            med_alargue_1: 0,
            quiebre_alargue_1: false,
            alargue_tipo_2: "N/A",
            cant_alargue_2: 0,
            med_alargue_2: 0,
            quiebre_alargue_2: false,
          },
          trabajoChasisData: [],
        },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "trabajoChasisData",
  });
  const handleRemove = (index: number) => {
    const currentItems = watch("trabajoChasisData");
    if (!currentItems) return;
    const item = currentItems[index];
    if (item?.id) {
      setDeletedIds((prev) => [...prev, item.id!]);
    }
    remove(index);
  };
  const handleChangeBoquillasField = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedBoquillas = e.target.value;
    if (selectedBoquillas === "N/A") {
      setValue("carroceriaData.boquillas", 0);
    }
  };
  const handleChangeCajonField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCajon = e.target.value;
    if (selectedCajon === "N/A") {
      setValue("carroceriaData.med_cajon_herramientas", 0);
    }
  };
  const handleToggleAlargue1 = (checked: boolean) => {
    setValue(
      "carroceriaData.alargue_tipo_1",
      checked ? "baranda a cumbrera" : "N/A",
      {
        shouldDirty: true,
      },
    );
  };
  const handleToggleAlargue2 = (checked: boolean) => {
    setValue(
      "carroceriaData.alargue_tipo_2",
      checked ? "sobre cumbrera" : "N/A",
      {
        shouldDirty: true,
      },
    );
  };
  const onSubmit = async (data: DatosColocacionFormProps) => {
    const { carroceriaData, camionData, trabajoChasisData } = data;
    try {
      showLoading("Guardando datos de colocación...");
      // Verificar si hay cambios en el formulario
      const hasDirtyFieldsCarroceria =
        dirtyFields.carroceriaData &&
        Object.keys(dirtyFields.carroceriaData).length > 0;
      const hasDirtyFieldsCamion =
        dirtyFields.camionData &&
        Object.keys(dirtyFields.camionData).length > 0;
      const hasDirtyFieldsTrabajoChasis =
        dirtyFields.trabajoChasisData &&
        Object.keys(dirtyFields.trabajoChasisData).length > 0;
      // Si no hay campos dirty, no actualizar
      if (
        !hasDirtyFieldsCarroceria &&
        !hasDirtyFieldsCamion &&
        !hasDirtyFieldsTrabajoChasis &&
        deletedIds.length === 0
      ) {
        showInfo("No se realizaron cambios en el formulario.");
        return;
      }
      if (hasDirtyFieldsCarroceria && carroceriaData) {
        const updatePayloadCarroceria = prepareUpdatePayload<CarroceriaBD>({
          dirtyFields: dirtyFields.carroceriaData,
          formData: carroceriaData,
        });
        if (Object.keys(updatePayloadCarroceria).length > 0) {
          const response = await carroceriaAPI.update(
            carroceriaData.id || "",
            updatePayloadCarroceria,
          );
          if (!response.success) {
            console.error("Carroceria update response:", response.error);
            throw new Error(
              response.message ||
                "Error desconocido al actualizar la carrocería",
            );
          }
          await refreshPedidoByIdAndTable("carroceria");
        }
      }
      if (hasDirtyFieldsCamion && camionData) {
        const updatePayloadCamion = prepareUpdatePayload<CamionBD>({
          dirtyFields: dirtyFields.camionData,
          formData: camionData,
        });
        if (Object.keys(updatePayloadCamion).length > 0) {
          const response = await camionAPI.update(
            camionData.id || "",
            updatePayloadCamion,
          );
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al actualizar el camión",
            );
          }
          await refreshPedidoByIdAndTable("camion");
        }
      }
      if (hasDirtyFieldsTrabajoChasis && trabajoChasisData) {
        const dirtyFieldsTC = dirtyFields.trabajoChasisData ?? [];
        const dataTC = trabajoChasisData;
        await Promise.all(
          dataTC.map(async (trabajo, index) => {
            const hasId = "id" in trabajo && trabajo.id;
            const dirty = dirtyFieldsTC[index];
            if (hasId && dirty && trabajo.id) {
              const fieldsChanged = Object.keys(
                dirty,
              ) as (keyof TrabajoChasisBD)[];
              const updates = fieldsChanged.reduce((acc, key) => {
                acc[key] = trabajo[key];
                return acc;
              }, {} as Partial<TrabajoChasisBD>);
              const response = await trabajoChasisAPI.update(
                trabajo.id,
                updates,
              );
              if (!response.success) {
                throw new Error(
                  response.message ||
                    "Error desconocido al actualizar trabajo de chasis",
                );
              }
            }
            if (!hasId) {
              const response = await trabajoChasisAPI.create(
                trabajo as Omit<TrabajoChasisBD, "id">,
              );

              if (!response.success) {
                throw new Error(
                  response.message ||
                    "Error desconocido al crear trabajo de chasis",
                );
              }
            }
          }),
        );
        for (const id of deletedIds) {
          const response = await trabajoChasisAPI.delete(id);
          if (!response.success) {
            throw new Error(
              response.message ||
                "Error desconocido al eliminar trabajo de chasis",
            );
          }
        }
        await refreshPedidoByIdAndTable("trabajo_chasis");
      }
      showSuccess("Datos de colocación guardados exitosamente");

      await getPedidos(); // Refresca la lista de pedidos
      setDeletedIds([]);
      // Guardar o actualizar carrocería
    } catch (error) {
      showError(
        typeof error === "string"
          ? error
          : "Error al guardar los datos de colocación",
      );
      console.error(error);
    }
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
      {pedido && !isLoadingData && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardToggle title="Accessorios">
            <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
              <Select
                label="Tipos de boquillas"
                {...register("carroceriaData.tipo_boquillas", {
                  onChange: handleChangeBoquillasField,
                  required: "Este campo es obligatorio",
                })}
                error={errors.carroceriaData?.tipo_boquillas?.message}
                requiredField
              >
                <option value="" disabled>
                  Sin selección
                </option>
                {tiposBoquillasOptions.map((boquilla) => (
                  <option key={boquilla.value} value={boquilla.value}>
                    {boquilla.label}
                  </option>
                ))}
              </Select>
              <InputWithIcon
                type="number"
                label="Cantidad de boquillas"
                {...register("carroceriaData.boquillas", {
                  required: "Este campo es obligatorio",
                  min: {
                    value:
                      watch("carroceriaData.tipo_boquillas") !== "N/A"
                        ? 0.1
                        : 0,
                    message: "La medida debe ser mayor a 0",
                  },
                  valueAsNumber: true,
                })}
                requiredField={watch("carroceriaData.tipo_boquillas") !== "N/A"}
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.boquillas?.message}
                disabled={watch("carroceriaData.tipo_boquillas") === "N/A"}
              />
              <Select
                label="Ubic. cajón de herramientas"
                {...register("carroceriaData.ubicacion_cajon_herramientas", {
                  onChange: handleChangeCajonField,
                  required: "Este campo es obligatorio",
                })}
                error={
                  errors.carroceriaData?.ubicacion_cajon_herramientas?.message
                }
                requiredField
              >
                <option value="" disabled>
                  Sin selección
                </option>
                {ubicacionOptions.map((ubicacion) => (
                  <option key={ubicacion.value} value={ubicacion.value}>
                    {ubicacion.label}
                  </option>
                ))}
              </Select>
              <InputWithIcon
                type="number"
                label="Medida cajón de herramientas"
                {...register("carroceriaData.med_cajon_herramientas")}
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.med_cajon_herramientas?.message}
                disabled={
                  watch("carroceriaData.ubicacion_cajon_herramientas") ===
                    "N/A" ||
                  watch("carroceriaData.ubicacion_cajon_herramientas") ===
                    undefined
                }
              />

              <InputWithIcon
                type="number"
                label="Cantidad de luces"
                {...register("carroceriaData.luces")}
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.luces?.message}
              />
              <Select
                label="Cintas reflectivas"
                {...register("carroceriaData.cintas_reflectivas")}
                error={errors.carroceriaData?.cintas_reflectivas?.message}
              >
                <option value="">Sin selección</option>
                {cintasOptions.map((cinta) => (
                  <option key={cinta.value} value={cinta.value}>
                    {cinta.label}
                  </option>
                ))}
              </Select>
              <ToggleCheckbox
                id="guardabarros"
                label="Guardabarros"
                checked={watch("carroceriaData.guardabarros")}
                onChange={(checked) =>
                  setValue("carroceriaData.guardabarros", checked)
                }
              />
              <ToggleCheckbox
                id="dep_agua"
                label="Depósito de agua"
                checked={watch("carroceriaData.dep_agua")}
                onChange={(checked) => {
                  setValue("carroceriaData.dep_agua", checked);
                  setValue(
                    "carroceriaData.ubicacion_dep_agua",
                    checked ? "" : "N/A",
                  );
                }}
              />
              <Select
                label="Ubic. depósito de agua"
                {...register("carroceriaData.ubicacion_dep_agua", {
                  required: {
                    value: watch("carroceriaData.dep_agua") === true,
                    message: "Este campo es obligatorio",
                  },
                })}
                error={errors.carroceriaData?.ubicacion_dep_agua?.message}
                disabled={!watch("carroceriaData.dep_agua")}
                requiredField={watch("carroceriaData.dep_agua")}
              >
                <option value="" disabled>
                  Sin selección
                </option>
                {ubicacionOptions.map((ubicacion) => (
                  <option key={ubicacion.value} value={ubicacion.value}>
                    {ubicacion.label}
                  </option>
                ))}
              </Select>
            </fieldset>
          </CardToggle>
          <CardToggle title="Alargues">
            <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <ToggleCheckbox
                id="alargue_tipo_1"
                label="Baranda a Cumbrera"
                checked={
                  watch("carroceriaData.alargue_tipo_1") !== "N/A" &&
                  watch("carroceriaData.alargue_tipo_1") !== ""
                }
                onChange={(checked) => handleToggleAlargue1(checked)}
              />
              <InputWithIcon
                disabled={
                  watch("carroceriaData.alargue_tipo_1") === "N/A" ||
                  watch("carroceriaData.alargue_tipo_1") === "" ||
                  undefined
                }
                type="number"
                label="Cantidad"
                {...register("carroceriaData.cant_alargue_1", {
                  min: {
                    value:
                      watch("carroceriaData.alargue_tipo_1") !== "N/A"
                        ? 0.1
                        : 0,
                    message: "La medida debe ser mayor a 0",
                  },
                  required:
                    watch("carroceriaData.alargue_tipo_1") !== "N/A"
                      ? "Este campo es obligatorio"
                      : false,
                })}
                requiredField={watch("carroceriaData.alargue_tipo_1") !== "N/A"}
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.cant_alargue_1?.message}
              />
              <InputWithIcon
                disabled={
                  watch("carroceriaData.alargue_tipo_1") === "N/A" ||
                  watch("carroceriaData.alargue_tipo_1") === ""
                }
                type="number"
                label="Medida"
                {...register("carroceriaData.med_alargue_1", {
                  min: {
                    value:
                      watch("carroceriaData.alargue_tipo_1") !== "N/A"
                        ? 0.1
                        : 0,
                    message: "La medida debe ser mayor a 0",
                  },
                  required:
                    watch("carroceriaData.alargue_tipo_1") !== "N/A"
                      ? "Este campo es obligatorio"
                      : false,
                })}
                requiredField={watch("carroceriaData.alargue_tipo_1") !== "N/A"}
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.med_alargue_1?.message}
              />
              <ToggleCheckbox
                id="quiebre_alargue_1"
                label="Quiebre en alargue"
                checked={watch("carroceriaData.quiebre_alargue_1")}
                onChange={(checked) =>
                  setValue("carroceriaData.quiebre_alargue_1", checked)
                }
              />
              {/* 2do alargue */}
              <ToggleCheckbox
                id="alargue_tipo_2"
                label="Sobre Cumbrera"
                checked={
                  (watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                    watch("carroceriaData.alargue_tipo_2") !== "") ||
                  undefined
                }
                onChange={(checked) => handleToggleAlargue2(checked)}
              />
              <InputWithIcon
                disabled={
                  watch("carroceriaData.alargue_tipo_2") === "N/A" ||
                  watch("carroceriaData.alargue_tipo_2") === "" ||
                  undefined
                }
                type="number"
                label="Cantidad"
                {...register("carroceriaData.cant_alargue_2", {
                  min: {
                    value:
                      watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                      watch("carroceriaData.alargue_tipo_2") !== ""
                        ? 0.1
                        : 0,
                    message: "La medida debe ser mayor a 0",
                  },
                  required:
                    watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                    watch("carroceriaData.alargue_tipo_2") !== ""
                      ? "Este campo es obligatorio"
                      : false,
                })}
                requiredField={
                  watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                  watch("carroceriaData.alargue_tipo_2") !== ""
                }
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.cant_alargue_2?.message}
              />
              <InputWithIcon
                disabled={
                  watch("carroceriaData.alargue_tipo_2") === "N/A" ||
                  watch("carroceriaData.alargue_tipo_2") === ""
                }
                type="number"
                label="Medida"
                {...register("carroceriaData.med_alargue_2", {
                  min: {
                    value:
                      watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                      watch("carroceriaData.alargue_tipo_2") !== ""
                        ? 0.1
                        : 0,
                    message: "La medida debe ser mayor a 0",
                  },
                  required:
                    watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                    watch("carroceriaData.alargue_tipo_2") !== ""
                      ? "Este campo es obligatorio"
                      : false,
                })}
                requiredField={
                  watch("carroceriaData.alargue_tipo_2") !== "N/A" &&
                  watch("carroceriaData.alargue_tipo_2") !== ""
                }
                icon={RulerDimensionLine}
                error={errors.carroceriaData?.med_alargue_2?.message}
              />
              <ToggleCheckbox
                id="quiebre_alargue_2"
                label="Quiebre en alargue"
                checked={watch("carroceriaData.quiebre_alargue_2")}
                onChange={(checked) =>
                  setValue("carroceriaData.quiebre_alargue_2", checked)
                }
              />
            </fieldset>
          </CardToggle>
          <CardToggle title="Datos del Camión">
            <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Patente"
                {...register("camionData.patente")}
                placeholder="Patente del camión"
              />
              <Input
                label="Nombre de contacto"
                {...register("camionData.contacto_nombre")}
                placeholder="Nombre de contacto"
              />
              <PhoneInput
                label="Contacto"
                value={watch("camionData.contacto_telefono") || ""}
                onChange={(value) =>
                  setValue("camionData.contacto_telefono", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                error={errors.camionData?.contacto_telefono?.message}
              />
            </fieldset>
          </CardToggle>
          <CardToggle title="Trabajos en chasis">
            <fieldset className="grid grid-cols-1 gap-4">
              <h2>Trabajos en chasis</h2>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <colgroup>
                    <col className="w-[30%]" />
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
                    {fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                      >
                        <th scope="row" className="py-4 ps-6 pe-2">
                          <Select
                            {...register(
                              `trabajoChasisData.${index}.tipo_trabajo_id` as const,
                            )}
                          >
                            <option value="">
                              Seleccionar tipo de trabajo
                            </option>
                            {configTrabajosChasis
                              ?.filter((item) => item.activo)
                              .map((trabajo: any) => (
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
                              `trabajoChasisData.${index}.descripcion` as const,
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
                onClick={() =>
                  append({
                    pedido_id: pedido.id,
                    tipo_trabajo_id: "",
                    descripcion: "",
                  } as TrabajoChasisBD)
                }
              >
                <div className="flex gap-2">
                  <PlusIcon className="size-5 mx-auto" />
                  Agregar trabajo
                </div>
              </Button>
            </div>
          </CardToggle>
          <FooterForm>
            <Button type="submit" variant="blue" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </FooterForm>
        </form>
      )}
    </>
  );
}
