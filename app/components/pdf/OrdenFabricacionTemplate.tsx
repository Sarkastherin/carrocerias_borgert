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

interface OrdenFabricacionProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
  responsable: string;
}
export const OrdenFabricacionTemplate: React.FC<OrdenFabricacionProps> = ({
  pedidoData,
  formData,
  responsable
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Pedido de Fabricación" />
      <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <DatosPedido pedidoData={pedidoData} title_responsable={"Armador"} responsable={responsable}/>
        <DatosCamion pedidoData={pedidoData} />
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
                  flex={4}
                />
                <Cell
                  title="Material"
                  value={pedidoData?.carroceria?.material}
                />
                <Cell
                  title="Espesor"
                  value={pedidoData?.carroceria?.espesor_chapa}
                  unit="mm"
                />
              </Row>
              <Row>
                <Cell
                  title="Largo Int."
                  value={pedidoData?.carroceria?.largo_int}
                  unit="mm"
                  isFirst
                />
                <Cell
                  title="Largo Ext."
                  value={pedidoData?.carroceria?.largo_ext}
                  unit="mm"
                />
                <Cell
                  title="Alto"
                  value={pedidoData?.carroceria?.alto}
                  unit="mm"
                />
                <Cell
                  title="Ancho Ext."
                  value={pedidoData?.carroceria?.ancho_ext}
                  unit="mm"
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
                  value={pedidoData?.carroceria?.alt_baranda}
                  unit="mm"
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
                  title="Tipos de arcos"
                  value={pedidoData?.carroceria?.tipos_arcos.toUpperCase()}
                  isFirst
                />
                <Cell
                  title="Corte en guardabarros"
                  value={pedidoData?.carroceria?.corte_guardabarros}
                />
                <Cell
                  title="Cumbreras"
                  value={pedidoData?.carroceria?.cumbreras}
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Líneas de refuerzo"
                  value={pedidoData?.carroceria?.lineas_refuerzo}
                  unit="líneas"
                  isFirst
                />
                <Cell
                  title="Tipo de Zócalo"
                  value={pedidoData?.carroceria?.tipo_zocalo
                    ?.toUpperCase()
                    .split("_")
                    .join(" ")}
                />
                <Cell
                  title="Tipo de piso"
                  value={pedidoData?.carroceria?.tipo_piso?.toUpperCase()}
                />
              </Row>
            </Box>
            <Box>
              <TitleBox title="Cuchetín" />
              <Row>
                <Cell
                  title="Con chuchetín"
                  value={pedidoData?.carroceria?.cuchetin}
                  isFirst
                />
                <Cell
                  title="Medida"
                  value={pedidoData?.carroceria?.med_cuchetin}
                  unit="mm"
                />
                <Cell
                  title="Alto puerta"
                  value={pedidoData?.carroceria?.alt_pta_cuchetin}
                  unit="mm"
                />
                <Cell
                  title="Altura techo"
                  value={pedidoData?.carroceria?.alt_techo_cuchetin}
                  unit="mm"
                />
              </Row>

              <Row isLast>
                <Cell
                  title="Observaciones"
                  value={pedidoData?.carroceria?.notas_cuchetin}
                  isFirst
                />
              </Row>
            </Box>
            <DatosColor pedidoData={pedidoData} />
            <Box>
              <TitleBox title="Observaciones Generales" />
              <Row isLast>
                <Cell value={pedidoData?.carroceria?.observaciones} isFirst />
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
