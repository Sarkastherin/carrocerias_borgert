import React, { useState, useEffect } from "react";
import {
  Hammer,
  BrushCleaning,
  ToolCase,
  FileBox,
  User,
  AlertTriangle,
} from "lucide-react";
import { Button } from "~/components/Buttons";
import { GlassCard } from "~/components/GlassCard";
import { getIcon } from "~/components/IconComponent";
import ModalBase from "../ModalBase";
import type { PedidosUI } from "~/types/pedidos";
import { useOrdenGenerator } from "~/hooks/useOrdenGenerator";
import { Input, Textarea, Select } from "~/components/Inputs";
import { useData } from "~/context/DataContext";
export type TipoOrden = "fabricacion" | "pintura" | "chasis";

interface OrdenTrabajoModalProps {
  onClose: () => void;
  tipoOrden: TipoOrden;
  pedidoData?: PedidosUI;
}

interface OrdenConfig {
  title: string;
  icon: React.ComponentType;
  color: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "textarea" | "select" | "date" | "number";
    options?: string[];
    required?: boolean;
    placeholder?: string;
  }>;
}

const ordenConfigs: Record<TipoOrden, OrdenConfig> = {
  fabricacion: {
    title: "Fabricación de Carrocerías",
    icon: Hammer,
    color: "text-blue-600",
    description:
      "Generar orden de trabajo para la fabricación de la carrocería según las especificaciones del pedido.",
    fields: [
      {
        name: "responsable",
        label: "Responsable asignado",
        type: "select",
        placeholder: "Nombre del responsable",
        options: [] // Se llena dinámicamente con personal del sector
      },
      {
        name: "observaciones",
        label: "Observaciones especiales",
        type: "textarea",
        placeholder: "Notas adicionales...",
      },
    ],
  },
  pintura: {
    title: "Pintura y Acabados",
    icon: BrushCleaning,
    color: "text-purple-600",
    description:
      "Generar orden de trabajo para la pintura y acabados de componentes de la carrocería.",
    fields: [
      {
        name: "colores",
        label: "Colores específicos",
        type: "text",
        required: true,
        placeholder: "Códigos de color o descripción",
      },
      {
        name: "tipoPintura",
        label: "Tipo de pintura",
        type: "select",
        options: [
          "Esmalte sintético",
          "Poliuretano",
          "Acrílica",
          "Anticorrosiva",
        ],
        required: true,
      },
      {
        name: "capas",
        label: "Número de capas",
        type: "number",
        required: true,
        placeholder: "2",
      },
      {
        name: "tiempoSecado",
        label: "Tiempo de secado (horas)",
        type: "number",
        placeholder: "24",
      },
      {
        name: "fechaLimite",
        label: "Fecha límite",
        type: "date",
        required: true,
      },
      {
        name: "prioridad",
        label: "Prioridad",
        type: "select",
        options: ["Baja", "Media", "Alta", "Urgente"],
        required: true,
      },
      {
        name: "responsable",
        label: "Responsable asignado",
        type: "select",
        placeholder: "Nombre del responsable",
        options: [] // Se llena dinámicamente con personal del sector
      },
      {
        name: "observaciones",
        label: "Observaciones especiales",
        type: "textarea",
        placeholder: "Preparación de superficie, condiciones ambientales...",
      },
    ],
  },
  chasis: {
    title: "Colocación y trabajos en chasis",
    icon: ToolCase,
    color: "text-green-600",
    description:
      "Generar orden de trabajo para la colocación y ensamblaje de componentes de la carrocería.",
    fields: [
      {
        name: "modificaciones",
        label: "Modificaciones requeridas",
        type: "textarea",
        required: true,
        placeholder: "Describe las modificaciones específicas...",
      },
      {
        name: "herramientas",
        label: "Herramientas específicas",
        type: "textarea",
        placeholder: "Lista de herramientas necesarias",
      },
      {
        name: "puntosAnclaje",
        label: "Puntos de anclaje",
        type: "text",
        placeholder: "Ubicaciones de anclaje",
      },
      {
        name: "verificaciones",
        label: "Verificaciones de seguridad",
        type: "textarea",
        required: true,
        placeholder: "Lista de verificaciones requeridas",
      },
      {
        name: "fechaLimite",
        label: "Fecha límite",
        type: "date",
        required: true,
      },
      {
        name: "prioridad",
        label: "Prioridad",
        type: "select",
        options: ["Baja", "Media", "Alta", "Urgente"],
        required: true,
      },
      {
        name: "responsable",
        label: "Responsable asignado",
        type: "select",
        placeholder: "Nombre del responsable",
        options: [] // Se llena dinámicamente con personal del sector
      },
      {
        name: "observaciones",
        label: "Observaciones especiales",
        type: "textarea",
        placeholder: "Notas adicionales de seguridad...",
      },
    ],
  },
};

type ModalStep = "form" | "preview" | "saving" | "success";

export default function OrdenTrabajoModal({
  onClose,
  tipoOrden,
  pedidoData,
}: OrdenTrabajoModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
console.log(pedidoData)
  // Hook para acceder al personal desde el contexto global
  const { personal, getPersonal } = useData();

  // Hook para generación de PDF
  const {
    generateOrdenPDF,
    savePDFToDrive,
    generateFileName,
    isGenerating,
    isSaving,
    error: generatorError,
  } = useOrdenGenerator();

  const config = ordenConfigs[tipoOrden];
  const IconComponent = getIcon({
    icon: config.icon as any,
    size: 6,
    color: "text-white",
  });

  // Cargar personal si no está cargado
  useEffect(() => {
    if (!personal) {
      getPersonal();
    }
  }, [personal, getPersonal]);

  // Limpiar URL del blob cuando cambie el PDF
  useEffect(() => {
    if (pdfBlob) {
      // Limpiar URL anterior si existe
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      // Crear nueva URL
      const newUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(newUrl);
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(newUrl);
      };
    } else {
      // Si no hay blob, limpiar URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }
  }, [pdfBlob]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);
  const getPersonalBySector = (sector: string) => {
    if (!personal) return [];
    return personal
      .filter(p => p.activo && p.sector.toLowerCase().includes(sector.toLowerCase()))
      .map(p => `${p.nombre} ${p.apellido}`);
  };

  // Obtener opciones de personal según el tipo de orden
  const getPersonalOptions = () => {
    switch (tipoOrden) {
      case "fabricacion":
        return getPersonalBySector("fabricacion");
      case "pintura":
        return getPersonalBySector("pintura");
      case "chasis":
        return getPersonalBySector("chasis");
      default:
        return [];
    }
  };

/*   // Inicializar datos del pedido si existe
  useEffect(() => {
    if (pedidoData) {
      // Solo inicializar campos específicos según el tipo de orden si es necesario
      const initialData: Record<string, any> = {};
      
      // Pre-llenar algunos campos específicos basados en el pedido si es relevante
      if (tipoOrden === "pintura" && pedidoData.carroceria) {
        initialData.colores = `Carrozado: ${pedidoData.carroceria.color_carrozado_id || ""}, Zócalo: ${pedidoData.carroceria.color_zocalo_id || ""}, Lona: ${pedidoData.carroceria.color_lona_id || ""}`;
        if (pedidoData.carroceria.notas_color) {
          initialData.observaciones = pedidoData.carroceria.notas_color;
        }
      }
      
      if (tipoOrden === "chasis" && pedidoData.trabajo_chasis) {
        initialData.modificaciones = pedidoData.trabajo_chasis.map((t) => t.descripcion).join(", ");
      }
      
      setFormData(initialData);
    }
  }, [pedidoData, tipoOrden]); */

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.name] || formData[field.name].trim() === "")
      ) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateOrden = async () => {
    if (!validateForm()) return;

    try {
      setStep("preview");

      // Generar PDF usando el hook
      const pdfBlob = await generateOrdenPDF({
        tipoOrden,
        formData,
        pedidoData,
      });

      setPdfBlob(pdfBlob);
    } catch (error) {
      console.error("Error generando PDF:", error);
      setStep("form");
    }
  };

  const handleSaveOrden = async () => {
    if (!pdfBlob) return;

    try {
      setStep("saving");

      const fileName = generateFileName(tipoOrden, formData, pedidoData);
      await savePDFToDrive(pdfBlob, fileName);

      setStep("success");
    } catch (error) {
      console.error("Error guardando orden:", error);
      setStep("preview");
    }
  };

  const renderForm = () => (
    <div className="space-y-6">
      {/* Información del pedido si existe */}
      {pedidoData && (
        <GlassCard
          size="sm"
          blur="md"
          opacity="low"
          padding="sm"
          variant="blue"
          className="border-l-4 border-l-blue-500 !border-blue-300/80 dark:!border-blue-400/40"
        >
          <div className="flex flex-col gap-2 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <FileBox className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Pedido: {pedidoData.numero_pedido || pedidoData.id}</span>
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>Fecha: {pedidoData.fecha_pedido}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">Cliente: {pedidoData.cliente_nombre}</span>
            </div>
            {pedidoData.carroceria && (
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Modelo: {pedidoData.carroceria.carrozado_nombre}
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Formulario dinámico */}
      <div className="grid gap-4">
        {config.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "textarea" ? (
              <Textarea
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                error={errors[field.name]}
              />
            ) : field.type === "select" ? (
              <Select
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                error={errors[field.name]}
              >
                <option value="">Seleccionar...</option>
                {/* Si es el campo responsable, usar opciones dinámicas del personal */}
                {field.name === "responsable" 
                  ? getPersonalOptions().map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))
                  : field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))
                }
              </Select>
            ) : (
              <Input
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                error={errors[field.name]}
              />
            )}

            {errors[field.name] && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors[field.name]}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Vista previa de la orden
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Revisa la información antes de guardar
        </p>
      </div>

      {/* Vista del PDF generado */}
      {pdfBlob && pdfUrl && (
        <div className="w-full">
          <iframe
            src={pdfUrl}
            width="100%"
            height="700px"
            style={{ border: 'none', borderRadius: '8px' }}
            title="Vista previa de la orden de trabajo"
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="dark"
          onClick={() => setStep("form")}
          className="flex-1"
        >
          Volver a editar
        </Button>
        <Button variant="green" onClick={handleSaveOrden} className="flex-1">
          Guardar orden
        </Button>
      </div>
    </div>
  );

  const renderSaving = () => (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {isSaving ? "Guardando orden..." : "Generando orden..."}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {isSaving
          ? "Se está guardando la orden en Google Drive"
          : "Se está generando el PDF de la orden de trabajo"}
      </p>

      {generatorError && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{generatorError}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        ¡Orden guardada exitosamente!
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        La orden de trabajo se ha guardado en Google Drive
      </p>

      <div className="space-y-3">
        <Button variant="green" onClick={onClose} className="w-full">
          Finalizar
        </Button>
        <Button
          variant="outlinePrimary"
          onClick={() => setStep("form")}
          className="w-full"
        >
          Crear otra orden
        </Button>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "form":
        return renderForm();
      case "preview":
        return renderPreview();
      case "saving":
        return renderSaving();
      case "success":
        return renderSuccess();
      default:
        return renderForm();
    }
  };

  const getFooter = () => {
    if (step === "form") {
      return {
        btnPrimary: {
          label: "Generar orden",
          handleOnClick: handleGenerateOrden,
          variant: "blue" as const,
        },
        btnSecondary: {
          label: "Cancelar",
          handleOnClick: onClose,
          variant: "dark" as const,
        },
      };
    }
    return undefined;
  };

  return (
    <ModalBase
      title={step === "success" ? "✅ Orden completada" : config.title}
      open
      zIndex={100}
      onClose={onClose}
      footer={getFooter()}
      width="max-w-4xl"
    >
      {getStepContent()}
    </ModalBase>
  );
}
