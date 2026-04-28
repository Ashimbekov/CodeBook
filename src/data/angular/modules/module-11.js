export default {
  id: 11,
  title: 'Реактивные формы',
  description: 'FormGroup, FormControl, FormArray, валидаторы и динамические формы с Reactive Forms',
  lessons: [
    {
      id: 1,
      title: 'Основы Reactive Forms',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реактивные формы (Reactive Forms) — это подход к созданию форм, где вся логика описывается в TypeScript классе. Форма — это FormGroup, каждое поле — FormControl.' },
        { type: 'heading', value: 'Подключение и создание формы' },
        { type: 'code', language: 'typescript', value: 'import { Component } from \'@angular/core\';\nimport { ReactiveFormsModule, FormGroup, FormControl, Validators } from \'@angular/forms\';\n\n@Component({\n  selector: \'app-register\',\n  standalone: true,\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">\n      <label>Имя:</label>\n      <input formControlName="name" />\n\n      <label>Email:</label>\n      <input formControlName="email" type="email" />\n\n      <label>Пароль:</label>\n      <input formControlName="password" type="password" />\n\n      <button type="submit" [disabled]="registerForm.invalid">\n        Регистрация\n      </button>\n    </form>\n\n    <pre>{{ registerForm.value | json }}</pre>\n  `\n})\nexport class RegisterComponent {\n  registerForm = new FormGroup({\n    name: new FormControl(\'\', [Validators.required, Validators.minLength(2)]),\n    email: new FormControl(\'\', [Validators.required, Validators.email]),\n    password: new FormControl(\'\', [Validators.required, Validators.minLength(8)])\n  });\n\n  onSubmit(): void {\n    if (this.registerForm.valid) {\n      console.log(this.registerForm.value);\n      // { name: \'Иван\', email: \'ivan@mail.ru\', password: \'12345678\' }\n    }\n  }\n}' },
        { type: 'tip', value: 'Reactive Forms полностью управляются из класса — нет директив в шаблоне. Это облегчает тестирование и динамическое управление формой.' }
      ]
    },
    {
      id: 2,
      title: 'FormBuilder и валидация',
      type: 'theory',
      content: [
        { type: 'text', value: 'FormBuilder — это удобный сервис для создания форм с более кратким синтаксисом. Validators предоставляют встроенные правила проверки.' },
        { type: 'heading', value: 'FormBuilder' },
        { type: 'code', language: 'typescript', value: 'import { Component, inject } from \'@angular/core\';\nimport { ReactiveFormsModule, FormBuilder, Validators } from \'@angular/forms\';\n\n@Component({\n  selector: \'app-profile\',\n  standalone: true,\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">\n      <div>\n        <label>Имя:</label>\n        <input formControlName="firstName" />\n        @if (profileForm.get(\'firstName\')?.invalid && profileForm.get(\'firstName\')?.touched) {\n          <span class="error">Введите имя (мин. 2 символа)</span>\n        }\n      </div>\n\n      <div>\n        <label>Фамилия:</label>\n        <input formControlName="lastName" />\n      </div>\n\n      <div>\n        <label>Email:</label>\n        <input formControlName="email" />\n        @if (profileForm.get(\'email\')?.errors?.[\'email\'] && profileForm.get(\'email\')?.touched) {\n          <span class="error">Некорректный email</span>\n        }\n      </div>\n\n      <div>\n        <label>Возраст:</label>\n        <input formControlName="age" type="number" />\n        @if (profileForm.get(\'age\')?.errors?.[\'min\']) {\n          <span class="error">Минимальный возраст: 18</span>\n        }\n      </div>\n\n      <button [disabled]="profileForm.invalid">Сохранить</button>\n    </form>\n  `\n})\nexport class ProfileComponent {\n  private fb = inject(FormBuilder);\n\n  profileForm = this.fb.group({\n    firstName: [\'\', [Validators.required, Validators.minLength(2)]],\n    lastName: [\'\', Validators.required],\n    email: [\'\', [Validators.required, Validators.email]],\n    age: [null, [Validators.required, Validators.min(18), Validators.max(120)]]\n  });\n\n  onSubmit(): void {\n    if (this.profileForm.valid) {\n      console.log(this.profileForm.value);\n    } else {\n      // Отметить все поля как touched для показа ошибок\n      this.profileForm.markAllAsTouched();\n    }\n  }\n}' },
        { type: 'heading', value: 'Встроенные валидаторы' },
        { type: 'list', value: [
          'Validators.required — обязательное поле',
          'Validators.minLength(n) — минимальная длина',
          'Validators.maxLength(n) — максимальная длина',
          'Validators.min(n) / max(n) — минимальное/максимальное число',
          'Validators.email — валидация email',
          'Validators.pattern(regex) — проверка регулярным выражением'
        ] },
        { type: 'note', value: 'FormBuilder.group() — сокращение для new FormGroup(). Массив [value, validators] короче, чем new FormControl(value, validators).' }
      ]
    },
    {
      id: 3,
      title: 'Пользовательские валидаторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда встроенных валидаторов недостаточно, можно создать собственные. Валидатор — это функция, которая принимает control и возвращает объект ошибок или null.' },
        { type: 'heading', value: 'Синхронный валидатор' },
        { type: 'code', language: 'typescript', value: 'import { AbstractControl, ValidationErrors, ValidatorFn } from \'@angular/forms\';\n\n// Валидатор: пароль должен содержать заглавную букву и цифру\nexport function strongPassword(): ValidatorFn {\n  return (control: AbstractControl): ValidationErrors | null => {\n    const value = control.value;\n    if (!value) return null;\n\n    const hasUpperCase = /[A-Z]/.test(value);\n    const hasLowerCase = /[a-z]/.test(value);\n    const hasNumber = /[0-9]/.test(value);\n\n    const valid = hasUpperCase && hasLowerCase && hasNumber;\n    return valid ? null : {\n      strongPassword: {\n        hasUpperCase,\n        hasLowerCase,\n        hasNumber\n      }\n    };\n  };\n}\n\n// Использование\npassword: [\'\', [Validators.required, Validators.minLength(8), strongPassword()]]' },
        { type: 'heading', value: 'Валидатор группы (сравнение полей)' },
        { type: 'code', language: 'typescript', value: '// Валидатор: пароль и подтверждение совпадают\nexport function passwordMatch(): ValidatorFn {\n  return (group: AbstractControl): ValidationErrors | null => {\n    const password = group.get(\'password\')?.value;\n    const confirm = group.get(\'confirmPassword\')?.value;\n\n    if (password !== confirm) {\n      return { passwordMismatch: true };\n    }\n    return null;\n  };\n}\n\n// Применение к FormGroup\nthis.registerForm = this.fb.group({\n  password: [\'\', [Validators.required, Validators.minLength(8)]],\n  confirmPassword: [\'\', Validators.required]\n}, {\n  validators: passwordMatch()  // Валидатор группы\n});\n\n// В шаблоне\n@if (registerForm.errors?.[\'passwordMismatch\']) {\n  <span class="error">Пароли не совпадают</span>\n}' },
        { type: 'heading', value: 'Асинхронный валидатор' },
        { type: 'code', language: 'typescript', value: '// Проверка уникальности email через API\nexport function uniqueEmail(userService: UserService): AsyncValidatorFn {\n  return (control: AbstractControl): Observable<ValidationErrors | null> => {\n    return userService.checkEmail(control.value).pipe(\n      map(isTaken => isTaken ? { emailTaken: true } : null),\n      catchError(() => of(null))\n    );\n  };\n}\n\n// Использование\nemail: [\'\', [Validators.required, Validators.email], [uniqueEmail(this.userService)]]' },
        { type: 'tip', value: 'Асинхронные валидаторы передаются третьим аргументом. Они выполняются ПОСЛЕ всех синхронных валидаторов и только если синхронные прошли.' }
      ]
    },
    {
      id: 4,
      title: 'FormArray — динамические поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'FormArray — это массив FormControl или FormGroup. Он позволяет динамически добавлять и удалять поля формы: список телефонов, навыки, адреса.' },
        { type: 'heading', value: 'Работа с FormArray' },
        { type: 'code', language: 'typescript', value: 'import { Component, inject } from \'@angular/core\';\nimport { ReactiveFormsModule, FormBuilder, FormArray, Validators } from \'@angular/forms\';\n\n@Component({\n  selector: \'app-resume\',\n  standalone: true,\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]="resumeForm" (ngSubmit)="onSubmit()">\n      <input formControlName="name" placeholder="ФИО" />\n\n      <h3>Навыки</h3>\n      <div formArrayName="skills">\n        @for (skill of skills.controls; track $index; let i = $index) {\n          <div>\n            <input [formControlName]="i" />\n            <button type="button" (click)="removeSkill(i)">✕</button>\n          </div>\n        }\n      </div>\n      <button type="button" (click)="addSkill()">+ Навык</button>\n\n      <h3>Опыт работы</h3>\n      <div formArrayName="experience">\n        @for (exp of experience.controls; track $index; let i = $index) {\n          <div [formGroupName]="i" class="exp-block">\n            <input formControlName="company" placeholder="Компания" />\n            <input formControlName="position" placeholder="Должность" />\n            <input formControlName="years" type="number" placeholder="Лет" />\n            <button type="button" (click)="removeExperience(i)">Удалить</button>\n          </div>\n        }\n      </div>\n      <button type="button" (click)="addExperience()">+ Опыт</button>\n\n      <button type="submit">Сохранить</button>\n    </form>\n  `\n})\nexport class ResumeComponent {\n  private fb = inject(FormBuilder);\n\n  resumeForm = this.fb.group({\n    name: [\'\', Validators.required],\n    skills: this.fb.array([\'Angular\', \'TypeScript\']),\n    experience: this.fb.array([])\n  });\n\n  get skills(): FormArray {\n    return this.resumeForm.get(\'skills\') as FormArray;\n  }\n\n  get experience(): FormArray {\n    return this.resumeForm.get(\'experience\') as FormArray;\n  }\n\n  addSkill(): void {\n    this.skills.push(this.fb.control(\'\', Validators.required));\n  }\n\n  removeSkill(index: number): void {\n    this.skills.removeAt(index);\n  }\n\n  addExperience(): void {\n    this.experience.push(this.fb.group({\n      company: [\'\', Validators.required],\n      position: [\'\', Validators.required],\n      years: [0, [Validators.required, Validators.min(0)]]\n    }));\n  }\n\n  removeExperience(index: number): void {\n    this.experience.removeAt(index);\n  }\n\n  onSubmit(): void {\n    console.log(this.resumeForm.value);\n  }\n}' },
        { type: 'warning', value: 'Всегда создавайте геттер для FormArray (get skills()). Это обеспечивает правильную типизацию и удобный доступ к controls.' }
      ]
    },
    {
      id: 5,
      title: 'Состояние формы и отображение ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый FormControl и FormGroup имеет набор свойств, описывающих текущее состояние: валидность, изменения, касания. Это позволяет точно управлять отображением ошибок.' },
        { type: 'heading', value: 'Свойства состояния' },
        { type: 'code', language: 'typescript', value: '// Свойства FormControl / FormGroup\nconst email = this.form.get(\'email\');\n\nemail.valid     // true если все валидаторы пройдены\nemail.invalid   // true если есть ошибки\nemail.pristine  // true если значение не менялось\nemail.dirty     // true если значение менялось\nemail.untouched // true если поле не получало фокус\nemail.touched   // true если поле теряло фокус\nemail.errors    // объект ошибок { required: true, email: true }\nemail.value     // текущее значение\nemail.status    // \'VALID\' | \'INVALID\' | \'PENDING\' | \'DISABLED\'' },
        { type: 'heading', value: 'Удобное отображение ошибок' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-form\',\n  standalone: true,\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]="form" (ngSubmit)="submit()">\n      <div class="field">\n        <label>Email</label>\n        <input formControlName="email"\n               [class.error]="isFieldInvalid(\'email\')" />\n        @if (isFieldInvalid(\'email\')) {\n          <div class="errors">\n            @if (form.get(\'email\')?.errors?.[\'required\']) {\n              <span>Email обязателен</span>\n            }\n            @if (form.get(\'email\')?.errors?.[\'email\']) {\n              <span>Некорректный формат email</span>\n            }\n          </div>\n        }\n      </div>\n\n      <div class="field">\n        <label>Пароль</label>\n        <input formControlName="password" type="password"\n               [class.error]="isFieldInvalid(\'password\')" />\n        @if (isFieldInvalid(\'password\')) {\n          <div class="errors">\n            @if (form.get(\'password\')?.errors?.[\'required\']) {\n              <span>Пароль обязателен</span>\n            }\n            @if (form.get(\'password\')?.errors?.[\'minlength\']) {\n              <span>Минимум {{ form.get(\'password\')?.errors?.[\'minlength\'].requiredLength }} символов</span>\n            }\n          </div>\n        }\n      </div>\n\n      <button [disabled]="form.invalid">Отправить</button>\n    </form>\n  `\n})\nexport class FormComponent {\n  private fb = inject(FormBuilder);\n\n  form = this.fb.group({\n    email: [\'\', [Validators.required, Validators.email]],\n    password: [\'\', [Validators.required, Validators.minLength(8)]]\n  });\n\n  isFieldInvalid(field: string): boolean {\n    const control = this.form.get(field);\n    return !!(control?.invalid && control?.touched);\n  }\n\n  submit(): void {\n    if (this.form.invalid) {\n      this.form.markAllAsTouched();  // Показать все ошибки\n      return;\n    }\n    console.log(this.form.value);\n  }\n}' },
        { type: 'tip', value: 'Показывайте ошибки только после touched (пользователь кликнул в поле и ушёл) или после попытки отправки формы (markAllAsTouched). Не показывайте ошибки на пустой форме.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форма регистрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полную форму регистрации с Reactive Forms: валидация, кастомные валидаторы, динамические поля и отображение ошибок.',
      requirements: [
        'Поля: имя, email, пароль, подтверждение пароля, массив телефонов (FormArray)',
        'Встроенные валидаторы: required, email, minLength',
        'Кастомный валидатор: совпадение паролей',
        'Кнопка добавления/удаления телефонов',
        'Отображение ошибок только для touched полей',
        'Кнопка отправки заблокирована при невалидной форме'
      ],
      hint: 'Используйте FormBuilder для создания формы. Валидатор совпадения паролей — это валидатор группы. FormArray для динамических телефонов.',
      expectedOutput: 'Форма валидируется в реальном времени. Ошибки показываются при потере фокуса. Телефоны можно добавлять и удалять. Форма не отправляется при ошибках.',
      solution: `import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: \`
    <h2>Регистрация</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label>Имя</label>
        <input formControlName="name" />
        @if (isInvalid('name')) {
          <span class="error">Имя обязательно (мин. 2 символа)</span>
        }
      </div>

      <div class="field">
        <label>Email</label>
        <input formControlName="email" type="email" />
        @if (form.get('email')?.errors?.['required'] && form.get('email')?.touched) {
          <span class="error">Email обязателен</span>
        }
        @if (form.get('email')?.errors?.['email'] && form.get('email')?.touched) {
          <span class="error">Некорректный email</span>
        }
      </div>

      <div class="field">
        <label>Пароль</label>
        <input formControlName="password" type="password" />
        @if (form.get('password')?.errors?.['minlength'] && form.get('password')?.touched) {
          <span class="error">Минимум 8 символов</span>
        }
      </div>

      <div class="field">
        <label>Подтверждение пароля</label>
        <input formControlName="confirmPassword" type="password" />
        @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.touched) {
          <span class="error">Пароли не совпадают</span>
        }
      </div>

      <h3>Телефоны</h3>
      <div formArrayName="phones">
        @for (phone of phones.controls; track $index; let i = $index) {
          <div>
            <input [formControlName]="i" placeholder="+7..." />
            <button type="button" (click)="removePhone(i)">✕</button>
          </div>
        }
      </div>
      <button type="button" (click)="addPhone()">+ Добавить телефон</button>

      <button type="submit" [disabled]="form.invalid">Зарегистрироваться</button>
    </form>
  \`
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    phones: this.fb.array([this.fb.control('', Validators.required)])
  }, { validators: passwordMatchValidator() });

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  addPhone(): void {
    this.phones.push(this.fb.control('', Validators.required));
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Регистрация:', this.form.value);
  }
}`,
      explanation: 'FormBuilder создаёт форму с валидаторами. passwordMatchValidator — валидатор группы, который сравнивает password и confirmPassword. FormArray phones позволяет динамически добавлять и удалять телефоны. markAllAsTouched() показывает все ошибки при попытке отправить невалидную форму. Ошибки отображаются только для touched полей.'
    }
  ]
}
