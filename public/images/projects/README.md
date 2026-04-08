# Project Image Library

This app now reads project media from `src/assets/images`, not from `public/images/projects`.
This file is kept as documentation so the convention is easy to follow.

## Required pattern

Each project has one folder named by slug:

- `villa-azzuro-malinska`
- `projekt-sesvete`
- `ville-krk-objekt-a`
- `ville-krk-objekt-b`
- `villa-malinska-qubo4`
- `villa-malinska-2`
- `villa-malinska-1`
- `villa-malinska-pavus`

Inside each project folder, use:

- `01-cover.webp` (required cover image used in cards and hero)
- `projections/`
- `exterior/`
- `interior/`
- `apartment-1/`
- `apartment-2/`
- `floorplans/`

## Naming convention

Keep files sortable and predictable:

- `01-main.webp`
- `02-evening.webp`
- `03-living-room.webp`

Use lowercase, dashes, and no spaces.

## Formats and optimization

- Prefer `webp` or `avif`.
- Keep hero photos around `1920px` max width.
- Keep gallery photos around `1400px` max width.
- Keep plan/thumbnails around `600-1000px` depending on use.

## Example tree

src/assets/images/
  villa-azzuro-malinska/
    01-cover.webp
    projections/
      01-main.webp
      02-evening.webp
    exterior/
      01-front.webp
      02-pool.webp
    interior/
      01-living.webp
      02-kitchen.webp
    apartment-1/
      01-plan.webp
    apartment-2/
      01-plan.webp
    floorplans/
      01-master-plan.webp

## Where to change data

All slugs/categories/paths are configured in:

- `src/data/projectsCatalog.ts`

If you add a new image category or project, update that file only.
