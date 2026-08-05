export const catalogTree = [
  { name: "Гели для моделирования ногтей", subcategories: ["Гели с эффектами", "Камуфлирующие", "Гель-желе"] },
  { name: "Гель-лак", subcategories: ["Трёхфазный", "Кошачий глаз", "С эффектами"] },
  { name: "Топы", subcategories: ["Глянцевый", "Матовый", "Вельветовый", "С эффектом", "Камуфлирующий"] },
  { name: "Оборудование", subcategories: ["Лампы", "Аппараты", "Фонарики"] },
  { name: "Декор", subcategories: ["База-клей", "Архитектурная база", "Гель-краска", "Текстурный гель"] },
  { name: "Полигели", subcategories: ["Жидкие", "Камуфлирующие", "С шиммером"] },
  { name: "Акригели", subcategories: ["Камуфлирующие", "С эффектом"] },
  { name: "Инструменты", subcategories: ["Фрезы", "Пилки", "Ножницы", "Кусачки"] },
  { name: "Кисти", subcategories: ["Для геля", "Для акригеля", "Для дизайна", "Для гель-лака"] },
  { name: "Жидкости", subcategories: ["Обезжириватель"] },
  { name: "Уходовые средства", subcategories: ["Пенка", "Сухое масло", "Крем", "Молочко", "Мист"] },
] as const;

export type CatalogCategory = typeof catalogTree[number]["name"] | "Наборы";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  collection: "Mousse" | "Glow Cat" | "Ice Cat";
  category: CatalogCategory;
  subcategory: string;
  shade: string;
  colorGroup: string;
  effect: string;
  volume: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge: "Хит" | "Новинка" | "Sale";
  stock: number;
  description: string;
  features: string[];
  wbUrl: string;
  ozonUrl: string | null;
  wbPrice: number;
  ozonPrice: number | null;
  marketplaceUpdatedAt: string;
};

const mousseDescription =
  "Плотный моделирующий гель из нюдовой коллекции Mousse. Подходит для укрепления натуральных ногтей, моделирования, донаращивания углов и ремонта формы.";
const iceDescription =
  "Жидкий полигель с эффектом шелковой кошки: сочетает удобство моделирования и мягкий перелив с морозным сиянием.";

type ProductRow = [
  string,
  string,
  string,
  string,
  Product["collection"],
  CatalogCategory,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  Product["badge"],
];

const rows: ProductRow[] = [
  ["945458176", "mousse-01", "Гель для наращивания и моделирования ногтей №1", "Mousse 01", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "01", "Молочный", "Плотный нюд", "15 мл", 646, 1600, 4.8, 382, "Хит"],
  ["945490950", "mousse-03", "Гель для наращивания и моделирования ногтей №3", "Mousse 03", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "03", "Бежевый", "Плотный нюд", "15 мл", 646, 1600, 4.8, 69, "Sale"],
  ["945494162", "mousse-05", "Гель для наращивания и моделирования ногтей №5", "Mousse 05", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "05", "Розовый", "Плотный нюд", "15 мл", 646, 1600, 4.8, 186, "Хит"],
  ["945498412", "mousse-06", "Гель для наращивания и моделирования ногтей №6", "Mousse 06", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "06", "Розовый", "Плотный нюд", "15 мл", 646, 1600, 4.9, 237, "Хит"],
  ["945498414", "mousse-08", "Гель для наращивания и моделирования ногтей №8", "Mousse 08", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "08", "Розовый", "Плотный нюд", "15 мл", 646, 1600, 4.9, 150, "Sale"],
  ["945498416", "mousse-10", "Гель для наращивания и моделирования ногтей №10", "Mousse 10", "Mousse", "Гели для моделирования ногтей", "Камуфлирующие", "10", "Коричневый", "Плотный нюд", "15 мл", 646, 1600, 4.9, 88, "Хит"],
  ["1046546817", "mousse-set-6", "Набор гелей для наращивания 6 шт 15 мл", "Mousse — набор 6", "Mousse", "Наборы", "Наборы коллекции", "01–10", "Нюд", "Плотный нюд", "6 × 15 мл", 1742, 2600, 4.8, 97, "Хит"],
  ["1046570904", "mousse-set-4", "Набор гелей для наращивания 4 шт 15 мл", "Mousse — набор 4", "Mousse", "Наборы", "Наборы коллекции", "01–08", "Нюд", "Плотный нюд", "4 × 15 мл", 1206, 1900, 4.9, 113, "Sale"],
  ["1141151914", "glow-cat-01", "Гель-лак для ногтей кошачий глаз №01", "Glow Cat 01", "Glow Cat", "Гель-лак", "Кошачий глаз", "01", "Сиреневый", "Шелковая кошка", "10 мл", 500, 1000, 5, 90, "Новинка"],
  ["1272097452", "ice-cat-01", "Жидкий полигель для ногтей кошачий глаз №01", "Ice Cat 01", "Ice Cat", "Полигели", "Жидкие", "01", "Бежевый", "Кошачий глаз", "15 мл", 519, 1000, 5, 1, "Новинка"],
  ["1272137939", "ice-cat-02", "Жидкий полигель для ногтей кошачий глаз №02", "Ice Cat 02", "Ice Cat", "Полигели", "Жидкие", "02", "Бежевый", "Кошачий глаз", "15 мл", 519, 1000, 5, 3, "Новинка"],
  ["1272155829", "ice-cat-03", "Жидкий полигель для ногтей кошачий глаз №03", "Ice Cat 03", "Ice Cat", "Полигели", "Жидкие", "03", "Розовый", "Кошачий глаз", "15 мл", 519, 1000, 5, 2, "Новинка"],
  ["1272182962", "ice-cat-04", "Жидкий полигель для ногтей кошачий глаз №04", "Ice Cat 04", "Ice Cat", "Полигели", "Жидкие", "04", "Розовый", "Кошачий глаз", "15 мл", 519, 1000, 5, 1, "Новинка"],
  ["1272203422", "ice-cat-05", "Жидкий полигель для ногтей кошачий глаз №05", "Ice Cat 05", "Ice Cat", "Полигели", "Жидкие", "05", "Фиолетовый", "Кошачий глаз", "15 мл", 519, 1000, 5, 1, "Новинка"],
  ["1272216875", "ice-cat-06", "Жидкий полигель для ногтей кошачий глаз №06", "Ice Cat 06", "Ice Cat", "Полигели", "Жидкие", "06", "Синий", "Кошачий глаз", "15 мл", 519, 1000, 5, 2, "Новинка"],
  ["1301619545", "ice-cat-set", "Жидкий полигель для ногтей набор 6 шт", "Ice Cat — набор 6", "Ice Cat", "Наборы", "Наборы коллекции", "01–06", "Мульти", "Кошачий глаз", "6 × 15 мл", 962, 1000, 0, 0, "Новинка"],
];

export const products: Product[] = rows.map((row, index) => {
  const [id, slug, name, shortName, collection, category, subcategory, shade, colorGroup, effect, volume, price, oldPrice, rating, reviews, badge] = row;
  return {
    id,
    slug,
    name,
    shortName,
    collection,
    category,
    subcategory,
    shade,
    colorGroup,
    effect,
    volume,
    price,
    oldPrice,
    rating,
    reviews,
    badge,
    image: `/products/${id}.webp`,
    stock: 12 + index * 3,
    description: collection === "Mousse" ? mousseDescription : collection === "Ice Cat" ? iceDescription : "Гель-лак с эффектом шелковой кошки и деликатными вкраплениями, которые дают выразительный перелив даже в минималистичном дизайне.",
    features: collection === "Mousse" ? ["Плотное покрытие с первого слоя", "Оптимальная консистенция", "Комфортная текстура для моделирования"] : ["Эффект шелковой кошки", "Для моделирования и укрепления", "Полимеризация в LED/UV-лампе"],
    wbUrl: `https://www.wildberries.ru/catalog/${id}/detail.aspx`,
    ozonUrl: null,
    wbPrice: price,
    ozonPrice: null,
    marketplaceUpdatedAt: "04.08.2026",
  };
});

export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const formatPrice = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
export const pluralize = (count: number, one: string, few: string, many: string) => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
};
export const productCountLabel = (count: number) => `${count} ${pluralize(count, "товар", "товара", "товаров")}`;
export const reviewCountLabel = (count: number) => `${count} ${pluralize(count, "отзыв", "отзыва", "отзывов")}`;

export const categories = [
  { name: "Гели", count: products.filter((p) => p.category === "Гели для моделирования ногтей").length, image: "/products/945498416.webp", href: "/catalog?category=Гели%20для%20моделирования%20ногтей" },
  { name: "Гель-лаки", count: products.filter((p) => p.category === "Гель-лак").length, image: "/products/1141151914.webp", href: "/catalog?category=Гель-лак" },
  { name: "Полигели", count: products.filter((p) => p.category === "Полигели").length, image: "/products/1272182962.webp", href: "/catalog?category=Полигели" },
  { name: "Наборы", count: products.filter((p) => p.category === "Наборы").length, image: "/products/1301619545.webp", href: "/catalog?category=Наборы" },
];
