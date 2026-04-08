export type ProjectStatus = 'available' | 'sold';
export type GalleryCategory =
  | 'gallery'
  | 'projections'
  | 'exterior'
  | 'interior'
  | 'apartment-1'
  | 'apartment-2'
  | 'floorplans';

export interface ProjectImageItem {
  src: string;
  label: string;
}

export interface ProjectCatalogItem {
  id: string;
  slug: string;
  imageFolder: string;
  status: ProjectStatus;
  featured: boolean;
}
import { DEMO_IMAGE_MANIFEST } from './demoImageManifest';

const PUBLIC_BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL.slice(0, -1)
  : import.meta.env.BASE_URL;

function extractNumber(filePath: string) {
  const match = filePath.match(/(\d+)(?=\.[^.]+$)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function getStem(filePath: string) {
  const parts = filePath.split('/');
  const file = parts[parts.length - 1] ?? '';
  return file.replace(/\.[^.]+$/, '');
}

function detectCategory(filePath: string): GalleryCategory {
  const lower = filePath.toLowerCase();

  if (/(projection|render|vizual|vizualiz|projekt)/.test(lower)) {
    return 'projections';
  }
  if (/(exterior|outside|vanj|fasada)/.test(lower)) {
    return 'exterior';
  }
  if (/(interior|inside|unutr|living|kitchen|bedroom)/.test(lower)) {
    return 'interior';
  }
  if (/(apartment[-_ ]?1|apartman[-_ ]?1|stan[-_ ]?1|unit[-_ ]?1)/.test(lower)) {
    return 'apartment-1';
  }
  if (/(apartment[-_ ]?2|apartman[-_ ]?2|stan[-_ ]?2|unit[-_ ]?2)/.test(lower)) {
    return 'apartment-2';
  }
  if (/(floorplan|floor-plan|tlocrt|plan)/.test(lower)) {
    return 'floorplans';
  }

  return 'gallery';
}

export const PROJECTS_CATALOG: ProjectCatalogItem[] = [
  {
    id: 'villaAzzuro',
    slug: 'villa-azuro-malinska',
    imageFolder: 'villa-azuro-malinska',
    status: 'available',
    featured: true,
  },
  {
    id: 'sesvete',
    slug: 'projekt-sesvete',
    imageFolder: 'projekt-sesvete',
    status: 'available',
    featured: true,
  },
  {
    id: 'villeKrkA',
    slug: 'ville-krk-objekt-a',
    imageFolder: 'ville-krk-objekt-a',
    status: 'sold',
    featured: true,
  },
  {
    id: 'villeKrkB',
    slug: 'ville-krk-objekt-b',
    imageFolder: 'ville-krk-objekt-b',
    status: 'sold',
    featured: true,
  },
  {
    id: 'qubo4',
    slug: 'villa-malinska-qubo4',
    imageFolder: 'villa-malinska-qubo4',
    status: 'sold',
    featured: false,
  },
  {
    id: 'malinska2',
    slug: 'villa-malinska-2',
    imageFolder: 'villa-malinska-2',
    status: 'sold',
    featured: false,
  },
  {
    id: 'malinska1',
    slug: 'villa-malinska-1',
    imageFolder: 'villa-malinska-1',
    status: 'sold',
    featured: false,
  },
  {
    id: 'pavus',
    slug: 'villa-malinska-pavus',
    imageFolder: 'villa-malinska-pavus',
    status: 'sold',
    featured: false,
  },
  // ── Realized (sold) projects ────────────────────────────────────
  {
    id: 'selce2',
    slug: 'apartmani-selce-2',
    imageFolder: 'apartmani-selce-2',
    status: 'sold',
    featured: false,
  },
  {
    id: 'siloKrk',
    slug: 'apartmani-silo-krk',
    imageFolder: 'apartmani-silo-krk',
    status: 'sold',
    featured: false,
  },
  {
    id: 'bukovacZagreb',
    slug: 'bukovac-zagreb',
    imageFolder: 'bukovac-zagreb',
    status: 'sold',
    featured: false,
  },
  {
    id: 'dramaljApartmani',
    slug: 'dramalj-apartmani',
    imageFolder: 'dramalj-apartmani',
    status: 'sold',
    featured: false,
  },
  {
    id: 'perjavicaZagreb',
    slug: 'perjavica-zagreb',
    imageFolder: 'perjavica-zagreb',
    status: 'sold',
    featured: false,
  },
  {
    id: 'qubo3',
    slug: 'qubo-3-malinska',
    imageFolder: 'qubo-3-malinska',
    status: 'sold',
    featured: false,
  },
  {
    id: 'santoriniCrikvenica',
    slug: 'santorini-crikvenica',
    imageFolder: 'santorini-crikvenica',
    status: 'sold',
    featured: false,
  },
  {
    id: 'santoriniNjivice',
    slug: 'santorini-njivice',
    imageFolder: 'santorini-njivice',
    status: 'sold',
    featured: false,
  },
  {
    id: 'selceApartmani',
    slug: 'selce-apartmani',
    imageFolder: 'selce-apartmani',
    status: 'sold',
    featured: false,
  },
  {
    id: 'villaAzzuroCrikvenica',
    slug: 'villa-azzuro-crikvenica',
    imageFolder: 'villa-azzuro-crikvenica',
    status: 'sold',
    featured: false,
  },
  {
    id: 'villaVerdeCrikvenica',
    slug: 'villa-verde-crikvenica',
    imageFolder: 'villa-verde-crikvenica',
    status: 'sold',
    featured: false,
  },
  {
    id: 'villaZorcici',
    slug: 'villa-zorcici',
    imageFolder: 'villa-zorcici',
    status: 'sold',
    featured: false,
  },
  {
    id: 'saintMartinKostelj',
    slug: 'villas-saint-martin-kostelj',
    imageFolder: 'villas-saint-martin-kostelj',
    status: 'sold',
    featured: false,
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS_CATALOG.find((project) => project.slug === slug);
}

function toPublicAssetUrl(path: string): string {
  return path.startsWith('/') ? `${PUBLIC_BASE}${path}` : path;
}

function getProjectImagePaths(project: ProjectCatalogItem): string[] {
  return [...(DEMO_IMAGE_MANIFEST[project.id] ?? [])]
    .map(toPublicAssetUrl)
    .sort((a, b) => {
    const numDelta = extractNumber(a) - extractNumber(b);
    return numDelta !== 0 ? numDelta : a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export function getProjectPathGroups(project: ProjectCatalogItem): Record<GalleryCategory, string[]> {
  const limitedPaths = getProjectImagePaths(project);

  const groups: Record<GalleryCategory, string[]> = {
    gallery: [],
    projections: [],
    exterior: [],
    interior: [],
    'apartment-1': [],
    'apartment-2': [],
    floorplans: [],
  };
  for (const path of limitedPaths) {
    groups[detectCategory(getStem(path))].push(path);
  }
  return groups;
}

export async function loadCategoryImages(paths: string[]): Promise<ProjectImageItem[]> {
  return paths.map((path, index) => ({
    src: path,
    label: getStem(path) || `image-${index + 1}`,
  }));
}

export async function loadProjectCoverImage(project: ProjectCatalogItem): Promise<string | null> {
  const paths = getProjectImagePaths(project);
  if (paths.length === 0) return null;
  return paths[0];
}

export async function loadProjectThumbnailImage(project: ProjectCatalogItem): Promise<string | null> {
  const paths = getProjectImagePaths(project);
  return paths[0] ?? null;
}

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  gallery: 'Gallery',
  projections: 'Projections',
  exterior: 'Exterior',
  interior: 'Interior',
  'apartment-1': 'Apartment No. 1',
  'apartment-2': 'Apartment No. 2',
  floorplans: 'Floorplans',
};
