export default {
  id: 12,
  title: 'Template-driven формы',
  description: 'Создание форм через шаблон с ngModel, валидация через директивы и сравнение с Reactive Forms',
  lessons: [
    {
      id: 1,
      title: 'Основы Template-driven форм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template-driven формы описываются прямо в HTML-шаблоне с помощью директив ngModel, ngForm и атрибутов валидации. Это проще для небольших форм, но менее гибко для сложных сценариев.' },
        { type: 'heading', value: 'Создание формы' },
        { type: 'code', language: 'typescript', value: 'import { Component } from \'@angular/core\';\nimport { FormsModule } from \'@angular/forms\';\n\n@Component({\n  selector: \'app-contact\',\n  standalone: true,\n  imports: [FormsModule],  // Обязательно!\n  template: `\n    <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">\n      <div>\n        <label>Имя:</label>\n        <input name="name" [(ngModel)]="model.name"\n               required minlength="2"\n               #name="ngModel" />\n        @if (name.invalid && name.touched) {\n          <span class="error">Введите имя (мин. 2 символа)</span>\n        }\n      </div>\n\n      <div>\n        <label>Email:</label>\n        <input name="email" [(ngModel)]="model.email"\n               required email type="email"\n               #email="ngModel" />\n        @if (email.invalid && email.touched) {\n          @if (email.errors?.[\'required\']) {\n            <span class="error">Email обязателен</span>\n          }\n          @if (email.errors?.[\'email\']) {\n            <span class="error">Некорректный email</span>\n          }\n        }\n      </div>\n\n      <div>\n        <label>Сообщение:</label>\n        <textarea name="message" [(ngModel)]="model.message"\n                  required minlength="10"\n                  #message="ngModel"></textarea>\n      </div>\n\n      <button type="submit" [disabled]="contactForm.invalid">Отправить</button>\n    </form>\n  `\n})\nexport class ContactComponent {\n  model = {\n    name: \'\',\n    email: \'\',\n    message: \'\'\n  };\n\n  onSubmit(form: any): void {\n    if (form.valid) {\n      console.log(\'Отправлено:\', this.model);\n      form.reset();\n    }\n  }\n}' },
        { type: 'tip', value: '#contactForm="ngForm" — template reference variable, дающая доступ к форме. #name="ngModel" — доступ к состоянию отдельного поля. Атрибут name обязателен для каждого ngModel.' }
      ]
    },
    {
      id: 2,
      title: 'Валидация Template-driven форм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template-driven формы используют HTML-атрибуты валидации. Angular автоматически добавляет CSS-классы и управляет состоянием каждого контрола.' },
        { type: 'heading', value: 'Атрибуты валидации' },
        { type: 'code', language: 'html', value: '<!-- Обязательное поле -->\n<input name="name" ngModel required />\n\n<!-- Минимальная/максимальная длина -->\n<input name="username" ngModel required minlength="3" maxlength="20" />\n\n<!-- Числовой диапазон -->\n<input name="age" ngModel required type="number" min="18" max="99" />\n\n<!-- Паттерн -->\n<input name="phone" ngModel pattern="\\+7[0-9]{10}" />\n\n<!-- Email -->\n<input name="email" ngModel required email type="email" />' },
        { type: 'heading', value: 'CSS-классы состояния' },
        { type: 'code', language: 'typescript', value: '// Angular автоматически добавляет CSS-классы:\n// ng-valid / ng-invalid     — валидность\n// ng-pristine / ng-dirty    — изменялось ли значение\n// ng-untouched / ng-touched — получало ли фокус\n\n// Пример стилей:\n@Component({\n  styles: [`\n    input.ng-invalid.ng-touched {\n      border-color: red;\n    }\n    input.ng-valid.ng-touched {\n      border-color: green;\n    }\n    .error { color: red; font-size: 0.85rem; }\n  `]\n})' },
        { type: 'heading', value: 'Группировка полей с ngModelGroup' },
        { type: 'code', language: 'html', value: '<form #form="ngForm">\n  <div ngModelGroup="address" #addressGroup="ngModelGroup">\n    <input name="city" ngModel required placeholder="Город" />\n    <input name="street" ngModel required placeholder="Улица" />\n    <input name="zip" ngModel pattern="[0-9]{6}" placeholder="Индекс" />\n  </div>\n  @if (addressGroup.invalid && addressGroup.touched) {\n    <span class="error">Заполните адрес полностью</span>\n  }\n</form>\n\n<!-- form.value = { address: { city: \'...\', street: \'...\', zip: \'...\' } } -->' },
        { type: 'note', value: 'ngModelGroup создаёт вложенный объект в данных формы. Это полезно для логической группировки полей (адрес, контакты, паспортные данные).' }
      ]
    },
    {
      id: 3,
      title: 'Кастомные директивы валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для Template-driven форм пользовательские валидаторы создаются как директивы. Директива реализует интерфейс Validator и регистрируется через NG_VALIDATORS.' },
        { type: 'heading', value: 'Создание директивы-валидатора' },
        { type: 'code', language: 'typescript', value: '// forbidden-name.directive.ts\nimport { Directive, Input } from \'@angular/core\';\nimport { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from \'@angular/forms\';\n\n@Directive({\n  selector: \'[appForbiddenName]\',\n  standalone: true,\n  providers: [\n    {\n      provide: NG_VALIDATORS,\n      useExisting: ForbiddenNameDirective,\n      multi: true\n    }\n  ]\n})\nexport class ForbiddenNameDirective implements Validator {\n  @Input() appForbiddenName: string = \'\';\n\n  validate(control: AbstractControl): ValidationErrors | null {\n    if (!control.value) return null;\n\n    const forbidden = control.value.toLowerCase() === this.appForbiddenName.toLowerCase();\n    return forbidden ? { forbiddenName: { value: control.value } } : null;\n  }\n}\n\n// Использование в шаблоне:\n// <input name="username" ngModel [appForbiddenName]="\'admin\'" />\n// @if (username.errors?.[\'forbiddenName\']) {\n//   <span>Имя \"{{ username.errors?.[\'forbiddenName\'].value }}\" запрещено</span>\n// }' },
        { type: 'heading', value: 'Кросс-полевая валидация' },
        { type: 'code', language: 'typescript', value: '// password-match.directive.ts\n@Directive({\n  selector: \'[appPasswordMatch]\',\n  standalone: true,\n  providers: [\n    { provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }\n  ]\n})\nexport class PasswordMatchDirective implements Validator {\n  validate(group: AbstractControl): ValidationErrors | null {\n    const password = group.get(\'password\')?.value;\n    const confirm = group.get(\'confirmPassword\')?.value;\n    return password === confirm ? null : { passwordMismatch: true };\n  }\n}\n\n// Использование на ngModelGroup или form:\n// <form #form="ngForm" appPasswordMatch>' },
        { type: 'tip', value: 'multi: true позволяет добавлять несколько валидаторов к одному токену NG_VALIDATORS. Без multi новый валидатор заменил бы все предыдущие.' }
      ]
    },
    {
      id: 4,
      title: 'Select, Radio, Checkbox',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular поддерживает двустороннюю привязку для всех типов элементов форм: select, radio, checkbox. Для каждого типа используется ngModel.' },
        { type: 'heading', value: 'Элементы форм' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-survey\',\n  standalone: true,\n  imports: [FormsModule],\n  template: `\n    <form #form="ngForm">\n      <!-- Select -->\n      <label>Город:</label>\n      <select name="city" [(ngModel)]="survey.city" required>\n        <option value="">Выберите город</option>\n        @for (city of cities; track city) {\n          <option [value]="city">{{ city }}</option>\n        }\n      </select>\n\n      <!-- Select с объектами -->\n      <label>Категория:</label>\n      <select name="category" [(ngModel)]="survey.category" required>\n        @for (cat of categories; track cat.id) {\n          <option [ngValue]="cat">{{ cat.name }}</option>\n        }\n      </select>\n\n      <!-- Radio -->\n      <label>Пол:</label>\n      <label>\n        <input type="radio" name="gender" [(ngModel)]="survey.gender" value="male" />\n        Мужской\n      </label>\n      <label>\n        <input type="radio" name="gender" [(ngModel)]="survey.gender" value="female" />\n        Женский\n      </label>\n\n      <!-- Checkbox -->\n      <label>\n        <input type="checkbox" name="agree" [(ngModel)]="survey.agree" required />\n        Я согласен с условиями\n      </label>\n\n      <!-- Multiple checkboxes -->\n      <label>Интересы:</label>\n      @for (interest of allInterests; track interest) {\n        <label>\n          <input type="checkbox"\n                 [checked]="survey.interests.includes(interest)"\n                 (change)="toggleInterest(interest)" />\n          {{ interest }}\n        </label>\n      }\n    </form>\n  `\n})\nexport class SurveyComponent {\n  cities = [\'Москва\', \'Алматы\', \'Минск\', \'Киев\'];\n  categories = [\n    { id: 1, name: \'Технологии\' },\n    { id: 2, name: \'Наука\' },\n    { id: 3, name: \'Спорт\' }\n  ];\n  allInterests = [\'Программирование\', \'Дизайн\', \'Маркетинг\', \'Финансы\'];\n\n  survey = {\n    city: \'\',\n    category: null as any,\n    gender: \'\',\n    agree: false,\n    interests: [] as string[]\n  };\n\n  toggleInterest(interest: string): void {\n    const index = this.survey.interests.indexOf(interest);\n    if (index > -1) {\n      this.survey.interests.splice(index, 1);\n    } else {\n      this.survey.interests.push(interest);\n    }\n  }\n}' },
        { type: 'note', value: 'Используйте [value] для строковых значений и [ngValue] для объектов. [ngValue] сохраняет ссылку на объект, а [value] — только строку.' }
      ]
    },
    {
      id: 5,
      title: 'Template-driven vs Reactive Forms',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оба подхода решают одну задачу — работа с формами. Но они отличаются по архитектуре, тестируемости и подходящим сценариям использования.' },
        { type: 'heading', value: 'Сравнение' },
        { type: 'code', language: 'typescript', value: '// Template-driven: логика в шаблоне\n// <input name="email" [(ngModel)]="email" required email />\n// Проще для простых форм\n// Валидация через HTML-атрибуты\n// Сложнее тестировать\n// Асинхронная (ngModel обновляется асинхронно)\n\n// Reactive: логика в классе\n// email = new FormControl(\'\', [Validators.required, Validators.email]);\n// Полный контроль из TypeScript\n// Легко тестировать\n// Синхронная\n// Лучше для динамических форм' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: [
          'Template-driven: простые формы (логин, контакт, поиск), быстрое прототипирование',
          'Reactive: сложные формы (регистрация, многошаговые), динамические поля, кастомная валидация',
          'Reactive: когда нужно тестировать логику формы без DOM',
          'Reactive: когда форма зависит от Observable (например, данные из API)'
        ] },
        { type: 'tip', value: 'Рекомендация Angular команды — использовать Reactive Forms для новых проектов. Они предоставляют больше контроля и лучше масштабируются.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форма обратной связи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте template-driven форму обратной связи с валидацией, select, radio и отображением ошибок.',
      requirements: [
        'Поля: имя (required), email (required, email), тема (select из списка), приоритет (radio: низкий, средний, высокий)',
        'Textarea для сообщения (required, minlength 20)',
        'Checkbox "Согласие на обработку данных" (required)',
        'Отображение ошибок при touched',
        'Кнопка отправки заблокирована при невалидной форме',
        'Сброс формы после успешной отправки'
      ],
      hint: 'Используйте FormsModule и ngModel. Каждому полю нужен атрибут name. #field="ngModel" даёт доступ к состоянию. form.reset() сбрасывает форму.',
      expectedOutput: 'Форма с валидацией. Ошибки показываются при потере фокуса. Выбор темы из списка и приоритета через radio. После отправки форма очищается.',
      solution: `import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <h2>Обратная связь</h2>
    <form #feedbackForm="ngForm" (ngSubmit)="onSubmit(feedbackForm)">
      <div class="field">
        <label>Имя:</label>
        <input name="name" [(ngModel)]="model.name" required minlength="2" #name="ngModel" />
        @if (name.invalid && name.touched) {
          <span class="error">Введите имя (мин. 2 символа)</span>
        }
      </div>

      <div class="field">
        <label>Email:</label>
        <input name="email" [(ngModel)]="model.email" required email type="email" #email="ngModel" />
        @if (email.invalid && email.touched) {
          @if (email.errors?.['required']) { <span class="error">Email обязателен</span> }
          @if (email.errors?.['email']) { <span class="error">Некорректный email</span> }
        }
      </div>

      <div class="field">
        <label>Тема:</label>
        <select name="topic" [(ngModel)]="model.topic" required #topic="ngModel">
          <option value="">Выберите тему</option>
          <option value="bug">Ошибка</option>
          <option value="feature">Предложение</option>
          <option value="question">Вопрос</option>
          <option value="other">Другое</option>
        </select>
        @if (topic.invalid && topic.touched) {
          <span class="error">Выберите тему</span>
        }
      </div>

      <div class="field">
        <label>Приоритет:</label>
        <label><input type="radio" name="priority" [(ngModel)]="model.priority" value="low" required /> Низкий</label>
        <label><input type="radio" name="priority" [(ngModel)]="model.priority" value="medium" /> Средний</label>
        <label><input type="radio" name="priority" [(ngModel)]="model.priority" value="high" /> Высокий</label>
      </div>

      <div class="field">
        <label>Сообщение:</label>
        <textarea name="message" [(ngModel)]="model.message" required minlength="20" rows="5" #message="ngModel"></textarea>
        @if (message.invalid && message.touched) {
          <span class="error">Минимум 20 символов (сейчас: {{ model.message.length }})</span>
        }
      </div>

      <div class="field">
        <label>
          <input type="checkbox" name="agree" [(ngModel)]="model.agree" required #agree="ngModel" />
          Согласие на обработку данных
        </label>
        @if (agree.invalid && agree.touched) {
          <span class="error">Необходимо дать согласие</span>
        }
      </div>

      <button type="submit" [disabled]="feedbackForm.invalid">Отправить</button>
    </form>

    @if (submitted) {
      <div class="success">Сообщение отправлено!</div>
    }
  \`
})
export class FeedbackComponent {
  model = {
    name: '',
    email: '',
    topic: '',
    priority: 'medium',
    message: '',
    agree: false
  };
  submitted = false;

  onSubmit(form: NgForm): void {
    if (form.valid) {
      console.log('Отправлено:', this.model);
      this.submitted = true;
      form.reset();
      this.model = { name: '', email: '', topic: '', priority: 'medium', message: '', agree: false };
      setTimeout(() => this.submitted = false, 3000);
    }
  }
}`,
      explanation: 'Template-driven форма использует директивы ngModel для двусторонней привязки. Атрибуты required, email, minlength — встроенные валидаторы. #field="ngModel" даёт доступ к ошибкам и состоянию поля. #feedbackForm="ngForm" — ссылка на всю форму. form.reset() сбрасывает форму и все состояния (touched, dirty).'
    }
  ]
}
