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

interface OrdenPinturaProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
}
export const OrdenPinturaTemplate: React.FC<OrdenPinturaProps> = ({
  pedidoData,
  formData,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Orden de Pintura" />
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
              <Cell title="Responsable" value={formData?.responsable} />
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
          <Subtitle>Detalles del color y acabado</Subtitle>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Box>
              <TitleBox title="Colores de Carrozado" />
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
              </Row>
              <Row isLast>
                <Cell
                  title="Lona"
                  value={pedidoData?.carroceria?.color_lona_nombre}
                />
              </Row>
            </Box>
            <Box>
              <Row isLast>
                <Cell
                  title="Observaciones generales"
                  value={pedidoData?.carroceria?.notas_color}
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
