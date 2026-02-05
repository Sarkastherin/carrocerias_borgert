import { useEffect } from "react";
import { Select } from "../components/Inputs";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import type { AddChequeFormProps } from "./forms/AddChequeForm";
import type { ChequesDB, ChequesWithTerceros } from "~/types/ctas_corrientes";
import { useData } from "~/context/DataContext";
export  function BancosComponentArray({
  register,
  errors,
  watch,
  index,
}: {
  register: UseFormRegister<AddChequeFormProps>;
  errors: FieldErrors<AddChequeFormProps>;
  watch: UseFormWatch<AddChequeFormProps>;
  index: number;
}) {
  const { bancos, getBancos } = useData();

  useEffect(() => {
    if (!bancos) getBancos();
  }, []);
  return (
    <>
      {bancos && (
        <Select
          label="Banco"
          {...register(`cheques.${index}.banco`, {
            required: {
              value: watch(`cheques.${index}.tipo`) === "fisico",
              message: "El banco es obligatorio",
            },
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
      )}
    </>
  );
}
export  function BancosComponent({
  register,
  errors,
  watch,
}: {
  register: UseFormRegister<ChequesWithTerceros>;
  errors: FieldErrors<ChequesWithTerceros>;
  watch: UseFormWatch<ChequesWithTerceros>;
}) {
  const { bancos, getBancos } = useData();

  useEffect(() => {
    if (!bancos) getBancos();
  }, [bancos, getBancos]);

  return (
    <>
      {bancos && (
        <Select
          label="Banco"
          {...register(`banco`, {
            required: {
              value: watch(`tipo`) === "fisico",
              message: "El banco es obligatorio",
            },
          })}
          error={errors.banco?.message}
          requiredField={watch(`tipo`) === "fisico"}
        >
          <option value="">Seleccione un banco</option>
          {bancos?.map((banco) => (
            <option key={banco.value} value={banco.value}>
              {banco.label}
            </option>
          ))}
        </Select>
      )}
    </>
  );
}
