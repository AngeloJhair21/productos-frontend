import { Producto } from './producto'; 

export interface Pedido {
  id?: number; 
  fecha?: string; 
  total: number;

  productos: Producto[]; 
}