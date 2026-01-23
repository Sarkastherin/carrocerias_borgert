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
import { DatosPedido, DatosCamion } from "./DatosComunesTemplate";

interface OrdenMontajeProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
  responsable: string;
}
export const OrdenMontajeTemplate: React.FC<OrdenMontajeProps> = ({
  pedidoData,
  formData,
  responsable,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Datos de Colocación" />
      <View>
        <DatosPedido pedidoData={pedidoData} formData={formData} title_responsable="Montajista" responsable={responsable} />
        <DatosCamion pedidoData={pedidoData}  convertToCM />
        <View>
          <Subtitle>Accesorios</Subtitle>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Box>
              <Row>
                <Cell
                  title="Cajón de herramientas"
                  value={
                    (pedidoData?.carroceria?.med_cajon_herramientas?? 0) > 0
                      ? "Sí"
                      : "No"
                  }
                  isFirst
                  
                />
                <Cell
                  title="Medida"
                  value={pedidoData?.carroceria?.med_cajon_herramientas}
                  unit="mm"
                  convertToCM
                />
                <Cell
                  title="Ubicación"
                  value={pedidoData?.carroceria?.ubicacion_cajon_herramientas}
                />
              </Row>
              <Row>
                <Cell
                  title="Arcos"
                  value={
                    (pedidoData?.carroceria?.arcos_por_puerta ?? 0) > 0
                      ? "Sí"
                      : "No"
                  }
                  isFirst
                />
                <Cell
                  title="Arcos por puerta"
                  value={pedidoData?.carroceria?.arcos_por_puerta}
                />
                <Cell
                  title="Tipos de arcos"
                  value={pedidoData?.carroceria?.tipos_arcos.toUpperCase()}
                />
              </Row>
              <Row>
                <Cell
                  title="Boquillas"
                  value={
                    (pedidoData?.carroceria?.boquillas ?? 0) > 0 ? "Sí" : "No"
                  }
                  isFirst
                />
                <Cell
                  title="Cantidad"
                  value={pedidoData?.carroceria?.boquillas}
                />
                <Cell
                  title="Tipo"
                  value={pedidoData?.carroceria?.tipo_boquillas}
                />
                <Cell
                  title="Ubicación"
                  value={pedidoData?.carroceria?.ubicacion_boquillas}
                  flex={1.565}
                />
              </Row>
              <Row>
                <Cell
                  title="Alargues baranda a cumbrera"
                  value={
                    pedidoData?.carroceria?.alargue_tipo_1 ===
                    "baranda a cumbrera"
                      ? "Sí"
                      : "No"
                  }
                  isFirst
                  flex={2}
                />
                <Cell
                  title="Cantidad"
                  value={pedidoData?.carroceria?.cant_alargue_1}
                />
                <Cell
                  title="Medida"
                  value={pedidoData?.carroceria?.med_alargue_1}
                  unit="mm"
                  convertToCM
                />
                <Cell
                  title="Tipo"
                  value={
                    pedidoData?.carroceria?.alargue_tipo_1 ===
                    "baranda a cumbrera"
                      ? pedidoData?.carroceria?.quiebre_alargue_1
                        ? "Con quiebre"
                        : "Común"
                      : "N/A"
                  }
                />
              </Row>
              <Row>
                <Cell
                  title="Alargues sobre cumbrera"
                  value={
                    pedidoData?.carroceria?.alargue_tipo_2 ===
                    "sobre cumbrera"
                      ? "Sí"
                      : "No"
                  }
                  isFirst
                  flex={2}
                />
                <Cell
                  title="Cantidad"
                  value={pedidoData?.carroceria?.cant_alargue_2}
                />
                <Cell
                  title="Medida"
                  value={pedidoData?.carroceria?.med_alargue_2}
                  unit="mm"
                  convertToCM
                />
                <Cell
                  title="Tipo"
                  value={
                    pedidoData?.carroceria?.alargue_tipo_2 ===
                    "sobre cumbrera"
                      ? pedidoData?.carroceria?.quiebre_alargue_2
                        ? "Con quiebre"
                        : "Común"
                      : "N/A"
                  }
                />
              </Row>
              <Row>
                <Cell
                  title="Depósito de agua"
                  value={pedidoData?.carroceria?.dep_agua}
                  isFirst
                />
                <Cell
                  title="Ubicación"
                  value={pedidoData?.carroceria?.ubicacion_dep_agua}
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Cintas reflectivas"
                  value={pedidoData?.carroceria?.cintas_reflectivas.toUpperCase()}
                  isFirst
                />
                <Cell
                  title="Cantidad Luces"
                  value={pedidoData?.carroceria?.luces}
                />
              </Row>
            </Box>
            {pedidoData?.trabajo_chasis &&
              pedidoData.trabajo_chasis.length > 0 && (
                <Box>
                  <TitleBox title="Trabajos en Chasis" />
                  {pedidoData?.trabajo_chasis.map((trabajo, index) => (
                    <Row
                      isLast={index === pedidoData.trabajo_chasis.length - 1}
                      key={trabajo.id}
                    >
                      <Cell
                        title={`# ${index + 1}`}
                        value={trabajo.tipo_trabajo_nombre}
                        isFirst
                      />
                      <Cell title="Detalle" value={trabajo.descripcion} />
                    </Row>
                  ))}
                </Box>
              )}
          </View>
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
