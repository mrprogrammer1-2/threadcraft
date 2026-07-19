type ProductImageInput = {
  url: string;
  place: "front" | "back" | "left-sleeve" | "right-sleeve";
  color?: string;
  position: number;
};

type Variant = {
  color: string;
  size?: string;
  stock: number;
  price?: number;
};

type ProductType = {
  id: string;
  name: string;
  hasSizes: boolean;
  sizes: string[];
  hasThreadColor: boolean;
  imagePlacements: string[];
};

type TemplateConfig = {
  baseDesign: {
    designId: string;
    threadHex: string;
    top: string;
    left: string;
    width: number;
  } | null;
  nameplate: {
    top: string;
    left: string;
    width: number;
    fontIndex: number;
    threadHex: string;
    placeholder: string;
  };
};

type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  position: number | null;
};

type ProductVariant = {
  id: string;
  productId: string;
  color: string;
  size: string | null;
  stringColor: string | null;
  stock: number;
  price: number | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  featured: boolean;
  studioMode: "none" | "free" | "template";
  templateConfig: TemplateConfig | null;
  typeId: string;
  type: ProductType;
  images: ProductImage[];
  variants: ProductVariant[];
};

type SingleProductClientType = {
  images: {
    id: string;
    url: string;
    altText: string | null;
    color: string | null;
    position: number | null;
    place: "front" | "back" | "left-sleeve" | "right-sleeve" | null;
  }[];
  variants: {
    id: string;
    color: string;
    size: string | null;
    stringColor: string | null;
    stock: number | null;
    price: number | null;
  }[];
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: ProductType;
  featured: boolean;
  studioMode: "none" | "free" | "template";
  templateConfig: TemplateConfig | null;
  isActive: boolean | null;
  createdAt: Date;
};
