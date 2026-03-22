export default {
  id: 5,
  title: 'GitHub Actions: матрицы и кеш',
  description: 'Strategy matrix для тестирования на нескольких версиях, кеширование зависимостей для ускорения пайплайнов.',
  lessons: [
    {
      id: 1,
      title: 'Strategy matrix — параллельное тестирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Matrix strategy запускает job несколько раз с разными параметрами. Идеально для тестирования на нескольких версиях Python/Node/OS.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    runs-on: ${{ matrix.os }}\n    strategy:\n      matrix:\n        os: [ubuntu-latest, windows-latest]\n        python-version: ["3.10", "3.11", "3.12"]\n        # Создаётся 2 * 3 = 6 параллельных jobs\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n      - run: pip install -r requirements.txt\n      - run: pytest\n        env:\n          OS: ${{ matrix.os }}\n          PYTHON: ${{ matrix.python-version }}' },
        { type: 'tip', value: 'fail-fast: false — продолжать другие matrix jobs даже если один упал. Полезно когда хочешь увидеть результаты на всех версиях, а не останавливаться при первой ошибке.' }
      ]
    },
    {
      id: 2,
      title: 'Matrix с include и exclude',
      type: 'theory',
      content: [
        { type: 'text', value: 'include добавляет дополнительные комбинации или параметры к существующим. exclude убирает конкретные комбинации.' },
        { type: 'code', language: 'yaml', value: 'strategy:\n  matrix:\n    python-version: ["3.10", "3.11", "3.12"]\n    django-version: ["4.2", "5.0"]\n    exclude:\n      # Django 5.0 не поддерживает Python 3.10\n      - python-version: "3.10"\n        django-version: "5.0"\n    include:\n      # Добавить специальную комбинацию\n      - python-version: "3.12"\n        django-version: "5.0"\n        experimental: true  # дополнительный параметр\n\n    fail-fast: false  # не останавливать при первой ошибке\n    max-parallel: 4   # максимум 4 параллельных jobs' }
      ]
    },
    {
      id: 3,
      title: 'Кеширование зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый runner — чистая VM. Установка зависимостей занимает минуты. actions/cache сохраняет их между запусками.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n\n      # Кеш pip пакетов\n      - uses: actions/cache@v4\n        with:\n          path: ~/.cache/pip\n          key: ${{ runner.os }}-pip-${{ hashFiles("requirements.txt") }}\n          restore-keys: |\n            ${{ runner.os }}-pip-\n\n      - run: pip install -r requirements.txt\n      - run: pytest' },
        { type: 'tip', value: 'hashFiles("requirements.txt") — ключ кеша меняется когда изменился requirements.txt. restore-keys — fallback: если точного совпадения нет, используем кеш с похожим ключом.' }
      ]
    },
    {
      id: 4,
      title: 'Кеширование в setup actions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Современные setup actions (setup-python, setup-node) имеют встроенное кеширование через параметр cache.' },
        { type: 'code', language: 'yaml', value: 'steps:\n  # Python с встроенным кешем pip\n  - uses: actions/setup-python@v5\n    with:\n      python-version: "3.12"\n      cache: "pip"  # кешировать pip автоматически\n\n  # Node с встроенным кешем npm\n  - uses: actions/setup-node@v4\n    with:\n      node-version: "20"\n      cache: "npm"  # или "yarn", "pnpm"\n\n  # Docker layer кеширование\n  - uses: docker/setup-buildx-action@v3\n  - uses: actions/cache@v4\n    with:\n      path: /tmp/.buildx-cache\n      key: ${{ runner.os }}-buildx-${{ github.sha }}\n      restore-keys: ${{ runner.os }}-buildx-' },
        { type: 'note', value: 'Кеш может ускорить пайплайн с 5 минут до 1 минуты. Но кеш не всегда попадает — при первом запуске после изменения зависимостей кеш будет промах.' }
      ]
    },
    {
      id: 5,
      title: 'Outputs из matrix jobs',
      type: 'theory',
      content: [
        { type: 'text', value: 'Получить outputs от всех matrix jobs непросто. Используй upload-artifact для хранения результатов каждой комбинации.' },
        { type: 'code', language: 'yaml', value: 'jobs:\n  test:\n    strategy:\n      matrix:\n        python-version: ["3.10", "3.11", "3.12"]\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n          cache: "pip"\n      - run: pytest --junitxml=results-${{ matrix.python-version }}.xml\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: results-py${{ matrix.python-version }}\n          path: results-${{ matrix.python-version }}.xml\n\n  report:\n    needs: test\n    runs-on: ubuntu-latest\n    if: always()\n    steps:\n      - uses: actions/download-artifact@v4\n        with:\n          pattern: results-py*\n          merge-multiple: true\n      - run: ls *.xml' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Matrix тестирование Django',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай workflow с matrix тестированием Django на нескольких версиях Python и Django.',
      requirements: [
        'Matrix: python-version ["3.11", "3.12"] x django-version ["4.2", "5.0"]',
        'Исключить комбинацию python 3.11 + django 5.0 (не поддерживается)',
        'Кеширование pip через setup-python cache: "pip"',
        'Результаты тестов загружаются как артефакт (junitxml)',
        'fail-fast: false чтобы видеть все результаты'
      ],
      expectedOutput: 'Запускается 3 параллельных jobs (4 - 1 excluded):\n- py3.11 + django4.2\n- py3.12 + django4.2\n- py3.12 + django5.0',
      hint: 'pip install django==${{ matrix.django-version }} для установки конкретной версии Django.',
      solution: '# .github/workflows/test-matrix.yml\nname: Matrix Tests\n\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        python-version: ["3.11", "3.12"]\n        django-version: ["4.2", "5.0"]\n        exclude:\n          - python-version: "3.11"\n            django-version: "5.0"\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n          cache: "pip"\n\n      - name: Установка зависимостей\n        run: |\n          pip install -r requirements.txt\n          pip install "django==${{ matrix.django-version }}.*"\n\n      - name: Запуск тестов\n        run: pytest --junitxml=results-py${{ matrix.python-version }}-dj${{ matrix.django-version }}.xml\n\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: results-py${{ matrix.python-version }}-dj${{ matrix.django-version }}\n          path: "*.xml"',
      explanation: 'exclude убирает несовместимые комбинации из матрицы. fail-fast: false позволяет увидеть результаты на всех версиях. Уникальное имя артефакта включает версии чтобы артефакты не перезаписывали друг друга.'
    }
  ]
}
