Proyecto

Aplicación web construida con:

React + Vite
TypeScript
Tailwind CSS
shadcn/ui
Supabase
Arquitectura

El proyecto utiliza una arquitectura orientada a Features.

Cada Feature se organiza en:

ui/ — presentación e interacción.
data/ — modelos, tipos, estado y transformación de datos.
api/ — acceso a Supabase y servicios externos.

La definición completa está en docs/ARCHITECTURE.md.

UI y estilos
Usar Tailwind CSS para estilos.
Usar shadcn/ui para componentes de interfaz.
Reutilizar componentes existentes antes de crear nuevos.
Seguir las reglas de docs/DESIGN_SYSTEM.md.
Datos
Supabase es el backend principal.
La UI no debe acceder directamente a Supabase.
Respetar las responsabilidades definidas en docs/ARCHITECTURE.md.
Reglas de desarrollo
Usar TypeScript.
No agregar dependencias sin justificación.
No duplicar lógica existente.
Mantener los componentes pequeños y reutilizables.
No modificar la arquitectura sin justificación.
Revisar la estructura existente antes de crear nuevos archivos.
Documentación

Consultar los documentos de docs/ cuando la tarea requiera detalles de arquitectura, diseño, base de datos, API o funcionalidades.
