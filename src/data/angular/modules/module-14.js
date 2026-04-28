export default {
  id: 14,
  title: 'RxJS: Продвинутый',
  description: 'Продвинутые операторы RxJS: switchMap, mergeMap, combineLatest, forkJoin и паттерны обработки потоков',
  lessons: [
    {
      id: 1,
      title: 'switchMap, mergeMap, concatMap, exhaustMap',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы высшего порядка (Higher-Order Mapping) преобразуют каждое значение внешнего Observable во внутренний Observable. Их различие — в стратегии обработки параллельных потоков.' },
        { type: 'heading', value: 'Четыре стратегии' },
        { type: 'code', language: 'typescript', value: 'import { switchMap, mergeMap, concatMap, exhaustMap } from \'rxjs/operators\';\n\n// switchMap — ОТМЕНЯЕТ предыдущий внутренний поток при новом значении\n// Идеален для: поиска, навигации, HTTP-запросов при изменении параметров\nsearchInput$.pipe(\n  switchMap(term => this.http.get(`/search?q=${term}`))\n  // Если пользователь печатает быстро,\n  // предыдущие запросы отменяются!\n);\n\n// mergeMap — выполняет ВСЕ внутренние потоки параллельно\n// Идеален для: независимых действий (логирование, отправка уведомлений)\nclicks$.pipe(\n  mergeMap(click => this.http.post(\'/log\', { action: \'click\' }))\n  // Все запросы выполняются параллельно\n);\n\n// concatMap — выполняет внутренние потоки ПОСЛЕДОВАТЕЛЬНО (очередь)\n// Идеален для: действий, где порядок важен (сохранение, обновление)\nsaveActions$.pipe(\n  concatMap(data => this.http.put(\'/save\', data))\n  // Каждый запрос ждёт завершения предыдущего\n);\n\n// exhaustMap — ИГНОРИРУЕТ новые значения, пока текущий поток не завершится\n// Идеален для: предотвращения повторных кликов (отправка формы)\nsubmitButton$.pipe(\n  exhaustMap(() => this.http.post(\'/submit\', formData))\n  // Повторные клики игнорируются до завершения запроса\n);' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: [
          'switchMap — поиск, автокомплит, загрузка данных по параметру (отменяет предыдущее)',
          'mergeMap — параллельные независимые операции (логирование, уведомления)',
          'concatMap — последовательные зависимые операции (сохранение, обновление в порядке)',
          'exhaustMap — защита от двойного клика (отправка формы, оплата)'
        ] },
        { type: 'warning', value: 'Неправильный выбор оператора — частый источник багов. switchMap отменяет запросы (потеря данных при сохранении). mergeMap может создать 100 параллельных запросов.' }
      ]
    },
    {
      id: 2,
      title: 'combineLatest и forkJoin',
      type: 'theory',
      content: [
        { type: 'text', value: 'combineLatest и forkJoin объединяют несколько Observable в один. Они отличаются стратегией: combineLatest выдаёт при каждом обновлении любого источника, forkJoin — только когда все завершились.' },
        { type: 'heading', value: 'combineLatest' },
        { type: 'code', language: 'typescript', value: 'import { combineLatest, of } from \'rxjs\';\nimport { map } from \'rxjs/operators\';\n\n// combineLatest — выдаёт при обновлении ЛЮБОГО из источников\n// (после того как все выдали хотя бы одно значение)\n\n@Component({ /* ... */ })\nexport class ProductPageComponent {\n  private route = inject(ActivatedRoute);\n  private productService = inject(ProductService);\n  private reviewService = inject(ReviewService);\n\n  // Комбинируем данные из нескольких источников\n  vm$ = combineLatest([\n    this.route.paramMap.pipe(\n      switchMap(params => this.productService.getById(+params.get(\'id\')!))\n    ),\n    this.reviewService.getReviews(),\n    this.cartService.items$\n  ]).pipe(\n    map(([product, reviews, cartItems]) => ({\n      product,\n      reviews: reviews.filter(r => r.productId === product.id),\n      isInCart: cartItems.some(item => item.id === product.id)\n    }))\n  );\n}\n// В шаблоне:\n// @if (vm$ | async; as vm) {\n//   <h1>{{ vm.product.name }}</h1>\n//   <p>Отзывов: {{ vm.reviews.length }}</p>\n//   <button [disabled]="vm.isInCart">В корзину</button>\n// }' },
        { type: 'heading', value: 'forkJoin' },
        { type: 'code', language: 'typescript', value: 'import { forkJoin } from \'rxjs\';\n\n// forkJoin — ждёт ЗАВЕРШЕНИЯ всех Observable и выдаёт последние значения\n// Идеален для параллельных HTTP-запросов\n\n@Component({ /* ... */ })\nexport class DashboardComponent implements OnInit {\n  stats: any;\n  loading = true;\n\n  ngOnInit(): void {\n    forkJoin({\n      users: this.http.get<User[]>(\'/api/users\'),\n      products: this.http.get<Product[]>(\'/api/products\'),\n      orders: this.http.get<Order[]>(\'/api/orders\')\n    }).subscribe({\n      next: (result) => {\n        // result = { users: [...], products: [...], orders: [...] }\n        this.stats = {\n          totalUsers: result.users.length,\n          totalProducts: result.products.length,\n          totalOrders: result.orders.length\n        };\n        this.loading = false;\n      },\n      error: (err) => {\n        console.error(\'Один из запросов не удался\', err);\n        this.loading = false;\n      }\n    });\n  }\n}' },
        { type: 'note', value: 'forkJoin для HTTP-запросов — как Promise.all(). combineLatest для живых потоков (Subject, interval). Если один из Observable в forkJoin не завершится — forkJoin тоже не завершится.' }
      ]
    },
    {
      id: 3,
      title: 'Обработка ошибок в потоках',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ошибка в Observable завершает поток. Важно правильно обрабатывать ошибки, чтобы не потерять реактивность приложения.' },
        { type: 'heading', value: 'Операторы обработки ошибок' },
        { type: 'code', language: 'typescript', value: 'import { catchError, retry, retryWhen, delay, take } from \'rxjs/operators\';\nimport { of, throwError, timer } from \'rxjs\';\n\n// catchError — перехватывает ошибку и возвращает fallback Observable\nthis.http.get<User[]>(\'/api/users\').pipe(\n  catchError(error => {\n    console.error(\'Ошибка:\', error);\n    return of([]);  // Возвращаем пустой массив вместо ошибки\n  })\n);\n\n// retry — повторяет запрос при ошибке\nthis.http.get<User[]>(\'/api/users\').pipe(\n  retry(3),       // Повторить до 3 раз\n  catchError(error => of([]))  // Если все 3 попытки не удались\n);\n\n// retry с задержкой\nthis.http.get<User[]>(\'/api/users\').pipe(\n  retry({\n    count: 3,\n    delay: (error, retryCount) => {\n      console.log(`Попытка ${retryCount}, ожидание...`);\n      return timer(retryCount * 1000); // 1с, 2с, 3с\n    }\n  }),\n  catchError(error => of([]))\n);' },
        { type: 'heading', value: 'Обработка ошибок во внутренних Observable' },
        { type: 'code', language: 'typescript', value: '// ВАЖНО: catchError внутри switchMap, чтобы не убить внешний поток\n\n// ❌ Плохо — ошибка убьёт весь поток поиска\nsearchTerms$.pipe(\n  switchMap(term => this.http.get(`/search?q=${term}`)),\n  catchError(err => of([]))  // Поток завершится!\n);\n\n// ✅ Хорошо — ошибка обработана внутри switchMap\nsearchTerms$.pipe(\n  switchMap(term =>\n    this.http.get(`/search?q=${term}`).pipe(\n      catchError(err => {\n        console.error(\'Ошибка поиска:\', err);\n        return of([]);  // Возвращаем fallback для ЭТОГО запроса\n      })\n    )\n  )\n  // Внешний поток продолжает работать!\n);' },
        { type: 'tip', value: 'Всегда обрабатывайте ошибки ВНУТРИ switchMap/mergeMap, а не снаружи. Иначе ошибка одного внутреннего запроса убьёт весь реактивный поток.' }
      ]
    },
    {
      id: 4,
      title: 'Полезные операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'RxJS содержит десятки операторов. Рассмотрим самые полезные для Angular-разработки: startWith, scan, shareReplay и другие.' },
        { type: 'heading', value: 'Часто используемые операторы' },
        { type: 'code', language: 'typescript', value: 'import {\n  startWith, scan, shareReplay, withLatestFrom,\n  debounceTime, throttleTime, pairwise, finalize\n} from \'rxjs/operators\';\n\n// startWith — начальное значение перед первым emit\nthis.searchResults$ = searchTerms$.pipe(\n  switchMap(term => this.search(term)),\n  startWith([])  // Начинаем с пустого массива\n);\n\n// scan — аккумулятор (как reduce, но выдаёт промежуточные результаты)\nclicks$.pipe(\n  scan((count, click) => count + 1, 0)\n).subscribe(count => console.log(\'Кликов:\', count));\n// 1, 2, 3, 4, ...\n\n// shareReplay — кэширует последнее значение для новых подписчиков\nthis.user$ = this.http.get<User>(\'/api/me\').pipe(\n  shareReplay(1)  // Один HTTP-запрос, результат раздаётся всем подписчикам\n);\n\n// withLatestFrom — берёт последнее значение из другого Observable\nsaveButton$.pipe(\n  withLatestFrom(this.form.valueChanges),\n  map(([click, formValue]) => formValue)\n).subscribe(formData => this.save(formData));\n\n// pairwise — выдаёт текущее и предыдущее значение\nthis.route.paramMap.pipe(\n  map(params => params.get(\'id\')),\n  pairwise()\n).subscribe(([prev, current]) => {\n  console.log(`Переход с ${prev} на ${current}`);\n});\n\n// finalize — выполняется при завершении или ошибке\nthis.http.get(\'/api/data\').pipe(\n  tap(() => this.loading = true),\n  finalize(() => this.loading = false)  // Всегда сбрасывает loading\n);' },
        { type: 'note', value: 'shareReplay(1) критичен для Observable, которые используются в нескольких местах (через async pipe). Без него каждый async pipe создаст отдельный HTTP-запрос.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн ViewModel с combineLatest',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн ViewModel (vm$) объединяет все Observable компонента в один поток. Это упрощает шаблон и гарантирует один async pipe.' },
        { type: 'heading', value: 'Реализация паттерна VM' },
        { type: 'code', language: 'typescript', value: 'interface ProductPageVM {\n  products: Product[];\n  selectedCategory: string;\n  sortBy: string;\n  loading: boolean;\n  error: string | null;\n}\n\n@Component({\n  selector: \'app-product-page\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    @if (vm$ | async; as vm) {\n      @if (vm.loading) {\n        <div class="spinner">Загрузка...</div>\n      }\n      @if (vm.error) {\n        <div class="error">{{ vm.error }}</div>\n      }\n      <div class="filters">\n        <span>Категория: {{ vm.selectedCategory }}</span>\n        <span>Сортировка: {{ vm.sortBy }}</span>\n      </div>\n      @for (product of vm.products; track product.id) {\n        <div class="product">{{ product.name }} — {{ product.price }}</div>\n      }\n    }\n  `\n})\nexport class ProductPageComponent {\n  private productService = inject(ProductService);\n\n  // Источники данных\n  private category$ = new BehaviorSubject<string>(\'all\');\n  private sort$ = new BehaviorSubject<string>(\'name\');\n  private loading$ = new BehaviorSubject<boolean>(false);\n  private error$ = new BehaviorSubject<string | null>(null);\n\n  // ViewModel — один Observable для всего шаблона\n  vm$: Observable<ProductPageVM> = combineLatest([\n    this.category$,\n    this.sort$\n  ]).pipe(\n    tap(() => { this.loading$.next(true); this.error$.next(null); }),\n    switchMap(([category, sort]) =>\n      this.productService.getProducts(category, sort).pipe(\n        catchError(err => {\n          this.error$.next(err.message);\n          return of([]);\n        })\n      )\n    ),\n    tap(() => this.loading$.next(false)),\n    switchMap(products =>\n      combineLatest([this.loading$, this.error$]).pipe(\n        map(([loading, error]) => ({\n          products,\n          selectedCategory: this.category$.getValue(),\n          sortBy: this.sort$.getValue(),\n          loading,\n          error\n        }))\n      )\n    ),\n    shareReplay(1)\n  );\n\n  selectCategory(category: string): void {\n    this.category$.next(category);\n  }\n\n  changeSort(sort: string): void {\n    this.sort$.next(sort);\n  }\n}' },
        { type: 'tip', value: 'Один async pipe в шаблоне через vm$ — это идеальный подход. Нет множественных подписок, один источник истины, чистый шаблон.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Dashboard с несколькими потоками',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте дашборд, который объединяет данные из нескольких источников через combineLatest/forkJoin, с обработкой ошибок и паттерном ViewModel.',
      requirements: [
        'forkJoin для параллельной загрузки: пользователи, заказы, статистика',
        'combineLatest для объединения данных с фильтрами',
        'switchMap для обновления при изменении фильтра',
        'catchError для обработки ошибок каждого запроса',
        'Паттерн vm$ для единого Observable в шаблоне',
        'Индикатор загрузки и обработка ошибок'
      ],
      hint: 'Используйте forkJoin для начальной загрузки. combineLatest для комбинирования с фильтрами. catchError ВНУТРИ switchMap для каждого запроса.',
      expectedOutput: 'Дашборд загружает все данные параллельно. Фильтры обновляют отображение реактивно. Ошибки отдельных запросов не ломают весь дашборд.',
      solution: `import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, catchError, tap, startWith, shareReplay, delay } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface DashboardVM {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  recentOrders: any[];
  filter: string;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    @if (vm$ | async; as vm) {
      @if (vm.loading) {
        <p>Загрузка дашборда...</p>
      } @else if (vm.error) {
        <p class="error">{{ vm.error }}</p>
      } @else {
        <div class="stats">
          <div class="card">Пользователей: {{ vm.totalUsers }}</div>
          <div class="card">Заказов: {{ vm.totalOrders }}</div>
          <div class="card">Выручка: {{ vm.revenue }} руб.</div>
        </div>
        <h3>Последние заказы ({{ vm.filter }})</h3>
        <select (change)="onFilterChange($event)">
          <option value="all">Все</option>
          <option value="pending">Ожидают</option>
          <option value="completed">Выполнены</option>
        </select>
        @for (order of vm.recentOrders; track order.id) {
          <div class="order">
            #{{ order.id }} — {{ order.customer }} — {{ order.total }} руб. ({{ order.status }})
          </div>
        } @empty {
          <p>Нет заказов</p>
        }
      }
    }
  \`
})
export class DashboardComponent {
  private filter$ = new BehaviorSubject<string>('all');

  private mockUsers = of({ total: 1250 }).pipe(delay(500));
  private mockOrders = of([
    { id: 1, customer: 'Иван', total: 5000, status: 'completed' },
    { id: 2, customer: 'Мария', total: 3200, status: 'pending' },
    { id: 3, customer: 'Алексей', total: 7800, status: 'completed' },
    { id: 4, customer: 'Елена', total: 1500, status: 'pending' },
    { id: 5, customer: 'Дмитрий', total: 9200, status: 'completed' }
  ]).pipe(delay(800));
  private mockRevenue = of({ total: 267500 }).pipe(delay(600));

  vm$: Observable<DashboardVM> = forkJoin({
    users: this.mockUsers.pipe(catchError(() => of({ total: 0 }))),
    orders: this.mockOrders.pipe(catchError(() => of([]))),
    revenue: this.mockRevenue.pipe(catchError(() => of({ total: 0 })))
  }).pipe(
    switchMap(data =>
      this.filter$.pipe(
        map(filter => {
          const filtered = filter === 'all'
            ? data.orders
            : data.orders.filter(o => o.status === filter);
          return {
            totalUsers: data.users.total,
            totalOrders: data.orders.length,
            revenue: data.revenue.total,
            recentOrders: filtered,
            filter,
            loading: false,
            error: null
          };
        })
      )
    ),
    startWith({
      totalUsers: 0, totalOrders: 0, revenue: 0,
      recentOrders: [], filter: 'all', loading: true, error: null
    } as DashboardVM),
    catchError(err => of({
      totalUsers: 0, totalOrders: 0, revenue: 0,
      recentOrders: [], filter: 'all', loading: false, error: err.message
    } as DashboardVM)),
    shareReplay(1)
  );

  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filter$.next(select.value);
  }
}`,
      explanation: 'forkJoin загружает все данные параллельно и ждёт завершения всех запросов. catchError на каждом запросе предотвращает каскадный отказ. switchMap на filter$ переключает фильтрацию при изменении. startWith устанавливает начальное состояние loading: true. shareReplay(1) кэширует результат для множественных подписчиков. Паттерн vm$ обеспечивает один async pipe в шаблоне.'
    }
  ]
}
