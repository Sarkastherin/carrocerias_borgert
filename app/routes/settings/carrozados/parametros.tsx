import type { Route } from "../+types/home";
import { Subheader } from "~/components/Headers";
import { PencilRuler, FileCode } from "lucide-react";
import { useState } from "react";
import { capitalize } from "~/config/settingsConfig";
import { getIcon } from "~/components/IconComponent";
import { EntityTable } from "~/components/EntityTable";
import { useData } from "~/context/DataContext";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Default Values" },
    {
      name: "description",
      content: "Default values specific to each carrozado",
    },
  ];
}
type MenuOpenProps = {
  title: string;
  icon: React.ReactNode;
};
export default function CarrozadoSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("valores predeterminados");
  const { controlCarrozado, getControles } = useData();
  const MenuOpen = ({ title, icon }: MenuOpenProps) => {
    return (
      <button
        key={title}
        type="button"
        onClick={() => setActiveTab(title)}
        className={`block rounded-lg px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-[var(--color-primary-muted)] dark:hover:bg-slate-800 hover:text-primary-light ${activeTab === title ? "bg-[var(--color-primary-muted)] dark:bg-slate-800 text-primary-light" : ""}`}
      >
        <div className="flex items-center gap-2">
          {icon}
          {capitalize(title)}
        </div>
      </button>
    );
  };
  const itemsConfiguraciones = [
    { title: "valores predeterminados", icon: FileCode, columns: [], data: [] },
    { title: "control de carrozado", icon: PencilRuler, columns: [], data: [] },
  ];
  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 67px)" }}>
      <div className="flex flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/20">
        <div className="px-4">
          <ul className="mt-6 space-y-1">
            {itemsConfiguraciones.map((item) => {
              const IconComponent = getIcon({
                icon: item.icon,
                size: 4,
                color: "text-slate-600 dark:text-slate-400",
              });
              return (
                <li key={item.title}>
                  <MenuOpen title={item.title} icon={IconComponent} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex-1 py-10 mx-auto px-10">
        {itemsConfiguraciones.length > 0 &&
          itemsConfiguraciones.map((item) => {
            const IconComponent = getIcon({
              icon: item.icon,
              size: 5,
              color: "text-slate-600 dark:text-slate-400",
            });
            return (
              activeTab === item.title && (
                <div key={item.title}>
                  <div className="pb-4 flex items-center">
                    <span className="scale-125 flex items-center gap-2 font-semibold text-text-primary dark:text-white">
                      {IconComponent}
                      <h2>{capitalize(item.title)}</h2>
                    </span>
                  </div>
                  <EntityTable
                  key={item.title}
                  alternativeStorageKey={`entityTableFilters_settings_${item.title}`}
                  columns={[...item.columns]}
                  data={item.data}
                  />
                </div>
              )
            );
          })}
      </div>
    </div>
  );
}
