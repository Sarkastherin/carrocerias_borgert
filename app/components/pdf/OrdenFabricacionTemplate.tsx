import React from "react";
import { Document, View } from "@react-pdf/renderer";
import type { OrdenesBD, PedidosUI } from "~/types/pedidos";
import {
  Subtitle,
  Box,
  Row,
  Cell,
  TitleBox,
  PageTemplate,
  HeaderTemplate,
  FooterTemplate
} from "./pdfComponents";

interface OrdenFabricacionProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
}
export const OrdenFabricacionTemplate: React.FC<OrdenFabricacionProps> = ({
  pedidoData,
  formData,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Orden de Fabricación" />
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
              <Row>
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
                  value={pedidoData?.carroceria?.alt_baranda + " mm"}
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
                  title="Líneas de refuerzo"
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
              <Row isLast>
                <Cell
                  title="Observaciones generales"
                  value={pedidoData?.carroceria?.observaciones}
                  isFirst
                />
              </Row>
            </Box>
          </View>
        </View>
      </View>
      {/* Footer */}
      <FooterTemplate />
    </PageTemplate>
  </Document>
);
