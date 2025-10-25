import { createContext, useContext, useState } from "react";
import {
  clientesAPI,
  pedidosAPI,
  fabricacionAPI,
  trabajoChasisAPI,
  camionAPI,
  coloresAPI,
  carrozadoAPI,
  zocaloAPI,
  puertasTraserasAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type { PedidosBD, PedidosTable, PedidosUI } from "~/types/pedidos";
import type {
  ColoresBD,
  CarrozadosBD,
  ZocalosBD,
  PuertasTraserasBD,
} from "~/types/settings";

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
  pedido: PedidosUI | null;
  setPedido: React.Dispatch<React.SetStateAction<PedidosUI | null>>;
  getPedidoById: (id: string) => Promise<void>;
  colores: ColoresBD[] | null;
  getColores: () => Promise<ColoresBD[]>;
  carrozados: CarrozadosBD[] | null;
  getCarrozados: () => Promise<CarrozadosBD[]>;
  zocalos: ZocalosBD[] | null;
  getZocalos: () => Promise<ZocalosBD[]>;
  puertasTraseras: PuertasTraserasBD[] | null;
  getPuertasTraseras: () => Promise<PuertasTraserasBD[]>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const [pedidos, setPedidos] = useState<PedidosTable[] | null>(null);
  const [pedido, setPedido] = useState<PedidosUI | null>(null);
  const [colores, setColores] = useState<ColoresBD[] | null>(null);
  const [carrozados, setCarrozados] = useState<CarrozadosBD[] | null>(null);
  const [zocalos, setZocalos] = useState<ZocalosBD[] | null>(null);
  const [puertasTraseras, setPuertasTraseras] = useState<
    PuertasTraserasBD[] | null
  >(null);
  const getClientes = async () => {
    const response = await clientesAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setClientes((response.data as ClientesBD[]) || []);
    return response.data as ClientesBD[];
  };
  const getClienteById = async (id: string) => {
    const response = await clientesAPI.read({
      columnName: "id",
      value: id,
      multiple: false,
    });
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
      return {
        ...pedido,
        cliente_nombre: cliente
          ? cliente.razon_social
          : "Cliente no encontrado",
      };
    });
    setPedidos(pedidosConCliente);
  };
  const getPedidoById = async (id: string) => {
    const response = await pedidosAPI.read({
      columnName: "id",
      value: id,
      multiple: false,
    });
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      throw new Error(formattedError);
    }
    if (!response.data) {
      setCliente(null);
      return;
    }
    const idPedido = (response.data as PedidosBD).id;
    const responseFabricacion = await fabricacionAPI.read({
      columnName: "pedido_id",
      value: idPedido,
      multiple: false,
    });
    if (!responseFabricacion.success && responseFabricacion.status !== 404) {
      logDetailedError(responseFabricacion.error);
      const formattedError = getFormattedError(responseFabricacion.error);
      throw new Error(formattedError);
    }
    const responseTrabajoChasis = await trabajoChasisAPI.read({
      columnName: "pedido_id",
      value: idPedido,
      multiple: true,
    });
    if (
      !responseTrabajoChasis.success &&
      responseTrabajoChasis.status !== 404
    ) {
      logDetailedError(responseTrabajoChasis.error);
      const formattedError = getFormattedError(responseTrabajoChasis.error);
      throw new Error(formattedError);
    }
    const responseCamion = await camionAPI.read({
      columnName: "pedido_id",
      value: idPedido,
      multiple: false,
    });
    if (!responseCamion.success && responseCamion.status !== 404) {
      logDetailedError(responseCamion.error);
      const formattedError = getFormattedError(responseCamion.error);
      throw new Error(formattedError);
    }
    const pedidoConFabricacion = {
      ...(response.data as PedidosBD),
      fabricacion: responseFabricacion.data || null,
      trabajo_chasis: responseTrabajoChasis.data || null,
      camion: responseCamion.data || null,
    };
    setPedido(pedidoConFabricacion as PedidosUI);
  };
  const getColores = async () => {
    const response = await coloresAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setColores((response.data as ColoresBD[]) || []);
    return response.data as ColoresBD[];
  };

  const getCarrozados = async () => {
    const response = await carrozadoAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setCarrozados((response.data as CarrozadosBD[]) || []);
    return response.data as CarrozadosBD[];
  };

  const getZocalos = async () => {
    const response = await zocaloAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setZocalos((response.data as ZocalosBD[]) || []);
    return response.data as ZocalosBD[];
  };

  const getPuertasTraseras = async () => {
    const response = await puertasTraserasAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setPuertasTraseras((response.data as PuertasTraserasBD[]) || []);
    return response.data as PuertasTraserasBD[];
  };

  return (
    <DataContext.Provider
      value={{
        clientes,
        setClientes,
        getClientes,
        cliente,
        getClienteById,
        setCliente,
        pedidos,
        setPedidos,
        getPedidos,
        pedido,
        setPedido,
        getPedidoById,
        getColores,
        colores,
        getCarrozados,
        carrozados,
        getZocalos,
        zocalos,
        getPuertasTraseras,
        puertasTraseras,
      }}
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
