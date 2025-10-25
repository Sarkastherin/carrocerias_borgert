import { Spinning } from "./Spinning";
export default function LoadingComponent({content}: {content?: string}) {
  return (
    <div className="text-center">
      <Spinning />
      <p className="text-gray-500">{content || "Cargando..."}</p>
    </div>
  );
}
