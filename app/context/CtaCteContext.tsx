import { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  mvtosAPI,
  chequesAPI,
  documentosCtasCtesAPI,
} from "~/backend/sheetServices";
import type { ClientesBD } from "~/types/clientes";
import { useUIModals } from "./ModalsContext";
import { getFormattedError, logDetailedError } from "~/utils/errorMessage";
import type { TipoDocumento, DocumentosCtasCtesBD } from "~/types/pedidos";
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
import { updateFilePDFCtaCte } from "~/components/FileUpladerComponent";
import { useData } from "./DataContext";
type RefreshOptionsCtaCte = {
  refMvto?: boolean;
  refCheque?: boolean;
  refDocu?: boolean;
};
type CtacteContextType = {
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
  getCtasCtes: (opt?: RefreshOptionsCtaCte) => Promise<boolean>;
  getDocumentosCtasCtes: () => Promise<DocumentosCtasCtesBD[]>;
};
const CtacteContext = createContext<CtacteContextType | undefined>(undefined);

export const CtaCteProvider = ({ children }: { children: React.ReactNode }) => {
  const { showError } = useUIModals();
  const { clientes, getClientes, proveedores, getProveedores } = useData();
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
  /* Cuentas Corrientes */
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
  const getMvtos = async () => {
    return await getCompleteData({
      api: mvtosAPI,
      setData: setMvtos,
    });
  };
  const getCheques = async () => {
    return await getCompleteData({
      api: chequesAPI,
      setData: setCheques,
    });
  };
  const getDocumentosCtasCtes = async () => {
    return await getCompleteData({
      api: documentosCtasCtesAPI,
      setData: setDocumentosCtasCtes,
    });
  };
  const getChequesEnriched = async () => {
    let dataCheques: ChequesDB[] | null = cheques;
    let bancosData: BancosProps[] | null = bancos;
    let proveedoresData: ProveedoresBD[] | null = proveedores;

    if (!dataCheques) {
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
  useEffect(() => {
    getChequesEnriched();
  }, [cheques, bancos, proveedores]);
  const getMvtosWithCheques = async (): Promise<MvtosWithCheques[]> => {
    let dataMvtos: MvtosDB[] | null = mvtos;
    let dataChequesEnriched: ChequesEnriched[] | null = chequesEnriched;
    let dataDocumentos: DocumentosCtasCtesBD[] | null = documentosCtasCtes;
    if (!dataMvtos) {
      dataMvtos = await getMvtos();
    }
    if (!dataChequesEnriched) {
      dataChequesEnriched = await getChequesEnriched();
    }
    if (!dataDocumentos) {
      dataDocumentos = await getDocumentosCtasCtes();
    }
    const mvtosConCheques = (dataMvtos || []).map((mvto) => {
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
  useEffect(() => {
    getMvtosWithCheques();
  }, [mvtos, chequesEnriched, documentosCtasCtes]);
  const getCtasCtes = async () => {
    let dataMvtosWithCheques: MvtosWithCheques[] | null = mvtosWithCheques;
    let datClientes: ClientesBD[] | null = clientes;

    if (!dataMvtosWithCheques) {
      dataMvtosWithCheques = await getMvtosWithCheques();
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
  useEffect(() => {
    getCtasCtes();
  }, [mvtosWithCheques, clientes]);

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
    <CtacteContext.Provider
      value={{
        getCtasCtes,
        ctasCtes,
        mvtos,
        cheques,
        getCheques,
        getBancos,
        bancos,
        getMvtos,
        uploadFilesToCtasCtes,
        deleteDocumentoCtasCtes,
        ctaCte,
        setCtaCte,
        getChequesEnriched,
        getDocumentosCtasCtes,
      }}
    >
      {children}
    </CtacteContext.Provider>
  );
};

export const useCtaCte = (onlyActive: boolean = false) => {
  const context = useContext(CtacteContext);
  if (context === undefined) {
    throw new Error("useCtaCte must be used within a CtaCteProvider");
  }
  // Aplicar filtros usando useMemo para optimizar performance
  const filteredData = useMemo(() => {
    if (!onlyActive) {
      return context;
    }

    return context;
  }, [context, onlyActive]);

  return filteredData;
};
