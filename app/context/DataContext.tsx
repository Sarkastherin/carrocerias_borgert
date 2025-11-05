import { createContext, useContext, useState, useMemo } from "react";
import {
  clientesAPI,
  pedidosAPI,
  carroceriaAPI,
  trabajoChasisAPI,
  camionAPI,
  coloresAPI,
  carrozadoAPI,
  puertasTraserasAPI,
  vendedoresAPI,
  configTrabajoChasisAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type { PedidosBD, PedidosTable, PedidosUI } from "~/types/pedidos";
import type {
  ColoresBD,
  CarrozadosBD,
  PuertasTraserasBD,
  VendedoresBD,
  ConfigTrabajosChasisBD,
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
  puertasTraseras: PuertasTraserasBD[] | null;
  getPuertasTraseras: () => Promise<PuertasTraserasBD[]>;
  vendedores: VendedoresBD[] | null;
  getVendedores: () => Promise<VendedoresBD[]>;
  configTrabajosChasis: ConfigTrabajosChasisBD[] | null;
  getConfigTrabajosChasis: () => Promise<ConfigTrabajosChasisBD[]>;
  deletePedidoById: (id: string) => Promise<void>;
  deleteClienteById: (id: string) => Promise<void>;
  checkCuitExists: (cuit: string, excludeId?: string) => Promise<boolean>;
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
  const [puertasTraseras, setPuertasTraseras] = useState<
    PuertasTraserasBD[] | null
  >(null);
  const [vendedores, setVendedores] = useState<VendedoresBD[] | null>(null);
  const [configTrabajosChasis, setConfigTrabajosChasis] = useState<
    ConfigTrabajosChasisBD[] | null
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
    const resVendedores = await getVendedores();
    const pedidosConCliente = (resPedidos.data as PedidosBD[]).map((pedido) => {
      const cliente = resClientes.find((c) => c.id === pedido.cliente_id);
      const vendedor = resVendedores.find((v) => v.id === pedido.vendedor_id);
      return {
        ...pedido,
        cliente_nombre: cliente
          ? cliente.razon_social
          : "Cliente no encontrado",
        vendedor_nombre: vendedor
          ? `${vendedor.nombre} ${vendedor.apellido}`
          : "Vendedor no encontrado",
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
    const responseCarroceria = await carroceriaAPI.read({
      columnName: "pedido_id",
      value: idPedido,
      multiple: false,
    });
    if (!responseCarroceria.success && responseCarroceria.status !== 404) {
      logDetailedError(responseCarroceria.error);
      const formattedError = getFormattedError(responseCarroceria.error);
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
    const pedidoConCarroceria = {
      ...(response.data as PedidosBD),
      carroceria: responseCarroceria.data || null,
      trabajo_chasis: responseTrabajoChasis.data || null,
      camion: responseCamion.data || null,
    };
    setPedido(pedidoConCarroceria as PedidosUI);
  };
  const deletePedidoById = async (id: string) => {
    try {
      // Eliminar todos los registros relacionados primero
      
      // 1. Eliminar trabajos en chasis asociados al pedido
      const responseTrabajos = await trabajoChasisAPI.read({
        columnName: "pedido_id",
        value: id,
        multiple: true,
      });
      
      if (responseTrabajos.success && responseTrabajos.data) {
        const trabajos = Array.isArray(responseTrabajos.data) 
          ? responseTrabajos.data 
          : [responseTrabajos.data];
        
        for (const trabajo of trabajos) {
          await trabajoChasisAPI.delete(trabajo.id);
        }
      }

      // 2. Eliminar camión asociado al pedido
      const responseCamion = await camionAPI.read({
        columnName: "pedido_id",
        value: id,
        multiple: false,
      });
      
      if (responseCamion.success && responseCamion.data) {
        const camion = Array.isArray(responseCamion.data) 
          ? responseCamion.data[0] 
          : responseCamion.data;
        if (camion) {
          await camionAPI.delete(camion.id);
        }
      }

      // 3. Eliminar carrocería asociada al pedido
      const responseCarroceria = await carroceriaAPI.read({
        columnName: "pedido_id",
        value: id,
        multiple: false,
      });
      
      if (responseCarroceria.success && responseCarroceria.data) {
        const carroceria = Array.isArray(responseCarroceria.data) 
          ? responseCarroceria.data[0] 
          : responseCarroceria.data;
        if (carroceria) {
          await carroceriaAPI.delete(carroceria.id);
        }
      }

      // 4. Finalmente, eliminar el pedido principal
      const deletePedidoResponse = await pedidosAPI.delete(id);
      
      if (!deletePedidoResponse.success) {
        logDetailedError(deletePedidoResponse.error);
        const formattedError = getFormattedError(deletePedidoResponse.error);
        showError(formattedError);
        throw new Error(formattedError);
      }

      // Actualizar el estado local
      setPedido(null);
      
      // Opcionalmente, actualizar la lista de pedidos
      if (pedidos) {
        setPedidos(pedidos.filter(p => p.id !== id));
      }
      
    } catch (error) {
      logDetailedError(error);
      const formattedError = getFormattedError(error);
      showError(formattedError);
      throw error;
    }
  };
  const deleteClienteById = async (id: string) => {
    try {
      // 1. Verificar si el cliente tiene pedidos asociados
      const responsePedidos = await pedidosAPI.read({
        columnName: "cliente_id",
        value: id,
        multiple: true,
      });

      // Si la consulta fue exitosa y hay datos, significa que tiene pedidos asociados
      if (responsePedidos.success && responsePedidos.data) {
        const pedidosAsociados = Array.isArray(responsePedidos.data) 
          ? responsePedidos.data 
          : [responsePedidos.data];
        
        if (pedidosAsociados.length > 0) {
          // Cliente tiene pedidos asociados, mostrar error
          const errorMessage = `No se puede eliminar el cliente porque tiene ${pedidosAsociados.length} pedido(s) asociado(s). Elimine primero los pedidos relacionados.`;
          showError(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // 2. Si no tiene pedidos asociados, proceder a eliminar el cliente
      const deleteClienteResponse = await clientesAPI.delete(id);
      
      if (!deleteClienteResponse.success) {
        logDetailedError(deleteClienteResponse.error);
        const formattedError = getFormattedError(deleteClienteResponse.error);
        showError(formattedError);
        throw new Error(formattedError);
      }

      // 3. Actualizar el estado local
      setCliente(null);
      
      // Actualizar la lista de clientes
      if (clientes) {
        setClientes(clientes.filter(c => c.id !== id));
      }
      
    } catch (error) {
      logDetailedError(error);
      // Si el error ya fue formateado arriba, no lo formatees de nuevo
      if (error instanceof Error && error.message.includes('pedido(s) asociado(s)')) {
        throw error;
      }
      const formattedError = getFormattedError(error);
      showError(formattedError);
      throw error;
    }
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
  const getVendedores = async () => {
    const response = await vendedoresAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setVendedores((response.data as VendedoresBD[]) || []);
    return response.data as VendedoresBD[];
  };
  const getConfigTrabajosChasis = async () => {
    const response = await configTrabajoChasisAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setConfigTrabajosChasis((response.data as ConfigTrabajosChasisBD[]) || []);
    return response.data as ConfigTrabajosChasisBD[];
  };

  const checkCuitExists = async (cuit: string, excludeId?: string): Promise<boolean> => {
    try {
      // Buscar clientes con el CUIT especificado
      const response = await clientesAPI.read({
        columnName: "cuit_cuil",
        value: cuit,
        operator: "=",
        multiple: true
      });

      if (!response.success) {
        // En caso de error, asumir que no existe (es más seguro)
        return false;
      }

      const clientesConCuit = response.data as ClientesBD[];
      
      // Si no se encontraron clientes con ese CUIT, no existe duplicado
      if (!clientesConCuit || clientesConCuit.length === 0) {
        return false;
      }

      // Si se proporciona excludeId (caso de edición), filtrar ese cliente
      if (excludeId) {
        const otrosClientes = clientesConCuit.filter(cliente => cliente.id !== excludeId);
        return otrosClientes.length > 0;
      }

      // Si es creación (sin excludeId), cualquier cliente encontrado es duplicado
      return clientesConCuit.length > 0;
    } catch (error) {
      // En caso de error, asumir que no existe (es más seguro)
      console.error('Error checking CUIT existence:', error);
      return false;
    }
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
        getPuertasTraseras,
        puertasTraseras,
        getVendedores,
        vendedores,
        getConfigTrabajosChasis,
        configTrabajosChasis,
        deletePedidoById,
        deleteClienteById,
        checkCuitExists,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (onlyActive: boolean = false) => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  
  // Aplicar filtros usando useMemo para optimizar performance
  const filteredData = useMemo(() => {
    if (!onlyActive) {
      return context;
    }

    return {
      ...context,
      clientes: context.clientes?.filter(c => c.activo) || null,
      colores: context.colores?.filter(c => c.activo) || null,
      carrozados: context.carrozados?.filter(c => c.activo) || null,
      puertasTraseras: context.puertasTraseras?.filter(p => p.activo) || null,
      vendedores: context.vendedores?.filter(v => v.activo) || null,
      configTrabajosChasis: context.configTrabajosChasis?.filter(t => t.activo) || null,
    };
  }, [context, onlyActive]);

  return filteredData;
};
