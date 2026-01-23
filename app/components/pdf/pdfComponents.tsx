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
    marginBottom: 15,
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
      fontSize: 11,
      fontFamily: "Helvetica",
      fontWeight: "bold",
      paddingBottom: 8,
      paddingTop:0,
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
  unit,
  convertToCM,
  bold,
}: {
  title?: string;
  value: string | number | boolean | undefined | null;
  isFirst?: boolean;
  flex?: string | number;
  unit?: string;
  convertToCM?: boolean;
  bold?: boolean;
}) => {
  const getValue = () => {
    if (value === "0" || value === 0 || value === null || value === undefined)
      return "N/A";
    if (typeof value === "string") {
      if (unit) return `${value} ${unit}`;
      return value.toString();
    }
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "number") {
      if (convertToCM) {
        const valueInCM = value / 10;
        return `${valueInCM} cm`;
      }
      if (unit) return `${value} ${unit}`;
      return value.toString();
    }
  };
  const newValue = getValue();
  return (
    <Text
      style={{
        flex: flex ?? 1,
        padding: "3px",
        borderLeft: isFirst ? "none" : "1px dashed #ccc",
      }}
    >
      {title && (
        <Text style={{ fontWeight: "bold", fontSize: 9 }}>{title}: </Text>
      )}
      <Text style={{ fontSize: 9, fontWeight: bold ? "bold" : "normal" }}>
        {newValue}
      </Text>
    </Text>
  );
};
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
        bottom: 30,
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

// Componente para manejar múltiples páginas con header repetido
export const MultiPageTemplate = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View fixed>
          <HeaderTemplate title={title} />
        </View>
        <View>{children}</View>
        <FooterTemplate />
        <Text
          fixed
          style={{
            position: "absolute",
            bottom: 30,
            left: 30,
            right: 0,
            borderTop: "1px solid #ccc",
            fontSize: 8,
            textAlign: "center",
            color: "#999",
            width: "90%",
          }}
        ></Text>
      </Page>
    </Document>
  );
};
