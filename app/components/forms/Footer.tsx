
export const FooterForm = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full h-15 dark:bg-gray-800 dark:hover:bg-gray-800  bg-gray-200 hover:bg-gray-300">
      <div className="w-fit flex  items-center h-full ms-auto mr-5">
        {children}
      </div>
    </div>
  );
};
