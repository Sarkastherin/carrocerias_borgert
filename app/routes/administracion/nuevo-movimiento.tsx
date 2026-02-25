import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { BookUser } from "lucide-react";
import { set, useForm } from "react-hook-form";
import type { MvtosDB, ChequesDB, CtaCte } from "~/types/ctas_corrientes";
import ClienteField from "~/components/ClienteField";
import { useUIModals } from "~/context/ModalsContext";
import type { ClientesBD } from "~/types/clientes";
import ButtonsActionsCtaCte from "~/components/ButtonsActionsCtaCte";
import { useEffect, useState } from "react";
import { useData } from "~/context/DataContext";
import { useNavigate } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo movimiento" },
    {
      name: "description",
      content: "Craer nuevo movimiento",
    },
  ];
}
type MovimientoFormProps = MvtosDB & {
  cheques: ChequesDB[];
  cliente: ClientesBD;
};
export default function NuevoMovimiento() {
  const { ctasCtes, getCtasCtes } = useData();
  const [ctaCte, setCtaCte] = useState<CtaCte | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovimientoFormProps>({
    defaultValues: {
      fecha_movimiento: new Date().toISOString().split("T")[0],
      tipo_movimiento: "",
      origen: "",
      debe: 0,
      haber: 0,
      medio_pago: "",
      cheques: [],
    },
  });
  useEffect(() => {
    if (!ctasCtes) return;
    if (!watch("cliente_id")) return;
    const ctaCte = ctasCtes.find((c) => c.id === watch("cliente_id"));
    console.log("Cuenta corriente encontrada:", ctaCte);
    if (!ctaCte) {
      setIsNew(true);
    } else {
      setCtaCte(ctaCte);
      navigate(`/administracion/cuentas-corrientes/${watch("cliente_id")}`);
      setIsNew(false);
    }
  }, [watch("cliente_id")]);
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
          value={watch("cliente.razon_social")}
          required={true}
          setValue={setValue}
          errors={errors}
          register={register}
        />
        <div className="mt-6">
          {isNew ? (
            <ButtonsActionsCtaCte
              clienteId={watch("cliente_id")}
              redirect={true}
              ctaCte={ctaCte}
            />
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
