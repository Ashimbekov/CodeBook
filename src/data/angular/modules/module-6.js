export default {
  id: 6,
  title: 'Пайпы',
  description: 'Встроенные пайпы Angular для трансформации данных, создание пользовательских пайпов и async pipe',
  lessons: [
    {
      id: 1,
      title: 'Встроенные пайпы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пайпы (pipes) — это функции трансформации данных, которые используются в шаблонах. Они принимают значение, преобразуют его и возвращают результат. Angular предоставляет множество встроенных пайпов.' },
        { type: 'heading', value: 'Строковые пайпы' },
        { type: 'code', language: 'html', value: '<!-- uppercase / lowercase -->\n<p>{{ \'angular\' | uppercase }}</p>          <!-- ANGULAR -->\n<p>{{ \'ANGULAR\' | lowercase }}</p>          <!-- angular -->\n\n<!-- titlecase -->\n<p>{{ \'hello world\' | titlecase }}</p>       <!-- Hello World -->\n\n<!-- slice (подстрока) -->\n<p>{{ \'Angular Framework\' | slice:0:7 }}</p> <!-- Angular -->' },
        { type: 'heading', value: 'Числовые пайпы' },
        { type: 'code', language: 'html', value: '<!-- number: минЦелых.минДробных-максДробных -->\n<p>{{ 3.14159 | number:\'1.2-2\' }}</p>     <!-- 3.14 -->\n<p>{{ 1234567 | number }}</p>              <!-- 1,234,567 -->\n\n<!-- currency -->\n<p>{{ 1500 | currency:\'RUB\':\'symbol\' }}</p>  <!-- ₽1,500.00 -->\n<p>{{ 99.99 | currency:\'USD\' }}</p>           <!-- $99.99 -->\n\n<!-- percent -->\n<p>{{ 0.75 | percent }}</p>                  <!-- 75% -->\n<p>{{ 0.256 | percent:\'1.1-1\' }}</p>          <!-- 25.6% -->' },
        { type: 'heading', value: 'Дата пайп' },
        { type: 'code', language: 'html', value: '<!-- date -->\n<p>{{ today | date }}</p>                    <!-- Apr 4, 2026 -->\n<p>{{ today | date:\'short\' }}</p>             <!-- 4/4/26, 12:00 PM -->\n<p>{{ today | date:\'fullDate\' }}</p>          <!-- Saturday, April 4, 2026 -->\n<p>{{ today | date:\'dd.MM.yyyy\' }}</p>        <!-- 04.04.2026 -->\n<p>{{ today | date:\'HH:mm:ss\' }}</p>          <!-- 14:30:00 -->\n<p>{{ today | date:\'dd MMMM yyyy\':\'\':\' ru\' }}</p>  <!-- 04 апреля 2026 -->' },
        { type: 'tip', value: 'Пайпы можно комбинировать через цепочку: {{ name | uppercase | slice:0:5 }}. Они выполняются слева направо.' }
      ]
    },
    {
      id: 2,
      title: 'JSON, KeyValue и другие утилитарные пайпы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular содержит несколько утилитарных пайпов, которые особенно полезны при отладке и работе с объектами.' },
        { type: 'heading', value: 'json pipe — для отладки' },
        { type: 'code', language: 'typescript', value: '@Component({\n  selector: \'app-debug\',\n  standalone: true,\n  imports: [JsonPipe, KeyValuePipe],\n  template: `\n    <!-- Вывод объекта в формате JSON -->\n    <pre>{{ user | json }}</pre>\n    <!--\n    {\n      \"name\": \"Иван\",\n      \"age\": 25,\n      \"skills\": [\"Angular\", \"TypeScript\"]\n    }\n    -->\n\n    <!-- keyvalue — итерация по объекту -->\n    <h3>Настройки:</h3>\n    @for (item of settings | keyvalue; track item.key) {\n      <p>{{ item.key }}: {{ item.value }}</p>\n    }\n    <!--\n    language: ru\n    theme: dark\n    notifications: true\n    -->\n  `\n})\nexport class DebugComponent {\n  user = {\n    name: \'Иван\',\n    age: 25,\n    skills: [\'Angular\', \'TypeScript\']\n  };\n\n  settings: Record<string, string | boolean> = {\n    language: \'ru\',\n    theme: \'dark\',\n    notifications: true\n  };\n}' },
        { type: 'heading', value: 'Импорт пайпов в standalone компоненты' },
        { type: 'code', language: 'typescript', value: '// Для standalone компонентов пайпы нужно импортировать\nimport {\n  DatePipe,\n  CurrencyPipe,\n  DecimalPipe,\n  PercentPipe,\n  UpperCasePipe,\n  LowerCasePipe,\n  TitleCasePipe,\n  SlicePipe,\n  JsonPipe,\n  KeyValuePipe,\n  AsyncPipe\n} from \'@angular/common\';\n\n@Component({\n  standalone: true,\n  imports: [DatePipe, CurrencyPipe, JsonPipe],\n  // ...\n})' },
        { type: 'note', value: 'json pipe незаменим при отладке — используйте <pre>{{ data | json }}</pre> чтобы быстро посмотреть содержимое объекта прямо на странице.' }
      ]
    },
    {
      id: 3,
      title: 'Создание пользовательского пайпа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular позволяет создавать собственные пайпы для любой трансформации данных. Пайп — это класс с декоратором @Pipe и методом transform().' },
        { type: 'heading', value: 'Создание через CLI' },
        { type: 'code', language: 'bash', value: 'ng generate pipe truncate\n# или\nng g p truncate' },
        { type: 'heading', value: 'Пример: пайп обрезки текста' },
        { type: 'code', language: 'typescript', value: '// truncate.pipe.ts\nimport { Pipe, PipeTransform } from \'@angular/core\';\n\n@Pipe({\n  name: \'truncate\',\n  standalone: true\n})\nexport class TruncatePipe implements PipeTransform {\n  transform(value: string, limit: number = 50, trail: string = \'...\'): string {\n    if (!value) return \'\';\n    if (value.length <= limit) return value;\n    return value.substring(0, limit) + trail;\n  }\n}\n\n// Использование:\n// {{ longText | truncate }}           — обрежет до 50 символов\n// {{ longText | truncate:100 }}       — обрежет до 100 символов\n// {{ longText | truncate:30:\'→\' }}    — обрежет до 30 с →' },
        { type: 'heading', value: 'Пример: пайп форматирования времени' },
        { type: 'code', language: 'typescript', value: '// time-ago.pipe.ts\nimport { Pipe, PipeTransform } from \'@angular/core\';\n\n@Pipe({\n  name: \'timeAgo\',\n  standalone: true\n})\nexport class TimeAgoPipe implements PipeTransform {\n  transform(value: Date | string): string {\n    const date = new Date(value);\n    const now = new Date();\n    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);\n\n    if (seconds < 60) return \'только что\';\n    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин. назад`;\n    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч. назад`;\n    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} дн. назад`;\n    return date.toLocaleDateString(\'ru-RU\');\n  }\n}\n\n// Использование:\n// {{ post.createdAt | timeAgo }}  →  \"5 мин. назад\"' },
        { type: 'tip', value: 'Пайпы по умолчанию pure (чистые) — они пересчитываются только при изменении входного значения. Для пайпов, которые зависят от внешних факторов (как timeAgo), можно сделать pure: false, но это влияет на производительность.' }
      ]
    },
    {
      id: 4,
      title: 'Async Pipe',
      type: 'theory',
      content: [
        { type: 'text', value: 'AsyncPipe — самый важный пайп в Angular. Он автоматически подписывается на Observable или Promise, отображает последнее значение и отписывается при уничтожении компонента.' },
        { type: 'heading', value: 'Использование async pipe' },
        { type: 'code', language: 'typescript', value: 'import { Component } from \'@angular/core\';\nimport { AsyncPipe } from \'@angular/common\';\nimport { Observable, interval, of } from \'rxjs\';\nimport { map } from \'rxjs/operators\';\n\n@Component({\n  selector: \'app-async-demo\',\n  standalone: true,\n  imports: [AsyncPipe],\n  template: `\n    <!-- Observable с async pipe -->\n    <p>Время: {{ timer$ | async }}</p>\n\n    <!-- Массив из Observable -->\n    @if (users$ | async; as users) {\n      @for (user of users; track user.id) {\n        <p>{{ user.name }}</p>\n      }\n    } @else {\n      <p>Загрузка...</p>\n    }\n\n    <!-- Promise с async pipe -->\n    <p>Данные: {{ dataPromise | async }}</p>\n  `\n})\nexport class AsyncDemoComponent {\n  // Observable — таймер обновляется каждую секунду\n  timer$: Observable<string> = interval(1000).pipe(\n    map(n => new Date().toLocaleTimeString())\n  );\n\n  // Observable — имитация HTTP-запроса\n  users$: Observable<{ id: number; name: string }[]> = of([\n    { id: 1, name: \'Иван\' },\n    { id: 2, name: \'Мария\' }\n  ]);\n\n  // Promise\n  dataPromise: Promise<string> = new Promise(resolve => {\n    setTimeout(() => resolve(\'Данные загружены!\'), 2000);\n  });\n}' },
        { type: 'heading', value: 'Преимущества async pipe' },
        { type: 'list', value: [
          'Автоматическая подписка — не нужно вручную subscribe()',
          'Автоматическая отписка — нет утечек памяти при уничтожении компонента',
          'Автоматический change detection — компонент обновляется при новом значении',
          'Чистый код — нет необходимости хранить подписку и отписываться в ngOnDestroy'
        ] },
        { type: 'warning', value: 'Не используйте async pipe несколько раз для одного Observable! Каждый async pipe создаёт отдельную подписку. Используйте @if (data$ | async; as data) и затем обращайтесь к data.' }
      ]
    },
    {
      id: 5,
      title: 'Pure и Impure пайпы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular различает чистые (pure) и нечистые (impure) пайпы. Это влияет на производительность и поведение пайпа.' },
        { type: 'heading', value: 'Pure pipes (по умолчанию)' },
        { type: 'code', language: 'typescript', value: '// Pure pipe — пересчитывается ТОЛЬКО при изменении входного значения\n// (примитива или ссылки на объект)\n@Pipe({\n  name: \'filterByStatus\',\n  standalone: true,\n  pure: true  // по умолчанию\n})\nexport class FilterByStatusPipe implements PipeTransform {\n  transform(items: Task[], status: \'all\' | \'active\' | \'done\'): Task[] {\n    if (status === \'all\') return items;\n    return items.filter(item =>\n      status === \'done\' ? item.completed : !item.completed\n    );\n  }\n}\n\n// ПРОБЛЕМА: если мутировать массив (push), pipe НЕ обновится!\n// Решение: создавайте новый массив\nthis.tasks = [...this.tasks, newTask]; // ✅ новая ссылка\n// this.tasks.push(newTask);            // ❌ та же ссылка' },
        { type: 'heading', value: 'Impure pipes' },
        { type: 'code', language: 'typescript', value: '// Impure pipe — пересчитывается при КАЖДОМ цикле change detection\n@Pipe({\n  name: \'filterByStatus\',\n  standalone: true,\n  pure: false  // пересчитывается часто!\n})\nexport class FilterByStatusPipe implements PipeTransform {\n  transform(items: Task[], status: string): Task[] {\n    if (status === \'all\') return items;\n    return items.filter(item =>\n      status === \'done\' ? item.completed : !item.completed\n    );\n  }\n}\n\n// Теперь pipe обновится даже при push()\n// Но это дорого по производительности!' },
        { type: 'tip', value: 'Предпочитайте pure пайпы и иммутабельные данные. Вместо array.push() используйте [...array, newItem]. Это не только для пайпов — это хорошая практика в Angular в целом.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание пайпа фильтрации и поиска',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте пользовательский пайп для фильтрации массива товаров по названию и категории, а также пайп для форматирования цены.',
      requirements: [
        'Пайп filterProducts: фильтрует массив товаров по searchTerm и category',
        'Пайп priceFormat: форматирует число в цену с разделителями тысяч и валютой',
        'Компонент с товарами, полем поиска и выбором категории',
        'Использование async pipe для имитации загрузки данных',
        'Цепочка пайпов в шаблоне',
        'Отображение количества найденных товаров'
      ],
      hint: 'Пайп filterProducts принимает массив и два аргумента: searchTerm и category. Метод transform должен фильтровать по обоим условиям. Используйте of() и delay() для имитации загрузки.',
      expectedOutput: 'Список товаров фильтруется при вводе текста и выборе категории. Цены отображаются в формате "1 500 руб.".',
      solution: `import { Pipe, PipeTransform } from '@angular/core';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

// Пайп фильтрации
@Pipe({ name: 'filterProducts', standalone: true })
export class FilterProductsPipe implements PipeTransform {
  transform(products: Product[], searchTerm: string, category: string): Product[] {
    if (!products) return [];
    let result = products;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }
    if (category && category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    return result;
  }
}

// Пайп форматирования цены
@Pipe({ name: 'priceFormat', standalone: true })
export class PriceFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'руб.'): string {
    if (value == null) return '';
    const formatted = value.toLocaleString('ru-RU');
    return formatted + ' ' + currency;
  }
}

// Компонент
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable, of, delay } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, AsyncPipe, FilterProductsPipe, PriceFormatPipe],
  template: \`
    <h2>Каталог товаров</h2>
    <input [(ngModel)]="searchTerm" placeholder="Поиск товаров..." />
    <select [(ngModel)]="selectedCategory">
      <option value="all">Все категории</option>
      <option value="electronics">Электроника</option>
      <option value="clothing">Одежда</option>
      <option value="food">Продукты</option>
    </select>

    @if (products$ | async; as products) {
      <p>Найдено: {{ (products | filterProducts:searchTerm:selectedCategory).length }} товаров</p>
      @for (product of products | filterProducts:searchTerm:selectedCategory; track product.id) {
        <div class="product">
          <h3>{{ product.name }}</h3>
          <span class="category">{{ product.category }}</span>
          <span class="price">{{ product.price | priceFormat }}</span>
        </div>
      } @empty {
        <p>Товары не найдены</p>
      }
    } @else {
      <p>Загрузка товаров...</p>
    }
  \`
})
export class ProductListComponent {
  searchTerm = '';
  selectedCategory = 'all';

  products$: Observable<Product[]> = of([
    { id: 1, name: 'Ноутбук ASUS', category: 'electronics', price: 75000 },
    { id: 2, name: 'Смартфон Samsung', category: 'electronics', price: 45000 },
    { id: 3, name: 'Футболка Nike', category: 'clothing', price: 3500 },
    { id: 4, name: 'Кроссовки Adidas', category: 'clothing', price: 8900 },
    { id: 5, name: 'Кофе арабика', category: 'food', price: 1200 },
    { id: 6, name: 'Чай зелёный', category: 'food', price: 450 }
  ]).pipe(delay(1000));
}`,
      explanation: 'FilterProductsPipe — чистый пайп, который фильтрует массив по двум критериям. PriceFormatPipe форматирует число в читаемую цену. AsyncPipe подписывается на Observable и автоматически отписывается. Пайпы комбинируются в шаблоне через |. Конструкция @if (obs$ | async; as data) сохраняет результат в переменную data для повторного использования.'
    }
  ]
}
