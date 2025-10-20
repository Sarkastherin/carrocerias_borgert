import GoogleSheet from "google-sheet-package";
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
}) => {
  const apiEndpoint = new GoogleSheet({ sheetId, rowHead, nameSheet, nameFile });
  return {
    create: async (dataForm: Omit<T, "id">) => {
      try {
        const newId = crypto.randomUUID();
        const response = await apiEndpoint.insert({
          data: { id: newId, ...dataForm },
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error,
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            id: newId,
            ...dataForm,
            ...(response.data?.insertedData || {}),
          },
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          status: 500,
        };
      }
    },
    read: async (options?: {
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
    }) => {
      try {
        const response = await apiEndpoint.getData(options);

        if (!response.success) {
          return {
            success: false,
            error: response.error,
            status: response.status,
          };
        }

        return {
          success: true,
          data: response.data,
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          status: 500,
        };
      }
    },
    update: async (id: string, dataForm: Partial<Omit<T, "id">>) => {
      try {
        const response = await apiEndpoint.update({
          colName: "id",
          id,
          values: dataForm,
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error,
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            id,
            ...dataForm,
            updatedFields:
              response.data?.updatedFields || Object.keys(dataForm),
            rowsUpdated: response.data?.rowsUpdated || 1,
            cellsUpdated:
              response.data?.cellsUpdated || Object.keys(dataForm).length,
          },
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          status: 500,
        };
      }
    },
    delete: async (id: string) => {
      try {
        const response = await apiEndpoint.delete({
          colName: "id",
          id,
        });

        if (!response.success) {
          return {
            success: false,
            error: response.error,
            status: response.status,
          };
        }

        return {
          success: true,
          data: {
            deletedRecord: response.data?.deletedRecord || { id },
            clearedRange: response.data?.clearedRange,
            rowDeleted: response.data?.rowDeleted,
          },
          message: response.message,
          status: response.status,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
          status: 500,
        };
      }
    },
  };
};
