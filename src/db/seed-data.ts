import type { ProductColor, ProductSize } from "./schema";

/** Меняйте версию, чтобы принудительно пересоздать демо-данные */
export const SEED_VERSION = "ru-2";

const px = (id: number, ext: "jpeg" | "png" = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop`;

export const IMG = {
  heroMen: px(28701960),
  heroWomen: px(30283474),
  heroKicks: "/images/hero-kicks.jpg",
  men: px(15127546),
  women: px(16217479, "png"),
  sale: "/images/drop-04.jpg",
  insta: [
    px(19405817),
    px(20267233),
    px(16452611),
    px(18804994),
    px(29817648),
    px(15213181),
  ],
};

const EU = (stocks: number[]): ProductSize[] =>
  ["39", "40", "41", "42", "43", "44", "45", "46"].map((label, i) => ({
    label,
    stock: stocks[i] ?? 0,
  }));

const APP = (stocks: number[]): ProductSize[] =>
  ["XS", "S", "M", "L", "XL", "XXL"].map((label, i) => ({
    label,
    stock: stocks[i] ?? 0,
  }));

const ONE: ProductSize[] = [{ label: "ONE SIZE", stock: 24 }];

const C = {
  black: { name: "Чёрный", hex: "#111111" },
  white: { name: "Белый", hex: "#F5F5F5" },
  red: { name: "Красный", hex: "#E50000" },
  grey: { name: "Серый", hex: "#9A9A9E" },
  cream: { name: "Кремовый", hex: "#E8DFCF" },
  navy: { name: "Тёмно-синий", hex: "#1B2440" },
  olive: { name: "Хаки", hex: "#5A5F42" },
  blue: { name: "Синий", hex: "#3B5BA5" },
} satisfies Record<string, ProductColor>;

export type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  shortDescription: string;
  description: string;
  material: string;
  care: string;
  price: number;
  oldPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
};

const care =
  "Машинная стирка при 30°C с похожими цветами. Не отбеливать. Сушка при низкой температуре. Гладить тёплым утюгом. Химчистка запрещена.";

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "air-force-1-07-triple-white",
    name: "Air Force 1 '07 Triple White",
    brand: "Nike",
    category: "sneakers",
    gender: "unisex",
    shortDescription:
      "Классические белые кожаные кроссовки с амортизацией Nike Air и легендарным баскетбольным силуэтом.",
    description:
      "Легенда, которая живёт вечно. AF-1 '07 сохраняет баскетбольную ДНК оригинала: плотная кожа с крупной фактурой, мягкий низкий воротник и перфорация на мыске. Вставка Nike Air в пятке гасит удары весь день, а подошва с круговым протектором цепляется за любую поверхность — от паркета до асфальта.",
    material: "Верх из натуральной кожи, резиновая подошва, промежуточная подошва из пены с капсулой Nike Air.",
    care: "Протирайте мягкой влажной тканью. Сушите вдали от батарей. Раз в месяц обрабатывайте защитной пропиткой для кожи.",
    price: 11900,
    oldPrice: 14900,
    images: [px(19869759), px(19869753), px(19166246), px(27113471)],
    colors: [C.white, C.black, C.red],
    sizes: EU([6, 12, 18, 24, 20, 9, 3, 0]),
    rating: 48,
    reviewCount: 256,
    isBestseller: true,
  },
  {
    slug: "samba-og-cloud-cobalt",
    name: "Samba OG Cloud Cobalt",
    brand: "Adidas",
    category: "sneakers",
    gender: "unisex",
    shortDescription: "Икона футбольных трибун в кобальтовой замше и на камедевой подошве.",
    description:
      "Рождённые на поле, принятые улицей. Samba OG сохраняет низкий кожаный верх, замшевую накладку на мыске и камедевую подошву, которые сделали модель культовой. В новом кобальтовом цвете кроссовки работают акцентом в любом образе.",
    material: "Верх из кожи с замшевыми накладками, текстильная подкладка, камедевая резиновая подошва.",
    care: "Чистите замшу мягкой щёткой. Точечно удаляйте загрязнения влажной тканью. Не стирайте в машине.",
    price: 9900,
    images: [px(19869753), px(19869759), px(27113470)],
    colors: [C.blue, C.white, C.black],
    sizes: EU([10, 14, 16, 22, 18, 6, 2, 0]),
    rating: 47,
    reviewCount: 189,
    isBestseller: true,
    isNew: true,
  },
  {
    slug: "suede-classic-xxi-black",
    name: "Suede Classic XXI",
    brand: "Puma",
    category: "sneakers",
    gender: "unisex",
    shortDescription: "Икона 1968 года: мягкая замша, фирменная полоса и комфорт на каждый день.",
    description:
      "Мало какие кроссовки несут столько культурного веса, сколько Puma Suede. От брейк-дансеров до спринтеров — силуэт переизобретали пять десятилетий подряд. Версия XXI получила стельку SoftFoam+, сохранив плюшевый замшевый верх и узнаваемую боковую полосу.",
    material: "Замшевый верх, стелька SoftFoam+, резиновая подошва.",
    care: "Регулярно чистите замшу щёткой. Не замачивайте. Храните с распорками.",
    price: 7500,
    oldPrice: 9500,
    images: [px(19166246), px(27256470), px(19869759)],
    colors: [C.black, C.red, C.grey],
    sizes: EU([8, 12, 14, 18, 12, 5, 0, 0]),
    rating: 45,
    reviewCount: 132,
  },
  {
    slug: "990v6-made-in-usa-grey",
    name: "990v6 Made in USA",
    brand: "New Balance",
    category: "sneakers",
    gender: "unisex",
    shortDescription: "Премиальная замша, пена FuelCell и статус главной «дэд-шуз» модели.",
    description:
      "Линейка 990 остаётся тихим флексом с 1982 года. Шестая версия получила промежуточную подошву FuelCell для отзывчивого хода, систему поддержки ENCAP и верх из сетки и свиной замши. Серый цвет не выйдет из моды никогда.",
    material: "Верх из свиной замши и инженерной сетки, пена FuelCell, промежуточная подошва ENCAP.",
    care: "Мойте мягким мылом и щёткой. Сушите только на воздухе.",
    price: 21500,
    images: [px(27113471), px(19882424), px(19166246)],
    colors: [C.grey, C.black, C.navy],
    sizes: EU([4, 8, 12, 16, 14, 8, 4, 2]),
    rating: 49,
    reviewCount: 311,
    isBestseller: true,
  },
  {
    slug: "old-skool-classic-black",
    name: "Old Skool Classic",
    brand: "Vans",
    category: "sneakers",
    gender: "unisex",
    shortDescription: "Оригинальные скейтовые кеды с боковой полосой и вафельной подошвой.",
    description:
      "Сначала модель называлась Style 36 и стала первой парой Vans с фирменной боковой полосой. Прочный верх из канваса и замши, усиленный мысок и вафельная резиновая подошва делают кеды такими же катабельными, как в 1977-м.",
    material: "Верх из канваса и замши, мягкий воротник, вафельная резиновая подошва.",
    care: "Можно стирать в машине на холодном деликатном режиме. Сушить на воздухе.",
    price: 6900,
    oldPrice: 8500,
    images: [px(27256470), px(19882430), px(19166246)],
    colors: [C.black, C.white],
    sizes: EU([9, 14, 20, 22, 15, 7, 2, 0]),
    rating: 46,
    reviewCount: 204,
    isBestseller: true,
  },
  {
    slug: "chuck-70-hi-parchment",
    name: "Chuck 70 Hi Parchment",
    brand: "Converse",
    category: "sneakers",
    gender: "unisex",
    shortDescription: "Наследие в канвасе: высокие кеды с улучшенной амортизацией.",
    description:
      "Модель повторяет оригинал 1970-х и улучшает всё, что вы любите: более плотный канвас, высокая резиновая окантовка, глянцевая промежуточная подошва и стелька OrthoLite для комфорта на весь день.",
    material: "Канвас 12 унций, амортизирующая стелька OrthoLite, вулканизированная резиновая подошва.",
    care: "Точечная чистка тёплой водой с мягким средством. Сушить на воздухе.",
    price: 8500,
    images: [px(19882430), px(19882433), px(27100548)],
    colors: [C.cream, C.black, C.white],
    sizes: EU([6, 10, 14, 16, 12, 6, 0, 0]),
    rating: 45,
    reviewCount: 98,
    isNew: true,
  },
  {
    slug: "runner-mesh-volt-flash",
    name: "Runner Mesh Volt Flash",
    brand: "Nike",
    category: "sneakers",
    gender: "women",
    shortDescription: "Лёгкие беговые кроссовки из сетки в неоновом цвете.",
    description:
      "Созданы для темпа, стилизованы для улицы. Дышащая инженерная сетка держит прохладу, а профилированная пена в подошве даёт мягкий и пружинистый отклик.",
    material: "Верх из инженерной сетки, промежуточная подошва EVA, резиновые вставки.",
    care,
    price: 10900,
    oldPrice: 13900,
    images: [px(19882433), px(19882424), px(27100548)],
    colors: [C.white, C.red, C.grey],
    sizes: EU([10, 16, 18, 12, 6, 0, 0, 0]),
    rating: 44,
    reviewCount: 76,
    isNew: true,
  },
  {
    slug: "court-leather-lowtop-mono",
    name: "Court Leather Low Mono",
    brand: "Adidas",
    category: "sneakers",
    gender: "men",
    shortDescription: "Минималистичные полностью чёрные кожаные кеды для чистых образов.",
    description:
      "Сдержанный кортовый силуэт в тональной чёрной коже. Перфорированные три полосы не кричат, но остаются узнаваемыми, а конструкция на резиновой подошве добавляет прочности.",
    material: "Кожаный верх, текстильная подкладка, резиновая подошва.",
    care: "Протирайте влажной тканью. Раз в месяц используйте кондиционер для кожи.",
    price: 8900,
    images: [px(19166246), px(27113470), px(19869753)],
    colors: [C.black, C.white],
    sizes: EU([5, 9, 15, 19, 16, 8, 3, 0]),
    rating: 44,
    reviewCount: 64,
  },

  {
    slug: "heavyweight-boxy-hoodie-black",
    name: "Худи Heavyweight Boxy",
    brand: "Sneak&Street",
    category: "hoodies",
    gender: "unisex",
    shortDescription: "Футер 480 г/м² с начёсом, спущенное плечо и прямой boxy-крой.",
    description:
      "Наше флагманское худи. Сшито из петельного футера плотностью 480 г/м² с начёсом, со спущенным плечом, двойным капюшоном и плотными рёберными манжетами. Окрашивание в готовом виде даёт глубокий оттенок, который только выигрывает со временем.",
    material: "100% органический хлопок, футер 480 г/м² с начёсом.",
    care,
    price: 8900,
    oldPrice: 11900,
    images: [px(28701960), px(14241847), px(15127546)],
    colors: [C.black, C.cream, C.olive],
    sizes: APP([8, 22, 30, 26, 14, 6]),
    rating: 49,
    reviewCount: 412,
    isBestseller: true,
  },
  {
    slug: "arch-logo-hoodie-navy",
    name: "Худи Arch Logo",
    brand: "Stüssy",
    category: "hoodies",
    gender: "men",
    shortDescription: "Объёмный пафф-принт с аркой логотипа на футере средней плотности.",
    description:
      "Классическое худи через голову с объёмным пафф-принтом на груди. Футер средней плотности носится круглый год, посадка свободная и соответствует размеру.",
    material: "80% хлопок / 20% полиэстер, футер 380 г/м².",
    care,
    price: 12500,
    images: [px(19461567), px(28701960), px(8782539)],
    colors: [C.navy, C.black, C.grey],
    sizes: APP([4, 14, 20, 18, 10, 4]),
    rating: 47,
    reviewCount: 143,
    isBestseller: true,
  },
  {
    slug: "cropped-zip-hoodie-white",
    name: "Укороченное худи на молнии",
    brand: "Sneak&Street",
    category: "hoodies",
    gender: "women",
    shortDescription: "Кроп-худи на молнии с необработанным низом.",
    description:
      "Модель садится точно на талию и легко надевается поверх любого образа. Мягкий футер, молния YKK и необработанный край снизу для небрежного финиша.",
    material: "Футер с высоким содержанием хлопка, 340 г/м².",
    care,
    price: 7900,
    oldPrice: 9900,
    images: [px(30283474), px(30690916), px(16217479, "png")],
    colors: [C.white, C.black, C.grey],
    sizes: APP([12, 20, 24, 16, 6, 0]),
    rating: 46,
    reviewCount: 88,
    isNew: true,
  },
  {
    slug: "tech-fleece-halfzip-grey",
    name: "Свитшот Tech Fleece на молнии",
    brand: "Nike",
    category: "hoodies",
    gender: "men",
    shortDescription: "Лёгкий термофлис в современном крое с молнией до середины груди.",
    description:
      "Nike Tech Fleece — лёгкий, тёплый и мгновенно узнаваемый материал. Версия с короткой молнией получила воротник-стойку и упрощённые швы для более чёткого силуэта.",
    material: "Nike Tech Fleece: 66% хлопок / 34% полиэстер.",
    care,
    price: 13500,
    images: [px(29817648), px(16282403), px(19461567)],
    colors: [C.grey, C.black],
    sizes: APP([3, 10, 16, 14, 8, 3]),
    rating: 47,
    reviewCount: 121,
    isNew: true,
  },

  {
    slug: "blank-heavy-tee-off-white",
    name: "Футболка Blank Heavy",
    brand: "Sneak&Street",
    category: "tshirts",
    gender: "unisex",
    shortDescription: "Плотная футболка 240 г/м² с воротником, который не растягивается.",
    description:
      "Основа любого образа. Плотный кардный хлопок 240 г/м², прямой корпус, широкая рёберная горловина и слегка спущенное плечо. Ткань декатирована, поэтому размер сохраняется после каждой стирки.",
    material: "100% кардный хлопок, 240 г/м².",
    care,
    price: 3500,
    images: [px(14786536), px(13562801), px(5771897)],
    colors: [C.white, C.black, C.cream],
    sizes: APP([14, 30, 40, 34, 20, 10]),
    rating: 48,
    reviewCount: 367,
    isBestseller: true,
  },
  {
    slug: "graphic-tee-city-index",
    name: "Футболка City Index",
    brand: "Sneak&Street",
    category: "tshirts",
    gender: "unisex",
    shortDescription: "Шелкография на спине на плотном хлопке.",
    description:
      "Полноразмерный принт на спине со списком городов, сформировавших уличную культуру. Печать на водной основе становится мягче с каждой стиркой, база — наш фирменный плотный хлопок.",
    material: "100% хлопок, 220 г/м², печать на водной основе.",
    care,
    price: 4500,
    oldPrice: 5900,
    images: [px(13562801), px(14786536), px(5771897)],
    colors: [C.black, C.white],
    sizes: APP([10, 22, 28, 24, 12, 4]),
    rating: 45,
    reviewCount: 92,
  },
  {
    slug: "baby-tee-ribbed-black",
    name: "Топ в рубчик Baby Tee",
    brand: "Sneak&Street",
    category: "tshirts",
    gender: "women",
    shortDescription: "Эластичный топ в рубчик с укороченной посадкой.",
    description:
      "Приталенный топ из ткани в рубчик с укороченным корпусом и коротким рукавом. Сочетается со всем — от карго до юбок в бельевом стиле.",
    material: "95% хлопок / 5% эластан, рубчик.",
    care,
    price: 2900,
    images: [px(18804994), px(18805002), px(16217479, "png")],
    colors: [C.black, C.white, C.red],
    sizes: APP([16, 24, 22, 12, 4, 0]),
    rating: 44,
    reviewCount: 57,
    isNew: true,
  },
  {
    slug: "longsleeve-skate-tee-grey",
    name: "Лонгслив Skate",
    brand: "Vans",
    category: "tshirts",
    gender: "men",
    shortDescription: "Лонгслив с принтами на рукавах и свободным корпусом.",
    description:
      "Сделан для катания. Усиленные швы, свободный корпус и печатные принты на рукавах в духе скейтовой графики 90-х.",
    material: "100% хлопковый джерси, 200 г/м².",
    care,
    price: 3900,
    images: [px(5771897), px(14786536), px(13562801)],
    colors: [C.grey, C.black],
    sizes: APP([6, 16, 20, 18, 10, 4]),
    rating: 43,
    reviewCount: 41,
  },

  {
    slug: "wide-leg-denim-raw-indigo",
    name: "Джинсы Wide Leg Raw Indigo",
    brand: "Carhartt WIP",
    category: "jeans",
    gender: "men",
    shortDescription: "Жёсткий деним 14 унций с широкой штаниной от бедра до низа.",
    description:
      "Настоящий широкий крой из жёсткого японского денима плотностью 14 унций. Высокая посадка, глубокий шаговый шов и широкий низ, который красиво ложится стеком на массивных кроссовках.",
    material: "100% хлопок, жёсткий деним 14 унций.",
    care: "Стирайте наизнанку в холодной воде, сушите на вешалке. Стирайте реже, чтобы сохранить потёртости.",
    price: 12900,
    images: [px(38561616), px(19115350), px(18533668)],
    colors: [C.blue, C.black],
    sizes: APP([4, 12, 18, 16, 9, 3]),
    rating: 46,
    reviewCount: 108,
    isBestseller: true,
  },
  {
    slug: "baggy-carpenter-jean-washed-black",
    name: "Джинсы Baggy Carpenter",
    brand: "Carhartt WIP",
    category: "jeans",
    gender: "unisex",
    shortDescription: "Рабочие джинсы с петлёй для молотка и стираным финишем.",
    description:
      "Корни ворквира, силуэт улицы. Свободные в бедре, с утилитарной петлёй для инструмента, двойными накладками на коленях и мягким чёрным стираным оттенком.",
    material: "100% хлопковый деним, 12,5 унций, каменная стирка.",
    care,
    price: 11500,
    oldPrice: 14500,
    images: [px(19115350), px(38561616), px(18533668)],
    colors: [C.black, C.blue],
    sizes: APP([5, 14, 16, 14, 8, 2]),
    rating: 45,
    reviewCount: 73,
  },
  {
    slug: "low-rise-straight-jean-mid-blue",
    name: "Джинсы Low Rise Straight",
    brand: "Sneak&Street",
    category: "jeans",
    gender: "women",
    shortDescription: "Y2K: низкая посадка и прямая штанина в среднем синем оттенке.",
    description:
      "Прямиком из архивов 2003 года. Низкая посадка, прямая штанина и средний синий цвет с деликатными вискерами. Длина с запасом — можно носить стеком или подворачивать.",
    material: "99% хлопок / 1% эластан.",
    care,
    price: 8900,
    images: [px(18213428), px(19115350), px(27113471)],
    colors: [C.blue, C.black],
    sizes: APP([12, 18, 20, 12, 5, 0]),
    rating: 44,
    reviewCount: 64,
    isNew: true,
  },

  {
    slug: "varsity-bomber-jacket-black",
    name: "Бомбер Varsity",
    brand: "Sneak&Street",
    category: "jackets",
    gender: "unisex",
    shortDescription: "Шерстяной корпус, рукава под кожу и шенилловые нашивки.",
    description:
      "Университетский бомбер, собранный заново. Корпус из шерстяного мельтона, контрастные рукава под кожу, рёберные манжеты и шенилловые нашивки на груди. Стёганая подкладка держит тепло в межсезонье.",
    material: "Корпус из шерстяной смеси, рукава из ПУ, стёганая полиэстеровая подкладка.",
    care: "Только химчистка.",
    price: 19900,
    oldPrice: 24900,
    images: [px(20267233), px(15213181), px(14485294)],
    colors: [C.black, C.cream],
    sizes: APP([3, 10, 15, 14, 8, 3]),
    rating: 48,
    reviewCount: 156,
    isBestseller: true,
  },
  {
    slug: "trucker-denim-jacket-washed",
    name: "Джинсовка Trucker",
    brand: "Levi's",
    category: "jackets",
    gender: "unisex",
    shortDescription: "Прямая джинсовая куртка из жёсткого стираного денима.",
    description:
      "Свободная интерпретация классического тракера со спущенным плечом и укороченным корпусом. Жёсткий деним со временем красиво разнашивается.",
    material: "100% хлопковый деним, 12 унций.",
    care,
    price: 10900,
    images: [px(38561616), px(18213428), px(19115350)],
    colors: [C.blue, C.black],
    sizes: APP([6, 12, 18, 16, 9, 4]),
    rating: 46,
    reviewCount: 87,
  },
  {
    slug: "cropped-leather-moto-jacket",
    name: "Укороченная косуха",
    brand: "Sneak&Street",
    category: "jackets",
    gender: "women",
    shortDescription: "Кроп-косуха с асимметричной молнией.",
    description:
      "Мягкая на ощупь эко-кожа, укороченный корпус, асимметричная молния, лацканы на кнопках и пояс на талии. Надевается поверх худи без лишнего объёма.",
    material: "Верх из эко-кожи, вискозная подкладка.",
    care: "Только протирание. Не стирать.",
    price: 17900,
    images: [px(18468154), px(14485294), px(15213181)],
    colors: [C.black],
    sizes: APP([8, 14, 16, 10, 4, 0]),
    rating: 47,
    reviewCount: 69,
    isNew: true,
  },
  {
    slug: "tech-shell-anorak-olive",
    name: "Анорак Tech Shell",
    brand: "The North Face",
    category: "jackets",
    gender: "men",
    shortDescription: "Водонепроницаемый анорак с карманом-кенгуру и капюшоном.",
    description:
      "Компактная водонепроницаемая мембранная куртка с проклеенными швами, регулируемым капюшоном и большим карманом-кенгуру. Создана для дороги на работу и обратно.",
    material: "Переработанный нейлоновый рипстоп с DWR-пропиткой.",
    care: "Машинная стирка в холодной воде. Не гладить. Обновляйте пропитку по мере необходимости.",
    price: 15900,
    oldPrice: 19900,
    images: [px(8782539), px(16282403), px(19405817)],
    colors: [C.olive, C.black],
    sizes: APP([4, 9, 14, 13, 7, 3]),
    rating: 45,
    reviewCount: 52,
  },

  {
    slug: "logo-cap-black",
    name: "Кепка с вышивкой",
    brand: "Sneak&Street",
    category: "accessories",
    gender: "unisex",
    shortDescription: "Шестипанельная кепка из хлопкового твила с изогнутым козырьком.",
    description:
      "Неструктурированная шестипанельная кепка из стираного хлопкового твила с объёмной вышивкой логотипа, изогнутым козырьком и металлической застёжкой.",
    material: "100% хлопковый твил.",
    care: "Только точечная чистка.",
    price: 2900,
    images: [px(4061551), px(7045182), px(4061537)],
    colors: [C.black, C.cream, C.red],
    sizes: ONE,
    rating: 45,
    reviewCount: 134,
    isBestseller: true,
  },
  {
    slug: "shield-sunglasses-black",
    name: "Очки Shield",
    brand: "Sneak&Street",
    category: "accessories",
    gender: "unisex",
    shortDescription: "Монолитная оправа-визор с линзами UV400.",
    description:
      "Обтекаемые очки-визор с матовой чёрной оправой и дымчатыми линзами UV400. В комплекте кожаный чехол и салфетка из микрофибры.",
    material: "Ацетатная оправа, поликарбонатная линза UV400.",
    care: "Протирайте салфеткой из комплекта.",
    price: 4900,
    oldPrice: 6900,
    images: [px(32677246), px(11435388), px(18213428)],
    colors: [C.black],
    sizes: ONE,
    rating: 44,
    reviewCount: 61,
    isNew: true,
  },
  {
    slug: "utility-backpack-25l",
    name: "Рюкзак Utility 25 л",
    brand: "Sneak&Street",
    category: "accessories",
    gender: "unisex",
    shortDescription: "Технологичный рюкзак на 25 литров с отделением для ноутбука.",
    description:
      "Всё для повседневных перемещений: 25 литров объёма, мягкое отделение для ноутбука 16\", водоотталкивающее дно и стропы для дополнительного снаряжения.",
    material: "Переработанный полиэстер 600D с водоотталкивающим покрытием.",
    care: "Протирайте влажной тканью.",
    price: 8900,
    images: [px(18978810, "png"), px(9929131), px(19405817)],
    colors: [C.black, C.olive],
    sizes: ONE,
    rating: 46,
    reviewCount: 44,
  },
  {
    slug: "ribbed-beanie-cream",
    name: "Шапка в крупный рубчик",
    brand: "Sneak&Street",
    category: "accessories",
    gender: "unisex",
    shortDescription: "Объёмная шапка-бини с тканым лейблом.",
    description:
      "Шапка крупной резиночной вязки с глубоким отворотом и тканым лейблом на манжете. Тёплая и не колется.",
    material: "Смесь переработанного акрила и шерсти.",
    care: "Ручная стирка в холодной воде. Сушить в расправленном виде.",
    price: 2500,
    oldPrice: 3500,
    images: [px(9704405), px(9929131), px(4061551)],
    colors: [C.cream, C.black, C.red],
    sizes: ONE,
    rating: 43,
    reviewCount: 38,
  },
  {
    slug: "crossbody-sling-bag",
    name: "Сумка-слинг через плечо",
    brand: "Puma",
    category: "accessories",
    gender: "unisex",
    shortDescription: "Компактный слинг с магнитной застёжкой-фастексом.",
    description:
      "Компактная сумка для телефона, ключей и кошелька. Магнитная застёжка с быстрым сбросом, регулируемая стропа и скрытый карман на спинке.",
    material: "Переработанный нейлон.",
    care: "Протирайте влажной тканью.",
    price: 3900,
    images: [px(11435388), px(18978810, "png"), px(7045182)],
    colors: [C.black, C.grey],
    sizes: ONE,
    rating: 42,
    reviewCount: 29,
  },
  {
    slug: "oversized-graphic-hoodie-cream",
    name: "Худи Oversized Graphic",
    brand: "Essentials",
    category: "hoodies",
    gender: "unisex",
    shortDescription: "Сильно оверсайз худи с прорезиненным логотипом на груди.",
    description:
      "Максимально объёмное худи из плотного хлопкового футера с прорезиненным логотипом на груди и удлинёнными рёберными манжетами.",
    material: "80% хлопок / 20% полиэстер, 420 г/м².",
    care,
    price: 14500,
    images: [px(30410057), px(19461567), px(28701960)],
    colors: [C.cream, C.black, C.grey],
    sizes: APP([5, 12, 18, 16, 9, 4]),
    rating: 47,
    reviewCount: 176,
    isBestseller: true,
  },
  {
    slug: "cargo-pant-tactical-black",
    name: "Брюки-карго Tactical",
    brand: "Sneak&Street",
    category: "jeans",
    gender: "unisex",
    shortDescription: "Рипстоп-карго с объёмными карманами и утяжкой по низу.",
    description:
      "Карго из рипстопа с шестью карманами, анатомическими коленями и кулисками по низу — штанину можно собрать баллоном или сузить.",
    material: "Рипстоп из хлопка с нейлоном.",
    care,
    price: 9900,
    oldPrice: 12500,
    images: [px(19461567), px(19405817), px(16452611)],
    colors: [C.black, C.olive],
    sizes: APP([6, 14, 18, 15, 8, 3]),
    rating: 45,
    reviewCount: 96,
    isNew: true,
  },
  {
    slug: "track-jacket-retro-red",
    name: "Олимпийка Retro Track",
    brand: "Adidas",
    category: "jackets",
    gender: "unisex",
    shortDescription: "Олимпийка из трикотажа с контрастными лампасами.",
    description:
      "Архивная олимпийка из трикотажа с контрастными лампасами по бокам, воротником-стойкой и карманами на молнии. Приталенный корпус, укороченная длина.",
    material: "100% переработанный полиэстер, трикотаж.",
    care,
    price: 8900,
    images: [px(11435388), px(20267233), px(15213181)],
    colors: [C.red, C.black, C.navy],
    sizes: APP([6, 13, 17, 14, 7, 2]),
    rating: 46,
    reviewCount: 83,
  },
];

export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  readMinutes: number;
};

export const SEED_POSTS: SeedPost[] = [
  {
    slug: "sneaker-drops-to-watch-2026",
    title: "10 релизов кроссовок, которые стоит ждать в 2026",
    excerpt:
      "От переизданий трибунной классики до беговых моделей, перешедших в повседневную ротацию — календарь релизов, ради которых стоит ставить будильник.",
    content:
      "Календарь релизов на 2026 год плотный как никогда. Трибунные силуэты продолжают доминировать, но главная история — возвращение низкопрофильных раннеров и тихий подъём классики до 10 000 ₽.\n\nРетро по-прежнему правит. В первых двух кварталах ждём кожаные лоу-топы в тональных расцветках и камедевые подошвы повсюду. Если берёте одну пару — берите ту, которую можно носить и с костюмом, и с карго.\n\nБеговые технологии перетекают в лайфстайл. Пены, которые раньше ставили только в марафонки, теперь стоят под сетчатым верхом, рассчитанным на асфальт, а не на подиум. Комфорт наконец догнал культуру.\n\nИ главное: берите свой размер, а не хайп. Пара, которая сидит правильно, всегда выглядит лучше, чем грааль, пылящийся на полке.",
    category: "Кроссовки",
    author: "Мика Орлов",
    image: px(19869759),
    tags: ["кроссовки", "релизы", "2026", "ретро"],
    readMinutes: 6,
  },
  {
    slug: "how-to-build-a-capsule-streetwear-wardrobe",
    title: "Как собрать капсульный гардероб в стиле streetwear",
    excerpt:
      "Двенадцать вещей. Бесконечное число сочетаний. Практическое руководство: покупать меньше, носить лучше.",
    content:
      "Капсульный гардероб — это не минимализм ради минимализма, а способ убрать трение. Когда любая вещь сочетается с любой другой, сборы занимают тридцать секунд.\n\nНачните с базы: три плотные футболки — белая, чёрная и кремовая. Добавьте два худи: одно тяжёлое, одно на молнии. Затем два низа: широкие джинсы и зауженные карго.\n\nВерхняя одежда — то, на что стоит потратиться. Один бомбер, одна мембранная куртка. Обе в нейтральных тонах, чтобы не спорили с образом.\n\nЗакройте вопрос тремя парами обуви: белые кожаные лоу-топы, замшевые трибунные кроссовки и технологичный раннер. Итого двенадцать вещей и больше двухсот комбинаций.",
    category: "Гид по стилю",
    author: "Дана Рейес",
    image: px(15127546),
    tags: ["капсула", "база", "стиль"],
    readMinutes: 8,
  },
  {
    slug: "hoodie-fit-guide-oversized-vs-boxy",
    title: "Гид по посадке худи: oversized против boxy",
    excerpt:
      "Спущенное плечо, длина корпуса, натяжение манжет — три параметра, которые решают, выглядит ваше худи осознанно или случайно.",
    content:
      "Большинство покупает худи на размер больше и называет это оверсайзом. Так это не работает.\n\nBoxy-худи широкое в корпусе, но плечевой шов остаётся близко к естественной линии плеча. Заканчивается на верхней точке бедра. Чисто, структурно, легко слоится.\n\nOversized-худи опускает плечевой шов до середины бицепса и удлиняет корпус. Ему нужен объём в остальном образе: широкие джинсы или карго с утяжкой по низу.\n\nСмотрите на плотность. Всё, что легче 320 г/м², со временем «поплывёт». Наше тяжёлое худи — 480 г/м², и оно держит плечи даже после пятидесяти стирок.",
    category: "Гид по стилю",
    author: "Кай Андерсен",
    image: px(28701960),
    tags: ["худи", "посадка", "гид"],
    readMinutes: 5,
  },
  {
    slug: "care-guide-keep-your-white-sneakers-white",
    title: "Уход: как сохранить белые кроссовки белыми",
    excerpt:
      "Пятиминутный еженедельный ритуал, который продлевает жизнь кожаным лоу-топам на годы.",
    content:
      "Белый цвет нужно заслужить. Вот регламент.\n\nПервое: счищайте сухую грязь до того, как она въестся. Мягкая зубная щётка отлично справляется со швом подошвы.\n\nВторое: используйте раствор мягкого мыла, никогда не отбеливатель. Отбеливатель со временем желтит кожу.\n\nТретье: стирайте шнурки отдельно в сетчатом мешке. Серые шнурки делают уставшей всю пару.\n\nЧетвёртое: набейте бумагой и сушите вдали от батарей. Жар трескает кожу.\n\nПятое: раз в месяц наносите защитный спрей. Это самая дешёвая страховка в вашей жизни.",
    category: "Уход",
    author: "Мика Орлов",
    image: px(19166246),
    tags: ["уход", "кроссовки", "кожа"],
    readMinutes: 4,
  },
  {
    slug: "denim-decoded-raw-selvedge-washed",
    title: "Деним без мифов: raw, selvedge и стираный",
    excerpt:
      "Что на самом деле значат термины и какой деним заслуживает места в вашей ротации.",
    content:
      "Raw-деним никогда не стирали после окрашивания. Он жёсткий, тёмный и за месяцы носки выцветает под вашу фигуру.\n\nSelvedge — это самозакрывающаяся кромка, которую даёт старый челночный станок. Это маркер конструкции, а не плотности или «сырости»: бывает и стираный selvedge.\n\nСтираный деним обработали после производства для мягкости и разношенного вида. Он не требует терпения — и это честно.\n\nХотите потёртости — берите raw от 14 унций. Хотите надеть завтра — берите стираный. В любом случае выбирайте посадку по верхней точке бедра.",
    category: "Гид по стилю",
    author: "Дана Рейес",
    image: px(38561616),
    tags: ["деним", "джинсы", "гид"],
    readMinutes: 7,
  },
  {
    slug: "women-streetwear-silhouettes-spring-2026",
    title: "Женские силуэты streetwear на весну 2026",
    excerpt:
      "Укороченный объём, низкие посадки и возвращение технологичной мембраны. Что заходит в этом сезоне.",
    content:
      "Весна 2026 — про игру с пропорциями. Укороченный верх с объёмным низом или облегающий низ с оверсайз-курткой: выберите одну ось и держитесь её.\n\nПрямые джинсы с низкой посадкой вернулись всерьёз, но теперь их кроят длиннее — чтобы ложились стеком на массивных кроссовках, а не собирались на полу.\n\nТехнологичная верхняя одежда окончательно перешла в моду. Компактная мембрана в хаки или костяном цвете читается как стиль, а не как функция.\n\nАксессуары остаются маленькими: слинг, очки-визор и кепка. Всё остальное говорит образ.",
    category: "Тренды",
    author: "Кай Андерсен",
    image: px(16217479, "png"),
    tags: ["женское", "тренды", "весна"],
    readMinutes: 6,
  },
];

export const SEED_REVIEWS: {
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
}[] = [
  {
    productSlug: "air-force-1-07-triple-white",
    author: "Антон К.",
    rating: 5,
    title: "Сочетаются со всем",
    body: "Третья пара. Размер в размер, доставили за четыре дня, упаковка аккуратная. Добавить нечего.",
  },
  {
    productSlug: "air-force-1-07-triple-white",
    author: "Лена М.",
    rating: 4,
    title: "Отличные, но надо разносить",
    body: "Первую неделю жёсткие, потом идеально. Взяла на полразмера больше — это было правильно.",
  },
  {
    productSlug: "heavyweight-boxy-hoodie-black",
    author: "Марк В.",
    rating: 5,
    title: "Реально тяжёлое",
    body: "480 г/м² чувствуются сразу. Капюшон держит форму, манжеты плотные. Стоит своих денег.",
  },
  {
    productSlug: "heavyweight-boxy-hoodie-black",
    author: "Саша Р.",
    rating: 5,
    title: "Лучшее худи в шкафу",
    body: "Boxy-посадка ровно как на фото. Постирал уже пять раз — усадки нет вообще.",
  },
  {
    productSlug: "990v6-made-in-usa-grey",
    author: "Юля П.",
    rating: 5,
    title: "Как на облаке",
    body: "Отстояла в них 12 часов на работе. Ноги не гудят. Серая замша вживую намного богаче.",
  },
];

export const SEED_QUESTIONS: {
  productSlug: string;
  productName: string;
  author: string;
  email: string;
  question: string;
  answer: string;
  status: string;
}[] = [
  {
    productSlug: "air-force-1-07-triple-white",
    productName: "Air Force 1 '07 Triple White",
    author: "Игорь",
    email: "igor@example.com",
    question: "Размер в размер или лучше брать на полразмера больше?",
    answer:
      "Модель идёт размер в размер. Если стопа широкая — берите на полразмера больше, колодка узковата в носке.",
    status: "answered",
  },
  {
    productSlug: "air-force-1-07-triple-white",
    productName: "Air Force 1 '07 Triple White",
    author: "Настя",
    email: "nastya@example.com",
    question: "Это оригинал? Есть коробка и бирки?",
    answer:
      "Да, поставка от официального дистрибьютора. Приходит в фирменной коробке со всеми бирками и чеком.",
    status: "answered",
  },
  {
    productSlug: "heavyweight-boxy-hoodie-black",
    productName: "Худи Heavyweight Boxy",
    author: "Дмитрий",
    email: "dmitry@example.com",
    question: "Какой размер брать при росте 182 и весе 78 кг?",
    answer:
      "При таких параметрах берите L для прямой посадки или XL, если хотите заметный оверсайз.",
    status: "answered",
  },
  {
    productSlug: "heavyweight-boxy-hoodie-black",
    productName: "Худи Heavyweight Boxy",
    author: "Кирилл",
    email: "kirill@example.com",
    question: "Садится ли после стирки? Хочу взять точно в размер.",
    answer: "",
    status: "new",
  },
  {
    productSlug: "990v6-made-in-usa-grey",
    productName: "990v6 Made in USA",
    author: "Марина",
    email: "marina@example.com",
    question: "Подойдут для долгой ходьбы по городу каждый день?",
    answer: "",
    status: "new",
  },
];
