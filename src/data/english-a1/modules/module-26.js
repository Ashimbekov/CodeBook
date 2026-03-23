export default {
  id: 26,
  title: 'Чтение кода: комментарии и naming',
  description: 'Понимание комментариев в коде, naming conventions, code style',
  lessons: [
    {
      id: 1,
      title: 'Комментарии в коде',
      type: 'theory',
      content: [
        { type: 'text', value: 'Комментарии в коде пишутся на английском в большинстве международных проектов. Нужно уметь их читать и писать.' },
        { type: 'code', language: 'text', value: '// Типы комментариев:\n\n// Single line comment - однострочный\n// This function calculates the total price\n\n/* Multi-line comment - многострочный\n   Used for longer explanations\n   or temporary code disabling */\n\n/** JSDoc/JavaDoc comment - документация\n * @param {string} name - The user name\n * @param {number} age - The user age\n * @returns {object} User object\n */\n\n# Python comment - однострочный в Python\n# TODO: refactor this function\n# FIXME: this breaks on null input' },
        { type: 'code', language: 'text', value: 'Маркеры в комментариях:\nTODO   - нужно сделать\nFIXME  - нужно исправить\nHACK   - временное решение (некрасивое)\nNOTE   - важное замечание\nWARNING- предупреждение\nDEPRECATED - устарело, не использовать\nXXX    - срочно исправить (серьёзная проблема)\n\nПримеры:\n// TODO: add input validation\n// FIXME: this breaks with large arrays\n// NOTE: this is a temporary solution\n// DEPRECATED: use getUserById() instead' }
      ]
    },
    {
      id: 2,
      title: 'Написание хороших комментариев',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший комментарий объясняет ПОЧЕМУ, а не ЧТО. Код сам показывает что делается, комментарий объясняет зачем.' },
        { type: 'code', language: 'text', value: 'Плохие комментарии (объясняют "что"):\n// Add 1 to counter\ncounter++;\n\n// Check if user is admin\nif (user.role === "admin") {\n\n// Loop through all items\nfor (const item of items) {\n\nХорошие комментарии (объясняют "почему"):\n// Increment counter because API uses 1-based indexing\ncounter++;\n\n// Admin users can see all data, including private\nif (user.role === "admin") {\n\n// Process in batches to avoid memory overflow\nfor (const item of items) {' },
        { type: 'code', language: 'text', value: 'Шаблоны хороших комментариев:\n// This is necessary because...\n// We use X instead of Y because Y has a bug with...\n// See issue #123 for context\n// Based on the spec: [link]\n// Edge case: when input is null, we return empty array\n// Performance: this O(n log n) approach is faster than...\n// Warning: changing this order breaks the auth flow\n// Temporary: remove this when API v2 is ready' }
      ]
    },
    {
      id: 3,
      title: 'Naming conventions — соглашения об именовании',
      type: 'theory',
      content: [
        { type: 'text', value: 'Naming conventions — правила именования переменных, функций, файлов. Разные языки и проекты используют разные конвенции.' },
        { type: 'code', language: 'text', value: 'Основные стили именования:\ncamelCase     - myVariable, getUserName\n  (используется в JS, Java, Swift для переменных/функций)\n\nPascalCase    - MyClass, UserService\n  (классы в большинстве языков)\n\nsnake_case    - my_variable, get_user_name\n  (Python, Ruby, SQL)\n\nkebab-case    - my-component, user-profile\n  (CSS классы, URL, HTML атрибуты)\n\nSCREAMING_SNAKE_CASE - MY_CONSTANT, MAX_SIZE\n  (константы в большинстве языков)' },
        { type: 'code', language: 'text', value: 'Правила хорошего именования:\n1. Используйте описательные имена:\n   bad:  const d = 7;\n   good: const daysInWeek = 7;\n\n2. Глаголы для функций:\n   getUserById(), calculateTotal(), sendEmail()\n\n3. Существительные для переменных:\n   userList, productCount, errorMessage\n\n4. is/has для булевых:\n   isActive, hasPermission, isLoading\n\n5. Избегайте аббревиатур:\n   bad:  const usrNm = "John";\n   good: const userName = "John";' }
      ]
    },
    {
      id: 4,
      title: 'Чтение функций и методов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение читать код на английском — это умение понимать имена функций, переменных и логику по названиям.' },
        { type: 'code', language: 'text', value: 'Глаголы в названиях функций:\nget     - получить:  getUser(), getData()\nset     - установить: setName(), setConfig()\ncreate  - создать:   createUser(), createOrder()\nupdate  - обновить:  updateProfile(), updateStatus()\ndelete/remove - удалить: deleteUser(), removeItem()\nfetch   - получить с сервера: fetchData(), fetchUsers()\nsend    - отправить: sendEmail(), sendNotification()\ncheck   - проверить: checkPermission(), checkStatus()\nvalidate- проверить: validateInput(), validateEmail()\nparse   - разобрать: parseJSON(), parseDate()\nformat  - форматировать: formatDate(), formatPrice()\ncalculate- вычислить: calculateTotal(), calculateAge()' },
        { type: 'code', language: 'text', value: 'Читаем код как предложение:\ngetUserByEmail("test@test.com")\n→ "Get user by email"\n→ Получи пользователя по email\n\nisValidPassword(password)\n→ "Is valid password?"\n→ Является ли пароль валидным?\n\nsendNotificationToAllUsers(message)\n→ "Send notification to all users"\n→ Отправь уведомление всем пользователям\n\ncalculateDiscountForPremiumUsers(price)\n→ "Calculate discount for premium users"\n→ Вычисли скидку для премиум-пользователей' }
      ]
    },
    {
      id: 5,
      title: 'Документационные комментарии (JSDoc)',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSDoc и подобные системы документации используют стандартные теги. Нужно уметь читать и писать такую документацию.' },
        { type: 'code', language: 'text', value: '/**\n * Sends an email to the specified user.\n * Отправляет email указанному пользователю.\n *\n * @param {string} to - Recipient email address\n * @param {string} subject - Email subject line\n * @param {string} body - Email body content\n * @returns {Promise<boolean>} True if sent successfully\n * @throws {Error} If email service is unavailable\n * @example\n * await sendEmail("user@example.com", "Hello", "Hi there!");\n */' },
        { type: 'code', language: 'text', value: 'JSDoc теги и их значение:\n@param      - параметр функции\n@returns    - что возвращает\n@throws     - какое исключение может выбросить\n@example    - пример использования\n@deprecated - устарело\n@see        - смотри также\n@since      - с какой версии\n@type       - тип переменной\n@typedef    - определение типа\n@property   - свойство объекта' }
      ]
    },
    {
      id: 6,
      title: 'Git commit messages',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сообщения коммитов — важный вид письма в IT. Они пишутся на английском и должны чётко описывать изменение.' },
        { type: 'code', language: 'text', value: 'Conventional Commits стандарт:\nfeat: add user authentication\nfix: resolve login timeout issue\ndocs: update API documentation\nstyle: format code with prettier\nrefactor: simplify user service logic\ntest: add unit tests for auth module\nchore: update dependencies\nperf: optimize database queries\nbuild: configure webpack\nci: add GitHub Actions workflow\n\nПолный формат:\nfeat(auth): add JWT token refresh\n\nImplement automatic token refresh to prevent\nsession expiry. Tokens now refresh 5 minutes\nbefore expiration.\n\nCloses #123' },
        { type: 'code', language: 'text', value: 'Правила хорошего commit message:\n1. Используй повелительное наклонение:\n   "add feature" (не "added" или "adding")\n\n2. Первая строка — не более 72 символов\n\n3. Объясни ПОЧЕМУ, не только ЧТО:\n   bad: "fix bug"\n   good: "fix null pointer exception in login flow"\n\n4. Ссылайся на задачи:\n   "Closes #42" или "Fixes #123"' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Комментарии и naming',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Что означает комментарий: "// TODO: add validation for empty input"',
          solution: 'Нужно сделать: добавить валидацию для пустого ввода',
          explanation: 'TODO = нужно сделать, add validation = добавить валидацию, empty input = пустой ввод.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Какой стиль именования используется для булевых переменных в JavaScript?',
          options: ['isActive, hasPermission', 'active, permission', 'ISACTIVE, HASPERMISSION', 'is_active, has_permission'],
          correct: 0,
          explanation: 'Булевые переменные в JS используют camelCase с префиксом is/has: isActive, hasPermission, isLoading.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Напишите commit message: "добавить аутентификацию пользователя"',
          solution: 'feat: add user authentication',
          explanation: 'По стандарту Conventional Commits: feat: (тип) + описание в повелительном наклонении (add, не added).'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите название функции: "calculateDiscountForPremiumUsers"',
          solution: 'вычислить скидку для премиум-пользователей',
          explanation: 'calculate = вычислить, Discount = скидка, For = для, Premium = премиум, Users = пользователей.'
        }
      ]
    }
  ]
}
