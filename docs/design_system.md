## Principios

La aplicación utiliza un sistema de diseño:

- Minimalista.
- Responsive.
- Consistente.
- Basado en componentes reutilizables.
- Preparado para temas dinámicos.

## Tecnologías

- Tailwind CSS para estilos.
- shadcn/ui como biblioteca principal de componentes.
- Lucide React para iconos.

## Temas

La aplicación debe soportar:

- Light Mode.
- Dark Mode.

Los componentes deben funcionar correctamente en ambos modos.

Los colores deben utilizar variables semánticas del tema en lugar de valores específicos dentro de los componentes.

## Color primario

El color primario por defecto de la aplicación es **naranja**.

El sistema debe estar preparado para permitir que el usuario seleccione dinámicamente el color primario.

Colores iniciales disponibles:

- Naranja — predeterminado.
- Rojo.
- Azul.

La arquitectura de estilos debe permitir agregar nuevos colores posteriormente sin modificar individualmente los componentes.

El color primario debe implementarse mediante variables/tokens del sistema de diseño.

## Componentes

Se debe utilizar **shadcn/ui** siempre que exista un componente que cubra la necesidad.

No crear componentes propios que dupliquen funcionalidades existentes de shadcn/ui.

Si shadcn/ui no proporciona un componente adecuado:

1. Analizar si puede componerse utilizando componentes existentes.
2. Si no es suficiente, proponer la solución antes de crearla.
3. Crear un componente propio siguiendo los principios de Atomic Design cuando sea apropiado.

## Componentes propios

Los componentes reutilizables que no pertenezcan directamente a una Feature deben ubicarse en:

```text
src/components/
├── ui/          # Componentes de shadcn/ui
└── common/      # Componentes propios reutilizables
```

Los componentes específicos de una funcionalidad deben permanecer dentro de su Feature:

```text
src/features/
└── <feature>/
    └── ui/
```

## Atomic Design

Cuando sea apropiado, los componentes propios deben seguir principios de Atomic Design:

```text
Átomos
  ↓
Moléculas
  ↓
Organismos
  ↓
Componentes de Feature
  ↓
Páginas
```

No aplicar Atomic Design de forma forzada. Debe utilizarse cuando ayude a la reutilización y organización del código.

## Tailwind CSS

Todo el styling debe realizarse utilizando Tailwind CSS.

Evitar:

- CSS tradicional.
- Estilos inline.
- Archivos CSS específicos de componentes.

Se permiten excepciones cuando exista una necesidad técnica justificada.

## Iconografía

Utilizar **Lucide React** como biblioteca de iconos.

No utilizar emojis como iconos de interfaz.

No introducir otras bibliotecas de iconos sin justificación.

## Responsive

La aplicación debe ser responsive desde el diseño inicial.

Los componentes deben adaptarse correctamente a:

- Móvil.
- Tablet.
- Desktop.

No diseñar primero una interfaz desktop y posteriormente intentar adaptarla a móvil.

## Consistencia

Antes de crear un nuevo componente:

1. Revisar los componentes existentes de shadcn/ui.
2. Revisar `src/components/common/`.
3. Revisar los componentes de la Feature actual.
4. Reutilizar o extender componentes existentes cuando sea posible.

Evitar duplicación de componentes y estilos.
