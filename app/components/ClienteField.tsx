import { useData } from "~/context/DataContext";
import { useEffect } from "react";
import { SelectFieldCustom } from "./Inputs";
import type { ClientesBD } from "~/types/clientes";
export default function ClienteField({
  value,
  onChange,
  required = false,
}: {
  value?: string;
  onChange: (selectItem: ClientesBD) => void;
  required?: boolean;
}) {
  const { clientes, getClientes } = useData();
  useEffect(() => {
    if (!clientes) {
      getClientes();
    }
  }, []);
  return (
    <SelectFieldCustom
      label="Cliente"
      requiredField={required}
      disabled={!clientes}
      placeholderMainInput="Seleccione un cliente"
      data={clientes || []}
      keyOfData="razon_social"
      initialValue={value}
      onChange={(selectItem) => onChange(selectItem)}
      />
  );
}
