export default {
  id: 5,
  title: 'Директивы',
  description: 'Встроенные структурные и атрибутные директивы Angular: @if, @for, ngClass, ngStyle и создание пользовательских директив',
  lessons: [
    {
      id: 1,
      title: 'Условный рендеринг: @if и @else',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular предоставляет встроенный синтаксис для условного отображения элементов. В Angular 17+ используется новый синтаксис @if, который заменил устаревший *ngIf.' },
        { type: 'heading', value: 'Новый синтаксис @if (Angular 17+)' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-demo\',\n  standalone: true,\n  template: `\n    <!-- Простое условие -->\n    @if (isLoggedIn) {\n      <p>Добро пожаловать, {{ username }}!</p>\n    }\n\n    <!-- if-else -->\n    @if (isLoggedIn) {\n      <nav>Меню пользователя</nav>\n    } @else {\n      <button (click)="login()">Войти</button>\n    }\n\n    <!-- if-else if-else -->\n    @if (role === \'admin\') {\n      <p>Панель администратора</p>\n    } @else if (role === \'editor\') {\n      <p>Панель редактора</p>\n    } @else {\n      <p>Панель пользователя</p>\n    }\n\n    <!-- Сохранение значения в переменную -->\n    @if (user$ | async; as user) {\n      <p>{{ user.name }}</p>\n    } @else {\n      <p>Загрузка...</p>\n    }\n  `\n})\nexport class DemoComponent {\n  isLoggedIn = false;\n  username = \'Иван\';\n  role = \'admin\';\n\n  login(): void {\n    this.isLoggedIn = true;\n  }\n}' },
        { type: 'heading', value: 'Старый синтаксис *ngIf (до Angular 17)' },
        { type: 'code', language: 'html', value: '<!-- Старый синтаксис — всё ещё работает, но не рекомендуется -->\n<p *ngIf="isLoggedIn">Добро пожаловать!</p>\n\n<p *ngIf="isLoggedIn; else loginBlock">Добро пожаловать!</p>\n<ng-template #loginBlock>\n  <button>Войти</button>\n</ng-template>' },
        { type: 'tip', value: 'Новый синтаксис @if более читаемый и не требует ng-template. Мигрируйте с *ngIf на @if в новых проектах. CLI может сделать это автоматически: ng g @angular/core:control-flow' }
      ]
    },
    {
      id: 2,
      title: 'Циклы: @for и trackBy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директива @for (или *ngFor) используется для отображения списков. Track-выражение обязательно — оно помогает Angular эффективно обновлять DOM при изменении массива.' },
        { type: 'heading', value: 'Новый синтаксис @for (Angular 17+)' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-list\',\n  standalone: true,\n  template: `\n    <!-- Простой список -->\n    <ul>\n      @for (item of items; track item.id) {\n        <li>{{ item.name }} — {{ item.price }} руб.</li>\n      }\n    </ul>\n\n    <!-- С переменными цикла -->\n    @for (user of users; track user.id; let i = $index; let first = $first; let last = $last) {\n      <div [class.first]="first" [class.last]="last">\n        {{ i + 1 }}. {{ user.name }}\n      </div>\n    }\n\n    <!-- Пустой список -->\n    @for (item of filteredItems; track item.id) {\n      <div>{{ item.name }}</div>\n    } @empty {\n      <p>Ничего не найдено</p>\n    }\n  `\n})\nexport class ListComponent {\n  items = [\n    { id: 1, name: \'Angular\', price: 0 },\n    { id: 2, name: \'TypeScript\', price: 0 },\n    { id: 3, name: \'RxJS\', price: 0 }\n  ];\n  users = [\n    { id: 1, name: \'Иван\' },\n    { id: 2, name: \'Мария\' }\n  ];\n  filteredItems: any[] = [];\n}' },
        { type: 'heading', value: 'Переменные цикла @for' },
        { type: 'list', value: [
          '$index — текущий индекс (начинается с 0)',
          '$first — true для первого элемента',
          '$last — true для последнего элемента',
          '$even — true для чётных индексов',
          '$odd — true для нечётных индексов',
          '$count — общее количество элементов'
        ] },
        { type: 'warning', value: 'track обязателен в @for! Он указывает Angular, как идентифицировать элементы при обновлении массива. Используйте уникальный идентификатор (id) или сам элемент (track item).' }
      ]
    },
    {
      id: 3,
      title: 'Switch: @switch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директива @switch позволяет условно отображать контент на основе значения выражения. Это аналог JavaScript switch-case для шаблонов.' },
        { type: 'heading', value: 'Использование @switch' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-status\',\n  standalone: true,\n  template: `\n    <h3>Статус заказа</h3>\n\n    @switch (orderStatus) {\n      @case (\'pending\') {\n        <div class="badge yellow">⏳ Ожидает обработки</div>\n      }\n      @case (\'processing\') {\n        <div class="badge blue">🔄 Обрабатывается</div>\n      }\n      @case (\'shipped\') {\n        <div class="badge purple">🚚 В пути</div>\n      }\n      @case (\'delivered\') {\n        <div class="badge green">✅ Доставлен</div>\n      }\n      @default {\n        <div class="badge gray">❓ Неизвестный статус</div>\n      }\n    }\n\n    <button (click)="nextStatus()">Следующий статус</button>\n  `,\n  styles: [`\n    .badge { padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 8px 0; }\n    .yellow { background: #fff3cd; color: #856404; }\n    .blue { background: #cce5ff; color: #004085; }\n    .purple { background: #e2d9f3; color: #6f42c1; }\n    .green { background: #d4edda; color: #155724; }\n    .gray { background: #e2e3e5; color: #383d41; }\n  `]\n})\nexport class StatusComponent {\n  statuses = [\'pending\', \'processing\', \'shipped\', \'delivered\'] as const;\n  currentIndex = 0;\n\n  get orderStatus(): string {\n    return this.statuses[this.currentIndex];\n  }\n\n  nextStatus(): void {\n    this.currentIndex = (this.currentIndex + 1) % this.statuses.length;\n  }\n}' },
        { type: 'note', value: '@switch лучше, чем цепочка @if/@else if, когда нужно сравнить одну переменную с несколькими значениями. Код более читаемый и производительный.' }
      ]
    },
    {
      id: 4,
      title: 'ngClass и ngStyle',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директивы ngClass и ngStyle позволяют динамически управлять CSS-классами и инлайн-стилями элементов.' },
        { type: 'heading', value: 'ngClass — динамические классы' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-styles\',\n  standalone: true,\n  imports: [NgClass, NgStyle],\n  template: `\n    <!-- Объект: ключ=класс, значение=условие -->\n    <div [ngClass]="{\n      \'active\': isActive,\n      \'disabled\': isDisabled,\n      \'highlighted\': isHighlighted\n    }">Динамические классы</div>\n\n    <!-- Массив классов -->\n    <div [ngClass]="[\'card\', theme, size]">Карточка</div>\n\n    <!-- Строка -->\n    <div [ngClass]="currentClasses">Текст</div>\n\n    <!-- Альтернатива: привязка к class -->\n    <div [class.active]="isActive"\n         [class.error]="hasError">Привязка к class</div>\n  `\n})\nexport class StylesComponent {\n  isActive = true;\n  isDisabled = false;\n  isHighlighted = true;\n  hasError = false;\n  theme = \'dark\';\n  size = \'large\';\n  currentClasses = \'card primary rounded\';\n}' },
        { type: 'heading', value: 'ngStyle — динамические стили' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-dynamic-styles\',\n  standalone: true,\n  imports: [NgStyle],\n  template: `\n    <!-- Объект стилей -->\n    <div [ngStyle]="{\n      \'color\': textColor,\n      \'font-size\': fontSize + \'px\',\n      \'background-color\': bgColor,\n      \'padding\': \'10px\'\n    }">Стилизованный текст</div>\n\n    <!-- Альтернатива: привязка к style -->\n    <div [style.color]="textColor"\n         [style.fontSize.px]="fontSize"\n         [style.backgroundColor]="bgColor">\n      Привязка к style\n    </div>\n\n    <!-- Интерактивный пример -->\n    <input type="range" min="12" max="48"\n           [value]="fontSize"\n           (input)="fontSize = +$any($event.target).value" />\n    <input type="color" [value]="textColor"\n           (input)="textColor = $any($event.target).value" />\n  `\n})\nexport class DynamicStylesComponent {\n  textColor = \'#dd0031\';\n  fontSize = 16;\n  bgColor = \'#f5f5f5\';\n}' },
        { type: 'tip', value: 'Для одного-двух классов/стилей удобнее использовать [class.name] и [style.prop]. ngClass и ngStyle удобнее, когда нужно управлять множеством классов или стилей.' }
      ]
    },
    {
      id: 5,
      title: 'Создание пользовательской директивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме встроенных директив, Angular позволяет создавать собственные. Атрибутные директивы изменяют внешний вид или поведение элемента, к которому применены.' },
        { type: 'heading', value: 'Создание директивы через CLI' },
        { type: 'code', language: 'bash', value: 'ng generate directive highlight\n# или\nng g d highlight' },
        { type: 'heading', value: 'Пример: директива подсветки' },
        { type: 'code', language: 'typescript', value: '// highlight.directive.ts\nimport { Directive, ElementRef, HostListener, Input } from \'@angular/core\';\n\n@Directive({\n  selector: \'[appHighlight]\',  // атрибут-селектор\n  standalone: true\n})\nexport class HighlightDirective {\n  @Input() appHighlight: string = \'yellow\';  // цвет подсветки\n  @Input() defaultColor: string = \'transparent\';\n\n  constructor(private el: ElementRef) {}\n\n  // Слушаем события мыши на элементе\n  @HostListener(\'mouseenter\') onMouseEnter(): void {\n    this.highlight(this.appHighlight || \'yellow\');\n  }\n\n  @HostListener(\'mouseleave\') onMouseLeave(): void {\n    this.highlight(this.defaultColor);\n  }\n\n  private highlight(color: string): void {\n    this.el.nativeElement.style.backgroundColor = color;\n    this.el.nativeElement.style.transition = \'background-color 0.3s\';\n  }\n}\n\n// Использование:\n// <p appHighlight>Подсветка жёлтым по умолчанию</p>\n// <p [appHighlight]="\'#ff6b6b\'">Подсветка красным</p>\n// <p [appHighlight]="\'lightblue\'" defaultColor="lavender">С цветом по умолчанию</p>' },
        { type: 'heading', value: 'Пример: структурная директива' },
        { type: 'code', language: 'typescript', value: '// unless.directive.ts — противоположность *ngIf\nimport { Directive, Input, TemplateRef, ViewContainerRef } from \'@angular/core\';\n\n@Directive({\n  selector: \'[appUnless]\',\n  standalone: true\n})\nexport class UnlessDirective {\n  private hasView = false;\n\n  constructor(\n    private templateRef: TemplateRef<any>,\n    private viewContainer: ViewContainerRef\n  ) {}\n\n  @Input() set appUnless(condition: boolean) {\n    if (!condition && !this.hasView) {\n      // Показываем элемент, если условие false\n      this.viewContainer.createEmbeddedView(this.templateRef);\n      this.hasView = true;\n    } else if (condition && this.hasView) {\n      // Убираем элемент, если условие true\n      this.viewContainer.clear();\n      this.hasView = false;\n    }\n  }\n}\n\n// Использование:\n// <p *appUnless="isHidden">Этот текст виден, когда isHidden = false</p>' },
        { type: 'note', value: 'Атрибутные директивы изменяют элемент. Структурные директивы (с *) добавляют/удаляют элементы из DOM. Большинство кастомных директив — атрибутные.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Таблица с фильтрацией и сортировкой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте компонент таблицы сотрудников с фильтрацией по имени, условной подсветкой строк и динамическими стилями.',
      requirements: [
        'Массив сотрудников с полями: id, name, department, salary, isActive',
        'Отображение таблицы через @for с track по id',
        'Фильтрация по имени через input с двусторонней привязкой',
        'Условная подсветка: активные сотрудники — зелёный фон, неактивные — серый',
        '@if/@else для отображения сообщения когда список пуст (@empty)',
        'Использование ngClass для стилизации строк'
      ],
      hint: 'Создайте геттер filteredEmployees, который фильтрует массив по searchTerm. Используйте [ngClass] для условных классов строк.',
      expectedOutput: 'Таблица сотрудников с фильтром. Активные строки зелёные, неактивные серые. При пустом результате показывается сообщение.',
      solution: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  isActive: boolean;
}

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: \`
    <h2>Сотрудники ({{ filteredEmployees.length }})</h2>
    <input [(ngModel)]="searchTerm" placeholder="Поиск по имени..." />

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Имя</th>
          <th>Отдел</th>
          <th>Зарплата</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        @for (emp of filteredEmployees; track emp.id; let i = $index) {
          <tr [ngClass]="{ 'active-row': emp.isActive, 'inactive-row': !emp.isActive }">
            <td>{{ i + 1 }}</td>
            <td>{{ emp.name }}</td>
            <td>{{ emp.department }}</td>
            <td>{{ emp.salary }} руб.</td>
            <td>
              @if (emp.isActive) {
                <span class="badge green">Активен</span>
              } @else {
                <span class="badge gray">Неактивен</span>
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5">Сотрудники не найдены</td>
          </tr>
        }
      </tbody>
    </table>
  \`,
  styles: [\`
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; }
    input { padding: 8px; width: 300px; border: 1px solid #ccc; border-radius: 4px; }
    .active-row { background: #e8f5e9; }
    .inactive-row { background: #f5f5f5; color: #999; }
    .badge { padding: 2px 8px; border-radius: 12px; font-size: 0.85rem; }
    .green { background: #4caf50; color: white; }
    .gray { background: #9e9e9e; color: white; }
  \`]
})
export class EmployeeTableComponent {
  searchTerm = '';

  employees: Employee[] = [
    { id: 1, name: 'Иван Петров', department: 'Разработка', salary: 150000, isActive: true },
    { id: 2, name: 'Мария Сидорова', department: 'Дизайн', salary: 120000, isActive: true },
    { id: 3, name: 'Алексей Козлов', department: 'Разработка', salary: 140000, isActive: false },
    { id: 4, name: 'Елена Новикова', department: 'Маркетинг', salary: 110000, isActive: true },
    { id: 5, name: 'Дмитрий Волков', department: 'Разработка', salary: 160000, isActive: false }
  ];

  get filteredEmployees(): Employee[] {
    if (!this.searchTerm) return this.employees;
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(e => e.name.toLowerCase().includes(term));
  }
}`,
      explanation: 'Геттер filteredEmployees пересчитывается автоматически при изменении searchTerm. @for с track по id обеспечивает эффективное обновление DOM. [ngClass] принимает объект, где ключ — имя класса, значение — условие. @empty блок отображается, когда массив пуст.'
    }
  ]
}
