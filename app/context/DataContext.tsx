import { createContext, useContext, useState, useMemo } from "react";
import {
  clientesAPI,
  pedidosAPI,
  carrozadoAPI,
  personalAPI,
  configTrabajoChasisAPI,
  itemsControlAPI,
  defaultAPI,
  controlCarrozadoAPI,
  ordenesyControlesAPI,
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
  OrdenesYControlesBD,
  ControlesBD,
  CarroceriaBD,
  TrabajoChasisUI,
  CamionBD,
  TipoDocumento,
  DocumentosBD,
  DocumentosCtasCtesBD,
} from "~/types/pedidos";
import type {
  CarrozadosBD,
  PersonalBD,
  ConfigTrabajosChasisBD,
  ItemsControlBD,
  DefaultDB,
  ControlPorCarrozadoDB,
  DefaultWithPuertas,
} from "~/types/settings";
import type { CRUDMethods } from "~/backend/crudFactory";
import type {
  MvtosDB,
  ChequesDB,
  CtaCte,
  BancosProps,
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
  /* CTAS CTES */
  ctasCtes: CtaCte[] | null;
  mvtos: MvtosDB[] | null;
  getMvtos: () => Promise<MvtosDB[]>;
  cheques: ChequesDB[] | null;
  getCheques: () => Promise<ChequesDB[]>;
  getBancos: () => Promise<BancosProps[]>;
  bancos: BancosProps[] | null;
  uploadFilesToCtasCtes: (
    ctaCteId: string,
    files: FileList,
    tipoDocumento: TipoDocumento,
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: DocumentosCtasCtesBD[];
  }>;

  deleteDocumentoCtasCtes: (documentos: DocumentosCtasCtesBD[]) => Promise<{
    success: boolean;
    message?: string;
    data?: DocumentosCtasCtesBD[];
  }>;
  ctaCte: CtaCte | null;
  setCtaCte: React.Dispatch<React.SetStateAction<CtaCte | null>>;
  getChequesEnriched: () => Promise<ChequesEnriched[]>;
  chequesEnriched: ChequesEnriched[] | null;
  getCtasCtes: (opt?: RefreshOptionsCtaCte) => Promise<boolean>;
  refreshCtasCtes: (opt: RefreshOptionsCtaCte) => Promise<boolean>;
};
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const [clientes, setClientes] = useState<ClientesBD[] | null>(null);
  const [cliente, setCliente] = useState<ClientesBD | null>(null);
  const [proveedores, setProveedores] = useState<ProveedoresBD[] | null>(null);
  const [proveedor, setProveedor] = useState<ProveedoresBD | null>(null);
  const [personal, setPersonal] = useState<PersonalBD[] | null>(null);
  const [mvtos, setMvtos] = useState<MvtosDB[] | null>(null);
  const [mvtosWithCheques, setMvtosWithCheques] = useState<
    MvtosWithCheques[] | null
  >(null);
  const [ctasCtes, setCtasCtes] = useState<CtaCte[] | null>(null);
  const [ctaCte, setCtaCte] = useState<CtaCte | null>(null);
  const [cheques, setCheques] = useState<ChequesDB[] | null>(null);
  const [chequesEnriched, setChequesEnriched] = useState<
    ChequesEnriched[] | null
  >(null);
  const [bancos, setBancos] = useState<BancosProps[] | null>(null);

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
  const getPersonal = async () => {
    return await getCompleteData({
      api: personalAPI,
      setData: setPersonal,
    });
  };
  const deleteClienteById = async (id: string) => {
    try {
      // 1. Verificar si el cliente tiene pedidos asociados
      console.log("DataContext - deleted");
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
        getPersonal,
        personal,
        deleteClienteById,
        checkCuitExists,
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
        uploadFilesToCtasCtes,
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
      personal: context.personal?.filter((v) => v.activo) || null,
    };
  }, [context, onlyActive]);

  return filteredData;
};
