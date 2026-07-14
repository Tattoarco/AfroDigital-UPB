# AfroDigital UPB

Plataforma digital interactiva de cultura y representación afro para la comunidad estudiantil de la Universidad Pontificia Bolivariana (UPB) y otras universidades/territorios aliados.

> Proyecto de Trabajo Comunitario — Crédito Educativo UPB
> **Autora:** Angie Tatiana Mosquera Arco
> **Programa:** Ingeniería en Diseño de Entretenimiento Digital

---

## Tabla de contenido

- [Sobre el proyecto](#sobre-el-proyecto)
- [Fase 1 — Diagnóstico](#fase-1--diagnóstico)
- [Fase 2 — Producto digital](#fase-2--producto-digital)
- [Funcionalidades](#funcionalidades)
- [Arquitectura (MVC)](#arquitectura-mvc)
- [Modelo de datos](#modelo-de-datos)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)
- [Roadmap](#roadmap)
- [Diapositivas del proyecto](#diapositivas-del-proyecto)
- [Créditos](#créditos)

---

## Sobre el proyecto

**AfroDigital** nace de la necesidad de fortalecer la representación, integración y visibilización de estudiantes afrodescendientes dentro de la UPB. La universidad no cuenta con una caracterización oficial de esta población, y existe una visibilidad limitada de la identidad afro en los espacios universitarios.

El proyecto se desarrolla en dos fases:

1. **Fase 1 — Diagnóstico:** investigación, consulta institucional y encuesta de caracterización.
2. **Fase 2 — Producto digital:** una plataforma tipo foro con experiencia interactiva que une a la comunidad afro más allá de compartir información.

## Fase 1 — Diagnóstico

Principales hallazgos:

- La UPB **no cuenta con un censo o caracterización oficial** de estudiantes afrodescendientes.
- Se identificaron inicialmente **~30 estudiantes** como beneficiarios directos.
- Participantes de distintos territorios: Antioquia, Bolívar, Bogotá, Quindío, entre otros.
- Los formatos tradicionales (charlas, foros académicos) generan **baja participación**.
- Existe **miedo a ser percibido como "conflictivo" o "intenso"** al hablar de identidad afro.
- Se recogieron testimonios de discriminación en espacios académicos.

📄 Ver informe completo de diagnóstico: [`INFORME_DE_AVANCE_2025-1.pdf`](./docs/INFORME_DE_AVANCE_2025-1.pdf)

## Fase 2 — Producto digital

**Objetivo:** construir una plataforma tipo foro con experiencia interactiva que una a la comunidad afro (principalmente de la UPB, pero también de otras universidades y barrios/territorios), reduciendo la fricción de participación identificada en el diagnóstico mediante gamificación, salas en vivo y conexión territorial.

## Funcionalidades

| # | Módulo | Descripción |
|---|--------|-------------|
| 01 | **Identidad y Perfil** | Registro, perfil cultural, privacidad configurable |
| 02 | **Comunidades** | Grupos por universidad, barrio o interés |
| 03 | **Foro / Publicaciones** | Posts, comentarios anidados, reacciones |
| 04 | **Salas en vivo** | Chat en tiempo real, presencia conectada |
| 05 | **Mapa de comunidad** | Procedencia territorial de los miembros |
| 06 | **Eventos** | Encuentros, RSVP, galería de evidencias |
| 07 | **Gamificación** | Insignias, progreso, retos de participación |
| 08 | **Moderación** | Reportes, panel moderador, espacio seguro |

## Arquitectura (MVC)

El proyecto sigue el patrón **Modelo–Vista–Controlador**, aplicado en dos niveles:

```
[ CLIENTE — React + Vite + Tailwind ]   (Vista)
                |
                v
[ API — Node.js + Express ]             (Controlador)
                |
                v
[ PostgreSQL (Supabase) ]               (Modelo)
```

- **Backend (Node.js + Express):** implementa el patrón MVC clásico — `models/`, `controllers/`, `routes/`.
- **Frontend (React):** los componentes son la Vista; los *custom hooks* (`usePosts`, `useAuth`, etc.) actúan como Controlador hacia la API o Supabase.

## Modelo de datos

Base de datos relacional en **PostgreSQL (Supabase)**, con 13 tablas principales:

`users` · `communities` · `community_members` · `posts` · `post_media` · `comments` · `reactions` · `events` · `event_attendees` · `badges` · `user_badges` · `notifications` · `reports`

Row Level Security (RLS) activo por rol (`estudiante`, `moderador`, `admin`).

## Stack tecnológico

| Capa | Herramienta |
|------|-------------|
| Vista | React + Vite + Tailwind CSS |
| Controlador (API) | Node.js + Express |
| Modelo / BD | PostgreSQL (Supabase) |
| Tiempo real | Supabase Realtime |
| Autenticación | Supabase Auth |
| Archivos | Supabase Storage |
| Mapa | Mapbox GL / Leaflet |
| Hosting | Vercel (frontend) + Render (backend) |

## Estructura del repositorio

```
afrodigital-upb/
├── afrodigital-api/        # Backend Node.js + Express (Controlador + Modelo)
│   └── src/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       └── services/
│
├── afrodigital-web/         # Frontend React + Vite (Vista + Controlador)
│   └── src/
│       ├── views/
│       ├── components/
│       ├── controllers/
│       ├── models/
│       └── services/
│
├── docs/                    # Documentación del proyecto
│   ├── Anexo2_AfroDigital_UPB.pdf
│   ├── INFORME_DE_AVANCE_2025-1.pdf
│   ├── AfroDigital_UPB_Fase2_Arquitectura_MVC.pdf
│   └── slides/               # 👉 Diapositivas del proyecto (ver abajo)
│
└── README.md
```

## Cómo correr el proyecto

> ⚠️ Sección a completar a medida que se desarrolle el código (fase de implementación).

```bash
# Backend
cd afrodigital-api
npm install
cp .env.example .env      # agregar credenciales de Supabase
npm run dev

# Frontend
cd afrodigital-web
npm install
npm run dev
```

## Roadmap

| Etapa | Entregable |
|-------|-----------|
| 1 | Modelo de datos + autenticación |
| 2 | Comunidades + feed |
| 3 | Foro completo (posts, comentarios, reacciones) |
| 4 | Eventos |
| 5 | Gamificación |
| 6 | Mapa + salas en vivo |
| 7 | Moderación |
| 8 | Pulido y despliegue |

## Diapositivas del proyecto

Presentación con el resumen visual de funcionalidades, arquitectura MVC y modelo de datos: **`AfroDigital_UPB_Fase2.pptx`**

También puedes descargar el archivo original aquí: [`docs/AfroDigital_UPB_Fase2.pptx`](./docs/AfroDigital_UPB_Fase2.pptx)

## Créditos

Proyecto desarrollado por **Angie Tatiana Mosquera Arco**, estudiante de Ingeniería en Diseño de Entretenimiento Digital — UPB, en el marco del programa de crédito educativo para comunidades negras, en articulación con el **Consejo Comunitario del Río Curbaradó**.
