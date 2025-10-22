import { SelectField } from "./SelectField";
import { useData } from "~/context/DataContext";
import { useEffect } from "react";
export default function ClienteField({
  value,
  onChange,
  required = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const { clientes, getClientes } = useData();
  useEffect(() => {
    if (!clientes) {
      getClientes();
    }
  }, []);
  return (
    <SelectField
      label="Cliente"
      value={value}
      onChange={onChange}
      required={required}
      options={
        clientes?.map((cliente) => ({
          id: cliente.id,
          label: `${cliente.razon_social} - [${cliente.cuit_cuil}]`,
        })) || []
      }
    />
  );
}
