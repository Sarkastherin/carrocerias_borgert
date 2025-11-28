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
  CarroceriaBD,
  CarroceriaUI,
  TrabajoChasisUI,
  CamionBD,
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
import type { CRUDMethods } from "~/backend/crudFactory";

type DataContextType = {
  clientes: ClientesBD[] | null;
  setClientes: React.Dispatch<React.SetStateAction<ClientesBD[] | null>>;
  getClientes: () => Promise<ClientesBD[]>;
  cliente: ClientesBD | null;
  setCliente: React.Dispatch<React.SetStateAction<ClientesBD | null>>;
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
  getControlesByPedidoId: (
    pedidoId: string,
    refresh?: boolean
  ) => Promise<ControlesBD[]>;
  controlesByPedido: ControlesBD[] | null;
  setControlesByPedido: React.Dispatch<
    React.SetStateAction<ControlesBD[] | null>
  >;
  refreshPedidoByIdAndTable: (table: Tables) => Promise<void>;
};
type Tables = "carroceria" | "trabajo_chasis" | "camion";
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
  const [controlesByPedido, setControlesByPedido] = useState<
    ControlesBD[] | null
  >(null);
  const [carrocerias, setCarrocerias] = useState<CarroceriaBD[] | null>(null);
  const [trabajosChasis, setTrabajosChasis] = useState<
    TrabajoChasisUI[] | null
  >(null);
  const [camiones, setCamiones] = useState<CamionBD[] | null>(null);
  const getClientes = async () => {
    return await getCompleteData({
      api: clientesAPI,
      setData: setClientes,
    });
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
  /* Valores Carrocerías  */
  const getCarrozado = async (id: string) => {
    let dataCarrozados: CarrozadosBD[] | null = carrozados;
    if (!carrozados) {
      dataCarrozados = await getCarrozados();
    }
    if (!dataCarrozados)
      throw new Error("No se pudieron cargar los carrozados.");
    return dataCarrozados.find((c) => c.id === id);
  };
  const getPuertaTrasera = async (id: string) => {
    let dataPuertasTraseras: PuertasTraserasBD[] | null = puertasTraseras;
    if (!puertasTraseras) {
      dataPuertasTraseras = await getPuertasTraseras();
    }
    if (!dataPuertasTraseras)
      throw new Error("No se pudieron cargar las puertas traseras.");
    return dataPuertasTraseras.find((p) => p.id === id);
  };
  const getColor = async (id: string) => {
    let dataColores: ColoresBD[] | null = colores;
    if (!colores) {
      dataColores = await getColores();
    }
    if (!dataColores) throw new Error("No se pudieron cargar los colores.");
    return dataColores.find((c) => c.id === id);
  };
  const getCarroceriaPedido = async (
    dataCarrocerias: CarroceriaUI[] | null,
    idPedido: string
  ) => {
    if (!dataCarrocerias) {
      throw new Error("No se pudieron cargar las carrocerías.");
    }
    return dataCarrocerias?.find((c) => c.pedido_id === idPedido) || null;
  };

  const getPedidoById = async (id: string) => {
    // Obetener el pedido
    let dataPedidos: PedidosTable[] | null = pedidos;
    if (!pedidos) {
      dataPedidos = await getPedidos();
    }
    if (!dataPedidos) throw new Error("No se pudieron cargar los pedidos.");
    const dataPedido = dataPedidos.find((p) => p.id === id);
    if (!dataPedido) throw new Error("Pedido no encontrado.");
    const idPedido = dataPedido.id;
    /* Obtener los datos relacionados al pedido */
    // Carrocerías
    let dataCarrocerias: CarroceriaBD[] | null = carrocerias;
    if (!carrocerias) {
      dataCarrocerias = await getCarrocerias();
    }
    const carroceriaPedido = await getCarroceriaPedido(
      dataCarrocerias,
      idPedido
    );
    /* Obtener Carrozado */
    await getNombreCarrozado(carroceriaPedido);
    /* Obtener puerta trasera */
    await getNombrePuertaTrasera(carroceriaPedido);
    /* Obtener colores */
    await getColoresByIds(carroceriaPedido);
    // Trabajos en chasis
    let dataTrabajosChasis: TrabajoChasisBD[] | null = trabajosChasis;
    if (!trabajosChasis) {
      dataTrabajosChasis = await getTrabajosChasis();
    }
    // Trabajos en chasis del pedido
    const trabajosChasisPedido = await getTabajosChasisByPedidoId(
      dataTrabajosChasis,
      idPedido
    );
    // Camion
    let dataCamiones: CamionBD[] | null = camiones;
    if (!camiones) {
      dataCamiones = await getCamiones();
    }
    const camionPedido = await getCamionByPedidoId(dataCamiones, idPedido);
    // Setear el pedido con todos los datos relacionados
    const pedidoConCarroceria = {
      ...dataPedido,
      carroceria: carroceriaPedido || null,
      trabajo_chasis: trabajosChasisPedido || null,
      camion: camionPedido || null,
    };
    setPedido(pedidoConCarroceria as PedidosUI);
  };
  const getNombreCarrozado = async (carroceriaPedido: CarroceriaUI | null) => {
    if (!carroceriaPedido) return;
    const carroceriaId = carroceriaPedido?.tipo_carrozado_id;
    if (carroceriaId) {
      const carrozado = await getCarrozado(carroceriaId);
      if (!carrozado) throw new Error("Carrozado no encontrado.");
      carroceriaPedido.carrozado_nombre = carrozado.nombre;
    }
  };
  const getNombrePuertaTrasera = async (
    carroceriaPedido: CarroceriaUI | null
  ) => {
    if (!carroceriaPedido) return;
    const puertaTraseraId = carroceriaPedido?.puerta_trasera_id;
    if (puertaTraseraId) {
      const puertaTrasera = await getPuertaTrasera(puertaTraseraId);
      if (!puertaTrasera) throw new Error("Puerta trasera no encontrada.");
      carroceriaPedido.puerta_trasera_nombre = puertaTrasera.nombre;
    }
  };
  const getColoresByIds = async (carroceriaPedido: CarroceriaUI | null) => {
    const colorCarrozadoId = carroceriaPedido?.color_carrozado_id;
    const colorZocaloId = carroceriaPedido?.color_zocalo_id;
    const colorLonaId = carroceriaPedido?.color_lona_id;

    if (colorCarrozadoId) {
      const colorCarrozado = await getColor(colorCarrozadoId);
      if (!colorCarrozado) throw new Error("Color carrozado no encontrado.");
      carroceriaPedido.color_carrozado_nombre = colorCarrozado.nombre;
    }

    if (colorZocaloId) {
      const colorZocalo = await getColor(colorZocaloId);
      if (!colorZocalo) throw new Error("Color zócalo no encontrado.");
      carroceriaPedido.color_zocalo_nombre = colorZocalo.nombre;
    }

    if (colorLonaId) {
      const colorLona = await getColor(colorLonaId);
      if (!colorLona) throw new Error("Color lona no encontrado.");
      carroceriaPedido.color_lona_nombre = colorLona.nombre;
    }
  };
  /* Fin Valores Carrocerías  */
  const getCamionByPedidoId = async (
    dataCamiones: CamionBD[] | null,
    idPedido: string
  ) => {
    if (!dataCamiones) throw new Error("No se pudieron cargar los camiones.");
    return dataCamiones.find((c) => c.pedido_id === idPedido) || null;
  };
  const getTabajosChasisByPedidoId = async (
    dataTrabajosChasis: TrabajoChasisUI[] | null,
    idPedido: string
  ) => {
    if (!dataTrabajosChasis)
      throw new Error("No se pudieron cargar los trabajos en chasis.");
    const trabajosChasisPedido =
      dataTrabajosChasis?.filter((trabajo) => trabajo.pedido_id === idPedido) ||
      [];
    const trabajosConNombres: TrabajoChasisUI[] = [];
    if (trabajosChasisPedido && trabajosChasisPedido.length > 0) {
      const getTipoTrabajo = async (id: string) => {
        let dataConfigTrabajosChasis: ConfigTrabajosChasisBD[] | null =
          configTrabajosChasis;
        if (!configTrabajosChasis) {
          dataConfigTrabajosChasis = await getConfigTrabajosChasis();
        }
        const tipoTrabajo = dataConfigTrabajosChasis?.find((t) => t.id === id);
        if (!tipoTrabajo) return null;
        return tipoTrabajo;
      };

      // Procesar cada trabajo de chassis
      for (const trabajo of trabajosChasisPedido) {
        const tipoTrabajo = await getTipoTrabajo(trabajo.tipo_trabajo_id);
        trabajosConNombres.push({
          ...trabajo,
          tipo_trabajo_nombre: tipoTrabajo?.nombre || "Trabajo no encontrado",
        });
      }
    }
    return trabajosConNombres;
  };
  const refreshPedidoByIdAndTable = async (table: Tables) => {
    if (!pedido) return;
    const idPedido = pedido.id;
    switch (table) {
      case "carroceria":
        const dataCarrocerias = await getCarrocerias();
        const carroceriaPedido = await getCarroceriaPedido(
          dataCarrocerias,
          idPedido
        );
        /* Obtener Carrozado */
        await getNombreCarrozado(carroceriaPedido);
        /* Obtener puerta trasera */
        await getNombrePuertaTrasera(carroceriaPedido);
        /* Obtener colores */
        await getColoresByIds(carroceriaPedido);
        setPedido({
          ...pedido,
          carroceria: carroceriaPedido || null,
        });
        break;
      case "camion":
        const dataCamiones = await getCamiones();
        const camionPedido = await getCamionByPedidoId(dataCamiones, idPedido);
        setPedido({
          ...pedido,
          camion: camionPedido || null,
        });
        break;
      case "trabajo_chasis":
        const dataTrabajosChasis = await getTrabajosChasis();
        const trabajosChasisPedido = await getTabajosChasisByPedidoId(
          dataTrabajosChasis,
          idPedido
        );
        setPedido({
          ...pedido,
          trabajo_chasis: trabajosChasisPedido || null,
        });
        break;
    }
  };
  const getCarrozadoByID = async (id: string) => {
    let dataDefaults: DefaultDB[] | null = defaults;
    if (!defaults) {
      console.log("getCarrozadoByID: Loading defaults from API...");
      dataDefaults = await getDefaults();
    } else {
      console.log("getCarrozadoByID: Using cached defaults:", defaults);
      dataDefaults = defaults;
    }
    const dataDefault = dataDefaults.filter((def) => def.carrozado_id === id);
    setSelectedCarrozado(dataDefault || null);
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
  const getCarrocerias = async () => {
    return await getCompleteData({
      api: carroceriaAPI,
      setData: setCarrocerias,
    });
  };
  const getTrabajosChasis = async () => {
    return await getCompleteData({
      api: trabajoChasisAPI,
      setData: setTrabajosChasis,
    });
  };
  const getCamiones = async () => {
    return await getCompleteData({
      api: camionAPI,
      setData: setCamiones,
    });
  };

  const getColores = async () => {
    return await getCompleteData({
      api: coloresAPI,
      setData: setColores,
    });
  };
  const getCarrozados = async () => {
    return await getCompleteData({
      api: carrozadoAPI,
      setData: setCarrozados,
    });
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
    setCarrozados((prev) => {
      if (!prev) return prev;
      return prev.map((carrozado) =>
        carrozado.id === id ? { ...carrozado, ...data } : carrozado
      );
    });
  };
  const getPuertasTraseras = async () => {
    return await getCompleteData({
      api: puertasTraserasAPI,
      setData: setPuertasTraseras,
    });
  };
  const getPersonal = async () => {
    return await getCompleteData({
      api: personalAPI,
      setData: setPersonal,
    });
  };
  const getConfigTrabajosChasis = async () => {
    return await getCompleteData({
      api: configTrabajoChasisAPI,
      setData: setConfigTrabajosChasis,
    });
  };
  const getConfigItemsControl = async () => {
    return await getCompleteData({
      api: configItemsControlAPI,
      setData: setConfigItemsControl,
    });
  };
  const getDefaults = async () => {
    return await getCompleteData({
      api: defaultAPI,
      setData: setDefaults,
    });
  };
  const getControlesItems = async () => {
    return await getCompleteData({
      api: controlCarrozadoAPI,
      setData: setControlCarrozado,
    });
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
    return await getCompleteData({
      api: ordenesAPI,
      setData: setOrdenes,
    });
  };

  const getControles = async () => {
    return await getCompleteData({
      api: controlesAPI,
      setData: setControles,
    });
  };
  const getOrdenesByPedidoId = async (pedidoId: string, refresh?: boolean) => {
    if (
      ordenesByPedido &&
      ordenesByPedido.length > 0 &&
      ordenesByPedido[0].pedido_id === pedidoId &&
      !refresh
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
      controlesByPedido[0].pedido_id === pedidoId &&
      !refresh
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
  const getCompleteData = async <T extends unknown>({
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
    setData((response.data as T[]) || []);
    return response.data as T[];
  };

  return (
    <DataContext.Provider
      value={{
        clientes,
        setClientes,
        getClientes,
        cliente,
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
        refreshPedidoByIdAndTable,
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
