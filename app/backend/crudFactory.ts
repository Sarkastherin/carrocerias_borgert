import GoogleSheet from "google-sheet-package";

// Tipos base reutilizables
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | object;
  status: number;
};

export type UpdateData = {
  id: string;
  updatedFields: string[];
  rowsUpdated: number;
  cellsUpdated: number;
};

export type DeleteData = {
  deletedRecord: { id: string };
  clearedRange?: string;
  rowDeleted?: number;
};

export type ReadOptions = {
  columnName?: string;
  value?: any;
  operator?:
    | "="
    | "=="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "contains"
    | "startsWith"
    | "endsWith";
  multiple?: boolean;
};

export type CRUDMethods<T> = {
  create: (dataForm: Omit<T, "id">) => Promise<ApiResponse<T>>;
  read: (options?: ReadOptions) => Promise<ApiResponse<T | T[]>>;
  update: (id: string, dataForm: Partial<Omit<T, "id">>) => Promise<ApiResponse<UpdateData>>;
  delete: (id: string) => Promise<ApiResponse<DeleteData>>;
};
export const createCrud = <T extends { id: string }>({
  sheetId,
  rowHead = 1,
  nameSheet,
  nameFile,
}: {
  sheetId: string;
  rowHead?: number;
  nameSheet: string;
  nameFile: string;
}): CRUDMethods<T> => {
  const apiEndpoint = new GoogleSheet({
    sheetId,
    rowHead,
    nameSheet,
    nameFile,
  });

  const handleError = (error: unknown): ApiResponse => ({
    success: false,
    error: error instanceof Error ? error.message : "Unknown error occurred",
    status: 500,
  });

  return {
    create: async (dataForm: Omit<T, "id">): Promise<ApiResponse<T>> => {
      try {
        const newId = crypto.randomUUID();
        const response = await apiEndpoint.insert({
          data: { id: newId, ...dataForm },
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error || "Unknown error",
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            id: newId,
            ...dataForm,
            ...(response.data?.insertedData || {}),
          } as T,
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return handleError(error);
      }
    },

    read: async (options?: ReadOptions): Promise<ApiResponse<T | T[]>> => {
      try {
        const response = await apiEndpoint.getData(options);
        if (!response.success) {
          return {
            success: false,
            error: response.error || "Unknown error",
            status: response.status,
          };
        }

        return {
          success: true,
          data: response.data as T | T[],
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return handleError(error);
      }
    },

    update: async (id: string, dataForm: Partial<Omit<T, "id">>): Promise<ApiResponse<UpdateData>> => {
      try {
        const response = await apiEndpoint.update({
          colName: "id",
          id,
          values: dataForm,
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error || "Unknown error",
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            id,
            updatedFields: response.data?.updatedFields || Object.keys(dataForm),
            rowsUpdated: response.data?.rowsUpdated || 1,
            cellsUpdated: response.data?.cellsUpdated || Object.keys(dataForm).length,
          },
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return handleError(error);
      }
    },

    delete: async (id: string): Promise<ApiResponse<DeleteData>> => {
      try {
        const response = await apiEndpoint.delete({
          colName: "id",
          id,
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error || "Unknown error",
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            deletedRecord: (response.data?.deletedRecord as { id: string }) || { id },
            clearedRange: response.data?.clearedRange,
            rowDeleted: response.data?.rowDeleted,
          },
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return handleError(error);
      }
    },
  };
};
