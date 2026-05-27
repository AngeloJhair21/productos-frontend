import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido'; // Ruta corta a tu modelo

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  // Apunta a tu nuevo controlador de Spring Boot
  private apiUrl = 'https://productos-backend-qlqj.onrender.com/api/pedidos';

  constructor(private http: HttpClient) { }

  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  crearPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
