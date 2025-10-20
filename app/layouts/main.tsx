import { useAuth } from "~/context/Auth";
import { useEffect } from "react";
import { Header } from "~/components/Headers";
import { Outlet, useNavigate } from "react-router";
import { ModalManager } from "~/components/modals/ModalManager";


export default function LayoutMain() {
  const { auth, getAuth } = useAuth();
  const navigate = useNavigate();
  /* 
  1. obtener autenticación
  */
 useEffect(() => {
    if (auth === null) {
      getAuth();
    }
 }, []);
  useEffect(() => {
    if (!auth) {
      navigate("/login");
      return;
    }
    navigate("/");
  }, [auth]);

  return (
    <>
      <Header />
      <Outlet />
      <ModalManager />
    </>
  );
}
