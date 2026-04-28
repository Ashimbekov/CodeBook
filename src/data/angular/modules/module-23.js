export default {
  id: 23,
  title: 'Оптимизация производительности',
  description: 'OnPush стратегия, trackBy, lazy loading, виртуальный скроллинг и профилирование Angular приложений',
  lessons: [
    {
      id: 1,
      title: 'Change Detection и OnPush',
      type: 'theory',
      content: [
        { type: 'text', value: 'Change Detection — механизм Angular для обновления DOM при изменении данных. По умолчанию Angular проверяет ВСЕ компоненты при каждом событии. OnPush стратегия ограничивает проверки, повышая производительность.' },
        { type: 'heading', value: 'Стратегия OnPush' },
        { type: 'code', language: 'typescript', value: 'import { Component, ChangeDetectionStrategy, Input } from \'@angular/core\';\n\n// По умолчанию — проверяет при каждом событии в приложении\n@Component({\n  changeDetection: ChangeDetectionStrategy.Default  // по умолчанию\n})\n\n// OnPush — проверяет ТОЛЬКО когда:\n// 1. Изменился @Input (по ссылке!)\n// 2. Произошло событие в ЭТОМ компоненте или его детях\n// 3. Сработал async pipe\n// 4. Вручную вызван markForCheck() или detectChanges()\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `\n    <div class="card">\n      <h3>{{ user.name }}</h3>\n      <p>{{ user.email }}</p>\n    </div>\n  `\n})\nexport class UserCardComponent {\n  @Input({ required: true }) user!: User;\n}' },
        { type: 'heading', value: 'Важно: иммутабельность с OnPush' },
        { type: 'code', language: 'typescript', value: '// ❌ Мутация — OnPush НЕ обнаружит изменение!\nthis.user.name = \'Новое имя\';  // Ссылка та же — OnPush не обновит\n\n// ✅ Иммутабельное обновление — OnPush обнаружит!\nthis.user = { ...this.user, name: \'Новое имя\' };  // Новая ссылка\n\n// ❌ Мутация массива\nthis.users.push(newUser);  // Ссылка та же\n\n// ✅ Новый массив\nthis.users = [...this.users, newUser];  // Новая ссылка' },
        { type: 'tip', value: 'Используйте OnPush для ВСЕХ компонентов в новых проектах. Это заставляет писать иммутабельный код и значительно улучшает производительность.' }
      ]
    },
    {
      id: 2,
      title: 'trackBy для списков',
      type: 'theory',
      content: [
        { type: 'text', value: 'При обновлении массива Angular по умолчанию пересоздаёт ВСЕ DOM-элементы. trackBy указывает, как идентифицировать элементы, позволяя Angular обновлять только изменённые.' },
        { type: 'heading', value: 'track в @for (Angular 17+)' },
        { type: 'code', language: 'typescript', value: '// Новый синтаксис — track обязателен!\n@Component({\n  template: `\n    <!-- track по уникальному id —лучший вариант -->\n    @for (user of users; track user.id) {\n      <app-user-card [user]="user" />\n    }\n\n    <!-- track по индексу — если нет уникального id -->\n    @for (item of items; track $index) {\n      <p>{{ item }}</p>\n    }\n\n    <!-- track по самому элементу — для примитивов -->\n    @for (name of names; track name) {\n      <p>{{ name }}</p>\n    }\n  `\n})\nexport class UserListComponent {\n  users: User[] = [];\n\n  // При обновлении массива:\n  loadUsers(): void {\n    this.userService.getAll().subscribe(users => {\n      this.users = users;\n      // Angular сравнивает по user.id:\n      // - Существующие элементы НЕ пересоздаются\n      // - Новые элементы добавляются\n      // - Удалённые элементы убираются\n    });\n  }\n}' },
        { type: 'heading', value: 'Старый синтаксис — trackBy с *ngFor' },
        { type: 'code', language: 'html', value: '<!-- *ngFor с trackBy функцией -->\n<div *ngFor="let user of users; trackBy: trackByUserId">\n  {{ user.name }}\n</div>' },
        { type: 'code', language: 'typescript', value: '// trackBy — функция для *ngFor\ntrackByUserId(index: number, user: User): number {\n  return user.id;\n}' },
        { type: 'warning', value: 'Без trackBy/track при каждом обновлении массива Angular уничтожает и заново создаёт ВСЕ DOM-элементы списка. Для 1000 элементов это катастрофа для производительности.' }
      ]
    },
    {
      id: 3,
      title: 'Lazy Loading и бюджеты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lazy loading разделяет приложение на чанки, загружаемые по требованию. Бюджеты (budgets) предупреждают, когда бандл становится слишком большим.' },
        { type: 'heading', value: 'Полный lazy loading' },
        { type: 'code', language: 'typescript', value: '// Максимальный lazy loading — каждая страница отдельный чанк\nexport const routes: Routes = [\n  {\n    path: \'\',\n    loadComponent: () => import(\'./home.component\').then(c => c.HomeComponent)\n  },\n  {\n    path: \'admin\',\n    loadChildren: () => import(\'./admin/admin.routes\').then(r => r.adminRoutes),\n    canActivate: [authGuard]\n  },\n  {\n    path: \'shop\',\n    loadChildren: () => import(\'./shop/shop.routes\').then(r => r.shopRoutes)\n  }\n];' },
        { type: 'heading', value: 'Бюджеты в angular.json' },
        { type: 'code', language: 'typescript', value: '// angular.json — budgets\n{\n  "budgets": [\n    {\n      "type": "initial",       // Начальный бандл\n      "maximumWarning": "500kb",\n      "maximumError": "1mb"\n    },\n    {\n      "type": "anyComponentStyle",  // CSS компонентов\n      "maximumWarning": "4kb",\n      "maximumError": "8kb"\n    }\n  ]\n}' },
        { type: 'heading', value: 'Анализ бандла' },
        { type: 'code', language: 'bash', value: '# Сборка с анализом\nng build --stats-json\n\n# Визуализация размера бандла\nnpx webpack-bundle-analyzer dist/my-app/stats.json\n\n# Или через source-map-explorer\nnpm install -g source-map-explorer\nng build --source-map\nsource-map-explorer dist/my-app/browser/main*.js' },
        { type: 'tip', value: 'Целевой размер начального бандла — менее 200KB (gzip). Если больше — проверьте импорты: возможно, импортируется целая библиотека вместо отдельных модулей.' }
      ]
    },
    {
      id: 4,
      title: 'Виртуальный скроллинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Виртуальный скроллинг отрисовывает только видимые элементы списка. Для 10000 элементов рендерится только 20-30 видимых. Это критично для длинных списков.' },
        { type: 'heading', value: 'CDK Virtual Scrolling' },
        { type: 'code', language: 'typescript', value: 'import { Component } from \'@angular/core\';\nimport { ScrollingModule } from \'@angular/cdk/scrolling\';\n\n@Component({\n  selector: \'app-virtual-list\',\n  standalone: true,\n  imports: [ScrollingModule],\n  template: `\n    <!-- itemSize — высота одного элемента в пикселях -->\n    <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px;">\n      <div *cdkVirtualFor="let item of items; trackBy: trackById"\n           class="item">\n        {{ item.name }} — {{ item.value }}\n      </div>\n    </cdk-virtual-scroll-viewport>\n  `,\n  styles: [`\n    .item { height: 50px; display: flex; align-items: center; padding: 0 16px; border-bottom: 1px solid #eee; }\n  `]\n})\nexport class VirtualListComponent {\n  items = Array.from({ length: 10000 }, (_, i) => ({\n    id: i,\n    name: `Элемент ${i + 1}`,\n    value: Math.floor(Math.random() * 100)\n  }));\n\n  trackById(index: number, item: any): number {\n    return item.id;\n  }\n}' },
        { type: 'note', value: 'Виртуальный скроллинг из @angular/cdk — не Angular Material, а CDK (Component Dev Kit). CDK — низкоуровневые утилиты, Material — готовые стилизованные компоненты.' }
      ]
    },
    {
      id: 5,
      title: 'Другие оптимизации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо OnPush и lazy loading, есть множество приёмов для улучшения производительности Angular приложений.' },
        { type: 'heading', value: 'Избегайте вызовов методов в шаблоне' },
        { type: 'code', language: 'typescript', value: '// ❌ Плохо — метод вызывается при КАЖДОМ change detection\n// template: `<p>{{ getFullName() }}</p>`\n\n// ✅ Хорошо — свойство (или computed signal)\n// template: `<p>{{ fullName }}</p>`\nget fullName(): string {\n  return `${this.firstName} ${this.lastName}`;\n}\n\n// ✅ Ещё лучше — pipe\n// template: `<p>{{ user | fullName }}</p>`\n\n// ✅ С Signals\nfullName = computed(() => `${this.firstName()} ${this.lastName()}`);' },
        { type: 'heading', value: 'Preloading стратегии' },
        { type: 'code', language: 'typescript', value: 'import { PreloadAllModules } from \'@angular/router\';\n\n// Предзагрузить все lazy модули в фоне\nprovideRouter(routes, withPreloading(PreloadAllModules))\n\n// Или кастомная стратегия\n@Injectable({ providedIn: \'root\' })\nexport class SelectivePreloadingStrategy implements PreloadAllModules {\n  preload(route: Route, load: () => Observable<any>): Observable<any> {\n    // Предзагружать только маршруты с data.preload === true\n    return route.data?.[\'preload\'] ? load() : of(null);\n  }\n}' },
        { type: 'heading', value: 'Оптимизация изображений' },
        { type: 'code', language: 'html', value: '<!-- NgOptimizedImage — автоматическая оптимизация -->\n<img ngSrc="hero.jpg" width="800" height="400" priority />\n\n<!-- lazy loading для изображений ниже fold -->\n<img ngSrc="product.jpg" width="300" height="200" loading="lazy" />' },
        { type: 'heading', value: 'Профилирование' },
        { type: 'code', language: 'bash', value: '# Angular DevTools (расширение Chrome)\n# Показывает дерево компонентов, change detection, профайлер\n\n# Performance tab в Chrome DevTools\n# Записывает flame chart — видно, что тормозит\n\n# ng.profiler.timeChangeDetection()\n# Выполните в консоли браузера — покажет время CD' },
        { type: 'tip', value: 'Установите Angular DevTools расширение для Chrome. Оно показывает дерево компонентов, состояние, и позволяет профилировать change detection.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация списка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируйте компонент списка: OnPush стратегия, track для @for, виртуальный скроллинг и computed вместо методов в шаблоне.',
      requirements: [
        'Компонент списка с OnPush change detection',
        'track по id для @for',
        'Виртуальный скроллинг через cdk-virtual-scroll-viewport',
        'computed signal вместо метода для фильтрации',
        'Дочерний компонент элемента тоже с OnPush',
        'Иммутабельное обновление массива'
      ],
      hint: 'changeDetection: ChangeDetectionStrategy.OnPush на обоих компонентах. cdk-virtual-scroll-viewport с itemSize. signal + computed для данных.',
      expectedOutput: 'Список из 10000 элементов рендерится мгновенно. Обновления через OnPush эффективны. Виртуальный скроллинг рендерит только видимые элементы.',
      solution: `import { Component, ChangeDetectionStrategy, Input, signal, computed } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

interface ListItem {
  id: number;
  name: string;
  category: string;
  value: number;
}

// Дочерний компонент с OnPush
@Component({
  selector: 'app-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="item">
      <span class="name">{{ item.name }}</span>
      <span class="category">{{ item.category }}</span>
      <span class="value">{{ item.value }}</span>
    </div>
  \`,
  styles: [\`
    .item { display: flex; gap: 1rem; padding: 12px 16px; border-bottom: 1px solid #eee; height: 48px; align-items: center; }
    .name { flex: 1; }
    .category { color: #666; width: 120px; }
    .value { font-weight: bold; width: 60px; text-align: right; }
  \`]
})
export class ListItemComponent {
  @Input({ required: true }) item!: ListItem;
}

// Родительский компонент
@Component({
  selector: 'app-optimized-list',
  standalone: true,
  imports: [ScrollingModule, ListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <h2>Оптимизированный список ({{ filteredCount() }} из {{ totalCount() }})</h2>

    <input (input)="onSearch($event)" placeholder="Поиск..." />
    <select (change)="onCategoryChange($event)">
      <option value="all">Все категории</option>
      <option value="A">Категория A</option>
      <option value="B">Категория B</option>
      <option value="C">Категория C</option>
    </select>

    <cdk-virtual-scroll-viewport itemSize="48" style="height: 500px;">
      <app-list-item
        *cdkVirtualFor="let item of filteredItems(); trackBy: trackById"
        [item]="item"
      />
    </cdk-virtual-scroll-viewport>
  \`
})
export class OptimizedListComponent {
  private allItems = signal<ListItem[]>(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: \`Элемент \${i + 1}\`,
      category: ['A', 'B', 'C'][i % 3],
      value: Math.floor(Math.random() * 1000)
    }))
  );

  searchTerm = signal('');
  selectedCategory = signal('all');

  filteredItems = computed(() => {
    let items = this.allItems();
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    if (term) {
      items = items.filter(i => i.name.toLowerCase().includes(term));
    }
    if (category !== 'all') {
      items = items.filter(i => i.category === category);
    }
    return items;
  });

  filteredCount = computed(() => this.filteredItems().length);
  totalCount = computed(() => this.allItems().length);

  trackById(index: number, item: ListItem): number {
    return item.id;
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
  }
}`,
      explanation: 'OnPush на обоих компонентах минимизирует проверки. Signals + computed заменяют методы в шаблоне — вычисления кэшируются. cdk-virtual-scroll-viewport рендерит только видимые элементы из 10000. trackBy предотвращает пересоздание DOM при обновлении массива. Иммутабельные данные гарантируют корректную работу OnPush.'
    }
  ]
}
