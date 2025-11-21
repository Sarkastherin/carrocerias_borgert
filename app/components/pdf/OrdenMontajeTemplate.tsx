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
export const OrdenMontajeTemplate: React.FC<OrdenMontajeProps> = ({
  pedidoData,
  formData,
}) => (
  <Document>
    <PageTemplate>
      <HeaderTemplate title="Orden de Montaje" />
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
          <Subtitle>Accesorios</Subtitle>
          <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Box>
              <TitleBox title="Accesorios" />
              <Row>
                <Cell
                  title="Medida de cajón de herramientas"
                  value={pedidoData?.carroceria?.med_cajon_herramientas + " mm"}
                  isFirst
                />
                <Cell
                  title="Depósito de agua"
                  value={pedidoData?.carroceria?.dep_agua ? "Sí" : "No"}
                />
              </Row>
              <Row>
                <Cell
                  title="Arcos por puerta"
                  value={pedidoData?.carroceria?.arcos_por_puerta}
                  isFirst
                />
                <Cell
                  title="Cantidad Boquillas"
                  value={pedidoData?.carroceria?.boquillas}
                />
                <Cell
                  title="Cantidad Luces"
                  value={pedidoData?.carroceria?.luces}
                />
              </Row>
              <Row isLast>
                <Cell
                  title="Cintas reflectivas"
                  value={pedidoData?.carroceria?.cintas_reflectivas}
                  isFirst
                />
                <Cell
                  title="Alargue"
                  value={pedidoData?.carroceria?.med_alargue + " mm"}
                />
                <Cell
                  title="Quiebre de alargue"
                  value={pedidoData?.carroceria?.quiebre_alargue ? "Sí" : "No"}
                />
              </Row>
            </Box>
            {pedidoData?.trabajo_chasis && pedidoData.trabajo_chasis.length > 0 && (
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
