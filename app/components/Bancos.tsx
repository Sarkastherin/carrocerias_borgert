import { useEffect, useState } from "react";
import { Select } from "../components/Inputs";
import type { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import type { AddChequeFormProps } from "./forms/AddChequeForm";
export default function BancosComponent({
  register,
  errors,
  watch,
  index
}: {
  register: UseFormRegister<AddChequeFormProps>;
  errors: FieldErrors<AddChequeFormProps>;
  watch: UseFormWatch<AddChequeFormProps>;
  index: number;
}) {
  const [bancos, setBancos] = useState<Array<{
    value: string;
    label: string;
  }> | null>(null);
  useEffect(() => {
    if (!bancos) fetchBancos();
  }, []);
  const fetchBancos = async () => {
    try {
      const data = await fetch("/bancos.json").then((res) => res.json());
      setBancos(data);
      return data;
    } catch (error) {
      console.error("Error fetching bancos:", error);
      return [];
    }
  };
  return (
    <Select
      label="Banco"
      {...register(`cheques.${index}.banco`, {
        required: {value: watch(`cheques.${index}.tipo`) === "fisico", message: "El banco es obligatorio"},
      })}
      error={errors.cheques?.[index]?.banco?.message}
      requiredField={watch(`cheques.${index}.tipo`) === "fisico"}
    >
      <option value="">Seleccione un banco</option>
      {bancos?.map((banco) => (
        <option key={banco.value} value={banco.value}>
          {banco.label}
        </option>
      ))}
    </Select>
  );
}
