export interface CompanyDetails {
  id: number;
  company_name: string;
  logo_url: string | null;
  whatsapp_number: string;
  emergency_phone: string;
  email: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  operating_hours: string;
  review_image_url?: string | null;
  review_image_alt?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFaq {
  id?: number;
  service_id?: number;
  question: string;
  answer: string;
  order?: number;
}

export interface CustomMetaTag {
  id?: string;
  type: string; // 'name', 'property', 'twitter', 'http-equiv', 'link', 'schema', or custom user-defined type
  key: string;  // e.g. 'keywords', 'robots', 'og:locale', 'geo.region', 'author'
  value: string;
}

export interface Service {
  id: number;
  title: string;
  heading?: string | null;
  slug: string;
  short_description: string;
  full_description: string | null;
  icon: string | null;
  cover_image: string | null;
  cover_image_alt?: string | null;
  video_url: string | null;
  category: string;
  is_featured: boolean;
  order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  og_image_alt?: string | null;
  custom_metadata?: CustomMetaTag[] | null;
  faqs?: ServiceFaq[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  author: string;
  excerpt: string;
  content: string;
  icon: string | null;
  cover_image: string | null;
  cover_image_alt?: string | null;
  is_featured: boolean;
  published_at: string;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  og_image_alt?: string | null;
  custom_metadata?: CustomMetaTag[] | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  location: string | null;
  service_needed: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  order: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AdminStats {
  total_services: number;
  total_blogs: number;
  total_inquiries: number;
  unread_inquiries: number;
  company: CompanyDetails | null;
}

export interface GalleryItem {
  id: number;
  title: string | null;
  category: string;
  image_url: string;
  alt_text: string | null;
  description: string | null;
  order: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

