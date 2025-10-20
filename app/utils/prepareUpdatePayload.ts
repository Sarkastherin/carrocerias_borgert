export type DirtyMap<T> = Partial<Record<keyof T, boolean>>;

type Props<T extends { id: number | string }> = {
  dirtyFields: DirtyMap<T>;
  formData: T;
};

export const prepareUpdatePayload = <T extends { id: number | string }>({
  dirtyFields,
  formData,
}: Props<T>) => {
  const updatePayload = Object.entries(dirtyFields).reduce(
    (acc, [key, isDirty]) => {
      if (isDirty) {
        acc[key as keyof T] = formData[key as keyof T];
      }
      return acc;
    },
    {} as Partial<T>
  );
  return updatePayload;
};
