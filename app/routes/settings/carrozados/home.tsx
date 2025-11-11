import type { Route } from "../../+types/home";
import { use, useEffect, useMemo, useState } from "react";
import { NavGlassCard, ConfigGlassCard } from "~/components/GlassCard";
import LoadingComponent from "~/components/LoadingComponent";
import { Subheader } from "~/components/Headers";
import { Truck, Wrench } from "lucide-react";
import { useData } from "~/context/DataContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Parámetros Avanzados" },
    { name: "description", content: "Parámetros Avanzados" },
  ];
}

export default function AdvanceLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const { carrozados, getCarrozados } = useData();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getCarrozados();
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 67px)" }}>
      {!isLoading ? (
        <div className="w-full px-8">
          <Subheader
            title="Configuraciones Avanzadas"
            icon={{ component: Wrench, color: "white" }}
          />
          <div className="grid grid-cols-5 mx-auto gap-6 p-6 w-full">
            {carrozados?.map((carrozado) => (
              <ConfigGlassCard
                key={carrozado.id}
                name={carrozado.nombre}
                path={`parametros/${carrozado.id}`}
                icon={Truck}
                imageUrl={carrozado.imagen || undefined}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <LoadingComponent content="Cargando configuraciones de carrozados..." />
        </div>
      )}
    </div>
  );
}
