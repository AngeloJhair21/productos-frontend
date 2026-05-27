import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importamos los servicios (rutas cortas)
import { PedidoService } from '../services/pedido';
import { ProductoService } from '../services/producto';

// Importamos los modelos (rutas cortas)
import { Pedido } from '../models/pedido';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html', // Archivo HTML corto
  styleUrl: './pedido.css'      // Archivo CSS corto
})
// IMPORTANTE: Le llamamos PedidoComponent para que no choque con la interfaz Pedido
export class PedidoComponent implements OnInit {

  // Catálogos desde la base de datos
  productosDisponibles: Producto[] = []; 
  historialPedidos: Pedido[] = [];       
  
  // Carrito de compras local
  carrito: Producto[] = [];
  totalCarrito: number = 0;

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos(); 
  }

  cargarCatalogos(): void {
    this.productoService.listarProductos().subscribe(data => this.productosDisponibles = data);
    this.pedidoService.listarPedidos().subscribe(data => this.historialPedidos = data);
  }

  // ACCIÓN: Agregar al carrito
  agregarAlCarrito(producto: Producto): void {
    this.carrito.push(producto);
    this.calcularTotal();
  }

  // ACCIÓN: Quitar del carrito
  quitarDelCarrito(indice: number): void {
    this.carrito.splice(indice, 1); 
    this.calcularTotal();
  }

  // CÁLCULO: Sumar precios
  calcularTotal(): void {
    this.totalCarrito = this.carrito.reduce((sum, p) => sum + p.precio, 0);
  }

  // ACCIÓN FINAL: Guardar en BD
  guardarPedido(): void {
    if (this.carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const nuevoPedido: Pedido = {
      total: this.totalCarrito,
      productos: this.carrito 
    };

    this.pedidoService.crearPedido(nuevoPedido).subscribe(() => {
      alert("¡Venta registrada con éxito!");
      this.carrito = [];       
      this.totalCarrito = 0;   
      this.cargarCatalogos();  
    });
  }
}
