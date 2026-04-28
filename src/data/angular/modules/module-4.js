export default {
  id: 4,
  title: 'Шаблоны и привязка данных',
  description: 'Интерполяция, привязка свойств, событий и двусторонняя привязка данных в Angular шаблонах',
  lessons: [
    {
      id: 1,
      title: 'Интерполяция и выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерполяция — это способ вставки значений TypeScript-выражений в HTML-шаблон. Angular вычисляет выражение и преобразует результат в строку.' },
        { type: 'heading', value: 'Синтаксис интерполяции {{ }}' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-demo\',\n  standalone: true,\n  template: `\n    <!-- Свойства компонента -->\n    <h1>{{ title }}</h1>\n    <p>Автор: {{ author }}</p>\n\n    <!-- Выражения -->\n    <p>Сумма: {{ 2 + 2 }}</p>\n    <p>Имя: {{ firstName + \' \' + lastName }}</p>\n    <p>Верхний регистр: {{ name.toUpperCase() }}</p>\n\n    <!-- Вызов методов -->\n    <p>Итого: {{ getTotal() }} руб.</p>\n\n    <!-- Тернарный оператор -->\n    <p>Статус: {{ isActive ? \'Активен\' : \'Неактивен\' }}</p>\n\n    <!-- Опциональная цепочка -->\n    <p>Город: {{ user?.address?.city }}</p>\n  `\n})\nexport class DemoComponent {\n  title = \'Привязка данных\';\n  author = \'Angular\';\n  firstName = \'Иван\';\n  lastName = \'Петров\';\n  name = \'angular\';\n  isActive = true;\n  user = { address: { city: \'Москва\' } };\n\n  getTotal(): number {\n    return 100 * 1.2;\n  }\n}' },
        { type: 'warning', value: 'Внутри {{ }} нельзя использовать: присваивание (=), new, typeof, инкремент (++), побитовые операторы. Только чистые выражения, которые возвращают значение.' },
        { type: 'tip', value: 'Избегайте вызова методов в шаблоне — они выполняются при каждой проверке изменений. Используйте свойства или пайпы.' }
      ]
    },
    {
      id: 2,
      title: 'Привязка свойств (Property Binding)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Property binding позволяет привязать значение TypeScript-выражения к свойству HTML-элемента или Angular-компонента. Используется синтаксис [property]="expression".' },
        { type: 'heading', value: 'Привязка к HTML-атрибутам' },
        { type: 'code', language: 'html', value: '<!-- Привязка к src -->\n<img [src]="imageUrl" [alt]="imageAlt" />\n\n<!-- Привязка к disabled -->\n<button [disabled]="isLoading">Отправить</button>\n\n<!-- Привязка к href -->\n<a [href]="profileUrl">Профиль</a>\n\n<!-- Привязка к hidden -->\n<div [hidden]="!showDetails">Подробности...</div>\n\n<!-- Привязка к style -->\n<div [style.color]="textColor"\n     [style.fontSize.px]="fontSize">\n  Стилизованный текст\n</div>\n\n<!-- Привязка к class -->\n<div [class.active]="isActive"\n     [class.highlighted]="isHighlighted">\n  Элемент с классами\n</div>' },
        { type: 'heading', value: 'Property binding vs интерполяция' },
        { type: 'code', language: 'html', value: '<!-- Эти два варианта эквивалентны для строк: -->\n<p>{{ title }}</p>\n<p [textContent]="title"></p>\n\n<!-- Но для НЕстроковых значений НУЖЕН property binding: -->\n<button [disabled]="isDisabled">OK</button>\n\n<!-- ЭТО НЕ СРАБОТАЕТ правильно: -->\n<!-- <button disabled="{{ isDisabled }}">OK</button> -->\n<!-- disabled="false" — это СТРОКА "false", а не boolean false -->\n<!-- Элемент всё равно будет заблокирован! -->' },
        { type: 'note', value: 'Правило: для строковых значений можно интерполяцию или property binding. Для boolean, number и объектов — только property binding [prop]="value".' }
      ]
    },
    {
      id: 3,
      title: 'Привязка событий (Event Binding)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event binding позволяет реагировать на события DOM и компонентов. Синтаксис: (event)="handler($event)". Angular автоматически вызывает указанный метод при возникновении события.' },
        { type: 'heading', value: 'Обработка DOM-событий' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-events\',\n  standalone: true,\n  template: `\n    <!-- Клик -->\n    <button (click)="onClick()">Нажми</button>\n\n    <!-- Клик с данными события -->\n    <button (click)="onClickWithEvent($event)">Нажми</button>\n\n    <!-- Ввод текста -->\n    <input (input)="onInput($event)" />\n    <p>Вы ввели: {{ inputValue }}</p>\n\n    <!-- Клавиатура -->\n    <input (keyup.enter)="onEnter($event)" placeholder="Нажмите Enter" />\n\n    <!-- Наведение мыши -->\n    <div (mouseenter)="onHover(true)"\n         (mouseleave)="onHover(false)"\n         [class.hovered]="isHovered">\n      Наведите мышь\n    </div>\n\n    <!-- Отправка формы -->\n    <form (submit)="onSubmit($event)">\n      <button type="submit">Отправить</button>\n    </form>\n  `\n})\nexport class EventsComponent {\n  inputValue = \'\';\n  isHovered = false;\n\n  onClick(): void {\n    console.log(\'Клик!\');\n  }\n\n  onClickWithEvent(event: MouseEvent): void {\n    console.log(\'Координаты:\', event.clientX, event.clientY);\n  }\n\n  onInput(event: Event): void {\n    const target = event.target as HTMLInputElement;\n    this.inputValue = target.value;\n  }\n\n  onEnter(event: KeyboardEvent): void {\n    const target = event.target as HTMLInputElement;\n    console.log(\'Enter:\', target.value);\n  }\n\n  onHover(state: boolean): void {\n    this.isHovered = state;\n  }\n\n  onSubmit(event: Event): void {\n    event.preventDefault();\n    console.log(\'Форма отправлена\');\n  }\n}' },
        { type: 'tip', value: 'Angular поддерживает фильтры клавиш: (keyup.enter), (keydown.escape), (keydown.control.s). Это удобнее, чем проверять event.key вручную.' }
      ]
    },
    {
      id: 4,
      title: 'Двусторонняя привязка (Two-way Binding)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Двусторонняя привязка [(ngModel)] объединяет property binding и event binding. Когда пользователь изменяет значение в input, оно автоматически обновляется в компоненте, и наоборот.' },
        { type: 'heading', value: 'ngModel' },
        { type: 'code', language: 'typescript', value: '// Для использования ngModel нужен FormsModule\nimport { Component } from \'@angular/core\';\nimport { FormsModule } from \'@angular/forms\';\n\n@Component({\n  selector: \'app-form\',\n  standalone: true,\n  imports: [FormsModule],  // Обязательно импортировать!\n  template: `\n    <h2>Профиль</h2>\n\n    <!-- Двусторонняя привязка -->\n    <input [(ngModel)]="name" placeholder="Имя" />\n    <input [(ngModel)]="email" placeholder="Email" />\n\n    <!-- Значения обновляются мгновенно -->\n    <p>Имя: {{ name }}</p>\n    <p>Email: {{ email }}</p>\n\n    <!-- Это то же самое, но в развёрнутой форме: -->\n    <!-- <input [ngModel]="name" (ngModelChange)="name = $event" /> -->\n  `\n})\nexport class FormComponent {\n  name = \'Иван\';\n  email = \'ivan@mail.ru\';\n}' },
        { type: 'heading', value: 'Как работает [(ngModel)]' },
        { type: 'code', language: 'typescript', value: '// [(ngModel)]="name" — это сокращение для:\n// [ngModel]="name"           — property binding (компонент -> шаблон)\n// (ngModelChange)="name = $event"  — event binding (шаблон -> компонент)\n\n// Этот паттерн \"банан в коробке\" [()] работает для любого\n// Input/Output пара с именами xxx и xxxChange:\n\n// Кастомный two-way binding\n@Component({\n  selector: \'app-counter\',\n  standalone: true,\n  template: `\n    <button (click)="decrement()">-</button>\n    <span>{{ count }}</span>\n    <button (click)="increment()">+</button>\n  `\n})\nexport class CounterComponent {\n  @Input() count: number = 0;\n  @Output() countChange = new EventEmitter<number>();\n\n  increment(): void {\n    this.count++;\n    this.countChange.emit(this.count);\n  }\n\n  decrement(): void {\n    this.count--;\n    this.countChange.emit(this.count);\n  }\n}\n\n// Использование:\n// <app-counter [(count)]="myCount"></app-counter>' },
        { type: 'tip', value: 'Паттерн [(x)] называют \"banana in a box\" (банан в коробке). Запомните: квадратные скобки [] снаружи, круглые () внутри.' }
      ]
    },
    {
      id: 5,
      title: 'Template Reference Variables',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template reference variables (#variable) дают ссылку на DOM-элемент или компонент прямо в шаблоне. Их можно использовать для передачи значений без создания свойств в компоненте.' },
        { type: 'heading', value: 'Использование #переменных' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-demo\',\n  standalone: true,\n  template: `\n    <!-- #nameInput ссылается на элемент input -->\n    <input #nameInput type="text" placeholder="Введите имя" />\n    <button (click)="greet(nameInput.value)">Приветствие</button>\n    <p>{{ greeting }}</p>\n\n    <!-- Можно передавать значение напрямую -->\n    <input #emailInput type="email" />\n    <button (click)="sendEmail(emailInput.value)">Отправить</button>\n\n    <!-- Ссылка на компонент -->\n    <app-timer #timer></app-timer>\n    <button (click)="timer.start()">Старт</button>\n    <button (click)="timer.stop()">Стоп</button>\n  `\n})\nexport class DemoComponent {\n  greeting = \'\';\n\n  greet(name: string): void {\n    this.greeting = `Привет, ${name}!`;\n  }\n\n  sendEmail(email: string): void {\n    console.log(\'Отправка на:\', email);\n  }\n}' },
        { type: 'heading', value: '#ref на форме' },
        { type: 'code', language: 'html', value: '<!-- #ref на ngForm даёт доступ к состоянию формы -->\n<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">\n  <input name="username" ngModel required #username="ngModel" />\n  @if (username.invalid && username.touched) {\n    <span class="error">Обязательное поле</span>\n  }\n  <button [disabled]="myForm.invalid">Отправить</button>\n</form>' },
        { type: 'note', value: 'Template reference variables доступны только в шаблоне, не в TypeScript коде. Для доступа из класса используйте @ViewChild.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форма редактирования профиля',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте компонент формы редактирования профиля с двусторонней привязкой данных и предпросмотром в реальном времени.',
      requirements: [
        'Поля ввода: имя, email, биография (textarea)',
        'Двусторонняя привязка через [(ngModel)] для всех полей',
        'Блок предпросмотра, отображающий введённые данные в реальном времени',
        'Кнопка "Сбросить", которая очищает все поля',
        'Счётчик символов для биографии (текущее количество / максимум 200)',
        'Кнопка "Сохранить" заблокирована, если имя или email пустые'
      ],
      hint: 'Импортируйте FormsModule для использования ngModel. Для счётчика символов используйте bio.length. Для блокировки кнопки используйте [disabled].',
      expectedOutput: 'Форма с полями и предпросмотр обновляется в реальном времени при вводе. Кнопка сохранения заблокирована при пустых обязательных полях.',
      solution: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="container">
      <div class="form">
        <h2>Редактирование профиля</h2>
        <label>Имя:</label>
        <input [(ngModel)]="name" placeholder="Введите имя" />

        <label>Email:</label>
        <input [(ngModel)]="email" type="email" placeholder="Введите email" />

        <label>Биография ({{ bio.length }}/200):</label>
        <textarea [(ngModel)]="bio" [maxlength]="200" rows="4" placeholder="Расскажите о себе"></textarea>

        <div class="buttons">
          <button (click)="reset()">Сбросить</button>
          <button [disabled]="!name || !email" (click)="save()">Сохранить</button>
        </div>
      </div>

      <div class="preview">
        <h2>Предпросмотр</h2>
        <h3>{{ name || 'Имя не указано' }}</h3>
        <p>{{ email || 'Email не указан' }}</p>
        <p>{{ bio || 'Биография не заполнена' }}</p>
      </div>
    </div>
  \`,
  styles: [\`
    .container { display: flex; gap: 2rem; padding: 1rem; }
    .form, .preview { flex: 1; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
    label { display: block; margin-top: 0.5rem; font-weight: bold; }
    input, textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .buttons { display: flex; gap: 1rem; margin-top: 1rem; }
    button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    button:first-child { background: #666; color: white; }
    button:last-child { background: #dd0031; color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  \`]
})
export class ProfileEditorComponent {
  name = 'Иван Иванов';
  email = 'ivan@example.com';
  bio = '';

  reset(): void {
    this.name = '';
    this.email = '';
    this.bio = '';
  }

  save(): void {
    console.log('Сохранено:', { name: this.name, email: this.email, bio: this.bio });
    alert('Профиль сохранён!');
  }
}`,
      explanation: '[(ngModel)] обеспечивает двустороннюю привязку: изменение в input мгновенно обновляет свойство компонента, и наоборот. Блок предпросмотра использует интерполяцию {{ }} для отображения текущих значений. Оператор || в шаблоне показывает placeholder, если значение пустое. [disabled] блокирует кнопку через property binding.'
    }
  ]
}
