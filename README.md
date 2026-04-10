# edu-assistant

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Requisitos

- Node 22.21


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Learning Object Tabs

La vista `module-wiki-view.vue` agrupa los Learning Objects de un módulo en **tabs**, uno por cada tipo (`LearningObjectType`) expuesto por el backend. Cada tab:

- Pide al endpoint `GET /learning-objects/module/:moduleId?typeId=X` solo los objetos del tipo activo.
- Usa un mismo componente de render (`GenericTabContent`) que reutiliza `LearningObjectCard` y reenvía los handlers de publicar / editar / generar relaciones que vienen desde la vista.
- Tiene su propio botón **Crear**, que emite `@create(typeId)` para que el diálogo de creación use el `typeId` del tab activo.
- Resuelve internamente la **ruta de detalle** de cada card en función del tipo activo (`activeConfig.detailRouteName`), así cada tipo puede navegar a una pantalla distinta (`/modules/:id/pages/:loId`, `/modules/:id/videos/:loId`, …).

### Flujo de datos

```
module-wiki-view.vue
  ├─ useLearningObjectTypes()          → GET /learning-object-types
  └─ <LearningObjectsTabs :types>
        ├─ useLearningObjects({ moduleId, typeId: activeTypeId })
        │                               → GET /learning-objects/module/:id?typeId=X
        └─ <GenericTabContent>
              └─ <LearningObjectCard>   (una card por LO, con acciones)
```

Los handlers (`handlePublishNow`, `handleGenerateRelations`, `openUpdateLearningObject`) y los diálogos (`CreateLearningObjectDialog`, `UpdateLearningObjectDialog`) siguen viviendo en `module-wiki-view.vue`; los tabs solo los propagan como props.

### Cómo agregar un nuevo Learning Object Type

Los tipos los define el backend (tabla `learning_object_types`). Una vez que el backend expone un nuevo tipo (por ejemplo `VIDEO`, `QUIZ`, `EXERCISE`), el frontend lo toma automáticamente desde `GET /learning-object-types` y ya aparece como un tab. **No hace falta tocar código para que el tab exista** — pero sí hace falta configurarlo si querés un label/icono propio **y una URL de detalle propia**.

Flujo completo para dar de alta un tipo nuevo (ejemplo: `VIDEO`):

**1. Crear la vista de detalle del tipo** (si necesita UI distinta a la de `PAGE`)

```
src/features/videos/presentation/views/video-detail-view.vue
```

Si el tipo comparte UI con una vista ya existente, saltate este paso y reusá esa vista.

**2. Registrar la ruta en `src/features/modules/routes/modules-routes.ts`**

```ts
export const MODULES_ROUTES_NAMES = {
  ...
  PAGE_DETAIL: 'page-detail',
  VIDEO_DETAIL: 'video-detail',
} as const;

// dentro de children:
{
  path: ':id/videos/:learningObjectId',
  name: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
  component: () => import('@/features/videos/presentation/views/video-detail-view.vue'),
  meta: { layout: 'dashboard', requiresAuth: true, roles: ['TEACHER', 'STUDENT'] },
},
```

> **Convención**: el param de id se llama siempre `learningObjectId`, así cualquier vista de detalle puede leer `route.params.learningObjectId` sin conocer el tipo. El segmento del path (`/videos/`, `/pages/`, `/quizzes/`) es lo único que cambia.

**3. Registrar el tipo en `src/features/learning-objects/constants/learning-object-type.constants.ts`**

```ts
import type { LearningObjectTypeConfig } from '../types/learning-object-type-config.types'
import { FileText, Video, ListChecks } from 'lucide-vue-next'
import { MODULES_ROUTES_NAMES } from '@/features/modules/routes/modules-routes'

export const LEARNING_OBJECT_TYPE_CONFIG: Record<string, LearningObjectTypeConfig> = {
  PAGE: {
    label: 'Páginas',
    icon: FileText,
    detailRouteName: MODULES_ROUTES_NAMES.PAGE_DETAIL,
  },
  VIDEO: {
    label: 'Videos',
    icon: Video,
    detailRouteName: MODULES_ROUTES_NAMES.VIDEO_DETAIL,
  },
  QUIZ: {
    label: 'Evaluaciones',
    icon: ListChecks,
    detailRouteName: MODULES_ROUTES_NAMES.QUIZ_DETAIL,
  },
}
```

La **clave** del record (`PAGE`, `VIDEO`, …) debe coincidir exactamente con el campo `name` del `LearningObjectType` que devuelve el backend. Si un tipo del backend no tiene entrada en el config, el tab igual aparece pero:
- Usa el `name` crudo como label (sin traducción).
- No muestra icono.
- Al hacer click en una card cae a la ruta genérica `LEARNING_OBJECT_DETAIL` (`/modules/:id/learning-objects/:learningObjectId`).

Esto es el `FALLBACK_DETAIL_ROUTE_NAME` exportado desde el mismo archivo de constants, útil como red de seguridad mientras se termina de configurar un tipo nuevo.

### Qué se puede configurar por tipo

Cada entrada de `LEARNING_OBJECT_TYPE_CONFIG` implementa la interface `LearningObjectTypeConfig`:

| Campo             | Tipo                      | Uso                                                                  |
|-------------------|---------------------------|----------------------------------------------------------------------|
| `label`           | `string`                  | Texto visible del tab y del botón "Crear <label>".                   |
| `icon`            | `Component` (lucide-vue)  | Icono a la izquierda del label del tab.                              |
| `detailRouteName` | `string` (route name)     | Nombre de la ruta a la que navegan las cards cuando se hace click.   |

Hoy todos los tipos comparten el mismo componente de render en la lista (`GenericTabContent` + `LearningObjectCard`). La **personalización por tipo** se hace en la **vista de detalle**, no en la card: cada tipo resuelve su propia ruta y decide qué mostrar en esa pantalla (un editor tiptap para `PAGE`, un reproductor para `VIDEO`, un runner de quiz para `QUIZ`, etc.).

### Cómo diferenciar la UI de las cards de un tipo específico

Si en el futuro algún tipo también necesita una card distinta dentro del tab (por ejemplo, una card de video con thumbnail), el patrón recomendado es:

1. Agregar un campo opcional `tabContent?: Component` a `LearningObjectTypeConfig`.
2. Crear el componente específico (ej. `video-tab-content.vue`) con las mismas props que `GenericTabContent` (`learningObjects`, `isLoading`, `canEdit`, handlers…).
3. Referenciarlo en `LEARNING_OBJECT_TYPE_CONFIG`.
4. En `learning-objects-tabs.vue`, resolver el `activeTabContent` como `activeConfig.tabContent ?? GenericTabContent` y renderizarlo con `<component :is="activeTabContent" />`.

Mientras nadie necesite una card distinta, mantener solo `label` + `icon` + `detailRouteName` es lo más simple.

### Reactividad del query

`useLearningObjects` usa un `queryKey` reactivo (`computed(() => QUERY_KEYS.LEARNING_OBJECTS(params.value))`), así que al cambiar de tab el `typeId` cambia, la key cambia y TanStack Query refetchea automáticamente. Si cambiás la forma en que se construye el filtro, asegurate de mantener el `queryKey` como `computed` o la cache quedará pegada.
