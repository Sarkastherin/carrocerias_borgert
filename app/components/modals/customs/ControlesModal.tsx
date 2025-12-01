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
import ModalBase from "../ModalBase";
import type { OrdenesBD, PedidosUI, tipoControlOptions, tipoOrdenOptions } from "~/types/pedidos";
import { useOrdenGenerator } from "~/hooks/useOrdenGenerator";
import { Input, Textarea, Select } from "~/components/Inputs";
import { useData } from "~/context/DataContext";
import { Badge } from "~/components/Badge";
import PDFIcon from "~/components/icons/PDFIcon";
import { formatDateUStoES } from "~/utils/formatDate";

interface ControlesProps {
  onClose: () => void;
  tipoOrden: typeof tipoControlOptions[number]["value"];
  pedidoData?: PedidosUI;
  order?: OrdenesBD;
}

interface OrdenField {
  name: keyof OrdenesBD;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "number";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface OrdenConfig {
  title: string;
  icon: React.ComponentType;
  color: string;
  description: string;
  fields?: OrdenField[];
}

const ordenConfigs: Record<typeof tipoOrdenOptions[number]["value"], OrdenConfig> = {
  carrozado: {
    title: "Control de Carrozado",
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
        options: [], // Se llena dinámicamente con personal del sector
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
        name: "responsable",
        label: "Responsable asignado",
        type: "select",
        placeholder: "Nombre del responsable",
        options: [], // Se llena dinámicamente con personal del sector
      },
    ],
  },
  montaje: {
    title: "Colocación y trabajos en chasis",
    icon: ToolCase,
    color: "text-green-600",
    description:
      "Generar orden de trabajo para la colocación y ensamblaje de componentes de la carrocería.",
    fields: [
      {
        name: "responsable",
        label: "Responsable asignado",
        type: "select",
        placeholder: "Nombre del responsable",
        options: [], // Se llena dinámicamente con personal del sector
      },
    ],
  },
};

type ModalStep = "form" | "preview" | "saving" | "success" | "existing";

export default function ControlesModal({
  onClose,
  tipoOrden,
  pedidoData,
  order,
}: ControlesProps) {
  const [step, setStep] = useState<ModalStep>(order ? "existing" : "form");
  const [formData, setFormData] = useState<Partial<OrdenesBD>>({});
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderData, setOrderData] = useState<OrdenesBD | undefined>(
    order || undefined
  );
  // Hook para acceder al personal desde el contexto global
  const { personal, getPersonal, getOrdenesByPedidoId, getPedidos } = useData();

  // Hook para generación de PDF
  const {
    generateOrdenPDF,
    savePDFToDrive,
    createRegisterAndUpdatePedido,
    closeOrder,
    generateFileName,
    isGenerating,
    isSaving,
    error: generatorError,
  } = useOrdenGenerator();

  const config = ordenConfigs[tipoOrden];

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
      .filter(
        (p) => p.activo && p.sector.toLowerCase().includes(sector.toLowerCase())
      )
      .map((p) => `${p.nombre} ${p.apellido}`);
  };
  const HeaderOrder = () => {
    return (
      <>
        {pedidoData && (
          <GlassCard
            size="full"
            blur="md"
            opacity="low"
            padding="sm"
            className="border-l-4 border-l-yellow-500 !border-yellow-300/80 dark:!border-yellow-400/40"
          >
            <div className="flex flex-col gap-2 text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center gap-2">
                <FileBox className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium">
                  Pedido: {pedidoData.numero_pedido || pedidoData.id}
                </span>
                <span className="text-yellow-600 dark:text-yellow-400">•</span>
                <span>Fecha: {pedidoData.fecha_pedido}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium">
                  Cliente: {pedidoData.cliente_nombre}
                </span>
              </div>
              {pedidoData.carroceria && (
                <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                  Modelo: {pedidoData.carroceria.carrozado_nombre}
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </>
    );
  };

  // Obtener opciones de personal según el tipo de orden
  const getPersonalOptions = () => {
    switch (tipoOrden) {
      case "fabricacion":
        return getPersonalBySector("fabricacion");
      case "pintura":
        return getPersonalBySector("pintura");
      case "montaje":
        return getPersonalBySector("montaje");
      default:
        return [];
    }
  };

  const handleInputChange = (name: keyof OrdenesBD, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields?.forEach((field) => {
      const fieldValue = formData[field.name];
      if (
        field.required &&
        (!fieldValue ||
          (typeof fieldValue === "string" && fieldValue.trim() === ""))
      ) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateControl = async () => {
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
      const fileName = generateFileName(tipoOrden, pedidoData);
      const urlFile = await savePDFToDrive(pdfBlob, fileName, tipoOrden);
      // Crear registro en Google Sheets y actualizar pedido
      await createRegisterAndUpdatePedido(
        urlFile,
        pedidoData?.id || "",
        tipoOrden,
        formData.responsable,
        orderData
      );
      await getOrdenesByPedidoId(
        pedidoData?.id || "",
        true
      );
      setOrderData((prev) =>
        prev ? ({ ...prev, ...formData } as OrdenesBD) : prev
      );
      if(tipoOrden === "fabricacion"){
        await getPedidos();
      }
      setStep("success");
    } catch (error) {
      console.error("Error guardando orden:", error);
      setStep("preview");
    }
  };
  const handlesCloseOrder = async () => {
    if (!orderData?.id) return;
    try {
      setStep("saving");
      await closeOrder(orderData?.id, formData, tipoOrden, pedidoData?.id || "");
      await getOrdenesByPedidoId(pedidoData?.id || "", true);
      // actualizar orderData con los datos actualizados en formData
      setOrderData((prev) =>
        prev ? ({ ...prev, ...formData } as OrdenesBD) : prev
      );
      if(tipoOrden === "montaje" && formData.status === "completada"){
        await getPedidos();
      }
      setStep("existing");
    } catch (error) {}
  };

  const renderForm = () => (
    <div className="space-y-6">
      <HeaderOrder />
      {/* Formulario dinámico */}
      <div className="grid gap-4">
        {config.fields?.map((field) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "textarea" ? (
              <Textarea
                value={String(formData[field.name] || "")}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                error={errors[field.name]}
              />
            ) : field.type === "select" ? (
              <Select
                value={String(formData[field.name] || "")}
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
                    ))}
              </Select>
            ) : (
              <Input
                type={field.type}
                value={String(formData[field.name] || "")}
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
  const renderExisting = () => (
    <div className="space-y-6">
      {/* Información del pedido si existe */}
      <HeaderOrder />
      {/* Formulario dinámico */}
      <GlassCard
        size="full"
        blur="md"
        opacity="low"
        padding="md"
        className="border-l-4 border-l-green-500 !border-green-300/80 dark:!border-green-400/40"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Orden de trabajo ya creada
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Esta orden ya fue generada anteriormente
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Información de la orden */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Tipo de orden:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white capitalize">
                  {tipoOrden}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Estado:{" "}
                </span>
                <Badge variant={orderData?.fecha_ejecucion ? "dark" : "green"}>
                  {orderData?.fecha_ejecucion ? "Cerrada" : "Activa"}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Fecha de finalización:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white capitalize">
                  {formatDateUStoES(orderData?.fecha_ejecucion) ||
                    "No finalizada"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Responsable:
                </span>
                <span className="ml-2 text-gray-900 dark:text-white capitalize">
                  {orderData?.responsable || "No asignado"}
                </span>
              </div>
            </div>
          </div>

          {/* Opciones disponibles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {orderData?.url_archivo && (
              <Button
                variant="blue"
                onClick={() => window.open(orderData.url_archivo, "_blank")}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <PDFIcon size={16} />
                Ver orden completa
              </Button>
            )}

            <Button
              variant="warning"
              onClick={() => {
                // Lógica para regenerar la orden
                setStep("form");
              }}
              disabled={!!orderData?.fecha_ejecucion}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <FileBox className="w-4 h-4" />
              Regenerar orden
            </Button>
          </div>

          {/* Sección para cerrar orden */}
          {orderData && !orderData.fecha_ejecucion && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cerrar orden de trabajo
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Fecha de finalización
                    </label>
                    <Input
                      type="date"
                      value={String(formData.fecha_ejecucion || "")}
                      onChange={(e) =>
                        handleInputChange("fecha_ejecucion", e.target.value)
                      }
                      placeholder="Fecha de cierre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Estado final
                    </label>
                    <Select
                      value={String(formData.status || "")}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="completada">Completada ✅</option>
                      <option value="cancelada">Cancelada 🚫</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Observaciones finales
                  </label>
                  <Textarea
                    value={String(formData.notas || "")}
                    onChange={(e) => handleInputChange("notas", e.target.value)}
                    placeholder="Notas sobre la finalización del trabajo..."
                    rows={2}
                  />
                </div>

                <Button
                  variant="red"
                  onClick={handlesCloseOrder}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!formData.fecha_ejecucion || !formData.status}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Cerrar orden de trabajo
                </Button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
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
            style={{ border: "none", borderRadius: "8px" }}
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
          onClick={() => setStep("preview")}
          className="w-full"
        >
          Ver Orden
        </Button>
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "form":
        return renderForm();
      case "existing":
        return renderExisting();
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
          label: `Generar Orden`,
          handleOnClick: handleGenerateControl,
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
