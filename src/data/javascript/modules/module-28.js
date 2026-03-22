export default {
  id: 28,
  title: 'Proxy и Reflect',
  description: 'Proxy — перехват операций с объектами (get/set/has/apply). Reflect — зеркало встроенных операций. Метапрограммирование в JavaScript.',
  lessons: [
    {
      id: 1,
      title: 'Proxy — перехват операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Proxy оборачивает объект и позволяет перехватывать ("трапить") операции с ним: чтение, запись, удаление, вызов функций. Это основа для реактивности (Vue 3), валидации и логирования.' },
        { type: 'code', language: 'javascript', value: '// new Proxy(target, handler)\n// target — оригинальный объект\n// handler — объект с "трапами" (trap-функциями)\n\nconst user = { name: "Алия", age: 25 };\n\nconst proxy = new Proxy(user, {\n  // Перехват чтения\n  get(target, prop, receiver) {\n    console.log(`Читаем: ${prop}`);\n    return Reflect.get(target, prop, receiver);\n  },\n  // Перехват записи\n  set(target, prop, value, receiver) {\n    console.log(`Записываем ${prop} = ${value}`);\n    return Reflect.set(target, prop, value, receiver);\n  }\n});\n\nconsole.log(proxy.name);  // "Читаем: name" -> "Алия"\nproxy.age = 26;           // "Записываем age = 26"\nconsole.log(proxy.age);   // "Читаем: age" -> 26\n\n// Важно: изменения в proxy отражаются в target и наоборот!\nconsole.log(user.age); // 26 (изменился!)' },
        { type: 'tip', value: 'Всегда используй Reflect в обработчиках Proxy. Reflect.get/set правильно обрабатывают getter/setter и this. Прямое target[prop] может нарушить инварианты для классов с геттерами.' }
      ]
    },
    {
      id: 2,
      title: 'Трапы get и set — валидация',
      type: 'theory',
      content: [
        { type: 'text', value: 'get и set трапы — самые частые. get перехватывает чтение любого свойства, set — запись. Можно добавить валидацию, значения по умолчанию, логирование.' },
        { type: 'code', language: 'javascript', value: '// Валидация через Proxy\nfunction createValidated(schema) {\n  return new Proxy({}, {\n    set(target, prop, value) {\n      const rules = schema[prop];\n      if (!rules) throw new Error(`Неизвестное поле: ${prop}`);\n\n      if (rules.type && typeof value !== rules.type) {\n        throw new TypeError(`${prop} должен быть ${rules.type}`);\n      }\n      if (rules.min !== undefined && value < rules.min) {\n        throw new RangeError(`${prop} >= ${rules.min}`);\n      }\n      if (rules.max !== undefined && value > rules.max) {\n        throw new RangeError(`${prop} <= ${rules.max}`);\n      }\n\n      return Reflect.set(target, prop, value);\n    }\n  });\n}\n\nconst user = createValidated({\n  name: { type: "string" },\n  age:  { type: "number", min: 0, max: 150 }\n});\n\nuser.name = "Алия"; // ok\nuser.age  = 25;     // ok\n\ntry { user.age = -5; }    catch(e) { console.log(e.message); } // age >= 0\ntry { user.name = 42; }   catch(e) { console.log(e.message); } // name должен быть string\ntry { user.email = "@"; } catch(e) { console.log(e.message); } // Неизвестное поле' },
        { type: 'code', language: 'javascript', value: '// Умолчания через get\nconst withDefaults = (obj, defaults) => new Proxy(obj, {\n  get(target, prop) {\n    return prop in target ? target[prop] : defaults[prop];\n  }\n});\n\nconst config = withDefaults(\n  { theme: "dark" },\n  { theme: "light", lang: "ru", fontSize: 14 }\n);\n\nconsole.log(config.theme);    // "dark" (есть в объекте)\nconsole.log(config.lang);     // "ru" (из умолчаний)\nconsole.log(config.fontSize); // 14 (из умолчаний)' },
        { type: 'note', value: 'В set-трапе обязательно возвращай true (успешная запись) или false (неудача, вызовет TypeError в strict mode). Удобно через return Reflect.set(...) — он уже возвращает boolean.' }
      ]
    },
    {
      id: 3,
      title: 'Трап has, deleteProperty, ownKeys',
      type: 'theory',
      content: [
        { type: 'text', value: 'has перехватывает оператор in. deleteProperty — delete obj.key. ownKeys — Object.keys(), for...in. Эти трапы позволяют скрывать свойства или управлять перечислением.' },
        { type: 'code', language: 'javascript', value: '// Скрытие приватных свойств (начинающихся с _)\nconst privateProxy = (obj) => new Proxy(obj, {\n  // Скрывать _ свойства в has\n  has(target, prop) {\n    if (prop.startsWith("_")) return false;\n    return Reflect.has(target, prop);\n  },\n\n  // Скрывать _ в Object.keys\n  ownKeys(target) {\n    return Reflect.ownKeys(target).filter(k => !String(k).startsWith("_"));\n  },\n\n  // Запрет чтения _ свойств\n  get(target, prop) {\n    if (prop.startsWith("_")) {\n      throw new Error(`Доступ к приватному ${prop} запрещён`);\n    }\n    return Reflect.get(target, prop);\n  }\n});\n\nconst obj = privateProxy({ name: "Алия", _secret: "shhh", age: 25 });\n\nconsole.log(obj.name);         // "Алия"\nconsole.log(Object.keys(obj)); // ["name", "age"] (без _secret)\nconsole.log("_secret" in obj); // false\ntry {\n  console.log(obj._secret);   // Error: Доступ к приватному _secret запрещён\n} catch(e) { console.log(e.message); }' },
        { type: 'heading', value: 'Диапазон чисел через Proxy' },
        { type: 'code', language: 'javascript', value: '// Виртуальный массив (range) через Proxy\nfunction createRange(from, to) {\n  return new Proxy({}, {\n    get(target, prop) {\n      if (prop === "length") return to - from + 1;\n      const index = +prop;\n      if (!isNaN(index)) return from + index;\n      return Reflect.get(target, prop);\n    },\n    has(target, prop) {\n      const n = +prop;\n      return !isNaN(n) && n >= from && n <= to;\n    }\n  });\n}\n\nconst range = createRange(1, 5);\nconsole.log(range[0]);      // 1\nconsole.log(range[4]);      // 5\nconsole.log(range.length);  // 5\nconsole.log(3 in range);    // true\nconsole.log(10 in range);   // false' }
      ]
    },
    {
      id: 4,
      title: 'apply и construct трапы',
      type: 'theory',
      content: [
        { type: 'text', value: 'apply перехватывает вызов функции. construct перехватывает вызов с new. Позволяют обернуть функции и конструкторы логикой без изменения оригинала.' },
        { type: 'code', language: 'javascript', value: '// apply трап — для функций\nfunction add(a, b) { return a + b; }\n\nconst loggedAdd = new Proxy(add, {\n  apply(target, thisArg, args) {\n    console.log(`Вызов add(${args.join(", ")})`);\n    const result = Reflect.apply(target, thisArg, args);\n    console.log(`Результат: ${result}`);\n    return result;\n  }\n});\n\nconsole.log(loggedAdd(3, 4)); // "Вызов add(3, 4)", "Результат: 7", 7\n\n// Универсальный логгер\nfunction logged(fn, name = fn.name) {\n  return new Proxy(fn, {\n    apply(target, thisArg, args) {\n      console.time(name);\n      const result = Reflect.apply(target, thisArg, args);\n      console.timeEnd(name);\n      return result;\n    }\n  });\n}\n\nconst fastSort = logged(arr => arr.sort(), "sort");\nfastSort([3, 1, 4, 1, 5, 9]);' },
        { type: 'code', language: 'javascript', value: '// construct трап\nclass Animal {\n  constructor(name) { this.name = name; }\n}\n\nconst LoggedAnimal = new Proxy(Animal, {\n  construct(target, args, newTarget) {\n    console.log(`Создаём ${target.name}(${args})`);\n    return Reflect.construct(target, args, newTarget);\n  }\n});\n\nconst a = new LoggedAnimal("Кот"); // "Создаём Animal(Кот)"\nconsole.log(a instanceof Animal); // true (благодаря newTarget!)' },
        { type: 'tip', value: 'В construct трапе ВСЕГДА передавай newTarget в Reflect.construct — это нужно для правильной работы instanceof и цепочки прототипов с extends.' }
      ]
    },
    {
      id: 5,
      title: 'Reflect — зеркало операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Reflect — объект с методами для выполнения базовых операций над объектами. Методы Reflect соответствуют трапам Proxy один-к-одному. Используй Reflect в трапах для стандартного поведения.' },
        { type: 'code', language: 'javascript', value: '// Reflect методы = встроенные операции JS\nconst obj = { x: 1, y: 2 };\n\n// Reflect.get вместо obj[prop]\nconsole.log(Reflect.get(obj, "x")); // 1\n\n// Reflect.set вместо obj[prop] = val\nReflect.set(obj, "z", 3);\nconsole.log(obj.z); // 3\n\n// Reflect.has вместо prop in obj\nconsole.log(Reflect.has(obj, "x")); // true\n\n// Reflect.deleteProperty вместо delete obj.prop\nReflect.deleteProperty(obj, "y");\nconsole.log(obj.y); // undefined\n\n// Reflect.ownKeys — все ключи (включая Symbol)\nconst sym = Symbol("id");\nconst obj2 = { a: 1, [sym]: 2 };\nconsole.log(Reflect.ownKeys(obj2)); // ["a", Symbol(id)]\n\n// Reflect.apply вместо fn.apply()\nconsole.log(Reflect.apply(Math.max, null, [1, 5, 3])); // 5\n\n// Reflect.construct вместо new Fn()\nconst arr = Reflect.construct(Array, [1, 2, 3]);\nconsole.log(arr); // [1, 2, 3]' },
        { type: 'note', value: 'Reflect.set возвращает boolean (success), в отличие от прямого присваивания (может выбросить TypeError). Reflect идеально подходит для реализации корректных трапов Proxy.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: реактивная система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй простую реактивную систему похожую на Vue 3 reactivity, используя Proxy.',
      requirements: [
        'reactive(obj) — сделать объект реактивным (глубоко)',
        'При изменении любого свойства вызывать подписчиков',
        'watch(reactiveObj, key, callback) — подписаться на изменения ключа',
        'computed(fn) — вычисляемое значение, пересчитывается автоматически'
      ],
      hint: 'Храни Map<target, Map<key, Set<subscribers>>>. В get трапе — отслеживай кто читает (activeEffect). В set — вызывай subscribers для изменённого key.',
      solution: 'const subscribers = new WeakMap();\nlet activeEffect = null;\n\nfunction track(target, key) {\n  if (!activeEffect) return;\n  if (!subscribers.has(target)) subscribers.set(target, new Map());\n  const deps = subscribers.get(target);\n  if (!deps.has(key)) deps.set(key, new Set());\n  deps.get(key).add(activeEffect);\n}\n\nfunction trigger(target, key) {\n  const deps = subscribers.get(target);\n  if (!deps || !deps.has(key)) return;\n  deps.get(key).forEach(effect => effect());\n}\n\nfunction reactive(obj) {\n  return new Proxy(obj, {\n    get(target, key, receiver) {\n      track(target, key);\n      const value = Reflect.get(target, key, receiver);\n      if (value && typeof value === "object") return reactive(value);\n      return value;\n    },\n    set(target, key, value, receiver) {\n      const result = Reflect.set(target, key, value, receiver);\n      trigger(target, key);\n      return result;\n    }\n  });\n}\n\nfunction watch(reactiveObj, key, callback) {\n  const effect = () => callback(reactiveObj[key]);\n  activeEffect = effect;\n  reactiveObj[key]; // trigger track\n  activeEffect = null;\n}\n\nconst state = reactive({ count: 0, name: "Алия" });\n\nwatch(state, "count", val => console.log("count:", val));\n\nstate.count = 1; // count: 1\nstate.count = 2; // count: 2\nstate.name = "Берик"; // (нет подписчика)',
      explanation: 'Реактивная система использует Proxy для перехвата get (track — записать кто читает) и set (trigger — оповестить подписчиков). WeakMap хранит зависимости без удержания объектов в памяти. Это упрощённая версия Vue 3 Reactivity API.'
    }
  ]
}
