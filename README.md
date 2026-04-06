# Punto Chocolate — Sistema de Puntos (FrontEnd)

Interfaz web del sistema de gestión de puntos de fidelización para **Punto Chocolate**. Permite administrar clientes, productos y usuarios, así como acumular y canjear puntos.

## Tecnologías

- **React 18** con **Vite 5**
- **Tailwind CSS 4** (paleta Material Design personalizada)
- **React Router DOM 7** — enrutamiento SPA con rutas protegidas
- **Axios** — comunicación con la API REST (JWT Bearer)
- **TanStack React Table** — tablas de datos
- **SweetAlert2 / React Toastify** — notificaciones y alertas
- **React Datepicker / date-fns** — manejo de fechas
- **WebSockets** — actualizaciones en tiempo real

## Funcionalidades

| Módulo    | Descripción                                                    |
|-----------|----------------------------------------------------------------|
| Clientes  | Alta, edición, búsqueda, detalle, agregar/descontar puntos     |
| Productos | Alta, edición, búsqueda, detalle                               |
| Usuarios  | Alta, búsqueda, detalle (roles Admin / Empleado)               |
| Histórico | Registro de movimientos de puntos por cliente                   |
| Dashboard | Menú principal con top consumidores y acumuladores              |
| Auth      | Login con JWT, contexto de autenticación y rutas protegidas     |

## Requisitos previos

- **Node.js** >= 18
- **npm** (incluido con Node.js)
- Backend del proyecto corriendo (por defecto en `http://localhost:4000`)

## Instalación

```bash
# Clonar el repositorio e ir a la carpeta del frontend
cd FrontEnd

# Instalar dependencias
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:4000/api/
VITE_WS_URL=ws://localhost:4000
```

- `VITE_API_URL` — **Requerida.** URL base de la API REST.
- `VITE_WS_URL` — Opcional. Si no se define, se usa `ws://localhost:4000` por defecto.

## Ejecución

```bash
# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar build
npm run preview
```

El servidor de desarrollo se expone en `http://localhost:5173` por defecto.

## Estructura del proyecto

```
src/
├── api/              # Configuración de Axios (interceptor JWT)
├── components/       # Componentes reutilizables (Sidebar, tablas, etc.)
│   ├── Cliente/      # Componentes específicos de clientes
│   ├── Producto/     # Componentes específicos de productos
│   └── Usuario/      # Componentes específicos de usuarios
├── context/          # AuthContext (login, logout, estado de sesión)
├── pages/            # Páginas/vistas por módulo
│   ├── cliente/
│   ├── producto/
│   └── usuario/
└── styles/           # CSS personalizado e imágenes
```

## Licencia

Proyecto de portfolio — uso educativo.
