import React from "react";
import { View } from "@react-pdf/renderer";
import type { OrdenesBD, PedidosUI } from "~/types/pedidos";
import {
  Subtitle,
  Box,
  Row,
  Cell,
  MultiPageTemplate,
  TitleBox,
} from "./pdfComponents";
import type { ControlCarrozadoDB } from "~/types/settings";
import { atributosConMetadata } from "~/config/atributosMetadata";

interface ComtrolCarrozadojeProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
  responsable?: string;
  itemsControl?: ControlCarrozadoDB[];
}
export const ControlCarrozadoTemplate: React.FC<ComtrolCarrozadojeProps> = ({
  pedidoData,
  formData,
  responsable,
  itemsControl,
}) => {
  return (
    <MultiPageTemplate title="Control de calidad: Carrozado">
      <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                value={pedidoData?.cliente.razon_social}
                isFirst
              />
              <Cell title="Responsable" value={responsable} />
            </Row>
          </Box>
        </View>
        <View>
          <Subtitle>Datos del Carrozado</Subtitle>
          <Box>
            <Row>
              <Cell
                title="Modelo"
                value={
                  pedidoData?.carroceria?.carrozado_nombre?.toLocaleUpperCase() ||
                  ""
                }
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
            <Row>
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
          {/* Header */}
          <Box>
            <View
              fixed
              style={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Cell title="Ítems" value="" isFirst />
              <Cell title="Descripción" value="" flex={7} />
              <Cell value="" flex={0.2} isFirst />
              <Cell title="OK" value="" />
              <Cell title="NC" value="" />
              <Cell title="Reparó" value="" />
            </View>

            {itemsControl && itemsControl.length > 0 ? (
              itemsControl.map((item, index) => {
                const valueAtributo =
                  pedidoData?.carroceria?.[
                    item.atributo_relacionado as keyof typeof pedidoData.carroceria
                  ] ||
                  pedidoData?.camion?.[
                    item.atributo_relacionado as keyof typeof pedidoData.camion
                  ];
                const unit = atributosConMetadata.find(
                  (atr) => atr.value === item.atributo_relacionado
                )?.unit;
                return (
                  <Row key={item.id} isLast={index === itemsControl.length - 1}>
                    <Cell title={String(index + 1)} value="" isFirst />
                    {item.atributo_relacionado ? (
                      <>
                        <Cell value={item.item_control_nombre} flex={5.2} />
                        <Cell
                          value={String(valueAtributo).toUpperCase()}
                          flex={2}
                          unit={unit}
                          bold
                          isFirst
                        />
                      </>
                    ) : (
                      <>
                        <Cell value={item.item_control_nombre} flex={7} />
                        <Cell value="" flex={0.2} isFirst />
                      </>
                    )}

                    <Cell value="" />
                    <Cell value="" />
                    <Cell value="" />
                  </Row>
                );
              })
            ) : (
              <View>No hay ítems de control disponibles.</View>
            )}
          </Box>
        </View>
        <View>
          <Box>
            <TitleBox title="Observaciones" />
            <Row>
              <Cell
                title="Cuchetín"
                value={pedidoData?.carroceria?.notas_cuchetin}
                isFirst
              />
            </Row>
            <Row>
              <Cell title="Color" value={pedidoData?.carroceria?.notas_color} />
            </Row>
            <Row isLast>
              <Cell
                title="Generales"
                value={pedidoData?.carroceria?.observaciones}
              />
            </Row>
          </Box>
        </View>
        <View>
          <Subtitle>Notas de control</Subtitle>
          <View
            style={{
              fontSize: 10,
              fontFamily: "Helvetica",
              border: "1px solid #ccc",
              borderRadius: 4,
              height: 70,
            }}
          ></View>
        </View>
      </View>
    </MultiPageTemplate>
  );
};
