import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  pedidosAPI,
  carroceriaAPI,
  trabajoChasisAPI,
  camionAPI,
  coloresAPI,
  carrozadoAPI,
  puertasTraserasAPI,
  configTrabajoChasisAPI,
  itemsControlAPI,
  defaultAPI,
  controlCarrozadoAPI,
  ordenesyControlesAPI,
  documentosPedidosAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type {
  PedidosBD,
  PedidosTable,
  PedidosUI,
  TrabajoChasisBD,
  OrdenesYControlesBD,
  OrdenesYControlesUI,
  ControlesBD,
  CarroceriaBD,
  CarroceriaUI,
  TrabajoChasisConDetalles,
  CamionBD,
  TipoDocumento,
  DocumentosBD,
} from "~/types/pedidos";
import type {
  ColoresBD,
  CarrozadosBD,
  PuertasTraserasBD,
  PersonalBD,
  ConfigTrabajosChasisBD,
  ItemsControlBD,
  DefaultDB,
  ControlPorCarrozadoDB,
  DefaultWithPuertas,
  ControlPorCarrozadoConNombre,
} from "~/types/settings";
import type { CRUDMethods } from "~/backend/crudFactory";
import { updateFilePDFPedidos } from "~/components/FileUpladerComponent";
import { useData } from "./DataContext";

type PedidoContextType = {
  getPedidos: () => Promise<PedidosBD[]>;
  getCamiones: () => Promise<CamionBD[]>;
  getCarrocerias: () => Promise<CarroceriaBD[]>;
  getTrabajosChasis: () => Promise<TrabajoChasisBD[]>;
  getDocumentosPedidos: () => Promise<DocumentosBD[]>;
  pedidosConClientes: PedidosTable[] | null;
  getPedidosConClientes: () => Promise<PedidosTable[]>;
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
  configTrabajosChasis: ConfigTrabajosChasisBD[] | null;
  getConfigTrabajosChasis: () => Promise<ConfigTrabajosChasisBD[]>;
  deletePedidoById: (id: string) => Promise<void>;
  controlesPorCarrozado: ControlPorCarrozadoDB[] | null;
  getDefaults: () => Promise<DefaultDB[]>;
  defaults: DefaultDB[] | null;
  selectedCarrozado: DefaultDB[] | null;
  setSelectedCarrozado: React.Dispatch<
    React.SetStateAction<DefaultDB[] | null>
  >;
  getCarrozadoByID: (id: string) => Promise<void>;
  getOrdenesYControles: () => Promise<OrdenesYControlesBD[]>;
  uploadFilesToPedidos: (
    pedidoId: string,
    numeroPedido: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => Promise<{ success: boolean; message?: string; data?: DocumentosBD[] }>;
  deleteDocumentoPedido: (
    documentos: DocumentosBD[],
  ) => Promise<{ success: boolean; message?: string; data?: DocumentosBD[] }>;
  getDefaultsWithPuertas: () => Promise<void>;
  defaultsWithPuertas: DefaultWithPuertas[] | null;
  getControlesPorCarrozadoConNombre: () => Promise<void>;
  controlPorCarrozadoConNombre: ControlPorCarrozadoConNombre[] | null;
  itemsControl: ItemsControlBD[] | null;
  getItemsControl: () => Promise<ItemsControlBD[]>;
};
const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const { getClientes, getPersonal, clientes, proveedores, personal } =
    useData();
  const { showError } = useUIModals();
  const [pedidos, setPedidos] = useState<PedidosBD[] | null>(null);
  const [pedidosConClientes, setPedidosConClientes] = useState<
    PedidosTable[] | null
  >(null);
  const [pedido, setPedido] = useState<PedidosUI | null>(null);
  const [colores, setColores] = useState<ColoresBD[] | null>(null);
  const [carrozados, setCarrozados] = useState<CarrozadosBD[] | null>(null);
  const [puertasTraseras, setPuertasTraseras] = useState<
    PuertasTraserasBD[] | null
  >(null);
  const [trabajosChasis, setTrabajosChasis] = useState<
    TrabajoChasisBD[] | null
  >(null);
  const [trabajosChasisConDetalles, setTrabajosChasisConDetalles] = useState<
    TrabajoChasisConDetalles[] | null
  >(null);
  const [ordenesYControles, setOrdenesYControles] = useState<
    OrdenesYControlesBD[] | null
  >(null);
  const [ordenesyControlesConNombre, setOrdenesYControlesConNombre] = useState<
    OrdenesYControlesUI[] | null
  >(null);
  const [itemsControl, setItemsControl] = useState<ItemsControlBD[] | null>(
    null,
  );
  const [controlesPorCarrozado, setControlesPorCarrozado] = useState<
    ControlPorCarrozadoDB[] | null
  >(null);
  const [controlPorCarrozadoConNombre, setControlPorCarrozadoConNombre] =
    useState<ControlPorCarrozadoConNombre[] | null>(null);
  const [configTrabajosChasis, setConfigTrabajosChasis] = useState<
    ConfigTrabajosChasisBD[] | null
  >(null);
  const [defaults, setDefaults] = useState<DefaultDB[] | null>(null);
  const [selectedCarrozado, setSelectedCarrozado] = useState<
    DefaultDB[] | null
  >(null);

  const [carrocerias, setCarrocerias] = useState<CarroceriaBD[] | null>(null);

  const [camiones, setCamiones] = useState<CamionBD[] | null>(null);
  const [documentosPedidos, setDocumentosPedidos] = useState<
    DocumentosBD[] | null
  >(null);
  const [defaultsWithPuertas, setDefaultsWithPuertas] = useState<
    DefaultWithPuertas[] | null
  >(null);

  // PEDIDOS
  const getPedidosConClientes = useCallback(async () => {
    let dataPedidos: PedidosBD[] | null = pedidos;
    let dataClientes: ClientesBD[] | null = clientes;
    let dataPersonal: PersonalBD[] | null = personal;
    if (!pedidos) {
      dataPedidos = await getPedidos();
    }
    if (!clientes) {
      dataClientes = await getClientes();
    }
    if (!personal) {
      dataPersonal = await getPersonal();
    }

    const pedidosConCliente = (dataPedidos as PedidosBD[]).map((pedido) => {
      const cliente = (dataClientes as ClientesBD[]).find(
        (c) => c.id === pedido.cliente_id,
      );
      const armador = (dataPersonal as PersonalBD[]).find(
        (a) => a.id === pedido.armador_id,
      );
      if (!cliente) {
        throw new Error("Cliente no encontrado.");
      }
      return {
        ...pedido,
        cliente: cliente,
        armador_nombre: armador ? `${armador.nombre} ${armador.apellido}` : "-",
      };
    });
    setPedidosConClientes(pedidosConCliente);
    return pedidosConCliente;
  }, [pedidos, clientes, personal]);
  useEffect(() => {
    getPedidosConClientes();
  }, [pedidos, clientes, personal, getPedidosConClientes]);

  const getPedidos = async () => {
    return await getCompleteData({
      api: pedidosAPI,
      setData: setPedidos,
    });
  };
  const getPedidoById = useCallback(
    async (id: string) => {
      // Obetener el pedido
      let dataPedidosConClientes: PedidosTable[] | null = pedidosConClientes;
      let dataCarrocerias: CarroceriaBD[] | null = carrocerias;
      let dataCarrozados: CarrozadosBD[] | null = carrozados;
      let dataPuertasTraseras: PuertasTraserasBD[] | null = puertasTraseras;
      let dataColores: ColoresBD[] | null = colores;
      let dataDocumentosPedidos: DocumentosBD[] | null = documentosPedidos;
      let dataTrabajosChasisConDetalles: TrabajoChasisConDetalles[] | null =
        trabajosChasisConDetalles;
      let dataCamiones: CamionBD[] | null = camiones;
      let dataOrdenesYControlesConNombre: OrdenesYControlesUI[] | null =
        ordenesyControlesConNombre;
      if (!dataPedidosConClientes) {
        dataPedidosConClientes = await getPedidosConClientes();
      }
      if (!dataPedidosConClientes)
        throw new Error("No se pudieron cargar los pedidos.");
      const dataPedido = dataPedidosConClientes.find((p) => p.id === id);
      if (!dataPedido) throw new Error("Pedido no encontrado.");

      const idPedido = dataPedido.id;
      if (!camiones) {
        dataCamiones = await getCamiones();
      }
      if (!carrocerias) {
        dataCarrocerias = await getCarrocerias();
      }
      if (!dataCarrozados) {
        dataCarrozados = await getCarrozados();
      }
      if (!dataPuertasTraseras) {
        dataPuertasTraseras = await getPuertasTraseras();
      }
      if (!dataColores) {
        dataColores = await getColores();
      }
      if (!dataTrabajosChasisConDetalles) {
        dataTrabajosChasisConDetalles = await getTrabajosChasisConDetalles();
      }
      if (!dataDocumentosPedidos) {
        dataDocumentosPedidos = await getDocumentosPedidos();
      }
      if (!dataOrdenesYControlesConNombre) {
        dataOrdenesYControlesConNombre = await getOrdenesYControlesConNombre();
      }

      /* Obtener los datos relacionados al pedido */
      // Camion
      const camionPedido = getCamionPedido(dataCamiones, idPedido);
      // Carrocerías
      const carroceriaPedido = getCarroceriaPedido(dataCarrocerias, idPedido);
      if (carroceriaPedido) {
        /* Obtener Carrozado */
        carroceriaPedido.carrozado_nombre = dataCarrozados?.find(
          (c) => c.id === carroceriaPedido?.tipo_carrozado_id,
        )?.nombre;
        /* Obtener puerta trasera */
        carroceriaPedido.puerta_trasera_nombre = dataPuertasTraseras?.find(
          (p) => p.id === carroceriaPedido?.puerta_trasera_id,
        )?.nombre;
        /* Obtener colores */
        carroceriaPedido.color_carrozado_nombre = dataColores?.find(
          (c) => c.id === carroceriaPedido?.color_carrozado_id,
        )?.nombre;
        carroceriaPedido.color_zocalo_nombre = dataColores?.find(
          (c) => c.id === carroceriaPedido?.color_zocalo_id,
        )?.nombre;
        carroceriaPedido.color_lona_nombre = dataColores?.find(
          (c) => c.id === carroceriaPedido?.color_lona_id,
        )?.nombre;
      }
      // Trabajos en chasis
      const trabajosChasisPedido = getTrabajosChasisPedido(
        dataTrabajosChasisConDetalles,
        idPedido,
      );
      // Documentos del pedido
      const documentosPedido = getDocumentosByPedidoId(
        dataDocumentosPedidos,
        idPedido,
      );
      const ordenesYControlesPedido = getOrdenesYControlesPedido(
        dataOrdenesYControlesConNombre,
        idPedido,
      );
      // Setear el pedido con todos los datos relacionados
      const pedidoConCarroceria = {
        ...dataPedido,
        carroceria: carroceriaPedido || null,
        trabajo_chasis: trabajosChasisPedido || null,
        documentos: documentosPedido || null,
        camion: camionPedido || null,
        ordenes_controles: ordenesYControlesPedido || null,
      };
      setPedido(pedidoConCarroceria as PedidosUI);
    },
    [
      pedidosConClientes,
      carrocerias,
      carrozados,
      puertasTraseras,
      colores,
      trabajosChasisConDetalles,
      camiones,
      documentosPedidos,
      ordenesYControles,
    ],
  );
  useEffect(() => {
    if (pedido) {
      getPedidoById(pedido.id);
    }
  }, [
    pedidosConClientes,
    carrocerias,
    carrozados,
    puertasTraseras,
    colores,
    trabajosChasisConDetalles,
    camiones,
    documentosPedidos,
    ordenesYControles,
    getPedidoById,
  ]);
  /* CONTROLES POR CARROZADO */
  const getControlesPorCarrozadoConNombre = useCallback(async () => {
    let dataControlesPorCarrozado: ControlPorCarrozadoDB[] | null =
      controlesPorCarrozado;
    let dataItemsControl: ItemsControlBD[] | null = itemsControl;
    if (!dataControlesPorCarrozado) {
      dataControlesPorCarrozado = await getControlesPorCarrozado();
    }
    if (!dataItemsControl) {
      dataItemsControl = await getItemsControl();
    }
    const controlesConNombre = (
      dataControlesPorCarrozado as ControlPorCarrozadoDB[]
    ).map((control) => {
      const itemControl = (dataItemsControl as ItemsControlBD[]).find(
        (item) => item.id === control.item_control_id,
      );
      return {
        ...control,
        item_control_nombre: itemControl
          ? itemControl.nombre
          : "Ítem no encontrado",
        atributo_relacionado: itemControl?.atributo_relacionado || undefined,
      };
    });
    setControlPorCarrozadoConNombre(controlesConNombre);
  }, [controlesPorCarrozado, itemsControl]);
  useEffect(() => {
    getControlesPorCarrozadoConNombre();
  }, [controlesPorCarrozado, itemsControl]);
  /* TRABAJOS EN CHASIS */
  const getTrabajosChasisConDetalles = useCallback(async () => {
    let dataTrabajosChasis: TrabajoChasisBD[] | null = trabajosChasis;
    let dataConfigTrabajosChasis: ConfigTrabajosChasisBD[] | null =
      configTrabajosChasis;
    if (!trabajosChasis) {
      dataTrabajosChasis = await getTrabajosChasis();
    }
    if (!configTrabajosChasis) {
      dataConfigTrabajosChasis = await getConfigTrabajosChasis();
    }
    const trabajosConDetalles = (dataTrabajosChasis as TrabajoChasisBD[]).map(
      (trabajo) => {
        const tipoTrabajo = (
          dataConfigTrabajosChasis as ConfigTrabajosChasisBD[]
        ).find((t) => t.id === trabajo.tipo_trabajo_id);
        return {
          ...trabajo,
          tipo_trabajo_nombre: tipoTrabajo
            ? tipoTrabajo.nombre
            : "Tipo no encontrado",
        };
      },
    );
    setTrabajosChasisConDetalles(trabajosConDetalles);
    return trabajosConDetalles;
  }, [trabajosChasis, configTrabajosChasis]);
  useEffect(() => {
    getTrabajosChasisConDetalles();
  }, [trabajosChasis, configTrabajosChasis]);
  const getTrabajosChasis = async () => {
    return await getCompleteData({
      api: trabajoChasisAPI,
      setData: setTrabajosChasis,
    });
  };
  const getConfigTrabajosChasis = async () => {
    return await getCompleteData({
      api: configTrabajoChasisAPI,
      setData: setConfigTrabajosChasis,
    });
  };
  const getCarroceriaPedido = (
    dataCarrocerias: CarroceriaUI[] | null,
    idPedido: string,
  ) => {
    if (!dataCarrocerias) {
      throw new Error("No se pudieron cargar las carrocerías.");
    }
    return dataCarrocerias?.find((c) => c.pedido_id === idPedido) || null;
  };
  const getCamionPedido = (
    dataCamiones: CamionBD[] | null,
    idPedido: string,
  ) => {
    if (!dataCamiones) throw new Error("No se pudieron cargar los camiones.");
    return dataCamiones.find((c) => c.pedido_id === idPedido) || null;
  };
  const getTrabajosChasisPedido = (
    dataTrabajosChasisConDetalles: TrabajoChasisConDetalles[] | null,
    pedidoId: string,
  ) => {
    if (!dataTrabajosChasisConDetalles)
      throw new Error("No se pudieron cargar los trabajos en chasis.");
    return (
      dataTrabajosChasisConDetalles.filter((t) => t.pedido_id === pedidoId) ||
      []
    );
  };
  const getDocumentosByPedidoId = (
    dataDocumentos: DocumentosBD[] | null,
    idPedido: string,
  ) => {
    if (!dataDocumentos)
      throw new Error("No se pudieron cargar los documentos del pedido.");
    return dataDocumentos.filter((doc) => doc.pedido_id === idPedido) || [];
  };
  const getOrdenesYControlesPedido = (
    dataOrdenesYControlesConNombre: OrdenesYControlesUI[],
    pedidoId: string,
  ) => {
    if (!dataOrdenesYControlesConNombre)
      throw new Error(
        "No se pudieron cargar las ordenes y controles del pedido.",
      );
    return (
      dataOrdenesYControlesConNombre.filter(
        (registro) => registro.pedido_id === pedidoId,
      ) || []
    );
  };
  const getCarrozadoByID = async (id: string) => {
    let dataDefaults: DefaultDB[] | null = defaults;
    if (!defaults) {
      dataDefaults = await getDefaults();
    }
    const dataDefault = dataDefaults?.filter((def) => def.carrozado_id === id);
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
  /* Consumos de API */
  const getCarrocerias = async () => {
    return await getCompleteData({
      api: carroceriaAPI,
      setData: setCarrocerias,
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
        carrozado.id === id ? { ...carrozado, ...data } : carrozado,
      );
    });
  };
  const getPuertasTraseras = async () => {
    return await getCompleteData({
      api: puertasTraserasAPI,
      setData: setPuertasTraseras,
    });
  };
  const getItemsControl = async () => {
    return await getCompleteData({
      api: itemsControlAPI,
      setData: setItemsControl,
    });
  };
  const getControlesPorCarrozado = async () => {
    return await getCompleteData({
      api: controlCarrozadoAPI,
      setData: setControlesPorCarrozado,
    });
  };
  const getDefaults = async () => {
    return await getCompleteData({
      api: defaultAPI,
      setData: setDefaults,
    });
  };

  const getOrdenesYControlesConNombre = useCallback(async () => {
    let dataOrdenesYControles: OrdenesYControlesBD[] | null = ordenesYControles;
    let dataPersonal: PersonalBD[] | null = personal;
    if (!ordenesYControles) {
      dataOrdenesYControles = await getOrdenesYControles();
    }
    if (!personal) {
      dataPersonal = await getPersonal();
    }
    const ordenesYControlesConNombre = (
      dataOrdenesYControles as OrdenesYControlesBD[]
    ).map((registro) => {
      const personalRegistro = (dataPersonal as PersonalBD[]).find(
        (p) => p.id === registro.responsable_id,
      );
      return {
        ...registro,
        responsable_nombre: personalRegistro
          ? `${personalRegistro.nombre} ${personalRegistro.apellido}`
          : "Responsable no encontrado",
      };
    });
    setOrdenesYControlesConNombre(ordenesYControlesConNombre);
    return ordenesYControlesConNombre;
  }, [ordenesYControles, personal]);
  useEffect(() => {
    if (!pedido) return;
    getOrdenesYControlesConNombre();
  }, [ordenesYControles, personal]);
  const getOrdenesYControles = async () => {
    return await getCompleteData({
      api: ordenesyControlesAPI,
      setData: setOrdenesYControles,
    });
  };
  const uploadFilesToPedidos = async (
    pedidoId: string,
    numeroPedido: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => {
    try {
      let dataloaded: DocumentosBD[] | null = [];
      if (!files || files.length === 0) {
        return {
          success: false,
          message: "No se seleccionaron archivos para subir.",
        };
      }
      await Promise.all(
        Array.from(files).map(async (file) => {
          const uploaderFile = await updateFilePDFPedidos(file, numeroPedido);
          if (!uploaderFile) {
            throw new Error("Error al subir el archivo PDF");
          }
          const { url, nombre } = uploaderFile;
          if (!url) {
            throw new Error("Error al subir el archivo PDF");
          }
          const documentoData = {
            pedido_id: pedidoId,
            tipo_documento: tipoDocumento,
            url: url,
            nombre: nombre,
          };
          const response = await documentosPedidosAPI.create(documentoData);
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al crear el documento",
            );
          }
          dataloaded.push(response.data as DocumentosBD);
        }),
      );
      return { success: true, data: dataloaded };
    } catch (error) {
      logDetailedError(error);
      const formattedError = getFormattedError(error);
      showError(formattedError);
      return { success: false, message: formattedError };
    }
  };
  const getDocumentosPedidos = async () => {
    return await getCompleteData({
      api: documentosPedidosAPI,
      setData: setDocumentosPedidos,
    });
  };
  const deleteDocumentoPedido = async (documentos: DocumentosBD[]) => {
    try {
      let dataDeletes: DocumentosBD[] | null = [];
      if (!documentos || documentos.length === 0) {
        return {
          success: false,
          message: "No se seleccionaron documentos para eliminar.",
        };
      }
      await Promise.all(
        documentos.map(async (documento) => {
          const response = await documentosPedidosAPI.delete(documento.id);
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al eliminar el documento",
            );
          }
          dataDeletes.push(documento);
        }),
      );
      return { success: true, data: dataDeletes };
    } catch (error) {
      logDetailedError(error);
      const formattedError = getFormattedError(error);
      showError(formattedError);
      return { success: false, message: formattedError };
    }
  };
  const getDefaultsWithPuertas = async () => {
    let dataDefaults: DefaultDB[] | null = defaults;
    if (!defaults) {
      dataDefaults = await getDefaults();
    }
    let puertasTraserasData: PuertasTraserasBD[] | null = puertasTraseras;
    if (!puertasTraseras) {
      puertasTraserasData = await getPuertasTraseras();
    }
    const data = dataDefaults?.map((def) => {
      const puertaTrasera = puertasTraserasData?.find(
        (p) => p.id === def.valor,
      );
      return {
        ...def,
        puerta_trasera_nombre: puertaTrasera ? puertaTrasera.nombre : "-",
      };
    });
    setDefaultsWithPuertas(data || null);
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
    <PedidoContext.Provider
      value={{
        getPedidos,
        getCamiones,
        getCarrocerias,
        getTrabajosChasis,
        getDocumentosPedidos,
        getPedidosConClientes,
        pedidosConClientes,
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
        getConfigTrabajosChasis,
        configTrabajosChasis,
        deletePedidoById,
        controlesPorCarrozado,
        getDefaults,
        defaults,
        selectedCarrozado,
        getCarrozadoByID,
        setSelectedCarrozado,
        getOrdenesYControles,
        uploadFilesToPedidos,
        deleteDocumentoPedido,
        getDefaultsWithPuertas,
        defaultsWithPuertas,
        getControlesPorCarrozadoConNombre,
        controlPorCarrozadoConNombre,
        itemsControl,
        getItemsControl,
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedido = (onlyActive: boolean = false) => {
  const context = useContext(PedidoContext);
  if (context === undefined) {
    throw new Error("usePedido must be used within a PedidoProvider");
  }
  // Aplicar filtros usando useMemo para optimizar performance
  const filteredData = useMemo(() => {
    if (!onlyActive) {
      return context;
    }

    return {
      ...context,
      colores: context.colores?.filter((c) => c.activo) || null,
      carrozados: context.carrozados?.filter((c) => c.activo) || null,
      puertasTraseras: context.puertasTraseras?.filter((p) => p.activo) || null,
      configTrabajosChasis:
        context.configTrabajosChasis?.filter((t) => t.activo) || null,
    };
  }, [context, onlyActive]);

  return filteredData;
};
