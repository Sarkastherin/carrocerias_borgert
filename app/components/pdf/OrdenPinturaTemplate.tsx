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
import { DatosPedido, DatosCamion, DatosColor } from "./DatosComunesTemplate";

interface OrdenPinturaProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
  responsable: string;
}
export const OrdenPinturaTemplate: React.FC<OrdenPinturaProps> = ({
  pedidoData,
  formData,
  responsable,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Orden de Pintura" />
      <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <DatosPedido pedidoData={pedidoData} formData={formData} title_responsable="Pintor" responsable={responsable} />
        <DatosCamion pedidoData={pedidoData} />
        <View>
          <Subtitle>Detalles del color y acabado</Subtitle>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DatosColor pedidoData={pedidoData} />
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
