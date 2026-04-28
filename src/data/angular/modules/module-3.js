export default {
  id: 3,
  title: 'Компоненты',
  description: 'Создание компонентов, жизненный цикл, взаимодействие между компонентами через Input и Output',
  lessons: [
    {
      id: 1,
      title: 'Создание компонентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Компонент — это основной строительный блок Angular. Каждый компонент состоит из TypeScript класса с декоратором @Component, HTML-шаблона и CSS-стилей. Компоненты управляют частью экрана.' },
        { type: 'heading', value: 'Создание через CLI' },
        { type: 'code', language: 'bash', value: '# Генерация компонента\nng generate component user-card\n# или сокращённо\nng g c user-card\n\n# Создаёт файлы:\n# src/app/user-card/\n#   user-card.component.ts\n#   user-card.component.html\n#   user-card.component.css\n#   user-card.component.spec.ts' },
        { type: 'heading', value: 'Анатомия компонента' },
        { type: 'code', language: 'typescript', value: '// user-card.component.ts\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-user-card\',    // HTML-тег для использования\n  standalone: true,               // standalone компонент (Angular 14+)\n  templateUrl: \'./user-card.component.html\',\n  styleUrls: [\'./user-card.component.css\']\n})\nexport class UserCardComponent {\n  // Свойства компонента\n  name: string = \'Иван Иванов\';\n  email: string = \'ivan@example.com\';\n  isActive: boolean = true;\n\n  // Методы компонента\n  toggleActive(): void {\n    this.isActive = !this.isActive;\n  }\n}' },
        { type: 'heading', value: 'Шаблон компонента' },
        { type: 'code', language: 'html', value: '<!-- user-card.component.html -->\n<div class="card" [class.active]="isActive">\n  <h2>{{ name }}</h2>\n  <p>{{ email }}</p>\n  <span>Статус: {{ isActive ? \'Активен\' : \'Неактивен\' }}</span>\n  <button (click)="toggleActive()">Переключить</button>\n</div>' },
        { type: 'heading', value: 'Использование компонента' },
        { type: 'code', language: 'typescript', value: '// В родительском компоненте (например, app.component.ts)\nimport { Component } from \'@angular/core\';\nimport { UserCardComponent } from \'./user-card/user-card.component\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [UserCardComponent], // Импортируем компонент!\n  template: `\n    <h1>Пользователи</h1>\n    <app-user-card></app-user-card>\n    <app-user-card></app-user-card>\n  `\n})\nexport class AppComponent {}' },
        { type: 'tip', value: 'Для standalone компонентов нужно указать imports в декораторе @Component того компонента, который их использует. Это делает зависимости явными.' }
      ]
    },
    {
      id: 2,
      title: '@Input — передача данных в компонент',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор @Input() позволяет передавать данные из родительского компонента в дочерний. Это основной способ конфигурирования компонентов.' },
        { type: 'heading', value: 'Объявление Input' },
        { type: 'code', language: 'typescript', value: '// user-card.component.ts\nimport { Component, Input } from \'@angular/core\';\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  avatar: string;\n}\n\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,\n  template: `\n    <div class="card">\n      <img [src]="user.avatar" [alt]="user.name" />\n      <h3>{{ user.name }}</h3>\n      <p>{{ user.email }}</p>\n      @if (showEmail) {\n        <a [href]="\'mailto:\' + user.email">Написать</a>\n      }\n    </div>\n  `\n})\nexport class UserCardComponent {\n  @Input({ required: true }) user!: User;  // обязательный input\n  @Input() showEmail: boolean = true;       // с значением по умолчанию\n}' },
        { type: 'heading', value: 'Передача данных из родителя' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [UserCardComponent],\n  template: `\n    <h1>Команда</h1>\n    @for (user of users; track user.id) {\n      <app-user-card\n        [user]="user"\n        [showEmail]="false"\n      />\n    }\n  `\n})\nexport class AppComponent {\n  users: User[] = [\n    { id: 1, name: \'Иван\', email: \'ivan@mail.ru\', avatar: \'...\' },\n    { id: 2, name: \'Мария\', email: \'maria@mail.ru\', avatar: \'...\' }\n  ];\n}' },
        { type: 'note', value: 'С Angular 16+ можно использовать required: true в @Input(), чтобы сделать свойство обязательным. Если родитель не передаст значение, будет ошибка компиляции.' }
      ]
    },
    {
      id: 3,
      title: '@Output — события от дочернего компонента',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор @Output() позволяет дочернему компоненту отправлять события родителю. Для этого используется EventEmitter — специальный класс Angular.' },
        { type: 'heading', value: 'Создание Output' },
        { type: 'code', language: 'typescript', value: '// user-card.component.ts\nimport { Component, Input, Output, EventEmitter } from \'@angular/core\';\n\n@Component({\n  selector: \'app-user-card\',\n  standalone: true,\n  template: `\n    <div class="card">\n      <h3>{{ user.name }}</h3>\n      <button (click)="onSelect()">Выбрать</button>\n      <button (click)="onDelete()">Удалить</button>\n    </div>\n  `\n})\nexport class UserCardComponent {\n  @Input({ required: true }) user!: User;\n\n  // Объявляем события\n  @Output() selected = new EventEmitter<User>();\n  @Output() deleted = new EventEmitter<number>();\n\n  onSelect(): void {\n    this.selected.emit(this.user);  // Отправляем User\n  }\n\n  onDelete(): void {\n    this.deleted.emit(this.user.id);  // Отправляем id\n  }\n}' },
        { type: 'heading', value: 'Обработка событий в родителе' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [UserCardComponent],\n  template: `\n    <h1>Пользователи</h1>\n    @for (user of users; track user.id) {\n      <app-user-card\n        [user]="user"\n        (selected)="onUserSelected($event)"\n        (deleted)="onUserDeleted($event)"\n      />\n    }\n    @if (selectedUser) {\n      <p>Выбран: {{ selectedUser.name }}</p>\n    }\n  `\n})\nexport class AppComponent {\n  users: User[] = [...];\n  selectedUser: User | null = null;\n\n  onUserSelected(user: User): void {\n    this.selectedUser = user;\n  }\n\n  onUserDeleted(userId: number): void {\n    this.users = this.users.filter(u => u.id !== userId);\n  }\n}' },
        { type: 'tip', value: '$event в шаблоне содержит значение, переданное в emit(). EventEmitter<User> означает, что $event будет типа User.' }
      ]
    },
    {
      id: 4,
      title: 'Жизненный цикл компонента',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый компонент Angular проходит через определённые этапы: создание, обновление и уничтожение. Angular предоставляет хуки жизненного цикла — методы, которые вызываются на каждом этапе.' },
        { type: 'heading', value: 'Основные хуки жизненного цикла' },
        { type: 'code', language: 'typescript', value: 'import {\n  Component, OnInit, OnDestroy, OnChanges,\n  Input, SimpleChanges\n} from \'@angular/core\';\n\n@Component({\n  selector: \'app-user-profile\',\n  standalone: true,\n  template: `<p>{{ user.name }}</p>`\n})\nexport class UserProfileComponent implements OnInit, OnChanges, OnDestroy {\n  @Input() user!: User;\n\n  // 1. Вызывается при изменении @Input свойств\n  ngOnChanges(changes: SimpleChanges): void {\n    if (changes[\'user\']) {\n      console.log(\'Предыдущий:\', changes[\'user\'].previousValue);\n      console.log(\'Текущий:\', changes[\'user\'].currentValue);\n      console.log(\'Первое изменение:\', changes[\'user\'].firstChange);\n    }\n  }\n\n  // 2. Вызывается ОДИН раз после первого ngOnChanges\n  ngOnInit(): void {\n    console.log(\'Компонент инициализирован\');\n    // Здесь делаем HTTP-запросы, подписки и т.д.\n  }\n\n  // 3. Вызывается при уничтожении компонента\n  ngOnDestroy(): void {\n    console.log(\'Компонент уничтожен\');\n    // Здесь отписываемся от подписок, чистим таймеры\n  }\n}' },
        { type: 'heading', value: 'Все хуки жизненного цикла' },
        { type: 'list', value: [
          'ngOnChanges — при изменении @Input свойств (до и после ngOnInit)',
          'ngOnInit — один раз при инициализации (после первого ngOnChanges)',
          'ngDoCheck — при каждой проверке изменений (change detection)',
          'ngAfterContentInit — после проецирования контента (ng-content)',
          'ngAfterContentChecked — после каждой проверки проецированного контента',
          'ngAfterViewInit — после инициализации представления и дочерних компонентов',
          'ngAfterViewChecked — после каждой проверки представления',
          'ngOnDestroy — перед уничтожением компонента'
        ] },
        { type: 'warning', value: 'Самые важные хуки: ngOnInit (инициализация), ngOnChanges (реакция на изменения props), ngOnDestroy (очистка). Остальные нужны редко.' }
      ]
    },
    {
      id: 5,
      title: 'ViewChild и ContentChild',
      type: 'theory',
      content: [
        { type: 'text', value: '@ViewChild позволяет получить ссылку на дочерний компонент или DOM-элемент внутри шаблона. Это нужно для программного взаимодействия с элементами.' },
        { type: 'heading', value: '@ViewChild для DOM-элемента' },
        { type: 'code', language: 'typescript', value: 'import { Component, ViewChild, ElementRef, AfterViewInit } from \'@angular/core\';\n\n@Component({\n  selector: \'app-search\',\n  standalone: true,\n  template: `\n    <input #searchInput type="text" placeholder="Поиск...">\n    <button (click)="focusInput()">Фокус</button>\n  `\n})\nexport class SearchComponent implements AfterViewInit {\n  // Получаем ссылку на элемент с #searchInput\n  @ViewChild(\'searchInput\') inputRef!: ElementRef<HTMLInputElement>;\n\n  ngAfterViewInit(): void {\n    // DOM элемент доступен только после AfterViewInit!\n    console.log(this.inputRef.nativeElement.placeholder);\n  }\n\n  focusInput(): void {\n    this.inputRef.nativeElement.focus();\n  }\n}' },
        { type: 'heading', value: '@ViewChild для дочернего компонента' },
        { type: 'code', language: 'typescript', value: '// timer.component.ts\n@Component({\n  selector: \'app-timer\',\n  standalone: true,\n  template: `<p>Время: {{ seconds }} сек</p>`\n})\nexport class TimerComponent {\n  seconds = 0;\n  private intervalId: any;\n\n  start(): void {\n    this.intervalId = setInterval(() => this.seconds++, 1000);\n  }\n\n  stop(): void {\n    clearInterval(this.intervalId);\n  }\n\n  reset(): void {\n    this.stop();\n    this.seconds = 0;\n  }\n}\n\n// parent.component.ts\n@Component({\n  selector: \'app-parent\',\n  standalone: true,\n  imports: [TimerComponent],\n  template: `\n    <app-timer />\n    <button (click)="startTimer()">Старт</button>\n    <button (click)="stopTimer()">Стоп</button>\n  `\n})\nexport class ParentComponent {\n  @ViewChild(TimerComponent) timer!: TimerComponent;\n\n  startTimer(): void {\n    this.timer.start();\n  }\n\n  stopTimer(): void {\n    this.timer.stop();\n  }\n}' },
        { type: 'tip', value: 'Используйте @ViewChild для прямого доступа к дочерним компонентам. Но предпочитайте @Input/@Output для обычной передачи данных — это более предсказуемо и тестируемо.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Список задач с компонентами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте приложение из двух компонентов: TaskListComponent (родитель) и TaskItemComponent (дочерний). Реализуйте добавление, отметку выполнения и удаление задач.',
      requirements: [
        'Интерфейс Task с полями: id, title, completed',
        'TaskItemComponent принимает @Input() task и генерирует @Output() toggled и @Output() deleted',
        'TaskListComponent хранит массив задач и обрабатывает события от дочерних компонентов',
        'Кнопка добавления новой задачи через prompt()',
        'Реализовать ngOnInit для инициализации начального списка',
        'Использовать @for для отображения списка'
      ],
      hint: 'Создайте интерфейс Task, затем TaskItemComponent с @Input и двумя @Output (EventEmitter). TaskListComponent будет хранить массив и обрабатывать события toggle и delete.',
      expectedOutput: 'Отображается список задач. Каждую задачу можно отметить выполненной или удалить. Можно добавить новую задачу.',
      solution: `// task.model.ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// task-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-item',
  standalone: true,
  template: \`
    <div class="task" [class.completed]="task.completed">
      <input
        type="checkbox"
        [checked]="task.completed"
        (change)="onToggle()"
      />
      <span>{{ task.title }}</span>
      <button (click)="onDelete()">✕</button>
    </div>
  \`,
  styles: [\`
    .task { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #eee; }
    .completed span { text-decoration: line-through; color: #999; }
    button { background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; }
  \`]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() toggled = new EventEmitter<number>();
  @Output() deleted = new EventEmitter<number>();

  onToggle(): void {
    this.toggled.emit(this.task.id);
  }

  onDelete(): void {
    this.deleted.emit(this.task.id);
  }
}

// task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskItemComponent } from './task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  template: \`
    <h2>Список задач</h2>
    <button (click)="addTask()">+ Добавить задачу</button>
    @for (task of tasks; track task.id) {
      <app-task-item
        [task]="task"
        (toggled)="toggleTask($event)"
        (deleted)="deleteTask($event)"
      />
    }
    <p>Выполнено: {{ completedCount }} из {{ tasks.length }}</p>
  \`
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  private nextId = 1;

  get completedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  ngOnInit(): void {
    this.tasks = [
      { id: this.nextId++, title: 'Изучить Angular компоненты', completed: true },
      { id: this.nextId++, title: 'Разобрать Input и Output', completed: false },
      { id: this.nextId++, title: 'Написать практику', completed: false }
    ];
  }

  addTask(): void {
    const title = prompt('Введите название задачи:');
    if (title) {
      this.tasks.push({ id: this.nextId++, title, completed: false });
    }
  }

  toggleTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}`,
      explanation: 'TaskItemComponent — презентационный компонент: получает данные через @Input и отправляет события через @Output. TaskListComponent — контейнерный компонент: хранит состояние (массив задач) и обрабатывает события. Это паттерн Smart/Dumb (Контейнер/Презентация) — основа хорошей архитектуры Angular приложений.'
    }
  ]
}
