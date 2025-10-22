import { createContext, useContext, useState } from "react";
import { clientesAPI, pedidosAPI } from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes"
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type { PedidosBD, PedidosTable } from "~/types/pedidos";

type DataContextType = {
  clientes: ClientesBD[] | null;
  setClientes: React.Dispatch<React.SetStateAction<ClientesBD[] | null>>;
  getClientes: () => Promise<ClientesBD[]>;
  cliente: ClientesBD | null;
  setCliente: React.Dispatch<React.SetStateAction<ClientesBD | null>>;
  getClienteById: (id: string) => Promise<void>;
  pedidos: PedidosTable[] | null;
  setPedidos: React.Dispatch<React.SetStateAction<PedidosTable[] | null>>;
  getPedidos: () => Promise<void>;
  pedido: PedidosBD | null;
  setPedido: React.Dispatch<React.SetStateAction<PedidosBD | null>>;
  getPedidoById: (id: string) => Promise<void>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const [pedidos, setPedidos] = useState<PedidosTable[] | null>(null);
  const [pedido, setPedido] = useState<PedidosBD | null>(null);
  const getClientes = async () => {
    const response = await clientesAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setClientes(response.data as ClientesBD[] || []);
    return response.data as ClientesBD[];
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
  const getPedidos = async () => {
    const resPedidos = await pedidosAPI.read();
    if (!resPedidos.success) {
      logDetailedError(resPedidos.error);
      const formattedError = getFormattedError(resPedidos.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    const resClientes = await getClientes();
    const pedidosConCliente = (resPedidos.data as PedidosBD[]).map((pedido) => {
      const cliente = resClientes.find((c) => c.id === pedido.cliente_id);
      return {...pedido, cliente_nombre: cliente ? cliente.razon_social : "Cliente no encontrado"};
    })
    setPedidos(pedidosConCliente);
  };
  const getPedidoById = async (id: string) => {
    const response = await pedidosAPI.read({ columnName: "id", value: id, multiple: false });
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      throw new Error(formattedError);
    }
    if (!response.data) {
      setCliente(null);
      return;
    }
    setPedido(response.data as PedidosBD);
  };
  return (
    <DataContext.Provider
      value={{ clientes, setClientes, getClientes, cliente, getClienteById, setCliente, pedidos, setPedidos, getPedidos, pedido, setPedido, getPedidoById }}
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
