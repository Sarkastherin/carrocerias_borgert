type CommonSettingsBD = {
  id: string;
  fecha_creacion: string;
  activo: boolean;
};
export type ColoresBD = {
  nombre: string;
  tipo: "esmalte" | "lona";
} & CommonSettingsBD;

export type CarrozadosBD = {
  nombre: string;
} & CommonSettingsBD;

export type ZocalosBD = {
  nombre: string;
} & CommonSettingsBD;

export type PuertasTraserasBD = {
  nombre: string;
} & CommonSettingsBD;
export type VendedoresBD = {
  nombre: string;
  apellido: string;
} & CommonSettingsBD;
export type ConfigTrabajosChasisBD = {
  nombre: string;
} & CommonSettingsBD;
