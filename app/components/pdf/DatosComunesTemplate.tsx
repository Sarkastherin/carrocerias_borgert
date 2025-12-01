import { View } from "@react-pdf/renderer";
import type { OrdenesBD, PedidosUI } from "~/types/pedidos";
import { Subtitle, Box, Row, Cell, TitleBox } from "./pdfComponents";

export const DatosPedido = ({
  pedidoData,
  formData,
}: {
  pedidoData?: PedidosUI;
  formData?: Partial<OrdenesBD>;
}) => (
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
        <Cell title="Cliente" value={pedidoData?.cliente_nombre} isFirst />
        <Cell title="Armador" value={formData?.responsable} />
      </Row>
    </Box>
  </View>
);
export const DatosCamion = ({ pedidoData, convertToCM }: { pedidoData?: PedidosUI; convertToCM?: boolean }) => (
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
        <Cell
          title="Tipo de larguero"
          value={pedidoData?.camion?.tipo_larguero?.toLocaleUpperCase()}
        />
      </Row>
      <Row isLast>
        <Cell
          title="Medida Larguero"
          value={pedidoData?.camion?.med_larguero}
          unit="mm"
          convertToCM={convertToCM}
          isFirst
        />
        <Cell
          title="Centro Eje"
          value={pedidoData?.camion?.centro_eje}
          convertToCM={convertToCM}
          unit="mm"
        />
        <Cell
          title="Voladizo Trasero"
          value={pedidoData?.camion?.voladizo_trasero}
          convertToCM={convertToCM}
          unit="mm"
        />
      </Row>
    </Box>
  </View>
);
export const DatosColor = ({ pedidoData }: { pedidoData?: PedidosUI }) => (
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
      <Cell title="Lona" value={pedidoData?.carroceria?.color_lona_nombre} />
    </Row>
    <Row isLast>
      <Cell
        title="Observaciones"
        value={pedidoData?.carroceria?.notas_color}
        isFirst
      />
    </Row>
  </Box>
);
