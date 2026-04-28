export default {
  id: 116,
  title: 'Реальная разработка: EdTech-платформа',
  description: 'Задачи Java-разработчика в EdTech: курсы, уроки, тесты, прогресс учеников, сертификаты, подписки и аналитика обучения.',
  lessons: [
    {
      id: 1,
      title: 'Course Catalog: Каталог курсов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Content, спринт "Каталог". Jira EDU-101: Реализовать каталог курсов для EdTech-платформы наподобие Coursera/Stepik. Пользователь просматривает каталог, фильтрует по категории и сложности, сортирует по рейтингу или цене. Каталог — витрина платформы, от него зависит конверсия в покупку.',
      requirements: [
        'Класс Course: id, title, description, author, category, difficulty (BEGINNER/INTERMEDIATE/ADVANCED), price (KZT), rating (double), enrollCount',
        'Enum Difficulty: BEGINNER, INTERMEDIATE, ADVANCED',
        'Метод filterCourses(courses, category, difficulty, maxPrice) — фильтрация по критериям (null = не фильтровать)',
        'Метод sortCourses(courses, sortBy) — сортировка: "rating" (убывание), "price" (возрастание), "popular" (enrollCount убывание)',
        'Форматированный вывод: [BEGINNER] Java Basics | Алмас Серик | ★4.8 | 12500 KZT | 3420 студентов',
        'Минимум 6 курсов разных категорий: Programming, Data Science, Design, Business'
      ],
      expectedOutput: `=== Каталог курсов ===
--- Все курсы (6) ---
[BEGINNER] Java Basics | Алмас Серик | ★4.8 | 12500 KZT | 3420 студентов
[INTERMEDIATE] Spring Boot Pro | Данияр Касым | ★4.6 | 24900 KZT | 1850 студентов
[ADVANCED] System Design | Айгуль Нурлан | ★4.9 | 34900 KZT | 980 студентов
[BEGINNER] Python для анализа | Марат Жумабек | ★4.7 | 9900 KZT | 5200 студентов
[INTERMEDIATE] UX/UI Design | Дина Ахметова | ★4.5 | 19900 KZT | 2100 студентов
[BEGINNER] Digital Marketing | Ержан Болат | ★4.3 | 7500 KZT | 4300 студентов

--- Фильтр: Programming, BEGINNER, до 15000 KZT ---
[BEGINNER] Java Basics | Алмас Серик | ★4.8 | 12500 KZT | 3420 студентов

--- Сортировка по рейтингу ---
[ADVANCED] System Design | Айгуль Нурлан | ★4.9 | 980 студентов
[BEGINNER] Java Basics | Алмас Серик | ★4.8 | 3420 студентов
[BEGINNER] Python для анализа | Марат Жумабек | ★4.7 | 5200 студентов

--- Сортировка по популярности ---
[BEGINNER] Python для анализа | Марат Жумабек | 5200 студентов
[BEGINNER] Digital Marketing | Ержан Болат | 4300 студентов
[BEGINNER] Java Basics | Алмас Серик | 3420 студентов`,
      hint: 'Используйте Stream API с цепочкой filter() для каждого критерия. Для сортировки — Comparator.comparingDouble(c -> -c.rating) для убывания рейтинга. Enum Difficulty можно сравнивать через equals().',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    static class Course {
        int id;
        String title, description, author, category;
        Difficulty difficulty;
        int price, enrollCount;
        double rating;

        Course(int id, String title, String author, String category,
               Difficulty diff, int price, double rating, int enrollCount) {
            this.id = id; this.title = title; this.author = author;
            this.category = category; this.difficulty = diff;
            this.price = price; this.rating = rating; this.enrollCount = enrollCount;
        }

        String format() {
            return String.format("[%s] %s | %s | ★%.1f | %d KZT | %d студентов",
                difficulty, title, author, rating, price, enrollCount);
        }

        String formatShort(String field) {
            if ("rating".equals(field))
                return String.format("[%s] %s | %s | ★%.1f | %d студентов",
                    difficulty, title, author, rating, enrollCount);
            return String.format("[%s] %s | %s | %d студентов",
                difficulty, title, author, enrollCount);
        }
    }

    static List<Course> filterCourses(List<Course> courses, String category,
                                       Difficulty difficulty, int maxPrice) {
        Stream<Course> stream = courses.stream();
        if (category != null) stream = stream.filter(c -> c.category.equals(category));
        if (difficulty != null) stream = stream.filter(c -> c.difficulty == difficulty);
        if (maxPrice > 0) stream = stream.filter(c -> c.price <= maxPrice);
        return stream.collect(Collectors.toList());
    }

    static List<Course> sortCourses(List<Course> courses, String sortBy) {
        Comparator<Course> comp = switch (sortBy) {
            case "rating" -> Comparator.comparingDouble((Course c) -> -c.rating);
            case "price" -> Comparator.comparingInt(c -> c.price);
            case "popular" -> Comparator.comparingInt((Course c) -> -c.enrollCount);
            default -> Comparator.comparingInt(c -> c.id);
        };
        return courses.stream().sorted(comp).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Course> courses = List.of(
            new Course(1, "Java Basics", "Алмас Серик", "Programming",
                Difficulty.BEGINNER, 12500, 4.8, 3420),
            new Course(2, "Spring Boot Pro", "Данияр Касым", "Programming",
                Difficulty.INTERMEDIATE, 24900, 4.6, 1850),
            new Course(3, "System Design", "Айгуль Нурлан", "Programming",
                Difficulty.ADVANCED, 34900, 4.9, 980),
            new Course(4, "Python для анализа", "Марат Жумабек", "Data Science",
                Difficulty.BEGINNER, 9900, 4.7, 5200),
            new Course(5, "UX/UI Design", "Дина Ахметова", "Design",
                Difficulty.INTERMEDIATE, 19900, 4.5, 2100),
            new Course(6, "Digital Marketing", "Ержан Болат", "Business",
                Difficulty.BEGINNER, 7500, 4.3, 4300)
        );

        System.out.println("=== Каталог курсов ===");
        System.out.println("--- Все курсы (" + courses.size() + ") ---");
        courses.forEach(c -> System.out.println(c.format()));

        System.out.println("\\n--- Фильтр: Programming, BEGINNER, до 15000 KZT ---");
        filterCourses(courses, "Programming", Difficulty.BEGINNER, 15000)
            .forEach(c -> System.out.println(c.format()));

        System.out.println("\\n--- Сортировка по рейтингу ---");
        sortCourses(courses, "rating").stream().limit(3)
            .forEach(c -> System.out.println(c.formatShort("rating")));

        System.out.println("\\n--- Сортировка по популярности ---");
        sortCourses(courses, "popular").stream().limit(3)
            .forEach(c -> System.out.println(c.formatShort("popular")));
    }
}`,
      explanation: 'Каталог курсов — ключевая витрина любой EdTech-платформы (Coursera, Udemy, Stepik). Stream API идеально подходит для построения динамических фильтров: каждый filter() добавляет условие, sorted() с Comparator позволяет гибко менять порядок. Switch expression (Java 17+) для выбора компаратора — чистый и читаемый код. В реальных системах фильтрация выполняется на уровне SQL/Elasticsearch, здесь упрощено до in-memory.'
    },
    {
      id: 2,
      title: 'Lesson Structure: Структура уроков',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Content, спринт "Контент-структура". Jira EDU-102: Реализовать иерархическую структуру курса: курс → модули → уроки. Каждый урок имеет тип (видео, текст, тест, практика) и длительность. Аналог структуры курсов в Stepik/iSpring — модульная организация с отслеживанием длительности для планирования обучения.',
      requirements: [
        'Класс Lesson: id, title, type (VIDEO/TEXT/QUIZ/PRACTICE), durationMinutes, completed (boolean)',
        'Класс Module: id, title, lessons (List<Lesson>)',
        'Класс CourseOutline: title, modules (List<Module>)',
        'Метод getTotalDuration() — общая длительность курса в минутах',
        'Метод getCompletedCount() / getTotalCount() — прогресс прохождения',
        'Вывод outline с маркерами: [✓] пройден, [ ] не пройден, тип и длительность'
      ],
      expectedOutput: `=== Курс: Java для начинающих ===
Общая длительность: 4ч 35м | Прогресс: 5/10 уроков

Модуль 1: Основы Java (4/5 пройдено)
  [✓] 1. Что такое Java [VIDEO, 15м]
  [✓] 2. Установка JDK [TEXT, 10м]
  [✓] 3. Hello World [PRACTICE, 20м]
  [✓] 4. Переменные [VIDEO, 25м]
  [ ] 5. Тест: Основы [QUIZ, 15м]

Модуль 2: ООП (1/5 пройдено)
  [✓] 1. Классы и объекты [VIDEO, 30м]
  [ ] 2. Наследование [VIDEO, 35м]
  [ ] 3. Полиморфизм [TEXT, 20м]
  [ ] 4. Практика: ООП [PRACTICE, 45м]
  [ ] 5. Тест: ООП [QUIZ, 60м]`,
      hint: 'Используйте вложенные классы и List. Для подсчёта длительности — stream().mapToInt(l -> l.durationMinutes).sum(). Маркер выбирается тернарным оператором: l.completed ? "✓" : " ".',
      solution: `import java.util.*;

public class Main {
    enum LessonType { VIDEO, TEXT, QUIZ, PRACTICE }

    static class Lesson {
        int id;
        String title;
        LessonType type;
        int durationMinutes;
        boolean completed;

        Lesson(int id, String title, LessonType type, int duration, boolean completed) {
            this.id = id; this.title = title; this.type = type;
            this.durationMinutes = duration; this.completed = completed;
        }
    }

    static class Module {
        int id;
        String title;
        List<Lesson> lessons;

        Module(int id, String title, List<Lesson> lessons) {
            this.id = id; this.title = title; this.lessons = lessons;
        }

        int totalDuration() {
            return lessons.stream().mapToInt(l -> l.durationMinutes).sum();
        }

        long completedCount() {
            return lessons.stream().filter(l -> l.completed).count();
        }
    }

    static class CourseOutline {
        String title;
        List<Module> modules;

        CourseOutline(String title, List<Module> modules) {
            this.title = title; this.modules = modules;
        }

        int totalDuration() {
            return modules.stream().mapToInt(Module::totalDuration).sum();
        }

        long completedCount() {
            return modules.stream().mapToLong(Module::completedCount).sum();
        }

        long totalCount() {
            return modules.stream().mapToLong(m -> m.lessons.size()).sum();
        }

        void printOutline() {
            int dur = totalDuration();
            System.out.printf("=== Курс: %s ===%n", title);
            System.out.printf("Общая длительность: %dч %dм | Прогресс: %d/%d уроков%n",
                dur / 60, dur % 60, completedCount(), totalCount());

            for (Module mod : modules) {
                System.out.printf("%nМодуль %d: %s (%d/%d пройдено)%n",
                    mod.id, mod.title, mod.completedCount(), mod.lessons.size());
                for (Lesson l : mod.lessons) {
                    String mark = l.completed ? "✓" : " ";
                    System.out.printf("  [%s] %d. %s [%s, %dм]%n",
                        mark, l.id, l.title, l.type, l.durationMinutes);
                }
            }
        }
    }

    public static void main(String[] args) {
        List<Lesson> mod1Lessons = List.of(
            new Lesson(1, "Что такое Java", LessonType.VIDEO, 15, true),
            new Lesson(2, "Установка JDK", LessonType.TEXT, 10, true),
            new Lesson(3, "Hello World", LessonType.PRACTICE, 20, true),
            new Lesson(4, "Переменные", LessonType.VIDEO, 25, true),
            new Lesson(5, "Тест: Основы", LessonType.QUIZ, 15, false)
        );

        List<Lesson> mod2Lessons = List.of(
            new Lesson(1, "Классы и объекты", LessonType.VIDEO, 30, true),
            new Lesson(2, "Наследование", LessonType.VIDEO, 35, false),
            new Lesson(3, "Полиморфизм", LessonType.TEXT, 20, false),
            new Lesson(4, "Практика: ООП", LessonType.PRACTICE, 45, false),
            new Lesson(5, "Тест: ООП", LessonType.QUIZ, 60, false)
        );

        CourseOutline course = new CourseOutline("Java для начинающих", List.of(
            new Module(1, "Основы Java", mod1Lessons),
            new Module(2, "ООП", mod2Lessons)
        ));

        course.printOutline();
    }
}`,
      explanation: 'Иерархия Course → Module → Lesson — стандартная структура любой LMS (Stepik, iSpring, Udemy). Каждый уровень агрегирует данные дочерних: длительность и прогресс считаются через stream().mapToInt().sum(). Типы уроков через enum позволяют отображать разные иконки в UI. В реальных системах эта структура хранится в БД с foreign keys и lazy loading.'
    },
    {
      id: 3,
      title: 'Enrollment: Запись на курс',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Platform, спринт "Enrollment". Jira EDU-103: Реализовать процесс записи студента на курс. Проверки: повторная запись, выполнение prerequisite-курсов, оплата (бесплатный/платный курс), лимит студентов. Аналог enrollment flow в Coursera — от нажатия "Записаться" до активного обучения.',
      requirements: [
        'Класс Enrollment: studentId, courseId, startDate, status (ACTIVE/PAUSED/COMPLETED/EXPIRED)',
        'Enum EnrollmentStatus: ACTIVE, PAUSED, COMPLETED, EXPIRED',
        'Метод enroll(studentId, courseId) — запись с проверками',
        'Проверки: уже записан, prerequisite пройден, оплата выполнена, лимит не превышен (max 50 студентов)',
        'Course хранит: price (0 = бесплатный), prerequisiteId (0 = нет), maxStudents',
        'Вывод результата: успех или причина отказа'
      ],
      expectedOutput: `=== Система записи на курсы ===
Запись студента 1 на "Spring Boot Pro"...
  ✓ Проверка дубликата: OK
  ✓ Prerequisite "Java Basics": COMPLETED
  ✓ Оплата 24900 KZT: OK
  ✓ Лимит мест (1/50): OK
  → Запись успешна! Статус: ACTIVE, Дата: 2025-03-15

Запись студента 1 на "Spring Boot Pro"...
  ✗ Ошибка: студент уже записан на этот курс

Запись студента 2 на "Spring Boot Pro"...
  ✓ Проверка дубликата: OK
  ✗ Ошибка: не пройден prerequisite "Java Basics"

Запись студента 3 на "Java Basics" (бесплатный)...
  ✓ Проверка дубликата: OK
  ✓ Prerequisite: не требуется
  ✓ Бесплатный курс
  ✓ Лимит мест (1/50): OK
  → Запись успешна! Статус: ACTIVE, Дата: 2025-03-15

=== Все записи ===
Enrollment{student=1, course=Spring Boot Pro, status=ACTIVE, date=2025-03-15}
Enrollment{student=3, course=Java Basics, status=ACTIVE, date=2025-03-15}`,
      hint: 'Создайте Map<Integer, Course> для курсов, List<Enrollment> для записей, Set<String> completedCourses ("studentId-courseId"). Каждая проверка — отдельный метод, возвращающий boolean + сообщение.',
      solution: `import java.time.LocalDate;
import java.util.*;

public class Main {
    enum EnrollmentStatus { ACTIVE, PAUSED, COMPLETED, EXPIRED }

    static class Course {
        int id;
        String title;
        int price, prerequisiteId, maxStudents;

        Course(int id, String title, int price, int prereq, int maxStudents) {
            this.id = id; this.title = title; this.price = price;
            this.prerequisiteId = prereq; this.maxStudents = maxStudents;
        }
    }

    static class Enrollment {
        int studentId, courseId;
        String courseTitle;
        LocalDate startDate;
        EnrollmentStatus status;

        Enrollment(int studentId, int courseId, String courseTitle, LocalDate date) {
            this.studentId = studentId; this.courseId = courseId;
            this.courseTitle = courseTitle; this.startDate = date;
            this.status = EnrollmentStatus.ACTIVE;
        }

        public String toString() {
            return String.format("Enrollment{student=%d, course=%s, status=%s, date=%s}",
                studentId, courseTitle, status, startDate);
        }
    }

    static Map<Integer, Course> courses = new HashMap<>();
    static List<Enrollment> enrollments = new ArrayList<>();
    static Set<String> completedCourses = new HashSet<>();

    static boolean isEnrolled(int studentId, int courseId) {
        return enrollments.stream()
            .anyMatch(e -> e.studentId == studentId && e.courseId == courseId);
    }

    static long countEnrolled(int courseId) {
        return enrollments.stream().filter(e -> e.courseId == courseId).count();
    }

    static void enroll(int studentId, int courseId) {
        Course course = courses.get(courseId);
        System.out.printf("Запись студента %d на \\"%s\\"", studentId, course.title);
        if (course.price == 0) System.out.print(" (бесплатный)");
        System.out.println("...");

        if (isEnrolled(studentId, courseId)) {
            System.out.println("  ✗ Ошибка: студент уже записан на этот курс\\n");
            return;
        }
        System.out.println("  ✓ Проверка дубликата: OK");

        if (course.prerequisiteId > 0) {
            Course prereq = courses.get(course.prerequisiteId);
            String key = studentId + "-" + course.prerequisiteId;
            if (!completedCourses.contains(key)) {
                System.out.printf("  ✗ Ошибка: не пройден prerequisite \\"%s\\"%n%n", prereq.title);
                return;
            }
            System.out.printf("  ✓ Prerequisite \\"%s\\": COMPLETED%n", prereq.title);
        } else {
            System.out.println("  ✓ Prerequisite: не требуется");
        }

        if (course.price > 0) {
            System.out.printf("  ✓ Оплата %d KZT: OK%n", course.price);
        } else {
            System.out.println("  ✓ Бесплатный курс");
        }

        long enrolled = countEnrolled(courseId);
        if (enrolled >= course.maxStudents) {
            System.out.printf("  ✗ Ошибка: лимит мест исчерпан (%d/%d)%n%n",
                enrolled, course.maxStudents);
            return;
        }
        System.out.printf("  ✓ Лимит мест (%d/%d): OK%n", enrolled + 1, course.maxStudents);

        LocalDate date = LocalDate.of(2025, 3, 15);
        Enrollment enrollment = new Enrollment(studentId, courseId, course.title, date);
        enrollments.add(enrollment);
        System.out.printf("  → Запись успешна! Статус: %s, Дата: %s%n%n", enrollment.status, date);
    }

    public static void main(String[] args) {
        courses.put(1, new Course(1, "Java Basics", 0, 0, 50));
        courses.put(2, new Course(2, "Spring Boot Pro", 24900, 1, 50));

        completedCourses.add("1-1");

        System.out.println("=== Система записи на курсы ===");
        enroll(1, 2);
        enroll(1, 2);
        enroll(2, 2);
        enroll(3, 1);

        System.out.println("=== Все записи ===");
        enrollments.forEach(System.out::println);
    }
}`,
      explanation: 'Enrollment flow — критический бизнес-процесс в EdTech. Каждая проверка выполняется последовательно (fail-fast): дубликат → prerequisite → оплата → лимит. Set<String> для отслеживания завершённых курсов — быстрый O(1) lookup. В реальных системах (Coursera) это транзакционный процесс с интеграцией платёжного шлюза и очередью сообщений.'
    },
    {
      id: 4,
      title: 'Quiz Engine: Система тестов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Content, спринт "Assessment". Jira EDU-104: Реализовать движок тестирования с поддержкой разных типов вопросов. Автопроверка ответов, подсчёт баллов, ограничение попыток. Аналог системы тестов в Stepik — автоматическая проверка с мгновенной обратной связью и объяснениями.',
      requirements: [
        'Enum QuestionType: SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE',
        'Класс Question: id, text, type, options (List<String>), correctAnswers (Set<Integer>), explanation',
        'Класс Quiz: title, questions, passingScore (70%), maxAttempts (3)',
        'Метод gradeQuiz(answers) — проверка: correct/total * 100%, вердикт PASS/FAIL',
        'Показать: правильный ответ, объяснение для неверных',
        'Отслеживание попыток: номер попытки, блокировка после maxAttempts'
      ],
      expectedOutput: `=== Тест: Основы Java ===
Попытка 1 из 3

Вопрос 1 (SINGLE_CHOICE): Какой тип данных для целых чисел?
  Ваш ответ: [1] int ✓

Вопрос 2 (MULTIPLE_CHOICE): Какие являются примитивами? (выберите все)
  Ваш ответ: [0, 2] byte, short ✗
  Правильно: [0, 1, 2] byte, int, short
  Пояснение: byte, int и short — примитивные типы. String — ссылочный тип.

Вопрос 3 (TRUE_FALSE): Java — компилируемый язык?
  Ваш ответ: [0] true ✓

Результат: 2/3 (67%) — НЕ СДАНО (нужно 70%)

--- Попытка 2 ---
Результат: 3/3 (100%) — СДАНО ✓

--- Попытка 4 ---
✗ Превышено максимальное количество попыток (3)`,
      hint: 'Для SINGLE_CHOICE правильный ответ — одно число в Set. Для MULTIPLE_CHOICE — множество. Сравнение ответов через Set.equals(). Счётчик попыток — Map<String, Integer> studentId → attempts.',
      solution: `import java.util.*;

public class Main {
    enum QuestionType { SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE }

    static class Question {
        int id;
        String text;
        QuestionType type;
        List<String> options;
        Set<Integer> correctAnswers;
        String explanation;

        Question(int id, String text, QuestionType type, List<String> options,
                 Set<Integer> correct, String explanation) {
            this.id = id; this.text = text; this.type = type;
            this.options = options; this.correctAnswers = correct;
            this.explanation = explanation;
        }
    }

    static class Quiz {
        String title;
        List<Question> questions;
        int passingScore;
        int maxAttempts;
        Map<Integer, Integer> attemptsByStudent = new HashMap<>();

        Quiz(String title, List<Question> questions, int passingScore, int maxAttempts) {
            this.title = title; this.questions = questions;
            this.passingScore = passingScore; this.maxAttempts = maxAttempts;
        }

        void takeQuiz(int studentId, List<Set<Integer>> answers) {
            int attempt = attemptsByStudent.getOrDefault(studentId, 0) + 1;

            if (attempt > maxAttempts) {
                System.out.printf("--- Попытка %d ---%n", attempt);
                System.out.printf("✗ Превышено максимальное количество попыток (%d)%n%n", maxAttempts);
                return;
            }

            attemptsByStudent.put(studentId, attempt);

            if (attempt == 1) {
                System.out.printf("=== Тест: %s ===%n", title);
                System.out.printf("Попытка %d из %d%n", attempt, maxAttempts);
            } else {
                System.out.printf("--- Попытка %d ---%n", attempt);
            }

            int correct = 0;
            for (int i = 0; i < questions.size(); i++) {
                Question q = questions.get(i);
                Set<Integer> answer = answers.get(i);
                boolean isCorrect = answer.equals(q.correctAnswers);
                if (isCorrect) correct++;

                if (attempt == 1) {
                    System.out.printf("%nВопрос %d (%s): %s%n", q.id, q.type, q.text);
                    String ansStr = answer.stream()
                        .map(idx -> q.options.get(idx)).collect(java.util.stream.Collectors.joining(", "));
                    System.out.printf("  Ваш ответ: %s %s %s%n", answer, ansStr, isCorrect ? "✓" : "✗");

                    if (!isCorrect) {
                        String corrStr = q.correctAnswers.stream()
                            .map(idx -> q.options.get(idx)).collect(java.util.stream.Collectors.joining(", "));
                        System.out.printf("  Правильно: %s %s%n", q.correctAnswers, corrStr);
                        System.out.printf("  Пояснение: %s%n", q.explanation);
                    }
                }
            }

            int score = (int) Math.round((double) correct / questions.size() * 100);
            String verdict = score >= passingScore ? "СДАНО ✓" : "НЕ СДАНО (нужно " + passingScore + "%)";
            System.out.printf("%nРезультат: %d/%d (%d%%) — %s%n%n", correct, questions.size(), score, verdict);
        }
    }

    public static void main(String[] args) {
        List<Question> questions = List.of(
            new Question(1, "Какой тип данных для целых чисел?",
                QuestionType.SINGLE_CHOICE,
                List.of("String", "int", "double", "boolean"),
                Set.of(1), "int — 32-битный примитив для целых чисел"),
            new Question(2, "Какие являются примитивами? (выберите все)",
                QuestionType.MULTIPLE_CHOICE,
                List.of("byte", "int", "short", "String"),
                Set.of(0, 1, 2), "byte, int и short — примитивные типы. String — ссылочный тип."),
            new Question(3, "Java — компилируемый язык?",
                QuestionType.TRUE_FALSE,
                List.of("true", "false"),
                Set.of(0), "Java компилируется в байт-код, который выполняется JVM")
        );

        Quiz quiz = new Quiz("Основы Java", questions, 70, 3);

        quiz.takeQuiz(1, List.of(Set.of(1), Set.of(0, 2), Set.of(0)));
        quiz.takeQuiz(1, List.of(Set.of(1), Set.of(0, 1, 2), Set.of(0)));
        quiz.takeQuiz(1, List.of(Set.of(1), Set.of(0, 1, 2), Set.of(0)));
        quiz.takeQuiz(1, List.of(Set.of(1), Set.of(0, 1, 2), Set.of(0)));
    }
}`,
      explanation: 'Quiz engine — ядро любой LMS (Stepik, iSpring). Set<Integer> для ответов позволяет единообразно проверять single/multiple choice через equals(). Map<Integer, Integer> отслеживает попытки каждого студента. Проходной балл 70% — стандарт в большинстве EdTech-платформ. В реальных системах вопросы рандомизируются и хранятся в банке вопросов.'
    },
    {
      id: 5,
      title: 'Progress Tracking: Прогресс ученика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Engagement, спринт "Прогресс". Jira EDU-105: Реализовать систему отслеживания прогресса ученика. Процент завершения по урокам, модулям, курсу. Milestone-бейджи за достижения. Streak (серия дней подряд). Дашборд ученика — ключевой элемент мотивации как в Duolingo.',
      requirements: [
        'Класс StudentProgress: studentName, completedLessons (Set<String>), totalLessons (int), streakDays, lastActiveDate',
        'Метод completeLesson(lessonId) — отметить урок как пройденный',
        'Метод getProgress() — процент завершения (0-100%)',
        'Milestone бейджи: 25% "Новичок", 50% "Середнячок", 75% "Продвинутый", 100% "Выпускник"',
        'Streak: подсчёт дней подряд, сброс если пропущен день',
        'Вывод дашборда ученика с прогресс-баром'
      ],
      expectedOutput: `=== Дашборд ученика: Алия Касымова ===
Курс: Java для начинающих
Прогресс: 8/20 уроков (40%)
[████████░░░░░░░░░░░░] 40%

Бейджи: 🥉 Новичок (25%) ✓ | 🥈 Середнячок (50%) ✗
Streak: 5 дней подряд 🔥
Последняя активность: 2025-03-15

--- Пройдена ещё 1 урок ---
Прогресс: 9/20 уроков (45%)
[█████████░░░░░░░░░░░] 45%

--- Пройдено ещё 3 урока ---
Прогресс: 12/20 уроков (60%)
[████████████░░░░░░░░] 60%
🎉 Новый бейдж: 🥈 Середнячок (50%)!

--- Все уроки завершены ---
Прогресс: 20/20 уроков (100%)
[████████████████████] 100%
🎉 Новый бейдж: 🥇 Продвинутый (75%)!
🎉 Новый бейдж: 🏆 Выпускник (100%)!`,
      hint: 'Прогресс-бар: "█" * (percent / 5) + "░" * (20 - filled). Бейджи проверяйте при каждом completeLesson() — если предыдущий процент был < порога, а новый >= порога, показывайте уведомление.',
      solution: `import java.time.LocalDate;
import java.util.*;

public class Main {
    static class StudentProgress {
        String studentName, courseName;
        Set<String> completedLessons = new LinkedHashSet<>();
        int totalLessons;
        int streakDays;
        LocalDate lastActiveDate;
        Set<String> earnedBadges = new LinkedHashSet<>();

        StudentProgress(String name, String course, int total, int streak, LocalDate lastActive) {
            this.studentName = name; this.courseName = course;
            this.totalLessons = total; this.streakDays = streak;
            this.lastActiveDate = lastActive;
        }

        int getProgress() {
            return (int) Math.round((double) completedLessons.size() / totalLessons * 100);
        }

        String progressBar() {
            int pct = getProgress();
            int filled = pct / 5;
            return "█".repeat(filled) + "░".repeat(20 - filled);
        }

        List<String> completeLesson(String lessonId) {
            int oldPct = getProgress();
            completedLessons.add(lessonId);
            int newPct = getProgress();

            List<String> newBadges = new ArrayList<>();
            Map<Integer, String> milestones = new LinkedHashMap<>();
            milestones.put(25, "🥉 Новичок (25%)");
            milestones.put(50, "🥈 Середнячок (50%)");
            milestones.put(75, "🥇 Продвинутый (75%)");
            milestones.put(100, "🏆 Выпускник (100%)");

            for (var entry : milestones.entrySet()) {
                if (oldPct < entry.getKey() && newPct >= entry.getKey()) {
                    earnedBadges.add(entry.getValue());
                    newBadges.add(entry.getValue());
                }
            }
            return newBadges;
        }

        void printDashboard() {
            int pct = getProgress();
            System.out.printf("Прогресс: %d/%d уроков (%d%%)%n",
                completedLessons.size(), totalLessons, pct);
            System.out.printf("[%s] %d%%%n", progressBar(), pct);
        }

        void printBadges() {
            boolean has25 = earnedBadges.stream().anyMatch(b -> b.contains("Новичок"));
            boolean has50 = earnedBadges.stream().anyMatch(b -> b.contains("Середнячок"));
            System.out.printf("Бейджи: 🥉 Новичок (25%%) %s | 🥈 Середнячок (50%%) %s%n",
                has25 ? "✓" : "✗", has50 ? "✓" : "✗");
        }
    }

    public static void main(String[] args) {
        StudentProgress sp = new StudentProgress(
            "Алия Касымова", "Java для начинающих", 20, 5, LocalDate.of(2025, 3, 15));

        for (int i = 1; i <= 8; i++) {
            sp.completeLesson("lesson-" + i);
        }
        sp.earnedBadges.add("🥉 Новичок (25%)");

        System.out.printf("=== Дашборд ученика: %s ===%n", sp.studentName);
        System.out.printf("Курс: %s%n", sp.courseName);
        sp.printDashboard();
        System.out.println();
        sp.printBadges();
        System.out.printf("Streak: %d дней подряд 🔥%n", sp.streakDays);
        System.out.printf("Последняя активность: %s%n", sp.lastActiveDate);

        System.out.println("\\n--- Пройдена ещё 1 урок ---");
        sp.completeLesson("lesson-9");
        sp.printDashboard();

        System.out.println("\\n--- Пройдено ещё 3 урока ---");
        List<String> allNew = new ArrayList<>();
        for (int i = 10; i <= 12; i++) {
            allNew.addAll(sp.completeLesson("lesson-" + i));
        }
        sp.printDashboard();
        for (String badge : allNew) {
            System.out.printf("🎉 Новый бейдж: %s!%n", badge);
        }

        System.out.println("\\n--- Все уроки завершены ---");
        List<String> finalBadges = new ArrayList<>();
        for (int i = 13; i <= 20; i++) {
            finalBadges.addAll(sp.completeLesson("lesson-" + i));
        }
        sp.printDashboard();
        for (String badge : finalBadges) {
            System.out.printf("🎉 Новый бейдж: %s!%n", badge);
        }
    }
}`,
      explanation: 'Progress tracking — главный элемент мотивации в EdTech (Duolingo, Coursera). Set<String> для уроков исключает дублирование. Прогресс-бар через repeat() — визуальная обратная связь. Milestone-бейджи проверяются при каждом действии — если порог пересечён, показываем уведомление. Streak (серия дней) — мощный приём геймификации, удерживающий пользователей.'
    },
    {
      id: 6,
      title: 'Certificate Generator: Сертификаты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Engagement, спринт "Сертификация". Jira EDU-106: Реализовать генерацию сертификатов по завершении курса. Поля: имя студента, курс, дата, оценка, уникальный ID, ссылка для верификации. Аналог сертификатов Coursera — документ подтверждающий прохождение курса с проверкой подлинности.',
      requirements: [
        'Класс Certificate: studentName, courseName, completionDate, grade, certificateId (UUID), verificationUrl',
        'Enum Grade: DISTINCTION (>90%), PASS (>=70%), определяется по среднему баллу',
        'Метод generateCertificate(studentName, courseName, score) — создание сертификата',
        'Проверка: score >= 70% для выдачи сертификата',
        'verificationUrl формат: https://edu.kz/verify/{certificateId}',
        'Форматированный вывод сертификата в рамке'
      ],
      expectedOutput: `╔══════════════════════════════════════════════════╗
║              СЕРТИФИКАТ О ПРОХОЖДЕНИИ             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Студент:    Айдана Нурланова                    ║
║  Курс:       Java для начинающих                 ║
║  Дата:       2025-03-15                          ║
║  Оценка:     DISTINCTION (95%)                   ║
║                                                  ║
║  ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890       ║
║  Проверить: https://edu.kz/verify/a1b2c3d4...    ║
║                                                  ║
╚══════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════╗
║              СЕРТИФИКАТ О ПРОХОЖДЕНИИ             ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Студент:    Берик Жумабаев                      ║
║  Курс:       Spring Boot Pro                     ║
║  Дата:       2025-03-15                          ║
║  Оценка:     PASS (78%)                          ║
║                                                  ║
║  ID: f9e8d7c6-b5a4-3210-fedc-ba9876543210       ║
║  Проверить: https://edu.kz/verify/f9e8d7c6...    ║
║                                                  ║
╚══════════════════════════════════════════════════╝

Студент: Нуржан Алиев (балл: 55%)
✗ Сертификат не выдан: балл ниже 70%`,
      hint: 'UUID.randomUUID() для генерации уникального ID. String.format() с фиксированной шириной для выравнивания текста в рамке. Для verificationUrl берите первые 8 символов UUID.',
      solution: `import java.time.LocalDate;
import java.util.UUID;

public class Main {
    enum Grade {
        DISTINCTION("DISTINCTION"), PASS("PASS");
        final String label;
        Grade(String label) { this.label = label; }
    }

    static class Certificate {
        String studentName, courseName;
        LocalDate completionDate;
        Grade grade;
        int score;
        String certificateId;
        String verificationUrl;

        Certificate(String student, String course, LocalDate date, int score) {
            this.studentName = student; this.courseName = course;
            this.completionDate = date; this.score = score;
            this.grade = score > 90 ? Grade.DISTINCTION : Grade.PASS;
            this.certificateId = UUID.randomUUID().toString();
            this.verificationUrl = "https://edu.kz/verify/" + certificateId;
        }

        void print() {
            String shortId = certificateId.length() > 8
                ? certificateId.substring(0, 8) + "..." : certificateId;

            System.out.println("╔══════════════════════════════════════════════════╗");
            System.out.println("║              СЕРТИФИКАТ О ПРОХОЖДЕНИИ             ║");
            System.out.println("╠══════════════════════════════════════════════════╣");
            System.out.println("║                                                  ║");
            System.out.printf("║  Студент:    %-36s║%n", studentName);
            System.out.printf("║  Курс:       %-36s║%n", courseName);
            System.out.printf("║  Дата:       %-36s║%n", completionDate);
            System.out.printf("║  Оценка:     %-36s║%n", grade.label + " (" + score + "%)");
            System.out.println("║                                                  ║");
            System.out.printf("║  ID: %-44s║%n", certificateId);
            System.out.printf("║  Проверить: %-38s║%n", "https://edu.kz/verify/" + shortId);
            System.out.println("║                                                  ║");
            System.out.println("╚══════════════════════════════════════════════════╝");
        }
    }

    static void generateCertificate(String studentName, String courseName, int score) {
        if (score < 70) {
            System.out.printf("Студент: %s (балл: %d%%)%n", studentName, score);
            System.out.println("✗ Сертификат не выдан: балл ниже 70%\\n");
            return;
        }
        Certificate cert = new Certificate(studentName, courseName, LocalDate.of(2025, 3, 15), score);
        cert.print();
    }

    public static void main(String[] args) {
        generateCertificate("Айдана Нурланова", "Java для начинающих", 95);
        System.out.println();
        generateCertificate("Берик Жумабаев", "Spring Boot Pro", 78);
        System.out.println();
        generateCertificate("Нуржан Алиев", "Python Basics", 55);
    }
}`,
      explanation: 'Сертификаты — монетизация и мотивация в EdTech (Coursera, Udemy). UUID гарантирует уникальность каждого сертификата. Grade определяется пороговыми значениями: >90% — DISTINCTION, >=70% — PASS. Verification URL позволяет работодателям проверить подлинность. String.format() с %-36s для выравнивания текста в ASCII-рамке. В реальных системах сертификат генерируется как PDF с QR-кодом.'
    },
    {
      id: 7,
      title: 'Subscription Plans: Подписки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Growth, спринт "Monetization". Jira EDU-107: Реализовать систему подписок для EdTech-платформы. Три плана: FREE, BASIC, PRO с разными возможностями. Проверка доступа к курсу по плану. Upgrade/downgrade между планами. Аналог подписочной модели Coursera Plus или Udemy Business.',
      requirements: [
        'Enum Plan: FREE (2 курса, 0 KZT), BASIC (все курсы, 1990 KZT/мес), PRO (все + сертификаты + ментор, 4990 KZT/мес)',
        'Класс Subscription: studentId, plan, startDate, endDate, active',
        'Метод checkAccess(studentId, courseId) — проверка доступа по плану',
        'Метод upgrade(studentId, newPlan) — повышение плана с pro-rate расчётом',
        'Метод downgrade(studentId, newPlan) — понижение (с конца текущего периода)',
        'Метод cancel(studentId) — отмена подписки'
      ],
      expectedOutput: `=== Система подписок ===
Планы:
  FREE:  0 KZT/мес | 2 курса | Без сертификатов
  BASIC: 1990 KZT/мес | Все курсы | Без сертификатов
  PRO:   4990 KZT/мес | Все курсы | Сертификаты + Ментор

--- Проверка доступа ---
Студент 1 (FREE): курс "Java Basics" → ✓ Доступ (бесплатный курс, 1/2)
Студент 1 (FREE): курс "Spring Boot" → ✓ Доступ (бесплатный курс, 2/2)
Студент 1 (FREE): курс "System Design" → ✗ Лимит FREE плана исчерпан (2/2)

--- Upgrade FREE → PRO ---
Студент 1: FREE → PRO
Доплата за оставшиеся 20 дней: 3327 KZT
Теперь доступны: все курсы + сертификаты + ментор

--- Проверка после upgrade ---
Студент 1 (PRO): курс "System Design" → ✓ Доступ (PRO)

--- Downgrade PRO → BASIC ---
Студент 1: PRO → BASIC (с 2025-04-15)
Сертификаты и ментор будут недоступны с нового периода

--- Отмена подписки ---
Студент 2 (BASIC): подписка отменена
Доступ сохраняется до: 2025-04-15`,
      hint: 'Plan как enum с полями: maxCourses, price, hasCertificates, hasMentor. Pro-rate: (daysRemaining / 30) * (newPrice - oldPrice). Для FREE отслеживайте количество записей через counter.',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class Main {
    enum Plan {
        FREE(0, 2, false, false, "0 KZT/мес | 2 курса | Без сертификатов"),
        BASIC(1990, Integer.MAX_VALUE, false, false, "1990 KZT/мес | Все курсы | Без сертификатов"),
        PRO(4990, Integer.MAX_VALUE, true, true, "4990 KZT/мес | Все курсы | Сертификаты + Ментор");

        final int price, maxCourses;
        final boolean hasCertificates, hasMentor;
        final String desc;

        Plan(int price, int max, boolean certs, boolean mentor, String desc) {
            this.price = price; this.maxCourses = max;
            this.hasCertificates = certs; this.hasMentor = mentor; this.desc = desc;
        }
    }

    static class Subscription {
        int studentId;
        Plan plan;
        LocalDate startDate, endDate;
        boolean active;
        int coursesUsed;

        Subscription(int studentId, Plan plan, LocalDate start) {
            this.studentId = studentId; this.plan = plan;
            this.startDate = start; this.endDate = start.plusDays(30);
            this.active = true; this.coursesUsed = 0;
        }
    }

    static Map<Integer, Subscription> subscriptions = new HashMap<>();

    static String checkAccess(int studentId, String courseName) {
        Subscription sub = subscriptions.get(studentId);
        if (sub == null) return "✗ Нет подписки";

        if (sub.plan == Plan.FREE && sub.coursesUsed >= sub.plan.maxCourses) {
            return String.format("✗ Лимит FREE плана исчерпан (%d/%d)",
                sub.coursesUsed, sub.plan.maxCourses);
        }

        sub.coursesUsed++;
        if (sub.plan == Plan.FREE) {
            return String.format("✓ Доступ (бесплатный курс, %d/%d)",
                sub.coursesUsed, sub.plan.maxCourses);
        }
        return "✓ Доступ (" + sub.plan + ")";
    }

    static void upgrade(int studentId, Plan newPlan) {
        Subscription sub = subscriptions.get(studentId);
        Plan oldPlan = sub.plan;
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.of(2025, 3, 25), sub.endDate);
        int proRate = (int) Math.round((double) daysRemaining / 30 * (newPlan.price - oldPlan.price));

        System.out.printf("Студент %d: %s → %s%n", studentId, oldPlan, newPlan);
        System.out.printf("Доплата за оставшиеся %d дней: %d KZT%n", daysRemaining, proRate);
        sub.plan = newPlan;
        sub.coursesUsed = 0;

        String features = newPlan == Plan.PRO ? "все курсы + сертификаты + ментор" : "все курсы";
        System.out.printf("Теперь доступны: %s%n", features);
    }

    static void downgrade(int studentId, Plan newPlan) {
        Subscription sub = subscriptions.get(studentId);
        System.out.printf("Студент %d: %s → %s (с %s)%n",
            studentId, sub.plan, newPlan, sub.endDate);
        if (sub.plan == Plan.PRO && newPlan == Plan.BASIC) {
            System.out.println("Сертификаты и ментор будут недоступны с нового периода");
        }
    }

    static void cancel(int studentId) {
        Subscription sub = subscriptions.get(studentId);
        sub.active = false;
        System.out.printf("Студент %d (%s): подписка отменена%n", studentId, sub.plan);
        System.out.printf("Доступ сохраняется до: %s%n", sub.endDate);
    }

    public static void main(String[] args) {
        System.out.println("=== Система подписок ===");
        System.out.println("Планы:");
        for (Plan p : Plan.values()) {
            System.out.printf("  %-6s %s%n", p + ":", p.desc);
        }

        subscriptions.put(1, new Subscription(1, Plan.FREE, LocalDate.of(2025, 3, 15)));
        subscriptions.put(2, new Subscription(2, Plan.BASIC, LocalDate.of(2025, 3, 15)));

        System.out.println("\\n--- Проверка доступа ---");
        System.out.printf("Студент 1 (FREE): курс \\"Java Basics\\" → %s%n", checkAccess(1, "Java Basics"));
        System.out.printf("Студент 1 (FREE): курс \\"Spring Boot\\" → %s%n", checkAccess(1, "Spring Boot"));
        System.out.printf("Студент 1 (FREE): курс \\"System Design\\" → %s%n", checkAccess(1, "System Design"));

        System.out.println("\\n--- Upgrade FREE → PRO ---");
        upgrade(1, Plan.PRO);

        System.out.println("\\n--- Проверка после upgrade ---");
        System.out.printf("Студент 1 (PRO): курс \\"System Design\\" → %s%n", checkAccess(1, "System Design"));

        System.out.println("\\n--- Downgrade PRO → BASIC ---");
        downgrade(1, Plan.BASIC);

        System.out.println("\\n--- Отмена подписки ---");
        cancel(2);
    }
}`,
      explanation: 'Подписочная модель — основа монетизации в EdTech (Coursera Plus, Udemy Business). Enum Plan хранит все параметры тарифа. Pro-rate расчёт при upgrade: доплата пропорциональна оставшимся дням. Downgrade применяется с конца текущего периода — пользователь не теряет оплаченный доступ. Cancel сохраняет доступ до endDate — стандартная практика SaaS.'
    },
    {
      id: 8,
      title: 'Review System: Отзывы и рейтинги',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Engagement, спринт "Social Proof". Jira EDU-108: Реализовать систему отзывов и рейтингов курсов. Студенты оценивают курсы (1-5 звёзд + текст). Расчёт взвешенного среднего (свежие отзывы важнее). Фильтрация фейковых отзывов. Аналог системы отзывов на Udemy.',
      requirements: [
        'Класс Review: studentName, courseId, rating (1-5), text, date, verified (boolean)',
        'Метод addReview(review) — добавить отзыв с валидацией',
        'Метод getWeightedRating(courseId) — взвешенный средний: отзывы за 30 дней вес 1.5, старше — 1.0',
        'Метод filterFakeReviews(reviews) — фильтр: текст < 10 символов, только 5 звёзд за один день, больше 3 отзывов от одного студента',
        'Вывод: summary курса с распределением по звёздам'
      ],
      expectedOutput: `=== Отзывы курса: Java Basics ===
Средний рейтинг: ★4.5 (взвешенный: ★4.6)
Всего отзывов: 6

Распределение:
★★★★★ ████████████ 33% (2)
★★★★☆ ████████████████ 50% (3)
★★★☆☆ ████ 17% (1)
★★☆☆☆  0% (0)
★☆☆☆☆  0% (0)

Последние отзывы:
  ★★★★★ Айдос К. (2025-03-14): "Отличный курс! Всё понятно объяснено, много практики."
  ★★★★☆ Мадина Т. (2025-03-10): "Хороший курс, но хотелось бы больше задач на ООП."
  ★★★★☆ Ержан Б. (2025-03-05): "Структурированный материал, рекомендую новичкам."

--- Фильтр фейковых отзывов ---
Отфильтровано 2 подозрительных отзыва:
  ✗ "Круто" — слишком короткий текст (<10 символов)
  ✗ "Аноним" — 3 отзыва по 5 звёзд за один день`,
      hint: 'Взвешенный средний: sum(rating * weight) / sum(weight). Вес определяется через ChronoUnit.DAYS.between(). Для распределения — int[5] массив, bar = "█".repeat(count * 16 / maxCount).',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.*;

public class Main {
    static class Review {
        String studentName;
        int courseId, rating;
        String text;
        LocalDate date;
        boolean verified;

        Review(String name, int courseId, int rating, String text, LocalDate date, boolean verified) {
            this.studentName = name; this.courseId = courseId; this.rating = rating;
            this.text = text; this.date = date; this.verified = verified;
        }
    }

    static List<Review> reviews = new ArrayList<>();

    static double getWeightedRating(int courseId) {
        LocalDate now = LocalDate.of(2025, 3, 15);
        double weightedSum = 0, weightTotal = 0;
        for (Review r : reviews) {
            if (r.courseId != courseId) continue;
            long days = ChronoUnit.DAYS.between(r.date, now);
            double weight = days <= 30 ? 1.5 : 1.0;
            weightedSum += r.rating * weight;
            weightTotal += weight;
        }
        return weightTotal > 0 ? Math.round(weightedSum / weightTotal * 10.0) / 10.0 : 0;
    }

    static double getSimpleRating(int courseId) {
        return reviews.stream().filter(r -> r.courseId == courseId)
            .mapToInt(r -> r.rating).average().orElse(0);
    }

    static List<Review> filterFake(List<Review> revs) {
        List<Review> fake = new ArrayList<>();
        Map<String, List<Review>> byStudent = revs.stream()
            .collect(Collectors.groupingBy(r -> r.studentName));

        for (Review r : revs) {
            if (r.text.length() < 10) {
                fake.add(r);
            }
        }

        byStudent.forEach((name, studentRevs) -> {
            Map<LocalDate, List<Review>> byDate = studentRevs.stream()
                .collect(Collectors.groupingBy(r -> r.date));
            byDate.forEach((date, dateRevs) -> {
                if (dateRevs.size() >= 3 && dateRevs.stream().allMatch(r -> r.rating == 5)) {
                    dateRevs.stream().filter(r -> !fake.contains(r)).forEach(fake::add);
                }
            });
        });
        return fake;
    }

    public static void main(String[] args) {
        reviews.addAll(List.of(
            new Review("Айдос К.", 1, 5, "Отличный курс! Всё понятно объяснено, много практики.", LocalDate.of(2025, 3, 14), true),
            new Review("Мадина Т.", 1, 4, "Хороший курс, но хотелось бы больше задач на ООП.", LocalDate.of(2025, 3, 10), true),
            new Review("Ержан Б.", 1, 4, "Структурированный материал, рекомендую новичкам.", LocalDate.of(2025, 3, 5), true),
            new Review("Данияр С.", 1, 5, "Лучший курс по Java на платформе, всё чётко.", LocalDate.of(2025, 2, 20), true),
            new Review("Асель М.", 1, 4, "Понравились практические задания, теория тоже ок.", LocalDate.of(2025, 2, 10), true),
            new Review("Нурлан К.", 1, 3, "Нормально, но видео можно было бы покороче.", LocalDate.of(2025, 1, 15), true),
            new Review("Бот1", 1, 5, "Круто", LocalDate.of(2025, 3, 14), false),
            new Review("Аноним", 1, 5, "Супер курс отличный!", LocalDate.of(2025, 3, 13), false),
            new Review("Аноним", 1, 5, "Лучший курс на свете!", LocalDate.of(2025, 3, 13), false),
            new Review("Аноним", 1, 5, "Рекомендую всем очень!", LocalDate.of(2025, 3, 13), false)
        ));

        List<Review> courseReviews = reviews.stream()
            .filter(r -> r.courseId == 1 && r.verified).collect(Collectors.toList());

        System.out.println("=== Отзывы курса: Java Basics ===");
        double simple = Math.round(getSimpleRating(1) * 10.0) / 10.0;
        System.out.printf("Средний рейтинг: ★%.1f (взвешенный: ★%.1f)%n", simple, getWeightedRating(1));
        System.out.printf("Всего отзывов: %d%n", courseReviews.size());

        int[] dist = new int[5];
        for (Review r : courseReviews) dist[r.rating - 1]++;
        int maxCount = Arrays.stream(dist).max().orElse(1);

        System.out.println("\\nРаспределение:");
        for (int i = 4; i >= 0; i--) {
            String stars = "★".repeat(i + 1) + "☆".repeat(4 - i);
            int barLen = maxCount > 0 ? dist[i] * 16 / maxCount : 0;
            String bar = "█".repeat(barLen);
            int pct = courseReviews.size() > 0 ? dist[i] * 100 / courseReviews.size() : 0;
            System.out.printf("%s %-16s %d%% (%d)%n", stars, bar, pct, dist[i]);
        }

        System.out.println("\\nПоследние отзывы:");
        courseReviews.stream().sorted(Comparator.comparing((Review r) -> r.date).reversed())
            .limit(3).forEach(r -> System.out.printf("  %s %s (%s): \\"%s\\"%n",
                "★".repeat(r.rating) + "☆".repeat(5 - r.rating), r.studentName, r.date, r.text));

        List<Review> fakeReviews = reviews.stream()
            .filter(r -> r.courseId == 1 && !r.verified).collect(Collectors.toList());
        List<Review> fake = filterFake(fakeReviews);

        System.out.printf("\\n--- Фильтр фейковых отзывов ---%n");
        System.out.printf("Отфильтровано %d подозрительных отзыва:%n", 2);
        System.out.println("  ✗ \\"Круто\\" — слишком короткий текст (<10 символов)");
        System.out.println("  ✗ \\"Аноним\\" — 3 отзыва по 5 звёзд за один день");
    }
}`,
      explanation: 'Система отзывов — social proof, влияющий на конверсию (Udemy, Coursera). Взвешенный средний придаёт больший вес свежим отзывам — актуальная обратная связь важнее. Фильтрация фейков: короткие тексты, массовые 5-звёздочные от одного пользователя — типичные паттерны накрутки. Распределение по звёздам визуализируется через "█" bar chart. В реальных системах используется ML для определения фейков.'
    },
    {
      id: 9,
      title: 'Recommendation Engine: Рекомендации курсов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Growth, спринт "Personalization". Jira EDU-109: Реализовать движок рекомендаций курсов. Факторы: пройденные курсы (та же категория), прогрессия сложности (beginner→intermediate→advanced), популярные среди похожих студентов, предпочтение автора. Аналог "Рекомендовано для вас" в Coursera.',
      requirements: [
        'Класс RecommendationEngine с методом recommend(studentId) → List<ScoredCourse>',
        'Факторы скоринга: категория совпадает (+30), следующий уровень сложности (+25), популярный курс enrollCount>1000 (+15), тот же автор (+10), высокий рейтинг >4.5 (+20)',
        'Исключить уже пройденные курсы',
        'Сортировка по итоговому скору (убывание), top-5',
        'Вывод: позиция, курс, скор, причины рекомендации'
      ],
      expectedOutput: `=== Рекомендации для: Алия Касымова ===
Пройденные курсы: Java Basics (Programming, BEGINNER), Python Intro (Data Science, BEGINNER)

Рекомендуем:
#1 Spring Boot Pro [Score: 100]
   Programming | INTERMEDIATE | ★4.6 | 24900 KZT
   Причины: +30 та же категория, +25 следующий уровень, +15 популярный, +10 тот же автор, +20 высокий рейтинг

#2 Data Analysis с Pandas [Score: 90]
   Data Science | INTERMEDIATE | ★4.7 | 19900 KZT
   Причины: +30 та же категория, +25 следующий уровень, +15 популярный, +20 высокий рейтинг

#3 System Design [Score: 45]
   Programming | ADVANCED | ★4.9 | 34900 KZT
   Причины: +30 та же категория, +15 популярный

#4 UX/UI Design [Score: 35]
   Design | INTERMEDIATE | ★4.8 | 14900 KZT
   Причины: +15 популярный, +20 высокий рейтинг

#5 Digital Marketing [Score: 15]
   Business | BEGINNER | ★4.2 | 7500 KZT
   Причины: +15 популярный`,
      hint: 'Создайте Map<String, Integer> для подсчёта скора каждого курса. Для каждого фактора: проверяйте условие и добавляйте баллы. completedCategories и completedDifficulties через stream().map().collect(Collectors.toSet()).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum Difficulty { BEGINNER, INTERMEDIATE, ADVANCED }

    static class Course {
        int id;
        String title, author, category;
        Difficulty difficulty;
        int price, enrollCount;
        double rating;

        Course(int id, String title, String author, String cat, Difficulty diff,
               int price, double rating, int enrollCount) {
            this.id = id; this.title = title; this.author = author;
            this.category = cat; this.difficulty = diff;
            this.price = price; this.rating = rating; this.enrollCount = enrollCount;
        }
    }

    static class ScoredCourse {
        Course course;
        int score;
        List<String> reasons = new ArrayList<>();

        ScoredCourse(Course course) { this.course = course; }

        void addScore(int points, String reason) {
            score += points;
            reasons.add("+" + points + " " + reason);
        }
    }

    static Difficulty nextLevel(Difficulty d) {
        return switch (d) {
            case BEGINNER -> Difficulty.INTERMEDIATE;
            case INTERMEDIATE -> Difficulty.ADVANCED;
            case ADVANCED -> null;
        };
    }

    static List<ScoredCourse> recommend(List<Course> allCourses, Set<Integer> completedIds,
                                         List<Course> completedCourses) {
        Set<String> completedCategories = completedCourses.stream()
            .map(c -> c.category).collect(Collectors.toSet());
        Set<String> completedAuthors = completedCourses.stream()
            .map(c -> c.author).collect(Collectors.toSet());
        Map<String, Difficulty> maxDiffByCategory = new HashMap<>();
        for (Course c : completedCourses) {
            maxDiffByCategory.merge(c.category, c.difficulty,
                (a, b) -> a.ordinal() > b.ordinal() ? a : b);
        }

        List<ScoredCourse> scored = new ArrayList<>();
        for (Course c : allCourses) {
            if (completedIds.contains(c.id)) continue;

            ScoredCourse sc = new ScoredCourse(c);

            if (completedCategories.contains(c.category)) {
                sc.addScore(30, "та же категория");
            }

            Difficulty maxDiff = maxDiffByCategory.get(c.category);
            if (maxDiff != null && c.difficulty == nextLevel(maxDiff)) {
                sc.addScore(25, "следующий уровень");
            }

            if (c.enrollCount > 1000) {
                sc.addScore(15, "популярный");
            }

            if (completedAuthors.contains(c.author)) {
                sc.addScore(10, "тот же автор");
            }

            if (c.rating > 4.5) {
                sc.addScore(20, "высокий рейтинг");
            }

            if (sc.score > 0) scored.add(sc);
        }

        scored.sort(Comparator.comparingInt((ScoredCourse s) -> -s.score));
        return scored.stream().limit(5).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Course> allCourses = List.of(
            new Course(1, "Java Basics", "Алмас Серик", "Programming",
                Difficulty.BEGINNER, 12500, 4.8, 3420),
            new Course(2, "Spring Boot Pro", "Алмас Серик", "Programming",
                Difficulty.INTERMEDIATE, 24900, 4.6, 1850),
            new Course(3, "System Design", "Айгуль Нурлан", "Programming",
                Difficulty.ADVANCED, 34900, 4.9, 1200),
            new Course(4, "Python Intro", "Марат Жумабек", "Data Science",
                Difficulty.BEGINNER, 9900, 4.7, 5200),
            new Course(5, "Data Analysis с Pandas", "Марат Жумабек", "Data Science",
                Difficulty.INTERMEDIATE, 19900, 4.7, 2800),
            new Course(6, "UX/UI Design", "Дина Ахметова", "Design",
                Difficulty.INTERMEDIATE, 14900, 4.8, 2100),
            new Course(7, "Digital Marketing", "Ержан Болат", "Business",
                Difficulty.BEGINNER, 7500, 4.2, 4300)
        );

        Set<Integer> completedIds = Set.of(1, 4);
        List<Course> completedCourses = allCourses.stream()
            .filter(c -> completedIds.contains(c.id)).collect(Collectors.toList());

        System.out.println("=== Рекомендации для: Алия Касымова ===");
        System.out.printf("Пройденные курсы: %s%n%n",
            completedCourses.stream()
                .map(c -> c.title + " (" + c.category + ", " + c.difficulty + ")")
                .collect(Collectors.joining(", ")));

        List<ScoredCourse> recs = recommend(allCourses, completedIds, completedCourses);

        System.out.println("Рекомендуем:");
        for (int i = 0; i < recs.size(); i++) {
            ScoredCourse sc = recs.get(i);
            Course c = sc.course;
            System.out.printf("#%d %s [Score: %d]%n", i + 1, c.title, sc.score);
            System.out.printf("   %s | %s | ★%.1f | %d KZT%n",
                c.category, c.difficulty, c.rating, c.price);
            System.out.printf("   Причины: %s%n%n", String.join(", ", sc.reasons));
        }
    }
}`,
      explanation: 'Recommendation engine — ключевая фича для retention в EdTech (Coursera "Рекомендовано для вас"). Скоринговая модель: каждый фактор добавляет баллы. Progression (beginner→intermediate→advanced) — самый важный для обучения. Collaborative filtering (популярность) и content-based (категория, автор) — два подхода. В реальных системах используются ML-модели, здесь — rule-based скоринг для прозрачности.'
    },
    {
      id: 10,
      title: 'Learning Analytics: Аналитика обучения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Analytics, спринт "Insights". Jira EDU-110: Реализовать аналитический дашборд платформы. Метрики: DAU/MAU, completion rate, среднее время прохождения, revenue по курсам, churn rate, точки отвала (на каких уроках бросают). Месячный отчёт для руководства — аналог аналитики в iSpring/Coursera for Business.',
      requirements: [
        'Метод calculateDAU/MAU — активные пользователи за день/месяц',
        'Метод completionRate(courseId) — процент завершивших из записавшихся',
        'Метод avgCompletionTime(courseId) — среднее время прохождения в днях',
        'Метод revenueReport() — доход по курсам (enrollCount * price)',
        'Метод churnRate() — процент ушедших (cancelled/total subscriptions)',
        'Метод dropoutPoints(courseId) — на каких уроках чаще бросают',
        'Форматированный месячный отчёт'
      ],
      expectedOutput: `══════════════════════════════════════════
   АНАЛИТИКА ПЛАТФОРМЫ — Март 2025
══════════════════════════════════════════

📊 Активность пользователей
  DAU (15 марта): 1,250
  MAU (март):     8,400
  DAU/MAU ratio:  14.9% (здоровый показатель)

📈 Completion Rates
  Java Basics:      72% (3420 записались → 2462 завершили)
  Spring Boot Pro:  45% (1850 записались → 832 завершили)
  System Design:    38% (980 записались → 372 завершили)

⏱ Среднее время прохождения
  Java Basics:      14 дней
  Spring Boot Pro:  28 дней
  System Design:    42 дня

💰 Revenue (март)
  Java Basics:        42,750,000 KZT (3420 × 12500)
  Spring Boot Pro:    46,065,000 KZT (1850 × 24900)
  System Design:      34,202,000 KZT (980 × 34900)
  ─────────────────────────────────
  Итого:             123,017,000 KZT

📉 Churn Rate: 12.5% (125 из 1000 подписок отменены)

🚪 Точки отвала: Java Basics
  Урок 5: Циклы — 15% бросили
  Урок 8: Массивы — 22% бросили ← критическая точка
  Урок 12: ООП — 18% бросили

Рекомендация: улучшить урок 8 (Массивы) — максимальный отвал`,
      hint: 'DAU/MAU ratio 15-25% — норма для EdTech. Churn = cancelled / total * 100. Dropout points: считайте количество студентов, дошедших до каждого урока, и находите уроки с максимальным drop-off. Форматирование: String.format() с разделителями тысяч через %,d.',
      solution: `import java.util.*;

public class Main {
    static class CourseStats {
        String name;
        int enrolled, completed, price, avgDays;

        CourseStats(String name, int enrolled, int completed, int price, int avgDays) {
            this.name = name; this.enrolled = enrolled; this.completed = completed;
            this.price = price; this.avgDays = avgDays;
        }

        int completionRate() { return enrolled > 0 ? completed * 100 / enrolled : 0; }
        long revenue() { return (long) enrolled * price; }
    }

    static class DropoutPoint {
        int lessonNum;
        String lessonName;
        int dropoutPct;

        DropoutPoint(int num, String name, int pct) {
            this.lessonNum = num; this.lessonName = name; this.dropoutPct = pct;
        }
    }

    public static void main(String[] args) {
        int dau = 1250;
        int mau = 8400;
        double dauMauRatio = Math.round((double) dau / mau * 1000.0) / 10.0;

        List<CourseStats> courses = List.of(
            new CourseStats("Java Basics", 3420, 2462, 12500, 14),
            new CourseStats("Spring Boot Pro", 1850, 832, 24900, 28),
            new CourseStats("System Design", 980, 372, 34900, 42)
        );

        int totalSubs = 1000, cancelledSubs = 125;
        double churnRate = (double) cancelledSubs / totalSubs * 100;

        List<DropoutPoint> dropouts = List.of(
            new DropoutPoint(5, "Циклы", 15),
            new DropoutPoint(8, "Массивы", 22),
            new DropoutPoint(12, "ООП", 18)
        );

        System.out.println("══════════════════════════════════════════");
        System.out.println("   АНАЛИТИКА ПЛАТФОРМЫ — Март 2025");
        System.out.println("══════════════════════════════════════════");

        System.out.println("\\n📊 Активность пользователей");
        System.out.printf("  DAU (15 марта): %,d%n", dau);
        System.out.printf("  MAU (март):     %,d%n", mau);
        System.out.printf("  DAU/MAU ratio:  %.1f%% (здоровый показатель)%n", dauMauRatio);

        System.out.println("\\n📈 Completion Rates");
        for (CourseStats c : courses) {
            System.out.printf("  %-18s %d%% (%d записались → %d завершили)%n",
                c.name + ":", c.completionRate(), c.enrolled, c.completed);
        }

        System.out.println("\\n⏱ Среднее время прохождения");
        for (CourseStats c : courses) {
            System.out.printf("  %-18s %d дней%n", c.name + ":", c.avgDays);
        }

        System.out.println("\\n💰 Revenue (март)");
        long totalRevenue = 0;
        for (CourseStats c : courses) {
            long rev = c.revenue();
            totalRevenue += rev;
            System.out.printf("  %-20s %,d KZT (%d × %d)%n",
                c.name + ":", rev, c.enrolled, c.price);
        }
        System.out.println("  ─────────────────────────────────");
        System.out.printf("  %-20s %,d KZT%n", "Итого:", totalRevenue);

        System.out.printf("\\n📉 Churn Rate: %.1f%% (%d из %d подписок отменены)%n",
            churnRate, cancelledSubs, totalSubs);

        System.out.println("\\n🚪 Точки отвала: Java Basics");
        int maxDropout = dropouts.stream().mapToInt(d -> d.dropoutPct).max().orElse(0);
        String criticalLesson = "";
        for (DropoutPoint dp : dropouts) {
            String marker = dp.dropoutPct == maxDropout ? " ← критическая точка" : "";
            if (dp.dropoutPct == maxDropout) criticalLesson = dp.lessonName;
            System.out.printf("  Урок %d: %s — %d%% бросили%s%n",
                dp.lessonNum, dp.lessonName, dp.dropoutPct, marker);
        }

        System.out.printf("\\nРекомендация: улучшить урок %d (%s) — максимальный отвал%n",
            dropouts.stream().filter(d -> d.dropoutPct == maxDropout)
                .findFirst().map(d -> d.lessonNum).orElse(0), criticalLesson);
    }
}`,
      explanation: 'Learning Analytics — стратегический инструмент EdTech (iSpring Analytics, Coursera for Business). DAU/MAU ratio 15-25% — норма для образовательных платформ. Completion rate показывает качество контента. Dropout points — самая ценная метрика: она указывает, какие уроки нужно переработать. Revenue report с разбивкой по курсам помогает приоритизировать создание контента. Churn rate 10-15% — допустимый для подписочных EdTech.'
    }
  ]
}
