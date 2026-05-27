import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

// 1️⃣ IMPORTA TU NUEVO COMPONENTE DE PEDIDOS
import { PedidoComponent } from './pedido/pedido'; 

import { ProductoService } from './services/producto';
import { Producto } from './models/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2️⃣ AGREGA PedidoComponent EN LOS IMPORTS
  imports: [CommonModule, FormsModule, PedidoComponent], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  
  // 3️⃣ CREA ESTA VARIABLE PARA CONTROLAR EL MENÚ
  // Por defecto arrancará mostrando los productos
  vistaActual: string = 'productos'; 

  // ... (NO BORRES NADA, DEJA AQUÍ TODA TU LÓGICA DE PRODUCTOS QUE YA TENÍAS) ...
  productos: Producto[] = [];
  productoFormulario: Producto = { nombre: '', precio: 0, cantidad: 0 };
  editando: boolean = false;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Llama al Backend (GET)
  cargarProductos(): void {
    this.productoService.listarProductos().subscribe(datos => {
      this.productos = datos;
    });
  }

  // Llama al Backend (POST o PUT)
  guardarProducto(): void {
    if (this.editando && this.productoFormulario.id) {
      // Actualizar
      this.productoService.actualizarProducto(this.productoFormulario.id, this.productoFormulario)
        .subscribe(() => {
          this.cargarProductos();
          this.limpiarFormulario();
        });
    } else {
      // Crear nuevo
      this.productoService.crearProducto(this.productoFormulario).subscribe(() => {
        this.cargarProductos();
        this.limpiarFormulario();
      });
    }
  }

  // Prepara el formulario para editar un producto existente
  editarProducto(producto: Producto): void {
    this.productoFormulario = { ...producto }; // Copiamos los datos al formulario
    this.editando = true;
  }

  // Llama al Backend (DELETE)
  eliminarProducto(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  // Resetea el formulario
  limpiarFormulario(): void {
    this.productoFormulario = { nombre: '', precio: 0, cantidad: 0 };
    this.editando = false;
  }
}