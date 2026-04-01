import { Outlet } from "react-router";
import { CtaCteProvider } from "~/context/CtaCteContext";

export default function LayoutAdministracion() {
  return (
    <>
    <CtaCteProvider><Outlet /></CtaCteProvider>
      
    </>
  );
}