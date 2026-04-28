export default {
  id: 1,
  title: 'Введение в Angular',
  description: 'Что такое Angular, зачем он нужен, сравнение с React и Vue, установка и создание первого проекта',
  lessons: [
    {
      id: 1,
      title: 'Что такое Angular',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular — это мощный фреймворк для создания веб-приложений, разработанный и поддерживаемый компанией Google. В отличие от React (библиотека) или Vue, Angular — это полноценный фреймворк, который включает всё необходимое для разработки: роутинг, формы, HTTP-клиент, DI и многое другое.' },
        { type: 'heading', value: 'Краткая история' },
        { type: 'list', value: [
          'AngularJS (2010) — первая версия, использовала JavaScript и двустороннюю привязку данных',
          'Angular 2 (2016) — полное переписывание на TypeScript, компонентный подход',
          'Angular 14 (2022) — standalone компоненты',
          'Angular 16 (2023) — Signals для реактивности',
          'Angular 17+ (2024) — новый синтаксис шаблонов @if, @for'
        ] },
        { type: 'heading', value: 'Ключевые особенности Angular' },
        { type: 'list', value: [
          'TypeScript по умолчанию — строгая типизация и удобство разработки',
          'Компонентная архитектура — UI состоит из переиспользуемых компонентов',
          'Dependency Injection — мощная система внедрения зависимостей',
          'RxJS — реактивное программирование из коробки',
          'Angular CLI — генерация кода, сборка, тестирование одной командой',
          'Полный фреймворк — роутинг, формы, HTTP, анимации включены'
        ] },
        { type: 'tip', value: 'Angular особенно популярен в enterprise-разработке благодаря строгой структуре проекта и TypeScript. Крупные компании вроде Google, Microsoft и Deutsche Bank используют Angular.' },
        { type: 'note', value: 'Не путайте Angular (2+) и AngularJS (1.x). Это совершенно разные фреймворки. AngularJS больше не поддерживается.' }
      ]
    },
    {
      id: 2,
      title: 'Angular vs React vs Vue',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор фреймворка — важное решение. Каждый инструмент имеет свои сильные стороны. Разберём ключевые отличия Angular, React и Vue.' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'typescript', value: '// Angular — полный фреймворк с TypeScript\n@Component({\n  selector: \'app-hello\',\n  template: \'<h1>Привет, {{ name }}!</h1>\'\n})\nexport class HelloComponent {\n  name = \'Angular\';\n}\n\n// React — библиотека с JSX\nfunction Hello() {\n  const [name] = useState(\'React\');\n  return <h1>Привет, {name}!</h1>;\n}\n\n// Vue — прогрессивный фреймворк\n<template>\n  <h1>Привет, {{ name }}!</h1>\n</template>\n<script setup>\nconst name = ref(\'Vue\');\n</script>' },
        { type: 'heading', value: 'Когда выбрать Angular' },
        { type: 'list', value: [
          'Крупные enterprise-проекты с большой командой',
          'Проекты, где важна строгая структура и стандарты',
          'Когда нужен полный фреймворк без подбора библиотек',
          'Если команда знает TypeScript и ООП'
        ] },
        { type: 'heading', value: 'Когда выбрать React или Vue' },
        { type: 'list', value: [
          'React — гибкость, огромная экосистема, React Native для мобильных',
          'Vue — простота обучения, отличная документация, быстрый старт'
        ] },
        { type: 'tip', value: 'Нет "лучшего" фреймворка — есть наиболее подходящий для вашей задачи. Angular отлично подходит для сложных бизнес-приложений с множеством форм и таблиц.' }
      ]
    },
    {
      id: 3,
      title: 'Установка Angular CLI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular CLI (Command Line Interface) — это основной инструмент для работы с Angular. Он позволяет создавать проекты, генерировать компоненты, сервисы и другие элементы, а также собирать и тестировать приложение.' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: '# Убедитесь, что установлен Node.js (версия 18+)\nnode --version\n\n# Установите Angular CLI глобально\nnpm install -g @angular/cli\n\n# Проверьте установку\nng version\n\n# Вывод:\n# Angular CLI: 17.x.x\n# Node: 20.x.x\n# Package Manager: npm 10.x.x' },
        { type: 'heading', value: 'Создание нового проекта' },
        { type: 'code', language: 'bash', value: '# Создание проекта\nng new my-first-app\n\n# CLI спросит:\n# ? Which stylesheet format would you like to use? CSS\n# ? Do you want to enable Server-Side Rendering (SSR)? No\n\n# Перейти в папку проекта\ncd my-first-app\n\n# Запуск dev-сервера\nng serve\n\n# Откройте http://localhost:4200' },
        { type: 'heading', value: 'Основные команды CLI' },
        { type: 'code', language: 'bash', value: '# Генерация компонента\nng generate component my-component\nng g c my-component  # сокращённая форма\n\n# Генерация сервиса\nng g s my-service\n\n# Генерация модуля\nng g m my-module\n\n# Сборка проекта\nng build\n\n# Запуск тестов\nng test\n\n# Линтинг\nng lint' },
        { type: 'tip', value: 'Используйте ng g c --dry-run чтобы увидеть, какие файлы будут созданы, без реального создания. Полезно для проверки.' }
      ]
    },
    {
      id: 4,
      title: 'Структура проекта Angular',
      type: 'theory',
      content: [
        { type: 'text', value: 'После создания проекта через ng new Angular CLI генерирует стандартную структуру. Разберём каждый файл и папку.' },
        { type: 'heading', value: 'Структура папок' },
        { type: 'code', language: 'bash', value: 'my-app/\n├── src/\n│   ├── app/\n│   │   ├── app.component.ts       # Корневой компонент\n│   │   ├── app.component.html     # Шаблон корневого компонента\n│   │   ├── app.component.css      # Стили корневого компонента\n│   │   ├── app.component.spec.ts  # Тесты\n│   │   ├── app.config.ts          # Конфигурация приложения\n│   │   └── app.routes.ts          # Маршруты\n│   ├── assets/                     # Статичные файлы\n│   ├── index.html                  # Главный HTML\n│   ├── main.ts                     # Точка входа\n│   └── styles.css                  # Глобальные стили\n├── angular.json                    # Конфигурация Angular CLI\n├── package.json                    # Зависимости\n├── tsconfig.json                   # Конфигурация TypeScript\n└── tsconfig.app.json               # TS конфигурация для приложения' },
        { type: 'heading', value: 'Точка входа — main.ts' },
        { type: 'code', language: 'typescript', value: '// main.ts — запуск приложения\nimport { bootstrapApplication } from \'@angular/platform-browser\';\nimport { appConfig } from \'./app/app.config\';\nimport { AppComponent } from \'./app/app.component\';\n\nbootstrapApplication(AppComponent, appConfig)\n  .catch((err) => console.error(err));' },
        { type: 'heading', value: 'Корневой компонент' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\nimport { Component } from \'@angular/core\';\nimport { RouterOutlet } from \'@angular/router\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  imports: [RouterOutlet],\n  templateUrl: \'./app.component.html\',\n  styleUrl: \'./app.component.css\'\n})\nexport class AppComponent {\n  title = \'my-app\';\n}' },
        { type: 'note', value: 'В Angular 17+ проекты по умолчанию используют standalone компоненты. В старых проектах вы увидите NgModule подход с файлами app.module.ts.' }
      ]
    },
    {
      id: 5,
      title: 'Первое приложение: Hello Angular',
      type: 'theory',
      content: [
        { type: 'text', value: 'Давайте создадим первое приложение и разберём, как работает каждая часть Angular.' },
        { type: 'heading', value: 'Изменяем корневой компонент' },
        { type: 'code', language: 'typescript', value: '// app.component.ts\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-root\',\n  standalone: true,\n  template: `\n    <h1>Привет, {{ name }}!</h1>\n    <p>Добро пожаловать в Angular</p>\n    <button (click)=\"changeName()\">Сменить имя</button>\n  `,\n  styles: [`\n    h1 { color: #dd0031; }\n    button {\n      padding: 8px 16px;\n      background: #dd0031;\n      color: white;\n      border: none;\n      border-radius: 4px;\n      cursor: pointer;\n    }\n  `]\n})\nexport class AppComponent {\n  name = \'Angular\';\n\n  changeName(): void {\n    this.name = \'Мир\';\n  }\n}' },
        { type: 'heading', value: 'Что здесь происходит' },
        { type: 'list', value: [
          '@Component — декоратор, который превращает класс в компонент',
          'selector — CSS-селектор для использования компонента (<app-root>)',
          'template — HTML-шаблон с Angular-синтаксисом',
          '{{ name }} — интерполяция: вставка значения переменной в шаблон',
          '(click) — привязка к событию клика',
          'styles — CSS стили, изолированные внутри компонента'
        ] },
        { type: 'tip', value: 'Можно использовать template/styles для инлайн-кода или templateUrl/styleUrl для отдельных файлов. Для небольших компонентов инлайн удобнее.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание приложения-визитки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте Angular-компонент, который отображает вашу визитную карточку с именем, профессией и списком навыков.',
      requirements: [
        'Компонент AppComponent с полями name, profession и массивом skills',
        'Отображение имени в теге <h1> через интерполяцию',
        'Отображение профессии в теге <p>',
        'Кнопка, которая добавляет новый навык в массив',
        'Стилизация компонента с цветами Angular (#dd0031)'
      ],
      hint: 'Используйте @Component декоратор с inline template. Для массива skills используйте метод push(). Событие клика привязывается через (click).',
      expectedOutput: 'Отображается имя, профессия и список навыков. При нажатии кнопки добавляется новый навык.',
      solution: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`
    <div class="card">
      <h1>{{ name }}</h1>
      <p class="profession">{{ profession }}</p>
      <h3>Навыки:</h3>
      <ul>
        @for (skill of skills; track skill) {
          <li>{{ skill }}</li>
        }
      </ul>
      <button (click)="addSkill()">Добавить навык</button>
    </div>
  \`,
  styles: [\`
    .card {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
    }
    h1 { color: #dd0031; margin-bottom: 0.5rem; }
    .profession { color: #666; font-size: 1.1rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 4px 0; }
    button {
      padding: 8px 20px;
      background: #dd0031;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 1rem;
    }
  \`]
})
export class AppComponent {
  name = 'Иван Иванов';
  profession = 'Frontend-разработчик';
  skills = ['HTML', 'CSS', 'TypeScript', 'Angular'];

  addSkill(): void {
    const newSkills = ['RxJS', 'NgRx', 'Jest', 'Docker', 'Git'];
    const randomSkill = newSkills[Math.floor(Math.random() * newSkills.length)];
    this.skills.push(randomSkill);
  }
}`,
      explanation: 'Компонент хранит данные в свойствах класса. Интерполяция {{ }} вставляет значения в шаблон. Декоратор @for (Angular 17+) итерирует по массиву. Метод addSkill() вызывается при клике, Angular автоматически обновляет DOM при изменении данных.'
    }
  ]
}
