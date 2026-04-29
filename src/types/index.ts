export interface Product {
  id: string;
  slug: string;
  sku: string;
  store_skus?: Record<string, string>;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColorId: string;
  designId?: string;
  designImageUrl?: string;
}

// ─── Design Builder ───────────────────────────────────────────────────────────

export interface PlacementSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "image" | "text" | "logo";
  label: string;
}

export interface ColorOption {
  id: string;
  hex: string;
  label: string;
}

export interface Template {
  id: string;
  product_id: string; // matches products.slug
  name: string;
  base_image_url: string;
  placements: PlacementSlot[];
  colors: ColorOption[];
  is_active: boolean;
  created_at: string;
}

export interface DesignConfig {
  template_id: string;
  color: ColorOption;
  placement: PlacementSlot;
}

export interface Design {
  id: string;
  user_id: string;
  template_id: string;
  product_slug: string;
  selected_color: ColorOption;
  selected_placement: PlacementSlot;
  design_config: DesignConfig;
  preview_image_url?: string;
  status: "draft" | "confirmed" | "ordered";
  created_at: string;
}