import React, { useState, useEffect, type JSX } from "react";
import DataTable, {
  createTheme,
  type TableColumn,
} from "react-data-table-component";
import { Input, Select } from "./Inputs";
import { Button } from "./Buttons";
import { useUI } from "~/context/UIContext";
import { useLocation } from "react-router";
import { useUIModals } from "~/context/ModalsContext";
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}
export const customStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "15px",
    },
  },
  cells: {
    style: {
      fontSize: "14px",
    },
  },
  rows: {
    style: {
      // Estilos base para las filas
    },
  },
};
createTheme("dark", {
  background: {
    default: "transparent",
  },
});
createTheme("light", {
  background: {
    default: "transparent",
  },
});
export type FilterField = {
  key: string;
  label: string;
  type?: "text" | "select" | "dateRange";
  options?: React.ReactNode;
  autoFilter?: boolean;
};

type EntityTableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  filterFields?: FilterField[];
  onRowClick?: (row: T) => void;
  onFilteredChange?: (filtered: T[]) => void;
  noDataComponent?: JSX.Element;
  inactiveField?: string; // Campo para identificar elementos inactivos (ej: "activo")
  alternativeStorageKey?: string; // Clave alternativa para almacenamiento local
  disableRowClick?: boolean; // Deshabilita el click en filas y el cursor pointer
};
const options = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
};
export function EntityTable<T>({
  data,
  columns,
  filterFields = [],
  onRowClick,
  onFilteredChange,
  noDataComponent,
  inactiveField,
  alternativeStorageKey,
  disableRowClick = false,
}: EntityTableProps<T>) {
  const { theme } = useUI();
  const location = useLocation();
  const { openModal, showConfirmation } = useUIModals();
  const storageKey =
    alternativeStorageKey || `entityTableFilters_${location.pathname}`;

  // Función para crear un componente de estado con colores
  const StatusCell = ({
    row,
    originalSelector,
  }: {
    row: T;
    originalSelector: (row: T) => any;
  }) => {
    const status = originalSelector(row);
    const isActive = status === "Activo" || status === "Sí" || status === true;

    return (
      <span
        className={`font-medium text-xs px-2 py-1 rounded-full ${
          isActive
            ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
            : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
        }`}
      >
        {typeof status === "boolean"
          ? status
            ? "Activo"
            : "Inactivo"
          : status}
      </span>
    );
  };

  // Procesar columnas para aplicar formato especial a columnas de estado
  const processedColumns = columns.map((column) => {
    // Detectar si es una columna de estado por el nombre
    if (
      (column.name === "Activo" ||
        column.name === "Estado" ||
        column.name === "Status") &&
      column.selector
    ) {
      return {
        ...column,
        cell: (row: T) => (
          <StatusCell row={row} originalSelector={column.selector!} />
        ),
      };
    }
    return column;
  });

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    // Recupera filtros guardados
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [showFilterInfo, setShowFilterInfo] = useState(false);
  
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Recupera la página guardada
    const savedPage = localStorage.getItem(`${storageKey}_page`);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  // Función para determinar si una fila está inactiva
  const isRowInactive = (row: T): boolean => {
    if (!inactiveField) return false;
    const value = getNestedValue(row, inactiveField);
    // Si el campo es booleano, verificamos que sea false
    // Si es string, verificamos valores como "No", "Inactivo", etc.
    return (
      value === false ||
      value === "No" ||
      value === "Inactivo" ||
      value === "no" ||
      value === "false"
    );
  };

  // Función para obtener estilos condicionales de fila
  const getInactiveRowStyles = () => {
    return {
      opacity: "0.6",
      backgroundColor:
        theme === "dark"
          ? "rgba(107, 114, 128, 0.1)"
          : "rgba(156, 163, 175, 0.1)",
      borderLeft:
        theme === "dark"
          ? "3px solid rgb(107, 114, 128)"
          : "3px solid rgb(156, 163, 175)",
    };
  };
  function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const onFilter = (newFilters: Record<string, string>) => {
    const result = data.filter((item) =>
      filterFields.every(({ key, type }) => {
        if (type === "dateRange") {
          const from = newFilters[`${key}_from`];
          const to = newFilters[`${key}_to`];
          const itemValue = getNestedValue(item, key);

          if (!itemValue) return false;

          const itemDate = new Date(itemValue).getTime();
          const fromDate = from ? new Date(from).getTime() : null;
          const toDate = to ? new Date(to).getTime() : null;

          return (
            (!fromDate || itemDate >= fromDate) &&
            (!toDate || itemDate <= toDate)
          );
        } else {
          const value = removeAccents(newFilters[key]?.toLowerCase() ?? "");
          const itemValue = removeAccents(
            String(getNestedValue(item, key) ?? "").toLowerCase()
          );
          return itemValue.includes(value);
        }
      })
    );
    setFilteredData(result);
    setShowFilterInfo(Object.values(newFilters).some((v) => v));
    if (onFilteredChange) onFilteredChange(result);
  };

  const handleChange = (key: string, value: string, auto?: boolean) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated)); // Guarda filtros
    
    // Resetear a la primera página cuando se aplican filtros
    setCurrentPage(1);
    localStorage.setItem(`${storageKey}_page`, "1");
    
    if (auto) onFilter(updated);
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem(`${storageKey}_page`, page.toString());
  };
  useEffect(() => {
    setFilteredData(data);
    setShowFilterInfo(Object.values(filters).some((v) => v));
    if (onFilteredChange) onFilteredChange(data);
  }, [data]);
  // ...existing code...
  useEffect(() => {
    // Aplica filtros guardados al montar si existen
    if (Object.values(filters).some((v) => v)) {
      onFilter(filters);
    } else {
      setFilteredData(data);
      if (onFilteredChange) onFilteredChange(data);
    }
    setShowFilterInfo(Object.values(filters).some((v) => v));
  }, [data]); // Ejecuta cuando cambia la data
  // ...existing code...
  useEffect(() => {
    const isFilter = Object.values(filters).some((v) => v);
    if(isFilter) {
      showConfirmation(
        "Hay filtros aplicados desde tu última visita. ¿Deseas limpiar los filtros?", 
        () => {
          setFilters({});
          setFilteredData(data);
          localStorage.removeItem(storageKey);
          localStorage.removeItem(`${storageKey}_page`);
          setShowFilterInfo(false);
        }, {
        title: "Filtros Aplicados",
        confirmText: "Limpiar Filtros",
        cancelText: "Mantener Filtros",
        }
      );
      // Opción de limpiar filtros
    }
    
  },[]);
  return (
    <>
      {showFilterInfo && filterFields.length > 0 && (
        <div className="mb-2 text-blue font-semibold text-sm">
          ℹ️ Filtros aplicados.
        </div>
      )}
      {filterFields.length > 0 && (
        <form
          className="flex gap-2 items-baseline md:flex-row flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            onFilter(filters);
          }}
        >
          {filterFields.map(
            ({ key, label, type = "text", options, autoFilter }) => (
              <div key={key} className="w-full">
                {type === "dateRange" ? (
                  <div className="flex gap-2 items-center">
                    <Input
                    label="Desde"
                      type="date"
                      value={filters[`${key}_from`] ?? ""}
                      onChange={(e) =>
                        handleChange(`${key}_from`, e.target.value, autoFilter)
                      }
                    />
                    <span className="text-sm">a</span>
                    <Input
                      type="date"
                      label="Hasta"
                      value={filters[`${key}_to`] ?? ""}
                      onChange={(e) =>
                        handleChange(`${key}_to`, e.target.value, autoFilter)
                      }
                    />
                  </div>
                ) : type === "select" ? (
                  <Select
                  label={label}
                    value={filters[key] ?? ""}
                    onChange={(e) =>
                      handleChange(key, e.target.value, autoFilter)
                    }
                  >
                    {options}
                  </Select>
                ) : (
                  <Input
                    type="search"
                    placeholder={label}
                    label={label}
                    value={filters[key] ?? ""}
                    onChange={(e) =>
                      handleChange(key, e.target.value, autoFilter)
                    }
                  />
                )}
              </div>
            )
          )}
          {!filterFields.every((f) => f.autoFilter) && (
            <div className="w-fit">
              <Button variant="yellow" type="submit">
                Filtrar
              </Button>
            </div>
          )}
        </form>
      )}
      <DataTable
        columns={processedColumns}
        data={filteredData}
        customStyles={customStyles}
        theme={theme}
        pagination
        paginationPerPage={30}
        paginationDefaultPage={currentPage}
        onChangePage={handlePageChange}
        onRowClicked={!disableRowClick ? onRowClick : undefined}
        pointerOnHover={!disableRowClick}
        highlightOnHover
        paginationComponentOptions={options}
        noDataComponent={
          noDataComponent || (
            <div className="py-6 text-text-secondary">
              No se encontraron registros
            </div>
          )
        }
        conditionalRowStyles={
          inactiveField
            ? [
                {
                  when: (row: T) => isRowInactive(row),
                  style: getInactiveRowStyles(),
                },
              ]
            : undefined
        }
        //defaultSortAsc={true}
      />
    </>
  );
}
