import { useEffect } from "react";
import { Select } from "../components/Inputs";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  Path,
} from "react-hook-form";
import type { AddChequeFormProps } from "./forms/AddChequeForm";
import type { ChequesDB, ChequesWithTerceros } from "~/types/ctas_corrientes";
import { useData } from "~/context/DataContext";
export  function BancosComponentArray<T extends { cheques: ChequesDB[] }>({
  register,
  errors,
  watch,
  index,
}: {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  watch: UseFormWatch<T>;
  index: number;
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
          {...register(`cheques.${index}.banco` as Path<T>, {
            required: {
              value: watch(`cheques.${index}.tipo` as Path<T>) === "fisico",
              message: "El banco es obligatorio",
            },
          })}
          error={Array.isArray(errors.cheques) ? errors.cheques[index]?.banco?.message : undefined}
          requiredField={watch(`cheques.${index}.tipo` as Path<T>) === "fisico"}
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
