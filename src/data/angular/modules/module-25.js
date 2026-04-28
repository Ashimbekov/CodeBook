export default {
  id: 25,
  title: 'Практический проект: Todo App',
  description: 'Создание полноценного приложения Todo с использованием всех изученных концепций Angular',
  lessons: [
    {
      id: 1,
      title: 'Архитектура Todo приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'В этом модуле мы создадим полноценное Todo приложение, используя все изученные концепции: standalone компоненты, сервисы с Signals, реактивные формы, роутинг, Angular Material и тестирование.' },
        { type: 'heading', value: 'Структура проекта' },
        { type: 'code', language: 'bash', value: 'src/app/\n├── app.component.ts          # Корневой компонент с layout\n├── app.config.ts             # Конфигурация\n├── app.routes.ts             # Маршруты\n├── core/\n│   ├── models/\n│   │   └── todo.model.ts     # Интерфейсы\n│   └── services/\n│       └── todo.service.ts   # Сервис с логикой\n├── features/\n│   ├── todo-list/\n│   │   └── todo-list.component.ts\n│   ├── todo-form/\n│   │   └── todo-form.component.ts\n│   ├── todo-item/\n│   │   └── todo-item.component.ts\n│   ├── todo-filter/\n│   │   └── todo-filter.component.ts\n│   └── todo-stats/\n│       └── todo-stats.component.ts\n└── shared/\n    └── pipes/\n        └── relative-time.pipe.ts' },
        { type: 'heading', value: 'Модель данных' },
        { type: 'code', language: 'typescript', value: '// core/models/todo.model.ts\nexport interface Todo {\n  id: string;\n  title: string;\n  completed: boolean;\n  priority: \'low\' | \'medium\' | \'high\';\n  createdAt: Date;\n  dueDate?: Date;\n}\n\nexport type TodoFilter = \'all\' | \'active\' | \'completed\';\nexport type TodoSort = \'date\' | \'priority\' | \'name\';\n\nexport interface TodoStats {\n  total: number;\n  active: number;\n  completed: number;\n  completionRate: number;\n}' },
        { type: 'heading', value: 'Функциональность' },
        { type: 'list', value: [
          'Добавление задач с названием, приоритетом и сроком',
          'Отметка задачи как выполненной',
          'Удаление задач',
          'Фильтрация: все, активные, выполненные',
          'Сортировка: по дате, приоритету, имени',
          'Статистика: общее, активные, выполненные, процент выполнения',
          'Сохранение в localStorage',
          'Анимации при добавлении/удалении'
        ] }
      ]
    },
    {
      id: 2,
      title: 'TodoService на Signals',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервис управляет состоянием всех задач. Используем Signals для реактивности и computed для производных данных.' },
        { type: 'heading', value: 'Реализация TodoService' },
        { type: 'code', language: 'typescript', value: '// core/services/todo.service.ts\nimport { Injectable, signal, computed, effect } from \'@angular/core\';\nimport { Todo, TodoFilter, TodoSort, TodoStats } from \'../models/todo.model\';\n\n@Injectable({ providedIn: \'root\' })\nexport class TodoService {\n  // Приватные сигналы состояния\n  private todos = signal<Todo[]>(this.loadFromStorage());\n  private filter = signal<TodoFilter>(\'all\');\n  private sort = signal<TodoSort>(\'date\');\n  private searchTerm = signal(\'\');\n\n  // Публичные вычисляемые сигналы\n  readonly currentFilter = this.filter.asReadonly();\n  readonly currentSort = this.sort.asReadonly();\n\n  readonly filteredTodos = computed(() => {\n    let items = this.todos();\n    const term = this.searchTerm().toLowerCase();\n    const filterValue = this.filter();\n    const sortValue = this.sort();\n\n    // Фильтрация по статусу\n    if (filterValue === \'active\') items = items.filter(t => !t.completed);\n    if (filterValue === \'completed\') items = items.filter(t => t.completed);\n\n    // Поиск\n    if (term) items = items.filter(t => t.title.toLowerCase().includes(term));\n\n    // Сортировка\n    return [...items].sort((a, b) => {\n      if (sortValue === \'date\') return b.createdAt.getTime() - a.createdAt.getTime();\n      if (sortValue === \'priority\') {\n        const order = { high: 0, medium: 1, low: 2 };\n        return order[a.priority] - order[b.priority];\n      }\n      return a.title.localeCompare(b.title);\n    });\n  });\n\n  readonly stats = computed<TodoStats>(() => {\n    const all = this.todos();\n    const completed = all.filter(t => t.completed).length;\n    return {\n      total: all.length,\n      active: all.length - completed,\n      completed,\n      completionRate: all.length ? Math.round((completed / all.length) * 100) : 0\n    };\n  });\n\n  constructor() {\n    // Автосохранение в localStorage\n    effect(() => {\n      const todos = this.todos();\n      localStorage.setItem(\'todos\', JSON.stringify(todos));\n    });\n  }\n\n  // Методы CRUD\n  add(title: string, priority: Todo[\'priority\'] = \'medium\', dueDate?: Date): void {\n    const newTodo: Todo = {\n      id: crypto.randomUUID(),\n      title: title.trim(),\n      completed: false,\n      priority,\n      createdAt: new Date(),\n      dueDate\n    };\n    this.todos.update(todos => [newTodo, ...todos]);\n  }\n\n  toggle(id: string): void {\n    this.todos.update(todos =>\n      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)\n    );\n  }\n\n  delete(id: string): void {\n    this.todos.update(todos => todos.filter(t => t.id !== id));\n  }\n\n  clearCompleted(): void {\n    this.todos.update(todos => todos.filter(t => !t.completed));\n  }\n\n  setFilter(filter: TodoFilter): void { this.filter.set(filter); }\n  setSort(sort: TodoSort): void { this.sort.set(sort); }\n  setSearch(term: string): void { this.searchTerm.set(term); }\n\n  private loadFromStorage(): Todo[] {\n    try {\n      const data = localStorage.getItem(\'todos\');\n      if (!data) return [];\n      return JSON.parse(data).map((t: any) => ({\n        ...t,\n        createdAt: new Date(t.createdAt),\n        dueDate: t.dueDate ? new Date(t.dueDate) : undefined\n      }));\n    } catch {\n      return [];\n    }\n  }\n}' },
        { type: 'tip', value: 'crypto.randomUUID() генерирует уникальный ID. Signals + computed обеспечивают реактивность без RxJS. effect автоматически сохраняет при любом изменении.' }
      ]
    },
    {
      id: 3,
      title: 'Компонент формы добавления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Форма добавления задачи использует Reactive Forms с валидацией. Она включает поле названия, выбор приоритета и опциональную дату.' },
        { type: 'heading', value: 'TodoFormComponent' },
        { type: 'code', language: 'typescript', value: '// features/todo-form/todo-form.component.ts\nimport { Component, inject } from \'@angular/core\';\nimport { ReactiveFormsModule, FormBuilder, Validators } from \'@angular/forms\';\nimport { TodoService } from \'../../core/services/todo.service\';\n\n@Component({\n  selector: \'app-todo-form\',\n  standalone: true,\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="todo-form">\n      <div class="form-row">\n        <input\n          formControlName="title"\n          placeholder="Что нужно сделать?"\n          class="title-input"\n          (keydown.enter)="onSubmit()"\n        />\n\n        <select formControlName="priority" class="priority-select">\n          <option value="low">Низкий</option>\n          <option value="medium">Средний</option>\n          <option value="high">Высокий</option>\n        </select>\n\n        <input\n          formControlName="dueDate"\n          type="date"\n          class="date-input"\n        />\n\n        <button\n          type="submit"\n          [disabled]="form.invalid"\n          class="add-btn"\n        >\n          Добавить\n        </button>\n      </div>\n\n      @if (form.get(\'title\')?.invalid && form.get(\'title\')?.touched) {\n        <p class="error">Введите название задачи (мин. 2 символа)</p>\n      }\n    </form>\n  `,\n  styles: [`\n    .todo-form { margin-bottom: 1rem; }\n    .form-row { display: flex; gap: 8px; }\n    .title-input { flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; }\n    .title-input:focus { border-color: #dd0031; outline: none; }\n    .priority-select, .date-input { padding: 10px; border: 2px solid #ddd; border-radius: 8px; }\n    .add-btn { padding: 10px 20px; background: #dd0031; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }\n    .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }\n    .error { color: #dd0031; font-size: 0.85rem; margin-top: 4px; }\n  `]\n})\nexport class TodoFormComponent {\n  private todoService = inject(TodoService);\n  private fb = inject(FormBuilder);\n\n  form = this.fb.group({\n    title: [\'\', [Validators.required, Validators.minLength(2)]],\n    priority: [\'medium\' as const],\n    dueDate: [\'\']\n  });\n\n  onSubmit(): void {\n    if (this.form.valid) {\n      const { title, priority, dueDate } = this.form.value;\n      this.todoService.add(\n        title!,\n        priority as any,\n        dueDate ? new Date(dueDate) : undefined\n      );\n      this.form.reset({ title: \'\', priority: \'medium\', dueDate: \'\' });\n    }\n  }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Компоненты списка и элемента',
      type: 'theory',
      content: [
        { type: 'text', value: 'TodoItemComponent — презентационный компонент с OnPush. TodoListComponent — контейнер, который берёт данные из сервиса.' },
        { type: 'heading', value: 'TodoItemComponent' },
        { type: 'code', language: 'typescript', value: '// features/todo-item/todo-item.component.ts\nimport { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from \'@angular/core\';\nimport { Todo } from \'../../core/models/todo.model\';\nimport { DatePipe } from \'@angular/common\';\n\n@Component({\n  selector: \'app-todo-item\',\n  standalone: true,\n  imports: [DatePipe],\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `\n    <div class="todo-item" [class.completed]="todo.completed" [class.high]="todo.priority === \'high\'">\n      <input\n        type="checkbox"\n        [checked]="todo.completed"\n        (change)="toggled.emit(todo.id)"\n        class="checkbox"\n      />\n      <div class="content">\n        <span class="title">{{ todo.title }}</span>\n        <div class="meta">\n          <span class="priority-badge" [class]="todo.priority">{{ priorityLabel }}</span>\n          <span class="date">{{ todo.createdAt | date:\'dd.MM.yyyy\' }}</span>\n          @if (todo.dueDate) {\n            <span class="due" [class.overdue]="isOverdue">до {{ todo.dueDate | date:\'dd.MM\' }}</span>\n          }\n        </div>\n      </div>\n      <button class="delete-btn" (click)="deleted.emit(todo.id)">✕</button>\n    </div>\n  `,\n  styles: [`\n    .todo-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; background: white; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s; }\n    .todo-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }\n    .completed .title { text-decoration: line-through; color: #999; }\n    .high { border-left: 4px solid #dd0031; }\n    .content { flex: 1; }\n    .title { font-size: 1rem; }\n    .meta { display: flex; gap: 8px; margin-top: 4px; font-size: 0.8rem; color: #888; }\n    .priority-badge { padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }\n    .high { background: #ffebee; color: #c62828; }\n    .medium { background: #fff3e0; color: #e65100; }\n    .low { background: #e8f5e9; color: #2e7d32; }\n    .overdue { color: #dd0031; font-weight: bold; }\n    .checkbox { width: 20px; height: 20px; cursor: pointer; }\n    .delete-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 1.2rem; padding: 4px 8px; }\n    .delete-btn:hover { color: #dd0031; }\n  `]\n})\nexport class TodoItemComponent {\n  @Input({ required: true }) todo!: Todo;\n  @Output() toggled = new EventEmitter<string>();\n  @Output() deleted = new EventEmitter<string>();\n\n  get priorityLabel(): string {\n    const labels = { low: \'Низкий\', medium: \'Средний\', high: \'Высокий\' };\n    return labels[this.todo.priority];\n  }\n\n  get isOverdue(): boolean {\n    return !!this.todo.dueDate && !this.todo.completed && new Date() > this.todo.dueDate;\n  }\n}' },
        { type: 'heading', value: 'TodoListComponent' },
        { type: 'code', language: 'typescript', value: '// features/todo-list/todo-list.component.ts\nimport { Component, inject } from \'@angular/core\';\nimport { TodoService } from \'../../core/services/todo.service\';\nimport { TodoItemComponent } from \'../todo-item/todo-item.component\';\n\n@Component({\n  selector: \'app-todo-list\',\n  standalone: true,\n  imports: [TodoItemComponent],\n  template: `\n    @for (todo of todoService.filteredTodos(); track todo.id) {\n      <app-todo-item\n        [todo]="todo"\n        (toggled)="todoService.toggle($event)"\n        (deleted)="todoService.delete($event)"\n      />\n    } @empty {\n      <div class="empty">\n        <p>Нет задач</p>\n        <p class="hint">Добавьте первую задачу выше</p>\n      </div>\n    }\n  `,\n  styles: [`\n    .empty { text-align: center; padding: 3rem; color: #999; }\n    .hint { font-size: 0.9rem; }\n  `]\n})\nexport class TodoListComponent {\n  todoService = inject(TodoService);\n}' }
      ]
    },
    {
      id: 5,
      title: 'Фильтры и статистика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компоненты фильтрации и статистики завершают интерфейс приложения. Они используют computed signals из TodoService.' },
        { type: 'heading', value: 'TodoFilterComponent' },
        { type: 'code', language: 'typescript', value: '// features/todo-filter/todo-filter.component.ts\nimport { Component, inject } from \'@angular/core\';\nimport { TodoService } from \'../../core/services/todo.service\';\nimport { TodoFilter, TodoSort } from \'../../core/models/todo.model\';\n\n@Component({\n  selector: \'app-todo-filter\',\n  standalone: true,\n  template: `\n    <div class="filters">\n      <div class="search">\n        <input\n          (input)="onSearch($event)"\n          placeholder="Поиск задач..."\n        />\n      </div>\n\n      <div class="filter-buttons">\n        @for (f of filters; track f.value) {\n          <button\n            [class.active]="todoService.currentFilter() === f.value"\n            (click)="todoService.setFilter(f.value)">\n            {{ f.label }}\n          </button>\n        }\n      </div>\n\n      <select (change)="onSortChange($event)">\n        <option value="date">По дате</option>\n        <option value="priority">По приоритету</option>\n        <option value="name">По имени</option>\n      </select>\n    </div>\n  `,\n  styles: [`\n    .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }\n    .search input { padding: 8px 12px; border: 2px solid #ddd; border-radius: 8px; }\n    .filter-buttons { display: flex; gap: 4px; }\n    .filter-buttons button { padding: 6px 14px; border: 1px solid #ddd; background: white; border-radius: 20px; cursor: pointer; }\n    .filter-buttons button.active { background: #dd0031; color: white; border-color: #dd0031; }\n    select { padding: 8px; border: 2px solid #ddd; border-radius: 8px; }\n  `]\n})\nexport class TodoFilterComponent {\n  todoService = inject(TodoService);\n\n  filters: { value: TodoFilter; label: string }[] = [\n    { value: \'all\', label: \'Все\' },\n    { value: \'active\', label: \'Активные\' },\n    { value: \'completed\', label: \'Выполненные\' }\n  ];\n\n  onSearch(event: Event): void {\n    const value = (event.target as HTMLInputElement).value;\n    this.todoService.setSearch(value);\n  }\n\n  onSortChange(event: Event): void {\n    const value = (event.target as HTMLSelectElement).value as TodoSort;\n    this.todoService.setSort(value);\n  }\n}' },
        { type: 'heading', value: 'TodoStatsComponent' },
        { type: 'code', language: 'typescript', value: '// features/todo-stats/todo-stats.component.ts\nimport { Component, inject } from \'@angular/core\';\nimport { TodoService } from \'../../core/services/todo.service\';\n\n@Component({\n  selector: \'app-todo-stats\',\n  standalone: true,\n  template: `\n    <div class="stats">\n      <div class="stat">\n        <span class="number">{{ stats().total }}</span>\n        <span class="label">Всего</span>\n      </div>\n      <div class="stat">\n        <span class="number active">{{ stats().active }}</span>\n        <span class="label">Активных</span>\n      </div>\n      <div class="stat">\n        <span class="number completed">{{ stats().completed }}</span>\n        <span class="label">Выполнено</span>\n      </div>\n      <div class="stat">\n        <div class="progress-bar">\n          <div class="progress" [style.width.%]="stats().completionRate"></div>\n        </div>\n        <span class="label">{{ stats().completionRate }}%</span>\n      </div>\n      @if (stats().completed > 0) {\n        <button class="clear-btn" (click)="todoService.clearCompleted()">Очистить выполненные</button>\n      }\n    </div>\n  `,\n  styles: [`\n    .stats { display: flex; gap: 1.5rem; align-items: center; padding: 1rem; background: #f5f5f5; border-radius: 12px; margin-bottom: 1rem; flex-wrap: wrap; }\n    .stat { text-align: center; }\n    .number { display: block; font-size: 1.5rem; font-weight: bold; }\n    .label { font-size: 0.8rem; color: #888; }\n    .active { color: #1976d2; }\n    .completed { color: #388e3c; }\n    .progress-bar { width: 100px; height: 8px; background: #ddd; border-radius: 4px; overflow: hidden; }\n    .progress { height: 100%; background: #dd0031; transition: width 0.3s; }\n    .clear-btn { padding: 6px 12px; background: none; border: 1px solid #999; border-radius: 6px; cursor: pointer; color: #666; font-size: 0.85rem; }\n    .clear-btn:hover { background: #eee; }\n  `]\n})\nexport class TodoStatsComponent {\n  todoService = inject(TodoService);\n  stats = this.todoService.stats;\n}' }
      ]
    },
    {
      id: 6,
      title: 'Сборка приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Соберём все компоненты вместе в корневом компоненте с маршрутизацией.' },
        { type: 'heading', value: 'AppComponent' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\nimport { Component } from \'@angular/core\';\nimport { TodoFormComponent } from \'./features/todo-form/todo-form.component\';\nimport { TodoListComponent } from \'./features/todo-list/todo-list.component\';\nimport { TodoFilterComponent } from \'./features/todo-filter/todo-filter.component\';\nimport { TodoStatsComponent } from \'./features/todo-stats/todo-stats.component\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [TodoFormComponent, TodoListComponent, TodoFilterComponent, TodoStatsComponent],\n  template: `\n    <div class="app">\n      <header>\n        <h1>Todo App</h1>\n        <p class="subtitle">Управляйте задачами эффективно</p>\n      </header>\n\n      <main>\n        <app-todo-form />\n        <app-todo-stats />\n        <app-todo-filter />\n        <app-todo-list />\n      </main>\n\n      <footer>\n        <p>Создано с Angular и Signals</p>\n      </footer>\n    </div>\n  `,\n  styles: [`\n    .app { max-width: 700px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }\n    header { text-align: center; margin-bottom: 2rem; }\n    h1 { color: #dd0031; margin: 0; font-size: 2.5rem; }\n    .subtitle { color: #888; margin-top: 0.5rem; }\n    footer { text-align: center; margin-top: 3rem; color: #ccc; font-size: 0.85rem; }\n  `]\n})\nexport class AppComponent {}' },
        { type: 'heading', value: 'Что мы использовали' },
        { type: 'list', value: [
          'Standalone компоненты без NgModule',
          'Signals (signal, computed, effect) для состояния',
          'OnPush change detection для производительности',
          'Reactive Forms с валидацией',
          'Иммутабельные обновления данных',
          '@Input/@Output для связи компонентов',
          'localStorage для персистентности',
          'DatePipe для форматирования дат',
          'Стилизация через инлайн styles',
          '@for/@if синтаксис шаблонов Angular 17+'
        ] },
        { type: 'tip', value: 'Это приложение можно расширить: добавить роутинг для отдельных страниц, NgRx для состояния, Angular Material для UI, SSR для SEO, и тесты для каждого компонента.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полный Todo App',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полноценное Todo приложение, объединив все компоненты из урока. Добавьте функциональность редактирования задач.',
      requirements: [
        'TodoService с Signals: CRUD операции, фильтрация, сортировка, статистика',
        'TodoFormComponent с Reactive Forms и валидацией',
        'TodoItemComponent (OnPush) с отметкой, удалением и редактированием',
        'TodoFilterComponent с поиском, фильтрами и сортировкой',
        'TodoStatsComponent с computed статистикой',
        'Сохранение в localStorage через effect',
        'Функция редактирования: двойной клик на задачу открывает inline-редактирование'
      ],
      hint: 'TodoService хранит signal<Todo[]>. computed для фильтрации и статистики. effect для localStorage. Для inline-редактирования добавьте isEditing signal в TodoItemComponent.',
      expectedOutput: 'Полнофункциональное Todo приложение. Задачи добавляются, редактируются, отмечаются и удаляются. Фильтрация и сортировка работают. Данные сохраняются при перезагрузке.',
      solution: `// Полное решение — собираем всё вместе

// core/models/todo.model.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}
export type TodoFilter = 'all' | 'active' | 'completed';

// core/services/todo.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos = signal<Todo[]>(this.loadFromStorage());
  private filter = signal<TodoFilter>('all');
  private searchTerm = signal('');

  readonly currentFilter = this.filter.asReadonly();

  readonly filteredTodos = computed(() => {
    let items = this.todos();
    const term = this.searchTerm().toLowerCase();
    const f = this.filter();
    if (f === 'active') items = items.filter(t => !t.completed);
    if (f === 'completed') items = items.filter(t => t.completed);
    if (term) items = items.filter(t => t.title.toLowerCase().includes(term));
    return items;
  });

  readonly stats = computed(() => {
    const all = this.todos();
    const completed = all.filter(t => t.completed).length;
    return {
      total: all.length,
      active: all.length - completed,
      completed,
      rate: all.length ? Math.round((completed / all.length) * 100) : 0
    };
  });

  constructor() {
    effect(() => localStorage.setItem('todos', JSON.stringify(this.todos())));
  }

  add(title: string, priority: Todo['priority']): void {
    this.todos.update(t => [{
      id: crypto.randomUUID(), title: title.trim(),
      completed: false, priority, createdAt: new Date()
    }, ...t]);
  }

  toggle(id: string): void {
    this.todos.update(t => t.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  }

  update(id: string, title: string): void {
    this.todos.update(t => t.map(i => i.id === id ? { ...i, title } : i));
  }

  delete(id: string): void {
    this.todos.update(t => t.filter(i => i.id !== id));
  }

  clearCompleted(): void {
    this.todos.update(t => t.filter(i => !i.completed));
  }

  setFilter(f: TodoFilter): void { this.filter.set(f); }
  setSearch(term: string): void { this.searchTerm.set(term); }

  private loadFromStorage(): Todo[] {
    try {
      const data = localStorage.getItem('todos');
      if (!data) return [];
      return JSON.parse(data).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) }));
    } catch { return []; }
  }
}

// features/todo-item/todo-item.component.ts
import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="item" [class.completed]="todo.completed" [class.editing]="isEditing()">
      <input type="checkbox" [checked]="todo.completed" (change)="toggled.emit(todo.id)" />
      @if (isEditing()) {
        <input class="edit-input" [value]="todo.title"
               (keydown.enter)="saveEdit($event)"
               (keydown.escape)="isEditing.set(false)"
               (blur)="saveEdit($event)" />
      } @else {
        <span class="title" (dblclick)="isEditing.set(true)">{{ todo.title }}</span>
      }
      <span class="priority" [class]="todo.priority">{{ todo.priority }}</span>
      <button (click)="deleted.emit(todo.id)">✕</button>
    </div>
  \`
})
export class TodoItemComponent {
  @Input({ required: true }) todo!: Todo;
  @Output() toggled = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<{ id: string; title: string }>();

  isEditing = signal(false);

  saveEdit(event: Event): void {
    const input = event.target as HTMLInputElement;
    const title = input.value.trim();
    if (title) {
      this.updated.emit({ id: this.todo.id, title });
    }
    this.isEditing.set(false);
  }
}

// app.component.ts — собираем всё
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, TodoItemComponent],
  template: \`
    <div class="app">
      <h1>Todo App</h1>

      <form [formGroup]="form" (ngSubmit)="addTodo()">
        <input formControlName="title" placeholder="Новая задача..." />
        <select formControlName="priority">
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        <button type="submit" [disabled]="form.invalid">+</button>
      </form>

      <div class="stats">
        Всего: {{ stats().total }} | Активных: {{ stats().active }} | Выполнено: {{ stats().completed }} ({{ stats().rate }}%)
      </div>

      <div class="filters">
        <input (input)="onSearch($event)" placeholder="Поиск..." />
        <button [class.active]="todoService.currentFilter() === 'all'" (click)="todoService.setFilter('all')">Все</button>
        <button [class.active]="todoService.currentFilter() === 'active'" (click)="todoService.setFilter('active')">Активные</button>
        <button [class.active]="todoService.currentFilter() === 'completed'" (click)="todoService.setFilter('completed')">Выполненные</button>
        @if (stats().completed > 0) {
          <button (click)="todoService.clearCompleted()">Очистить выполненные</button>
        }
      </div>

      @for (todo of todoService.filteredTodos(); track todo.id) {
        <app-todo-item
          [todo]="todo"
          (toggled)="todoService.toggle($event)"
          (deleted)="todoService.delete($event)"
          (updated)="todoService.update($event.id, $event.title)"
        />
      } @empty {
        <p class="empty">Нет задач</p>
      }
    </div>
  \`
})
export class AppComponent {
  todoService = inject(TodoService);
  private fb = inject(FormBuilder);
  stats = this.todoService.stats;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    priority: ['medium']
  });

  addTodo(): void {
    if (this.form.valid) {
      this.todoService.add(this.form.value.title!, this.form.value.priority as any);
      this.form.reset({ title: '', priority: 'medium' });
    }
  }

  onSearch(e: Event): void {
    this.todoService.setSearch((e.target as HTMLInputElement).value);
  }
}`,
      explanation: 'Полноценное Todo приложение на Angular 17+ с Signals. TodoService — единый источник истины с signal для состояния, computed для производных данных, effect для localStorage. TodoItemComponent — презентационный с OnPush и inline-редактированием через signal isEditing. Reactive Forms для добавления с валидацией. Фильтрация и поиск через computed signal. Иммутабельные обновления через signal.update(). Нет RxJS, нет async pipe — всё на Signals.'
    }
  ]
}
