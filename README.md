# Sistema de Control para Bares

Un sistema web moderno para gestionar mesas, pedidos y menús en bares y restaurantes.

## Descripción

Este sistema permite a los propietarios y al personal de bares y restaurantes gestionar de manera eficiente sus mesas, pedidos y menús. La aplicación sigue un diseño intuitivo donde cada mesa tiene cuatro sillas que pueden ser ocupadas individualmente.

### Características principales:

- **Gestión de mesas y sillas**: 
  - Cada mesa tiene cuatro sillas que pueden cambiar de estado con un clic.
  - Primer clic: La silla cambia a color celeste (cliente sentado).
  - Segundo clic: La silla cambia a color rosa (pedido realizado).
  - Tercer clic: La silla vuelve a gris (silla libre).
  - Si todas las sillas de una mesa están en gris, la mesa se cierra automáticamente.

- **Control de pedidos**:
  - Cada mesa lleva un registro de los consumos asociados.
  - Posibilidad de añadir ítems a cada mesa mediante un modal.

- **Gestión de menú**:
  - Sección para crear, editar y eliminar ítems del menú.
  - Actualización masiva de precios y disponibilidad.

- **Modo claro/oscuro**: Personalización de la interfaz según preferencias.

## Tecnologías utilizadas

- React.js 18
- Firebase (autenticación y base de datos)
- React Router DOM 
- Vite (build tool)
- CSS personalizado

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sist-bares.git
cd sist-bares

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crea un proyecto en Firebase Console
# 2. Configura las credenciales en src/components/firebaseConfig.js

# Iniciar en modo desarrollo
npm run dev
```

## Uso

1. Accede a la aplicación en el navegador (por defecto en http://localhost:5173/)
2. La página principal muestra las mesas numeradas del restaurante
3. Haz clic en una silla para cambiar su estado
4. Navega al menú para agregar, editar o eliminar productos
5. Utiliza la función "Añadir productos" para asignar productos a mesas específicas

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios propuestos o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.