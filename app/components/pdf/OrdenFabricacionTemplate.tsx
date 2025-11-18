import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Line,
} from "@react-pdf/renderer";
import type { PedidosUI } from "~/types/pedidos";
import { formatDateUStoES } from "~/utils/formatDate";

interface OrdenFabricacionProps {
  pedidoData?: PedidosUI;
  formData: Record<string, any>;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica", // Fuente base del documento
    color: "#434343",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Helvetica-Bold", // Título en negrita
    color: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #444",
    marginBottom: 20,
    paddingBottom: 5,
  },
  cell: {
    flex: 1,
    padding: "4px 6px",
  },
  codeText: {
    fontSize: 9,
    fontFamily: "Courier",
    backgroundColor: "#f5f5f5",
    padding: 4,
  },
  emphasis: {
    fontSize: 12,
    fontFamily: "Times-Italic",
    color: "#666",
  },
});
const Subtitle = ({ children }: { children: React.ReactNode }) => (
  <Text
    style={{
      fontSize: 12,
      fontFamily: "Helvetica",
      fontWeight: "bold",
      paddingBottom: 6,
      paddingTop: 12,
    }}
  >
    {children}
  </Text>
);
const Box = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      fontSize: 10,
      fontFamily: "Helvetica",
      lineHeight: 1.4,
      border: "1px solid #ccc",
      borderRadius: 4,
    }}
  >
    {children}
  </View>
);
const Row = ({
  children,
  isLast,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <View
    style={{
      borderBottom: isLast ? "none" : "1px dashed #ccc",
      display: "flex",
      flexDirection: "row",
    }}
  >
    {children}
  </View>
);
const Cell = ({
  title,
  value,
  isFirst,
}: {
  title: string;
  value: string | number | boolean | undefined;
  isFirst?: boolean;
}) => (
  <Text
    style={{
      flex: 1,
      padding: "4px 6px",
      borderLeft: isFirst ? "none" : "1px dashed #ccc",
    }}
  >
    <Text style={{ fontWeight: "bold" }}>{title}: </Text>
    {value || "N/A"}
  </Text>
);
const TitleBox = ({ title }: { title: string }) => (
  <Text
    style={{
      backgroundColor: "#f0f0f0",
      padding: 5,
      fontWeight: "bold",
      borderBottom: "1px solid #ccc",
    }}
  >
    {title}
  </Text>
);

export const OrdenFabricacionTemplate: React.FC<OrdenFabricacionProps> = ({
  pedidoData,
  formData,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Orden de Fabricación</Text>
        <Image src="/logo.jpeg" style={{ width: 130 }} />
      </View>
      <View>
        <View>
          <Subtitle>Datos del Pedido</Subtitle>
          <Box>
            <Row>
              <Cell
                title="Número de Pedido"
                value={pedidoData?.numero_pedido}
                isFirst
              />
              <Cell
                title="Fecha de Pedido"
                value={new Date().toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              />
            </Row>
            <Row isLast>
              <Cell
                title="Cliente"
                value={pedidoData?.cliente_nombre}
                isFirst
              />
              <Cell title="Armador" value={formData?.responsable} />
            </Row>
          </Box>
        </View>
        <View>
          <Subtitle>Datos del Camión</Subtitle>
          <Box>
            <Row>
              <Cell
                title="Marca"
                value={pedidoData?.camion?.marca.toLocaleUpperCase()}
                isFirst
              />
              <Cell title="Modelo" value={pedidoData?.camion?.modelo} />
            </Row>
            <Row isLast>
              <Cell
                title="Medida Larguero"
                value={pedidoData?.camion?.med_larguero + " mm"}
                isFirst
              />
              <Cell
                title="Centro Eje"
                value={pedidoData?.camion?.centro_eje + " mm"}
              />
            </Row>
          </Box>
        </View>
        <View>
          <Subtitle>Detalles de la Carrocería</Subtitle>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Box>
              <TitleBox title="Detalles generales" />
              <Row>
                <Cell
                  title="Tipo de Carrocería"
                  value={pedidoData?.carroceria?.carrozado_nombre}
                  isFirst
                />
              </Row>
              <Row>
                <Cell
                  title="Material"
                  value={pedidoData?.carroceria?.material}
                  isFirst
                />
                <Cell
                  title="Espesor"
                  value={pedidoData?.carroceria?.espesor_chapa + " mm"}
                />
              </Row>
              <Row>
                <Cell
                  title="Largo Int."
                  value={pedidoData?.carroceria?.largo_int + " mm"}
                  isFirst
                />
                <Cell
                  title="Largo Ext."
                  value={pedidoData?.carroceria?.largo_ext + " mm"}
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Alto"
                  value={pedidoData?.carroceria?.alto + " mm"}
                  isFirst
                />
                <Cell
                  title="Ancho Ext."
                  value={pedidoData?.carroceria?.ancho_ext + " mm"}
                />
              </Row>
            </Box>
            <Box>
              <TitleBox title="Estructura" />
              <Row>
                <Cell
                  title="Puerta Trasera"
                  value={pedidoData?.carroceria?.puerta_trasera_nombre}
                  isFirst
                />
              </Row>
              <Row>
                <Cell
                  title="Altura baranda"
                  value={pedidoData?.carroceria?.alt_baranda}
                  isFirst
                />
                <Cell
                  title="Puertas por lado"
                  value={pedidoData?.carroceria?.ptas_por_lado}
                />
                <Cell
                  title="Arcos por puerta"
                  value={pedidoData?.carroceria?.arcos_por_puerta}
                />
              </Row>
              <Row>
                <Cell
                  title="Corte en guardabarros"
                  value={
                    pedidoData?.carroceria?.corte_guardabarros ? "Sí" : "No"
                  }
                  isFirst
                />
                <Cell
                  title="Cumbreras"
                  value={pedidoData?.carroceria?.cumbreras ? "Sí" : "No"}
                />
                <Cell
                  title="Refuerzos laterales"
                  value={
                    pedidoData?.carroceria?.lineas_refuerzo === 0
                      ? "No"
                      : pedidoData?.carroceria?.lineas_refuerzo + " líneas"
                  }
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Tipo de Zócalo"
                  value={pedidoData?.carroceria?.tipo_zocalo
                    ?.toUpperCase()
                    .split("_")
                    .join(" ")}
                  isFirst
                />
                <Cell
                  title="Tipo de piso"
                  value={pedidoData?.carroceria?.tipo_piso?.toUpperCase()}
                />
              </Row>
            </Box>
            <Box>
              <TitleBox title="Cuchetín" />
              <Row isLast>
                <Cell
                  title="Con chuchetín"
                  value={pedidoData?.carroceria?.cuchetin ? "Sí" : "No"}
                  isFirst
                />
                <Cell
                  title="Medida"
                  value={
                    pedidoData?.carroceria?.med_cuchetin === 0
                      ? "N/A"
                      : pedidoData?.carroceria?.med_cuchetin + " mm"
                  }
                />
                <Cell
                  title="Alto puerta"
                  value={
                    pedidoData?.carroceria?.alt_pta_cuchetin === 0
                      ? "N/A"
                      : pedidoData?.carroceria?.alt_pta_cuchetin + " mm"
                  }
                />
                <Cell
                  title="Altura techo"
                  value={
                    pedidoData?.carroceria?.alt_techo_cuchetin === 0
                      ? "N/A"
                      : pedidoData?.carroceria?.alt_techo_cuchetin + " mm"
                  }
                />
              </Row>
            </Box>
            <Box>
              <TitleBox title="Colores" />
              <Row>
                <Cell
                  title="Carrozado"
                  value={pedidoData?.carroceria?.color_carrozado_nombre}
                  isFirst
                />
                <Cell
                  title="Zócalo"
                  value={pedidoData?.carroceria?.color_zocalo_nombre}
                />
                <Cell
                  title="Lona"
                  value={pedidoData?.carroceria?.color_lona_nombre}
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Observaciones de color"
                  value={pedidoData?.carroceria?.notas_color}
                  isFirst
                />
              </Row>
            </Box>
            <Box>
              <Row isLast>
                <Cell
                  title="Observaciones generales"
                  value={pedidoData?.carroceria?.observaciones}
                  isFirst
                />
              </Row>
            </Box>
            {/* <View style={{borderBottom: "1px solid #ccc", marginVertical: 2}}></View> */}
            <View
              style={{
                fontSize: 10,
                fontFamily: "Helvetica",
                border: "1px solid #ccc",
                borderRadius: 4,
                height: 60,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                <Text>Firma Responsable</Text>
                <Text>Fecha ejecución</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "8px",
                  fontWeight: "bold",
                }}
              >
                <Text>____________________</Text>
                <Text>_____/_____/_______</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
