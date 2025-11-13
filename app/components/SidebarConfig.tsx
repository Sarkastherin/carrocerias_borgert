import { capitalize } from "~/config/settingsConfig";
type MenuOpenProps = {
  title: string;
  icon: React.ReactNode;
};
export default function SidebarConfig({
  itemsConfiguraciones,
  activeTab,
  setActiveTab,
}: {
  itemsConfiguraciones: any[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
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
  return (
    <div className="flex flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/20">
      <div className="px-4">
        <ul className="mt-6 space-y-1">
          {itemsConfiguraciones.map((item) => (
            <li key={item.title}>
              <MenuOpen title={item.title} icon={item.icon} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
