import { Input, Textarea, Select, CuitInput, PhoneInput } from "../Inputs";
import { Button } from "../Buttons";
import { AddressFields } from "../AddressFields";
import { useClienteForm } from "~/hooks/useClienteForm";
import { CardToggle } from "../CardToggle";
import { useData } from "~/context/DataContext";
import { useUIModals } from "~/context/ModalsContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ClienteForm({ modal }: { modal?: boolean }) {
  const navigate = useNavigate();
  const { showConfirmation } = useUIModals();
  const { getVendedores, vendedores, deleteClienteById, cliente } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
    handleDireccionChange,
    initialAddress,
    setValue,
    watch,
    validateAddress,
  } = useClienteForm({ modal: modal });

  // Determinar si estamos en modo edición
  const isEditMode = Boolean(cliente);
  const existingCliente = cliente;

  const handleDeleteCliente = async () => {
    if (!existingCliente) return;

    showConfirmation(
      `¿Estás seguro de que deseas eliminar el cliente "${existingCliente.razon_social}"? Esta acción no se puede deshacer. Si el cliente tiene pedidos asociados, no podrá ser eliminado.`,
      async () => {
        try {
          setIsDeleting(true);
          await deleteClienteById(existingCliente.id);
          if (modal) {
            // Si estamos en modal, cerrar el modal
            // Necesitarás importar closeModal del useUIModals si existe
          } else {
            // Si no estamos en modal, navegar a la lista de clientes
            navigate("/clientes");
          }
        } catch (error) {
          console.error("Error eliminando cliente:", error);
        } finally {
          setIsDeleting(false);
        }
      },
      {
        title: "Eliminar Cliente",
        confirmText: "Eliminar",
        cancelText: "Cancelar",
      }
    );
  };
  useEffect(() => {
    const loadVendedores = async () => {
      await getVendedores();
    };
    loadVendedores();
  }, []);
  // Registrar el campo CUIT para validaciones de react-hook-form
  const cuitRegister = register("cuit_cuil", {
    required: "El CUIT/CUIL es obligatorio",
  });
  // Obtener errores de validación de dirección en tiempo real
  const addressErrors = validateAddress();
  return (
    <>
      {vendedores && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardToggle title="Información del Cliente">
            <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Razón Social"
                  {...register("razon_social", {
                    required: "La razón social es obligatoria",
                  })}
                  error={errors.razon_social?.message}
                  requiredField={true}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Input
                  label="Nombre de Contacto"
                  {...register("nombre_contacto")}
                  error={errors.nombre_contacto?.message}
                />
              </div>

              <PhoneInput
                label="Teléfono"
                value={watch("telefono") || ""}
                onChange={(value) =>
                  setValue("telefono", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                error={errors.telefono?.message}
              />

              <Input
                label="Email"
                type="email"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "El email no es válido",
                  },
                })}
                error={errors.email?.message}
              />

              <CuitInput
                label="CUIT/CUIL"
                value={watch("cuit_cuil") || ""}
                onChange={(value) => {
                  setValue("cuit_cuil", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  // Disparar también el onChange de react-hook-form
                  cuitRegister.onChange({
                    target: { name: "cuit_cuil", value },
                  } as any);
                }}
                error={errors.cuit_cuil?.message}
                requiredField={true}
              />
            </fieldset>
          </CardToggle>
          <CardToggle title="Información de Dirección">
            <fieldset>
              <AddressFields
                provinciaId={initialAddress.provinciaId}
                localidadId={initialAddress.localidadId}
                direccion={initialAddress.direccion}
                provinciaNombre={initialAddress.provinciaNombre}
                localidadNombre={initialAddress.localidadNombre}
                onChange={handleDireccionChange}
                errors={{
                  provincia:
                    errors.provincia_nombre?.message || addressErrors.provincia,
                  localidad:
                    errors.localidad_nombre?.message || addressErrors.localidad,
                  direccion:
                    errors.direccion?.message || addressErrors.direccion,
                }}
                required={true}
              />
            </fieldset>
          </CardToggle>
          <CardToggle title="Otros Datos">
            <fieldset className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Condición frente al IVA"
                {...register("condicion_iva")}
                error={errors.condicion_iva?.message}
              >
                <option value="">Seleccione una condición</option>
                <option value="Responsable Inscripto">
                  Responsable Inscripto
                </option>
                <option value="Monotributista">Monotributista</option>
                <option value="Exento">Exento</option>
                <option value="Consumidor Final">Consumidor Final</option>
              </Select>
              <Select
                label="Vendedor Asignado"
                {...register("vendedor_id")}
                error={errors.vendedor_id?.message}
              >
                <option value="">Seleccione un vendedor</option>
                {vendedores?.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {`${vendedor.nombre} ${vendedor.apellido}`}
                  </option>
                ))}
              </Select>

              <Select label="Activo" {...register("activo")}>
                <option value="">Seleccione una opción</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </Select>
              <div className="md:col-span-2 lg:col-span-3">
                <Textarea
                  label="Observaciones"
                  {...register("observaciones")}
                  error={errors.observaciones?.message}
                />
              </div>
            </fieldset>
          </CardToggle>

          {/* Zona de Peligro - Solo mostrar en modo edición */}
          {isEditMode && existingCliente && (
            <CardToggle title="Zona de Peligro">
              <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Eliminar Cliente
                  </h4>
                </div>
                <p className="text-sm text-red-600 dark:text-red-300 mb-4 leading-relaxed">
                  Una vez eliminado, este cliente y todos sus datos se perderán
                  permanentemente. Si el cliente tiene pedidos asociados, no
                  podrá ser eliminado hasta que se eliminen primero los pedidos.
                </p>
                <div className="w-fit">
                  <Button
                    type="button"
                    variant="red"
                    size="sm"
                    onClick={handleDeleteCliente}
                    disabled={isDeleting}
                    className="text-sm"
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar Cliente"}
                  </Button>
                </div>
              </div>
            </CardToggle>
          )}

          <div className="w-fit pt-4">
            <Button type="submit" variant="blue" disabled={isLoading}>
              {isLoading ? "Guardando..." : submitButtonText}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
