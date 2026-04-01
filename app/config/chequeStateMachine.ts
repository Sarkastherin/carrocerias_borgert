// Máquina de estados para el flujo de vida de un cheque
// Estados posibles del cheque
type ChequeStatus =
  | 'recibido'
  | 'endosado'
  | 'depositado'
  | 'anulado'
  | 'rechazado'
  | 'acreditado';

// Acciones posibles sobre el cheque
type ChequeAction =
  | 'endosar'
  | 'anularEndoso'
  | 'depositar'
  | 'anular'
  | 'rechazar'
  | 'acreditar';

// Efectos secundarios posibles
type ChequeEffect = 'generarDeuda' | 'ninguno';

interface ChequeTransition {
  to: ChequeStatus;
  effect: ChequeEffect;
}

// Definición de la máquina de estados
export const chequeStateMachine: Record<
  ChequeStatus,
  Partial<Record<ChequeAction, ChequeTransition>> & { isEditable?: boolean }
> = {
  recibido: {
    endosar: { to: 'endosado', effect: 'ninguno' },
    depositar: { to: 'depositado', effect: 'ninguno' },
    anular: { to: 'anulado', effect: 'generarDeuda' },
    rechazar: { to: 'rechazado', effect: 'generarDeuda' },
  },
  endosado: {
    anularEndoso: { to: 'recibido', effect: 'ninguno' },
    rechazar: { to: 'rechazado', effect: 'generarDeuda' }, // Permite rechazar endoso
  },
  depositado: {
    acreditar: { to: 'acreditado', effect: 'ninguno' },
    rechazar: { to: 'rechazado', effect: 'generarDeuda' },
  },
  anulado: {},
  rechazado: {},
  acreditado: {},
};

// Función para obtener la transición
export function getChequeTransition(
  from: ChequeStatus,
  action: ChequeAction
): ChequeTransition | undefined {
  return chequeStateMachine[from]?.[action];
}

// Ejemplo de uso:
// const t = getChequeTransition('recibido', 'endosar');
// if (t) { ... }

// Puedes extender esta máquina agregando más efectos o validaciones según sea necesario.
