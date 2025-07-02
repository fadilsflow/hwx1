import { Hono } from "hono";
import { cors } from "hono/cors";
import { getRouterName, showRoutes } from "hono/dev";

// Types
interface Category {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

interface Seller {
  id: number;
  shop_name: string;
}

interface Product {
  id: number;
  seller_id?: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url: string;
  weight?: number;
  is_active?: boolean;
  last_synced_at?: string;
  created_at?: string;
  updated_at?: string;
  seller?: Seller;
  category?: Category;
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface SellerWithCategories {
  seller_id: number;
  shop_name: string;
  categories: Category[];
}

interface SellerWithProducts {
  seller_id: number;
  shop_name: string;
  products: Product[];
}

const app = new Hono();

// Aktifkan CORS (default: semua origin diizinkan)
app.use("*", cors());

// Dummy data
const sellers: Seller[] = [
  { id: 3, shop_name: "Fashion Hub" },
  { id: 4, shop_name: "Kids & Pets Boutique" },
  { id: 5, shop_name: "Urban Streetwear" },
];

const categories: Category[] = [
  { id: 1, name: "Pet Accessories" },
  { id: 2, name: "Baby Clothing" },
  { id: 3, name: "Men's Fashion" },
  { id: 4, name: "Women's Fashion" },
  { id: 5, name: "Footwear" },
  { id: 6, name: "Casual Wear" },
];

const products: Product[] = [
  // Pet Accessories - Kids & Pets Boutique
  {
    id: 10,
    name: "Premium Dog Sweater Winter Collection",
    description:
      "Hangat dan nyaman untuk anjing kesayangan Anda. Cocok untuk anjing ukuran kecil hingga sedang. Bahan premium wool blend.",
    price: 299000,
    stock: 50,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/dog-sweater-1_wotfkk.png",
    seller_id: 4,
    category: { id: 1, name: "Pet Accessories" },
  },

  // Baby Clothing - Kids & Pets Boutique
  {
    id: 11,
    name: "Organic Cotton Baby Romper",
    description:
      "Romper bayi dari 100% katun organik. Lembut di kulit bayi. Tersedia untuk usia 0-24 bulan.",
    price: 189000,
    stock: 100,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/baby-onesie-beige-1_tojjri.png",
    seller_id: 4,
    category: { id: 2, name: "Baby Clothing" },
  },

  // Men's Fashion - Urban Streetwear
  {
    id: 12,
    name: "Streetwear Hoodie Premium",
    description:
      "Hoodie streetwear dengan desain modern. Bahan cotton fleece berkualitas tinggi. Nyaman dipakai sehari-hari.",
    price: 459000,
    stock: 75,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 5,
    category: { id: 3, name: "Men's Fashion" },
  },

  // Women's Fashion - Fashion Hub
  {
    id: 13,
    name: "Basic White Tee Women",
    description:
      "Kaos putih basic wanita dengan bahan premium cotton. Potongan slim fit yang nyaman. Pre-shrunk fabric.",
    price: 159000,
    stock: 200,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-1_bhbzsp.png",
    seller_id: 3,
    category: { id: 4, name: "Women's Fashion" },
  },

  // Casual Wear - Urban Streetwear
  {
    id: 14,
    name: "Limited Edition Artist Collab Tee",
    description:
      "Kaos edisi terbatas hasil kolaborasi dengan seniman lokal. Desain spiral unik. Numbered edition.",
    price: 299000,
    stock: 60,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
    seller_id: 5,
    category: { id: 6, name: "Casual Wear" },
  },

  // Footwear - Fashion Hub
  {
    id: 15,
    name: "Comfort Plus Sneakers",
    description:
      "Sneakers dengan teknologi comfort plus. Sol empuk dan breathable. Cocok untuk aktivitas sehari-hari.",
    price: 899000,
    stock: 40,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/shoes-1_zwm8do.png",
    seller_id: 3,
    category: { id: 5, name: "Footwear" },
  },

  // Men's Fashion - Fashion Hub
  {
    id: 16,
    name: "Essential Black T-Shirt Men",
    description:
      "Kaos hitam essential untuk pria. Bahan cotton combed 30s. Jahitan rapi dan awet.",
    price: 179000,
    stock: 150,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-color-black_hvcfme.png",
    seller_id: 3,
    category: { id: 3, name: "Men's Fashion" },
  },
  // Pet Accessories - Kids & Pets Boutique
  {
    id: 17,
    name: "Luxury Pet Bed",
    description:
      "Tempat tidur anjing atau kucing mewah dengan bantal empuk. Bahan beludru halus, mudah dicuci.",
    price: 350000,
    stock: 30,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 1, name: "Pet Accessories" },
  },
  // Women's Fashion - Fashion Hub
  {
    id: 18,
    name: "Elegant Summer Dress",
    description:
      "Dress musim panas elegan dengan motif bunga. Bahan rayon adem dan tidak mudah kusut.",
    price: 320000,
    stock: 90,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 3,
    category: { id: 4, name: "Women's Fashion" },
  },
  // id: 19–30
  {
    id: 19,
    name: "Denim Jacket Classic Fit",
    description:
      "Jaket denim klasik dengan potongan regular fit. Cocok untuk gaya kasual sehari-hari.",
    price: 499000,
    stock: 60,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 5,
    category: { id: 3, name: "Men's Fashion" },
  },
  {
    id: 20,
    name: "Fluffy Bunny Baby Blanket",
    description:
      "Selimut bayi super lembut dengan motif kelinci. Ukuran 80x100 cm.",
    price: 199000,
    stock: 80,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 2, name: "Baby Clothing" },
  },
  {
    id: 21,
    name: "Breathable Mesh Pet Carrier",
    description:
      "Tas carrier untuk hewan kecil, desain ergonomis dengan ventilasi optimal.",
    price: 459000,
    stock: 40,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 1, name: "Pet Accessories" },
  },
  {
    id: 22,
    name: "Casual Slip-On Shoes",
    description:
      "Sepatu slip-on ringan dan stylish. Cocok untuk gaya kasual maupun semi-formal.",
    price: 349000,
    stock: 70,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 3,
    category: { id: 5, name: "Footwear" },
  },
  {
    id: 23,
    name: "Basic Baby Bodysuit 3-Pack",
    description:
      "Paket isi 3 bodysuit bayi. Bahan katun lembut dan breathable.",
    price: 149000,
    stock: 100,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 2, name: "Baby Clothing" },
  },
  {
    id: 24,
    name: "Vintage Graphic Tee Unisex",
    description:
      "Kaos unisex dengan desain vintage. Bahan premium combed cotton.",
    price: 229000,
    stock: 90,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 5,
    category: { id: 6, name: "Casual Wear" },
  },
  {
    id: 25,
    name: "Mini Sneakers for Babies",
    description: "Sepatu bayi dengan sol lembut. Mudah dipakai dan nyaman.",
    price: 99000,
    stock: 120,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 2, name: "Baby Clothing" },
  },
  {
    id: 26,
    name: "Boho Maxi Dress Women",
    description:
      "Dress panjang bergaya boho. Cocok untuk acara santai dan pesta taman.",
    price: 379000,
    stock: 55,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 3,
    category: { id: 4, name: "Women's Fashion" },
  },
  {
    id: 27,
    name: "High-Top Canvas Sneakers",
    description:
      "Sneakers high-top dengan desain klasik. Tersedia dalam berbagai ukuran.",
    price: 419000,
    stock: 45,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 3,
    category: { id: 5, name: "Footwear" },
  },
  {
    id: 28,
    name: "Oversized Hoodie Unisex",
    description: "Hoodie oversized unisex, bahan fleece tebal dan lembut.",
    price: 399000,
    stock: 70,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 5,
    category: { id: 6, name: "Casual Wear" },
  },
  {
    id: 29,
    name: "Raincoat for Pets",
    description:
      "Jas hujan ringan dan tahan air untuk anjing/kucing kecil. Dengan hoodie.",
    price: 199000,
    stock: 65,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 4,
    category: { id: 1, name: "Pet Accessories" },
  },
  {
    id: 30,
    name: "Women's Basic Leggings",
    description:
      "Legging basic untuk wanita, bahan elastis dan breathable. Cocok untuk yoga atau kasual.",
    price: 159000,
    stock: 110,
    image_url:
      "https://res.cloudinary.com/dyacollection/image/upload/v1750585928/hoodie-1_npaenx.png",
    seller_id: 3,
    category: { id: 4, name: "Women's Fashion" },
  },
];

app.get("/", (c) => {
  return c.text(`
Welcome to the Hono API!

Available Routes:
GET    /api/categories - Get all categories with sellers
GET    /api/categories/:id - Get category by ID
GET    /api/products - Get all products with optional category filter, grouped by seller
GET    /api/products/:id - Get product by ID
`);
});

// Get all categories with sellers
app.get("/api/categories", (c) => {
  // Create mapping of categories to sellers
  const sellersWithCategories: SellerWithCategories[] = sellers.map(
    (seller) => {
      const sellerProducts = products.filter((p) => p.seller_id === seller.id);
      const uniqueCategories = sellerProducts
        .map((p) => p.category)
        .filter(
          (cat, index, self) =>
            cat !== undefined &&
            self.findIndex((c) => c?.id === cat?.id) === index
        );

      return {
        seller_id: seller.id,
        shop_name: seller.shop_name,
        categories: uniqueCategories as Category[],
      };
    }
  );

  return c.json({
    message: "Sellers with categories retrieved successfully",
    data: sellersWithCategories,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: sellersWithCategories.length,
      total: sellersWithCategories.length,
    },
  });
});

// Get category by ID
app.get("/api/categories/:id", (c) => {
  const id = parseInt(c.req.param("id"));
  const category = categories.find((cat) => cat.id === id);

  if (!category) {
    return c.json({ message: "Category not found" }, 404);
  }

  // Find sellers that have products in this category
  const sellersWithCategory = sellers.filter((seller) =>
    products.some((p) => p.seller_id === seller.id && p.category?.id === id)
  );

  const enrichedCategory = {
    ...category,
    sellers: sellersWithCategory,
  };

  return c.json({
    message: "Category retrieved successfully",
    data: enrichedCategory,
  });
});

// Get all products with optional category filter, grouped by seller
app.get("/api/products", (c) => {
  const categoryId = parseInt(c.req.query("category_id") || "");

  // Filter produk sesuai category_id (jika ada)
  const filteredProducts = isNaN(categoryId)
    ? products
    : products.filter((p) => p.category?.id === categoryId);

  // Get unique seller IDs using filter
  const uniqueSellerIds = filteredProducts
    .map((p) => p.seller_id)
    .filter(
      (id, index, self) => id !== undefined && self.indexOf(id) === index
    );

  const sellersWithProducts: SellerWithProducts[] = uniqueSellerIds
    .map((sellerId) => {
      const seller = sellers.find((s) => s.id === sellerId);
      if (!seller) return null;

      return {
        seller_id: seller.id,
        shop_name: seller.shop_name,
        products: filteredProducts
          .filter((p) => p.seller_id === seller.id)
          .map(({ id, name, price, image_url }) => ({
            id,
            name,
            price,
            image_url,
          })),
      };
    })
    .filter(Boolean) as SellerWithProducts[];

  return c.json({
    message: "Sellers with products retrieved successfully",
    data: sellersWithProducts,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: sellersWithProducts.length,
      total: filteredProducts.length,
    },
  });
});

// Get product by ID
app.get("/api/products/:id", (c) => {
  const id = c.req.param("id");
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return c.json({ message: "Product not found" }, 404);
  }

  const enrichedProduct = {
    ...product,
    seller: sellers.find((s) => s.id === product.seller_id),
    category: product.category || { id: 0, name: "Uncategorized" },
  };

  return c.json({
    message: "Product retrieved successfully",
    data: enrichedProduct,
  });
});

// Get products by seller ID
app.get("/api/sellers/:id/products", (c) => {
  const sellerId = parseInt(c.req.param("id"));
  const seller = sellers.find((s) => s.id === sellerId);

  if (!seller) {
    return c.json({ message: "Seller not found" }, 404);
  }

  const sellerProducts = products
    .filter((p) => p.seller_id === sellerId)
    .map(({ id, name, price, image_url }) => ({
      id,
      name,
      price,
      image_url,
    }));

  return c.json({
    message: `Products retrieved successfully for seller ${sellerId}`,
    data: {
      seller_id: sellerId,
      shop_name: seller.shop_name,
      products: sellerProducts,
    },
  });
});

export default {
  port: 3003,
  fetch: app.fetch,
};
console.log(getRouterName(app));
