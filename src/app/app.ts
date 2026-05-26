import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el formulario
import { ProductoService } from './services/producto';
import { Producto } from './models/producto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos los módulos necesarios
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  // Lista donde guardaremos los productos que vienen del backend
  productos: Producto[] = [];
  
  // Objeto temporal para el formulario (Crear/Editar)
  productoFormulario: Producto = {
    nombre: '',
    precio: 0,
    cantidad: 0
  };

  // Variable para saber si estamos editando o creando
  editando: boolean = false;

  // Inyectamos el servicio
  constructor(private productoService: ProductoService) {}

  // Este método se ejecuta automáticamente cuando la página carga
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