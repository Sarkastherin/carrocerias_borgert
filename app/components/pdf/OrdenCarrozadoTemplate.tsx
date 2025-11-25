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
  FooterTemplate,
} from "./pdfComponents";

interface OrdenMontajeProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
}
export const OrdenCarrozadoTemplate: React.FC<OrdenMontajeProps> = ({
  pedidoData,
  formData,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Control de calidad: Carrozado" />
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
                title="Fecha de Control"
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
              <Cell
                title="Operario de carrozado"
                value={formData?.responsable}
              />
            </Row>
          </Box>
        </View>
        <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Subtitle>Datos del Carrozado</Subtitle>
          <Box>
            <Row>
              <Cell
                title="Modelo"
                value={pedidoData?.carroceria?.carrozado_nombre.toLocaleUpperCase()}
                isFirst
              />
              <Cell
                title="Ancho"
                value={pedidoData?.carroceria?.ancho_ext + " mm"}
              />
            </Row>
            <Row>
              <Cell
                title="Color carrozado"
                value={pedidoData?.carroceria?.color_carrozado_nombre}
                isFirst
              />
              <Cell
                title="Color zócalo"
                value={pedidoData?.carroceria?.color_zocalo_nombre}
              />
            </Row>
            <Row >
              <Cell
                title="Puerta trasera"
                value={pedidoData?.carroceria?.puerta_trasera_nombre}
                isFirst
              />
            </Row>
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
          
        </View>
        <View>
          <Subtitle>Ítems de control</Subtitle>
          
        </View>
        <Subtitle>Observaciones</Subtitle>
        <View
          style={{
            fontSize: 10,
            fontFamily: "Helvetica",
            border: "1px solid #ccc",
            borderRadius: 4,
            height: 90,
          }}
        ></View>
      </View>
      {/* Footer */}
      <FooterTemplate />
    </PageTemplate>
  </Document>
);
