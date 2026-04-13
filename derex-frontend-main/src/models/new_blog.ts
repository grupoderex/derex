export interface BlogsResponse {
  data: BlogItem[];
  meta: Meta;
}

export interface BlogItemResponse {
  data: BlogItem;
}

export interface BlogItem {
  id: number;
  documentId: string;
  title: string;
  fecha?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  isFeatured: boolean;
  category: Category;
  tags: Tag[];
  content: Array<ContentText | ContentCarousel | ContentImage | ContentIframe>;
  thumbnail?: Thumbnail | null;
  cover?: Media | null;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;
  localizations: Localization3[];
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations: Localization[];
}

export interface Localization {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

export interface Tag {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  name: string;
  blog: Blog;
  localizations: Localization2[];
}

export interface Blog {
  id: number;
  documentId: string;
  title: string;
  fecha?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  isFeatured: boolean;
}

export interface Localization2 {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  name: string;
}

export interface ContentText {
  __component: "blog.content";
  id: number;
  rich_text: string;
}

export interface ContentCarousel {
  __component: "blog.carousel";
  id: number;
  media: Media[];
}

export interface ContentImage {
  __component: "blog.image";
  id: number;
  image: Media;
}

export interface ContentIframe {
  __component: "blog.i-frame";
  id: number;
  content: string;
}

export interface Thumbnail {
  id: number;
  documentId: string;
  name: string;
  alternativeText: unknown;
  caption: unknown;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: unknown;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Formats {
  small: Small;
  medium: Medium;
  thumbnail: Thumbnail2;
}

export interface Small {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Medium {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Thumbnail2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: Formats2;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Formats2 {
  small: Small2;
  medium: Medium2;
  thumbnail: Thumbnail3;
}

export interface Small2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Medium2 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface Thumbnail3 {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: unknown;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface CreatedBy {
  id: number;
  documentId: string;
  firstname: string;
  lastname: string;
  username: unknown;
  preferedLanguage: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface UpdatedBy {
  id: number;
  documentId: string;
  firstname: string;
  lastname: string;
  username: unknown;
  preferedLanguage: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Localization3 {
  id: number;
  documentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  slug: string;
  isFeatured: boolean;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
