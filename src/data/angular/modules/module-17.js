export default {
  id: 17,
  title: 'Signals',
  description: 'Реактивные Signals в Angular 16+: signal, computed, effect и переход от RxJS к Signals',
  lessons: [
    {
      id: 1,
      title: 'Что такое Signals',
      type: 'theory',
      content: [
        { type: 'text', value: 'Signals — это новая система реактивности в Angular 16+. Signal хранит значение и автоматически уведомляет зависимых при изменении. Это проще, чем RxJS для управления состоянием в компонентах.' },
        { type: 'heading', value: 'Создание и использование Signal' },
        { type: 'code', language: 'typescript', value: 'import { Component, signal } from \'@angular/core\';\n\n@Component({\n  selector: \'app-counter\',\n  standalone: true,\n  template: `\n    <h2>Счётчик: {{ count() }}</h2>\n    <button (click)="increment()">+1</button>\n    <button (click)="decrement()">-1</button>\n    <button (click)="reset()">Сброс</button>\n  `\n})\nexport class CounterComponent {\n  // Создание сигнала с начальным значением\n  count = signal(0);\n\n  increment(): void {\n    // .set() — установить новое значение\n    this.count.set(this.count() + 1);\n\n    // .update() — обновить на основе текущего значения\n    // this.count.update(current => current + 1);\n  }\n\n  decrement(): void {\n    this.count.update(c => c - 1);\n  }\n\n  reset(): void {\n    this.count.set(0);\n  }\n}' },
        { type: 'heading', value: 'Signal vs BehaviorSubject' },
        { type: 'code', language: 'typescript', value: '// BehaviorSubject (RxJS) — раньше\nconst count$ = new BehaviorSubject(0);\ncount$.next(1);                    // Установить\nconst value = count$.getValue();   // Прочитать\ncount$.subscribe(v => console.log(v)); // Подписаться\n// Нужна отписка!\n\n// Signal (Angular) — сейчас\nconst count = signal(0);\ncount.set(1);          // Установить\nconst value = count();  // Прочитать (вызов как функция)\n// В шаблоне: {{ count() }}\n// Нет подписок, нет утечек памяти!' },
        { type: 'tip', value: 'Signals не заменяют RxJS полностью. RxJS остаётся для асинхронных потоков (HTTP, WebSocket, события). Signals — для синхронного состояния компонентов.' }
      ]
    },
    {
      id: 2,
      title: 'computed — вычисляемые Signals',
      type: 'theory',
      content: [
        { type: 'text', value: 'computed() создаёт signal, значение которого вычисляется из других signals. При изменении зависимостей computed пересчитывается автоматически и лениво.' },
        { type: 'heading', value: 'Использование computed' },
        { type: 'code', language: 'typescript', value: 'import { Component, signal, computed } from \'@angular/core\';\n\ninterface CartItem {\n  name: string;\n  price: number;\n  quantity: number;\n}\n\n@Component({\n  selector: \'app-cart\',\n  standalone: true,\n  template: `\n    <h2>Корзина</h2>\n    @for (item of items(); track item.name) {\n      <div>\n        {{ item.name }} × {{ item.quantity }} = {{ item.price * item.quantity }} руб.\n      </div>\n    }\n    <hr />\n    <p>Товаров: {{ itemCount() }}</p>\n    <p>Итого: {{ totalPrice() }} руб.</p>\n    <p>Со скидкой ({{ discount() }}%): {{ discountedPrice() }} руб.</p>\n    <button (click)="addItem()">Добавить товар</button>\n  `\n})\nexport class CartComponent {\n  // Writable signals\n  items = signal<CartItem[]>([\n    { name: \'Ноутбук\', price: 75000, quantity: 1 },\n    { name: \'Мышка\', price: 3000, quantity: 2 }\n  ]);\n  discount = signal(10);\n\n  // Computed signals (только для чтения)\n  itemCount = computed(() =>\n    this.items().reduce((sum, item) => sum + item.quantity, 0)\n  );\n\n  totalPrice = computed(() =>\n    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)\n  );\n\n  discountedPrice = computed(() => {\n    const total = this.totalPrice();\n    const disc = this.discount();\n    return total - (total * disc / 100);\n  });\n\n  addItem(): void {\n    this.items.update(items => [\n      ...items,\n      { name: \'Наушники\', price: 5000, quantity: 1 }\n    ]);\n  }\n}' },
        { type: 'heading', value: 'Свойства computed' },
        { type: 'list', value: [
          'Ленивый — вычисляется только при первом чтении',
          'Кэшируемый — пересчитывается только при изменении зависимостей',
          'Только для чтения — нельзя вызвать .set() или .update()',
          'Автоматическое отслеживание — зависимости определяются автоматически'
        ] },
        { type: 'warning', value: 'Внутри computed нельзя изменять другие signals (set/update). computed должен быть чистой функцией без побочных эффектов.' }
      ]
    },
    {
      id: 3,
      title: 'effect — побочные эффекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'effect() выполняет побочные эффекты при изменении signals. Он автоматически отслеживает зависимости и вызывается при каждом изменении.' },
        { type: 'heading', value: 'Использование effect' },
        { type: 'code', language: 'typescript', value: 'import { Component, signal, effect, inject } from \'@angular/core\';\n\n@Component({\n  selector: \'app-settings\',\n  standalone: true,\n  template: `\n    <h2>Настройки</h2>\n    <label>\n      Тема:\n      <select (change)="setTheme($event)">\n        <option value="light">Светлая</option>\n        <option value="dark">Тёмная</option>\n      </select>\n    </label>\n    <label>\n      Язык:\n      <select (change)="setLanguage($event)">\n        <option value="ru">Русский</option>\n        <option value="en">English</option>\n      </select>\n    </label>\n  `\n})\nexport class SettingsComponent {\n  theme = signal<\'light\' | \'dark\'>(\'light\');\n  language = signal<\'ru\' | \'en\'>(\'ru\');\n\n  constructor() {\n    // Effect для сохранения в localStorage\n    effect(() => {\n      const currentTheme = this.theme();  // Автоотслеживание!\n      localStorage.setItem(\'theme\', currentTheme);\n      document.body.className = currentTheme;\n      console.log(\'Тема изменена:\', currentTheme);\n    });\n\n    // Отдельный effect для языка\n    effect(() => {\n      const lang = this.language();\n      localStorage.setItem(\'language\', lang);\n      console.log(\'Язык изменён:\', lang);\n    });\n  }\n\n  setTheme(event: Event): void {\n    const value = (event.target as HTMLSelectElement).value as \'light\' | \'dark\';\n    this.theme.set(value);\n  }\n\n  setLanguage(event: Event): void {\n    const value = (event.target as HTMLSelectElement).value as \'ru\' | \'en\';\n    this.language.set(value);\n  }\n}' },
        { type: 'heading', value: 'effect с cleanup' },
        { type: 'code', language: 'typescript', value: '// effect может возвращать cleanup-функцию\neffect((onCleanup) => {\n  const interval = setInterval(() => {\n    console.log(\'Текущее значение:\', this.count());\n  }, 1000);\n\n  // Очистка при пересоздании эффекта или уничтожении\n  onCleanup(() => clearInterval(interval));\n});\n\n// Ручное уничтожение effect\nconst effectRef = effect(() => {\n  console.log(this.data());\n});\neffectRef.destroy(); // Остановить эффект' },
        { type: 'note', value: 'effect() должен вызываться в контексте injection (конструктор или поле класса). Внутри effect нельзя изменять signals по умолчанию — используйте { allowSignalWrites: true } при необходимости.' }
      ]
    },
    {
      id: 4,
      title: 'Signal Inputs и Model Inputs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular 17.1+ вводит signal-based inputs — декларативный способ получения входных данных через signals вместо декоратора @Input.' },
        { type: 'heading', value: 'Signal Inputs' },
        { type: 'code', language: 'typescript', value: 'import { Component, input, computed } from \'@angular/core\';\n\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,\n  template: `\n    <div class="card">\n      <h3>{{ fullName() }}</h3>\n      <p>{{ email() }}</p>\n      @if (showBadge()) {\n        <span class="badge">VIP</span>\n      }\n    </div>\n  `\n})\nexport class UserCardComponent {\n  // Обязательный input (signal)\n  name = input.required<string>();\n  email = input.required<string>();\n\n  // Необязательный input со значением по умолчанию\n  showBadge = input(false);\n\n  // Computed на основе input signal\n  fullName = computed(() => this.name().toUpperCase());\n}\n\n// Использование:\n// <app-user-card [name]="\'Иван\'" [email]="\'ivan@mail.ru\'" [showBadge]="true" />' },
        { type: 'heading', value: 'Model Inputs (двусторонняя привязка)' },
        { type: 'code', language: 'typescript', value: 'import { Component, model } from \'@angular/core\';\n\n@Component({\n  selector: \'app-toggle\',\n  standalone: true,\n  template: `\n    <button (click)="toggle()" [class.active]="checked()">\n      {{ checked() ? \'Вкл\' : \'Выкл\' }}\n    </button>\n  `\n})\nexport class ToggleComponent {\n  // model() — двусторонняя привязка через signal\n  checked = model(false);\n\n  toggle(): void {\n    this.checked.update(v => !v);\n  }\n}\n\n// Использование:\n// <app-toggle [(checked)]="isEnabled" />\n// Родитель: isEnabled = signal(false);' },
        { type: 'tip', value: 'Signal inputs — будущее Angular. Они работают как обычные signals, поддерживают computed и effect. Постепенно вытесняют @Input() и @Output().' }
      ]
    },
    {
      id: 5,
      title: 'Interop: Signals и RxJS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular предоставляет утилиты для преобразования между Signals и Observable. Это позволяет использовать оба подхода вместе.' },
        { type: 'heading', value: 'toSignal и toObservable' },
        { type: 'code', language: 'typescript', value: 'import { Component, signal, inject } from \'@angular/core\';\nimport { toSignal, toObservable } from \'@angular/core/rxjs-interop\';\nimport { HttpClient } from \'@angular/common/http\';\nimport { interval } from \'rxjs\';\n\n@Component({\n  selector: \'app-demo\',\n  standalone: true,\n  template: `\n    <p>Время: {{ timer() }}</p>\n    <p>Пользователи: {{ users()?.length ?? \'загрузка...\' }}</p>\n  `\n})\nexport class DemoComponent {\n  private http = inject(HttpClient);\n\n  // Observable -> Signal\n  timer = toSignal(interval(1000), { initialValue: 0 });\n\n  users = toSignal(\n    this.http.get<User[]>(\'/api/users\'),\n    { initialValue: undefined }  // undefined пока загружается\n  );\n\n  // Signal -> Observable\n  searchTerm = signal(\'\');\n  searchTerm$ = toObservable(this.searchTerm);\n  // Можно использовать с RxJS операторами:\n  // searchTerm$.pipe(debounceTime(300), switchMap(...))\n}' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: [
          'Signals — локальное состояние компонента (counter, form data, UI flags)',
          'RxJS — HTTP-запросы, WebSocket, сложные асинхронные потоки',
          'toSignal — когда нужно использовать Observable данные в signal-based компоненте',
          'toObservable — когда нужно применить RxJS операторы к signal'
        ] },
        { type: 'warning', value: 'toSignal() подписывается на Observable и НЕ отписывается автоматически, если Observable бесконечный (interval, fromEvent). Используйте takeUntilDestroyed().' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Корзина на Signals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте компонент корзины интернет-магазина, полностью построенный на Signals: signal, computed, effect.',
      requirements: [
        'signal для массива товаров в корзине',
        'computed для общей стоимости, количества товаров и скидки',
        'effect для сохранения корзины в localStorage',
        'Кнопки добавления, удаления и изменения количества',
        'Signal input для списка доступных товаров',
        'Отображение без async pipe (через вызов signal())'
      ],
      hint: 'signal<CartItem[]>([]) для корзины. computed(() => items().reduce(...)) для вычислений. effect(() => localStorage.setItem(\'cart\', JSON.stringify(items()))).',
      expectedOutput: 'Корзина с реактивными вычислениями через computed. Данные сохраняются в localStorage через effect. Нет подписок и async pipe.',
      solution: `import { Component, signal, computed, effect } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

@Component({
  selector: 'app-signal-cart',
  standalone: true,
  template: \`
    <h2>Магазин</h2>
    <div class="products">
      @for (product of products(); track product.id) {
        <div class="product">
          <span>{{ product.name }} — {{ product.price }} руб.</span>
          <button (click)="addToCart(product)">В корзину</button>
        </div>
      }
    </div>

    <h2>Корзина ({{ itemCount() }} шт.)</h2>
    @for (item of cartItems(); track item.id) {
      <div class="cart-item">
        <span>{{ item.name }}</span>
        <button (click)="changeQuantity(item.id, -1)">-</button>
        <span>{{ item.quantity }}</span>
        <button (click)="changeQuantity(item.id, 1)">+</button>
        <span>{{ item.price * item.quantity }} руб.</span>
        <button (click)="removeFromCart(item.id)">Удалить</button>
      </div>
    } @empty {
      <p>Корзина пуста</p>
    }

    @if (cartItems().length > 0) {
      <div class="summary">
        <p>Подытог: {{ totalPrice() }} руб.</p>
        <p>Скидка ({{ discountPercent() }}%): -{{ discountAmount() }} руб.</p>
        <p><strong>Итого: {{ finalPrice() }} руб.</strong></p>
        <button (click)="clearCart()">Очистить корзину</button>
      </div>
    }
  \`
})
export class SignalCartComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Angular книга', price: 2500 },
    { id: 2, name: 'TypeScript курс', price: 5000 },
    { id: 3, name: 'RxJS гайд', price: 3000 },
    { id: 4, name: 'NgRx справочник', price: 4000 }
  ]);

  cartItems = signal<CartItem[]>([]);

  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  discountPercent = computed(() => {
    const total = this.totalPrice();
    if (total >= 10000) return 15;
    if (total >= 5000) return 10;
    return 0;
  });

  discountAmount = computed(() =>
    Math.round(this.totalPrice() * this.discountPercent() / 100)
  );

  finalPrice = computed(() =>
    this.totalPrice() - this.discountAmount()
  );

  constructor() {
    // Загрузка из localStorage
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems.set(JSON.parse(saved));
    }

    // Автосохранение в localStorage
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    });
  }

  addToCart(product: Product): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(id: number): void {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  changeQuantity(id: number, delta: number): void {
    this.cartItems.update(items =>
      items
        .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}`,
      explanation: 'signal() хранит состояние корзины. computed() автоматически пересчитывает производные значения (сумму, скидку, итого) при любом изменении корзины. effect() сохраняет корзину в localStorage при каждом изменении. Нет подписок, нет async pipe, нет утечек памяти. Шаблон вызывает signals как функции: cartItems(), totalPrice().'
    }
  ]
}
