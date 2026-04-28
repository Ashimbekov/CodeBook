export default {
  id: 2,
  title: 'TypeScript для Angular',
  description: 'Основы TypeScript, необходимые для работы с Angular: типы, интерфейсы, классы, дженерики и декораторы',
  lessons: [
    {
      id: 1,
      title: 'Базовые типы TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular полностью написан на TypeScript и использует его по умолчанию. TypeScript — это надмножество JavaScript, добавляющее статическую типизацию. Ошибки обнаруживаются на этапе компиляции, а не в рантайме.' },
        { type: 'heading', value: 'Основные типы' },
        { type: 'code', language: 'typescript', value: '// Примитивные типы\nlet name: string = \'Angular\';\nlet version: number = 17;\nlet isStable: boolean = true;\n\n// Массивы\nlet frameworks: string[] = [\'Angular\', \'React\', \'Vue\'];\nlet versions: Array<number> = [14, 15, 16, 17];\n\n// Кортеж (tuple)\nlet entry: [string, number] = [\'Angular\', 17];\n\n// Enum\nenum Status {\n  Active = \'ACTIVE\',\n  Inactive = \'INACTIVE\',\n  Pending = \'PENDING\'\n}\nlet userStatus: Status = Status.Active;\n\n// Any — отключает проверку типов (избегайте!)\nlet data: any = \'строка\';\ndata = 42; // нет ошибки, но плохая практика\n\n// Unknown — безопасная альтернатива any\nlet input: unknown = \'строка\';\nif (typeof input === \'string\') {\n  console.log(input.toUpperCase()); // TS знает что это string\n}' },
        { type: 'heading', value: 'Типизация функций' },
        { type: 'code', language: 'typescript', value: '// Типизация параметров и возвращаемого значения\nfunction greet(name: string): string {\n  return `Привет, ${name}!`;\n}\n\n// Стрелочная функция с типами\nconst add = (a: number, b: number): number => a + b;\n\n// Необязательные параметры\nfunction createUser(name: string, age?: number): void {\n  console.log(name, age); // age может быть undefined\n}\n\n// Значения по умолчанию\nfunction fetchData(url: string, method: string = \'GET\'): void {\n  // method будет \'GET\' если не передан\n}' },
        { type: 'tip', value: 'В Angular проектах включён strict режим TypeScript. Это означает: strictNullChecks, noImplicitAny и другие строгие проверки. Это помогает писать более надёжный код.' },
        { type: 'warning', value: 'Избегайте типа any в Angular проектах. Используйте unknown, если тип не известен, и приводите к нужному типу через type guard.' }
      ]
    },
    {
      id: 2,
      title: 'Интерфейсы и типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерфейсы и типы описывают структуру данных. В Angular они повсеместно используются для описания моделей данных, ответов API и конфигураций.' },
        { type: 'heading', value: 'Интерфейсы (interface)' },
        { type: 'code', language: 'typescript', value: '// Описание структуры объекта\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number;         // необязательное поле\n  readonly role: string; // только для чтения\n}\n\nconst user: User = {\n  id: 1,\n  name: \'Иван\',\n  email: \'ivan@example.com\',\n  role: \'admin\'\n};\n\n// user.role = \'user\'; // Ошибка! readonly\n\n// Расширение интерфейса\ninterface Employee extends User {\n  department: string;\n  salary: number;\n}\n\nconst employee: Employee = {\n  id: 2,\n  name: \'Мария\',\n  email: \'maria@example.com\',\n  role: \'developer\',\n  department: \'Frontend\',\n  salary: 150000\n};' },
        { type: 'heading', value: 'Типы (type alias)' },
        { type: 'code', language: 'typescript', value: '// Type alias\ntype ID = string | number; // Union тип\n\ntype ApiResponse<T> = {\n  data: T;\n  status: number;\n  message: string;\n};\n\ntype UserResponse = ApiResponse<User>;\n\n// Литеральные типы\ntype Theme = \'light\' | \'dark\';\ntype HttpMethod = \'GET\' | \'POST\' | \'PUT\' | \'DELETE\';\n\nlet theme: Theme = \'dark\';\n// theme = \'blue\'; // Ошибка!\n\n// Intersection тип\ntype Timestamped = {\n  createdAt: Date;\n  updatedAt: Date;\n};\n\ntype TimestampedUser = User & Timestamped;' },
        { type: 'note', value: 'В Angular принято использовать interface для описания моделей данных (User, Product, Order) и type для union типов и утилитарных типов.' }
      ]
    },
    {
      id: 3,
      title: 'Классы и ООП',
      type: 'theory',
      content: [
        { type: 'text', value: 'Angular активно использует классы. Компоненты, сервисы, директивы — всё это классы TypeScript с декораторами. Понимание ООП в TypeScript критически важно.' },
        { type: 'heading', value: 'Классы в TypeScript' },
        { type: 'code', language: 'typescript', value: 'class Animal {\n  // Модификаторы доступа\n  public name: string;      // доступен везде (по умолчанию)\n  protected type: string;   // доступен в классе и наследниках\n  private _age: number;     // доступен только в этом классе\n\n  constructor(name: string, type: string, age: number) {\n    this.name = name;\n    this.type = type;\n    this._age = age;\n  }\n\n  // Геттер\n  get age(): number {\n    return this._age;\n  }\n\n  // Метод\n  describe(): string {\n    return `${this.name} — ${this.type}, возраст: ${this._age}`;\n  }\n}\n\n// Наследование\nclass Dog extends Animal {\n  breed: string;\n\n  constructor(name: string, age: number, breed: string) {\n    super(name, \'собака\', age);\n    this.breed = breed;\n  }\n\n  bark(): string {\n    return `${this.name} говорит: Гав!`;\n  }\n}' },
        { type: 'heading', value: 'Сокращённый синтаксис конструктора' },
        { type: 'code', language: 'typescript', value: '// Обычный подход\nclass UserService {\n  private http: HttpClient;\n  private logger: LoggerService;\n\n  constructor(http: HttpClient, logger: LoggerService) {\n    this.http = http;\n    this.logger = logger;\n  }\n}\n\n// Сокращённый подход (часто в Angular)\nclass UserService {\n  constructor(\n    private http: HttpClient,\n    private logger: LoggerService\n  ) {}\n  // http и logger автоматически становятся свойствами класса\n}' },
        { type: 'tip', value: 'Сокращённый синтаксис конструктора — стандартная практика в Angular. Dependency Injection работает именно через конструктор, и этот синтаксис делает код чистым.' }
      ]
    },
    {
      id: 4,
      title: 'Дженерики и утилитарные типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дженерики позволяют создавать переиспользуемые компоненты, которые работают с разными типами данных. Angular HttpClient, Observable, FormGroup — все используют дженерики.' },
        { type: 'heading', value: 'Дженерики' },
        { type: 'code', language: 'typescript', value: '// Дженерик-функция\nfunction identity<T>(value: T): T {\n  return value;\n}\n\nconst num = identity<number>(42);     // T = number\nconst str = identity<string>(\'hello\'); // T = string\nconst inferred = identity(true);       // T = boolean (выведено)\n\n// Дженерик-интерфейс\ninterface ApiResponse<T> {\n  data: T;\n  error: string | null;\n  loading: boolean;\n}\n\n// Использование с разными типами\nconst userResponse: ApiResponse<User> = {\n  data: { id: 1, name: \'Иван\', email: \'ivan@mail.ru\', role: \'admin\' },\n  error: null,\n  loading: false\n};\n\nconst productsResponse: ApiResponse<Product[]> = {\n  data: [],\n  error: null,\n  loading: true\n};' },
        { type: 'heading', value: 'Утилитарные типы TypeScript' },
        { type: 'code', language: 'typescript', value: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n  password: string;\n}\n\n// Partial — все поля необязательные\ntype UpdateUserDto = Partial<User>;\n// { id?: number; name?: string; email?: string; password?: string }\n\n// Pick — выбрать определённые поля\ntype UserPreview = Pick<User, \'id\' | \'name\'>;\n// { id: number; name: string }\n\n// Omit — исключить определённые поля\ntype UserWithoutPassword = Omit<User, \'password\'>;\n// { id: number; name: string; email: string }\n\n// Record — словарь\ntype RolePermissions = Record<string, boolean>;\nconst permissions: RolePermissions = {\n  canRead: true,\n  canWrite: false,\n  canDelete: false\n};\n\n// Required — все поля обязательные\ntype RequiredUser = Required<Partial<User>>;' },
        { type: 'note', value: 'В Angular часто используют Partial для DTO обновления, Pick/Omit для формирования моделей представления, и Record для словарей и конфигураций.' }
      ]
    },
    {
      id: 5,
      title: 'Декораторы TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декораторы — это специальные функции, которые добавляют метаданные к классам, методам и свойствам. Angular полностью построен на декораторах: @Component, @Injectable, @Input, @Output и другие.' },
        { type: 'heading', value: 'Как работают декораторы' },
        { type: 'code', language: 'typescript', value: '// Декоратор класса — это функция, которая принимает конструктор\nfunction Logger(constructor: Function) {\n  console.log(`Создан класс: ${constructor.name}`);\n}\n\n@Logger\nclass MyService {\n  // При создании класса выведет: \"Создан класс: MyService\"\n}\n\n// Декоратор-фабрика (с параметрами)\nfunction Component(config: { selector: string; template: string }) {\n  return function(constructor: Function) {\n    // Сохраняем метаданные\n    (constructor as any).__selector = config.selector;\n    (constructor as any).__template = config.template;\n  };\n}\n\n@Component({\n  selector: \'app-hello\',\n  template: \'<h1>Привет</h1>\'\n})\nclass HelloComponent {\n  // Angular считывает метаданные из декоратора\n}' },
        { type: 'heading', value: 'Декораторы в Angular' },
        { type: 'code', language: 'typescript', value: '// @Component — объявляет компонент\n@Component({\n  selector: \'app-user\',\n  templateUrl: \'./user.component.html\',\n  styleUrls: [\'./user.component.css\']\n})\nexport class UserComponent {}\n\n// @Injectable — делает класс доступным для DI\n@Injectable({\n  providedIn: \'root\'\n})\nexport class UserService {}\n\n// @Input — входные данные компонента\nexport class ChildComponent {\n  @Input() title: string = \'\';\n  @Input() count!: number;\n}\n\n// @Output — выходные события\nexport class ChildComponent {\n  @Output() clicked = new EventEmitter<string>();\n}\n\n// @ViewChild — ссылка на дочерний элемент\nexport class ParentComponent {\n  @ViewChild(\'myInput\') inputRef!: ElementRef;\n}' },
        { type: 'warning', value: 'Для использования декораторов в tsconfig.json должен быть включён experimentalDecorators: true. Angular CLI делает это автоматически.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Типизация моделей данных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте типизированные модели данных для интернет-магазина с использованием интерфейсов, типов и дженериков.',
      requirements: [
        'Интерфейс Product с полями: id, name, price, category, inStock',
        'Интерфейс CartItem, расширяющий Product, с полем quantity',
        'Тип Category как union литералов: electronics, clothing, food',
        'Дженерик интерфейс ApiResponse<T> с полями data, error, total',
        'Функция calculateTotal, принимающая массив CartItem и возвращающая number',
        'Тип CreateProductDto с помощью Omit<Product, "id">'
      ],
      hint: 'Используйте extends для расширения интерфейса, Omit<> для исключения полей, и дженерик <T> для параметризации типа.',
      expectedOutput: 'Все типы и интерфейсы корректно описывают структуру данных. Функция calculateTotal возвращает сумму price * quantity для каждого элемента корзины.',
      solution: `// Тип категории
type Category = 'electronics' | 'clothing' | 'food';

// Интерфейс продукта
interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  inStock: boolean;
}

// Элемент корзины расширяет Product
interface CartItem extends Product {
  quantity: number;
}

// Дженерик для ответа API
interface ApiResponse<T> {
  data: T;
  error: string | null;
  total: number;
}

// DTO для создания продукта (без id)
type CreateProductDto = Omit<Product, 'id'>;

// Функция подсчёта итоговой стоимости
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Пример использования
const cart: CartItem[] = [
  { id: 1, name: 'Ноутбук', price: 75000, category: 'electronics', inStock: true, quantity: 1 },
  { id: 2, name: 'Футболка', price: 2000, category: 'clothing', inStock: true, quantity: 3 }
];

const total = calculateTotal(cart); // 81000

const response: ApiResponse<Product[]> = {
  data: cart,
  error: null,
  total: cart.length
};`,
      explanation: 'Интерфейсы описывают структуру объектов. CartItem расширяет Product через extends, добавляя поле quantity. Тип Category ограничивает допустимые значения строковыми литералами. Omit исключает поле id из Product, создавая DTO для создания нового продукта. Дженерик ApiResponse<T> позволяет использовать один интерфейс для разных типов данных.'
    }
  ]
}
