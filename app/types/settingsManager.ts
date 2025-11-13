// Types for the reusable settings manager functionality

export interface SettingsItem {
  id: string;
  nombre: string;
  activo: boolean;
  [key: string]: any;
}

export interface SettingsConfig {
  title: string;
  icon: React.ReactNode;
  data: SettingsItem[];
  api: any;
  columns: any[];
  formFields: any[];
  filterFields?: any[];
}

export interface ValidationResult {
  inUse: boolean;
  count: number;
}

export interface CRUDHandlers {
  handleCreate: (data: any) => Promise<{ success: boolean; error?: string }>;
  handleUpdate: (id: string, data: any) => Promise<{ success: boolean; error?: string }>;
  handleDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export interface FormHandlerParams {
  form: any;
  mode: "create" | "edit";
  api: any;
  data?: any;
  configTitle: string;
}

export interface UseSettingsManagerProps {
  settingsConfigs: SettingsConfig[];
  dataLoaders: Record<string, () => Promise<any>>;
  apiMap: Record<string, any>;
  validationMap?: Record<string, {
    uniqueNameValidation?: boolean;
    usageValidation?: {
      apis: Array<{
        api: any;
        columnNames: string[];
      }>;
    };
  }>;
  defaultTab?: string;
}

export interface UseSettingsManagerReturn {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  itemsConfiguraciones: SettingsConfig[] | null;
  handleOpenForm: (params: FormHandlerParams) => void;
  handleOnRowClick: (row: any) => void;
  handleDelete: (row: any) => Promise<void>;
  reloadData: (configTitle: string) => Promise<void>;
}

export interface UseConfigValidatorProps {
  validationRules: Record<string, {
    uniqueNameValidation?: boolean;
    usageValidation?: {
      apis: Array<{
        api: any;
        columnNames: string[];
      }>;
    };
  }>;
  currentData: Record<string, SettingsItem[]>;
}