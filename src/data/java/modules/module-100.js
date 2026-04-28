export default {
  id: 100,
  title: 'Реальная разработка: Социальная сеть',
  description: 'Задачи backend-разработчика в соцсети: лента, подписки, лайки, чат, уведомления, модерация контента и рекомендации.',
  lessons: [
    {
      id: 1,
      title: 'User Feed — генерация ленты постов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Feed Team. SOC-101: Реализовать генерацию персональной ленты пользователя. Лента формируется из постов авторов, на которых подписан пользователь. Посты сортируются по времени публикации (новые первые). Ограничить ленту последними N постами.',
      requirements: [
        'Record Post(String id, String authorId, String text, long timestamp)',
        'Метод generateFeed(String userId, Map<String, List<String>> subscriptions, List<Post> allPosts, int limit)',
        'Возвращает List<Post> — посты авторов из подписок userId',
        'Сортировка по timestamp (новые первые)',
        'Ограничить результат limit записями',
        'Если подписок нет — пустая лента'
      ],
      expectedOutput: 'Лента user1 (лимит 3):\n[12:00] alice: Новый рецепт пасты\n[11:00] bob: Закат на Иссык-Куле\n[10:00] alice: Утренняя пробежка 5км\n---\nЛента user2 (лимит 2):\n[11:00] bob: Закат на Иссык-Куле\n[09:00] bob: Доброе утро!',
      hint: 'Stream API: отфильтровать посты по подписке, sorted(Comparator.comparingLong(Post::timestamp).reversed()), limit(n).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Post(String id, String authorId, String text, long timestamp) {}

    static List<Post> generateFeed(String userId, Map<String, List<String>> subscriptions,
                                   List<Post> allPosts, int limit) {
        List<String> following = subscriptions.getOrDefault(userId, List.of());
        Set<String> followSet = new HashSet<>(following);

        return allPosts.stream()
                .filter(p -> followSet.contains(p.authorId()))
                .sorted(Comparator.comparingLong(Post::timestamp).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    static String formatTime(long ts) {
        int hours = (int)(ts / 60);
        int mins = (int)(ts % 60);
        return String.format("%02d:%02d", hours, mins);
    }

    public static void main(String[] args) {
        List<Post> posts = List.of(
            new Post("p1", "alice", "Утренняя пробежка 5км", 600),
            new Post("p2", "bob", "Доброе утро!", 540),
            new Post("p3", "alice", "Новый рецепт пасты", 720),
            new Post("p4", "bob", "Закат на Иссык-Куле", 660),
            new Post("p5", "carol", "Концерт был огонь!", 700)
        );

        Map<String, List<String>> subs = Map.of(
            "user1", List.of("alice", "bob"),
            "user2", List.of("bob")
        );

        System.out.println("Лента user1 (лимит 3):");
        generateFeed("user1", subs, posts, 3)
                .forEach(p -> System.out.println("[" + formatTime(p.timestamp()) + "] "
                        + p.authorId() + ": " + p.text()));

        System.out.println("---");

        System.out.println("Лента user2 (лимит 2):");
        generateFeed("user2", subs, posts, 2)
                .forEach(p -> System.out.println("[" + formatTime(p.timestamp()) + "] "
                        + p.authorId() + ": " + p.text()));
    }
}`,
      explanation: 'В Instagram и Twitter/X лента — самая нагруженная операция. Chronological feed (сортировка по времени) — простейший подход, использовался в ранних версиях Twitter. Сейчас соцсети используют ML-ранжирование. Два подхода к генерации: fan-out-on-write (при публикации пост раскладывается в ленты подписчиков, как в VK) и fan-out-on-read (лента собирается при запросе, как здесь). Twitter использует гибридный подход: fan-out-on-write для обычных юзеров и fan-out-on-read для селебрити.'
    },
    {
      id: 2,
      title: 'Follow System — подписки и отписки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Social Graph Team. SOC-205: Реализовать систему подписок. Пользователи могут подписываться и отписываться. Поддержать поиск mutual follows (взаимные подписки), подсчёт подписчиков и подписок.',
      requirements: [
        'Класс FollowService с Map<String, Set<String>> followings (кто на кого подписан)',
        'Метод follow(String userId, String targetId) — подписаться (нельзя на себя)',
        'Метод unfollow(String userId, String targetId) — отписаться',
        'Метод getFollowers(String userId) — кто подписан на userId',
        'Метод getMutualFollows(String userId) — взаимные подписки',
        'Метод getFollowerCount(String userId) — количество подписчиков'
      ],
      expectedOutput: 'alice подписчики: [bob, carol]\nalice подписки: [bob]\nbob подписчики: [alice]\nmutual follows alice: [bob]\nfollower count alice: 2\nalice отписалась от bob\nmutual follows alice: []\nfollower count alice: 2',
      hint: 'Для getFollowers пройди по всем пользователям и проверь, содержит ли их followings целевого юзера. getMutualFollows — пересечение followers и followings.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static Map<String, Set<String>> followings = new HashMap<>();

    static void follow(String userId, String targetId) {
        if (userId.equals(targetId)) return;
        followings.computeIfAbsent(userId, k -> new HashSet<>()).add(targetId);
    }

    static void unfollow(String userId, String targetId) {
        followings.getOrDefault(userId, Set.of()).remove(targetId);
    }

    static Set<String> getFollowings(String userId) {
        return followings.getOrDefault(userId, Set.of());
    }

    static Set<String> getFollowers(String userId) {
        return followings.entrySet().stream()
                .filter(e -> e.getValue().contains(userId))
                .map(Map.Entry::getKey)
                .collect(Collectors.toCollection(TreeSet::new));
    }

    static Set<String> getMutualFollows(String userId) {
        Set<String> myFollowings = getFollowings(userId);
        Set<String> myFollowers = getFollowers(userId);
        Set<String> mutual = new TreeSet<>(myFollowings);
        mutual.retainAll(myFollowers);
        return mutual;
    }

    static int getFollowerCount(String userId) {
        return getFollowers(userId).size();
    }

    public static void main(String[] args) {
        follow("alice", "bob");
        follow("bob", "alice");
        follow("carol", "alice");

        System.out.println("alice подписчики: " + getFollowers("alice"));
        System.out.println("alice подписки: " + getFollowings("alice"));
        System.out.println("bob подписчики: " + getFollowers("bob"));
        System.out.println("mutual follows alice: " + getMutualFollows("alice"));
        System.out.println("follower count alice: " + getFollowerCount("alice"));

        unfollow("alice", "bob");
        System.out.println("alice отписалась от bob");
        System.out.println("mutual follows alice: " + getMutualFollows("alice"));
        System.out.println("follower count alice: " + getFollowerCount("alice"));
    }
}`,
      explanation: 'Social Graph — основа любой соцсети. В Instagram и Twitter подписки хранятся в графовых БД или adjacency list в Cassandra/ScyllaDB. VK использует Tarantool для high-performance хранения связей. В Twitter граф подписок — это миллиарды рёбер. Mutual follows (взаимные подписки) определяют "друзей" в Telegram и VK. Подсчёт подписчиков обычно кэшируется отдельным counter-сервисом, а не вычисляется на лету.'
    },
    {
      id: 3,
      title: 'Like & Engagement — система лайков',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Feed Team. SOC-318: Реализовать систему лайков с подсчётом engagement rate. Engagement rate = (likes + comments) / views * 100%. Один пользователь может лайкнуть пост только один раз. Поддержать toggle-лайк (повторный лайк = отмена).',
      requirements: [
        'Record PostStats(String postId, Set<String> likes, int comments, int views)',
        'Метод toggleLike(PostStats stats, String userId) — добавить/убрать лайк',
        'Метод getEngagementRate(PostStats stats) — возвращает double (%)',
        'Engagement rate = (likes.size() + comments) / views * 100, округление до 2 знаков',
        'Если views == 0, engagement rate = 0.0',
        'Вывести статистику по каждому посту'
      ],
      expectedOutput: 'Post-1: 3 likes, 5 comments, 1000 views → engagement: 0.80%\nToggle like user1 на Post-1...\nPost-1: 2 likes, 5 comments, 1000 views → engagement: 0.70%\nToggle like user4 на Post-1...\nPost-1: 3 likes, 5 comments, 1000 views → engagement: 0.80%\nPost-2: 0 likes, 0 comments, 0 views → engagement: 0.00%',
      hint: 'Set.add() возвращает false если элемент уже есть — тогда remove(). Для engagement rate: Math.round(rate * 100.0) / 100.0.',
      solution: `import java.util.*;

public class Main {
    static Set<String> likes;
    static int comments, views;

    record PostStats(String postId, Set<String> likes, int comments, int views) {}

    static PostStats toggleLike(PostStats stats, String userId) {
        Set<String> newLikes = new HashSet<>(stats.likes());
        if (!newLikes.add(userId)) {
            newLikes.remove(userId);
        }
        return new PostStats(stats.postId(), newLikes, stats.comments(), stats.views());
    }

    static double getEngagementRate(PostStats stats) {
        if (stats.views() == 0) return 0.0;
        double rate = (double)(stats.likes().size() + stats.comments()) / stats.views() * 100;
        return Math.round(rate * 100.0) / 100.0;
    }

    static void printStats(PostStats s) {
        System.out.printf("%s: %d likes, %d comments, %d views → engagement: %.2f%%\\n",
                s.postId(), s.likes().size(), s.comments(), s.views(),
                getEngagementRate(s));
    }

    public static void main(String[] args) {
        PostStats post1 = new PostStats("Post-1",
                new HashSet<>(Set.of("user1", "user2", "user3")), 5, 1000);

        printStats(post1);

        System.out.println("Toggle like user1 на Post-1...");
        post1 = toggleLike(post1, "user1");
        printStats(post1);

        System.out.println("Toggle like user4 на Post-1...");
        post1 = toggleLike(post1, "user4");
        printStats(post1);

        PostStats post2 = new PostStats("Post-2", new HashSet<>(), 0, 0);
        printStats(post2);
    }
}`,
      explanation: 'Engagement rate — ключевая метрика для Instagram и Twitter/X. Рекламодатели платят блогерам на основе ER (хороший ER = 3-6% для Instagram). Toggle-лайк (idempotent) — стандарт: повторный тап убирает лайк. В VK и Instagram лайки хранятся в отдельном high-throughput сервисе (Redis + persistent storage). Twitter/X обрабатывает миллионы лайков в секунду через Kafka-очереди с батчевой записью в Manhattan (их KV-store).'
    },
    {
      id: 4,
      title: 'Comment Thread — древовидные комментарии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Feed Team. SOC-422: Реализовать древовидные комментарии (parent-child). Каждый комментарий может быть ответом на другой. Вывести дерево с отступами по уровню вложенности. Поддержать подсчёт общего количества ответов на комментарий.',
      requirements: [
        'Record Comment(String id, String parentId, String author, String text) — parentId = null для корневых',
        'Метод buildTree(List<Comment> comments) — группировка в Map<String, List<Comment>> по parentId',
        'Метод printTree(Map, String parentId, int depth) — рекурсивный вывод с отступами',
        'Метод countReplies(Map, String commentId) — общее число ответов (рекурсивно)',
        'Отступ: "  " (2 пробела) * depth'
      ],
      expectedOutput: 'Дерево комментариев:\nalice: Отличное фото!\n  bob: Согласен, огонь!\n    carol: +1\n  dana: Где это снято?\n    alice: В горах Алатау\neva: Красота!\n---\nОтветов на "alice: Отличное фото!": 4\nОтветов на "eva: Красота!": 0',
      hint: 'Map<String, List<Comment>> children: ключ — parentId. Для корневых parentId = "root". Рекурсивный обход: для каждого комментария выведи его, затем обойди его дочерние.',
      solution: `import java.util.*;

public class Main {
    record Comment(String id, String parentId, String author, String text) {}

    static Map<String, List<Comment>> buildTree(List<Comment> comments) {
        Map<String, List<Comment>> tree = new HashMap<>();
        for (Comment c : comments) {
            String key = c.parentId() == null ? "root" : c.parentId();
            tree.computeIfAbsent(key, k -> new ArrayList<>()).add(c);
        }
        return tree;
    }

    static void printTree(Map<String, List<Comment>> tree, String parentId, int depth) {
        List<Comment> children = tree.getOrDefault(parentId, List.of());
        for (Comment c : children) {
            System.out.println("  ".repeat(depth) + c.author() + ": " + c.text());
            printTree(tree, c.id(), depth + 1);
        }
    }

    static int countReplies(Map<String, List<Comment>> tree, String commentId) {
        List<Comment> children = tree.getOrDefault(commentId, List.of());
        int count = children.size();
        for (Comment c : children) {
            count += countReplies(tree, c.id());
        }
        return count;
    }

    public static void main(String[] args) {
        List<Comment> comments = List.of(
            new Comment("c1", null, "alice", "Отличное фото!"),
            new Comment("c2", "c1", "bob", "Согласен, огонь!"),
            new Comment("c3", "c2", "carol", "+1"),
            new Comment("c4", "c1", "dana", "Где это снято?"),
            new Comment("c5", "c4", "alice", "В горах Алатау"),
            new Comment("c6", null, "eva", "Красота!")
        );

        Map<String, List<Comment>> tree = buildTree(comments);

        System.out.println("Дерево комментариев:");
        printTree(tree, "root", 0);
        System.out.println("---");
        System.out.println("Ответов на \\"alice: Отличное фото!\\": " + countReplies(tree, "c1"));
        System.out.println("Ответов на \\"eva: Красота!\\": " + countReplies(tree, "c6"));
    }
}`,
      explanation: 'Древовидные комментарии используются в Instagram (ответы на комментарии), Reddit (глубокая вложенность) и VK. Два подхода к хранению: adjacency list (parentId как здесь) и materialized path ("c1/c2/c3"). Instagram ограничивает вложенность до 1 уровня для простоты UI. Reddit использует полную рекурсию. В БД это обычно рекурсивные CTE запросы (WITH RECURSIVE в PostgreSQL). Для высоких нагрузок комментарии кэшируются в Redis как pre-rendered деревья.'
    },
    {
      id: 5,
      title: 'Chat Message Queue — очередь сообщений чата',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Messaging Team. SOC-534: Реализовать очередь сообщений чата с тремя статусами: SENT (отправлено), DELIVERED (доставлено), READ (прочитано). Поддержать отправку, обновление статуса и получение непрочитанных сообщений.',
      requirements: [
        'Enum MessageStatus { SENT, DELIVERED, READ }',
        'Record ChatMessage(String id, String from, String to, String text, long timestamp, MessageStatus status)',
        'Метод sendMessage(from, to, text) — создаёт сообщение со статусом SENT',
        'Метод markDelivered(messageId) — SENT → DELIVERED',
        'Метод markRead(messageId) — DELIVERED → READ',
        'Метод getUnread(userId) — все сообщения для userId со статусом != READ',
        'Вывести статусы галочками: SENT=✓, DELIVERED=✓✓, READ=✓✓(blue)'
      ],
      expectedOutput: 'Чат alice → bob:\n[10:00] alice: Привет! ✓\n[10:01] alice: Как дела? ✓\n--- Доставка ---\n[10:00] alice: Привет! ✓✓\n[10:01] alice: Как дела? ✓✓\n--- Прочитано msg1 ---\n[10:00] alice: Привет! ✓✓(blue)\n[10:01] alice: Как дела? ✓✓\nНепрочитанных у bob: 1',
      hint: 'ArrayList для хранения сообщений. Поиск по id для обновления статуса. Фильтрация stream по to и status для getUnread.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum MessageStatus { SENT, DELIVERED, READ }

    static class ChatMessage {
        String id, from, to, text;
        long timestamp;
        MessageStatus status;

        ChatMessage(String id, String from, String to, String text, long timestamp) {
            this.id = id; this.from = from; this.to = to;
            this.text = text; this.timestamp = timestamp;
            this.status = MessageStatus.SENT;
        }

        String statusIcon() {
            return switch (status) {
                case SENT -> "✓";
                case DELIVERED -> "✓✓";
                case READ -> "✓✓(blue)";
            };
        }
    }

    static List<ChatMessage> messages = new ArrayList<>();
    static int counter = 0;

    static ChatMessage sendMessage(String from, String to, String text, long timestamp) {
        ChatMessage msg = new ChatMessage("msg" + (++counter), from, to, text, timestamp);
        messages.add(msg);
        return msg;
    }

    static void markDelivered(String msgId) {
        messages.stream().filter(m -> m.id.equals(msgId) && m.status == MessageStatus.SENT)
                .forEach(m -> m.status = MessageStatus.DELIVERED);
    }

    static void markRead(String msgId) {
        messages.stream().filter(m -> m.id.equals(msgId) && m.status == MessageStatus.DELIVERED)
                .forEach(m -> m.status = MessageStatus.READ);
    }

    static List<ChatMessage> getUnread(String userId) {
        return messages.stream()
                .filter(m -> m.to.equals(userId) && m.status != MessageStatus.READ)
                .collect(Collectors.toList());
    }

    static String formatTime(long ts) {
        return String.format("%02d:%02d", ts / 60, ts % 60);
    }

    static void printChat(String from, String to) {
        messages.stream()
                .filter(m -> m.from.equals(from) && m.to.equals(to))
                .forEach(m -> System.out.println("[" + formatTime(m.timestamp) + "] "
                        + m.from + ": " + m.text + " " + m.statusIcon()));
    }

    public static void main(String[] args) {
        sendMessage("alice", "bob", "Привет!", 600);
        sendMessage("alice", "bob", "Как дела?", 601);

        System.out.println("Чат alice → bob:");
        printChat("alice", "bob");

        System.out.println("--- Доставка ---");
        markDelivered("msg1");
        markDelivered("msg2");
        printChat("alice", "bob");

        System.out.println("--- Прочитано msg1 ---");
        markRead("msg1");
        printChat("alice", "bob");

        System.out.println("Непрочитанных у bob: " + getUnread("bob").size());
    }
}`,
      explanation: 'Статусы сообщений (sent/delivered/read) — визитная карточка Telegram и WhatsApp. Одна галочка = отправлено на сервер, две = доставлено на устройство, синие = прочитано. В Telegram используется протокол MTProto с acknowledgment-ами. WhatsApp хранит сообщения в Mnesia (Erlang DB). В реальных системах очередь сообщений — это Kafka/RabbitMQ с гарантией at-least-once delivery. Статусы обновляются через WebSocket push-уведомления.'
    },
    {
      id: 6,
      title: 'Notification System — уведомления по событиям',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Feed Team. SOC-647: Реализовать систему уведомлений. При событиях (лайк, комментарий, подписка) генерируются уведомления для пользователя. Поддержать группировку однотипных уведомлений (например, "alice и ещё 2 лайкнули ваш пост").',
      requirements: [
        'Enum EventType { LIKE, COMMENT, FOLLOW }',
        'Record Event(EventType type, String actorId, String targetUserId, String objectId, long timestamp)',
        'Метод generateNotifications(List<Event> events) — группировка по (type + objectId)',
        'Группировка: если 1 актор — "alice лайкнул(а) ваш пост", если 3 — "alice и ещё 2 лайкнули ваш пост"',
        'Метод getUnreadCount(String userId, List<Notification>) — количество непрочитанных',
        'Сортировка уведомлений по времени последнего события'
      ],
      expectedOutput: 'Уведомления для user1:\n[LIKE] alice и ещё 2 лайкнули ваш пост post1\n[COMMENT] bob прокомментировал(а) ваш пост post1\n[FOLLOW] dana подписался(ась) на вас\nНепрочитанных: 3',
      hint: 'Группировка: Map с ключом type+objectId. Для текста: если actors.size()==1 — имя, иначе первое имя + "и ещё " + (size-1).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum EventType { LIKE, COMMENT, FOLLOW }

    record Event(EventType type, String actorId, String targetUserId,
                 String objectId, long timestamp) {}

    record Notification(EventType type, String targetUserId, String objectId,
                        List<String> actors, long lastTimestamp, boolean read) {}

    static List<Notification> generateNotifications(List<Event> events, String userId) {
        Map<String, List<Event>> grouped = events.stream()
                .filter(e -> e.targetUserId().equals(userId))
                .collect(Collectors.groupingBy(
                        e -> e.type() + ":" + (e.objectId() != null ? e.objectId() : ""),
                        LinkedHashMap::new, Collectors.toList()));

        return grouped.values().stream().map(group -> {
            Event first = group.get(0);
            List<String> actors = group.stream().map(Event::actorId).distinct().collect(Collectors.toList());
            long maxTs = group.stream().mapToLong(Event::timestamp).max().orElse(0);
            return new Notification(first.type(), userId, first.objectId(), actors, maxTs, false);
        }).sorted(Comparator.comparingLong(Notification::lastTimestamp).reversed())
          .collect(Collectors.toList());
    }

    static String formatNotification(Notification n) {
        String actorText = n.actors().size() == 1
                ? n.actors().get(0)
                : n.actors().get(0) + " и ещё " + (n.actors().size() - 1);
        String action = switch (n.type()) {
            case LIKE -> actorText + " лайкнули ваш пост " + n.objectId();
            case COMMENT -> actorText + " прокомментировал(а) ваш пост " + n.objectId();
            case FOLLOW -> actorText + " подписался(ась) на вас";
        };
        return "[" + n.type() + "] " + action;
    }

    static long getUnreadCount(List<Notification> notifications) {
        return notifications.stream().filter(n -> !n.read()).count();
    }

    public static void main(String[] args) {
        List<Event> events = List.of(
            new Event(EventType.LIKE, "alice", "user1", "post1", 100),
            new Event(EventType.LIKE, "bob", "user1", "post1", 105),
            new Event(EventType.LIKE, "carol", "user1", "post1", 110),
            new Event(EventType.COMMENT, "bob", "user1", "post1", 120),
            new Event(EventType.FOLLOW, "dana", "user1", null, 130)
        );

        List<Notification> notifications = generateNotifications(events, "user1");

        System.out.println("Уведомления для user1:");
        notifications.forEach(n -> System.out.println(formatNotification(n)));
        System.out.println("Непрочитанных: " + getUnreadCount(notifications));
    }
}`,
      explanation: 'Группировка уведомлений ("alice и ещё 5 лайкнули") — стандарт в Instagram, VK и Facebook. Без группировки популярный пост генерирует тысячи однотипных уведомлений. В Instagram уведомления обрабатываются асинхронно через Apache Kafka: событие -> Kafka -> Notification Consumer -> push/in-app. Twitter/X использует Event Bus с дедупликацией. В реальности добавляют rate limiting (не больше 1 push в минуту от одного типа) и batching (накапливание за 5 минут).'
    },
    {
      id: 7,
      title: 'Content Moderation — фильтрация контента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Trust & Safety Team. SOC-755: Реализовать фильтрацию контента по запрещённым словам и паттернам. Поддержать точное совпадение, паттерны (regex), уровни нарушения (WARNING, BLOCK) и замену запрещённых слов звёздочками.',
      requirements: [
        'Record ModerationRule(String pattern, String level, boolean isRegex)',
        'Метод moderate(String text, List<ModerationRule> rules) — возвращает ModerationResult',
        'Record ModerationResult(String cleanText, String level, List<String> violations)',
        'Замена запрещённых слов: каждый символ слова → "*"',
        'Уровни: PASS (нет нарушений), WARNING (мягкие), BLOCK (жёсткие)',
        'Если есть хотя бы одно BLOCK — итоговый уровень BLOCK'
      ],
      expectedOutput: 'Текст: "Отличный пост, спасибо!"\nРезультат: PASS | Отличный пост, спасибо!\n---\nТекст: "Купи скидку тут http://spam.xyz"\nРезультат: BLOCK | Купи скидку тут ***************\nНарушения: [URL-спам: http://spam.xyz]\n---\nТекст: "Это дурак и идиот"\nРезультат: WARNING | Это ***** и *****\nНарушения: [Оскорбление: дурак, Оскорбление: идиот]',
      hint: 'Для regex-правил: Pattern.compile(pattern).matcher(text). Для замены: слово.replaceAll(".", "*"). Проверяй правила последовательно и собирай все нарушения.',
      solution: `import java.util.*;
import java.util.regex.*;

public class Main {
    record ModerationRule(String pattern, String level, boolean isRegex) {}
    record ModerationResult(String cleanText, String level, List<String> violations) {}

    static ModerationResult moderate(String text, List<ModerationRule> rules) {
        String cleanText = text;
        List<String> violations = new ArrayList<>();
        String maxLevel = "PASS";

        for (ModerationRule rule : rules) {
            if (rule.isRegex()) {
                Matcher matcher = Pattern.compile(rule.pattern()).matcher(cleanText);
                while (matcher.find()) {
                    String found = matcher.group();
                    violations.add(getLabelForLevel(rule.level()) + ": " + found);
                    cleanText = cleanText.replace(found, "*".repeat(found.length()));
                    maxLevel = higherLevel(maxLevel, rule.level());
                }
            } else {
                String lower = cleanText.toLowerCase();
                String patternLower = rule.pattern().toLowerCase();
                int idx = lower.indexOf(patternLower);
                while (idx != -1) {
                    String original = cleanText.substring(idx, idx + rule.pattern().length());
                    violations.add(getLabelForLevel(rule.level()) + ": " + original);
                    cleanText = cleanText.substring(0, idx)
                            + "*".repeat(rule.pattern().length())
                            + cleanText.substring(idx + rule.pattern().length());
                    lower = cleanText.toLowerCase();
                    idx = lower.indexOf(patternLower, idx + rule.pattern().length());
                }
                if (!violations.isEmpty() || lower.contains(patternLower)) {
                    maxLevel = higherLevel(maxLevel, rule.level());
                }
            }
        }
        return new ModerationResult(cleanText, maxLevel, violations);
    }

    static String getLabelForLevel(String level) {
        return switch (level) {
            case "BLOCK" -> "URL-спам";
            case "WARNING" -> "Оскорбление";
            default -> "Нарушение";
        };
    }

    static String higherLevel(String current, String incoming) {
        if (current.equals("BLOCK") || incoming.equals("BLOCK")) return "BLOCK";
        if (current.equals("WARNING") || incoming.equals("WARNING")) return "WARNING";
        return "PASS";
    }

    public static void main(String[] args) {
        List<ModerationRule> rules = List.of(
            new ModerationRule("дурак", "WARNING", false),
            new ModerationRule("идиот", "WARNING", false),
            new ModerationRule("https?://\\\\S+", "BLOCK", true)
        );

        String[] texts = {
            "Отличный пост, спасибо!",
            "Купи скидку тут http://spam.xyz",
            "Это дурак и идиот"
        };

        for (String text : texts) {
            ModerationResult result = moderate(text, rules);
            System.out.println("Текст: \\"" + text + "\\"");
            System.out.print("Результат: " + result.level() + " | " + result.cleanText());
            if (!result.violations().isEmpty()) {
                System.out.println("\\nНарушения: " + result.violations());
            } else {
                System.out.println();
            }
            System.out.println("---");
        }
    }
}`,
      explanation: 'Content moderation — критическая система в любой соцсети. Instagram и Facebook используют многоуровневую модерацию: 1) keyword filters (как здесь), 2) ML-классификаторы (NLP для hate speech), 3) image/video AI (CSAM detection), 4) ручная модерация. Trust & Safety — одна из самых больших команд в Twitter/X (до сокращений). VK использует комбинацию автоматических фильтров и жалоб пользователей. В реальности правила хранятся в конфиге и обновляются без деплоя через feature flags.'
    },
    {
      id: 8,
      title: 'Hashtag Trending — трендовые хэштеги',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Discovery Team. SOC-863: Реализовать подсчёт трендовых хэштегов за период. Извлечь хэштеги из постов, посчитать частоту за последние N часов, вернуть топ-K трендов. Поддержать фильтрацию по минимальному количеству упоминаний.',
      requirements: [
        'Record Post(String id, String text, long timestamp)',
        'Метод extractHashtags(String text) — извлечь все #слова из текста',
        'Метод getTrending(List<Post> posts, long fromTime, int topK, int minCount)',
        'Возвращает List<Map.Entry<String, Integer>> — топ хэштегов с количеством',
        'Сортировка по количеству (убывание), при равенстве — по алфавиту',
        'Хэштеги приводить к нижнему регистру'
      ],
      expectedOutput: 'Все хэштеги из постов:\n[#java, #spring, #backend]\n[#java, #coding]\n[#spring, #microservices]\n[#java, #spring, #coding]\n[#devops]\n---\nТренды (топ-3, мин. 2 упоминания):\n1. #java — 3\n2. #spring — 3\n3. #coding — 2',
      hint: 'Regex "#\\\\w+" для извлечения хэштегов. Collectors.groupingBy + Collectors.summingInt для подсчёта. Stream sorted с двойным comparator.',
      solution: `import java.util.*;
import java.util.regex.*;
import java.util.stream.*;

public class Main {
    record Post(String id, String text, long timestamp) {}

    static List<String> extractHashtags(String text) {
        List<String> tags = new ArrayList<>();
        Matcher matcher = Pattern.compile("#\\\\w+").matcher(text);
        while (matcher.find()) {
            tags.add(matcher.group().toLowerCase());
        }
        return tags;
    }

    static List<Map.Entry<String, Integer>> getTrending(List<Post> posts,
            long fromTime, int topK, int minCount) {
        Map<String, Integer> counts = new HashMap<>();

        posts.stream()
                .filter(p -> p.timestamp() >= fromTime)
                .flatMap(p -> extractHashtags(p.text()).stream())
                .forEach(tag -> counts.merge(tag, 1, Integer::sum));

        return counts.entrySet().stream()
                .filter(e -> e.getValue() >= minCount)
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(topK)
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Post> posts = List.of(
            new Post("p1", "Изучаю #Java #Spring #Backend", 100),
            new Post("p2", "Люблю #Java #Coding", 200),
            new Post("p3", "#Spring #Microservices рулят", 300),
            new Post("p4", "#Java #Spring #Coding марафон", 400),
            new Post("p5", "#DevOps это важно", 50)
        );

        System.out.println("Все хэштеги из постов:");
        posts.forEach(p -> System.out.println(extractHashtags(p.text())));

        System.out.println("---");
        System.out.println("Тренды (топ-3, мин. 2 упоминания):");
        List<Map.Entry<String, Integer>> trending = getTrending(posts, 100, 3, 2);
        for (int i = 0; i < trending.size(); i++) {
            var entry = trending.get(i);
            System.out.println((i + 1) + ". " + entry.getKey() + " — " + entry.getValue());
        }
    }
}`,
      explanation: 'Trending хэштеги — визитная карточка Twitter/X. Алгоритм реального trending не просто "самые частые" — он считает velocity (скорость роста за период). Хэштег с 1000 упоминаний за час трендовее, чем хэштег с 5000 за неделю. Twitter использует Storm/Heron для real-time подсчёта. Instagram Explore и VK "Актуальное" используют похожие механизмы с ML-фильтрацией спама и манипуляций. В реальности данные агрегируются в sliding windows (HyperLogLog для уникальных авторов).'
    },
    {
      id: 9,
      title: 'Story/Post Expiry — автоудаление и архивация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Feed Team. SOC-971: Реализовать систему жизненного цикла контента. Stories живут 24 часа, затем архивируются. Обычные посты архивируются через 365 дней. Реализовать проверку истечения, пакетную архивацию и статистику по статусам.',
      requirements: [
        'Enum ContentType { STORY, POST }',
        'Enum ContentStatus { ACTIVE, ARCHIVED, EXPIRED }',
        'Класс Content с полями: id, type, authorId, text, createdAt, status',
        'Метод processExpiry(List<Content>, long currentTime) — обновить статусы',
        'STORY: > 24ч (1440 мин) → EXPIRED, POST: > 365 дней (525600 мин) → ARCHIVED',
        'Метод getStats(List<Content>) — Map<ContentStatus, Long> статистика',
        'Метод getActiveContent(List<Content>, String userId) — активные посты юзера'
      ],
      expectedOutput: 'До обработки:\nACTIVE: story1(STORY), story2(STORY), post1(POST), post2(POST), post3(POST)\n---\nТекущее время: 2000 мин\nПосле обработки:\nstory1(STORY): EXPIRED (возраст: 1500 мин)\nstory2(STORY): ACTIVE (возраст: 500 мин)\npost1(POST): ACTIVE (возраст: 1500 мин)\npost2(POST): ARCHIVED (возраст: 600000 мин)\npost3(POST): ACTIVE (возраст: 100 мин)\n---\nСтатистика: {ACTIVE=3, ARCHIVED=1, EXPIRED=1}\nАктивные alice: [story2, post1, post3]',
      hint: 'currentTime - createdAt > threshold. Для STORY threshold=1440, для POST threshold=525600. Группировка Collectors.groupingBy + Collectors.counting().',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum ContentType { STORY, POST }
    enum ContentStatus { ACTIVE, ARCHIVED, EXPIRED }

    static class Content {
        String id;
        ContentType type;
        String authorId;
        String text;
        long createdAt;
        ContentStatus status;

        Content(String id, ContentType type, String authorId, String text, long createdAt) {
            this.id = id; this.type = type; this.authorId = authorId;
            this.text = text; this.createdAt = createdAt;
            this.status = ContentStatus.ACTIVE;
        }
    }

    static final long STORY_TTL = 1440;
    static final long POST_TTL = 525600;

    static void processExpiry(List<Content> contents, long currentTime) {
        for (Content c : contents) {
            if (c.status != ContentStatus.ACTIVE) continue;
            long age = currentTime - c.createdAt;
            switch (c.type) {
                case STORY -> { if (age > STORY_TTL) c.status = ContentStatus.EXPIRED; }
                case POST -> { if (age > POST_TTL) c.status = ContentStatus.ARCHIVED; }
            }
        }
    }

    static Map<ContentStatus, Long> getStats(List<Content> contents) {
        return contents.stream()
                .collect(Collectors.groupingBy(c -> c.status, TreeMap::new, Collectors.counting()));
    }

    static List<String> getActiveContent(List<Content> contents, String userId) {
        return contents.stream()
                .filter(c -> c.authorId.equals(userId) && c.status == ContentStatus.ACTIVE)
                .map(c -> c.id)
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Content> contents = new ArrayList<>(List.of(
            new Content("story1", ContentType.STORY, "alice", "Мой день", 500),
            new Content("story2", ContentType.STORY, "alice", "Вечер", 1500),
            new Content("post1", ContentType.POST, "alice", "Статья о Java", 500),
            new Content("post2", ContentType.POST, "bob", "Старый пост", -598000),
            new Content("post3", ContentType.POST, "alice", "Новый проект", 1900)
        ));

        System.out.println("До обработки:");
        System.out.println("ACTIVE: " + contents.stream()
                .map(c -> c.id + "(" + c.type + ")").collect(Collectors.joining(", ")));

        System.out.println("---");
        long currentTime = 2000;
        System.out.println("Текущее время: " + currentTime + " мин");
        processExpiry(contents, currentTime);

        System.out.println("После обработки:");
        for (Content c : contents) {
            long age = currentTime - c.createdAt;
            System.out.println(c.id + "(" + c.type + "): " + c.status
                    + " (возраст: " + age + " мин)");
        }

        System.out.println("---");
        System.out.println("Статистика: " + getStats(contents));
        System.out.println("Активные alice: " + getActiveContent(contents, "alice"));
    }
}`,
      explanation: 'Stories с 24-часовым TTL — изобретение Snapchat, скопированное Instagram, Facebook, VK и Telegram. В Instagram stories хранятся в Cassandra с TTL-колонками — база автоматически удаляет записи по истечении. Архив stories (Instagram Archive) сохраняет копию в cold storage (S3). Для обычных постов Twitter/X не удаляет контент, но перемещает старые данные в cold storage (Manhattan tiered storage). В VK архивация через cron-задачи, которые сканируют таблицы батчами по 10000 записей, чтобы не нагружать базу.'
    },
    {
      id: 10,
      title: 'Friend Recommendations — "Люди, которых вы можете знать"',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Discovery Team. SOC-1088: Реализовать рекомендации друзей на основе mutual friends. Алгоритм: для пользователя найти людей, которые не в его подписках, но имеют наибольшее число общих друзей. Ранжировать по количеству mutual friends. Исключить самого пользователя.',
      requirements: [
        'Map<String, Set<String>> friends — граф дружбы (двунаправленный)',
        'Метод recommend(String userId, Map<String, Set<String>> friends, int limit)',
        'Возвращает List<Map.Entry<String, Integer>> — рекомендации с числом mutual friends',
        'Не рекомендовать тех, кто уже в друзьях',
        'Не рекомендовать самого себя',
        'Сортировка: больше mutual friends → выше, при равенстве → по алфавиту',
        'Ограничить результат limit записями'
      ],
      expectedOutput: 'Друзья alice: [bob, carol]\nДрузья bob: [alice, carol, dana, eva]\nДрузья carol: [alice, bob, dana]\nДрузья dana: [bob, carol, frank]\nДрузья eva: [bob]\nДрузья frank: [dana]\n---\nРекомендации для alice (топ-3):\n1. dana — 2 mutual friends (bob, carol)\n2. eva — 1 mutual friends (bob)\n3. frank — 1 mutual friends (carol) [через dana]',
      hint: 'Для каждого друга userId пройди по его друзьям. Если candidate не userId и не в friends[userId] — увеличь счётчик mutual. Map<String, Integer> для подсчёта.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static List<Map.Entry<String, Integer>> recommend(String userId,
            Map<String, Set<String>> friends, int limit) {
        Set<String> myFriends = friends.getOrDefault(userId, Set.of());
        Map<String, Integer> scores = new HashMap<>();

        for (String friend : myFriends) {
            Set<String> friendsOfFriend = friends.getOrDefault(friend, Set.of());
            for (String candidate : friendsOfFriend) {
                if (!candidate.equals(userId) && !myFriends.contains(candidate)) {
                    scores.merge(candidate, 1, Integer::sum);
                }
            }
        }

        return scores.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    static Set<String> getMutualFriends(String userId, String candidate,
            Map<String, Set<String>> friends) {
        Set<String> myFriends = friends.getOrDefault(userId, Set.of());
        Set<String> theirFriends = friends.getOrDefault(candidate, Set.of());
        Set<String> mutual = new TreeSet<>(myFriends);
        mutual.retainAll(theirFriends);
        return mutual;
    }

    public static void main(String[] args) {
        Map<String, Set<String>> friends = new HashMap<>();
        friends.put("alice", new TreeSet<>(Set.of("bob", "carol")));
        friends.put("bob", new TreeSet<>(Set.of("alice", "carol", "dana", "eva")));
        friends.put("carol", new TreeSet<>(Set.of("alice", "bob", "dana")));
        friends.put("dana", new TreeSet<>(Set.of("bob", "carol", "frank")));
        friends.put("eva", new TreeSet<>(Set.of("bob")));
        friends.put("frank", new TreeSet<>(Set.of("dana")));

        friends.forEach((user, f) ->
                System.out.println("Друзья " + user + ": " + f));

        System.out.println("---");
        System.out.println("Рекомендации для alice (топ-3):");

        List<Map.Entry<String, Integer>> recs = recommend("alice", friends, 3);
        for (int i = 0; i < recs.size(); i++) {
            var entry = recs.get(i);
            Set<String> mutual = getMutualFriends("alice", entry.getKey(), friends);
            System.out.println((i + 1) + ". " + entry.getKey() + " — "
                    + entry.getValue() + " mutual friends (" + String.join(", ", mutual) + ")");
        }
    }
}`,
      explanation: 'Рекомендации "People You May Know" (PYMK) — одна из самых ценных фич LinkedIn, Facebook и VK. Базовый алгоритм — mutual friends (как здесь). В реальности добавляют: совместные группы, общие интересы, геолокацию, контакты из телефонной книги (Facebook), коллег (LinkedIn). Facebook использует графовую БД TAO с триллионами рёбер. VK применяет collaborative filtering поверх графа. LinkedIn PYMK генерирует ~40% новых connections — это killer feature. Алгоритм работает как BFS глубины 2 по социальному графу с ранжированием по числу общих связей.'
    }
  ]
}
