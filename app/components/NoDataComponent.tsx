import { Button} from "./Buttons";
import { PlusIcon } from "lucide-react";
export default function NoDataComponent({ word, onClick }: { word: string, onClick: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col text-center space-y-3 text-text-secondary">
        <img
          src="/search.png"
          alt="No hay Pedidos"
          className="w-48 h-48 mx-auto mb-4"
        />
        <p className="text-xl font-semibold">No hay {word}.</p>
        <p className="text-sm">
          Puede agregar {word} haciendo clic en el botón de abajo
        </p>
        <div className="w-fit mx-auto">
          <Button variant="primary" onClick={onClick}>
            <div className="flex items-center justify-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Agregar {word}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
