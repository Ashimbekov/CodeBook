export default {
  id: 7,
  title: 'Сервисы и Dependency Injection',
  description: 'Создание сервисов, система внедрения зависимостей Angular, провайдеры и иерархия инжекторов',
  lessons: [
    {
      id: 1,
      title: 'Что такое сервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервис — это класс с определённой ответственностью: работа с API, бизнес-логика, хранение состояния, логирование. Сервисы отделяют логику от компонентов, делая код чистым и переиспользуемым.' },
        { type: 'heading', value: 'Создание сервиса' },
        { type: 'code', language: 'bash', value: '# Генерация сервиса через CLI\nng generate service services/user\n# или\nng g s services/user\n\n# Создаёт:\n# src/app/services/user.service.ts\n# src/app/services/user.service.spec.ts' },
        { type: 'heading', value: 'Структура сервиса' },
        { type: 'code', language: 'typescript', value: '// user.service.ts\nimport { Injectable } from \'@angular/core\';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n@Injectable({\n  providedIn: \'root\'  // Доступен во всём приложении (синглтон)\n})\nexport class UserService {\n  private users: User[] = [\n    { id: 1, name: \'Иван\', email: \'ivan@mail.ru\' },\n    { id: 2, name: \'Мария\', email: \'maria@mail.ru\' }\n  ];\n\n  getAll(): User[] {\n    return this.users;\n  }\n\n  getById(id: number): User | undefined {\n    return this.users.find(u => u.id === id);\n  }\n\n  add(user: Omit<User, \'id\'>): void {\n    const newId = Math.max(...this.users.map(u => u.id)) + 1;\n    this.users.push({ ...user, id: newId });\n  }\n\n  delete(id: number): void {\n    this.users = this.users.filter(u => u.id !== id);\n  }\n}' },
        { type: 'tip', value: '@Injectable({ providedIn: \'root\' }) — рекомендуемый способ регистрации сервиса. Он создаёт один экземпляр (синглтон) для всего приложения и поддерживает tree-shaking.' }
      ]
    },
    {
      id: 2,
      title: 'Dependency Injection (DI)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dependency Injection — это паттерн, при котором зависимости передаются в класс извне, а не создаются внутри. Angular имеет мощную встроенную систему DI, которая автоматически создаёт и внедряет сервисы.' },
        { type: 'heading', value: 'Внедрение сервиса в компонент' },
        { type: 'code', language: 'typescript', value: '// Способ 1: через конструктор (классический)\nimport { Component, OnInit } from \'@angular/core\';\nimport { UserService } from \'../services/user.service\';\n\n@Component({\n  selector: \'app-user-list\',\n  standalone: true,\n  template: `\n    @for (user of users; track user.id) {\n      <p>{{ user.name }} — {{ user.email }}</p>\n    }\n  `\n})\nexport class UserListComponent implements OnInit {\n  users: User[] = [];\n\n  // Angular автоматически создаёт и передаёт UserService\n  constructor(private userService: UserService) {}\n\n  ngOnInit(): void {\n    this.users = this.userService.getAll();\n  }\n}\n\n// Способ 2: через inject() (Angular 14+, рекомендуется)\nimport { Component, OnInit, inject } from \'@angular/core\';\n\n@Component({ /* ... */ })\nexport class UserListComponent implements OnInit {\n  private userService = inject(UserService);\n  users: User[] = [];\n\n  ngOnInit(): void {\n    this.users = this.userService.getAll();\n  }\n}' },
        { type: 'heading', value: 'Почему DI, а не new' },
        { type: 'code', language: 'typescript', value: '// ❌ БЕЗ DI — плохо\nexport class UserListComponent {\n  private userService = new UserService(); // жёсткая зависимость\n  // Проблемы:\n  // 1. Нельзя подменить для тестов\n  // 2. Каждый компонент создаёт свой экземпляр\n  // 3. Если UserService зависит от HttpClient — придётся передавать вручную\n}\n\n// ✅ С DI — хорошо\nexport class UserListComponent {\n  private userService = inject(UserService);\n  // Преимущества:\n  // 1. Angular управляет жизненным циклом\n  // 2. Один экземпляр (синглтон) для всего приложения\n  // 3. Легко подменить моком в тестах\n  // 4. Зависимости сервиса разрешаются автоматически\n}' },
        { type: 'note', value: 'Функция inject() — современный и предпочтительный способ внедрения зависимостей. Она работает только в контексте DI (конструктор, поле класса с декоратором, функции-провайдеры).' }
      ]
    },
    {
      id: 3,
      title: 'Провайдеры и область видимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Провайдеры определяют, как Angular создаёт экземпляры сервисов. Можно настроить область видимости: глобальный синглтон, один экземпляр на компонент или каждый раз новый.' },
        { type: 'heading', value: 'Уровни предоставления сервисов' },
        { type: 'code', language: 'typescript', value: '// 1. Root level — один экземпляр для всего приложения (синглтон)\n@Injectable({ providedIn: \'root\' })\nexport class GlobalService {}\n\n// 2. Component level — новый экземпляр для каждого компонента\n@Component({\n  selector: \'app-user\',\n  standalone: true,\n  providers: [UserService],  // Каждый app-user получит свой UserService\n  template: `...`\n})\nexport class UserComponent {\n  private userService = inject(UserService);\n}\n\n// 3. Application config level\n// app.config.ts\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(),\n    { provide: LoggerService, useClass: ConsoleLoggerService }\n  ]\n};' },
        { type: 'heading', value: 'Типы провайдеров' },
        { type: 'code', language: 'typescript', value: '// useClass — использовать другой класс\n{ provide: LoggerService, useClass: FileLoggerService }\n\n// useValue — использовать конкретное значение\n{ provide: API_URL, useValue: \'https://api.example.com\' }\n\n// useFactory — создать через фабрику\n{\n  provide: UserService,\n  useFactory: (http: HttpClient) => {\n    const isProd = environment.production;\n    return isProd ? new RealUserService(http) : new MockUserService();\n  },\n  deps: [HttpClient]\n}\n\n// useExisting — алиас на другой сервис\n{ provide: AbstractLogger, useExisting: ConsoleLoggerService }' },
        { type: 'tip', value: 'InjectionToken используется для внедрения НЕ-классовых значений (строки, числа, конфигурации). Создайте токен через new InjectionToken<string>(\'API_URL\').' }
      ]
    },
    {
      id: 4,
      title: 'InjectionToken и абстракции',
      type: 'theory',
      content: [
        { type: 'text', value: 'InjectionToken позволяет внедрять значения, которые не являются классами: строки, конфигурации, функции. Это основа для создания гибких абстракций.' },
        { type: 'heading', value: 'Создание InjectionToken' },
        { type: 'code', language: 'typescript', value: '// tokens.ts\nimport { InjectionToken } from \'@angular/core\';\n\nexport interface AppConfig {\n  apiUrl: string;\n  appName: string;\n  maxRetries: number;\n  features: {\n    darkMode: boolean;\n    notifications: boolean;\n  };\n}\n\nexport const APP_CONFIG = new InjectionToken<AppConfig>(\'app.config\');\nexport const API_URL = new InjectionToken<string>(\'api.url\');\n\n// Предоставление значений в app.config.ts\nimport { APP_CONFIG, API_URL } from \'./tokens\';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    {\n      provide: APP_CONFIG,\n      useValue: {\n        apiUrl: \'https://api.example.com\',\n        appName: \'My Angular App\',\n        maxRetries: 3,\n        features: { darkMode: true, notifications: true }\n      }\n    },\n    { provide: API_URL, useValue: \'https://api.example.com\' }\n  ]\n};' },
        { type: 'heading', value: 'Использование токенов в сервисах' },
        { type: 'code', language: 'typescript', value: '@Injectable({ providedIn: \'root\' })\nexport class ApiService {\n  private config = inject(APP_CONFIG);\n  private apiUrl = inject(API_URL);\n\n  getUsers(): Observable<User[]> {\n    return this.http.get<User[]>(`${this.config.apiUrl}/users`).pipe(\n      retry(this.config.maxRetries)\n    );\n  }\n}\n\n// В компоненте\n@Component({ /* ... */ })\nexport class HeaderComponent {\n  private config = inject(APP_CONFIG);\n  appName = this.config.appName;\n  isDarkMode = this.config.features.darkMode;\n}' },
        { type: 'note', value: 'InjectionToken — лучшая практика для конфигурации. Не хардкодьте URL, ключи API и настройки. Используйте токены, чтобы легко менять значения между средами (dev/prod).' }
      ]
    },
    {
      id: 5,
      title: 'Сервис для управления состоянием',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервисы часто используются как простое хранилище состояния. С помощью BehaviorSubject из RxJS можно создать реактивный стор, на который компоненты подписываются.' },
        { type: 'heading', value: 'Сервис-стор с BehaviorSubject' },
        { type: 'code', language: 'typescript', value: '// cart.service.ts\nimport { Injectable } from \'@angular/core\';\nimport { BehaviorSubject, Observable } from \'rxjs\';\nimport { map } from \'rxjs/operators\';\n\ninterface CartItem {\n  id: number;\n  name: string;\n  price: number;\n  quantity: number;\n}\n\n@Injectable({ providedIn: \'root\' })\nexport class CartService {\n  // BehaviorSubject хранит текущее значение\n  private cartItems$ = new BehaviorSubject<CartItem[]>([]);\n\n  // Публичные Observable для компонентов\n  readonly items$: Observable<CartItem[]> = this.cartItems$.asObservable();\n  readonly totalPrice$: Observable<number> = this.items$.pipe(\n    map(items => items.reduce((sum, item) => sum + item.price * item.quantity, 0))\n  );\n  readonly itemCount$: Observable<number> = this.items$.pipe(\n    map(items => items.reduce((sum, item) => sum + item.quantity, 0))\n  );\n\n  addItem(product: Omit<CartItem, \'quantity\'>): void {\n    const items = this.cartItems$.getValue();\n    const existing = items.find(i => i.id === product.id);\n    if (existing) {\n      existing.quantity++;\n      this.cartItems$.next([...items]);\n    } else {\n      this.cartItems$.next([...items, { ...product, quantity: 1 }]);\n    }\n  }\n\n  removeItem(id: number): void {\n    const items = this.cartItems$.getValue().filter(i => i.id !== id);\n    this.cartItems$.next(items);\n  }\n\n  clear(): void {\n    this.cartItems$.next([]);\n  }\n}' },
        { type: 'heading', value: 'Использование в компонентах' },
        { type: 'code', language: 'typescript', value: '// cart-badge.component.ts — показывает количество товаров\n@Component({\n  selector: \'app-cart-badge\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `<span class="badge">🛒 {{ itemCount$ | async }}</span>`\n})\nexport class CartBadgeComponent {\n  itemCount$ = inject(CartService).itemCount$;\n}\n\n// cart-page.component.ts — страница корзины\n@Component({\n  selector: \'app-cart-page\',\n  standalone: true,\n  imports: [AsyncPipe, CurrencyPipe],\n  template: `\n    @if (items$ | async; as items) {\n      @for (item of items; track item.id) {\n        <div>{{ item.name }} × {{ item.quantity }} = {{ item.price * item.quantity | currency:\'RUB\' }}</div>\n        <button (click)="remove(item.id)">Удалить</button>\n      } @empty {\n        <p>Корзина пуста</p>\n      }\n      <h3>Итого: {{ totalPrice$ | async | currency:\'RUB\' }}</h3>\n    }\n  `\n})\nexport class CartPageComponent {\n  private cartService = inject(CartService);\n  items$ = this.cartService.items$;\n  totalPrice$ = this.cartService.totalPrice$;\n\n  remove(id: number): void {\n    this.cartService.removeItem(id);\n  }\n}' },
        { type: 'tip', value: 'Паттерн \"сервис-стор\" подходит для небольших и средних приложений. Для сложного состояния используйте NgRx (рассмотрим позже).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сервис управления задачами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте TodoService с BehaviorSubject для управления списком задач и два компонента, использующих этот сервис.',
      requirements: [
        'TodoService с BehaviorSubject<Todo[]> и методами: add, toggle, delete, getAll$',
        'Observable completedCount$ — количество выполненных задач',
        'TodoFormComponent — форма добавления задачи (использует сервис)',
        'TodoListComponent — список задач с отметкой и удалением (использует сервис)',
        'Оба компонента используют inject() для внедрения сервиса',
        'Все данные отображаются через async pipe'
      ],
      hint: 'BehaviorSubject хранит текущее значение. Для обновления используйте this.todos$.next(newArray). Компоненты подписываются через async pipe.',
      expectedOutput: 'Форма добавляет задачу в общий список. Список отображает задачи с возможностью отметки и удаления. Счётчик показывает количество выполненных задач.',
      solution: `// todo.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([
    { id: 1, title: 'Изучить Angular сервисы', completed: false },
    { id: 2, title: 'Разобрать DI', completed: true }
  ]);
  private nextId = 3;

  readonly all$: Observable<Todo[]> = this.todos$.asObservable();
  readonly completedCount$: Observable<number> = this.all$.pipe(
    map(todos => todos.filter(t => t.completed).length)
  );
  readonly totalCount$: Observable<number> = this.all$.pipe(
    map(todos => todos.length)
  );

  add(title: string): void {
    const current = this.todos$.getValue();
    this.todos$.next([...current, { id: this.nextId++, title, completed: false }]);
  }

  toggle(id: number): void {
    const updated = this.todos$.getValue().map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.todos$.next(updated);
  }

  delete(id: number): void {
    const filtered = this.todos$.getValue().filter(t => t.id !== id);
    this.todos$.next(filtered);
  }
}

// todo-form.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <form (submit)="addTodo($event)">
      <input [(ngModel)]="newTitle" name="title" placeholder="Новая задача..." />
      <button type="submit" [disabled]="!newTitle.trim()">Добавить</button>
    </form>
  \`
})
export class TodoFormComponent {
  private todoService = inject(TodoService);
  newTitle = '';

  addTodo(event: Event): void {
    event.preventDefault();
    if (this.newTitle.trim()) {
      this.todoService.add(this.newTitle.trim());
      this.newTitle = '';
    }
  }
}

// todo-list.component.ts
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TodoService } from './todo.service';
import { TodoFormComponent } from './todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [AsyncPipe, TodoFormComponent],
  template: \`
    <h2>Задачи ({{ completedCount$ | async }}/{{ totalCount$ | async }} выполнено)</h2>
    <app-todo-form />
    @if (todos$ | async; as todos) {
      @for (todo of todos; track todo.id) {
        <div class="todo-item" [class.done]="todo.completed">
          <input type="checkbox" [checked]="todo.completed" (change)="toggle(todo.id)" />
          <span>{{ todo.title }}</span>
          <button (click)="delete(todo.id)">Удалить</button>
        </div>
      } @empty {
        <p>Нет задач</p>
      }
    }
  \`
})
export class TodoListComponent {
  private todoService = inject(TodoService);
  todos$ = this.todoService.all$;
  completedCount$ = this.todoService.completedCount$;
  totalCount$ = this.todoService.totalCount$;

  toggle(id: number): void { this.todoService.toggle(id); }
  delete(id: number): void { this.todoService.delete(id); }
}`,
      explanation: 'TodoService — синглтон сервис с BehaviorSubject. Оба компонента используют один экземпляр сервиса через inject(). TodoFormComponent добавляет задачи, TodoListComponent отображает и управляет ими. Данные реактивны: изменения в сервисе автоматически отражаются во всех подписанных компонентах через async pipe.'
    }
  ]
}
