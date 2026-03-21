export default {
  id: 48,
  title: 'Основы Maven и Gradle',
  description: 'Изучим системы сборки проектов Maven и Gradle — как управлять зависимостями, собирать проект и автоматизировать рутинные задачи',
  lessons: [
    {
      id: 1, title: 'Что такое системы сборки?', type: 'theory',
      content: [
        { type: 'text', value: 'Система сборки (build tool) — это инструмент, который автоматизирует процесс превращения исходного кода в готовое приложение. Она управляет зависимостями (библиотеками), компилирует код, запускает тесты и создаёт готовый JAR/WAR файл.' },
        { type: 'tip', value: 'Представь кухню. Тебе нужно приготовить обед: купить продукты (скачать библиотеки), порезать (скомпилировать), сварить (собрать), проверить на вкус (тесты), разложить по тарелкам (упаковать). Без системы сборки ты делаешь всё вручную. Maven и Gradle — это кухонный комбайн, который делает всё автоматически по твоему рецепту.' },
        { type: 'heading', value: 'Что умеют Maven и Gradle?' },
        { type: 'list', items: [
          'Загружают библиотеки из интернета (Maven Central, JCenter)',
          'Управляют версиями зависимостей',
          'Компилируют Java-код',
          'Запускают тесты автоматически',
          'Упаковывают приложение в JAR или WAR файл',
          'Деплоят на сервер',
          'Интегрируются с CI/CD системами (Jenkins, GitHub Actions)'
        ]},
        { type: 'heading', value: 'Maven vs Gradle' },
        { type: 'code', language: 'java', value: '// Maven: конфигурация в XML (pom.xml)\n// + Стандартизирован, огромное сообщество\n// + Хорошо документирован\n// - Многословный XML синтаксис\n// - Медленнее Gradle\n\n// Gradle: конфигурация в Groovy или Kotlin (build.gradle)\n// + Более краткий синтаксис\n// + Быстрее (incremental builds, build cache)\n// + Более гибкий\n// - Сложнее отлаживать\n// - Чуть больше кривая обучения' },
        { type: 'note', value: 'В мире Java: Maven традиционно используется в enterprise-проектах, Gradle — в Android-разработке (официальный инструмент Android Studio) и современных проектах. Знать оба — плюс в резюме.' }
      ]
    },
    {
      id: 2, title: 'Maven: структура и pom.xml', type: 'theory',
      content: [
        { type: 'text', value: 'Maven использует файл pom.xml (Project Object Model) для описания проекта. Это XML-файл в корне проекта, который описывает всё о проекте: имя, версию, зависимости, плагины.' },
        { type: 'heading', value: 'Стандартная структура Maven-проекта' },
        { type: 'code', language: 'java', value: 'myproject/\n├── pom.xml              ← главный файл конфигурации\n├── src/\n│   ├── main/\n│   │   ├── java/        ← исходный код\n│   │   │   └── com/example/\n│   │   │       └── Main.java\n│   │   └── resources/   ← конфиги, файлы\n│   └── test/\n│       └── java/        ← тесты\n│           └── com/example/\n│               └── MainTest.java\n└── target/              ← скомпилированный код (генерируется)' },
        { type: 'heading', value: 'Минимальный pom.xml' },
        { type: 'code', language: 'xml', value: '<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0\n                             http://maven.apache.org/xsd/maven-4.0.0.xsd">\n\n    <modelVersion>4.0.0</modelVersion>\n\n    <!-- Идентификация проекта -->\n    <groupId>com.example</groupId>      <!-- группа/организация -->\n    <artifactId>my-app</artifactId>     <!-- имя приложения -->\n    <version>1.0.0</version>            <!-- версия -->\n    <packaging>jar</packaging>          <!-- тип упаковки -->\n\n    <!-- Настройки компилятора -->\n    <properties>\n        <maven.compiler.source>17</maven.compiler.source>\n        <maven.compiler.target>17</maven.compiler.target>\n        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>\n    </properties>\n\n    <!-- Зависимости (библиотеки) -->\n    <dependencies>\n        <!-- Пример: Jackson -->\n        <dependency>\n            <groupId>com.fasterxml.jackson.core</groupId>\n            <artifactId>jackson-databind</artifactId>\n            <version>2.15.2</version>\n        </dependency>\n    </dependencies>\n\n</project>' },
        { type: 'tip', value: 'Координаты зависимости: groupId + artifactId + version. Найти их можно на mvnrepository.com — ищи нужную библиотеку и копируй готовый XML-блок в свой pom.xml.' }
      ]
    },
    {
      id: 3, title: 'Maven: управление зависимостями', type: 'theory',
      content: [
        { type: 'text', value: 'Одна из главных задач Maven — управление зависимостями. Ты указываешь какие библиотеки нужны, и Maven автоматически скачивает их (и их зависимости!) в локальный репозиторий.' },
        { type: 'heading', value: 'Области видимости (scope) зависимостей' },
        { type: 'code', language: 'xml', value: '<dependencies>\n    <!-- compile (по умолчанию): нужна при компиляции и в рантайме -->\n    <dependency>\n        <groupId>com.fasterxml.jackson.core</groupId>\n        <artifactId>jackson-databind</artifactId>\n        <version>2.15.2</version>\n        <!-- <scope>compile</scope> — это по умолчанию, можно не писать -->\n    </dependency>\n\n    <!-- test: только для тестов, не попадает в финальный JAR -->\n    <dependency>\n        <groupId>org.junit.jupiter</groupId>\n        <artifactId>junit-jupiter</artifactId>\n        <version>5.9.3</version>\n        <scope>test</scope>\n    </dependency>\n\n    <!-- provided: предоставляется сервером (например, Java EE API) -->\n    <dependency>\n        <groupId>javax.servlet</groupId>\n        <artifactId>javax.servlet-api</artifactId>\n        <version>4.0.1</version>\n        <scope>provided</scope>\n    </dependency>\n\n    <!-- runtime: не нужна при компиляции, но нужна при запуске -->\n    <dependency>\n        <groupId>org.postgresql</groupId>\n        <artifactId>postgresql</artifactId>\n        <version>42.6.0</version>\n        <scope>runtime</scope>\n    </dependency>\n</dependencies>' },
        { type: 'heading', value: 'Transitive dependencies (транзитивные зависимости)' },
        { type: 'code', language: 'xml', value: '<!-- Ты добавляешь одну зависимость -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n    <version>3.1.0</version>\n</dependency>\n\n<!-- Maven автоматически скачивает ВСЕ её зависимости:\n     spring-core, spring-mvc, tomcat, jackson, ...\n     Всего может быть 50+ библиотек от одной зависимости! -->' },
        { type: 'heading', value: 'Управление версиями через properties' },
        { type: 'code', language: 'xml', value: '<properties>\n    <jackson.version>2.15.2</jackson.version>\n    <junit.version>5.9.3</junit.version>\n</properties>\n\n<dependencies>\n    <dependency>\n        <groupId>com.fasterxml.jackson.core</groupId>\n        <artifactId>jackson-databind</artifactId>\n        <version>${jackson.version}</version>  <!-- используем переменную -->\n    </dependency>\n    <dependency>\n        <groupId>com.fasterxml.jackson.core</groupId>\n        <artifactId>jackson-core</artifactId>\n        <version>${jackson.version}</version>  <!-- версия в одном месте! -->\n    </dependency>\n</dependencies>' },
        { type: 'tip', value: 'Всегда указывай конкретные версии зависимостей, не используй LATEST или RELEASE в продакшн-проектах. Это обеспечивает воспроизводимость сборки — проект будет собираться одинаково на всех машинах.' }
      ]
    },
    {
      id: 4, title: 'Maven: жизненный цикл', type: 'theory',
      content: [
        { type: 'text', value: 'Maven имеет встроенный жизненный цикл (lifecycle) — последовательность фаз, которые выполняются при сборке проекта. Каждая фаза выполняет определённую задачу.' },
        { type: 'heading', value: 'Основные фазы lifecycle' },
        { type: 'list', items: [
          'validate — проверяет что проект корректен',
          'compile — компилирует исходный код в target/classes',
          'test — запускает юнит-тесты',
          'package — упаковывает код в JAR/WAR (target/*.jar)',
          'verify — запускает интеграционные тесты',
          'install — устанавливает JAR в локальный репозиторий (~/.m2)',
          'deploy — публикует в удалённый репозиторий (Nexus, Artifactory)'
        ]},
        { type: 'code', language: 'java', value: '// Основные команды Maven:\n\n// mvn compile\n// Компилирует исходники в target/classes/\n\n// mvn test\n// Компилирует + запускает все тесты\n\n// mvn package\n// Компилирует + тесты + создаёт target/myapp-1.0.jar\n\n// mvn install\n// package + устанавливает в ~/.m2/repository/\n\n// mvn clean\n// Удаляет папку target/ (чистая сборка)\n\n// mvn clean package\n// Удаляет target/ и собирает заново (самая частая команда)\n\n// mvn clean package -DskipTests\n// Собрать без тестов (быстрее, но осторожно!)' },
        { type: 'heading', value: 'Executable JAR с Maven' },
        { type: 'code', language: 'xml', value: '<build>\n    <plugins>\n        <plugin>\n            <groupId>org.apache.maven.plugins</groupId>\n            <artifactId>maven-jar-plugin</artifactId>\n            <version>3.3.0</version>\n            <configuration>\n                <archive>\n                    <manifest>\n                        <!-- Указываем главный класс -->\n                        <mainClass>com.example.Main</mainClass>\n                    </manifest>\n                </archive>\n            </configuration>\n        </plugin>\n    </plugins>\n</build>\n\n<!-- После: mvn package -->\n<!-- Запуск: java -jar target/my-app-1.0.jar -->' },
        { type: 'note', value: 'Обычный JAR не включает зависимости. Для создания "fat JAR" (со всеми зависимостями внутри) используй maven-shade-plugin или spring-boot-maven-plugin.' }
      ]
    },
    {
      id: 5, title: 'Основы Gradle', type: 'theory',
      content: [
        { type: 'text', value: 'Gradle — более современная система сборки. Конфигурируется на языке Groovy или Kotlin (Kotlin DSL — рекомендуется для новых проектов). Файл сборки: build.gradle (Groovy) или build.gradle.kts (Kotlin).' },
        { type: 'heading', value: 'Структура Gradle-проекта' },
        { type: 'code', language: 'java', value: 'myproject/\n├── build.gradle          ← файл сборки (Groovy)\n├── settings.gradle       ← имя проекта\n├── gradlew               ← Gradle wrapper (Unix)\n├── gradlew.bat           ← Gradle wrapper (Windows)\n├── gradle/\n│   └── wrapper/\n│       └── gradle-wrapper.properties\n└── src/                  ← та же структура что у Maven\n    ├── main/java/\n    └── test/java/' },
        { type: 'heading', value: 'Файл build.gradle (Groovy DSL)' },
        { type: 'code', language: 'groovy', value: '// build.gradle\nplugins {\n    id "java"\n    id "application"\n}\n\ngroup = "com.example"\nversion = "1.0.0"\n\njava {\n    sourceCompatibility = JavaVersion.VERSION_17\n    targetCompatibility = JavaVersion.VERSION_17\n}\n\n// Репозитории откуда скачивать зависимости\nrepositories {\n    mavenCentral()\n}\n\n// Зависимости\ndependencies {\n    // Компилируемая зависимость\n    implementation "com.fasterxml.jackson.core:jackson-databind:2.15.2"\n\n    // Только для тестов\n    testImplementation "org.junit.jupiter:junit-jupiter:5.9.3"\n\n    // Runtime only\n    runtimeOnly "org.postgresql:postgresql:42.6.0"\n}\n\n// Главный класс приложения\napplication {\n    mainClass = "com.example.Main"\n}\n\n// Настройка тестов\ntest {\n    useJUnitPlatform()\n}' },
        { type: 'heading', value: 'Файл build.gradle.kts (Kotlin DSL — рекомендуется)' },
        { type: 'code', language: 'kotlin', value: '// build.gradle.kts\nplugins {\n    java\n    application\n}\n\ngroup = "com.example"\nversion = "1.0.0"\n\nrepositories {\n    mavenCentral()\n}\n\ndependencies {\n    implementation("com.fasterxml.jackson.core:jackson-databind:2.15.2")\n    testImplementation("org.junit.jupiter:junit-jupiter:5.9.3")\n}\n\napplication {\n    mainClass.set("com.example.Main")\n}\n\ntasks.test {\n    useJUnitPlatform()\n}' },
        { type: 'heading', value: 'Основные команды Gradle' },
        { type: 'code', language: 'java', value: '// ./gradlew build\n// Компилирует + тесты + JAR\n\n// ./gradlew run\n// Запускает приложение\n\n// ./gradlew test\n// Запускает тесты\n\n// ./gradlew clean\n// Удаляет build/ директорию\n\n// ./gradlew clean build\n// Чистая сборка\n\n// ./gradlew dependencies\n// Показывает дерево зависимостей\n\n// ./gradlew tasks\n// Список всех доступных задач' },
        { type: 'tip', value: 'Всегда используй gradlew (Gradle Wrapper) вместо gradle. Wrapper гарантирует что все используют одну и ту же версию Gradle, независимо от того что установлено на машине.' }
      ]
    },
    {
      id: 6, title: 'Практика: Создание Maven-проекта', type: 'practice', difficulty: 'medium',
      description: 'Создай Maven pom.xml для проекта "Студенческий журнал". Проект должен использовать Jackson для JSON, SQLite для базы данных и JUnit для тестов. Напиши корректный pom.xml с нужными зависимостями.',
      requirements: [
        'groupId: kz.edu.journal, artifactId: student-journal, version: 1.0.0',
        'Настрой компилятор на Java 17',
        'Добавь зависимость Jackson (jackson-databind 2.15.2) со scope compile',
        'Добавь зависимость SQLite (sqlite-jdbc 3.43.0.0) со scope runtime',
        'Добавь зависимость JUnit Jupiter (junit-jupiter 5.9.3) со scope test',
        'Добавь maven-jar-plugin с mainClass = kz.edu.journal.Main'
      ],
      expectedOutput: '<!-- Корректный pom.xml который Maven успешно распарсит -->\n<!-- Проект: kz.edu.journal:student-journal:1.0.0 -->\n<!-- Java 17, 3 зависимости, исполняемый JAR -->',
      hint: 'Скопируй структуру из урока. groupId и artifactId в теге <project>. properties для Java 17. Три <dependency> блока в <dependencies>. Плагин jar в <build><plugins>.',
      solution: '<?xml version="1.0" encoding="UTF-8"?>\n<project xmlns="http://maven.apache.org/POM/4.0.0"\n         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0\n                             http://maven.apache.org/xsd/maven-4.0.0.xsd">\n\n    <modelVersion>4.0.0</modelVersion>\n\n    <groupId>kz.edu.journal</groupId>\n    <artifactId>student-journal</artifactId>\n    <version>1.0.0</version>\n    <packaging>jar</packaging>\n\n    <name>Student Journal</name>\n    <description>Электронный журнал студентов</description>\n\n    <properties>\n        <maven.compiler.source>17</maven.compiler.source>\n        <maven.compiler.target>17</maven.compiler.target>\n        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>\n    </properties>\n\n    <dependencies>\n        <dependency>\n            <groupId>com.fasterxml.jackson.core</groupId>\n            <artifactId>jackson-databind</artifactId>\n            <version>2.15.2</version>\n        </dependency>\n\n        <dependency>\n            <groupId>org.xerial</groupId>\n            <artifactId>sqlite-jdbc</artifactId>\n            <version>3.43.0.0</version>\n            <scope>runtime</scope>\n        </dependency>\n\n        <dependency>\n            <groupId>org.junit.jupiter</groupId>\n            <artifactId>junit-jupiter</artifactId>\n            <version>5.9.3</version>\n            <scope>test</scope>\n        </dependency>\n    </dependencies>\n\n    <build>\n        <plugins>\n            <plugin>\n                <groupId>org.apache.maven.plugins</groupId>\n                <artifactId>maven-jar-plugin</artifactId>\n                <version>3.3.0</version>\n                <configuration>\n                    <archive>\n                        <manifest>\n                            <mainClass>kz.edu.journal.Main</mainClass>\n                        </manifest>\n                    </archive>\n                </configuration>\n            </plugin>\n        </plugins>\n    </build>\n\n</project>',
      explanation: 'scope compile (по умолчанию) означает что Jackson будет в classpath при компиляции и выполнении. scope runtime для SQLite — нам не нужно импортировать его классы напрямую (JDBC Driver загружается автоматически), но нужно при запуске. scope test для JUnit — библиотека нужна только при тестировании и не попадает в финальный JAR.'
    }
  ]
}
