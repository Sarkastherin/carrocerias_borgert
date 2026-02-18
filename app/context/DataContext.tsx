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
  mvtosAPI,
  chequesAPI,
  proveedoresAPI,
  documentosPedidosAPI,
  documentosCtasCtesAPI,
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
  TipoDocumento,
  DocumentosBD,
  DocumentosCtasCtesBD,
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
  DefaultWithPuertas,
} from "~/types/settings";
import type { CRUDMethods } from "~/backend/crudFactory";
import type {
  MvtosDB,
  ChequesDB,
  CtaCte,
  ChequesWithTerceros,
  BancosProps,
  CtasCtesWithCheque,
  MvtosWithCheques,
  ChequesEnriched,
} from "~/types/ctas_corrientes";
import type { ProveedoresBD } from "~/types/proveedores";
import {
  updateFilePDFPedidos,
  updateFilePDFCtaCte,
} from "~/components/FileUpladerComponent";
type RefreshOptionsCtaCte = {
  refMvto?: boolean;
  refCheque?: boolean;
  refDocu?: boolean;
};
type DataContextType = {
  clientes: ClientesBD[] | null;
  proveedores: ProveedoresBD[] | null;
  getClientes: () => Promise<ClientesBD[]>;
  getProveedores: () => Promise<ProveedoresBD[]>;
  cliente: ClientesBD | null;
  proveedor: ProveedoresBD | null;
  setCliente: React.Dispatch<React.SetStateAction<ClientesBD | null>>;
  setProveedor: React.Dispatch<React.SetStateAction<ProveedoresBD | null>>;
  pedidos: PedidosTable[] | null;
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
  deleteProveedorById: (id: string) => Promise<void>;
  checkCuitExists: (
    cuit: string,
    excludeId?: string,
    table?: "clientes" | "proveedores",
  ) => Promise<boolean>;
  configItemsControl: ConfigItemsControlBD[] | null;
  getConfigItemsControl: () => Promise<ConfigItemsControlBD[]>;
  controlCarrozado: ControlCarrozadoDB[] | null;
  getControlCarrozado: () => Promise<ControlCarrozadoDB[]>;
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
    refresh?: boolean,
  ) => Promise<OrdenesBD[]>;
  ordenesByPedido: OrdenesBD[] | null;
  getControlesByPedidoId: (
    pedidoId: string,
    refresh?: boolean,
  ) => Promise<ControlesBD[]>;
  controlesByPedido: ControlesBD[] | null;
  refreshPedidoByIdAndTable: (table: Tables) => Promise<void>;
  getCtrlCarrozadoByCarrozadoId: (
    carrozadoId: string,
  ) => Promise<ControlCarrozadoDB[] | null>;
  ctrlCarrozadoByCarrozadoId: ControlCarrozadoDB[] | null;
  getCtasCtes: (opt?: RefreshOptionsCtaCte) => Promise<boolean>;
  refreshCtasCtes: ({
    refMvto,
    refCheque,
    refDocu,
  }: RefreshOptionsCtaCte) => Promise<boolean>;
  ctasCtes: CtaCte[] | null;
  mvtos: MvtosDB[] | null;
  getMvtos: () => Promise<MvtosDB[]>;
  cheques: ChequesDB[] | null;
  getCheques: () => Promise<ChequesDB[]>;
  getBancos: () => Promise<BancosProps[]>;
  bancos: BancosProps[] | null;
  getDefaultsWithPuertas: () => Promise<void>;
  defaultsWithPuertas: DefaultWithPuertas[] | null;
  uploadFilesToPedidos: (
    pedidoId: string,
    numeroPedido: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => Promise<{ success: boolean; message?: string; data?: DocumentosBD[] }>;
  uploadFilesToCtasCtes: (
    ctaCteId: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: DocumentosCtasCtesBD[];
  }>;

  deleteDocumentoPedido: (
    documentos: DocumentosBD[],
  ) => Promise<{ success: boolean; message?: string; data?: DocumentosBD[] }>;
  deleteDocumentoCtasCtes: (documentos: DocumentosCtasCtesBD[]) => Promise<{
    success: boolean;
    message?: string;
    data?: DocumentosCtasCtesBD[];
  }>;
  ctaCte: CtaCte | null;
  setCtaCte: React.Dispatch<React.SetStateAction<CtaCte | null>>;
  getChequesEnriched: () => Promise<ChequesEnriched[]>;
  chequesEnriched: ChequesEnriched[] | null;
};
type Tables =
  | "carroceria"
  | "trabajo_chasis"
  | "camion"
  | "ordenes"
  | "controles"
  | "pedidos"
  | "documentos";
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [proveedores, setProveedores] = useState<ProveedoresBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const [proveedor, setProveedor] = useState<ProveedoresBD | null>(null);
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
    null,
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
  const [ctrlCarrozadoByCarrozadoId, setctrlCarrozadoByCarrozadoId] = useState<
    ControlCarrozadoDB[] | null
  >(null);
  const [mvtos, setMvtos] = useState<MvtosDB[] | null>(null);
  const [mvtosWithCheques, setMvtosWithCheques] = useState<
    MvtosWithCheques[] | null
  >(null);
  const [ctasCtes, setCtasCtes] = useState<CtaCte[] | null>(null);
  const [ctaCteByIDCliente, setCtaCteByIDCliente] = useState(null);
  const [ctaCte, setCtaCte] = useState<CtaCte | null>(null);
  const [cheques, setCheques] = useState<ChequesDB[] | null>(null);
  const [chequesEnriched, setChequesEnriched] = useState<
    ChequesEnriched[] | null
  >(null);
  const [bancos, setBancos] = useState<BancosProps[] | null>(null);

  const [defaultsWithPuertas, setDefaultsWithPuertas] = useState<
    DefaultWithPuertas[] | null
  >(null);
  const [documentosPedidos, setDocumentosPedidos] = useState<
    DocumentosBD[] | null
  >(null);
  const [documentosCtasCtes, setDocumentosCtasCtes] = useState<
    DocumentosCtasCtesBD[] | null
  >(null);
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
  const getPedidos = async () => {
    const resPedidos = await pedidosAPI.read();
    if (!resPedidos.success) {
      logDetailedError(resPedidos.error);
      const formattedError = getFormattedError(resPedidos.error);
      showError(formattedError);
      throw new Error(formattedError);
    }
    const resClientes = await getClientes();
    const resPersonal = await getPersonal();
    const pedidosConCliente = (resPedidos.data as PedidosBD[]).map((pedido) => {
      const cliente = resClientes.find((c) => c.id === pedido.cliente_id);
      const armador = resPersonal.find((a) => a.id === pedido.armador_id);
      if (!cliente) {
        throw new Error("Cliente no encontrado.");
      }
      return {
        ...pedido,
        cliente: cliente,
        armador_nombre: armador ? `${armador.nombre} ${armador.apellido}` : "-",
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
    idPedido: string,
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
      idPedido,
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
      idPedido,
    );
    // Documentos del pedido
    let dataDocumentosPedidos: DocumentosBD[] | null = documentosPedidos;
    if (!documentosPedidos) {
      dataDocumentosPedidos = await getDocumentosPedidos();
    }
    const documentosPedido = await getDocumentosByPedidoId(
      dataDocumentosPedidos,
      idPedido,
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
      documentos: documentosPedido || null,
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
    carroceriaPedido: CarroceriaUI | null,
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
    idPedido: string,
  ) => {
    if (!dataCamiones) throw new Error("No se pudieron cargar los camiones.");
    return dataCamiones.find((c) => c.pedido_id === idPedido) || null;
  };
  const getTabajosChasisByPedidoId = async (
    dataTrabajosChasis: TrabajoChasisUI[] | null,
    idPedido: string,
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
  const getDocumentosByPedidoId = async (
    dataDocumentos: DocumentosBD[] | null,
    idPedido: string,
  ) => {
    if (!dataDocumentos)
      throw new Error("No se pudieron cargar los documentos del pedido.");
    return dataDocumentos.filter((doc) => doc.pedido_id === idPedido) || [];
  };
  const refreshPedidoByIdAndTable = async (table: Tables) => {
    if (!pedido) return;
    const idPedido = pedido.id;
    switch (table) {
      case "pedidos":
        const dataPedidos = await getPedidos();
        const dataPedido = dataPedidos.find((p) => p.id === idPedido);
        if (!dataPedido) throw new Error("Pedido no encontrado.");
        setPedido({
          ...pedido,
          ...dataPedido,
        });
        break; 
      case "carroceria":
        const dataCarrocerias = await getCarrocerias();
        const carroceriaPedido = await getCarroceriaPedido(
          dataCarrocerias,
          idPedido,
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
          idPedido,
        );
        setPedido({
          ...pedido,
          trabajo_chasis: trabajosChasisPedido || null,
        });
        break;
      case "documentos":
        const dataDocumentos = await getDocumentosPedidos();
        const documentosPedido = await getDocumentosByPedidoId(
          dataDocumentos,
          idPedido,
        );
        setPedido({
          ...pedido,
          documentos: documentosPedido || null,
        });
        break;
    }
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
  const getDefaults = async () => {
    return await getCompleteData({
      api: defaultAPI,
      setData: setDefaults,
    });
  };
  const getControlCarrozado = async () => {
    return await getCompleteData({
      api: controlCarrozadoAPI,
      setData: setControlCarrozado,
    });
  };
  const getCtrlCarrozadoByCarrozadoId = async (id: string) => {
    let datConfigItems: ConfigItemsControlBD[] | null = configItemsControl;
    if (!configItemsControl) {
      datConfigItems = await getConfigItemsControl();
    }
    let dataControlCarrozado: ControlCarrozadoDB[] | null = controlCarrozado;
    if (!controlCarrozado) {
      dataControlCarrozado = await getControlCarrozado();
    }
    const filteredControlCarrozado = dataControlCarrozado
      ?.filter((control) => control.carrozado_id === id)
      .map((control) => {
        const configItem = datConfigItems?.find(
          (item) => item.id === control.item_control_id,
        );
        if (configItem) {
          control.item_control_nombre = configItem.nombre;
          control.atributo_relacionado = configItem.atributo_relacionado;
        }
        return control;
      });
    setctrlCarrozadoByCarrozadoId(filteredControlCarrozado || null);
    return filteredControlCarrozado || [];
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
        (orden) => orden.pedido_id === pedidoId,
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
        (orden) => orden.pedido_id === pedidoId,
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
    refresh?: boolean,
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
        (control) => control.pedido_id === pedidoId,
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
        (control) => control.pedido_id === pedidoId,
      );
      if (!existeingControles || existeingControles.length === 0) {
        setControlesByPedido(null);
        return [];
      }
      setControlesByPedido(existeingControles);
      return existeingControles;
    }
  };
  /* Cuentas Corrientes */
  const getMvtos = async () => {
    return await getCompleteData({
      api: mvtosAPI,
      setData: setMvtos,
    });
  };
  const getChequesEnriched = async (opts?: { refresh?: boolean }) => {
    const refresh = opts?.refresh || false;
    let dataCheques: ChequesDB[] | null = cheques;
    let bancosData: BancosProps[] | null = bancos;
    let proveedoresData: ProveedoresBD[] | null = proveedores;

    if (!dataCheques || refresh) {
      dataCheques = await getCheques();
    }
    if (!bancosData) {
      bancosData = await getBancos();
    }
    if (!proveedoresData) {
      proveedoresData = await getProveedores();
    }
    const dataChequesEnriched: ChequesEnriched[] = (dataCheques || []).map(
      (cheque) => {
        const nombre_banco =
          bancosData?.find((banco) => banco.value === cheque.banco)?.label ||
          "";
        const proveedor =
          proveedoresData?.find((p) => p.id === cheque.proveedor_id) || null;
        return {
          ...cheque,
          nombre_banco,
          proveedor: proveedor || undefined,
        };
      },
    );
    setChequesEnriched(dataChequesEnriched);
    return dataChequesEnriched;
  };
  const getMvtosWithCheques = async ({
    refMvto,
    refCheque,
    refDocu,
  }: RefreshOptionsCtaCte): Promise<MvtosWithCheques[]> => {
    let dataMvtosWithCheques: MvtosDB[] | null = mvtos;
    let dataChequesEnriched: ChequesEnriched[] | null = chequesEnriched;
    let dataDocumentos: DocumentosCtasCtesBD[] | null = documentosCtasCtes;
    if (!dataMvtosWithCheques || refMvto) {
      dataMvtosWithCheques = await getMvtos();
    }
    if (!dataChequesEnriched || refCheque) {
      dataChequesEnriched = await getChequesEnriched({ refresh: refCheque });
    }
    if (!dataDocumentos || refDocu) {
      dataDocumentos = await getDocumentosCtasCtes();
    }
    const mvtosConCheques = (dataMvtosWithCheques || []).map((mvto) => {
      const chequesMvto = (dataChequesEnriched || []).filter(
        (cheque) => cheque.cta_cte_id === mvto.id,
      );
      const documentosMvto = (dataDocumentos || []).filter(
        (doc) => doc.cta_cte_id === mvto.id,
      );
      return {
        ...mvto,
        cheques: chequesMvto,
        documentos: documentosMvto,
      };
    });
    setMvtosWithCheques(mvtosConCheques);
    return mvtosConCheques;
  };
  const getCheques = async () => {
    return await getCompleteData({
      api: chequesAPI,
      setData: setCheques,
    });
  };

  const getCtasCtes = async (opt?: RefreshOptionsCtaCte) => {
    const { refMvto = false, refCheque = false, refDocu = false } = opt || {};
    let dataMvtosWithCheques: MvtosWithCheques[] | null = mvtosWithCheques;
    let datClientes: ClientesBD[] | null = clientes;

    if (!dataMvtosWithCheques || refMvto) {
      dataMvtosWithCheques = await getMvtosWithCheques({
        refMvto,
        refCheque,
        refDocu,
      });
    }
    if (!datClientes) {
      datClientes = await getClientes();
    }
    // Agrupar por cliente_id sumando debe y haber, y calculando saldo = debe - haber
    const grouped = (dataMvtosWithCheques || []).reduce(
      (acc, cta) => {
        const key = cta.cliente_id;
        if (!acc[key]) {
          acc[key] = { debe: 0, haber: 0 };
        }
        acc[key].debe += Number(cta.debe) || 0;
        acc[key].haber += Number(cta.haber) || 0;
        return acc;
      },
      {} as Record<string, { debe: number; haber: number }>,
    );

    const ctaCtesGroupedByClientes: CtaCte[] = Object.entries(grouped).map(
      ([clienteId, sums]) => {
        const cliente = (datClientes || []).find((c) => c.id === clienteId);
        if (!cliente)
          throw new Error(
            "Cliente no encontrado para la cuenta corriente con cliente_id: ",
          );
        const mvtosCliente = (dataMvtosWithCheques || []).filter(
          (m) => m.cliente_id === clienteId,
        );
        const debe = sums.debe;
        const haber = sums.haber;
        const saldo = debe - haber;

        // Construir objeto resumido. Rellenamos campos requeridos con valores por defecto cuando no aplican.
        const resumen: CtaCte = {
          debe,
          haber,
          saldo,
          movimientos: mvtosCliente,
          ...cliente,
        };
        return resumen as CtaCte;
      },
    );

    setCtasCtes(ctaCtesGroupedByClientes);
    return true;
  };
  const refreshCtasCtes = async ({
    refMvto,
    refCheque,
    refDocu,
  }: RefreshOptionsCtaCte) => {
    // Siempre requiere argumentos explícitos
    const resfresh = await getCtasCtes({ refMvto, refCheque, refDocu });
    return resfresh;
  };
  const fetchBancos = async () => {
    try {
      const data = await fetch("/bancos.json").then((res) => res.json());
      return data;
    } catch (error) {
      console.error("Error fetching bancos:", error);
      return [];
    }
  };
  const getBancos = async () => {
    if (!bancos) {
      const data = await fetchBancos();
      setBancos(data);
      return data;
    }
    return bancos;
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
  const uploadFilesToCtasCtes = async (
    ctaCteId: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => {
    try {
      let dataloaded: DocumentosCtasCtesBD[] | null = [];
      if (!files || files.length === 0) {
        return {
          success: false,
          message: "No se seleccionaron archivos para subir.",
        };
      }
      await Promise.all(
        Array.from(files).map(async (file) => {
          const uploaderFile = await updateFilePDFCtaCte(file);
          if (!uploaderFile) {
            throw new Error("Error al subir el archivo PDF");
          }
          const { url, nombre } = uploaderFile;
          if (!url) {
            throw new Error("Error al subir el archivo PDF");
          }
          const documentoData = {
            cta_cte_id: ctaCteId,
            tipo_documento: tipoDocumento,
            url: url,
            nombre: nombre,
          };
          const response = await documentosCtasCtesAPI.create(documentoData);
          if (!response.success) {
            throw new Error(
              response.message || "Error desconocido al crear el documento",
            );
          }
          dataloaded.push(response.data as DocumentosCtasCtesBD);
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
  const deleteDocumentoCtasCtes = async (
    documentos: DocumentosCtasCtesBD[],
  ) => {
    try {
      let dataDeletes: DocumentosCtasCtesBD[] | null = [];
      if (!documentos || documentos.length === 0) {
        return {
          success: false,
          message: "No se seleccionaron documentos para eliminar.",
        };
      }
      await Promise.all(
        documentos.map(async (documento) => {
          const response = await documentosCtasCtesAPI.delete(documento.id);
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
  const getDocumentosPedidos = async () => {
    return await getCompleteData({
      api: documentosPedidosAPI,
      setData: setDocumentosPedidos,
    });
  };
  const getDocumentosCtasCtes = async () => {
    return await getCompleteData({
      api: documentosCtasCtesAPI,
      setData: setDocumentosCtasCtes,
    });
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
        pedidos,
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
        getControlCarrozado,
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
        getControlesByPedidoId,
        controlesByPedido,
        refreshPedidoByIdAndTable,
        getCtrlCarrozadoByCarrozadoId,
        ctrlCarrozadoByCarrozadoId,
        getCtasCtes,
        refreshCtasCtes,
        ctasCtes,
        mvtos,
        cheques,
        getCheques,

        getBancos,
        bancos,
        getProveedores,
        proveedores,
        setProveedor,
        deleteProveedorById,
        proveedor,
        getMvtos,
        getDefaultsWithPuertas,
        defaultsWithPuertas,
        uploadFilesToPedidos,
        uploadFilesToCtasCtes,
        deleteDocumentoPedido,
        deleteDocumentoCtasCtes,
        ctaCte,
        setCtaCte,
        getChequesEnriched,
        chequesEnriched,
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
