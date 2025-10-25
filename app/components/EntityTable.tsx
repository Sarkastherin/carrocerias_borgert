import React, { useState, useEffect, type JSX } from "react";
import DataTable, {
  createTheme,
  type TableColumn,
} from "react-data-table-component";
import { Input, Select } from "./Inputs";
import { Button } from "./Buttons";
import { useUI } from "~/context/UIContext";
import { useLocation } from "react-router";
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
type FilterField = {
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
}: EntityTableProps<T>) {
  const { theme } = useUI();
  const location = useLocation();
  const storageKey = `entityTableFilters_${location.pathname}`;
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    // Recupera filtros guardados
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [showFilterInfo, setShowFilterInfo] = useState(false);
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
    if (auto) onFilter(updated);
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
  return (
    <>
      {showFilterInfo && (
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
                      type="date"
                      value={filters[`${key}_from`] ?? ""}
                      onChange={(e) =>
                        handleChange(`${key}_from`, e.target.value, autoFilter)
                      }
                    />
                    <span className="text-sm">a</span>
                    <Input
                      type="date"
                      value={filters[`${key}_to`] ?? ""}
                      onChange={(e) =>
                        handleChange(`${key}_to`, e.target.value, autoFilter)
                      }
                    />
                  </div>
                ) : type === "select" ? (
                  <Select
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
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        theme={theme}
        pagination
        paginationPerPage={30}
        onRowClicked={onRowClick}
        pointerOnHover
        highlightOnHover
        paginationComponentOptions={options}
        noDataComponent={noDataComponent || <div className="py-6 text-text-secondary">No se encontraron registros</div>}
      />
    </>
  );
}
