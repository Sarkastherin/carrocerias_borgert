import { Z_INDEX, getZIndexClass } from "~/config/zIndexConfig";

export const FooterForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`fixed w-full right-0 left-0 bottom-0 h-15 dark:bg-gray-800 dark:hover:bg-gray-800 bg-gray-200 hover:bg-gray-300 ${getZIndexClass(Z_INDEX.FOOTER)}`} 
        >
      <div className="w-fit flex items-center h-full ms-auto mr-5">
        {children}
      </div>
    </div>
  );
};
