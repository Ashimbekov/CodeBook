export default {
  id: 101,
  title: 'Реальная разработка: Стриминг-платформа',
  description: 'Задачи backend-разработчика в стриминге: каталог контента, подписки, рекомендации, просмотры, плейлисты и аналитика.',
  lessons: [
    {
      id: 1,
      title: 'Content Catalog — фильтрация контента',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Content Team. STR-101: Реализовать фильтрацию каталога контента по жанру, минимальному рейтингу и году выпуска. Каталог содержит фильмы и сериалы. Пользователь задаёт фильтры — получает отсортированный по рейтингу список (от высокого к низкому).',
      requirements: [
        'Record Content(String title, String genre, int year, double rating, String type) — type: "movie" или "series"',
        'Метод filterContent(List<Content>, String genre, double minRating, int fromYear) возвращает List<Content>',
        'Фильтрация: если genre != null — по жанру, minRating > 0 — по рейтингу, fromYear > 0 — год >= fromYear',
        'Сортировка по рейтингу убывание',
        'Вывести: "title (year) — genre, rating: X.X"'
      ],
      expectedOutput: 'Stranger Things (2016) — sci-fi, rating: 8.7\nBlack Mirror (2011) — sci-fi, rating: 8.5\n---\nBreaking Bad (2008) — drama, rating: 9.5\nThe Shawshank Redemption (1994) — drama, rating: 9.3',
      hint: 'Используй record для Content. Stream API: filter по каждому критерию, sorted(Comparator.comparingDouble(Content::rating).reversed()), map для форматирования.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Content(String title, String genre, int year, double rating, String type) {}

    static List<String> filterContent(List<Content> catalog, String genre, double minRating, int fromYear) {
        return catalog.stream()
                .filter(c -> genre == null || c.genre().equals(genre))
                .filter(c -> minRating <= 0 || c.rating() >= minRating)
                .filter(c -> fromYear <= 0 || c.year() >= fromYear)
                .sorted(Comparator.comparingDouble(Content::rating).reversed())
                .map(c -> String.format("%s (%d) — %s, rating: %.1f",
                        c.title(), c.year(), c.genre(), c.rating()))
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Content> catalog = List.of(
            new Content("Stranger Things", "sci-fi", 2016, 8.7, "series"),
            new Content("Breaking Bad", "drama", 2008, 9.5, "series"),
            new Content("The Shawshank Redemption", "drama", 1994, 9.3, "movie"),
            new Content("Black Mirror", "sci-fi", 2011, 8.5, "series"),
            new Content("Interstellar", "sci-fi", 2014, 8.6, "movie"),
            new Content("The Room", "drama", 2003, 3.6, "movie")
        );

        filterContent(catalog, "sci-fi", 8.0, 2010).forEach(System.out::println);
        System.out.println("---");
        filterContent(catalog, "drama", 9.0, 0).forEach(System.out::println);
    }
}`,
      explanation: 'В Netflix каталог содержит более 15 000 единиц контента. Фильтрация — базовая операция Discovery API. В реальности каталог хранится в Cassandra/ElasticSearch, а фильтрация сочетает полнотекстовый поиск с фасетными фильтрами. YouTube использует похожую систему для поиска по категориям. Кинопоиск реализует многоуровневые фильтры: жанр, год, страна, рейтинг, тип контента.'
    },
    {
      id: 2,
      title: 'Subscription Plans — управление тарифами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Subscription Team. STR-115: Реализовать систему тарифных планов. Три плана: Free (0 KZT, 480p, реклама, 1 устройство), Basic (2990 KZT, 1080p, без рекламы, 2 устройства), Premium (4990 KZT, 4K, без рекламы, 4 устройства). Проверить доступ пользователя к функциям.',
      requirements: [
        'Enum Plan с полями: name, priceKzt, maxQuality, adsEnabled, maxDevices',
        'Plan.FREE(0, "480p", true, 1), Plan.BASIC(2990, "1080p", false, 2), Plan.PREMIUM(4990, "4K", false, 4)',
        'Метод canWatch(Plan plan, String requestedQuality) — проверяет, доступно ли качество',
        'Иерархия качества: 480p < 720p < 1080p < 4K',
        'Метод monthlyReport(Plan plan, int months) — итоговая стоимость за N месяцев',
        'Вывести информацию о каждом плане и проверки доступа'
      ],
      expectedOutput: 'FREE: 0 KZT, 480p, ads: true, devices: 1\nBASIC: 2990 KZT, 1080p, ads: false, devices: 2\nPREMIUM: 4990 KZT, 4K, ads: false, devices: 4\n---\nFREE -> 1080p: false\nBASIC -> 1080p: true\nPREMIUM -> 4K: true\n---\nBASIC x 12 months = 35880 KZT',
      hint: 'Используй enum с конструктором и полями. Для сравнения качества создай Map<String, Integer> с порядковыми номерами: 480p=1, 720p=2, 1080p=3, 4K=4.',
      solution: `import java.util.Map;

public class Main {
    static final Map<String, Integer> QUALITY_ORDER = Map.of(
            "480p", 1, "720p", 2, "1080p", 3, "4K", 4);

    enum Plan {
        FREE(0, "480p", true, 1),
        BASIC(2990, "1080p", false, 2),
        PREMIUM(4990, "4K", false, 4);

        final int priceKzt;
        final String maxQuality;
        final boolean adsEnabled;
        final int maxDevices;

        Plan(int priceKzt, String maxQuality, boolean adsEnabled, int maxDevices) {
            this.priceKzt = priceKzt;
            this.maxQuality = maxQuality;
            this.adsEnabled = adsEnabled;
            this.maxDevices = maxDevices;
        }
    }

    static boolean canWatch(Plan plan, String requestedQuality) {
        return QUALITY_ORDER.get(requestedQuality) <= QUALITY_ORDER.get(plan.maxQuality);
    }

    static long monthlyReport(Plan plan, int months) {
        return (long) plan.priceKzt * months;
    }

    public static void main(String[] args) {
        for (Plan p : Plan.values()) {
            System.out.printf("%s: %d KZT, %s, ads: %b, devices: %d%n",
                    p.name(), p.priceKzt, p.maxQuality, p.adsEnabled, p.maxDevices);
        }
        System.out.println("---");
        System.out.println("FREE -> 1080p: " + canWatch(Plan.FREE, "1080p"));
        System.out.println("BASIC -> 1080p: " + canWatch(Plan.BASIC, "1080p"));
        System.out.println("PREMIUM -> 4K: " + canWatch(Plan.PREMIUM, "4K"));
        System.out.println("---");
        System.out.println("BASIC x 12 months = " + monthlyReport(Plan.BASIC, 12) + " KZT");
    }
}`,
      explanation: 'Netflix использует 4 тарифных плана с разным качеством видео и количеством экранов. Spotify разделяет Free (с рекламой) и Premium. YouTube Premium убирает рекламу и даёт офлайн-доступ. В backend это реализуется через enum или таблицу plans с feature flags. При каждом запросе на воспроизведение middleware проверяет план пользователя и ограничивает битрейт/качество. Кинопоиск использует похожую модель: бесплатный каталог + подписка для премиум-контента.'
    },
    {
      id: 3,
      title: 'Watch History — история просмотров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Playback Team. STR-203: Реализовать систему истории просмотров с функцией "продолжить просмотр". Для каждого пользователя хранить последнюю позицию просмотра (в секундах) и общую длительность контента. Определять статус: не начат, в процессе, просмотрен (если >= 90% просмотрено).',
      requirements: [
        'Record WatchRecord(String contentTitle, int durationSec, int watchedSec, long timestampMs)',
        'Метод getStatus(WatchRecord) возвращает "not_started" / "in_progress" / "completed"',
        'Completed если watchedSec >= 90% от durationSec',
        'Метод getContinueWatching(List<WatchRecord>) — только in_progress, сортировка по timestamp (новые первые)',
        'Метод formatPosition(int seconds) — "MM:SS" или "H:MM:SS"',
        'Вывести continue-watching список с позицией'
      ],
      expectedOutput: 'Inception: in_progress at 1:25:00 / 2:28:00\nThe Matrix: in_progress at 45:30 / 2:16:00\n---\nDune: completed\nShort Film: not_started',
      hint: 'Для форматирования времени: hours = sec / 3600, minutes = (sec % 3600) / 60, secs = sec % 60. Для "continue watching" используй Stream filter + sorted по timestampMs reversed.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record WatchRecord(String contentTitle, int durationSec, int watchedSec, long timestampMs) {}

    static String getStatus(WatchRecord wr) {
        if (wr.watchedSec() == 0) return "not_started";
        if (wr.watchedSec() >= wr.durationSec() * 0.9) return "completed";
        return "in_progress";
    }

    static List<WatchRecord> getContinueWatching(List<WatchRecord> history) {
        return history.stream()
                .filter(wr -> getStatus(wr).equals("in_progress"))
                .sorted(Comparator.comparingLong(WatchRecord::timestampMs).reversed())
                .collect(Collectors.toList());
    }

    static String formatPosition(int totalSec) {
        int hours = totalSec / 3600;
        int minutes = (totalSec % 3600) / 60;
        int secs = totalSec % 60;
        if (hours > 0) return String.format("%d:%02d:%02d", hours, minutes, secs);
        return String.format("%d:%02d", minutes, secs);
    }

    public static void main(String[] args) {
        List<WatchRecord> history = List.of(
            new WatchRecord("Inception", 8880, 5100, 1700000003000L),
            new WatchRecord("The Matrix", 8160, 2730, 1700000001000L),
            new WatchRecord("Dune", 9360, 9000, 1700000002000L),
            new WatchRecord("Short Film", 600, 0, 1700000000000L)
        );

        getContinueWatching(history).forEach(wr ->
            System.out.printf("%s: in_progress at %s / %s%n",
                    wr.contentTitle(), formatPosition(wr.watchedSec()), formatPosition(wr.durationSec()))
        );
        System.out.println("---");
        System.out.println("Dune: " + getStatus(history.get(2)));
        System.out.println("Short Film: " + getStatus(history.get(3)));
    }
}`,
      explanation: 'Функция "Continue Watching" — одна из самых важных в Netflix и YouTube. Netflix сохраняет позицию просмотра каждые 10 секунд в Apache Kafka, откуда данные попадают в Cassandra. Порог "просмотрено" (90%) используется для подсчёта статистики и рекомендаций. YouTube хранит прогресс в Redis для быстрого доступа. Spotify аналогично отслеживает позицию подкастов. Кинопоиск реализует "Продолжить просмотр" на главной странице как приоритетный виджет.'
    },
    {
      id: 4,
      title: 'Playlist Manager — управление плейлистами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Content Team. STR-220: Реализовать менеджер плейлистов. Поддержать операции: создание, добавление контента, удаление, перемещение элемента на новую позицию, вычисление общей длительности. Плейлист имеет название и максимум 50 элементов.',
      requirements: [
        'Класс Playlist с полями: name, List<String> items, Map<String, Integer> durations (название -> длительность в секундах)',
        'Метод add(String item, int durationSec) — добавить в конец (макс 50)',
        'Метод remove(String item) — удалить из плейлиста',
        'Метод move(int fromIndex, int toIndex) — переместить элемент',
        'Метод totalDuration() — общая длительность в формате "Xh Ym"',
        'Метод display() — вывести пронумерованный список'
      ],
      expectedOutput: 'My Playlist (3 items, 5h 42m):\n1. Inception (2h 28m)\n2. The Dark Knight (2h 32m)\n3. Interstellar (42m)\n---\nAfter move:\n1. Interstellar (42m)\n2. Inception (2h 28m)\n3. The Dark Knight (2h 32m)\n---\nAfter remove:\n1. Interstellar (42m)\n2. The Dark Knight (2h 32m)',
      hint: 'Используй ArrayList для items и HashMap для durations. move: удали элемент по fromIndex, вставь по toIndex. totalDuration: суммируй values из durations map для items в плейлисте.',
      solution: `import java.util.*;

public class Main {
    static class Playlist {
        String name;
        List<String> items = new ArrayList<>();
        Map<String, Integer> durations = new HashMap<>();

        Playlist(String name) { this.name = name; }

        boolean add(String item, int durationSec) {
            if (items.size() >= 50) return false;
            items.add(item);
            durations.put(item, durationSec);
            return true;
        }

        boolean remove(String item) {
            durations.remove(item);
            return items.remove(item);
        }

        void move(int fromIndex, int toIndex) {
            String item = items.remove(fromIndex);
            items.add(toIndex, item);
        }

        String totalDuration() {
            int total = items.stream().mapToInt(i -> durations.getOrDefault(i, 0)).sum();
            int hours = total / 3600;
            int minutes = (total % 3600) / 60;
            if (hours > 0) return hours + "h " + minutes + "m";
            return minutes + "m";
        }

        String formatDuration(String item) {
            int sec = durations.getOrDefault(item, 0);
            int h = sec / 3600;
            int m = (sec % 3600) / 60;
            if (h > 0) return h + "h " + m + "m";
            return m + "m";
        }

        void display() {
            System.out.println(name + " (" + items.size() + " items, " + totalDuration() + "):");
            for (int i = 0; i < items.size(); i++) {
                System.out.println((i + 1) + ". " + items.get(i) + " (" + formatDuration(items.get(i)) + ")");
            }
        }
    }

    public static void main(String[] args) {
        Playlist pl = new Playlist("My Playlist");
        pl.add("Inception", 8880);
        pl.add("The Dark Knight", 9120);
        pl.add("Interstellar", 2520);
        pl.display();
        System.out.println("---");
        pl.move(2, 0);
        System.out.println("After move:");
        pl.display();
        System.out.println("---");
        pl.remove("Inception");
        System.out.println("After remove:");
        pl.display();
    }
}`,
      explanation: 'Плейлисты — ключевая фича YouTube и Spotify. YouTube хранит плейлисты в Spanner (распределённая БД Google) с поддержкой до 5000 видео. Spotify хранит плейлисты в Cassandra, а операции reorder используют fractional indexing (дробные индексы) для эффективного перемещения без перенумерации. Netflix использует аналогичную концепцию для "Мой список". Операция move — самая сложная: в реальности используют linked-list подход или order-column с перебалансировкой.'
    },
    {
      id: 5,
      title: 'Content Recommendation — рекомендации контента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Personalization Team. STR-305: Реализовать простую систему рекомендаций на основе жанровых предпочтений. Проанализировать историю просмотров пользователя, определить топ-жанры (по количеству просмотров), рекомендовать непросмотренный контент из этих жанров с наивысшим рейтингом.',
      requirements: [
        'Record Content(String title, String genre, double rating)',
        'Метод getTopGenres(List<String> watchedGenres, int topN) — топ-N жанров по частоте',
        'Метод recommend(List<Content> catalog, List<String> watchedTitles, List<String> watchedGenres, int limit) — рекомендации',
        'Исключить уже просмотренный контент',
        'Сортировать по рейтингу убывание',
        'Вернуть не более limit рекомендаций'
      ],
      expectedOutput: 'Топ жанры: [sci-fi, drama]\n---\nРекомендации:\nInterstellar (sci-fi) — 8.6\nBlack Mirror (sci-fi) — 8.5\nThe Godfather (drama) — 9.2',
      hint: 'Для подсчёта жанров используй Map<String, Long> с Collectors.groupingBy + Collectors.counting(). Сортируй по value descending, бери topN.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Content(String title, String genre, double rating) {}

    static List<String> getTopGenres(List<String> watchedGenres, int topN) {
        return watchedGenres.stream()
                .collect(Collectors.groupingBy(g -> g, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(topN)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    static List<Content> recommend(List<Content> catalog, List<String> watchedTitles,
                                    List<String> watchedGenres, int limit) {
        List<String> topGenres = getTopGenres(watchedGenres, 2);
        Set<String> watched = new HashSet<>(watchedTitles);
        return catalog.stream()
                .filter(c -> !watched.contains(c.title()))
                .filter(c -> topGenres.contains(c.genre()))
                .sorted(Comparator.comparingDouble(Content::rating).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Content> catalog = List.of(
            new Content("Stranger Things", "sci-fi", 8.7),
            new Content("Interstellar", "sci-fi", 8.6),
            new Content("Black Mirror", "sci-fi", 8.5),
            new Content("The Godfather", "drama", 9.2),
            new Content("Breaking Bad", "drama", 9.5),
            new Content("Comedy Show", "comedy", 7.0),
            new Content("Dune", "sci-fi", 8.0)
        );
        List<String> watchedTitles = List.of("Stranger Things", "Breaking Bad", "Dune");
        List<String> watchedGenres = List.of("sci-fi", "drama", "sci-fi", "sci-fi", "drama");

        System.out.println("Топ жанры: " + getTopGenres(watchedGenres, 2));
        System.out.println("---");
        System.out.println("Рекомендации:");
        recommend(catalog, watchedTitles, watchedGenres, 3)
                .forEach(c -> System.out.printf("%s (%s) — %.1f%n", c.title(), c.genre(), c.rating()));
    }
}`,
      explanation: 'Netflix тратит $1.5 млрд в год на систему рекомендаций. Их алгоритм использует collaborative filtering, content-based filtering и deep learning. Наш подход — упрощённый content-based: анализируем жанровые предпочтения. YouTube использует двухфазную систему: candidate generation (отбор 1000 кандидатов) и ranking (ранжирование). Spotify Discover Weekly анализирует жанры, артистов и аудиофичи треков. Кинопоиск комбинирует рейтинг IMDb, жанровые предпочтения и социальный граф.'
    },
    {
      id: 6,
      title: 'Bandwidth Calculator — адаптивный битрейт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Playback Team. STR-318: Реализовать калькулятор адаптивного битрейта (ABR). По скорости интернета пользователя определить максимальное доступное качество видео. Качества: 360p (1.5 Mbps), 480p (4 Mbps), 720p (7.5 Mbps), 1080p (12 Mbps), 4K (25 Mbps). Рассчитать потребление трафика за время просмотра.',
      requirements: [
        'Record QualityProfile(String label, double bitrateMbps)',
        'Метод selectQuality(double bandwidthMbps) — выбрать максимальное качество, не превышающее 80% пропускной способности',
        'Метод calculateDataUsage(String quality, int durationMinutes) — трафик в GB',
        'Формула: bitrateMbps * durationMinutes * 60 / 8 / 1024 (GB)',
        'Метод estimateMonthlyUsage(String quality, int hoursPerDay) — месячный трафик в GB',
        'Вывести таблицу качество-трафик для разных скоростей'
      ],
      expectedOutput: 'Скорость 5.0 Mbps -> 480p (4.0 Mbps)\nСкорость 10.0 Mbps -> 720p (7.5 Mbps)\nСкорость 50.0 Mbps -> 4K (25.0 Mbps)\n---\n1080p, 2 часа: 10.5 GB\n4K, 2 часа: 21.97 GB\n---\nМесячный трафик (1080p, 3ч/день): 158.2 GB',
      hint: 'Для selectQuality: отфильтруй профили где bitrate <= bandwidth * 0.8, выбери максимальный. Порог 80% нужен для буферизации. Используй TreeMap или sorted stream.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record QualityProfile(String label, double bitrateMbps) {}

    static final List<QualityProfile> PROFILES = List.of(
        new QualityProfile("360p", 1.5),
        new QualityProfile("480p", 4.0),
        new QualityProfile("720p", 7.5),
        new QualityProfile("1080p", 12.0),
        new QualityProfile("4K", 25.0)
    );

    static QualityProfile selectQuality(double bandwidthMbps) {
        double usable = bandwidthMbps * 0.8;
        return PROFILES.stream()
                .filter(p -> p.bitrateMbps() <= usable)
                .reduce((a, b) -> b)
                .orElse(PROFILES.get(0));
    }

    static double calculateDataUsage(String quality, int durationMinutes) {
        double bitrate = PROFILES.stream()
                .filter(p -> p.label().equals(quality))
                .findFirst().orElseThrow().bitrateMbps();
        return Math.round(bitrate * durationMinutes * 60 / 8 / 1024 * 100.0) / 100.0;
    }

    static double estimateMonthlyUsage(String quality, int hoursPerDay) {
        double daily = calculateDataUsage(quality, hoursPerDay * 60);
        return Math.round(daily * 30 * 10.0) / 10.0;
    }

    public static void main(String[] args) {
        for (double speed : new double[]{5.0, 10.0, 50.0}) {
            QualityProfile qp = selectQuality(speed);
            System.out.printf("Скорость %.1f Mbps -> %s (%.1f Mbps)%n", speed, qp.label(), qp.bitrateMbps());
        }
        System.out.println("---");
        System.out.printf("1080p, 2 часа: %.1f GB%n", calculateDataUsage("1080p", 120));
        System.out.printf("4K, 2 часа: %.2f GB%n", calculateDataUsage("4K", 120));
        System.out.println("---");
        System.out.printf("Месячный трафик (1080p, 3ч/день): %.1f GB%n", estimateMonthlyUsage("1080p", 3));
    }
}`,
      explanation: 'Адаптивный битрейт (ABR) — основа стриминга. Netflix использует алгоритм на основе буфера: если буфер заполнен — повышаем качество, если пустеет — понижаем. YouTube переключает качество за 2-5 секунд. Порог 80% пропускной способности оставляет запас для буферизации и фоновых процессов. HLS (Apple) и DASH (YouTube) — два основных протокола адаптивного стриминга. Netflix видео закодировано в 12+ качествах, и ABR выбирает оптимальное для каждого сегмента (4 секунды).'
    },
    {
      id: 7,
      title: 'Royalty Calculator — расчёт роялти',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Content Team. STR-330: Реализовать систему расчёта роялти для авторов контента. Модель: за каждый стрим (просмотр > 30 сек) автор получает долю из revenue pool. Ставка зависит от типа контента и региона. Музыка: 0.004$/стрим, Видео: 0.02$/стрим, Подкасты: 0.01$/стрим. Региональный коэффициент: US=1.0, EU=0.8, CIS=0.3.',
      requirements: [
        'Record RoyaltyEntry(String author, String contentType, String region, long streams)',
        'Метод calculateRoyalty(RoyaltyEntry entry) — роялти в USD',
        'Метод generateReport(List<RoyaltyEntry>) — отчёт: группировка по автору, итоговые выплаты',
        'Базовые ставки: music=0.004, video=0.02, podcast=0.01',
        'Региональные коэффициенты: US=1.0, EU=0.8, CIS=0.3',
        'Вывести отчёт с итогами по авторам'
      ],
      expectedOutput: 'Отчёт по роялти:\nArtist_A: music(US) 50000 streams = $200.00\nArtist_A: music(CIS) 200000 streams = $240.00\nArtist_A итого: $440.00\n---\nDirector_B: video(EU) 10000 streams = $160.00\nDirector_B итого: $160.00\n---\nОбщий фонд: $600.00',
      hint: 'Используй Map для ставок и коэффициентов. Для группировки: Collectors.groupingBy по author. Форматируй через String.format("$%.2f", amount).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record RoyaltyEntry(String author, String contentType, String region, long streams) {}

    static final Map<String, Double> BASE_RATES = Map.of(
            "music", 0.004, "video", 0.02, "podcast", 0.01);
    static final Map<String, Double> REGION_COEFF = Map.of(
            "US", 1.0, "EU", 0.8, "CIS", 0.3);

    static double calculateRoyalty(RoyaltyEntry entry) {
        double rate = BASE_RATES.getOrDefault(entry.contentType(), 0.0);
        double coeff = REGION_COEFF.getOrDefault(entry.region(), 0.5);
        return entry.streams() * rate * coeff;
    }

    static void generateReport(List<RoyaltyEntry> entries) {
        System.out.println("Отчёт по роялти:");
        Map<String, List<RoyaltyEntry>> byAuthor = entries.stream()
                .collect(Collectors.groupingBy(RoyaltyEntry::author, LinkedHashMap::new, Collectors.toList()));
        double grandTotal = 0;
        for (var entry : byAuthor.entrySet()) {
            double authorTotal = 0;
            for (RoyaltyEntry re : entry.getValue()) {
                double royalty = calculateRoyalty(re);
                authorTotal += royalty;
                System.out.printf("%s: %s(%s) %d streams = $%.2f%n",
                        re.author(), re.contentType(), re.region(), re.streams(), royalty);
            }
            System.out.printf("%s итого: $%.2f%n", entry.getKey(), authorTotal);
            grandTotal += authorTotal;
            System.out.println("---");
        }
        System.out.printf("Общий фонд: $%.2f%n", grandTotal);
    }

    public static void main(String[] args) {
        List<RoyaltyEntry> entries = List.of(
            new RoyaltyEntry("Artist_A", "music", "US", 50000),
            new RoyaltyEntry("Artist_A", "music", "CIS", 200000),
            new RoyaltyEntry("Director_B", "video", "EU", 10000)
        );
        generateReport(entries);
    }
}`,
      explanation: 'Spotify выплачивает артистам ~$0.003-0.005 за стрим через модель pro-rata: общий revenue pool делится пропорционально стримам. YouTube платит авторам ~55% рекламного дохода. Netflix покупает лицензии фиксированными суммами, но для оригиналов использует бонусы за просмотры. Региональные коэффициенты отражают разницу в доходности рекламы: CPM в US ~$20-30, в СНГ ~$2-5. Кинопоиск и IVI платят роялти правообладателям по модели revenue share.'
    },
    {
      id: 8,
      title: 'Parental Controls — родительский контроль',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Content Team. STR-345: Реализовать систему родительского контроля. Возрастные рейтинги: 0+, 6+, 12+, 16+, 18+. У каждого профиля — максимальный допустимый рейтинг. Фильтрация каталога по профилю. PIN-код для переключения на взрослый профиль.',
      requirements: [
        'Enum AgeRating: ALL(0), AGE_6(6), AGE_12(12), AGE_16(16), AGE_18(18)',
        'Record UserProfile(String name, AgeRating maxRating, String pin)',
        'Record Content(String title, AgeRating rating)',
        'Метод filterByProfile(List<Content>, UserProfile) — доступный контент',
        'Метод canAccess(Content, UserProfile) — проверка доступа',
        'Метод switchProfile(UserProfile target, String enteredPin) — проверка PIN',
        'Вывести результаты фильтрации для детского и взрослого профиля'
      ],
      expectedOutput: 'Профиль: Ребёнок (макс: 12+)\nМультфильм (0+) — доступен\nГарри Поттер (12+) — доступен\nМстители (16+) — заблокирован\nДэдпул (18+) — заблокирован\n---\nПрофиль: Взрослый (макс: 18+)\nДоступно: 4 из 4\n---\nСмена профиля (PIN 1234): true\nСмена профиля (PIN 0000): false',
      hint: 'Для сравнения рейтингов используй age-значение enum: content.rating.age <= profile.maxRating.age. Enum может хранить числовое значение в поле.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum AgeRating {
        ALL(0, "0+"), AGE_6(6, "6+"), AGE_12(12, "12+"), AGE_16(16, "16+"), AGE_18(18, "18+");

        final int age;
        final String label;

        AgeRating(int age, String label) { this.age = age; this.label = label; }
    }

    record UserProfile(String name, AgeRating maxRating, String pin) {}
    record Content(String title, AgeRating rating) {}

    static boolean canAccess(Content content, UserProfile profile) {
        return content.rating().age <= profile.maxRating().age;
    }

    static List<Content> filterByProfile(List<Content> catalog, UserProfile profile) {
        return catalog.stream()
                .filter(c -> canAccess(c, profile))
                .collect(Collectors.toList());
    }

    static boolean switchProfile(UserProfile target, String enteredPin) {
        return target.pin() != null && target.pin().equals(enteredPin);
    }

    public static void main(String[] args) {
        List<Content> catalog = List.of(
            new Content("Мультфильм", AgeRating.ALL),
            new Content("Гарри Поттер", AgeRating.AGE_12),
            new Content("Мстители", AgeRating.AGE_16),
            new Content("Дэдпул", AgeRating.AGE_18)
        );

        UserProfile child = new UserProfile("Ребёнок", AgeRating.AGE_12, null);
        UserProfile adult = new UserProfile("Взрослый", AgeRating.AGE_18, "1234");

        System.out.println("Профиль: " + child.name() + " (макс: " + child.maxRating().label + ")");
        for (Content c : catalog) {
            String status = canAccess(c, child) ? "доступен" : "заблокирован";
            System.out.println(c.title() + " (" + c.rating().label + ") — " + status);
        }
        System.out.println("---");
        System.out.println("Профиль: " + adult.name() + " (макс: " + adult.maxRating().label + ")");
        System.out.println("Доступно: " + filterByProfile(catalog, adult).size() + " из " + catalog.size());
        System.out.println("---");
        System.out.println("Смена профиля (PIN 1234): " + switchProfile(adult, "1234"));
        System.out.println("Смена профиля (PIN 0000): " + switchProfile(adult, "0000"));
    }
}`,
      explanation: 'Netflix поддерживает до 5 профилей с индивидуальными возрастными ограничениями. Детский профиль "Netflix Kids" автоматически фильтрует контент. YouTube Kids — отдельное приложение с курированным контентом. PIN-код при переключении профиля — стандарт безопасности. В СНГ Кинопоиск использует российскую систему маркировки (0+, 6+, 12+, 16+, 18+). Disney+ автоматически предлагает детский режим при обнаружении профилей с ограничениями.'
    },
    {
      id: 9,
      title: 'Trending Algorithm — алгоритм трендов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Growth Team. STR-410: Реализовать алгоритм определения трендового контента. Формула: trendScore = (viewsLast24h * 0.4 + likesLast24h * 10 * 0.3 + commentsLast24h * 20 * 0.2 + sharesLast24h * 30 * 0.1) / hoursSincePublish^0.5. Учесть decay factor (убывание релевантности со временем). Выбрать Top-N трендов.',
      requirements: [
        'Record ContentStats(String title, long viewsLast24h, long likesLast24h, long commentsLast24h, long sharesLast24h, int hoursSincePublish)',
        'Метод calculateTrendScore(ContentStats) — расчёт по формуле',
        'Decay factor: делить на sqrt(hoursSincePublish), минимум 1 час',
        'Метод getTopTrending(List<ContentStats>, int topN) — топ-N по trendScore',
        'Метод formatTrending(ContentStats, int rank) — формат: "#rank Title — score: X.XX (views/likes/comments/shares)"',
        'Вывести топ-5 трендов с детализацией'
      ],
      expectedOutput: '#1 Viral Dance Video — score: 7320.00 (120000 views, 8000 likes, 500 comments, 2000 shares)\n#2 Breaking News Clip — score: 4740.00 (80000 views, 5000 likes, 1200 comments, 300 shares)\n#3 New Movie Trailer — score: 2386.96 (50000 views, 3000 likes, 200 comments, 800 shares)\n#4 Music Video Premiere — score: 1157.38 (30000 views, 2000 likes, 150 comments, 100 shares)\n#5 Tech Review — score: 474.00 (10000 views, 700 likes, 80 comments, 50 shares)',
      hint: 'Формула: (views*0.4 + likes*10*0.3 + comments*20*0.2 + shares*30*0.1) / sqrt(max(1, hours)). Используй Comparator.comparingDouble с reversed() для сортировки. Math.sqrt для корня.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record ContentStats(String title, long viewsLast24h, long likesLast24h,
                        long commentsLast24h, long sharesLast24h, int hoursSincePublish) {}

    static double calculateTrendScore(ContentStats cs) {
        double engagement = cs.viewsLast24h() * 0.4
                + cs.likesLast24h() * 10 * 0.3
                + cs.commentsLast24h() * 20 * 0.2
                + cs.sharesLast24h() * 30 * 0.1;
        double decay = Math.sqrt(Math.max(1, cs.hoursSincePublish()));
        return engagement / decay;
    }

    static List<ContentStats> getTopTrending(List<ContentStats> stats, int topN) {
        return stats.stream()
                .sorted(Comparator.comparingDouble(Main::calculateTrendScore).reversed())
                .limit(topN)
                .collect(Collectors.toList());
    }

    static String formatTrending(ContentStats cs, int rank) {
        return String.format("#%d %s — score: %.2f (%d views, %d likes, %d comments, %d shares)",
                rank, cs.title(), calculateTrendScore(cs),
                cs.viewsLast24h(), cs.likesLast24h(), cs.commentsLast24h(), cs.sharesLast24h());
    }

    public static void main(String[] args) {
        List<ContentStats> stats = List.of(
            new ContentStats("Viral Dance Video", 120000, 8000, 500, 2000, 1),
            new ContentStats("Breaking News Clip", 80000, 5000, 1200, 300, 1),
            new ContentStats("New Movie Trailer", 50000, 3000, 200, 800, 3),
            new ContentStats("Music Video Premiere", 30000, 2000, 150, 100, 6),
            new ContentStats("Tech Review", 10000, 700, 80, 50, 2),
            new ContentStats("Old Meme Repost", 5000, 200, 30, 10, 48),
            new ContentStats("Cooking Tutorial", 3000, 400, 60, 20, 24)
        );

        List<ContentStats> trending = getTopTrending(stats, 5);
        for (int i = 0; i < trending.size(); i++) {
            System.out.println(formatTrending(trending.get(i), i + 1));
        }
    }
}`,
      explanation: 'YouTube Trending использует комбинацию views velocity (скорость набора просмотров), engagement (лайки, комментарии) и diversity (разнообразие тем). Алгоритм обновляется каждые 15 минут. Twitter/X Trending анализирует скорость роста упоминаний (velocity) с decay factor. Netflix "Топ-10" обновляется ежедневно на основе часов просмотра. Наша формула — упрощённая версия: decay через sqrt(time) обеспечивает плавное убывание. Spotify Viral 50 использует отношение shares/streams для обнаружения вирусного контента.'
    },
    {
      id: 10,
      title: 'A/B Test Framework — фреймворк для A/B тестов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Growth Team. STR-425: Реализовать фреймворк для A/B тестирования. Распределять пользователей по группам (control/variant) на основе hash от userId. Собирать метрики (CTR, retention, watch time). Определять победителя по статистической значимости (упрощённо: разница > 5% и размер выборки > 1000).',
      requirements: [
        'Record Experiment(String name, String metricName, double controlValue, double variantValue, int controlSize, int variantSize)',
        'Метод assignGroup(String userId, String experimentName) — "control" или "variant" (50/50 на основе hash)',
        'Метод calculateLift(Experiment) — процентный прирост (variant - control) / control * 100',
        'Метод isSignificant(Experiment) — значим ли результат (|lift| > 5% И обе группы > 1000)',
        'Метод getWinner(Experiment) — "control", "variant" или "not_significant"',
        'Метод generateReport(List<Experiment>) — отчёт по всем экспериментам'
      ],
      expectedOutput: 'Распределение пользователей:\nuser_123 -> new_homepage: variant\nuser_456 -> new_homepage: control\nuser_789 -> new_homepage: variant\n---\nA/B Test Report:\n[new_homepage] CTR: control=3.20% vs variant=3.80% | lift: +18.75% | SIGNIFICANT -> variant wins\n[rec_algorithm] retention: control=45.00% vs variant=44.50% | lift: -1.11% | NOT SIGNIFICANT -> not_significant\n[pricing_page] conversion: control=2.10% vs variant=2.90% | lift: +38.10% | SIGNIFICANT -> variant wins',
      hint: 'Для hash-распределения: Math.abs((userId + experimentName).hashCode()) % 2 == 0 -> control, иначе variant. Для lift: (variant - control) / control * 100. Significant если abs(lift) > 5 и оба size > 1000.',
      solution: `import java.util.*;

public class Main {
    record Experiment(String name, String metricName, double controlValue, double variantValue,
                      int controlSize, int variantSize) {}

    static String assignGroup(String userId, String experimentName) {
        int hash = Math.abs((userId + experimentName).hashCode());
        return hash % 2 == 0 ? "control" : "variant";
    }

    static double calculateLift(Experiment exp) {
        return (exp.variantValue() - exp.controlValue()) / exp.controlValue() * 100;
    }

    static boolean isSignificant(Experiment exp) {
        return Math.abs(calculateLift(exp)) > 5.0
                && exp.controlSize() > 1000
                && exp.variantSize() > 1000;
    }

    static String getWinner(Experiment exp) {
        if (!isSignificant(exp)) return "not_significant";
        return calculateLift(exp) > 0 ? "variant" : "control";
    }

    static void generateReport(List<Experiment> experiments) {
        System.out.println("A/B Test Report:");
        for (Experiment exp : experiments) {
            double lift = calculateLift(exp);
            String significance = isSignificant(exp) ? "SIGNIFICANT" : "NOT SIGNIFICANT";
            String winner = getWinner(exp);
            System.out.printf("[%s] %s: control=%.2f%% vs variant=%.2f%% | lift: %+.2f%% | %s -> %s%n",
                    exp.name(), exp.metricName(),
                    exp.controlValue(), exp.variantValue(),
                    lift, significance, winner);
        }
    }

    public static void main(String[] args) {
        System.out.println("Распределение пользователей:");
        for (String userId : List.of("user_123", "user_456", "user_789")) {
            System.out.println(userId + " -> new_homepage: " + assignGroup(userId, "new_homepage"));
        }
        System.out.println("---");

        List<Experiment> experiments = List.of(
            new Experiment("new_homepage", "CTR", 3.2, 3.8, 5000, 5000),
            new Experiment("rec_algorithm", "retention", 45.0, 44.5, 3000, 3000),
            new Experiment("pricing_page", "conversion", 2.1, 2.9, 2000, 2000)
        );
        generateReport(experiments);
    }
}`,
      explanation: 'Netflix проводит ~250 A/B тестов одновременно. Каждый элемент UI (обложки, порядок рядов, описания) тестируется. Распределение по hash от userId обеспечивает стабильность: пользователь всегда видит одну версию. YouTube тестирует алгоритмы рекомендаций A/B тестами с метрикой watch time. Spotify тестирует плейлисты Discover Weekly. Статистическая значимость в реальности проверяется t-тестом или chi-squared тестом. Netflix использует собственную платформу XP (Experimentation Platform), а Google — Vizier. Наш порог 5% и 1000 — упрощение для демонстрации.'
    }
  ]
};
