export default {
  id: 19,
  title: 'Trie',
  description: 'Префиксное дерево (Trie): реализация, поиск слов, автодополнение.',
  lessons: [
    {
      id: 1,
      title: 'Trie: структура и реализация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое Trie?'
        },
        {
          type: 'text',
          value: 'Trie (prefix tree) — древовидная структура для хранения строк. Каждый узел представляет символ, путь от корня до узла — префикс. Операции insert, search, startsWith — O(m), где m — длина слова.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Реализация Trie\nclass TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) {\n        node.children[ch] = new TrieNode();\n      }\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n\n  search(word) {\n    const node = this._findNode(word);\n    return node !== null && node.isEnd;\n  }\n\n  startsWith(prefix) {\n    return this._findNode(prefix) !== null;\n  }\n\n  _findNode(str) {\n    let node = this.root;\n    for (const ch of str) {\n      if (!node.children[ch]) return null;\n      node = node.children[ch];\n    }\n    return node;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert("apple");\nconsole.log(trie.search("apple"));   // true\nconsole.log(trie.search("app"));     // false\nconsole.log(trie.startsWith("app")); // true'
        },
        {
          type: 'heading',
          value: 'Когда использовать Trie'
        },
        {
          type: 'list',
          value: [
            'Автодополнение (autocomplete)',
            'Проверка правописания (spell check)',
            'Поиск слов по префиксу',
            'Word Search II (поиск нескольких слов в матрице)',
            'IP routing (longest prefix match)'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Trie с дополнительными возможностями',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Trie с подстановкой и подсчётом'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Trie с поддержкой "." (любой символ)\n// LeetCode #211: Design Add and Search Words\nclass WordDictionary {\n  constructor() {\n    this.root = new TrieNode();\n  }\n\n  addWord(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n\n  search(word) {\n    return this._dfs(word, 0, this.root);\n  }\n\n  _dfs(word, idx, node) {\n    if (idx === word.length) return node.isEnd;\n\n    const ch = word[idx];\n    if (ch === ".") {\n      // Любой символ — пробуем все дочерние\n      for (const child of Object.values(node.children)) {\n        if (this._dfs(word, idx + 1, child)) return true;\n      }\n      return false;\n    } else {\n      if (!node.children[ch]) return false;\n      return this._dfs(word, idx + 1, node.children[ch]);\n    }\n  }\n}'
        },
        {
          type: 'note',
          value: 'Trie + DFS = мощная комбинация для задач типа Word Search II, где нужно найти все слова из словаря в матрице.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Implement Trie',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #208: реализуйте Trie (prefix tree) с операциями insert, search, startsWith.',
      requirements: [
        'Реализуйте класс Trie',
        'insert(word): вставить слово',
        'search(word): есть ли слово в trie',
        'startsWith(prefix): есть ли слово с данным префиксом'
      ],
      hint: 'Каждый узел — объект с children (HashMap символ → узел) и isEnd (конец слова).',
      expectedOutput: 'insert("apple"), search("apple")->true, search("app")->false, startsWith("app")->true, insert("app"), search("app")->true',
      solution: 'class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) {\n        node.children[ch] = new TrieNode();\n      }\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n\n  search(word) {\n    const node = this._traverse(word);\n    return node !== null && node.isEnd;\n  }\n\n  startsWith(prefix) {\n    return this._traverse(prefix) !== null;\n  }\n\n  _traverse(str) {\n    let node = this.root;\n    for (const ch of str) {\n      if (!node.children[ch]) return null;\n      node = node.children[ch];\n    }\n    return node;\n  }\n}\n\nconst trie = new Trie();\ntrie.insert("apple");\nconsole.log(trie.search("apple"));   // true\nconsole.log(trie.search("app"));     // false\nconsole.log(trie.startsWith("app")); // true\ntrie.insert("app");\nconsole.log(trie.search("app"));     // true',
      explanation: 'Trie — элегантная структура данных. Insert: идём по символам, создавая узлы при необходимости, помечаем конец. Search: идём по символам, возвращаем node.isEnd. StartsWith: идём по символам, возвращаем true если дошли до конца. Каждая операция O(m).'
    },
    {
      id: 4,
      title: 'Практика: Word Search II',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #212: найдите все слова из словаря в матрице букв.',
      requirements: [
        'Реализуйте функцию findWords(board, words)',
        'Найдите все слова из words, которые можно составить в board',
        'Используйте Trie + Backtracking',
        'Каждая клетка используется один раз для одного слова'
      ],
      hint: 'Постройте Trie из words. Для каждой клетки запустите DFS, следуя по Trie. Если достигли isEnd — нашли слово.',
      expectedOutput: 'findWords([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]) -> ["eat","oath"]',
      solution: 'function findWords(board, words) {\n  const root = new TrieNode();\n\n  // Строим Trie из слов\n  for (const word of words) {\n    let node = root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.word = word; // сохраняем слово в конце\n  }\n\n  const result = [];\n  const m = board.length, n = board[0].length;\n\n  function dfs(r, c, node) {\n    if (r < 0 || r >= m || c < 0 || c >= n) return;\n    const ch = board[r][c];\n    if (ch === "#" || !node.children[ch]) return;\n\n    node = node.children[ch];\n\n    if (node.word) {\n      result.push(node.word);\n      node.word = null; // избегаем дубликатов\n    }\n\n    board[r][c] = "#"; // пометка\n    dfs(r + 1, c, node);\n    dfs(r - 1, c, node);\n    dfs(r, c + 1, node);\n    dfs(r, c - 1, node);\n    board[r][c] = ch; // откат\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      dfs(r, c, root);\n    }\n  }\n\n  return result;\n}\n\nconst board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];\nconsole.log(findWords(board, ["oath","pea","eat","rain"])); // ["oath","eat"]',
      explanation: 'Trie + Backtracking: вместо поиска каждого слова отдельно (O(words * m*n*4^L)), строим Trie и ищем все слова одновременно. DFS следует по Trie — если в текущем узле нет ребёнка для символа, отсекаем ветку. Это значительно быстрее наивного подхода.'
    },
    {
      id: 5,
      title: 'Практика: Design Add and Search Words',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #211: реализуйте словарь с поддержкой поиска по шаблону (символ "." означает любую букву).',
      requirements: [
        'Реализуйте класс WordDictionary',
        'addWord(word): добавить слово',
        'search(word): найти слово, "." соответствует любой букве',
        'Например: search("b.d") найдёт "bad", "bed", "bid"'
      ],
      hint: 'При встрече "." в search — рекурсивно пробуем все дочерние узлы (DFS по Trie).',
      expectedOutput: 'addWord("bad"), addWord("dad"), addWord("mad"), search("pad")->false, search("bad")->true, search(".ad")->true, search("b..")->true',
      solution: 'class WordDictionary {\n  constructor() {\n    this.root = {};\n  }\n\n  addWord(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node.isEnd = true;\n  }\n\n  search(word) {\n    return this._dfs(word, 0, this.root);\n  }\n\n  _dfs(word, idx, node) {\n    if (idx === word.length) return !!node.isEnd;\n\n    const ch = word[idx];\n\n    if (ch === ".") {\n      for (const key of Object.keys(node)) {\n        if (key === "isEnd") continue;\n        if (this._dfs(word, idx + 1, node[key])) return true;\n      }\n      return false;\n    }\n\n    if (!node[ch]) return false;\n    return this._dfs(word, idx + 1, node[ch]);\n  }\n}\n\nconst wd = new WordDictionary();\nwd.addWord("bad");\nwd.addWord("dad");\nwd.addWord("mad");\nconsole.log(wd.search("pad")); // false\nconsole.log(wd.search("bad")); // true\nconsole.log(wd.search(".ad")); // true\nconsole.log(wd.search("b..")); // true',
      explanation: 'Модификация Trie: при "." пробуем все дочерние узлы рекурсивно. Для обычных символов — стандартный проход. addWord: O(m). search: O(m) в лучшем случае, O(26^m) в худшем (все точки). На практике отсечение делает это быстрее.'
    },
    {
      id: 6,
      title: 'Практика: Longest Word in Dictionary',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #720: найдите самое длинное слово, которое можно построить посимвольно из словаря.',
      requirements: [
        'Реализуйте функцию longestWord(words)',
        'Слово можно построить, если все его префиксы есть в словаре',
        'Верните самое длинное такое слово',
        'При одинаковой длине — лексикографически меньшее'
      ],
      hint: 'Постройте Trie. Для каждого слова проверьте, все ли его префиксы помечены isEnd.',
      expectedOutput: 'longestWord(["w","wo","wor","worl","world"]) -> "world"\nlongestWord(["a","banana","app","appl","ap","apply","apple"]) -> "apple"',
      solution: 'function longestWord(words) {\n  const root = {};\n\n  // Строим Trie\n  for (const word of words) {\n    let node = root;\n    for (const ch of word) {\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node.isEnd = true;\n  }\n\n  let result = "";\n\n  for (const word of words) {\n    // Проверяем, все ли префиксы есть\n    let node = root;\n    let valid = true;\n    for (const ch of word) {\n      node = node[ch];\n      if (!node.isEnd) { valid = false; break; }\n    }\n\n    if (valid) {\n      if (word.length > result.length ||\n         (word.length === result.length && word < result)) {\n        result = word;\n      }\n    }\n  }\n\n  return result;\n}\n\nconsole.log(longestWord(["w","wo","wor","worl","world"])); // "world"\nconsole.log(longestWord(["a","banana","app","appl","ap","apply","apple"])); // "apple"',
      explanation: 'Строим Trie из всех слов. Для каждого слова проверяем: каждый его префикс (включая само слово) помечен isEnd в Trie. Если да и слово длиннее текущего результата (или лексикографически меньше при одинаковой длине) — обновляем. O(sum длин слов).'
    },
    {
      id: 7,
      title: 'Практика: Replace Words',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #648: замените слова в предложении их корневыми формами из словаря.',
      requirements: [
        'Реализуйте функцию replaceWords(dictionary, sentence)',
        'dictionary — массив корней слов',
        'Замените каждое слово в sentence его самым коротким корнем',
        'Если корня нет — оставьте слово как есть'
      ],
      hint: 'Постройте Trie из словаря. Для каждого слова ищите самый короткий префикс в Trie.',
      expectedOutput: 'replaceWords(["cat","bat","rat"], "the cattle was rattled by the battery") -> "the cat was rat by the bat"',
      solution: 'function replaceWords(dictionary, sentence) {\n  // Строим Trie\n  const root = {};\n  for (const word of dictionary) {\n    let node = root;\n    for (const ch of word) {\n      if (!node[ch]) node[ch] = {};\n      node = node[ch];\n    }\n    node.isEnd = true;\n  }\n\n  // Для каждого слова ищем кратчайший корень\n  function findRoot(word) {\n    let node = root;\n    let prefix = "";\n    for (const ch of word) {\n      if (!node[ch]) return word; // корня нет\n      prefix += ch;\n      node = node[ch];\n      if (node.isEnd) return prefix; // нашли корень\n    }\n    return word;\n  }\n\n  return sentence.split(" ").map(findRoot).join(" ");\n}\n\nconsole.log(replaceWords(\n  ["cat","bat","rat"],\n  "the cattle was rattled by the battery"\n)); // "the cat was rat by the bat"',
      explanation: 'Trie для поиска кратчайшего префикса: идём по символам слова по Trie. При первом isEnd — это самый короткий корень. Если ни один узел не isEnd или символа нет — корня нет, оставляем слово. O(n) время, где n — суммарная длина слов.'
    }
  ]
}
