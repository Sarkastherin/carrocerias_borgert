import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { BookUser, DollarSign } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import type {
  CtasCtesDB,
  ChequesDB,
  CtaCteConCliente,
} from "~/types/ctas_corrientes";
import type { AddChequeFormProps } from "~/components/forms/AddChequeForm";
import ClienteField from "~/components/ClienteField";
import { useUIModals } from "~/context/ModalsContext";
import type { ClientesBD } from "~/types/clientes";
import ClienteNuevoModal from "~/components/modals/customs/ClienteNuevoModal";
import { UserRoundPlus } from "lucide-react";
import { CurrencyInput, Input, Select } from "~/components/Inputs";
import {
  optionsTypeMov,
  optionsOrigen,
  optionsMedioPago,
} from "~/types/ctas_corrientes";
import ButtonsActionsCtaCte from "~/components/ButtonsActionsCtaCte";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo movimiento" },
    {
      name: "description",
      content: "Craer nuevo movimiento",
    },
  ];
}
type MovimientoFormProps = CtaCteConCliente & {
  cheques: ChequesDB[];
};
export default function NuevoMovimiento() {
  const { openModal, closeModal } = useUIModals();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MovimientoFormProps>({
    defaultValues: {
      cliente_id: "",
      fecha_movimiento: new Date().toISOString().split("T")[0],
      tipo_movimiento: "",
      origen: "",
      debe: 0,
      haber: 0,
      medio_pago: "",
      cheques: [
        {
          numero: "",
          importe: 0,
          banco: "",
          fecha_cobro: "",
          fecha_ingreso: "",
          observacion: "",
        } as ChequesDB,
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "cheques",
  });
  const onSubmit = (data: MovimientoFormProps) => {
    console.log(data);
  };
  return (
    <div className="flex flex-col items-center w-full px-6">
      <Subheader
        title="Agregar Movimiento"
        icon={{
          component: BookUser,
          color: "text-yellow-600 dark:text-yellow-400",
        }}
        back_path="/administracion/cuentas-corrientes"
      />
      <main className="w-full max-w-7xl p-6">
        <ClienteField
          value={watch("razon_social")}
          required={true}
          setValue={setValue}
          errors={errors}
          register={register}
        />
        <div className="mt-6">
          {watch("cliente_id") ? (
            <ButtonsActionsCtaCte clienteId={watch("cliente_id")} redirect={true} />
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona un cliente para registrar movimientos
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
