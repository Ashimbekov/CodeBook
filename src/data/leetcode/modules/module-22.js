export default {
  id: 22,
  title: 'Design задачи',
  description: 'Задачи на проектирование структур данных: LRU Cache, Min Stack, итераторы.',
  lessons: [
    {
      id: 1,
      title: 'Design задачи на собеседованиях',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что проверяют Design задачи'
        },
        {
          type: 'text',
          value: 'Design задачи проверяют умение комбинировать структуры данных для достижения нужных характеристик. Ключевое: определить, какие операции нужны и какую сложность они должны иметь.'
        },
        {
          type: 'list',
          value: [
            'Определите API (какие методы нужны)',
            'Определите ограничения (какая сложность для каждого метода)',
            'Выберите подходящие структуры данных',
            'Продумайте edge cases',
            'Реализуйте чисто и модульно'
          ]
        },
        {
          type: 'heading',
          value: 'Популярные комбинации'
        },
        {
          type: 'list',
          value: [
            'HashMap + Doubly Linked List = LRU Cache (O(1) get/put)',
            'Stack + дополнительный стек = Min Stack (O(1) getMin)',
            'HashMap + Array = RandomizedSet (O(1) insert/delete/getRandom)',
            'Two Stacks = Queue (амортизированный O(1))',
            'HashMap + TreeMap = Time-based Key-Value Store'
          ]
        },
        {
          type: 'tip',
          value: 'На собеседовании объясните выбор структур данных и trade-offs. Покажите, что вы думаете о производительности.'
        }
      ]
    },
    {
      id: 2,
      title: 'Рандомизированные структуры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Insert Delete GetRandom O(1)'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// LeetCode #380: RandomizedSet\nclass RandomizedSet {\n  constructor() {\n    this.map = new Map();  // val → index in list\n    this.list = [];         // хранит значения\n  }\n\n  insert(val) {\n    if (this.map.has(val)) return false;\n    this.map.set(val, this.list.length);\n    this.list.push(val);\n    return true;\n  }\n\n  remove(val) {\n    if (!this.map.has(val)) return false;\n    const idx = this.map.get(val);\n    const last = this.list[this.list.length - 1];\n\n    // Свап с последним\n    this.list[idx] = last;\n    this.map.set(last, idx);\n\n    this.list.pop();\n    this.map.delete(val);\n    return true;\n  }\n\n  getRandom() {\n    const idx = Math.floor(Math.random() * this.list.length);\n    return this.list[idx];\n  }\n}'
        },
        {
          type: 'note',
          value: 'Трюк: для O(1) удаления из массива — свапаем удаляемый элемент с последним и делаем pop(). HashMap обеспечивает O(1) поиск индекса.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: LRU Cache',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #146: реализуйте LRU Cache с O(1) get и put.',
      requirements: [
        'Реализуйте класс LRUCache(capacity)',
        'get(key): вернуть значение или -1',
        'put(key, value): вставить/обновить, удалить наименее используемый при переполнении',
        'Обе операции O(1)'
      ],
      hint: 'HashMap (key → node) + Doubly Linked List (порядок использования). Последний использованный — в начале, самый старый — в конце.',
      expectedOutput: 'LRUCache(2): put(1,1), put(2,2), get(1)->1, put(3,3), get(2)->-1',
      solution: 'class LRUNode {\n  constructor(key, val) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.map = new Map();\n    this.head = new LRUNode(0, 0);\n    this.tail = new LRUNode(0, 0);\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n\n  _addFirst(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._remove(node);\n    this._addFirst(node);\n    return node.val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) {\n      this._remove(this.map.get(key));\n    }\n    const node = new LRUNode(key, value);\n    this._addFirst(node);\n    this.map.set(key, node);\n\n    if (this.map.size > this.cap) {\n      const lru = this.tail.prev;\n      this._remove(lru);\n      this.map.delete(lru.key);\n    }\n  }\n}',
      explanation: 'LRU Cache — одна из самых частых Design задач. HashMap даёт O(1) доступ по ключу. Doubly Linked List даёт O(1) перемещение (remove + addFirst) и O(1) удаление старейшего (tail.prev). Dummy head и tail упрощают код, устраняя проверки на null.'
    },
    {
      id: 4,
      title: 'Практика: Implement Queue using Stacks',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #232: реализуйте очередь с помощью двух стеков.',
      requirements: [
        'Реализуйте класс MyQueue',
        'push(x): добавить в конец',
        'pop(): удалить из начала',
        'peek(): посмотреть первый элемент',
        'empty(): пуст ли',
        'Все операции амортизированно O(1)'
      ],
      hint: 'Два стека: inStack для push, outStack для pop. Перекладываем из inStack в outStack, только когда outStack пуст.',
      expectedOutput: 'push(1), push(2), peek()->1, pop()->1, empty()->false',
      solution: 'class MyQueue {\n  constructor() {\n    this.inStack = [];  // для push\n    this.outStack = []; // для pop\n  }\n\n  push(x) {\n    this.inStack.push(x);\n  }\n\n  pop() {\n    this._transfer();\n    return this.outStack.pop();\n  }\n\n  peek() {\n    this._transfer();\n    return this.outStack[this.outStack.length - 1];\n  }\n\n  empty() {\n    return this.inStack.length === 0 && this.outStack.length === 0;\n  }\n\n  _transfer() {\n    if (this.outStack.length === 0) {\n      while (this.inStack.length) {\n        this.outStack.push(this.inStack.pop());\n      }\n    }\n  }\n}\n\nconst q = new MyQueue();\nq.push(1);\nq.push(2);\nconsole.log(q.peek()); // 1\nconsole.log(q.pop()); // 1\nconsole.log(q.empty()); // false',
      explanation: 'Два стека инвертируют порядок: LIFO + LIFO = FIFO. inStack хранит элементы в порядке push. При перекладывании в outStack порядок разворачивается. Перекладываем только когда outStack пуст — это даёт амортизированный O(1) для pop/peek.'
    },
    {
      id: 5,
      title: 'Практика: Design Twitter',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #355: упрощённый Twitter — подписки и новостная лента из 10 последних твитов.',
      requirements: [
        'postTweet(userId, tweetId): опубликовать твит',
        'getNewsFeed(userId): 10 последних твитов (свои + подписок)',
        'follow(followerId, followeeId): подписаться',
        'unfollow(followerId, followeeId): отписаться'
      ],
      hint: 'HashMap для подписок и твитов. Для getNewsFeed: merge K sorted lists (твиты каждого пользователя).',
      expectedOutput: 'postTweet(1,5), getNewsFeed(1)->[5], follow(1,2), postTweet(2,6), getNewsFeed(1)->[6,5]',
      solution: 'class Twitter {\n  constructor() {\n    this.tweets = new Map();    // userId → [{tweetId, timestamp}]\n    this.following = new Map(); // userId → Set of userIds\n    this.timestamp = 0;\n  }\n\n  postTweet(userId, tweetId) {\n    if (!this.tweets.has(userId)) this.tweets.set(userId, []);\n    this.tweets.get(userId).push({\n      id: tweetId,\n      time: this.timestamp++\n    });\n  }\n\n  getNewsFeed(userId) {\n    // Собираем все релевантные твиты\n    const allTweets = [];\n\n    // Свои твиты\n    const myTweets = this.tweets.get(userId) || [];\n    allTweets.push(...myTweets);\n\n    // Твиты подписок\n    const followees = this.following.get(userId) || new Set();\n    for (const followee of followees) {\n      const tweets = this.tweets.get(followee) || [];\n      allTweets.push(...tweets);\n    }\n\n    // Сортируем по времени (новые первые) и берём 10\n    allTweets.sort((a, b) => b.time - a.time);\n    return allTweets.slice(0, 10).map(t => t.id);\n  }\n\n  follow(followerId, followeeId) {\n    if (followerId === followeeId) return;\n    if (!this.following.has(followerId)) {\n      this.following.set(followerId, new Set());\n    }\n    this.following.get(followerId).add(followeeId);\n  }\n\n  unfollow(followerId, followeeId) {\n    const set = this.following.get(followerId);\n    if (set) set.delete(followeeId);\n  }\n}\n\nconst twitter = new Twitter();\ntwitter.postTweet(1, 5);\nconsole.log(twitter.getNewsFeed(1)); // [5]\ntwitter.follow(1, 2);\ntwitter.postTweet(2, 6);\nconsole.log(twitter.getNewsFeed(1)); // [6, 5]',
      explanation: 'Простая реализация: HashMap для хранения, сортировка для ленты. Оптимальный вариант: merge K sorted lists с min-heap для O(k log k) вместо O(n log n). На собеседовании начните с простого, затем обсудите оптимизации.'
    },
    {
      id: 6,
      title: 'Практика: Design HashMap',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #706: реализуйте HashMap без использования встроенных хеш-таблиц.',
      requirements: [
        'Реализуйте класс MyHashMap',
        'put(key, value): вставить/обновить',
        'get(key): получить значение или -1',
        'remove(key): удалить ключ',
        'Используйте массив + chaining (связные списки)'
      ],
      hint: 'Массив бакетов (размер = простое число). Хеш-функция: key % size. Коллизии решаются цепочками.',
      expectedOutput: 'put(1,1), put(2,2), get(1)->1, get(3)->-1, put(2,1), get(2)->1, remove(2), get(2)->-1',
      solution: 'class MyHashMap {\n  constructor() {\n    this.size = 1009; // простое число\n    this.buckets = new Array(this.size).fill(null).map(() => []);\n  }\n\n  _hash(key) {\n    return key % this.size;\n  }\n\n  put(key, value) {\n    const bucket = this.buckets[this._hash(key)];\n    for (const pair of bucket) {\n      if (pair[0] === key) {\n        pair[1] = value;\n        return;\n      }\n    }\n    bucket.push([key, value]);\n  }\n\n  get(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (const pair of bucket) {\n      if (pair[0] === key) return pair[1];\n    }\n    return -1;\n  }\n\n  remove(key) {\n    const bucket = this.buckets[this._hash(key)];\n    const idx = bucket.findIndex(pair => pair[0] === key);\n    if (idx !== -1) bucket.splice(idx, 1);\n  }\n}\n\nconst map = new MyHashMap();\nmap.put(1, 1);\nmap.put(2, 2);\nconsole.log(map.get(1)); // 1\nconsole.log(map.get(3)); // -1\nmap.put(2, 1);\nconsole.log(map.get(2)); // 1\nmap.remove(2);\nconsole.log(map.get(2)); // -1',
      explanation: 'Хеш-таблица с цепочками: массив бакетов + связные списки (массивы) для обработки коллизий. Размер 1009 (простое число) уменьшает коллизии. В среднем O(1) для всех операций, O(n/size) при коллизиях. На собеседовании обсудите: resizing, load factor, альтернативы (open addressing).'
    },
    {
      id: 7,
      title: 'Практика: Time Based Key-Value Store',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #981: key-value хранилище с поддержкой временных меток.',
      requirements: [
        'Реализуйте класс TimeMap',
        'set(key, value, timestamp): сохранить значение с временной меткой',
        'get(key, timestamp): получить значение с наибольшей меткой <= timestamp',
        'Timestamps строго возрастают для одного ключа'
      ],
      hint: 'HashMap: key → [{value, timestamp}]. get: бинарный поиск по timestamp в массиве.',
      expectedOutput: 'set("foo","bar",1), get("foo",1)->"bar", get("foo",3)->"bar", set("foo","bar2",4), get("foo",4)->"bar2", get("foo",5)->"bar2"',
      solution: 'class TimeMap {\n  constructor() {\n    this.map = new Map(); // key → [{value, timestamp}]\n  }\n\n  set(key, value, timestamp) {\n    if (!this.map.has(key)) this.map.set(key, []);\n    this.map.get(key).push({ value, timestamp });\n  }\n\n  get(key, timestamp) {\n    const entries = this.map.get(key);\n    if (!entries) return "";\n\n    // Бинарный поиск: наибольший timestamp <= target\n    let lo = 0, hi = entries.length - 1;\n    let result = "";\n\n    while (lo <= hi) {\n      const mid = (lo + hi) >> 1;\n      if (entries[mid].timestamp <= timestamp) {\n        result = entries[mid].value;\n        lo = mid + 1;\n      } else {\n        hi = mid - 1;\n      }\n    }\n\n    return result;\n  }\n}\n\nconst tm = new TimeMap();\ntm.set("foo", "bar", 1);\nconsole.log(tm.get("foo", 1)); // "bar"\nconsole.log(tm.get("foo", 3)); // "bar"\ntm.set("foo", "bar2", 4);\nconsole.log(tm.get("foo", 4)); // "bar2"\nconsole.log(tm.get("foo", 5)); // "bar2"',
      explanation: 'HashMap + Binary Search: для каждого ключа храним отсортированный массив (timestamp строго возрастают). get использует бинарный поиск для нахождения наибольшего timestamp <= target. set: O(1). get: O(log n). Это пример комбинации двух структур данных.'
    }
  ]
}
