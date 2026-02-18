import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Banknote } from "lucide-react";
import { useParams } from "react-router";
import ChequeForm from "~/components/forms/ChequeForm";
import { useData } from "~/context/DataContext";
import { useEffect, useState } from "react";
import type { ChequesEnrichWithCtaCte } from "~/types/ctas_corrientes";
import LoadingComponent from "~/components/LoadingComponent";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cheque" },
    { name: "description", content: "Edita los detalles del cheque" },
  ];
}
export default function ChequeID() {
  const { chequeId } = useParams();
  const { ctasCtes, getCtasCtes } = useData();
  useEffect(() => {
    if (!ctasCtes) getCtasCtes();
  }, []);
  useEffect(() => {
    if (!ctasCtes) return;
    const allCheques: ChequesEnrichWithCtaCte[] = ctasCtes.flatMap((cta) =>
      cta.movimientos.flatMap((mvto) =>
        mvto.cheques
          ? mvto.cheques.map((cheque) => ({ ...cheque, ctaCte: cta }))
          : [],
      ),
    );
    const foundCheque = allCheques.find((c) => c.id === chequeId);
    if (foundCheque) {
      setDataCheque(foundCheque);
    }
  }, []);
  const [dataCheque, setDataCheque] = useState<ChequesEnrichWithCtaCte | null>(
    null,
  );
   if (!dataCheque) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingComponent content="Cargando clientes..." />
          </div>
        </div>
      );
    }
  return (
    <div className="flex flex-col items-center w-full px-6">
      <Subheader
        title="Gestión de Cheque"
        icon={{
          component: Banknote,
          color: "text-green-600 dark:text-green-400",
        }}
        back_path="/administracion/cheques"
      />
      <main className="w-full max-w-5xl p-6">
        {dataCheque && <ChequeForm data={dataCheque} />}
      </main>
    </div>
  );
}
