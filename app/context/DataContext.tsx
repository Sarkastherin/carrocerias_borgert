import { createContext, useContext, useState } from "react";
import { clientesAPI } from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes"
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";

type DataContextType = {
  clientes: ClientesBD[] | null;
  setClientes: React.Dispatch<React.SetStateAction<ClientesBD[] | null>>;
  getClientes: () => Promise<void>;
  cliente: ClientesBD | null;
  setCliente: React.Dispatch<React.SetStateAction<ClientesBD | null>>;
  getClienteById: (id: string) => Promise<void>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const getClientes = async () => {
    const response = await clientesAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setClientes(response.data as ClientesBD[] || []);
  };
  const getClienteById = async (id: string) => {
    const response = await clientesAPI.read({ columnName: "id", value: id, multiple: false });
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      throw new Error(formattedError);
    }
    if (!response.data) {
      setCliente(null);
      return;
    }
    setCliente(response.data as ClientesBD);
  };
  return (
    <DataContext.Provider
      value={{ clientes, setClientes, getClientes, cliente, getClienteById, setCliente }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
