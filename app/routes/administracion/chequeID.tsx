import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { Banknote } from "lucide-react";
import { useLocation } from "react-router";
import { useParams } from "react-router";
import ChequeForm from "~/components/forms/ChequeForm";
import { useData } from "~/context/DataContext";
import { useEffect, useState } from "react";
import type { ChequesWithTerceros } from "~/types/ctas_corrientes";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cheque" },
    { name: "description", content: "Edita los detalles del cheque" },
  ];
}
export default function ChequeID() {
  const location = useLocation();
  const params = useParams();
  const chequeData = location.state?.cheque;
  const { chequesWithClients, getChequesWithTerceros } = useData();
  const [dataCheque, setDataCheque] = useState<ChequesWithTerceros | null>(
    chequeData || null,
  );
  useEffect(() => {
    if (!chequeData) {
      if (!chequesWithClients) getChequesWithTerceros();
    }
  }, [chequeData]);
  useEffect(() => {
    const id = params.chequeId;
    const foundCheque = chequesWithClients?.find((c) => c.id === id);
    if (foundCheque) {
      setDataCheque(foundCheque);
    }
  }, [chequesWithClients]);
  {
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
