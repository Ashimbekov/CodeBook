export default {
  id: 11,
  title: 'Хеш-таблица',
  description: 'Хеш-таблицы — одна из самых важных структур данных. Разбираемся с хешированием, коллизиями, методами их разрешения и реализацией HashMap в Java.',
  lessons: [
    {
      id: 1,
      title: 'Что такое хеш-таблица — аналогия с библиотекой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представь огромную библиотеку с миллионом книг. Если книги стоят в случайном порядке — чтобы найти нужную, придётся перебирать все подряд. Это медленно! Но если у каждой книги есть каталожный номер, и она стоит точно на полке с этим номером — найти книгу можно мгновенно!' },
        { type: 'tip', value: 'Хеш-таблица — это именно такая "умная библиотека". Ключ (название книги) превращается в номер полки (хеш-код) с помощью специальной функции. Потом по этому номеру ты мгновенно находишь нужное место.' },
        { type: 'heading', value: 'Зачем нужна хеш-таблица?' },
        { type: 'text', value: 'Обычный массив даёт O(1) доступ по индексу (числу). Но что, если ключ — строка "имя пользователя"? Нам нужен способ превратить любой ключ в индекс массива. Это и делает хеш-функция.' },
        { type: 'code', language: 'java', value: '// Задача: хранить пары "имя -> номер телефона"\n// Массив не подходит — ключи не числа, а строки\n\n// Решение — HashMap (хеш-таблица)!\nimport java.util.HashMap;\n\nHashMap<String, String> phonebook = new HashMap<>();\n\n// Добавляем данные — O(1) в среднем\nphonebook.put("Алибек", "+7 700 111 22 33");\nphonebook.put("Дана", "+7 701 222 33 44");\nphonebook.put("Нурлан", "+7 702 333 44 55");\n\n// Поиск — O(1) в среднем!\nString phone = phonebook.get("Дана");\nSystem.out.println("Телефон Даны: " + phone);\n// Телефон Даны: +7 701 222 33 44\n\n// Без хеш-таблицы пришлось бы перебирать весь список!' },
        { type: 'heading', value: 'Сравнение операций' },
        { type: 'list', items: [
          'Поиск в массиве: O(n) — перебираем все элементы',
          'Поиск в хеш-таблице: O(1) средний случай — прямо по адресу!',
          'Вставка в хеш-таблицу: O(1) средний случай',
          'Удаление из хеш-таблицы: O(1) средний случай'
        ]},
        { type: 'note', value: 'HashMap в Java — это и есть хеш-таблица. Внутри неё скрывается массив "корзин" (buckets) и умная хеш-функция. Ты пишешь put/get, а Java делает всю магию!' }
      ]
    },
    {
      id: 2,
      title: 'Хеш-функция — как ключ превращается в индекс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хеш-функция — это "мясорубка" для ключей. Ты закидываешь любой ключ (строку, число, объект), а она выдаёт число — индекс в массиве. Хорошая хеш-функция распределяет ключи равномерно.' },
        { type: 'heading', value: 'Простейшая хеш-функция для строк' },
        { type: 'code', language: 'java', value: '// Идея: сложить коды всех символов строки\n// и взять остаток от деления на размер массива\n\npublic static int simpleHash(String key, int capacity) {\n    int hash = 0;\n    for (int i = 0; i < key.length(); i++) {\n        hash += key.charAt(i);  // код символа (например, \'A\'=65)\n    }\n    return hash % capacity;  // индекс в пределах [0, capacity-1]\n}\n\n// Пример:\n// "cat" = 99 + 97 + 116 = 312\n// 312 % 10 = 2  --> кладём в ячейку 2\n\n// "dog" = 100 + 111 + 103 = 314\n// 314 % 10 = 4  --> кладём в ячейку 4\n\nSystem.out.println(simpleHash("cat", 10));  // 2\nSystem.out.println(simpleHash("dog", 10));  // 4' },
        { type: 'warning', value: 'Простая сумма символов — плохая хеш-функция! "abc" и "bca" дадут одинаковый хеш (буквы те же, только порядок другой). В Java используется более сложная функция, учитывающая позицию символа.' },
        { type: 'heading', value: 'Улучшенная хеш-функция (похожа на Java)' },
        { type: 'code', language: 'java', value: '// Java использует polynomial rolling hash:\n// hash = s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]\n\npublic static int betterHash(String key, int capacity) {\n    int hash = 0;\n    for (int i = 0; i < key.length(); i++) {\n        hash = 31 * hash + key.charAt(i);\n    }\n    // Math.abs — чтобы не было отрицательного индекса\n    return Math.abs(hash) % capacity;\n}\n\n// Теперь "abc" и "bca" дают РАЗНЫЕ хеши!\n// "abc": 0*31+97=97, 97*31+98=3105, 3105*31+99=96354\n// "bca": 0*31+98=98, 98*31+99=3137, 3137*31+97=97344\n\nSystem.out.println(betterHash("abc", 100));  // 54\nSystem.out.println(betterHash("bca", 100));  // 44\n\n// Также в Java у каждого объекта есть hashCode()!\nSystem.out.println("abc".hashCode());  // 96354\nSystem.out.println("bca".hashCode());  // 97344' },
        { type: 'heading', value: 'Свойства хорошей хеш-функции' },
        { type: 'list', items: [
          'Детерминированность: одинаковый ключ → всегда одинаковый хеш',
          'Равномерность: хеши распределены по всему массиву',
          'Быстрота: вычисляется за O(k), где k — длина ключа',
          'Лавинный эффект: маленькое изменение ключа → большое изменение хеша'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Коллизии — когда два ключа попадают в одну ячейку',
      type: 'theory',
      content: [
        { type: 'text', value: 'Коллизия — это когда два разных ключа дают одинаковый хеш и претендуют на одну ячейку. Представь: в библиотеке два учебника получили одинаковый каталожный номер. Куда класть второй?' },
        { type: 'tip', value: 'Коллизии неизбежны! Если ключей больше, чем ячеек — по принципу Дирихле (принцип голубятни) хоть какие-то два ключа попадут в одно место. Задача — не избежать коллизий, а умело с ними справляться.' },
        { type: 'heading', value: 'Демонстрация коллизии' },
        { type: 'code', language: 'java', value: '// Допустим, массив размером 5\nint capacity = 5;\n\n// "cat" → 312 % 5 = 2\n// "dog" → 314 % 5 = 4\n// "act" → 312 % 5 = 2  <-- КОЛЛИЗИЯ! та же ячейка, что и "cat"\n\npublic static int hash(String key, int capacity) {\n    int h = 0;\n    for (char c : key.toCharArray()) h += c;\n    return h % capacity;\n}\n\nSystem.out.println(hash("cat", 5));  // 2\nSystem.out.println(hash("dog", 5));  // 4\nSystem.out.println(hash("act", 5));  // 2 — коллизия с "cat"!\nSystem.out.println(hash("tac", 5));  // 2 — ещё одна коллизия!\n\n// Что делать? Есть два основных метода:\n// 1) Метод цепочек (Chaining)\n// 2) Открытая адресация (Open Addressing)' },
        { type: 'note', value: 'В реальных приложениях процент коллизий зависит от коэффициента загрузки (load factor). Java\'s HashMap считает это автоматически и перестраивает таблицу, когда коллизий становится слишком много.' }
      ]
    },
    {
      id: 4,
      title: 'Метод цепочек (Chaining)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метод цепочек — самый простой способ разрешения коллизий. Каждая ячейка массива хранит не одно значение, а связный список (цепочку) всех пар ключ-значение, которые попали в эту ячейку.' },
        { type: 'tip', value: 'Представь парковку: у каждого места есть номер. Если машина приезжает и место занято — она паркуется "в очередь" за предыдущей машиной. Каждое место — это начало цепочки машин. Метод цепочек работает так же!' },
        { type: 'heading', value: 'Реализация метода цепочек' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\n\nclass ChainingHashMap {\n    private static final int CAPACITY = 10;\n    private LinkedList<String[]>[] buckets;  // каждая ячейка — список пар\n\n    @SuppressWarnings("unchecked")\n    public ChainingHashMap() {\n        buckets = new LinkedList[CAPACITY];\n        for (int i = 0; i < CAPACITY; i++) {\n            buckets[i] = new LinkedList<>();\n        }\n    }\n\n    private int hash(String key) {\n        return Math.abs(key.hashCode()) % CAPACITY;\n    }\n\n    public void put(String key, String value) {\n        int index = hash(key);  // вычисляем индекс\n        // Проверяем: может, ключ уже есть? Обновляем\n        for (String[] pair : buckets[index]) {\n            if (pair[0].equals(key)) {\n                pair[1] = value;  // обновляем значение\n                return;\n            }\n        }\n        // Ключа нет — добавляем в цепочку\n        buckets[index].add(new String[]{key, value});\n    }\n\n    public String get(String key) {\n        int index = hash(key);\n        for (String[] pair : buckets[index]) {\n            if (pair[0].equals(key)) {\n                return pair[1];  // нашли!\n            }\n        }\n        return null;  // не нашли\n    }\n}' },
        { type: 'heading', value: 'Трассировка: что происходит внутри' },
        { type: 'code', language: 'java', value: '// Допустим, "cat" и "act" оба дают hash=2\n\n// put("cat", "кот")\n// → hash("cat") = 2\n// → buckets[2] пуст\n// → buckets[2] = [("cat","кот")]\n\n// put("act", "акт")\n// → hash("act") = 2  (коллизия!)\n// → buckets[2] не пуст, проверяем "cat" != "act"\n// → buckets[2] = [("cat","кот"), ("act","акт")]\n\n// get("act")\n// → hash("act") = 2\n// → перебираем buckets[2]:\n//   "cat" == "act"? Нет\n//   "act" == "act"? Да! Возвращаем "акт"\n\nChainingHashMap map = new ChainingHashMap();\nmap.put("cat", "кот");\nmap.put("act", "акт");\nSystem.out.println(map.get("act"));  // акт\nSystem.out.println(map.get("cat"));  // кот' },
        { type: 'heading', value: 'Сложность метода цепочек' },
        { type: 'list', items: [
          'Лучший случай O(1): хеш уникален, цепочки длиной 1',
          'Средний случай O(1+α): α = n/m — коэффициент загрузки',
          'Худший случай O(n): все ключи в одной цепочке (очень плохая хеш-функция)',
          'Память: O(n) для данных + overhead списков',
          'Java\'s HashMap использует именно метод цепочек (с деревьями при длинных цепочках)'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Открытая адресация (Open Addressing)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Открытая адресация — второй способ разрешения коллизий. Все данные хранятся прямо в массиве (без дополнительных списков). При коллизии ищем следующую свободную ячейку по заданному правилу (пробированию).' },
        { type: 'tip', value: 'Как в кинотеатре: твоё место занято — ты ищёшь следующее свободное. Линейное пробирование — просто смотришь вперёд по одному месту. Квадратичное — прыгаешь на 1, 4, 9, 16 мест вперёд.' },
        { type: 'heading', value: 'Линейное пробирование (Linear Probing)' },
        { type: 'code', language: 'java', value: 'class LinearProbingHashMap {\n    private static final int CAPACITY = 10;\n    private String[] keys   = new String[CAPACITY];\n    private String[] values = new String[CAPACITY];\n\n    private int hash(String key) {\n        return Math.abs(key.hashCode()) % CAPACITY;\n    }\n\n    public void put(String key, String value) {\n        int index = hash(key);\n        // Ищем свободную ячейку или ту же самую (обновление)\n        while (keys[index] != null && !keys[index].equals(key)) {\n            index = (index + 1) % CAPACITY;  // следующая ячейка (циклически)\n        }\n        keys[index]   = key;\n        values[index] = value;\n    }\n\n    public String get(String key) {\n        int index = hash(key);\n        while (keys[index] != null) {\n            if (keys[index].equals(key)) {\n                return values[index];  // нашли!\n            }\n            index = (index + 1) % CAPACITY;  // смотрим дальше\n        }\n        return null;  // пустая ячейка — ключа нет\n    }\n}' },
        { type: 'heading', value: 'Трассировка линейного пробирования' },
        { type: 'code', language: 'java', value: '// Размер массива = 5\n// Допустим: hash("cat")=2, hash("act")=2, hash("tca")=2\n\n// put("cat", "кот")\n// index=2, keys[2]==null → ставим сюда\n// Массив: [null, null, "cat", null, null]\n\n// put("act", "акт")\n// index=2, keys[2]="cat" (коллизия, "cat"!="act")\n// index=(2+1)%5=3, keys[3]==null → ставим сюда\n// Массив: [null, null, "cat", "act", null]\n\n// put("tca", "тка")\n// index=2 → "cat" занято\n// index=3 → "act" занято\n// index=4 → null → ставим сюда\n// Массив: [null, null, "cat", "act", "tca"]\n\n// get("act")\n// index=2 → "cat" != "act" → идём дальше\n// index=3 → "act" == "act" → возвращаем "акт"' },
        { type: 'warning', value: 'Проблема линейного пробирования — "кластеризация". Занятые ячейки группируются в длинные блоки, и пробирование замедляется. Квадратичное пробирование и двойное хеширование решают это частично.' }
      ]
    },
    {
      id: 6,
      title: 'Реализация простой HashMap в Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Соберём полноценную простую хеш-таблицу на Java — с методом цепочек, поддержкой обновления, удаления и вывода содержимого.' },
        { type: 'heading', value: 'Полная реализация SimpleHashMap' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\n\npublic class SimpleHashMap<K, V> {\n    private static final int CAPACITY = 16;\n    private LinkedList<Entry<K, V>>[] table;\n    private int size;\n\n    static class Entry<K, V> {\n        K key;\n        V value;\n        Entry(K key, V value) {\n            this.key   = key;\n            this.value = value;\n        }\n    }\n\n    @SuppressWarnings("unchecked")\n    public SimpleHashMap() {\n        table = new LinkedList[CAPACITY];\n        for (int i = 0; i < CAPACITY; i++) {\n            table[i] = new LinkedList<>();\n        }\n    }\n\n    private int getBucket(K key) {\n        return Math.abs(key.hashCode()) % CAPACITY;\n    }\n\n    // Добавление / обновление — O(1) средний\n    public void put(K key, V value) {\n        int idx = getBucket(key);\n        for (Entry<K, V> e : table[idx]) {\n            if (e.key.equals(key)) {\n                e.value = value;  // обновляем существующий\n                return;\n            }\n        }\n        table[idx].add(new Entry<>(key, value));\n        size++;\n    }\n\n    // Получение — O(1) средний\n    public V get(K key) {\n        int idx = getBucket(key);\n        for (Entry<K, V> e : table[idx]) {\n            if (e.key.equals(key)) return e.value;\n        }\n        return null;\n    }\n\n    // Удаление — O(1) средний\n    public boolean remove(K key) {\n        int idx = getBucket(key);\n        Entry<K, V> toRemove = null;\n        for (Entry<K, V> e : table[idx]) {\n            if (e.key.equals(key)) { toRemove = e; break; }\n        }\n        if (toRemove != null) { table[idx].remove(toRemove); size--; return true; }\n        return false;\n    }\n\n    public int size() { return size; }\n\n    public boolean containsKey(K key) { return get(key) != null; }\n}' },
        { type: 'heading', value: 'Использование SimpleHashMap' },
        { type: 'code', language: 'java', value: 'SimpleHashMap<String, Integer> scores = new SimpleHashMap<>();\n\nscores.put("Алибек", 95);\nscores.put("Дана", 88);\nscores.put("Нурлан", 72);\nscores.put("Дана", 90);  // обновление — Дана теперь 90\n\nSystem.out.println("Оценка Даны: " + scores.get("Дана"));    // 90\nSystem.out.println("Оценка Алибека: " + scores.get("Алибек")); // 95\nSystem.out.println("Всего записей: " + scores.size());          // 3\n\nscores.remove("Нурлан");\nSystem.out.println("После удаления: " + scores.size());        // 2\nSystem.out.println("Нурлан есть? " + scores.containsKey("Нурлан")); // false' },
        { type: 'note', value: 'Это учебная реализация. В реальных проектах используй java.util.HashMap — она оптимизирована, поддерживает дженерики, итераторы и автоматическое расширение.' }
      ]
    },
    {
      id: 7,
      title: 'Коэффициент загрузки и рехеширование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чем больше данных в хеш-таблице, тем длиннее цепочки и тем медленнее работа. Чтобы не допустить деградации, хеш-таблица следит за коэффициентом загрузки (load factor) и расширяется при необходимости.' },
        { type: 'heading', value: 'Коэффициент загрузки (Load Factor)' },
        { type: 'code', language: 'java', value: '// Load Factor α = n / m\n// n = количество элементов\n// m = размер массива (количество корзин)\n\n// Пример:\n// 8 элементов в таблице размером 16\n// α = 8/16 = 0.5 (50%) — хорошо!\n\n// 15 элементов в таблице размером 16\n// α = 15/16 ≈ 0.94 (94%) — плохо, много коллизий!\n\n// В Java\'s HashMap:\n// По умолчанию: начальная ёмкость = 16, loadFactor = 0.75\n// Рехеширование происходит когда n > 16 * 0.75 = 12 элементов\n\nimport java.util.HashMap;\nHashMap<String, Integer> map = new HashMap<>(16, 0.75f);\n//                                            ^    ^\n//                              начальная       порог\n//                              ёмкость         загрузки' },
        { type: 'heading', value: 'Рехеширование (Rehashing)' },
        { type: 'code', language: 'java', value: '// Когда загрузка превышает порог:\n// 1) Создаём новый массив в 2 раза больше\n// 2) Заново хешируем ВСЕ элементы (!) в новый массив\n// 3) Старый массив удаляется\n\n// Это O(n) операция, но происходит редко!\n// Амортизированная стоимость вставки остаётся O(1)\n\npublic void rehash() {\n    LinkedList<Entry<K,V>>[] oldTable = table;\n    int newCapacity = CAPACITY * 2;           // удваиваем\n    table = new LinkedList[newCapacity];\n    for (int i = 0; i < newCapacity; i++) {\n        table[i] = new LinkedList<>();\n    }\n    size = 0;\n    // Перекладываем все старые элементы\n    for (LinkedList<Entry<K,V>> bucket : oldTable) {\n        for (Entry<K,V> entry : bucket) {\n            put(entry.key, entry.value);  // снова вставляем\n        }\n    }\n}\n\n// Пример: было 16 корзин, "cat"→hash%16=5\n// После рехеша: 32 корзины, "cat"→hash%32=21 (другая позиция!)' },
        { type: 'heading', value: 'Итоговая сложность HashMap' },
        { type: 'list', items: [
          'put(key, value): O(1) средний, O(n) в худшем случае',
          'get(key): O(1) средний, O(n) в худшем случае',
          'remove(key): O(1) средний, O(n) в худшем случае',
          'containsKey(key): O(1) средний',
          'Память: O(n) — хранятся все n элементов',
          'Рехеширование: O(n) — но происходит редко (амортизированно O(1))',
          'Худший случай достигается только при очень плохой хеш-функции'
        ]}
      ]
    },
    {
      id: 8,
      title: 'Практика: Подсчёт частоты слов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая подсчитывает, сколько раз каждое слово встречается в тексте. Используй HashMap для хранения пар "слово → количество". Выведи все слова и их частоту.',
      requirements: [
        'Текст для анализа: String text = "яблоко банан яблоко вишня банан яблоко"',
        'Разбей текст на слова через split(" ")',
        'Используй HashMap<String, Integer> для подсчёта',
        'Для каждого слова: если уже есть — увеличь счётчик, если нет — добавь с 1',
        'Выведи каждое слово и количество его вхождений'
      ],
      expectedOutput: 'яблоко: 3\nбанан: 2\nвишня: 1',
      hint: 'Для удобного обновления используй: map.put(word, map.getOrDefault(word, 0) + 1). Метод getOrDefault вернёт 0, если слова ещё нет в таблице.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        String text = "яблоко банан яблоко вишня банан яблоко";\n        String[] words = text.split(" ");\n\n        HashMap<String, Integer> freq = new HashMap<>();\n\n        for (String word : words) {\n            freq.put(word, freq.getOrDefault(word, 0) + 1);\n        }\n\n        for (Map.Entry<String, Integer> entry : freq.entrySet()) {\n            System.out.println(entry.getKey() + ": " + entry.getValue());\n        }\n    }\n}',
      explanation: 'getOrDefault(word, 0) — это "возьми значение для слова, а если его нет — дай 0". Затем добавляем 1 и сохраняем обратно. Итерация через entrySet() позволяет пройти по всем парам ключ-значение. Вся логика работает за O(n) — каждое слово обрабатывается один раз за O(1).'
    }
  ]
}
