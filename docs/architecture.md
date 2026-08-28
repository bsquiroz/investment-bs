# Arquitectura

## Principio

El proyecto utiliza una arquitectura orientada a Features.

Cada Feature se construye utilizando tres capas:

- **API**: comunicación con el backend.
- **DATA**: definición, transformación y organización de los datos.
- **UI**: presentación, componentes e interacción con el usuario.

La estructura general de una Feature es:

```text
features/
└── <feature>/
    ├── api/
    ├── data/
    └── ui/
```

## API

La capa `API` contiene toda la comunicación con servicios externos.

En este proyecto, el backend principal es **Supabase**.

Responsabilidades:

- Consultas a Supabase.
- Inserciones, actualizaciones y eliminaciones.
- Llamadas a funciones o servicios externos.
- Encapsular la comunicación con el backend.

La UI no debe realizar llamadas directas a Supabase.

Ejemplo:

```text
ui → api → Supabase
```

## DATA

La capa `DATA` contiene las estructuras y transformaciones relacionadas con los datos.

Responsabilidades:

- Interfaces y tipos.
- Modelos.
- Mappers.
- Constantes relacionadas con datos.
- Transformación de respuestas de API.
- Normalización o preparación de datos para la UI.

La capa `DATA` no debe contener componentes visuales ni realizar directamente llamadas al backend.

Ejemplo:

```text
API → DATA → UI
```

## UI

La capa `UI` contiene todo lo relacionado con la interfaz y la interacción del usuario.

Responsabilidades:

- Componentes React.
- Formularios.
- Estados de interfaz.
- Eventos e interacciones.
- Lógica relacionada con la presentación.
- Composición de componentes.

Los componentes deben utilizar los datos proporcionados por `DATA` y acceder al backend mediante `API`.

## Flujo entre capas

La comunicación principal sigue el siguiente flujo:

```text
┌──────────────┐
│      UI      │
│ Presentación │
│ Interacción  │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│     DATA     │
│ Tipos        │
│ Interfaces   │
│ Mappers      │
│ Constantes   │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│     API      │
│ Supabase     │
│ Backend      │
└──────────────┘
```

La dependencia entre capas debe mantenerse clara y evitar responsabilidades duplicadas.

## Reglas

- Cada funcionalidad debe pertenecer a una Feature.
- La comunicación con Supabase pertenece a `API`.
- Los tipos, interfaces, mappers y constantes de datos pertenecen a `DATA`.
- Los componentes y la lógica de interacción pertenecen a `UI`.
- No realizar consultas directas a Supabase desde `UI`.
- No colocar componentes React dentro de `API` o `DATA`.
- Evitar duplicar tipos, mappers o lógica entre Features.
- Las Features deben mantenerse independientes siempre que sea posible.
