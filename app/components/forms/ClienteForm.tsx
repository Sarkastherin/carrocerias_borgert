import { Input, Textarea, Select } from "../Inputs";
import { Button } from "../Buttons";
import { AddressFields } from "../AddressFields";
import { useClienteForm } from "~/hooks/useClienteForm";
import { CardToggle } from "../CardToggle";

export default function ClienteForm({modal}: {modal?: boolean}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    isLoading,
    submitButtonText,
    handleDireccionChange,
    initialAddress,
  } = useClienteForm({modal: modal});
  return (
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

          <Input
            label="Teléfono"
            {...register("telefono")}
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

          <Input
            label="CUIT/CUIL"
            {...register("cuit_cuil", {required: "El CUIT/CUIL es obligatorio"})}
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
              provincia: errors.provincia_nombre?.message,
              localidad: errors.localidad_nombre?.message,
              direccion: errors.direccion?.message,
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
            <option value="Responsable Inscripto">Responsable Inscripto</option>
            <option value="Monotributista">Monotributista</option>
            <option value="Exento">Exento</option>
            <option value="Consumidor Final">Consumidor Final</option>
          </Select>
          <Select
            label="Vendedor Asignado"
            {...register("vendedor_asignado")}
            error={errors.vendedor_asignado?.message}
          >
            <option value="">Seleccione un vendedor</option>
            <option value="Vendedor 1">Vendedor 1</option>
            <option value="Vendedor 2">Vendedor 2</option>
            <option value="Vendedor 3">Vendedor 3</option>
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

      <div className="w-fit pt-4">
        <Button type="submit" variant="blue" disabled={isLoading}>
          {isLoading ? "Guardando..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
