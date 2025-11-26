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
  personalAPI,
  configTrabajoChasisAPI,
  configItemsControlAPI,
  defaultAPI,
  controlCarrozadoAPI,
  ordenesAPI,
  controlesAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type {
  PedidosBD,
  PedidosTable,
  PedidosUI,
  TrabajoChasisBD,
  OrdenesBD,
  ControlesBD,
} from "~/types/pedidos";
import type {
  ColoresBD,
  CarrozadosBD,
  PuertasTraserasBD,
  PersonalBD,
  ConfigTrabajosChasisBD,
  ConfigItemsControlBD,
  DefaultDB,
  ControlCarrozadoDB,
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
  getPedidos: () => Promise<PedidosTable[]>;
  pedido: PedidosUI | null;
  setPedido: React.Dispatch<React.SetStateAction<PedidosUI | null>>;
  getPedidoById: (id: string) => Promise<void>;
  colores: ColoresBD[] | null;
  getColores: () => Promise<ColoresBD[]>;
  carrozados: CarrozadosBD[] | null;
  getCarrozados: () => Promise<CarrozadosBD[]>;
  updateCarrozado: (id: string, data: Partial<CarrozadosBD>) => Promise<void>;
  puertasTraseras: PuertasTraserasBD[] | null;
  getPuertasTraseras: () => Promise<PuertasTraserasBD[]>;
  personal: PersonalBD[] | null;
  getPersonal: () => Promise<PersonalBD[]>;
  configTrabajosChasis: ConfigTrabajosChasisBD[] | null;
  getConfigTrabajosChasis: () => Promise<ConfigTrabajosChasisBD[]>;
  deletePedidoById: (id: string) => Promise<void>;
  deleteClienteById: (id: string) => Promise<void>;
  checkCuitExists: (cuit: string, excludeId?: string) => Promise<boolean>;
  configItemsControl: ConfigItemsControlBD[] | null;
  getConfigItemsControl: () => Promise<ConfigItemsControlBD[]>;
  controlCarrozado: ControlCarrozadoDB[] | null;
  getControlesItems: () => Promise<ControlCarrozadoDB[]>;
  getDefaults: () => Promise<DefaultDB[]>;
  defaults: DefaultDB[] | null;
  selectedCarrozado: DefaultDB[] | null;
  setSelectedCarrozado: React.Dispatch<
    React.SetStateAction<DefaultDB[] | null>
  >;
  getCarrozadoByID: (id: string) => Promise<void>;
  ordenes: OrdenesBD[] | null;
  getOrdenes: () => Promise<OrdenesBD[]>;
  getOrdenesByPedidoId: (
    pedidoId: string,
    refresh?: boolean
  ) => Promise<OrdenesBD[]>;
  ordenesByPedido: OrdenesBD[] | null;
  setOrdenesByPedido: React.Dispatch<React.SetStateAction<OrdenesBD[] | null>>;
  getControlesByPedidoId: (pedidoId: string, refresh?: boolean) => Promise<ControlesBD[]>;
  controlesByPedido: ControlesBD[] | null;
  setControlesByPedido: React.Dispatch<React.SetStateAction<ControlesBD[] | null>>;
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
  const [configItemsControl, setConfigItemsControl] = useState<
    ConfigItemsControlBD[] | null
  >(null);
  const [personal, setPersonal] = useState<PersonalBD[] | null>(null);
  const [configTrabajosChasis, setConfigTrabajosChasis] = useState<
    ConfigTrabajosChasisBD[] | null
  >(null);
  const [defaults, setDefaults] = useState<DefaultDB[] | null>(null);
  const [controlCarrozado, setControlCarrozado] = useState<
    ControlCarrozadoDB[] | null
  >(null);
  const [selectedCarrozado, setSelectedCarrozado] = useState<
    DefaultDB[] | null
  >(null);
  const [ordenes, setOrdenes] = useState<OrdenesBD[] | null>(null);
  const [ordenesByPedido, setOrdenesByPedido] = useState<OrdenesBD[] | null>(
    null
  );
  const [controles, setControles] = useState<ControlesBD[] | null>(null);
  const [controlesByPedido, setControlesByPedido] = useState<ControlesBD[] | null>(
    null
  );
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
    const resVendedores = await getPersonal();
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
    return pedidosConCliente;
  };
  const getPedidoById = async (id: string) => {
    const getPedido = async () => {
      if (!pedidos) {
        // Si no hay pedidos cargados, cargar todos los pedidos
        const pedidosData = await getPedidos();
        // Buscar el pedido específico en los datos recién cargados
        const existingPedido = pedidosData.find((p) => p.id === id);
        if (!existingPedido) {
          setPedido(null);
          return null;
        }
        return existingPedido;
      } else {
        // Si hay pedidos cargados, buscar en el cache
        const existingPedido = pedidos.find((p) => p.id === id);
        if (!existingPedido) {
          setPedido(null);
          return null;
        }
        return existingPedido;
      }
    };
    const data = await getPedido();
    // Si no se encontró el pedido, salir de la función
    if (!data) {
      return;
    }
    const idPedido = data.id;
    /* Obtener los datos relacionados al pedido */
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
    const carroceriaId = Array.isArray(responseCarroceria.data)
      ? responseCarroceria.data[0]?.tipo_carrozado_id || ""
      : responseCarroceria.data?.tipo_carrozado_id || "";
    /* Obtener datos de las referencias (id's) */
    const getCarrozado = async (id: string) => {
      if (!carrozados) {
        //Si no hay carrozados cargados, cargarlos
        const carrozadosData = await getCarrozados();
        const carrozadoPedido = carrozadosData.find((c) => c.id === id);
        if (!carrozadoPedido) return null;
        return carrozadoPedido;
      } else {
        const carrozadoPedido = carrozados.find((c) => c.id === id);
        if (!carrozadoPedido) return null;
        return carrozadoPedido;
      }
    };
    const carrozado = await getCarrozado(carroceriaId);
    if (carrozado) {
      //Agregar carrozado_nombre al objeto carroceria
      if (Array.isArray(responseCarroceria.data)) {
        (responseCarroceria.data[0] as any).carrozado_nombre =
          carrozado.nombre || "";
      } else if (responseCarroceria.data) {
        (responseCarroceria.data as any).carrozado_nombre =
          carrozado.nombre || "";
      }
    }

    /* Obtener puerta trasera */
    const puertaTraseraId = Array.isArray(responseCarroceria.data)
      ? responseCarroceria.data[0]?.puerta_trasera_id || ""
      : responseCarroceria.data?.puerta_trasera_id || "";

    const getPuertaTrasera = async (id: string) => {
      if (!puertasTraseras) {
        // Si no hay puertas traseras cargadas, cargarlas
        const puertasTraserasData = await getPuertasTraseras();
        const puertaTraseraPedido = puertasTraserasData.find(
          (p) => p.id === id
        );
        if (!puertaTraseraPedido) return null;
        return puertaTraseraPedido;
      } else {
        const puertaTraseraPedido = puertasTraseras.find((p) => p.id === id);
        if (!puertaTraseraPedido) return null;
        return puertaTraseraPedido;
      }
    };

    const puertaTrasera = await getPuertaTrasera(puertaTraseraId);
    if (puertaTrasera) {
      // Agregar puerta_trasera_nombre al objeto carroceria
      if (Array.isArray(responseCarroceria.data)) {
        (responseCarroceria.data[0] as any).puerta_trasera_nombre =
          puertaTrasera.nombre || "";
      } else if (responseCarroceria.data) {
        (responseCarroceria.data as any).puerta_trasera_nombre =
          puertaTrasera.nombre || "";
      }
    }

    /* Obtener colores */
    const colorCarrozadoId = Array.isArray(responseCarroceria.data)
      ? responseCarroceria.data[0]?.color_carrozado_id || ""
      : responseCarroceria.data?.color_carrozado_id || "";

    const colorZocaloId = Array.isArray(responseCarroceria.data)
      ? responseCarroceria.data[0]?.color_zocalo_id || ""
      : responseCarroceria.data?.color_zocalo_id || "";
    const colorLonaId = Array.isArray(responseCarroceria.data)
      ? responseCarroceria.data[0]?.color_lona_id || ""
      : responseCarroceria.data?.color_lona_id || "";

    const getColor = async (id: string) => {
      if (!colores) {
        // Si no hay colores cargados, cargarlos
        const coloresData = await getColores();
        const colorPedido = coloresData.find((c) => c.id === id);
        if (!colorPedido) return null;
        return colorPedido;
      } else {
        const colorPedido = colores.find((c) => c.id === id);
        if (!colorPedido) return null;
        return colorPedido;
      }
    };

    const colorCarrozado = await getColor(colorCarrozadoId);
    const colorZocalo = await getColor(colorZocaloId);
    const colorLona = await getColor(colorLonaId);

    if (colorCarrozado) {
      // Agregar color_carrozado_nombre al objeto carroceria
      if (Array.isArray(responseCarroceria.data)) {
        (responseCarroceria.data[0] as any).color_carrozado_nombre =
          colorCarrozado.nombre || "";
      } else if (responseCarroceria.data) {
        (responseCarroceria.data as any).color_carrozado_nombre =
          colorCarrozado.nombre || "";
      }
    }

    if (colorZocalo) {
      // Agregar color_zocalo_nombre al objeto carroceria
      if (Array.isArray(responseCarroceria.data)) {
        (responseCarroceria.data[0] as any).color_zocalo_nombre =
          colorZocalo.nombre || "";
      } else if (responseCarroceria.data) {
        (responseCarroceria.data as any).color_zocalo_nombre =
          colorZocalo.nombre || "";
      }
    }
    if (colorLona) {
      // Agregar color_lona_nombre al objeto carroceria
      if (Array.isArray(responseCarroceria.data)) {
        (responseCarroceria.data[0] as any).color_lona_nombre =
          colorLona.nombre || "";
      } else if (responseCarroceria.data) {
        (responseCarroceria.data as any).color_lona_nombre =
          colorLona.nombre || "";
      }
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

    /* Agregar nombres a los trabajos de chassis */
    let trabajosConNombres: (TrabajoChasisBD & {
      tipo_trabajo_nombre: string;
    })[] = [];

    if (responseTrabajoChasis.data) {
      const trabajosArray = Array.isArray(responseTrabajoChasis.data)
        ? responseTrabajoChasis.data
        : [responseTrabajoChasis.data];

      const getTipoTrabajo = async (id: string) => {
        if (!configTrabajosChasis) {
          // Si no hay config trabajos chassis cargados, cargarlos
          const configTrabajosChasisData = await getConfigTrabajosChasis();
          const tipoTrabajo = configTrabajosChasisData.find((t) => t.id === id);
          if (!tipoTrabajo) return null;
          return tipoTrabajo;
        } else {
          const tipoTrabajo = configTrabajosChasis.find((t) => t.id === id);
          if (!tipoTrabajo) return null;
          return tipoTrabajo;
        }
      };

      // Procesar cada trabajo de chassis
      for (const trabajo of trabajosArray) {
        const tipoTrabajo = await getTipoTrabajo(trabajo.tipo_trabajo_id);
        trabajosConNombres.push({
          ...trabajo,
          tipo_trabajo_nombre: tipoTrabajo?.nombre || "Trabajo no encontrado",
        });
      }
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
      ...data,
      carroceria: responseCarroceria.data || null,
      trabajo_chasis: trabajosConNombres,
      camion: responseCamion.data || null,
      // El cliente ya viene incluido en data desde getPedidos (cliente_nombre)
      // o podemos extraer el cliente completo desde el cache de clientes
      cliente: null, // Se podría obtener desde clientes cache si se necesita objeto completo
    };
    setPedido(pedidoConCarroceria as PedidosUI);
  };
  const getCarrozadoByID = async (id: string) => {
    const response = await defaultAPI.read({
      columnName: "carrozado_id",
      value: id,
    });
    if (!response.success && response.status !== 404) {
      const formattedError = getFormattedError(response.error);
      throw new Error(formattedError);
    }
    setSelectedCarrozado(response.data as DefaultDB[]);
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
        setPedidos(pedidos.filter((p) => p.id !== id));
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

  const updateCarrozado = async (id: string, data: Partial<CarrozadosBD>) => {
    const response = await carrozadoAPI.update(id, data);
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    // Actualizar el estado local
    setCarrozados(prev => {
      if (!prev) return prev;
      return prev.map(carrozado => 
        carrozado.id === id ? { ...carrozado, ...data } : carrozado
      );
    });
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
  const getPersonal = async () => {
    const response = await personalAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setPersonal((response.data as PersonalBD[]) || []);
    return response.data as PersonalBD[];
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
  const getConfigItemsControl = async () => {
    const response = await configItemsControlAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setConfigItemsControl((response.data as ConfigItemsControlBD[]) || []);
    return response.data as ConfigItemsControlBD[];
  };
  const getDefaults = async () => {
    const response = await defaultAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setDefaults((response.data as DefaultDB[]) || []);
    return response.data as DefaultDB[];
  };
  const getControlesItems = async () => {
    const response = await controlCarrozadoAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setControlCarrozado((response.data as ControlCarrozadoDB[]) || []);
    return response.data as ControlCarrozadoDB[];
  };
  const checkCuitExists = async (
    cuit: string,
    excludeId?: string
  ): Promise<boolean> => {
    try {
      // Buscar clientes con el CUIT especificado
      const response = await clientesAPI.read({
        columnName: "cuit_cuil",
        value: cuit,
        operator: "=",
        multiple: true,
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
        const otrosClientes = clientesConCuit.filter(
          (cliente) => cliente.id !== excludeId
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
  const getOrdenes = async () => {
    const response = await ordenesAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setOrdenes((response.data as OrdenesBD[]) || []);
    return response.data as OrdenesBD[];
  };
  const getControles = async () => {
    const response = await controlesAPI.read();
    if (!response.success) {
      logDetailedError(response.error);
      const formattedError = getFormattedError(response.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    setControles((response.data as ControlesBD[]) || []);
    return response.data as ControlesBD[];
  };
  const getOrdenesByPedidoId = async (
    pedidoId: string,
    refresh?: boolean 
  ) => {
    if (
      ordenesByPedido &&
      ordenesByPedido.length > 0 &&
      ordenesByPedido[0].pedido_id === pedidoId
      && !refresh
    ) {
      //Si ya se cargaron las ordenes para este pedido, devolverlas
      return ordenesByPedido;
    }
    if (!ordenes || refresh) {
      //Si no hay ordenes cargadas, cargarlas
      const ordensData = await getOrdenes();
      // Buscar las ordenes del pedido especifico
      const existeingOrdenes = ordensData.filter(
        (orden) => orden.pedido_id === pedidoId
      );
      if (!existeingOrdenes || existeingOrdenes.length === 0) {
        setOrdenesByPedido(null);
        return [];
      }
      setOrdenesByPedido(existeingOrdenes);
      return existeingOrdenes;
    } else {
      //Si ya hay ordenes cargadas, buscar en el cache
      const existeingOrdenes = ordenes.filter(
        (orden) => orden.pedido_id === pedidoId
      );
      if (!existeingOrdenes || existeingOrdenes.length === 0) {
        setOrdenesByPedido(null);
        return [];
      }
      setOrdenesByPedido(existeingOrdenes);
      return existeingOrdenes;
    }
  };
  const getControlesByPedidoId = async (
    pedidoId: string,
    refresh?: boolean 
  ) => {
    if (
      controlesByPedido &&
      controlesByPedido.length > 0 &&
      controlesByPedido[0].pedido_id === pedidoId
      && !refresh
    ) {
      //Si ya se cargaron los controles para este pedido, devolverlos
      return controlesByPedido;
    }
    if (!controles || refresh) {
      //Si no hay controles cargados, cargarlos
      const controlesData = await getControles();
      // Buscar los controles del pedido especifico
      const existeingControles = controlesData.filter(
        (control) => control.pedido_id === pedidoId
      );
      if (!existeingControles || existeingControles.length === 0) {
        setControlesByPedido(null);
        return [];
      }
      setControlesByPedido(existeingControles);
      return existeingControles;
    } else {
      //Si ya hay controles cargados, buscar en el cache
      const existeingControles = controles.filter(
        (control) => control.pedido_id === pedidoId
      );
      if (!existeingControles || existeingControles.length === 0) {
        setControlesByPedido(null);
        return [];
      }
      setControlesByPedido(existeingControles);
      return existeingControles;
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
        updateCarrozado,
        carrozados,
        getPuertasTraseras,
        puertasTraseras,
        getPersonal,
        personal,
        getConfigTrabajosChasis,
        configTrabajosChasis,
        deletePedidoById,
        deleteClienteById,
        checkCuitExists,
        getConfigItemsControl,
        configItemsControl,
        getControlesItems,
        controlCarrozado,
        getDefaults,
        defaults,
        selectedCarrozado,
        getCarrozadoByID,
        setSelectedCarrozado,
        ordenes,
        getOrdenes,
        getOrdenesByPedidoId,
        ordenesByPedido,
        setOrdenesByPedido,
        getControlesByPedidoId,
        controlesByPedido,
        setControlesByPedido,
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
      colores: context.colores?.filter((c) => c.activo) || null,
      carrozados: context.carrozados?.filter((c) => c.activo) || null,
      puertasTraseras: context.puertasTraseras?.filter((p) => p.activo) || null,
      personal: context.personal?.filter((v) => v.activo) || null,
      configTrabajosChasis:
        context.configTrabajosChasis?.filter((t) => t.activo) || null,
    };
  }, [context, onlyActive]);

  return filteredData;
};
