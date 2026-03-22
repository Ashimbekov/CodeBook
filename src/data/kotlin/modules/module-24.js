export default {
  id: 24,
  title: 'Kotlin для Android: основы',
  description: 'Базовые концепции Android-разработки на Kotlin: Activity, Intent, View, ViewModel и основы Jetpack Compose.',
  lessons: [
    {
      id: 1,
      title: 'Структура Android-проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Android-проект на Kotlin состоит из нескольких ключевых частей. Понимание структуры — первый шаг к разработке.' },
        { type: 'list', value: 'app/src/main/kotlin — исходный код на Kotlin\napp/src/main/res — ресурсы (лейауты, строки, картинки)\napp/src/main/AndroidManifest.xml — конфигурация приложения\nbuild.gradle.kts — зависимости и настройки сборки' },
        { type: 'code', language: 'kotlin', value: '// AndroidManifest.xml объявляет главную Activity\n// build.gradle.kts подключает Kotlin и Compose\nplugins {\n    id("com.android.application")\n    id("org.jetbrains.kotlin.android")\n}' },
        { type: 'note', value: 'AndroidManifest.xml — это "паспорт" приложения. Он объявляет все экраны (Activity), разрешения и точку входа.' }
      ]
    },
    {
      id: 2,
      title: 'Activity и жизненный цикл',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Что такое Activity?' },
        { type: 'text', value: 'Activity — это один экран приложения. Пользователь видит ровно одну Activity в каждый момент времени. Каждая Activity проходит через определённые состояния.' },
        { type: 'list', value: 'onCreate() — Activity создаётся, инициализируем UI\nonStart() — Activity становится видимой\nonResume() — Activity в фокусе, пользователь взаимодействует\nonPause() — Activity теряет фокус (другое окно поверх)\nonStop() — Activity полностью скрыта\nonDestroy() — Activity уничтожается' },
        { type: 'code', language: 'kotlin', value: 'class MainActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n        // Здесь инициализируем UI\n    }\n    override fun onResume() {\n        super.onResume()\n        // Запускаем обновления, анимации\n    }\n}' },
        { type: 'tip', value: 'Запомните правило: всё что запускаете в onResume(), останавливайте в onPause(). Всё что создаёте в onCreate() — уничтожайте в onDestroy().' }
      ]
    },
    {
      id: 3,
      title: 'Intent — навигация между экранами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Intent — это "намерение" выполнить действие: открыть экран, позвонить, поделиться текстом. Явный Intent открывает конкретный класс Activity, неявный — запрашивает систему.' },
        { type: 'code', language: 'kotlin', value: '// Явный Intent: открываем конкретный экран\nval intent = Intent(this, DetailActivity::class.java)\nintent.putExtra("item_id", 42)\nstartActivity(intent)\n\n// В DetailActivity получаем данные:\nval itemId = intent.getIntExtra("item_id", 0)' },
        { type: 'code', language: 'kotlin', value: '// Неявный Intent: открываем браузер\nval url = Uri.parse("https://kotlinlang.org")\nval browserIntent = Intent(Intent.ACTION_VIEW, url)\nstartActivity(browserIntent)' },
        { type: 'note', value: 'putExtra/getExtra — способ передавать данные между Activity. Для больших объёмов данных используйте ViewModel или базу данных.' }
      ]
    },
    {
      id: 4,
      title: 'ViewModel и LiveData',
      type: 'theory',
      content: [
        { type: 'text', value: 'ViewModel — это хранилище данных экрана, которое переживает повороты устройства. LiveData — observable-данные, которые автоматически обновляют UI.' },
        { type: 'code', language: 'kotlin', value: 'class CounterViewModel : ViewModel() {\n    private val _count = MutableLiveData(0)\n    val count: LiveData<Int> = _count\n\n    fun increment() {\n        _count.value = (_count.value ?: 0) + 1\n    }\n}' },
        { type: 'code', language: 'kotlin', value: 'class MainActivity : AppCompatActivity() {\n    private val viewModel: CounterViewModel by viewModels()\n\n    override fun onCreate(savedInstanceState: Bundle?) {\n        super.onCreate(savedInstanceState)\n        viewModel.count.observe(this) { count ->\n            binding.textCount.text = count.toString()\n        }\n        binding.btnIncrement.setOnClickListener {\n            viewModel.increment()\n        }\n    }\n}' },
        { type: 'tip', value: 'ViewModel — это "мозг" экрана. Activity/Fragment — только "лицо". Разделяйте логику и отображение!' }
      ]
    },
    {
      id: 5,
      title: 'Введение в Jetpack Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jetpack Compose — современный декларативный UI-фреймворк для Android. Вместо XML вы описываете UI прямо в Kotlin-коде с помощью @Composable функций.' },
        { type: 'code', language: 'kotlin', value: '@Composable\nfun Greeting(name: String) {\n    Column(\n        modifier = Modifier.padding(16.dp)\n    ) {\n        Text(text = "Привет, $name!")\n        Button(onClick = { /* действие */ }) {\n            Text("Нажми меня")\n        }\n    }\n}' },
        { type: 'code', language: 'kotlin', value: '@Composable\nfun CounterScreen(viewModel: CounterViewModel = viewModel()) {\n    val count by viewModel.count.observeAsState(0)\n    Column {\n        Text("Счётчик: $count")\n        Button(onClick = { viewModel.increment() }) {\n            Text("+")\n        }\n    }\n}' },
        { type: 'note', value: 'В Compose нет XML! Всё — Kotlin-функции с аннотацией @Composable. Это резко сокращает код и делает UI более предсказуемым.' }
      ]
    },
    {
      id: 6,
      title: 'RecyclerView vs LazyColumn',
      type: 'theory',
      content: [
        { type: 'text', value: 'RecyclerView — классический способ показа списков в Android с XML. LazyColumn — его Compose-аналог, значительно проще в использовании.' },
        { type: 'code', language: 'kotlin', value: '// LazyColumn в Compose\n@Composable\nfun ItemList(items: List<String>) {\n    LazyColumn {\n        items(items) { item ->\n            Card(\n                modifier = Modifier\n                    .fillMaxWidth()\n                    .padding(8.dp)\n            ) {\n                Text(\n                    text = item,\n                    modifier = Modifier.padding(16.dp)\n                )\n            }\n        }\n    }\n}' },
        { type: 'tip', value: 'LazyColumn рендерит только видимые элементы — как RecyclerView. Для 10 000 элементов производительность будет хорошей.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: простой счётчик на Compose',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите Composable функцию CounterApp с кнопками "+" и "-" и отображением текущего значения.',
      requirements: [
        'Используйте remember { mutableStateOf(0) } для хранения состояния',
        'Кнопка "+" увеличивает счётчик',
        'Кнопка "-" уменьшает счётчик (не ниже 0)',
        'Текст показывает текущее значение'
      ],
      expectedOutput: 'Composable функция с корректным управлением состоянием',
      hint: 'remember позволяет хранить состояние внутри Composable. mutableStateOf создаёт наблюдаемое состояние.',
      solution: '@Composable\nfun CounterApp() {\n    var count by remember { mutableStateOf(0) }\n    Column(\n        horizontalAlignment = Alignment.CenterHorizontally,\n        modifier = Modifier.padding(16.dp)\n    ) {\n        Text(text = "Счётчик: $count", style = MaterialTheme.typography.h4)\n        Row {\n            Button(onClick = { if (count > 0) count-- }) { Text("-") }\n            Spacer(modifier = Modifier.width(16.dp))\n            Button(onClick = { count++ }) { Text("+") }\n        }\n    }\n}',
      explanation: 'remember сохраняет состояние между рекомпозициями. by делегирует getValue/setValue, позволяя писать count вместо count.value.'
    }
  ]
}
