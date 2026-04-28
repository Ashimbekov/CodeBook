export default {
  id: 22,
  title: 'Архитектура фронтенда',
  description: 'Архитектурные паттерны фронтенда: MVC, MVVM, Flux/Redux, Feature-Sliced Design, micro-frontends.',
  lessons: [
    {
      id: 1,
      title: 'MVC и MVVM на фронтенде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерны MVC (Model-View-Controller) и MVVM (Model-View-ViewModel) пришли с бэкенда, но адаптированы для фронтенда. Они разделяют данные, представление и логику.' },
        { type: 'heading', value: 'MVC' },
        { type: 'list', value: [
          'Model — данные и бизнес-логика',
          'View — отображение (HTML/компоненты)',
          'Controller — обработка пользовательских действий',
          'Используется в: Angular (с модификациями), Backbone.js'
        ]},
        { type: 'heading', value: 'MVVM' },
        { type: 'list', value: [
          'Model — данные из API/store',
          'View — компоненты UI (только отображение)',
          'ViewModel — логика преобразования данных для View',
          'Двустороннее связывание: изменение в View → ViewModel → Model',
          'Используется в: Vue.js, Angular, Knockout.js'
        ]},
        { type: 'code', language: 'typescript', value: '// MVVM в Vue.js (Composition API)\n// ViewModel — composable\nfunction useOrderList() {\n  const orders = ref<OrderDto[]>([]);\n  const loading = ref(false);\n  const error = ref<string | null>(null);\n  \n  // Computed (преобразование для View)\n  const pendingOrders = computed(() => \n    orders.value.filter(o => o.status === "pending")\n  );\n  \n  const totalRevenue = computed(() =>\n    orders.value.reduce((sum, o) => sum + o.total, 0)\n  );\n  \n  // Actions\n  async function fetchOrders(): Promise<void> {\n    loading.value = true;\n    try {\n      orders.value = await api.getOrders();\n    } catch (e) {\n      error.value = "Не удалось загрузить заказы";\n    } finally {\n      loading.value = false;\n    }\n  }\n  \n  return { orders, loading, error, pendingOrders, totalRevenue, fetchOrders };\n}\n\n// View — только отображение\n// <template>\n//   <div v-if="loading">Загрузка...</div>\n//   <OrderList v-else :orders="pendingOrders" />\n//   <p>Итого: {{ totalRevenue }}</p>\n// </template>' },
        { type: 'tip', value: 'На современном фронтенде чистые MVC/MVVM встречаются редко. Чаще используются гибридные подходы: React + hooks (функциональные ViewModel), Vue + Composition API, Angular + Services.' }
      ]
    },
    {
      id: 2,
      title: 'Flux/Redux: однонаправленный поток данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flux (Facebook, 2014) и Redux — паттерны с однонаправленным потоком данных: View → Action → Dispatcher → Store → View. Это упрощает отладку и делает состояние предсказуемым.' },
        { type: 'heading', value: 'Принципы Redux' },
        { type: 'list', value: [
          'Single Source of Truth — одно хранилище для всего состояния',
          'State is Read-Only — изменение только через actions',
          'Pure Functions — редьюсеры не имеют побочных эффектов',
          'Unidirectional Data Flow — данные текут в одном направлении'
        ]},
        { type: 'code', language: 'typescript', value: '// Redux Toolkit (современный Redux)\nimport { createSlice, createAsyncThunk } from "@reduxjs/toolkit";\n\n// Async action\nconst fetchOrders = createAsyncThunk(\n  "orders/fetch",\n  async (_, { rejectWithValue }) => {\n    try {\n      const response = await api.getOrders();\n      return response.data;\n    } catch (err) {\n      return rejectWithValue("Ошибка загрузки заказов");\n    }\n  }\n);\n\n// Slice (reducer + actions)\nconst ordersSlice = createSlice({\n  name: "orders",\n  initialState: {\n    items: [] as Order[],\n    loading: false,\n    error: null as string | null,\n  },\n  reducers: {\n    orderCancelled(state, action) {\n      const order = state.items.find(o => o.id === action.payload);\n      if (order) order.status = "cancelled";\n    },\n  },\n  extraReducers: (builder) => {\n    builder\n      .addCase(fetchOrders.pending, (state) => { state.loading = true; })\n      .addCase(fetchOrders.fulfilled, (state, action) => {\n        state.loading = false;\n        state.items = action.payload;\n      })\n      .addCase(fetchOrders.rejected, (state, action) => {\n        state.loading = false;\n        state.error = action.payload as string;\n      });\n  },\n});\n\n// Компонент\nfunction OrderList() {\n  const { items, loading } = useSelector((state: RootState) => state.orders);\n  const dispatch = useDispatch();\n  \n  useEffect(() => { dispatch(fetchOrders()); }, []);\n  \n  if (loading) return <Spinner />;\n  return items.map(order => <OrderCard key={order.id} order={order} />);\n}' },
        { type: 'note', value: 'Redux решает проблему управления состоянием в больших приложениях. Для маленьких — overkill. React Context + useReducer или Zustand/Jotai — более лёгкие альтернативы.' }
      ]
    },
    {
      id: 3,
      title: 'Feature-Sliced Design',
      type: 'theory',
      content: [
        { type: 'text', value: 'Feature-Sliced Design (FSD) — методология структурирования фронтенд-приложений. Код организован по слоям и слайсам (фичам), с чёткими правилами зависимостей.' },
        { type: 'heading', value: 'Слои FSD (снизу вверх)' },
        { type: 'list', value: [
          'shared/ — переиспользуемые утилиты, UI-kit, API-клиент',
          'entities/ — бизнес-сущности (User, Product, Order)',
          'features/ — бизнес-фичи (addToCart, login, search)',
          'widgets/ — составные блоки из entities + features (Header, Sidebar)',
          'pages/ — страницы приложения (HomePage, OrderPage)',
          'app/ — инициализация, провайдеры, роутинг'
        ]},
        { type: 'code', language: 'typescript', value: '// Структура FSD проекта\nsrc/\n├── app/                        # Инициализация\n│   ├── providers/              # Theme, Store, Router\n│   └── styles/\n├── pages/                      # Страницы\n│   ├── home/\n│   ├── order/\n│   └── profile/\n├── widgets/                    # Составные блоки\n│   ├── header/\n│   └── order-list/\n├── features/                   # Бизнес-фичи\n│   ├── add-to-cart/\n│   │   ├── ui/                 # Компоненты фичи\n│   │   │   └── AddToCartButton.tsx\n│   │   ├── model/              # Логика фичи\n│   │   │   └── useAddToCart.ts\n│   │   └── index.ts            # Публичный API\n│   ├── search-products/\n│   └── checkout/\n├── entities/                   # Бизнес-сущности\n│   ├── order/\n│   │   ├── ui/\n│   │   │   └── OrderCard.tsx\n│   │   ├── model/\n│   │   │   ├── types.ts\n│   │   │   └── orderApi.ts\n│   │   └── index.ts\n│   ├── product/\n│   └── user/\n└── shared/                     # Общие утилиты\n    ├── ui/                     # UI-kit\n    ├── api/                    # HTTP-клиент\n    ├── lib/                    # Утилиты\n    └── config/' },
        { type: 'heading', value: 'Правило зависимостей' },
        { type: 'text', value: 'Слой может зависеть только от нижележащих слоёв: pages → widgets → features → entities → shared. Entities не могут импортировать features. Features не могут импортировать widgets.' },
        { type: 'warning', value: 'Не импортируйте внутренние файлы модуля напрямую: import { OrderCard } from "entities/order/ui/OrderCard" — неправильно. Используйте публичный API: import { OrderCard } from "entities/order" — правильно.' }
      ]
    },
    {
      id: 4,
      title: 'Clean Architecture на фронтенде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Принципы Clean Architecture применимы и на фронтенде: бизнес-логика отделена от UI-фреймворка, API-клиент — адаптер, состояние управляется через use cases.' },
        { type: 'code', language: 'typescript', value: '// Domain: бизнес-логика (не зависит от React/Vue)\nclass Cart {\n  private items: CartItem[] = [];\n  \n  addItem(product: Product, quantity: number): void {\n    const existing = this.items.find(i => i.productId === product.id);\n    if (existing) {\n      existing.quantity += quantity;\n    } else {\n      this.items.push(new CartItem(product.id, product.name, product.price, quantity));\n    }\n  }\n  \n  get total(): number {\n    return this.items.reduce((sum, item) => sum + item.lineTotal, 0);\n  }\n}\n\n// Application: Use Case (не зависит от React/Vue)\nclass AddToCartUseCase {\n  constructor(\n    private cartRepository: CartRepository,\n    private productApi: ProductApi\n  ) {}\n  \n  async execute(productId: string, quantity: number): Promise<CartDto> {\n    const product = await this.productApi.getById(productId);\n    const cart = await this.cartRepository.get();\n    cart.addItem(product, quantity);\n    await this.cartRepository.save(cart);\n    return CartDto.from(cart);\n  }\n}\n\n// Infrastructure: API-клиент\nclass HttpProductApi implements ProductApi {\n  async getById(id: string): Promise<Product> {\n    const response = await fetch(`/api/products/${id}`);\n    return response.json();\n  }\n}\n\n// Presentation: React-компонент (тонкий!)\nfunction AddToCartButton({ productId }: { productId: string }) {\n  const addToCart = useAddToCart(); // hook, использующий Use Case\n  \n  return (\n    <button onClick={() => addToCart(productId, 1)}>\n      В корзину\n    </button>\n  );\n}' },
        { type: 'tip', value: 'На фронтенде Clean Architecture оправдана для сложных бизнес-приложений (CRM, ERP, трейдинг). Для лендингов и простых SPA — overkill. Выбирайте уровень сложности архитектуры по размеру проекта.' }
      ]
    },
    {
      id: 5,
      title: 'Micro-frontends',
      type: 'theory',
      content: [
        { type: 'text', value: 'Micro-frontends — подход, при котором фронтенд разбивается на независимые модули, разрабатываемые и деплоящиеся отдельными командами. Аналог микросервисов для фронтенда.' },
        { type: 'heading', value: 'Способы реализации' },
        { type: 'list', value: [
          'Module Federation (Webpack 5) — динамическая загрузка модулей',
          'Web Components — каждый micro-frontend как Custom Element',
          'iframe — изоляция через iframe (устаревший подход)',
          'Build-time integration — сборка из отдельных пакетов (npm)',
          'Server-side composition — сервер собирает HTML из фрагментов'
        ]},
        { type: 'heading', value: 'Когда использовать' },
        { type: 'list', value: [
          'Большая команда (10+ фронтенд-разработчиков)',
          'Разные команды отвечают за разные разделы',
          'Нужна независимость деплоя отдельных частей UI',
          'Разные технологии для разных частей (React + Vue)'
        ]},
        { type: 'heading', value: 'Когда НЕ использовать' },
        { type: 'list', value: [
          'Маленькая команда (1-5 человек)',
          'Единый стиль и общие компоненты',
          'Нет проблем с размером бандла',
          'Нет потребности в независимом деплое'
        ]},
        { type: 'note', value: 'Micro-frontends добавляют значительную сложность: общее состояние, роутинг, стили, производительность. Начните с модульного монолита (Feature-Sliced Design) и извлекайте micro-frontends только при реальной необходимости.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: архитектура React-приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте архитектуру React-приложения для дашборда аналитики с использованием Feature-Sliced Design.',
      requirements: [
        'Определить слои FSD: shared, entities, features, widgets, pages',
        'Создать entity: DashboardWidget с моделью и UI',
        'Создать feature: addWidget, filterData',
        'Создать widget: AnalyticsDashboard',
        'Определить правила зависимостей между слоями'
      ],
      hint: 'shared/ — UI-kit (Button, Chart), API-клиент. entities/ — Widget, DataSource. features/ — addWidget (логика + UI). widgets/ — Dashboard (собирает features и entities). pages/ — DashboardPage.',
      expectedOutput: 'Структура FSD с чёткими слоями: shared → entities → features → widgets → pages. Каждый модуль имеет публичный API (index.ts). Зависимости только вниз.',
      solution: '// Структура проекта\n// src/\n// ├── shared/ui/       → Button, Chart, Select, Spinner\n// ├── shared/api/      → httpClient, endpoints\n// ├── entities/widget/ → WidgetCard, widgetModel, types\n// ├── entities/metric/ → MetricValue, metricApi\n// ├── features/add-widget/     → AddWidgetDialog, useAddWidget\n// ├── features/filter-data/    → DateRangeFilter, useFilterData\n// ├── widgets/analytics-dashboard/ → Dashboard (combines entities + features)\n// ├── pages/dashboard/  → DashboardPage\n// └── app/             → App, providers, router\n\n// shared/ui/Chart.tsx\nexport function Chart({ data, type }: ChartProps) {\n  return <canvas data-chart={type} />; // базовый компонент\n}\n\n// entities/widget/model/types.ts\nexport interface Widget {\n  id: string;\n  title: string;\n  type: "line" | "bar" | "pie" | "number";\n  dataSourceId: string;\n  config: Record<string, unknown>;\n}\n\n// entities/widget/ui/WidgetCard.tsx\nexport function WidgetCard({ widget, data }: { widget: Widget; data: any }) {\n  return (\n    <div className="widget-card">\n      <h3>{widget.title}</h3>\n      <Chart data={data} type={widget.type} />\n    </div>\n  );\n}\n\n// entities/widget/index.ts (публичный API)\nexport { WidgetCard } from "./ui/WidgetCard";\nexport type { Widget } from "./model/types";\n\n// features/add-widget/model/useAddWidget.ts\nexport function useAddWidget() {\n  const [isOpen, setIsOpen] = useState(false);\n  const dispatch = useDispatch();\n  \n  const addWidget = (config: WidgetConfig) => {\n    dispatch(dashboardActions.addWidget(config));\n    setIsOpen(false);\n  };\n  return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), addWidget };\n}\n\n// features/add-widget/index.ts\nexport { AddWidgetButton } from "./ui/AddWidgetButton";\n\n// widgets/analytics-dashboard/ui/Dashboard.tsx\nimport { WidgetCard } from "entities/widget";\nimport { AddWidgetButton } from "features/add-widget";\nimport { DateRangeFilter } from "features/filter-data";\n\nexport function AnalyticsDashboard() {\n  const widgets = useSelector(selectWidgets);\n  return (\n    <div>\n      <DateRangeFilter />\n      <AddWidgetButton />\n      <div className="grid">\n        {widgets.map(w => <WidgetCard key={w.id} widget={w} />)}\n      </div>\n    </div>\n  );\n}\n\n// pages/dashboard/DashboardPage.tsx\nimport { AnalyticsDashboard } from "widgets/analytics-dashboard";\nexport function DashboardPage() {\n  return <AnalyticsDashboard />;\n}',
      explanation: 'FSD-слои: shared (UI-kit, API) → entities (Widget, Metric) → features (addWidget, filterData) → widgets (AnalyticsDashboard) → pages (DashboardPage). Каждый модуль экспортирует публичный API через index.ts. WidgetCard (entity) не знает о AddWidgetButton (feature). Dashboard (widget) комбинирует их. Зависимости только вниз по слоям.'
    }
  ]
}
