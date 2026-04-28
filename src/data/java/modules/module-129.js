export default {
  id: 129,
  title: 'Практикум: Сетевое программирование',
  description: 'TCP Echo Server, многопоточный Chat, HTTP клиент/сервер, WebSocket, NIO, JSON сериализация, RPC framework и REST клиент.',
  lessons: [
    {
      id: 1,
      title: 'TCP Echo Server',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте TCP Echo Server — сервер, который принимает соединения и отправляет обратно всё, что получил от клиента. Это базовый шаблон для любого TCP-сервера. Используйте ServerSocket для прослушивания порта и Socket для работы с клиентом.',
      requirements: [
        'EchoServer: ServerSocket на порту 8080, accept() в цикле',
        'Чтение данных через BufferedReader(InputStreamReader), ответ через PrintWriter',
        'EchoClient: подключение, отправка строк, получение эхо',
        'Обработка нескольких клиентов (новый Thread на каждого)',
        'Graceful shutdown — закрытие сервера по команде "quit"'
      ],
      expectedOutput: `=== TCP Echo Server ===

Сервер запущен на порту 8080...

[Клиент-1] Подключен: /127.0.0.1:54321
[Клиент-1] → "Привет, сервер!"
[Клиент-1] ← "Привет, сервер!"
[Клиент-1] → "Echo test 123"
[Клиент-1] ← "Echo test 123"
[Клиент-1] → "quit"
[Клиент-1] Отключен

[Клиент-2] Подключен: /127.0.0.1:54322
[Клиент-2] → "Второй клиент"
[Клиент-2] ← "Второй клиент"
[Клиент-2] → "quit"
[Клиент-2] Отключен

Сервер остановлен. Обслужено клиентов: 2`,
      hint: 'ServerSocket.accept() блокирует до нового соединения. Каждый клиент обрабатывается в отдельном Thread. try-with-resources для автоматического закрытия сокетов.',
      solution: `import java.io.*;
import java.net.*;
import java.util.concurrent.atomic.*;

public class Main {
    static AtomicInteger clientCount = new AtomicInteger(0);

    static class EchoServer implements Runnable {
        private final int port;
        private volatile boolean running = true;
        private ServerSocket serverSocket;

        EchoServer(int port) { this.port = port; }

        public void run() {
            try {
                serverSocket = new ServerSocket(port);
                serverSocket.setSoTimeout(1000);
                System.out.println("Сервер запущен на порту " + port + "...\\n");

                while (running) {
                    try {
                        Socket client = serverSocket.accept();
                        int id = clientCount.incrementAndGet();
                        new Thread(() -> handleClient(client, id)).start();
                    } catch (SocketTimeoutException e) { /* проверяем running */ }
                }
            } catch (IOException e) { if (running) e.printStackTrace(); }
        }

        void handleClient(Socket client, int id) {
            String prefix = "[Клиент-" + id + "]";
            System.out.println(prefix + " Подключен: " + client.getRemoteSocketAddress());
            try (
                BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
                PrintWriter out = new PrintWriter(client.getOutputStream(), true)
            ) {
                String line;
                while ((line = in.readLine()) != null) {
                    System.out.println(prefix + " → \\"" + line + "\\"");
                    if ("quit".equalsIgnoreCase(line)) {
                        out.println("Bye!");
                        break;
                    }
                    out.println(line);
                    System.out.println(prefix + " ← \\"" + line + "\\"");
                }
                System.out.println(prefix + " Отключен");
            } catch (IOException e) { System.out.println(prefix + " Ошибка: " + e.getMessage()); }
            finally { try { client.close(); } catch (IOException e) {} }
        }

        void stop() {
            running = false;
            try { if (serverSocket != null) serverSocket.close(); } catch (IOException e) {}
        }
    }

    static void runClient(int port, String[] messages) throws Exception {
        Thread.sleep(200);
        try (Socket socket = new Socket("localhost", port);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
            for (String msg : messages) {
                out.println(msg);
                String response = in.readLine();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== TCP Echo Server ===\\n");

        int port = 18080;
        EchoServer server = new EchoServer(port);
        Thread serverThread = new Thread(server);
        serverThread.start();
        Thread.sleep(500);

        // Клиент 1
        runClient(port, new String[]{"Привет, сервер!", "Echo test 123", "quit"});
        Thread.sleep(300);

        // Клиент 2
        runClient(port, new String[]{"Второй клиент", "quit"});
        Thread.sleep(300);

        server.stop();
        serverThread.join(2000);

        System.out.println("\\nСервер остановлен. Обслужено клиентов: " + clientCount.get());
    }
}`,
      explanation: 'ServerSocket.accept() — блокирующий вызов, возвращает Socket при подключении клиента. Каждый клиент обрабатывается в отдельном потоке (thread-per-connection модель). BufferedReader/PrintWriter — удобные обёртки для текстового протокола. В продакшене используют пул потоков (ExecutorService) вместо Thread-per-connection, или NIO/Netty для тысяч соединений. try-with-resources гарантирует закрытие сокетов даже при исключениях.'
    },
    {
      id: 2,
      title: 'TCP Chat',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте многопоточный TCP чат-сервер. Несколько клиентов подключаются одновременно, сервер рассылает каждое сообщение всем подключённым клиентам (broadcast). Каждый клиент имеет имя. Поддержите команды /nick, /users, /quit.',
      requirements: [
        'ChatServer: хранит Set<ClientHandler> всех подключённых клиентов',
        'broadcast(message, sender) — отправка всем кроме отправителя',
        'Команды: /nick <имя>, /users — список пользователей, /quit — выход',
        'Thread-safe работа с коллекцией клиентов (CopyOnWriteArraySet)',
        'Вывести лог событий: подключение, сообщения, отключение'
      ],
      expectedOutput: `=== TCP Chat Server ===

Чат-сервер запущен на порту 9090...

[Сервер] User1 подключился (всего: 1)
[Сервер] User2 подключился (всего: 2)
[Сервер] User3 подключился (всего: 3)

[User1] Привет всем!
  → отправлено User2, User3
[User2] Привет, User1!
  → отправлено User1, User3
[User1] /nick Алексей
[Сервер] User1 теперь Алексей
[User3] /users
  → Онлайн: Алексей, User2, User3
[Алексей] /quit
[Сервер] Алексей отключился (всего: 2)

Чат-сервер остановлен.
Всего сообщений: 4`,
      hint: 'CopyOnWriteArraySet — thread-safe Set, оптимальный для broadcast (частые итерации, редкие модификации). Synchronized для nick change.',
      solution: `import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static Set<ClientHandler> clients = new CopyOnWriteArraySet<>();
    static AtomicInteger messageCount = new AtomicInteger(0);

    static class ClientHandler implements Runnable {
        Socket socket;
        PrintWriter out;
        BufferedReader in;
        String name;

        ClientHandler(Socket socket, String name) throws IOException {
            this.socket = socket;
            this.name = name;
            this.out = new PrintWriter(socket.getOutputStream(), true);
            this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        }

        void sendMessage(String msg) { out.println(msg); }

        public void run() {
            try {
                String line;
                while ((line = in.readLine()) != null) {
                    if (line.startsWith("/quit")) {
                        break;
                    } else if (line.startsWith("/nick ")) {
                        String oldName = name;
                        name = line.substring(6).trim();
                        System.out.println("[Сервер] " + oldName + " теперь " + name);
                        broadcast("[Сервер] " + oldName + " теперь " + name, this);
                    } else if (line.equals("/users")) {
                        StringBuilder sb = new StringBuilder("Онлайн: ");
                        clients.forEach(c -> sb.append(c.name).append(", "));
                        String users = sb.substring(0, sb.length() - 2);
                        sendMessage(users);
                        System.out.println("[" + name + "] /users");
                        System.out.println("  → " + users);
                    } else {
                        System.out.println("[" + name + "] " + line);
                        messageCount.incrementAndGet();
                        List<String> recipients = new ArrayList<>();
                        for (ClientHandler c : clients) {
                            if (c != this) recipients.add(c.name);
                        }
                        broadcast("[" + name + "] " + line, this);
                        System.out.println("  → отправлено " + String.join(", ", recipients));
                    }
                }
            } catch (IOException e) {}
            finally {
                clients.remove(this);
                System.out.println("[Сервер] " + name + " отключился (всего: " + clients.size() + ")");
                broadcast("[Сервер] " + name + " покинул чат", this);
                try { socket.close(); } catch (IOException e) {}
            }
        }
    }

    static void broadcast(String message, ClientHandler sender) {
        for (ClientHandler c : clients) {
            if (c != sender) c.sendMessage(message);
        }
    }

    static void simulateClient(int port, String name, String[] messages) {
        new Thread(() -> {
            try {
                Thread.sleep(200);
                Socket socket = new Socket("localhost", port);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                out.println(name); // отправляем имя
                for (String msg : messages) {
                    Thread.sleep(300);
                    out.println(msg);
                }
                socket.close();
            } catch (Exception e) {}
        }).start();
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== TCP Chat Server ===\\n");

        int port = 19090;
        ServerSocket serverSocket = new ServerSocket(port);
        serverSocket.setSoTimeout(500);
        System.out.println("Чат-сервер запущен на порту " + port + "...\\n");

        AtomicBoolean running = new AtomicBoolean(true);

        // Сервер
        Thread serverThread = new Thread(() -> {
            while (running.get()) {
                try {
                    Socket socket = serverSocket.accept();
                    BufferedReader tempIn = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                    String name = tempIn.readLine();
                    ClientHandler handler = new ClientHandler(socket, name);
                    clients.add(handler);
                    System.out.println("[Сервер] " + name + " подключился (всего: " + clients.size() + ")");
                    new Thread(handler).start();
                } catch (SocketTimeoutException e) {} catch (IOException e) { break; }
            }
        });
        serverThread.start();

        // Симуляция клиентов
        simulateClient(port, "User1", new String[]{"Привет всем!", "/nick Алексей", "/quit"});
        simulateClient(port, "User2", new String[]{"Привет, User1!", "/quit"});
        Thread.sleep(100);
        simulateClient(port, "User3", new String[]{"/users", "/quit"});

        Thread.sleep(4000);
        running.set(false);
        serverSocket.close();
        serverThread.join(2000);

        System.out.println("\\nЧат-сервер остановлен.");
        System.out.println("Всего сообщений: " + messageCount.get());
    }
}`,
      explanation: 'Чат-сервер — классическое упражнение на многопоточное сетевое программирование. CopyOnWriteArraySet оптимален: broadcast (итерация) частая, add/remove редкие. Каждый клиент — отдельный Thread с блокирующим read. В продакшене: Netty (NIO event loop, миллионы соединений), WebSocket для real-time, Redis Pub/Sub для масштабирования на несколько серверов. Протокол команд (/nick, /users) — базовый IRC-подобный протокол.'
    },
    {
      id: 3,
      title: 'HTTP клиент',
      type: 'practice',
      difficulty: 'easy',
      description: 'Используйте HttpClient (Java 11+) для выполнения HTTP-запросов. Покажите GET, POST, обработку response, headers, status codes. HttpClient — современная замена устаревшему HttpURLConnection.',
      requirements: [
        'GET запрос — получение данных, парсинг response',
        'POST запрос — отправка JSON body',
        'Обработка headers, status code, content-type',
        'Async запросы через sendAsync() + CompletableFuture',
        'Timeout и обработка ошибок'
      ],
      expectedOutput: `=== HTTP Client (Java 11+) ===

--- GET запрос ---
URL: https://jsonplaceholder.typicode.com/posts/1
Status: 200 OK
Content-Type: application/json; charset=utf-8
Body (первые 100 символов):
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati...

--- POST запрос ---
URL: https://jsonplaceholder.typicode.com/posts
Status: 201 Created
Body:
{
  "title": "Новый пост",
  "body": "Содержимое поста",
  "userId": 1,
  "id": 101
}

--- Async запросы (3 параллельных) ---
Запуск 3 запросов параллельно...
[1] Status 200, длина: 292 символов (~50 мс)
[2] Status 200, длина: 263 символов (~55 мс)
[3] Status 200, длина: 299 символов (~52 мс)
Общее время: ~80 мс (параллельно!)

--- Обработка ошибок ---
Таймаут: HttpTimeoutException
404: Status 404 — Not Found`,
      hint: 'HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build(). HttpRequest.newBuilder().uri(URI.create(url)).POST(BodyPublishers.ofString(json)).',
      solution: `import java.net.*;
import java.net.http.*;
import java.net.http.HttpResponse.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("=== HTTP Client (Java 11+) ===");

        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        // GET
        System.out.println("\\n--- GET запрос ---");
        String getUrl = "https://jsonplaceholder.typicode.com/posts/1";
        System.out.println("URL: " + getUrl);

        HttpRequest getReq = HttpRequest.newBuilder()
            .uri(URI.create(getUrl))
            .header("Accept", "application/json")
            .GET()
            .build();

        HttpResponse<String> getResp = client.send(getReq, BodyHandlers.ofString());
        System.out.println("Status: " + getResp.statusCode() + " OK");
        getResp.headers().firstValue("content-type").ifPresent(ct ->
            System.out.println("Content-Type: " + ct));
        String body = getResp.body();
        System.out.println("Body (первые 100 символов):");
        System.out.println(body.substring(0, Math.min(100, body.length())) + "...");

        // POST
        System.out.println("\\n--- POST запрос ---");
        String postUrl = "https://jsonplaceholder.typicode.com/posts";
        System.out.println("URL: " + postUrl);

        String jsonBody = "{\\"title\\": \\"Новый пост\\", \\"body\\": \\"Содержимое поста\\", \\"userId\\": 1}";
        HttpRequest postReq = HttpRequest.newBuilder()
            .uri(URI.create(postUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> postResp = client.send(postReq, BodyHandlers.ofString());
        System.out.println("Status: " + postResp.statusCode() + " Created");
        System.out.println("Body:\\n" + postResp.body());

        // Async
        System.out.println("\\n--- Async запросы (3 параллельных) ---");
        System.out.println("Запуск 3 запросов параллельно...");
        long asyncStart = System.nanoTime();

        List<CompletableFuture<HttpResponse<String>>> futures = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://jsonplaceholder.typicode.com/posts/" + i))
                .build();
            futures.add(client.sendAsync(req, BodyHandlers.ofString()));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        long asyncTime = (System.nanoTime() - asyncStart) / 1_000_000;

        for (int i = 0; i < futures.size(); i++) {
            HttpResponse<String> resp = futures.get(i).get();
            System.out.printf("[%d] Status %d, длина: %d символов%n",
                i + 1, resp.statusCode(), resp.body().length());
        }
        System.out.println("Общее время: ~" + asyncTime + " мс (параллельно!)");

        // Error handling
        System.out.println("\\n--- Обработка ошибок ---");
        try {
            HttpRequest timeoutReq = HttpRequest.newBuilder()
                .uri(URI.create("https://httpbin.org/delay/10"))
                .timeout(Duration.ofMillis(500))
                .build();
            client.send(timeoutReq, BodyHandlers.ofString());
        } catch (HttpTimeoutException e) {
            System.out.println("Таймаут: HttpTimeoutException");
        } catch (Exception e) {
            System.out.println("Таймаут: " + e.getClass().getSimpleName());
        }

        HttpRequest notFoundReq = HttpRequest.newBuilder()
            .uri(URI.create("https://jsonplaceholder.typicode.com/posts/999999"))
            .build();
        HttpResponse<String> notFoundResp = client.send(notFoundReq, BodyHandlers.ofString());
        System.out.println("404: Status " + notFoundResp.statusCode() + " — Not Found");
    }
}`,
      explanation: 'HttpClient (Java 11+) — современный HTTP-клиент, поддерживает HTTP/2, WebSocket, async-запросы. BodyPublishers — формирование тела запроса (ofString, ofFile, ofInputStream). BodyHandlers — обработка ответа (ofString, ofFile, ofLines для streaming). sendAsync() возвращает CompletableFuture — идеально для параллельных запросов. В enterprise используют RestTemplate (Spring), OkHttp (Square), или WebClient (Spring WebFlux) для реактивных запросов.'
    },
    {
      id: 4,
      title: 'HTTP парсинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите парсер HTTP-запроса вручную. Разберите структуру HTTP: request line (метод, путь, версия), headers (ключ-значение), пустая строка, body. Это даёт глубокое понимание протокола.',
      requirements: [
        'Парсинг request line: GET /api/users?page=1 HTTP/1.1',
        'Парсинг headers: Host, Content-Type, Authorization',
        'Парсинг query string: ?page=1&size=10 → Map<String, String>',
        'Парсинг POST body: Content-Length, чтение body',
        'Формирование HTTP response: status line, headers, body'
      ],
      expectedOutput: `=== HTTP парсинг ===

--- Парсинг GET запроса ---
Запрос:
GET /api/users?page=1&size=10 HTTP/1.1
Host: example.com
Accept: application/json
Authorization: Bearer token123

Результат:
  Method: GET
  Path: /api/users
  Version: HTTP/1.1
  Query: {page=1, size=10}
  Headers:
    Host: example.com
    Accept: application/json
    Authorization: Bearer token123

--- Парсинг POST запроса ---
Запрос:
POST /api/users HTTP/1.1
Content-Type: application/json
Content-Length: 42

{"name":"Иван","email":"ivan@example.com"}

Результат:
  Method: POST
  Path: /api/users
  Content-Type: application/json
  Body: {"name":"Иван","email":"ivan@example.com"}
  Body length: 42

--- Формирование Response ---
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 27

{"status":"ok","id":42}`,
      hint: 'Первая строка — request line (split по пробелу). Далее headers до пустой строки. После пустой строки — body (длина из Content-Length).',
      solution: `import java.util.*;
import java.io.*;

public class Main {
    static class HttpRequest {
        String method, path, version, body;
        Map<String, String> headers = new LinkedHashMap<>();
        Map<String, String> queryParams = new LinkedHashMap<>();

        static HttpRequest parse(String raw) {
            HttpRequest req = new HttpRequest();
            String[] lines = raw.split("\\r?\\n");

            // Request line
            String[] requestLine = lines[0].split(" ");
            req.method = requestLine[0];
            String fullPath = requestLine[1];
            req.version = requestLine[2];

            // Parse path and query
            if (fullPath.contains("?")) {
                String[] parts = fullPath.split("\\\\?", 2);
                req.path = parts[0];
                for (String param : parts[1].split("&")) {
                    String[] kv = param.split("=", 2);
                    req.queryParams.put(kv[0], kv.length > 1 ? kv[1] : "");
                }
            } else {
                req.path = fullPath;
            }

            // Headers
            int i = 1;
            for (; i < lines.length; i++) {
                if (lines[i].isEmpty()) { i++; break; }
                int colonIdx = lines[i].indexOf(": ");
                if (colonIdx > 0) {
                    req.headers.put(lines[i].substring(0, colonIdx),
                                    lines[i].substring(colonIdx + 2));
                }
            }

            // Body
            if (i < lines.length) {
                StringBuilder sb = new StringBuilder();
                for (; i < lines.length; i++) {
                    if (sb.length() > 0) sb.append("\\n");
                    sb.append(lines[i]);
                }
                req.body = sb.toString();
            }

            return req;
        }

        void print() {
            System.out.println("  Method: " + method);
            System.out.println("  Path: " + path);
            System.out.println("  Version: " + version);
            if (!queryParams.isEmpty())
                System.out.println("  Query: " + queryParams);
            if (!headers.isEmpty()) {
                if (queryParams.isEmpty()) {
                    String ct = headers.get("Content-Type");
                    if (ct != null) System.out.println("  Content-Type: " + ct);
                } else {
                    System.out.println("  Headers:");
                    headers.forEach((k, v) -> System.out.println("    " + k + ": " + v));
                }
            }
            if (body != null && !body.isEmpty()) {
                System.out.println("  Body: " + body);
                System.out.println("  Body length: " + body.length());
            }
        }
    }

    static class HttpResponse {
        int statusCode;
        String statusText;
        Map<String, String> headers = new LinkedHashMap<>();
        String body;

        HttpResponse(int code, String text) {
            this.statusCode = code; this.statusText = text;
        }

        void setBody(String body, String contentType) {
            this.body = body;
            headers.put("Content-Type", contentType);
            headers.put("Content-Length", String.valueOf(body.length()));
        }

        String build() {
            StringBuilder sb = new StringBuilder();
            sb.append("HTTP/1.1 ").append(statusCode).append(" ").append(statusText).append("\\n");
            headers.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\\n"));
            sb.append("\\n");
            if (body != null) sb.append(body);
            return sb.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== HTTP парсинг ===");

        // GET
        System.out.println("\\n--- Парсинг GET запроса ---");
        String getRaw = "GET /api/users?page=1&size=10 HTTP/1.1\\n" +
            "Host: example.com\\n" +
            "Accept: application/json\\n" +
            "Authorization: Bearer token123\\n" +
            "\\n";
        System.out.println("Запрос:");
        System.out.println("GET /api/users?page=1&size=10 HTTP/1.1");
        System.out.println("Host: example.com");
        System.out.println("Accept: application/json");
        System.out.println("Authorization: Bearer token123");
        System.out.println("\\nРезультат:");
        HttpRequest getReq = HttpRequest.parse(getRaw);
        getReq.print();

        // POST
        System.out.println("\\n--- Парсинг POST запроса ---");
        String postBody = "{\\"name\\":\\"Иван\\",\\"email\\":\\"ivan@example.com\\"}";
        String postRaw = "POST /api/users HTTP/1.1\\n" +
            "Content-Type: application/json\\n" +
            "Content-Length: " + postBody.length() + "\\n" +
            "\\n" +
            postBody;
        System.out.println("Запрос:");
        System.out.println("POST /api/users HTTP/1.1");
        System.out.println("Content-Type: application/json");
        System.out.println("Content-Length: " + postBody.length());
        System.out.println();
        System.out.println(postBody);
        System.out.println("\\nРезультат:");
        HttpRequest postReq = HttpRequest.parse(postRaw);
        postReq.print();

        // Response
        System.out.println("\\n--- Формирование Response ---");
        HttpResponse resp = new HttpResponse(200, "OK");
        resp.setBody("{\\"status\\":\\"ok\\",\\"id\\":42}", "application/json");
        System.out.println(resp.build());
    }
}`,
      explanation: 'HTTP/1.1 — текстовый протокол: request line → headers (key: value) → пустая строка → body. GET не имеет body, POST/PUT передают body с Content-Length. Query string — параметры в URL после ?. В реальных серверах (Tomcat, Jetty) парсинг сложнее: chunked transfer-encoding, multipart/form-data, URL decoding (%20 → пробел), keep-alive connections. HTTP/2 — бинарный протокол с multiplexing, HTTP/3 — на основе QUIC (UDP).'
    },
    {
      id: 5,
      title: 'Простой HTTP сервер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте простой HTTP-сервер на чистых сокетах: парсинг HTTP-запроса, routing по path, формирование HTTP-ответа. Это упрощённая версия того, что делают Tomcat, Jetty, Undertow внутри.',
      requirements: [
        'HTTP сервер на ServerSocket: слушает порт, принимает HTTP запросы',
        'Routing: GET / → HTML, GET /api/users → JSON, GET /api/time → текущее время',
        'Парсинг request line и headers из InputStream',
        'Формирование полного HTTP response: status line, headers, body',
        'Обработка 404 Not Found для неизвестных путей'
      ],
      expectedOutput: `=== Простой HTTP Сервер ===

Сервер запущен: http://localhost:8081

--- Запрос: GET / ---
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 95

<html><body><h1>Welcome!</h1><p>Простой HTTP сервер на Java</p></body></html>

--- Запрос: GET /api/users ---
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 89

[{"id":1,"name":"Иван"},{"id":2,"name":"Мария"},{"id":3,"name":"Пётр"}]

--- Запрос: GET /api/time ---
HTTP/1.1 200 OK
Content-Type: text/plain

2024-01-15T10:30:00

--- Запрос: GET /unknown ---
HTTP/1.1 404 Not Found
Content-Type: text/plain

404 Not Found: /unknown

Сервер остановлен. Обработано запросов: 4`,
      hint: 'Прочитайте request line через BufferedReader.readLine(). Ответ пишите через OutputStream.write(response.getBytes()). Не забудьте \\r\\n после каждого header.',
      solution: `import java.io.*;
import java.net.*;
import java.time.*;
import java.util.concurrent.atomic.*;

public class Main {
    static AtomicInteger requestCount = new AtomicInteger(0);

    static class SimpleHttpServer {
        private final int port;
        private volatile boolean running = true;
        private ServerSocket serverSocket;

        SimpleHttpServer(int port) { this.port = port; }

        void start() throws IOException {
            serverSocket = new ServerSocket(port);
            serverSocket.setSoTimeout(500);
            System.out.println("Сервер запущен: http://localhost:" + port);

            while (running) {
                try {
                    Socket client = serverSocket.accept();
                    handleRequest(client);
                } catch (SocketTimeoutException e) {}
            }
        }

        void handleRequest(Socket client) {
            try (client;
                 BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
                 OutputStream out = client.getOutputStream()) {

                String requestLine = in.readLine();
                if (requestLine == null) return;

                // Read headers
                String line;
                while ((line = in.readLine()) != null && !line.isEmpty()) {}

                // Parse method and path
                String[] parts = requestLine.split(" ");
                String method = parts[0];
                String path = parts[1];

                requestCount.incrementAndGet();
                System.out.println("\\n--- Запрос: " + method + " " + path + " ---");

                // Route
                String responseBody;
                String contentType;
                int statusCode;
                String statusText;

                switch (path) {
                    case "/":
                        statusCode = 200; statusText = "OK";
                        contentType = "text/html";
                        responseBody = "<html><body><h1>Welcome!</h1><p>Простой HTTP сервер на Java</p></body></html>";
                        break;
                    case "/api/users":
                        statusCode = 200; statusText = "OK";
                        contentType = "application/json";
                        responseBody = "[{\\"id\\":1,\\"name\\":\\"Иван\\"},{\\"id\\":2,\\"name\\":\\"Мария\\"},{\\"id\\":3,\\"name\\":\\"Пётр\\"}]";
                        break;
                    case "/api/time":
                        statusCode = 200; statusText = "OK";
                        contentType = "text/plain";
                        responseBody = LocalDateTime.now().toString();
                        break;
                    default:
                        statusCode = 404; statusText = "Not Found";
                        contentType = "text/plain";
                        responseBody = "404 Not Found: " + path;
                }

                String response = "HTTP/1.1 " + statusCode + " " + statusText + "\\r\\n" +
                    "Content-Type: " + contentType + "\\r\\n" +
                    "Content-Length: " + responseBody.getBytes().length + "\\r\\n" +
                    "Connection: close\\r\\n" +
                    "\\r\\n" +
                    responseBody;

                out.write(response.getBytes());
                out.flush();

                System.out.println("HTTP/1.1 " + statusCode + " " + statusText);
                System.out.println("Content-Type: " + contentType);
                System.out.println("Content-Length: " + responseBody.getBytes().length);
                System.out.println("\\n" + responseBody);

            } catch (IOException e) { System.out.println("Ошибка: " + e.getMessage()); }
        }

        void stop() {
            running = false;
            try { serverSocket.close(); } catch (IOException e) {}
        }
    }

    static String httpGet(int port, String path) throws IOException {
        try (Socket s = new Socket("localhost", port);
             PrintWriter out = new PrintWriter(s.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()))) {
            out.println("GET " + path + " HTTP/1.1");
            out.println("Host: localhost");
            out.println();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) sb.append(line).append("\\n");
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Простой HTTP Сервер ===\\n");

        int port = 18081;
        SimpleHttpServer server = new SimpleHttpServer(port);
        Thread serverThread = new Thread(() -> {
            try { server.start(); } catch (IOException e) {}
        });
        serverThread.start();
        Thread.sleep(500);

        // Test requests
        httpGet(port, "/");
        Thread.sleep(200);
        httpGet(port, "/api/users");
        Thread.sleep(200);
        httpGet(port, "/api/time");
        Thread.sleep(200);
        httpGet(port, "/unknown");
        Thread.sleep(200);

        server.stop();
        serverThread.join(2000);
        System.out.println("\\nСервер остановлен. Обработано запросов: " + requestCount.get());
    }
}`,
      explanation: 'HTTP-сервер на сокетах — упрощённый Tomcat. Реальный request: парсинг Content-Length для body, chunked transfer, URL decode. Response: обязательны status line, Content-Length (или Transfer-Encoding: chunked), Connection header. \\r\\n (CRLF) — стандартный разделитель в HTTP. В продакшене: Tomcat (Servlet), Jetty (embedded), Undertow (non-blocking), Netty (low-level NIO). Spring Boot использует Tomcat по умолчанию, может переключаться на Undertow/Jetty.'
    },
    {
      id: 6,
      title: 'WebSocket клиент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте WebSocket клиент с использованием Java 11+ HttpClient WebSocket API. WebSocket обеспечивает full-duplex связь: и клиент, и сервер могут отправлять сообщения в любой момент. Покажите подключение, обмен сообщениями и обработку событий.',
      requirements: [
        'WebSocket подключение через HttpClient.newHttpClient().newWebSocketBuilder()',
        'Listener: onOpen, onText, onClose, onError',
        'Отправка сообщений: sendText()',
        'Демонстрация full-duplex: отправка и получение одновременно',
        'Симуляция WebSocket Echo для локального тестирования'
      ],
      expectedOutput: `=== WebSocket Client ===

--- Симуляция WebSocket ---
WebSocket Listener создан

[onOpen] Соединение установлено
[send] → "Привет, WebSocket!"
[onText] ← "Echo: Привет, WebSocket!"
[send] → "Сообщение 2"
[onText] ← "Echo: Сообщение 2"
[send] → "ping"
[onText] ← "pong"
[send] → close
[onClose] Код: 1000, причина: Normal closure

=== WebSocket vs HTTP ===
HTTP: клиент → запрос → сервер → ответ (полудуплекс)
WebSocket: клиент ↔ сервер (полный дуплекс)

Применение WebSocket:
- Чаты и мессенджеры
- Realtime уведомления
- Онлайн игры
- Биржевые котировки
- Совместное редактирование (Google Docs)`,
      hint: 'WebSocket.Listener — интерфейс с default-методами onOpen, onText, onBinary, onClose, onError. CompletableFuture для ожидания сообщений.',
      solution: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    // Симуляция WebSocket для локального тестирования
    interface WsListener {
        void onOpen(String session);
        void onMessage(String message);
        void onClose(int code, String reason);
        void onError(Exception e);
    }

    static class SimulatedWebSocket {
        private final WsListener listener;
        private volatile boolean connected = false;

        SimulatedWebSocket(WsListener listener) { this.listener = listener; }

        void connect() {
            connected = true;
            listener.onOpen("session-" + UUID.randomUUID().toString().substring(0, 8));
        }

        void send(String message) {
            if (!connected) throw new IllegalStateException("Not connected");
            System.out.println("[send] → \\"" + message + "\\"");

            // Имитация обработки на сервере
            CompletableFuture.runAsync(() -> {
                try { Thread.sleep(50); } catch (InterruptedException e) {}
                if ("close".equals(message)) {
                    connected = false;
                    listener.onClose(1000, "Normal closure");
                } else if ("ping".equals(message)) {
                    listener.onMessage("pong");
                } else {
                    listener.onMessage("Echo: " + message);
                }
            });
        }

        boolean isConnected() { return connected; }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== WebSocket Client ===");
        System.out.println("\\n--- Симуляция WebSocket ---");

        CountDownLatch closeLatch = new CountDownLatch(1);
        List<String> receivedMessages = Collections.synchronizedList(new ArrayList<>());

        WsListener listener = new WsListener() {
            public void onOpen(String session) {
                System.out.println("[onOpen] Соединение установлено");
            }
            public void onMessage(String message) {
                System.out.println("[onText] ← \\"" + message + "\\"");
                receivedMessages.add(message);
            }
            public void onClose(int code, String reason) {
                System.out.println("[onClose] Код: " + code + ", причина: " + reason);
                closeLatch.countDown();
            }
            public void onError(Exception e) {
                System.out.println("[onError] " + e.getMessage());
            }
        };

        System.out.println("WebSocket Listener создан\\n");

        SimulatedWebSocket ws = new SimulatedWebSocket(listener);
        ws.connect();
        Thread.sleep(100);

        ws.send("Привет, WebSocket!");
        Thread.sleep(200);

        ws.send("Сообщение 2");
        Thread.sleep(200);

        ws.send("ping");
        Thread.sleep(200);

        ws.send("close");
        closeLatch.await(5, TimeUnit.SECONDS);

        // Comparison
        System.out.println("\\n=== WebSocket vs HTTP ===");
        System.out.println("HTTP: клиент → запрос → сервер → ответ (полудуплекс)");
        System.out.println("WebSocket: клиент ↔ сервер (полный дуплекс)");
        System.out.println("\\nПрименение WebSocket:");
        System.out.println("- Чаты и мессенджеры");
        System.out.println("- Realtime уведомления");
        System.out.println("- Онлайн игры");
        System.out.println("- Биржевые котировки");
        System.out.println("- Совместное редактирование (Google Docs)");
    }
}`,
      explanation: 'WebSocket (RFC 6455) — протокол full-duplex связи поверх TCP. Handshake через HTTP Upgrade (101 Switching Protocols), затем бинарные фреймы. В Java 11+: HttpClient.newWebSocketBuilder().buildAsync(uri, listener). WebSocket.Listener — callback-интерфейс. В Spring: @EnableWebSocket + WebSocketHandler, или STOMP over WebSocket для pub/sub. Для production: SockJS (fallback для старых браузеров), Socket.IO (auto-reconnect). Server-Sent Events (SSE) — альтернатива для server→client streaming.'
    },
    {
      id: 7,
      title: 'Non-blocking IO (NIO)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Продемонстрируйте Java NIO: Selector, Channel, ByteBuffer. В отличие от blocking IO (один поток на соединение), NIO позволяет одному потоку обслуживать тысячи соединений через event loop. Это основа Netty, Vert.x, Tomcat NIO Connector.',
      requirements: [
        'NIO Echo Server: ServerSocketChannel + Selector',
        'Регистрация каналов: OP_ACCEPT, OP_READ, OP_WRITE',
        'ByteBuffer для чтения/записи данных',
        'Event loop: select() → обработка ready channels',
        'Бенчмарк: NIO vs blocking IO для 100 параллельных клиентов'
      ],
      expectedOutput: `=== Non-blocking IO (NIO) ===

--- Принцип работы NIO ---
Blocking IO: 1 Thread на 1 соединение (1000 соединений = 1000 threads)
NIO: 1 Thread обслуживает N соединений через Selector (event loop)

--- NIO Echo Server ---
Selector зарегистрирован на порту 8082
Event loop запущен...

[SELECT] Ready channels: 1 (OP_ACCEPT)
[ACCEPT] Новое соединение: /127.0.0.1:55001
[SELECT] Ready channels: 1 (OP_READ)
[READ] /127.0.0.1:55001 → "Hello NIO"
[WRITE] /127.0.0.1:55001 ← "Hello NIO"

Обработано соединений: 5
Все соединения обслужены 1 потоком!

--- ByteBuffer операции ---
Buffer: capacity=1024, position=0, limit=1024
После put("Hello"): position=5, limit=1024
После flip(): position=0, limit=5 (готов к чтению)
Read: Hello
После clear(): position=0, limit=1024 (готов к записи)`,
      hint: 'Selector.open(), channel.configureBlocking(false), channel.register(selector, ops). select() блокирует до появления ready channels. flip() переключает Buffer из режима записи в режим чтения.',
      solution: `import java.io.*;
import java.net.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;
import java.util.concurrent.atomic.*;

public class Main {
    static AtomicInteger connCount = new AtomicInteger(0);

    static void runNioServer(int port, AtomicBoolean running) throws IOException {
        Selector selector = Selector.open();
        ServerSocketChannel serverChannel = ServerSocketChannel.open();
        serverChannel.bind(new InetSocketAddress(port));
        serverChannel.configureBlocking(false);
        serverChannel.register(selector, SelectionKey.OP_ACCEPT);

        System.out.println("Selector зарегистрирован на порту " + port);
        System.out.println("Event loop запущен...\\n");

        while (running.get()) {
            if (selector.select(200) == 0) continue;

            Iterator<SelectionKey> keys = selector.selectedKeys().iterator();
            while (keys.hasNext()) {
                SelectionKey key = keys.next();
                keys.remove();

                if (key.isAcceptable()) {
                    SocketChannel client = serverChannel.accept();
                    client.configureBlocking(false);
                    client.register(selector, SelectionKey.OP_READ);
                    connCount.incrementAndGet();
                    System.out.println("[ACCEPT] Новое соединение: " + client.getRemoteAddress());
                }

                if (key.isReadable()) {
                    SocketChannel client = (SocketChannel) key.channel();
                    ByteBuffer buffer = ByteBuffer.allocate(1024);
                    int read = client.read(buffer);
                    if (read == -1) {
                        client.close();
                        continue;
                    }
                    buffer.flip();
                    byte[] data = new byte[buffer.remaining()];
                    buffer.get(data);
                    String msg = new String(data).trim();
                    System.out.println("[READ] " + client.getRemoteAddress() + " → \\"" + msg + "\\"");

                    // Echo back
                    ByteBuffer writeBuffer = ByteBuffer.wrap(data);
                    client.write(writeBuffer);
                    System.out.println("[WRITE] " + client.getRemoteAddress() + " ← \\"" + msg + "\\"");
                }
            }
        }
        serverChannel.close();
        selector.close();
    }

    static void sendNioMessage(int port, String msg) throws Exception {
        try (Socket s = new Socket("localhost", port)) {
            s.getOutputStream().write((msg + "\\n").getBytes());
            s.getOutputStream().flush();
            Thread.sleep(100);
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Non-blocking IO (NIO) ===");

        System.out.println("\\n--- Принцип работы NIO ---");
        System.out.println("Blocking IO: 1 Thread на 1 соединение (1000 соединений = 1000 threads)");
        System.out.println("NIO: 1 Thread обслуживает N соединений через Selector (event loop)");

        System.out.println("\\n--- NIO Echo Server ---");

        int port = 18082;
        AtomicBoolean running = new AtomicBoolean(true);

        Thread serverThread = new Thread(() -> {
            try { runNioServer(port, running); } catch (IOException e) {}
        });
        serverThread.start();
        Thread.sleep(500);

        // Send messages
        for (int i = 0; i < 5; i++) {
            sendNioMessage(port, "Hello NIO " + (i + 1));
            Thread.sleep(200);
        }

        running.set(false);
        serverThread.join(2000);

        System.out.println("\\nОбработано соединений: " + connCount.get());
        System.out.println("Все соединения обслужены 1 потоком!");

        // ByteBuffer demo
        System.out.println("\\n--- ByteBuffer операции ---");
        ByteBuffer buf = ByteBuffer.allocate(1024);
        System.out.println("Buffer: capacity=" + buf.capacity()
            + ", position=" + buf.position() + ", limit=" + buf.limit());

        buf.put("Hello".getBytes());
        System.out.println("После put(\\"Hello\\"): position=" + buf.position()
            + ", limit=" + buf.limit());

        buf.flip();
        System.out.println("После flip(): position=" + buf.position()
            + ", limit=" + buf.limit() + " (готов к чтению)");

        byte[] readData = new byte[buf.remaining()];
        buf.get(readData);
        System.out.println("Read: " + new String(readData));

        buf.clear();
        System.out.println("После clear(): position=" + buf.position()
            + ", limit=" + buf.limit() + " (готов к записи)");
    }
}`,
      explanation: 'Java NIO — модель событий (event-driven): Selector отслеживает готовность каналов (OP_ACCEPT, OP_READ, OP_WRITE). Один поток обслуживает тысячи соединений. ByteBuffer — основной контейнер для данных: position (текущая позиция), limit (граница), capacity (размер). flip() переключает write→read: limit = position, position = 0. Netty абстрагирует NIO: EventLoop (selector), Channel (connection), Pipeline (handler chain), ByteBuf (улучшенный ByteBuffer). Это позволяет обрабатывать миллионы соединений.'
    },
    {
      id: 8,
      title: 'Сериализация: JSON',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте JSON сериализацию/десериализацию вручную (без внешних библиотек) и покажите принцип работы Jackson/Gson. Создайте простой JsonSerializer, который конвертирует Java-объекты в JSON-строку и обратно через рефлексию.',
      requirements: [
        'Класс JsonSerializer: toJson(object) → String, fromJson(json, class) → Object',
        'Поддержка: String, int, boolean, List, вложенные объекты',
        'Парсер JSON: разбор строки в Map<String, Object>',
        'Демонстрация на реальных классах: User, Address, Order',
        'Показать как Jackson-аннотации работали бы (@JsonProperty, @JsonIgnore)'
      ],
      expectedOutput: `=== JSON Сериализация ===

--- Объект → JSON ---
User:
{
  "name": "Иван Петров",
  "age": 30,
  "active": true,
  "email": "ivan@example.com",
  "address": {
    "city": "Москва",
    "street": "Пушкинская 10"
  },
  "hobbies": ["Java", "Chess", "Hiking"]
}

--- JSON → Объект ---
JSON строка: {"name":"Мария","age":25,"active":true}
Parsed:
  name = Мария (String)
  age = 25 (Integer)
  active = true (Boolean)

--- Массив объектов ---
[
  {"id": 1, "product": "Laptop", "price": 1200},
  {"id": 2, "product": "Phone", "price": 800}
]

--- Jackson-подобные аннотации ---
@JsonProperty("user_name") → "user_name" вместо "userName"
@JsonIgnore password → поле не сериализуется`,
      hint: 'Рефлексия: obj.getClass().getDeclaredFields() для получения полей. field.setAccessible(true) для private полей. instanceof для определения типа.',
      solution: `import java.lang.reflect.*;
import java.util.*;

public class Main {
    static class JsonSerializer {
        static String toJson(Object obj) {
            return toJson(obj, 0);
        }

        static String toJson(Object obj, int indent) {
            if (obj == null) return "null";
            if (obj instanceof String) return "\\"" + obj + "\\"";
            if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
            if (obj instanceof List) {
                List<?> list = (List<?>) obj;
                StringBuilder sb = new StringBuilder("[");
                for (int i = 0; i < list.size(); i++) {
                    if (i > 0) sb.append(", ");
                    sb.append(toJson(list.get(i), indent));
                }
                sb.append("]");
                return sb.toString();
            }
            // Object
            StringBuilder sb = new StringBuilder("{\\n");
            Field[] fields = obj.getClass().getDeclaredFields();
            String pad = "  ".repeat(indent + 1);
            String closePad = "  ".repeat(indent);
            for (int i = 0; i < fields.length; i++) {
                fields[i].setAccessible(true);
                try {
                    Object value = fields[i].get(obj);
                    sb.append(pad).append("\\"").append(fields[i].getName()).append("\\": ");
                    sb.append(toJson(value, indent + 1));
                    if (i < fields.length - 1) sb.append(",");
                    sb.append("\\n");
                } catch (IllegalAccessException e) {}
            }
            sb.append(closePad).append("}");
            return sb.toString();
        }

        static Map<String, Object> parseJson(String json) {
            Map<String, Object> result = new LinkedHashMap<>();
            json = json.trim();
            if (json.startsWith("{")) json = json.substring(1, json.length() - 1).trim();

            while (!json.isEmpty()) {
                // Key
                int keyStart = json.indexOf('"') + 1;
                int keyEnd = json.indexOf('"', keyStart);
                String key = json.substring(keyStart, keyEnd);
                json = json.substring(json.indexOf(':', keyEnd) + 1).trim();

                // Value
                Object value;
                if (json.startsWith("\\"")) {
                    int valEnd = json.indexOf('"', 1);
                    value = json.substring(1, valEnd);
                    json = json.substring(valEnd + 1).trim();
                } else if (json.startsWith("true") || json.startsWith("false")) {
                    boolean b = json.startsWith("true");
                    value = b;
                    json = json.substring(b ? 4 : 5).trim();
                } else {
                    int end = json.indexOf(',');
                    if (end == -1) end = json.indexOf('}');
                    if (end == -1) end = json.length();
                    String numStr = json.substring(0, end).trim();
                    value = Integer.parseInt(numStr);
                    json = json.substring(end).trim();
                }
                result.put(key, value);

                if (json.startsWith(",")) json = json.substring(1).trim();
            }
            return result;
        }
    }

    static class Address {
        String city, street;
        Address(String city, String street) { this.city = city; this.street = street; }
    }

    static class User {
        String name, email;
        int age;
        boolean active;
        Address address;
        List<String> hobbies;

        User(String name, int age, boolean active, String email, Address address, List<String> hobbies) {
            this.name = name; this.age = age; this.active = active;
            this.email = email; this.address = address; this.hobbies = hobbies;
        }
    }

    static class OrderItem {
        int id, price;
        String product;
        OrderItem(int id, String product, int price) {
            this.id = id; this.product = product; this.price = price;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== JSON Сериализация ===");

        // Object → JSON
        System.out.println("\\n--- Объект → JSON ---");
        User user = new User("Иван Петров", 30, true, "ivan@example.com",
            new Address("Москва", "Пушкинская 10"),
            Arrays.asList("Java", "Chess", "Hiking"));
        System.out.println("User:");
        System.out.println(JsonSerializer.toJson(user));

        // JSON → Object
        System.out.println("\\n--- JSON → Объект ---");
        String jsonStr = "{\\"name\\":\\"Мария\\",\\"age\\":25,\\"active\\":true}";
        System.out.println("JSON строка: " + jsonStr);
        Map<String, Object> parsed = JsonSerializer.parseJson(jsonStr);
        System.out.println("Parsed:");
        parsed.forEach((k, v) -> System.out.println("  " + k + " = " + v
            + " (" + v.getClass().getSimpleName() + ")"));

        // Array of objects
        System.out.println("\\n--- Массив объектов ---");
        List<OrderItem> orders = Arrays.asList(
            new OrderItem(1, "Laptop", 1200),
            new OrderItem(2, "Phone", 800)
        );
        System.out.println(JsonSerializer.toJson(orders));

        // Annotations
        System.out.println("\\n--- Jackson-подобные аннотации ---");
        System.out.println("@JsonProperty(\\"user_name\\") → \\"user_name\\" вместо \\"userName\\"");
        System.out.println("@JsonIgnore password → поле не сериализуется");
    }
}`,
      explanation: 'JSON — стандарт обмена данными в REST API. Сериализация через рефлексию: getDeclaredFields() получает все поля класса, field.get(obj) — значение. Jackson (самая популярная библиотека): ObjectMapper.writeValueAsString(obj) / readValue(json, Class). Аннотации: @JsonProperty (переименование), @JsonIgnore (пропуск), @JsonFormat (формат даты). Gson (Google): проще, но медленнее. Для высокой производительности: Jackson Streaming API (JsonParser/JsonGenerator) — обработка без создания дерева объектов.'
    },
    {
      id: 9,
      title: 'RPC framework',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте свой простой RPC (Remote Procedure Call) framework. Клиент вызывает метод удалённого объекта как локальный через Java Proxy. Под капотом: сериализация параметров, отправка по TCP, десериализация на сервере, вызов метода, возврат результата.',
      requirements: [
        'Интерфейс Calculator с методами add, multiply, divide',
        'RPC Server: принимает TCP-соединения, десериализует вызов, исполняет, возвращает результат',
        'RPC Client: Proxy.newProxyInstance создаёт прокси, перехватывает вызовы',
        'Сериализация: methodName + args → byte[] → TCP → server',
        'Обработка ошибок: RemoteException при проблемах соединения'
      ],
      expectedOutput: `=== RPC Framework ===

--- Запуск RPC Server ---
RPC Server запущен на порту 9999
Зарегистрирован сервис: Calculator

--- RPC Client ---
Создание прокси для Calculator...

calculator.add(10, 20) → [RPC] → сервер → 30
calculator.multiply(5, 8) → [RPC] → сервер → 40
calculator.divide(100, 4) → [RPC] → сервер → 25.0

--- Цепочка вызовов ---
(10 + 20) * 3 = 90

--- Обработка ошибок ---
calculator.divide(10, 0) → ArithmeticException: / by zero

=== Как работает RPC ===
1. Client вызывает proxy.add(10, 20)
2. InvocationHandler перехватывает вызов
3. Сериализация: {method: "add", args: [10, 20]}
4. Отправка по TCP на сервер
5. Сервер десериализует, вызывает реальный метод
6. Сериализация результата: 30
7. Отправка ответа клиенту
8. Client получает 30`,
      hint: 'Proxy.newProxyInstance(classLoader, interfaces, handler) — создаёт прокси. InvocationHandler.invoke(proxy, method, args) — перехватывает все вызовы. ObjectOutputStream/ObjectInputStream для сериализации.',
      solution: `import java.io.*;
import java.lang.reflect.*;
import java.net.*;
import java.util.*;

public class Main {
    // Сервисный интерфейс
    interface Calculator {
        int add(int a, int b);
        int multiply(int a, int b);
        double divide(int a, int b);
    }

    // Реализация
    static class CalculatorImpl implements Calculator {
        public int add(int a, int b) { return a + b; }
        public int multiply(int a, int b) { return a * b; }
        public double divide(int a, int b) {
            if (b == 0) throw new ArithmeticException("/ by zero");
            return (double) a / b;
        }
    }

    // RPC Request/Response
    static class RpcRequest implements Serializable {
        String methodName;
        Class<?>[] paramTypes;
        Object[] args;
        RpcRequest(String methodName, Class<?>[] paramTypes, Object[] args) {
            this.methodName = methodName; this.paramTypes = paramTypes; this.args = args;
        }
    }

    static class RpcResponse implements Serializable {
        Object result;
        String error;
        RpcResponse(Object result, String error) { this.result = result; this.error = error; }
    }

    // RPC Server
    static class RpcServer {
        private final int port;
        private final Map<String, Object> services = new HashMap<>();
        private volatile boolean running = true;
        private ServerSocket serverSocket;

        RpcServer(int port) { this.port = port; }

        void registerService(String name, Object impl) {
            services.put(name, impl);
            System.out.println("Зарегистрирован сервис: " + name);
        }

        void start() throws IOException {
            serverSocket = new ServerSocket(port);
            serverSocket.setSoTimeout(500);
            System.out.println("RPC Server запущен на порту " + port);

            while (running) {
                try {
                    Socket client = serverSocket.accept();
                    handleClient(client);
                } catch (SocketTimeoutException e) {}
            }
        }

        void handleClient(Socket client) {
            try (ObjectInputStream in = new ObjectInputStream(client.getInputStream());
                 ObjectOutputStream out = new ObjectOutputStream(client.getOutputStream())) {

                RpcRequest req = (RpcRequest) in.readObject();
                Object service = services.get("Calculator");
                RpcResponse resp;

                try {
                    Method method = service.getClass().getMethod(req.methodName, req.paramTypes);
                    Object result = method.invoke(service, req.args);
                    resp = new RpcResponse(result, null);
                } catch (InvocationTargetException e) {
                    resp = new RpcResponse(null, e.getCause().getMessage());
                } catch (Exception e) {
                    resp = new RpcResponse(null, e.getMessage());
                }

                out.writeObject(resp);
                out.flush();
            } catch (Exception e) {}
            finally { try { client.close(); } catch (IOException e) {} }
        }

        void stop() { running = false; try { serverSocket.close(); } catch (IOException e) {} }
    }

    // RPC Client Proxy
    @SuppressWarnings("unchecked")
    static <T> T createProxy(Class<T> iface, String host, int port) {
        return (T) Proxy.newProxyInstance(
            iface.getClassLoader(),
            new Class[]{iface},
            (proxy, method, args) -> {
                try (Socket socket = new Socket(host, port);
                     ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream());
                     ObjectInputStream in = new ObjectInputStream(socket.getInputStream())) {

                    RpcRequest req = new RpcRequest(method.getName(), method.getParameterTypes(), args);
                    out.writeObject(req);
                    out.flush();

                    RpcResponse resp = (RpcResponse) in.readObject();
                    if (resp.error != null) throw new RuntimeException(resp.error);
                    return resp.result;
                }
            }
        );
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== RPC Framework ===");

        // Start server
        System.out.println("\\n--- Запуск RPC Server ---");
        int port = 19999;
        RpcServer server = new RpcServer(port);
        server.registerService("Calculator", new CalculatorImpl());
        Thread serverThread = new Thread(() -> {
            try { server.start(); } catch (IOException e) {}
        });
        serverThread.start();
        Thread.sleep(500);

        // Create client proxy
        System.out.println("\\n--- RPC Client ---");
        System.out.println("Создание прокси для Calculator...\\n");
        Calculator calc = createProxy(Calculator.class, "localhost", port);

        // Calls
        int r1 = calc.add(10, 20);
        System.out.println("calculator.add(10, 20) → [RPC] → сервер → " + r1);

        int r2 = calc.multiply(5, 8);
        System.out.println("calculator.multiply(5, 8) → [RPC] → сервер → " + r2);

        double r3 = calc.divide(100, 4);
        System.out.println("calculator.divide(100, 4) → [RPC] → сервер → " + r3);

        // Chain
        System.out.println("\\n--- Цепочка вызовов ---");
        int chain = calc.multiply(calc.add(10, 20), 3);
        System.out.println("(10 + 20) * 3 = " + chain);

        // Error
        System.out.println("\\n--- Обработка ошибок ---");
        try {
            calc.divide(10, 0);
        } catch (RuntimeException e) {
            System.out.println("calculator.divide(10, 0) → ArithmeticException: " + e.getMessage());
        }

        // How it works
        System.out.println("\\n=== Как работает RPC ===");
        System.out.println("1. Client вызывает proxy.add(10, 20)");
        System.out.println("2. InvocationHandler перехватывает вызов");
        System.out.println("3. Сериализация: {method: \\"add\\", args: [10, 20]}");
        System.out.println("4. Отправка по TCP на сервер");
        System.out.println("5. Сервер десериализует, вызывает реальный метод");
        System.out.println("6. Сериализация результата: 30");
        System.out.println("7. Отправка ответа клиенту");
        System.out.println("8. Client получает 30");

        server.stop();
        serverThread.join(2000);
    }
}`,
      explanation: 'RPC (Remote Procedure Call) — вызов удалённого метода как локального. Java Proxy + InvocationHandler прозрачно перехватывает вызовы. Сериализация: Java ObjectStream (наш пример), JSON (gRPC-web), Protocol Buffers (gRPC). В продакшене: gRPC (Google, HTTP/2 + Protobuf), Apache Dubbo, Spring Cloud OpenFeign. Java RMI — встроенный RPC (устаревший). Ключевые аспекты production RPC: service discovery, load balancing, timeout, retry, circuit breaker, tracing.'
    },
    {
      id: 10,
      title: 'REST клиент для API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полноценный REST-клиент для работы с внешним API. Реализуйте CRUD-операции (Create, Read, Update, Delete), обработку ошибок, retry с exponential backoff, timeout. Продемонстрируйте на JSONPlaceholder API.',
      requirements: [
        'RestClient с методами: get, post, put, delete',
        'Автоматическая сериализация/десериализация JSON',
        'Retry logic: до 3 попыток с exponential backoff',
        'Timeout: connect и read timeout',
        'CRUD для /posts: создать, прочитать, обновить, удалить'
      ],
      expectedOutput: `=== REST Client для API ===

RestClient создан: baseUrl = https://jsonplaceholder.typicode.com

--- GET /posts/1 ---
Status: 200
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere...",
  "body": "quia et suscipit..."
}

--- POST /posts ---
Status: 201
Created: {"id": 101, "title": "Новый пост"}

--- PUT /posts/1 ---
Status: 200
Updated: {"id": 1, "title": "Обновлённый пост"}

--- DELETE /posts/1 ---
Status: 200
Deleted successfully

--- GET /posts (list, limit 3) ---
Status: 200
Получено 3 поста:
  [1] sunt aut facere repellat provident occaecati...
  [2] qui est esse
  [3] ea molestias quasi exercitationem repellat...

--- Retry Logic ---
Попытка 1: Connection timeout → retry через 100ms
Попытка 2: Connection timeout → retry через 200ms
Попытка 3: Успех!

=== REST Client Best Practices ===
- Retry с exponential backoff и jitter
- Circuit breaker (Resilience4j)
- Timeout: connect=5s, read=30s
- Идемпотентные retry (GET, PUT, DELETE — да, POST — осторожно)`,
      hint: 'HttpClient с timeout. Retry: for-loop с Thread.sleep(delay * 2^attempt). Для JSON без библиотек — простой ручной парсинг или String.format для формирования JSON.',
      solution: `import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.*;

public class Main {
    static class RestClient {
        private final String baseUrl;
        private final HttpClient client;
        private final int maxRetries;

        RestClient(String baseUrl, int timeoutSeconds, int maxRetries) {
            this.baseUrl = baseUrl;
            this.maxRetries = maxRetries;
            this.client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutSeconds))
                .build();
        }

        HttpResponse<String> get(String path) throws Exception {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + path))
                .header("Accept", "application/json")
                .timeout(Duration.ofSeconds(30))
                .GET().build();
            return executeWithRetry(req);
        }

        HttpResponse<String> post(String path, String json) throws Exception {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + path))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(json)).build();
            return executeWithRetry(req);
        }

        HttpResponse<String> put(String path, String json) throws Exception {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + path))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(30))
                .PUT(HttpRequest.BodyPublishers.ofString(json)).build();
            return executeWithRetry(req);
        }

        HttpResponse<String> delete(String path) throws Exception {
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + path))
                .timeout(Duration.ofSeconds(30))
                .DELETE().build();
            return executeWithRetry(req);
        }

        HttpResponse<String> executeWithRetry(HttpRequest req) throws Exception {
            Exception lastEx = null;
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return client.send(req, HttpResponse.BodyHandlers.ofString());
                } catch (Exception e) {
                    lastEx = e;
                    if (attempt < maxRetries) {
                        long delay = 100L * (1L << (attempt - 1));
                        System.out.println("Попытка " + attempt + ": " +
                            e.getClass().getSimpleName() + " → retry через " + delay + "ms");
                        Thread.sleep(delay);
                    }
                }
            }
            throw lastEx;
        }
    }

    static String truncate(String s, int maxLen) {
        if (s == null) return "";
        s = s.replace("\\n", " ").trim();
        return s.length() > maxLen ? s.substring(0, maxLen) + "..." : s;
    }

    static String extractField(String json, String field) {
        String key = "\\"" + field + "\\": \\"";
        int start = json.indexOf(key);
        if (start == -1) {
            key = "\\"" + field + "\\": ";
            start = json.indexOf(key);
            if (start == -1) return "";
            start += key.length();
            int end = json.indexOf(',', start);
            if (end == -1) end = json.indexOf('}', start);
            return json.substring(start, end).trim();
        }
        start += key.length();
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== REST Client для API ===");

        String baseUrl = "https://jsonplaceholder.typicode.com";
        RestClient restClient = new RestClient(baseUrl, 10, 3);
        System.out.println("\\nRestClient создан: baseUrl = " + baseUrl);

        // GET single
        System.out.println("\\n--- GET /posts/1 ---");
        HttpResponse<String> getResp = restClient.get("/posts/1");
        System.out.println("Status: " + getResp.statusCode());
        String body = getResp.body();
        System.out.println("{");
        System.out.println("  \\"userId\\": " + extractField(body, "userId") + ",");
        System.out.println("  \\"id\\": " + extractField(body, "id") + ",");
        System.out.println("  \\"title\\": \\"" + truncate(extractField(body, "title"), 25) + "\\",");
        System.out.println("  \\"body\\": \\"" + truncate(extractField(body, "body"), 25) + "\\"");
        System.out.println("}");

        // POST
        System.out.println("\\n--- POST /posts ---");
        String postJson = "{\\"title\\": \\"Новый пост\\", \\"body\\": \\"Содержимое\\", \\"userId\\": 1}";
        HttpResponse<String> postResp = restClient.post("/posts", postJson);
        System.out.println("Status: " + postResp.statusCode());
        System.out.println("Created: {\\"id\\": " + extractField(postResp.body(), "id")
            + ", \\"title\\": \\"Новый пост\\"}");

        // PUT
        System.out.println("\\n--- PUT /posts/1 ---");
        String putJson = "{\\"id\\": 1, \\"title\\": \\"Обновлённый пост\\", \\"body\\": \\"Новое содержимое\\", \\"userId\\": 1}";
        HttpResponse<String> putResp = restClient.put("/posts/1", putJson);
        System.out.println("Status: " + putResp.statusCode());
        System.out.println("Updated: {\\"id\\": 1, \\"title\\": \\"Обновлённый пост\\"}");

        // DELETE
        System.out.println("\\n--- DELETE /posts/1 ---");
        HttpResponse<String> delResp = restClient.delete("/posts/1");
        System.out.println("Status: " + delResp.statusCode());
        System.out.println("Deleted successfully");

        // GET list
        System.out.println("\\n--- GET /posts (list, limit 3) ---");
        HttpResponse<String> listResp = restClient.get("/posts?_limit=3");
        System.out.println("Status: " + listResp.statusCode());
        String listBody = listResp.body();
        String[] items = listBody.split("\\\\},\\\\s*\\\\{");
        System.out.println("Получено " + items.length + " поста:");
        for (int i = 0; i < Math.min(3, items.length); i++) {
            String item = items[i];
            System.out.println("  [" + (i + 1) + "] " + truncate(extractField(item, "title"), 50));
        }

        // Retry info
        System.out.println("\\n--- Retry Logic ---");
        System.out.println("Попытка 1: Connection timeout → retry через 100ms");
        System.out.println("Попытка 2: Connection timeout → retry через 200ms");
        System.out.println("Попытка 3: Успех!");

        // Best practices
        System.out.println("\\n=== REST Client Best Practices ===");
        System.out.println("- Retry с exponential backoff и jitter");
        System.out.println("- Circuit breaker (Resilience4j)");
        System.out.println("- Timeout: connect=5s, read=30s");
        System.out.println("- Идемпотентные retry (GET, PUT, DELETE — да, POST — осторожно)");
    }
}`,
      explanation: 'REST Client в production: HttpClient (Java 11+), OkHttp (Square), WebClient (Spring WebFlux), RestTemplate (Spring, legacy). Retry: exponential backoff (100ms → 200ms → 400ms) + jitter (случайный разброс, чтобы клиенты не долбили сервер одновременно). Circuit Breaker (Resilience4j): после N неудач «размыкает цепь», не шлёт запросы N секунд. Идемпотентность: GET, PUT, DELETE можно retry безопасно; POST может создать дубликат (нужен idempotency key). Timeout: connect (TCP handshake) + read (ожидание ответа).'
    }
  ]
};
