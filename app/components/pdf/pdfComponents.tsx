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
import type { OrdenesBD, PedidosUI } from "~/types/pedidos";

interface OrdenFabricacionProps {
  pedidoData?: PedidosUI;
  formData: Partial<OrdenesBD>;
}

export const styles = StyleSheet.create({
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
export const Subtitle = ({ children }: { children: React.ReactNode }) => (
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
export const Box = ({ children }: { children: React.ReactNode }) => (
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
export const Row = ({
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
export const Cell = ({
  title,
  value,
  isFirst,
  flex,
}: {
  title: string;
  value: string | number | boolean | undefined;
  isFirst?: boolean;
  flex?: string | number;
}) => (
  <Text
    style={{
      flex: flex ?? 1,
      padding: "4px 6px",
      borderLeft: isFirst ? "none" : "1px dashed #ccc",
    }}
  >
    <Text style={{ fontWeight: "bold", fontSize: 10 }}>{title}: </Text>
    {value || "-"}
  </Text>
);
export const TitleBox = ({ title }: { title: string }) => (
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
export const HeaderTemplate = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Image src="/logo.jpeg" style={{ width: 130 }} />
    </View>
  );
};
export const PageTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page size="A4" style={styles.page}>
      {children}
    </Page>
  );
};
export const FooterTemplate = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
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
  );
};
