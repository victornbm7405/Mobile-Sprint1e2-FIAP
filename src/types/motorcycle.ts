export type Motorcycle = {
  id: number;
  placa: string;
  modelo: string;
  ano?: number;
  areaId: number;
  /** opcional para exibir sem outra requisição */
  areaNome?: string;
};
