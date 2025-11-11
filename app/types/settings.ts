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
  imagen?: string;
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
export type ConfigItemsControlBD = {
  nombre: string;
  control: "carrozado";
} & CommonSettingsBD;
export type DefaultDB = {
  carrozado_id: string;
  atributo: string;
  valor: string;
  tipo: "fijo" | "seleccionable";
} & CommonSettingsBD;

export type ControlCarrozadoDB = {
  carrozado_id: string;
  item_control_id: string;
} & CommonSettingsBD;