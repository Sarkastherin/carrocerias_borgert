import { createContext, useContext, useState, useMemo } from "react";
import {
  clientesAPI,
  pedidosAPI,
  personalAPI,
  chequesAPI,
  proveedoresAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type {
  PersonalBD,
} from "~/types/settings";
import type { CRUDMethods } from "~/backend/crudFactory";
import type { ProveedoresBD } from "~/types/proveedores";
type DataContextType = {
  /* CLIENTES */
  clientes: ClientesBD[] | null;
  getClientes: () => Promise<ClientesBD[]>;
  cliente: ClientesBD | null;
  setCliente: React.Dispatch<React.SetStateAction<ClientesBD | null>>;
  deleteClienteById: (id: string) => Promise<void>;
  /* PROVEEDORES */
  proveedores: ProveedoresBD[] | null;
  getProveedores: () => Promise<ProveedoresBD[]>;
  proveedor: ProveedoresBD | null;
  setProveedor: React.Dispatch<React.SetStateAction<ProveedoresBD | null>>;
  deleteProveedorById: (id: string) => Promise<void>;
  /* PERSONAL */
  personal: PersonalBD[] | null;
  getPersonal: () => Promise<PersonalBD[]>;
  /* UTILS */
  checkCuitExists: (
    cuit: string,
    excludeId?: string,
    table?: "clientes" | "proveedores",
  ) => Promise<boolean>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const [proveedores, setProveedores] = useState<ProveedoresBD[] | null>(null);
  const [proveedor, setProveedor] = useState<ProveedoresBD | null>(null);
  const [personal, setPersonal] = useState<PersonalBD[] | null>(null);
 
  const getClientes = async () => {
    return await getCompleteData({
      api: clientesAPI,
      setData: setClientes,
    });
  };
  const getProveedores = async () => {
    return await getCompleteData({
      api: proveedoresAPI,
      setData: setProveedores,
    });
  };
  const getPersonal = async () => {
    return await getCompleteData({
      api: personalAPI,
      setData: setPersonal,
    });
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
        setClientes(clientes.filter((c) => c.id !== id));
      }
    } catch (error) {
      logDetailedError(error);
      // Si el error ya fue formateado arriba, no lo formatees de nuevo
      if (
        error instanceof Error &&
        error.message.includes("pedido(s) asociado(s)")
      ) {
        throw error;
      }
      const formattedError = getFormattedError(error);
      showError(formattedError);
      throw error;
    }
  };
  const deleteProveedorById = async (id: string) => {
    try {
      // 1. Verificar si el cliente tiene pedidos asociados
      const responseCheques = await chequesAPI.read({
        columnName: "proveedor_id",
        value: id,
        multiple: true,
      });

      // Si la consulta fue exitosa y hay datos, significa que tiene pedidos asociados
      if (responseCheques.success && responseCheques.data) {
        const chequesAsociados = Array.isArray(responseCheques.data)
          ? responseCheques.data
          : [responseCheques.data];

        if (chequesAsociados.length > 0) {
          // Cliente tiene pedidos asociados, mostrar error
          const errorMessage = `No se puede eliminar el cliente porque tiene ${chequesAsociados.length} cheque(s) asociado(s). Elimine primero los cheques relacionados.`;
          showError(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // 2. Si no tiene pedidos asociados, proceder a eliminar el cliente
      const deleteProveedorResponse = await proveedoresAPI.delete(id);

      if (!deleteProveedorResponse.success) {
        logDetailedError(deleteProveedorResponse.error);
        const formattedError = getFormattedError(deleteProveedorResponse.error);
        showError(formattedError);
        throw new Error(formattedError);
      }

      // 3. Actualizar el estado local
      setProveedor(null);

      // Actualizar la lista de proveedores
      if (proveedores) {
        setProveedores(proveedores.filter((c) => c.id !== id));
      }
    } catch (error) {
      logDetailedError(error);
      // Si el error ya fue formateado arriba, no lo formatees de nuevo
      if (
        error instanceof Error &&
        error.message.includes("cheque(s) asociado(s)")
      ) {
        throw error;
      }
      const formattedError = getFormattedError(error);
      showError(formattedError);
      throw error;
    }
  };
  const checkCuitExists = async (
    cuit: string,
    excludeId?: string,
    table: "clientes" | "proveedores" = "clientes",
  ): Promise<boolean> => {
    try {
      // Buscar clientes con el CUIT especificado
      let response;
      if (table === "proveedores") {
        response = await proveedoresAPI.read({
          columnName: "cuit_cuil",
          value: cuit,
          operator: "=",
          multiple: true,
        });
      } else {
        response = await clientesAPI.read({
          columnName: "cuit_cuil",
          value: cuit,
          operator: "=",
          multiple: true,
        });
      }

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
        const otrosClientes = clientesConCuit.filter(
          (cliente) => cliente.id !== excludeId,
        );
        return otrosClientes.length > 0;
      }

      // Si es creación (sin excludeId), cualquier cliente encontrado es duplicado
      return clientesConCuit.length > 0;
    } catch (error) {
      // En caso de error, asumir que no existe (es más seguro)
      console.error("Error checking CUIT existence:", error);
      return false;
    }
  };
  
  const getCompleteData = async <T extends Record<string, any>>({
    api,
    setData,
  }: {
    api: CRUDMethods<T>;
    setData: React.Dispatch<React.SetStateAction<T[] | null>>;
  }): Promise<T[]> => {
    const response = await api.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    // si response.data tiene la propiedad "nombre" se debe ordenar alfabeticamente
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0 &&
      "nombre" in response.data[0]
    ) {
      response.data.sort((a, b) => {
        const nombreA = (a as any).nombre.toLowerCase();
        const nombreB = (b as any).nombre.toLowerCase();
        if (nombreA < nombreB) return -1;
        if (nombreA > nombreB) return 1;
        return 0;
      });
    }
    setData((response.data as T[]) || []);
    return response.data as T[];
  };

  return (
    <DataContext.Provider
      value={{
        clientes,
        getClientes,
        cliente,
        setCliente,
        getPersonal,
        personal,
        deleteClienteById,
        checkCuitExists,
        getProveedores,
        proveedores,
        setProveedor,
        deleteProveedorById,
        proveedor,
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
      clientes: context.clientes?.filter((c) => c.activo) || null,
      personal: context.personal?.filter((v) => v.activo) || null,
    };
  }, [context, onlyActive]);

  return filteredData;
};
