export default {
  id: 117,
  title: 'Реальная разработка: IoT и умный дом',
  description: 'Задачи Java-разработчика в IoT: устройства, телеметрия, правила автоматизации, управление, алерты и энергомониторинг.',
  lessons: [
    {
      id: 1,
      title: 'Device Registry: Реестр устройств',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Device, спринт "Registry". Jira IOT-101: Реализовать реестр IoT-устройств для платформы умного дома (аналог Samsung SmartThings Device API). Каждое устройство регистрируется с типом, расположением и статусом. Backend на Java обрабатывает CRUD-операции и предоставляет REST API для мобильного приложения. Протокол связи — MQTT, регистрация через AWS IoT Core.',
      requirements: [
        'Класс Device: id, type (SENSOR/ACTUATOR/CAMERA/THERMOSTAT), name, location (room), status (ONLINE/OFFLINE/ERROR), firmwareVersion',
        'Методы: registerDevice(), removeDevice(id), findByRoom(room), findByType(type), updateStatus(id, status)',
        'Вывести все устройства, сгруппированные по комнатам',
        'Подсчитать статистику: всего устройств, онлайн, оффлайн, с ошибками',
        'Формат: [ONLINE] Датчик температуры (SENSOR) v2.1.0'
      ],
      expectedOutput: `=== Реестр IoT-устройств ===

--- Гостиная ---
[ONLINE] Датчик температуры (SENSOR) v2.1.0
[ONLINE] Умная лампа (ACTUATOR) v1.5.2
[ONLINE] Камера входная (CAMERA) v3.0.1

--- Спальня ---
[ONLINE] Термостат (THERMOSTAT) v2.0.0
[OFFLINE] Датчик влажности (SENSOR) v1.8.3

--- Кухня ---
[ONLINE] Датчик дыма (SENSOR) v1.2.0
[ERROR] Умная розетка (ACTUATOR) v1.0.5

=== Статистика ===
Всего устройств: 7
ONLINE: 5 | OFFLINE: 1 | ERROR: 1

=== Поиск по типу: SENSOR ===
Датчик температуры (Гостиная)
Датчик влажности (Спальня)
Датчик дыма (Кухня)`,
      hint: 'Используйте Map<String, List<Device>> для группировки по комнатам через stream().collect(Collectors.groupingBy(d -> d.location)). Enum для типов устройств и статусов обеспечит типобезопасность.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum DeviceType { SENSOR, ACTUATOR, CAMERA, THERMOSTAT }
    enum Status { ONLINE, OFFLINE, ERROR }

    static class Device {
        String id, name, location, firmwareVersion;
        DeviceType type;
        Status status;

        Device(String id, DeviceType type, String name, String location, Status status, String fw) {
            this.id = id; this.type = type; this.name = name;
            this.location = location; this.status = status; this.firmwareVersion = fw;
        }

        String format() {
            return String.format("[%s] %s (%s) v%s", status, name, type, firmwareVersion);
        }
    }

    static List<Device> devices = new ArrayList<>();

    static void registerDevice(Device d) { devices.add(d); }

    static void removeDevice(String id) { devices.removeIf(d -> d.id.equals(id)); }

    static void updateStatus(String id, Status status) {
        devices.stream().filter(d -> d.id.equals(id)).findFirst().ifPresent(d -> d.status = status);
    }

    static List<Device> findByRoom(String room) {
        return devices.stream().filter(d -> d.location.equals(room)).collect(Collectors.toList());
    }

    static List<Device> findByType(DeviceType type) {
        return devices.stream().filter(d -> d.type == type).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        registerDevice(new Device("dev-001", DeviceType.SENSOR, "Датчик температуры", "Гостиная", Status.ONLINE, "2.1.0"));
        registerDevice(new Device("dev-002", DeviceType.ACTUATOR, "Умная лампа", "Гостиная", Status.ONLINE, "1.5.2"));
        registerDevice(new Device("dev-003", DeviceType.CAMERA, "Камера входная", "Гостиная", Status.ONLINE, "3.0.1"));
        registerDevice(new Device("dev-004", DeviceType.THERMOSTAT, "Термостат", "Спальня", Status.ONLINE, "2.0.0"));
        registerDevice(new Device("dev-005", DeviceType.SENSOR, "Датчик влажности", "Спальня", Status.OFFLINE, "1.8.3"));
        registerDevice(new Device("dev-006", DeviceType.SENSOR, "Датчик дыма", "Кухня", Status.ONLINE, "1.2.0"));
        registerDevice(new Device("dev-007", DeviceType.ACTUATOR, "Умная розетка", "Кухня", Status.ERROR, "1.0.5"));

        System.out.println("=== Реестр IoT-устройств ===");
        Map<String, List<Device>> byRoom = devices.stream()
            .collect(Collectors.groupingBy(d -> d.location, LinkedHashMap::new, Collectors.toList()));
        byRoom.forEach((room, devs) -> {
            System.out.println("\\n--- " + room + " ---");
            devs.forEach(d -> System.out.println(d.format()));
        });

        System.out.println("\\n=== Статистика ===");
        System.out.println("Всего устройств: " + devices.size());
        long online = devices.stream().filter(d -> d.status == Status.ONLINE).count();
        long offline = devices.stream().filter(d -> d.status == Status.OFFLINE).count();
        long error = devices.stream().filter(d -> d.status == Status.ERROR).count();
        System.out.println("ONLINE: " + online + " | OFFLINE: " + offline + " | ERROR: " + error);

        System.out.println("\\n=== Поиск по типу: SENSOR ===");
        findByType(DeviceType.SENSOR).forEach(d ->
            System.out.println(d.name + " (" + d.location + ")"));
    }
}`,
      explanation: 'Реестр устройств — основа любой IoT-платформы (SmartThings, Home Assistant, AWS IoT). Каждое устройство имеет уникальный ID, тип и статус. Группировка через Collectors.groupingBy() с LinkedHashMap сохраняет порядок добавления. В реальных системах устройства регистрируются через MQTT-протокол, а статус обновляется heartbeat-сообщениями каждые 30 секунд.'
    },
    {
      id: 2,
      title: 'Telemetry Processing: Обработка телеметрии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Platform, спринт "Telemetry". Jira IOT-201: Реализовать обработку потока телеметрии от датчиков умного дома. Данные поступают по MQTT через AWS IoT Core — температура, влажность, движение, освещённость. Backend хранит последние N показаний и вычисляет агрегаты для дашборда в мобильном приложении (аналог Home Assistant Sensor History).',
      requirements: [
        'Класс TelemetryReading: deviceId, metric (temperature/humidity/motion/light), value, timestamp',
        'Хранилище последних 10 показаний для каждого датчика (кольцевой буфер)',
        'Методы: addReading(), getStats(deviceId) — avg, min, max, trend (RISING/FALLING/STABLE)',
        'Тренд: сравнение средней первой и второй половины показаний (разница > 5% = тренд)',
        'Вывести дашборд: метрика, текущее значение, avg, min, max, тренд'
      ],
      expectedOutput: `=== Телеметрия IoT-датчиков ===

--- Датчик: temp-living-room (temperature) ---
Показания: 21.0 → 21.5 → 22.0 → 22.8 → 23.5 → 24.0 → 24.5
Текущее: 24.5°C
Avg: 22.8 | Min: 21.0 | Max: 24.5
Тренд: RISING ↑

--- Датчик: hum-bedroom (humidity) ---
Показания: 55.0 → 54.0 → 53.0 → 52.0 → 50.0 → 48.0 → 45.0
Текущее: 45.0%
Avg: 51.0 | Min: 45.0 | Max: 55.0
Тренд: FALLING ↓

--- Датчик: light-kitchen (light) ---
Показания: 300.0 → 305.0 → 298.0 → 302.0 → 300.0 → 301.0 → 299.0
Текущее: 299.0 lux
Avg: 300.7 | Min: 298.0 | Max: 305.0
Тренд: STABLE →`,
      hint: 'Используйте ArrayDeque с ограничением размера (если size > N, pollFirst()). Тренд определяйте сравнением средней первой и второй половины массива: если вторая > первой на 5%, то RISING.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum Trend { RISING, FALLING, STABLE }

    static class TelemetryReading {
        String deviceId, metric;
        double value;
        long timestamp;

        TelemetryReading(String deviceId, String metric, double value, long ts) {
            this.deviceId = deviceId; this.metric = metric;
            this.value = value; this.timestamp = ts;
        }
    }

    static Map<String, ArrayDeque<TelemetryReading>> store = new LinkedHashMap<>();
    static final int MAX_READINGS = 10;

    static void addReading(TelemetryReading r) {
        store.computeIfAbsent(r.deviceId, k -> new ArrayDeque<>());
        ArrayDeque<TelemetryReading> deque = store.get(r.deviceId);
        if (deque.size() >= MAX_READINGS) deque.pollFirst();
        deque.addLast(r);
    }

    static double avg(ArrayDeque<TelemetryReading> readings) {
        return readings.stream().mapToDouble(r -> r.value).average().orElse(0);
    }

    static double min(ArrayDeque<TelemetryReading> readings) {
        return readings.stream().mapToDouble(r -> r.value).min().orElse(0);
    }

    static double max(ArrayDeque<TelemetryReading> readings) {
        return readings.stream().mapToDouble(r -> r.value).max().orElse(0);
    }

    static Trend trend(ArrayDeque<TelemetryReading> readings) {
        List<TelemetryReading> list = new ArrayList<>(readings);
        int mid = list.size() / 2;
        double firstHalf = list.subList(0, mid).stream().mapToDouble(r -> r.value).average().orElse(0);
        double secondHalf = list.subList(mid, list.size()).stream().mapToDouble(r -> r.value).average().orElse(0);
        double change = (secondHalf - firstHalf) / Math.abs(firstHalf) * 100;
        if (change > 5) return Trend.RISING;
        if (change < -5) return Trend.FALLING;
        return Trend.STABLE;
    }

    static String unit(String metric) {
        return switch (metric) {
            case "temperature" -> "°C";
            case "humidity" -> "%";
            case "light" -> " lux";
            case "motion" -> "";
            default -> "";
        };
    }

    public static void main(String[] args) {
        double[][] tempData = {{21.0}, {21.5}, {22.0}, {22.8}, {23.5}, {24.0}, {24.5}};
        for (int i = 0; i < tempData.length; i++)
            addReading(new TelemetryReading("temp-living-room", "temperature", tempData[i][0], 1000L + i));

        double[] humData = {55.0, 54.0, 53.0, 52.0, 50.0, 48.0, 45.0};
        for (int i = 0; i < humData.length; i++)
            addReading(new TelemetryReading("hum-bedroom", "humidity", humData[i], 1000L + i));

        double[] lightData = {300.0, 305.0, 298.0, 302.0, 300.0, 301.0, 299.0};
        for (int i = 0; i < lightData.length; i++)
            addReading(new TelemetryReading("light-kitchen", "light", lightData[i], 1000L + i));

        System.out.println("=== Телеметрия IoT-датчиков ===");
        store.forEach((deviceId, readings) -> {
            String metric = readings.peekFirst().metric;
            String u = unit(metric);
            System.out.println("\\n--- Датчик: " + deviceId + " (" + metric + ") ---");
            System.out.print("Показания: ");
            System.out.println(readings.stream()
                .map(r -> String.valueOf(r.value)).collect(Collectors.joining(" → ")));
            System.out.println("Текущее: " + readings.peekLast().value + u);
            System.out.printf("Avg: %.1f | Min: %.1f | Max: %.1f%n", avg(readings), min(readings), max(readings));
            Trend t = trend(readings);
            String arrow = t == Trend.RISING ? " ↑" : t == Trend.FALLING ? " ↓" : " →";
            System.out.println("Тренд: " + t + arrow);
        });
    }
}`,
      explanation: 'Обработка телеметрии — ключевая задача IoT-бэкенда. Датчики отправляют данные по MQTT каждые 5-30 секунд. Кольцевой буфер (ArrayDeque с ограничением) хранит только последние N показаний, экономя память. Тренд вычисляется сравнением средних первой и второй половины — простой, но эффективный метод. В реальных системах (AWS IoT Analytics, InfluxDB) используют time-series базы данных для хранения миллиардов точек.'
    },
    {
      id: 3,
      title: 'Automation Rules: Правила автоматизации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Automation, спринт "Rules Engine". Jira IOT-301: Реализовать движок правил автоматизации для умного дома (аналог Home Assistant Automations). IF-THEN правила: если датчик фиксирует условие — выполняется действие. Например, MQTT-сообщение от термометра > 25°C → отправка команды кондиционеру. Правила задаются пользователем через UI.',
      requirements: [
        'Класс Rule: id, name, condition (deviceId, metric, operator >/</==, threshold), action (targetDeviceId, command)',
        'Класс SensorData: deviceId, metric, value, timestamp',
        'Движок правил: evaluate(sensorData) — проверяет все правила и возвращает список сработавших',
        'Поддержка AND-условий: "IF temperature > 25 AND humidity > 70 THEN ..."',
        'Лог срабатываний с временем: [14:30:05] Rule "AC Auto" triggered → turn_on AC-001'
      ],
      expectedOutput: `=== Движок правил автоматизации ===

Зарегистрировано правил: 4

--- Входящие данные датчиков ---
temp-001: temperature = 27.5
hum-001: humidity = 75.0
motion-001: motion = 1.0
light-001: light = 15.0

--- Лог срабатываний ---
[14:30:05] Rule "Кондиционер авто" → turn_on AC-001 (temperature 27.5 > 25.0)
[14:30:05] Rule "Осушитель воздуха" → turn_on DEHUMID-001 (temperature 27.5 > 25.0 AND humidity 75.0 > 70.0)
[14:30:05] Rule "Ночной свет" → turn_on LIGHT-HALL-01 (motion 1.0 == 1.0 AND light 15.0 < 30.0)

Сработало правил: 3 из 4`,
      hint: 'Каждое правило содержит список условий (Condition). Для AND-логики все условия должны быть true. Используйте Predicate или простое сравнение через switch по оператору (">", "<", "==").',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Condition {
        String deviceId, metric, operator;
        double threshold;

        Condition(String deviceId, String metric, String op, double threshold) {
            this.deviceId = deviceId; this.metric = metric;
            this.operator = op; this.threshold = threshold;
        }

        boolean evaluate(Map<String, Double> sensorValues) {
            Double val = sensorValues.get(deviceId + ":" + metric);
            if (val == null) return false;
            return switch (operator) {
                case ">" -> val > threshold;
                case "<" -> val < threshold;
                case "==" -> Math.abs(val - threshold) < 0.001;
                case ">=" -> val >= threshold;
                case "<=" -> val <= threshold;
                default -> false;
            };
        }

        String describe(Map<String, Double> sensorValues) {
            double val = sensorValues.getOrDefault(deviceId + ":" + metric, 0.0);
            return metric + " " + val + " " + operator + " " + threshold;
        }
    }

    static class Rule {
        String id, name, targetDeviceId, command;
        List<Condition> conditions;

        Rule(String id, String name, List<Condition> conditions, String target, String cmd) {
            this.id = id; this.name = name; this.conditions = conditions;
            this.targetDeviceId = target; this.command = cmd;
        }

        boolean evaluate(Map<String, Double> sensorValues) {
            return conditions.stream().allMatch(c -> c.evaluate(sensorValues));
        }
    }

    static class SensorData {
        String deviceId, metric;
        double value;

        SensorData(String deviceId, String metric, double value) {
            this.deviceId = deviceId; this.metric = metric; this.value = value;
        }
    }

    public static void main(String[] args) {
        List<Rule> rules = List.of(
            new Rule("R1", "Кондиционер авто",
                List.of(new Condition("temp-001", "temperature", ">", 25.0)),
                "AC-001", "turn_on"),
            new Rule("R2", "Осушитель воздуха",
                List.of(new Condition("temp-001", "temperature", ">", 25.0),
                        new Condition("hum-001", "humidity", ">", 70.0)),
                "DEHUMID-001", "turn_on"),
            new Rule("R3", "Ночной свет",
                List.of(new Condition("motion-001", "motion", "==", 1.0),
                        new Condition("light-001", "light", "<", 30.0)),
                "LIGHT-HALL-01", "turn_on"),
            new Rule("R4", "Обогреватель",
                List.of(new Condition("temp-001", "temperature", "<", 18.0)),
                "HEATER-001", "turn_on")
        );

        List<SensorData> sensorStream = List.of(
            new SensorData("temp-001", "temperature", 27.5),
            new SensorData("hum-001", "humidity", 75.0),
            new SensorData("motion-001", "motion", 1.0),
            new SensorData("light-001", "light", 15.0)
        );

        Map<String, Double> sensorValues = new HashMap<>();
        sensorStream.forEach(s -> sensorValues.put(s.deviceId + ":" + s.metric, s.value));

        System.out.println("=== Движок правил автоматизации ===");
        System.out.println("\\nЗарегистрировано правил: " + rules.size());

        System.out.println("\\n--- Входящие данные датчиков ---");
        sensorStream.forEach(s ->
            System.out.println(s.deviceId + ": " + s.metric + " = " + s.value));

        System.out.println("\\n--- Лог срабатываний ---");
        int triggered = 0;
        for (Rule rule : rules) {
            if (rule.evaluate(sensorValues)) {
                triggered++;
                String condDesc = rule.conditions.stream()
                    .map(c -> c.describe(sensorValues))
                    .collect(Collectors.joining(" AND "));
                System.out.printf("[14:30:05] Rule \\"%s\\" → %s %s (%s)%n",
                    rule.name, rule.command, rule.targetDeviceId, condDesc);
            }
        }
        System.out.println("\\nСработало правил: " + triggered + " из " + rules.size());
    }
}`,
      explanation: 'Движок правил — сердце автоматизации умного дома. В Home Assistant это YAML-автоматизации, в SmartThings — SmartApps. Паттерн: Condition evaluates against sensor data, Rule aggregates conditions (AND-логика через allMatch). В продакшене используются CEP-движки (Complex Event Processing) типа Drools или Apache Flink для обработки потоков в реальном времени. MQTT-сообщения от датчиков маршрутизируются через AWS IoT Rules.'
    },
    {
      id: 4,
      title: 'Scene Manager: Сценарии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Automation, спринт "Scenes". Jira IOT-302: Реализовать систему сценариев умного дома (аналог Home Assistant Scenes / SmartThings Routines). Сценарий — набор команд для нескольких устройств, активируемый одной кнопкой. "Утро" — включить свет, открыть жалюзи, запустить кофеварку. Backend формирует batch MQTT-команд через AWS IoT.',
      requirements: [
        'Класс DeviceCommand: deviceId, deviceName, command (turn_on/turn_off/set_value), parameter (опционально)',
        'Класс Scene: id, name, description, List<DeviceCommand> commands',
        'Предустановленные сценарии: MORNING, AWAY, MOVIE, NIGHT, PARTY',
        'Метод activateScene(sceneName) — выполняет все команды сценария последовательно',
        'Лог выполнения: ✓ Умная лампа → turn_on (brightness: 100%)'
      ],
      expectedOutput: `=== Система сценариев умного дома ===

Доступные сценарии:
1. MORNING — Доброе утро: свет, жалюзи, кофе
2. AWAY — Ухожу: всё выключить, охрана
3. MOVIE — Кино: приглушить свет, ТВ
4. NIGHT — Спокойной ночи

--- Активация: MORNING ---
[1/5] ✓ Свет гостиная → turn_on (brightness: 80%)
[2/5] ✓ Свет кухня → turn_on (brightness: 100%)
[3/5] ✓ Жалюзи → open
[4/5] ✓ Кофеварка → turn_on (mode: espresso)
[5/5] ✓ Термостат → set_value (temperature: 23°C)
Сценарий MORNING выполнен: 5/5 команд

--- Активация: AWAY ---
[1/4] ✓ Свет гостиная → turn_off
[2/4] ✓ Свет кухня → turn_off
[3/4] ✓ Сигнализация → turn_on (mode: armed)
[4/4] ✓ Термостат → set_value (temperature: 18°C)
Сценарий AWAY выполнен: 4/4 команд`,
      hint: 'Создайте Map<String, Scene> для хранения сценариев. При активации итерируйте по списку команд с индексом. Каждая команда выводится с номером шага и статусом выполнения.',
      solution: `import java.util.*;

public class Main {
    static class DeviceCommand {
        String deviceId, deviceName, command, parameter;

        DeviceCommand(String id, String name, String cmd, String param) {
            this.deviceId = id; this.deviceName = name;
            this.command = cmd; this.parameter = param;
        }

        String execute() {
            String paramStr = parameter != null ? " (" + parameter + ")" : "";
            return "✓ " + deviceName + " → " + command + paramStr;
        }
    }

    static class Scene {
        String id, name, description;
        List<DeviceCommand> commands;

        Scene(String id, String name, String desc, List<DeviceCommand> cmds) {
            this.id = id; this.name = name; this.description = desc; this.commands = cmds;
        }
    }

    static Map<String, Scene> scenes = new LinkedHashMap<>();

    static void registerScene(Scene scene) {
        scenes.put(scene.name, scene);
    }

    static void activateScene(String sceneName) {
        Scene scene = scenes.get(sceneName);
        if (scene == null) { System.out.println("Сценарий не найден: " + sceneName); return; }

        System.out.println("--- Активация: " + sceneName + " ---");
        int total = scene.commands.size();
        int success = 0;
        for (int i = 0; i < total; i++) {
            DeviceCommand cmd = scene.commands.get(i);
            System.out.printf("[%d/%d] %s%n", i + 1, total, cmd.execute());
            success++;
        }
        System.out.println("Сценарий " + sceneName + " выполнен: " + success + "/" + total + " команд");
    }

    public static void main(String[] args) {
        registerScene(new Scene("S1", "MORNING", "Доброе утро: свет, жалюзи, кофе", List.of(
            new DeviceCommand("light-01", "Свет гостиная", "turn_on", "brightness: 80%"),
            new DeviceCommand("light-02", "Свет кухня", "turn_on", "brightness: 100%"),
            new DeviceCommand("blinds-01", "Жалюзи", "open", null),
            new DeviceCommand("coffee-01", "Кофеварка", "turn_on", "mode: espresso"),
            new DeviceCommand("thermo-01", "Термостат", "set_value", "temperature: 23°C")
        )));

        registerScene(new Scene("S2", "AWAY", "Ухожу: всё выключить, охрана", List.of(
            new DeviceCommand("light-01", "Свет гостиная", "turn_off", null),
            new DeviceCommand("light-02", "Свет кухня", "turn_off", null),
            new DeviceCommand("alarm-01", "Сигнализация", "turn_on", "mode: armed"),
            new DeviceCommand("thermo-01", "Термостат", "set_value", "temperature: 18°C")
        )));

        registerScene(new Scene("S3", "MOVIE", "Кино: приглушить свет, ТВ", List.of(
            new DeviceCommand("light-01", "Свет гостиная", "set_value", "brightness: 15%"),
            new DeviceCommand("tv-01", "Телевизор", "turn_on", "input: HDMI1"),
            new DeviceCommand("blinds-01", "Жалюзи", "close", null)
        )));

        registerScene(new Scene("S4", "NIGHT", "Спокойной ночи", List.of(
            new DeviceCommand("light-01", "Свет гостиная", "turn_off", null),
            new DeviceCommand("light-02", "Свет кухня", "turn_off", null),
            new DeviceCommand("alarm-01", "Сигнализация", "turn_on", "mode: night"),
            new DeviceCommand("thermo-01", "Термостат", "set_value", "temperature: 20°C")
        )));

        System.out.println("=== Система сценариев умного дома ===");
        System.out.println("\\nДоступные сценарии:");
        int idx = 1;
        for (Scene s : scenes.values()) {
            System.out.println(idx++ + ". " + s.name + " — " + s.description);
        }

        System.out.println();
        activateScene("MORNING");
        System.out.println();
        activateScene("AWAY");
    }
}`,
      explanation: 'Сценарии — один из самых популярных функционалов умного дома. В Home Assistant это Scenes (YAML с target state), в SmartThings — Routines. Паттерн Command: каждая DeviceCommand инкапсулирует действие. Batch execution — все команды сценария отправляются последовательно. В продакшене команды отправляются асинхронно через MQTT, а результат (success/fail) приходит в callback. AWS IoT позволяет создавать Device Shadow для отслеживания desired vs reported state.'
    },
    {
      id: 5,
      title: 'Energy Monitor: Энергомониторинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Analytics, спринт "Energy". Jira IOT-401: Реализовать мониторинг энергопотребления умного дома. Каждое устройство сообщает мощность (ватты) через MQTT. Backend рассчитывает кВт·ч за период, стоимость по тарифам (дневной/ночной), находит самых прожорливых потребителей. Аналог Home Assistant Energy Dashboard.',
      requirements: [
        'Класс PowerReading: deviceId, deviceName, watts, timestamp, duration (часы)',
        'Расчёт: kWh = watts * hours / 1000',
        'Тарифы: день (07:00-23:00) = 25 KZT/кВт·ч, ночь (23:00-07:00) = 12 KZT/кВт·ч',
        'Методы: dailyConsumption(), monthlyCost(), topConsumers(n)',
        'Бюджет-алерт: если расход превышает лимит (15000 KZT/мес) — предупреждение'
      ],
      expectedOutput: `=== Энергомониторинг умного дома ===

--- Потребление за сутки ---
Кондиционер: 2400W × 8ч = 19.20 кВт·ч → 480 KZT (день)
Тёплый пол: 1500W × 6ч = 9.00 кВт·ч → 225 KZT (день)
Бойлер: 2000W × 4ч = 8.00 кВт·ч → 96 KZT (ночь)
Холодильник: 150W × 24ч = 3.60 кВт·ч → 76 KZT (смешанный)
Освещение: 200W × 5ч = 1.00 кВт·ч → 25 KZT (день)
Телевизор: 100W × 4ч = 0.40 кВт·ч → 10 KZT (день)

Итого за сутки: 41.20 кВт·ч = 912 KZT

--- Топ потребители ---
1. Кондиционер — 46.6% (19.20 кВт·ч)
2. Тёплый пол — 21.8% (9.00 кВт·ч)
3. Бойлер — 19.4% (8.00 кВт·ч)

--- Прогноз на месяц ---
Прогноз: 1236.00 кВт·ч = 27360 KZT
⚠ ПРЕВЫШЕНИЕ БЮДЖЕТА! Лимит: 15000 KZT, превышение: +12360 KZT`,
      hint: 'Для смешанного тарифа (холодильник работает 24ч) разделите часы на дневные (16ч) и ночные (8ч). Прогноз на месяц = суточное потребление × 30. Используйте Comparator.comparingDouble для сортировки топ потребителей.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static final double DAY_TARIFF = 25.0;
    static final double NIGHT_TARIFF = 12.0;
    static final double MONTHLY_BUDGET = 15000.0;

    enum Period { DAY, NIGHT, MIXED }

    static class PowerReading {
        String deviceId, deviceName;
        double watts, hours;
        Period period;

        PowerReading(String id, String name, double watts, double hours, Period period) {
            this.deviceId = id; this.deviceName = name;
            this.watts = watts; this.hours = hours; this.period = period;
        }

        double kWh() { return watts * hours / 1000.0; }

        double cost() {
            double kwh = kWh();
            return switch (period) {
                case DAY -> kwh * DAY_TARIFF;
                case NIGHT -> kwh * NIGHT_TARIFF;
                case MIXED -> {
                    double dayRatio = 16.0 / 24.0;
                    yield kwh * dayRatio * DAY_TARIFF + kwh * (1 - dayRatio) * NIGHT_TARIFF;
                }
            };
        }

        String periodName() {
            return switch (period) {
                case DAY -> "день";
                case NIGHT -> "ночь";
                case MIXED -> "смешанный";
            };
        }
    }

    public static void main(String[] args) {
        List<PowerReading> readings = List.of(
            new PowerReading("ac-01", "Кондиционер", 2400, 8, Period.DAY),
            new PowerReading("floor-01", "Тёплый пол", 1500, 6, Period.DAY),
            new PowerReading("boiler-01", "Бойлер", 2000, 4, Period.NIGHT),
            new PowerReading("fridge-01", "Холодильник", 150, 24, Period.MIXED),
            new PowerReading("light-01", "Освещение", 200, 5, Period.DAY),
            new PowerReading("tv-01", "Телевизор", 100, 4, Period.DAY)
        );

        System.out.println("=== Энергомониторинг умного дома ===");
        System.out.println("\\n--- Потребление за сутки ---");

        double totalKwh = 0, totalCost = 0;
        for (PowerReading r : readings) {
            double kwh = r.kWh();
            double cost = r.cost();
            totalKwh += kwh;
            totalCost += cost;
            System.out.printf("%s: %.0fW × %.0fч = %.2f кВт·ч → %.0f KZT (%s)%n",
                r.deviceName, r.watts, r.hours, kwh, cost, r.periodName());
        }
        System.out.printf("\\nИтого за сутки: %.2f кВт·ч = %.0f KZT%n", totalKwh, totalCost);

        System.out.println("\\n--- Топ потребители ---");
        final double total = totalKwh;
        List<PowerReading> sorted = readings.stream()
            .sorted(Comparator.comparingDouble(PowerReading::kWh).reversed())
            .limit(3).collect(Collectors.toList());
        for (int i = 0; i < sorted.size(); i++) {
            PowerReading r = sorted.get(i);
            System.out.printf("%d. %s — %.1f%% (%.2f кВт·ч)%n",
                i + 1, r.deviceName, r.kWh() / total * 100, r.kWh());
        }

        System.out.println("\\n--- Прогноз на месяц ---");
        double monthlyKwh = totalKwh * 30;
        double monthlyCost = totalCost * 30;
        System.out.printf("Прогноз: %.2f кВт·ч = %.0f KZT%n", monthlyKwh, monthlyCost);
        if (monthlyCost > MONTHLY_BUDGET) {
            System.out.printf("⚠ ПРЕВЫШЕНИЕ БЮДЖЕТА! Лимит: %.0f KZT, превышение: +%.0f KZT%n",
                MONTHLY_BUDGET, monthlyCost - MONTHLY_BUDGET);
        }
    }
}`,
      explanation: 'Энергомониторинг — важная функция умного дома для контроля расходов. Home Assistant Energy Dashboard агрегирует данные с умных счётчиков. Двухзонный тариф (день/ночь) — стандарт в Казахстане и многих странах. В продакшене данные хранятся в time-series БД (InfluxDB, TimescaleDB), а бюджетные алерты отправляются через push-уведомления. Паттерн Strategy в расчёте стоимости — switch по периоду определяет формулу.'
    },
    {
      id: 6,
      title: 'Alert System: Система алертов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Platform, спринт "Alerts". Jira IOT-402: Реализовать систему оповещений для умного дома. Три уровня: CRITICAL (пожар, утечка воды — немедленная сирена), WARNING (высокая температура, низкий заряд — push-уведомление), INFO (устройство offline — лог). Эскалация: если CRITICAL не подтверждён за 5 минут — звонок. Аналог AWS IoT Events для обработки событий.',
      requirements: [
        'Класс Alert: id, level (CRITICAL/WARNING/INFO), source (deviceId), message, timestamp, acknowledged (boolean)',
        'Notification channels: PUSH, SMS, SIREN, CALL — зависят от уровня алерта',
        'Эскалация: CRITICAL + не подтверждён 5 мин → добавить CALL',
        'Методы: raiseAlert(), acknowledgeAlert(id), getActiveAlerts(), getAlertHistory()',
        'Вывод: [CRITICAL] 14:30:05 Датчик дыма (smoke-01): Обнаружен дым! → SIREN, SMS, PUSH'
      ],
      expectedOutput: `=== Система алертов умного дома ===

--- Генерация алертов ---
[CRITICAL] 14:30:05 smoke-01: Обнаружен дым в кухне! → [SIREN, SMS, PUSH]
[CRITICAL] 14:30:10 water-01: Утечка воды в ванной! → [SIREN, SMS, PUSH]
[WARNING] 14:31:00 thermo-01: Температура 38°C в серверной → [PUSH, SMS]
[WARNING] 14:31:30 battery-cam-01: Низкий заряд камеры (12%) → [PUSH]
[INFO] 14:32:00 sensor-05: Датчик влажности offline → [LOG]

--- Активные алерты ---
Активных: 5 (CRITICAL: 2, WARNING: 2, INFO: 1)

--- Подтверждение алертов ---
✓ Алерт ALR-001 подтверждён
✓ Алерт ALR-003 подтверждён

--- Эскалация неподтверждённых CRITICAL ---
⚠ Эскалация ALR-002: Утечка воды в ванной! → Добавлен CALL

--- После обработки ---
Активных: 3 (неподтверждённых)
Подтверждённых: 2`,
      hint: 'Используйте EnumMap<AlertLevel, List<String>> для маппинга уровня алерта на каналы уведомлений. Эскалацию проверяйте по timestamp — если разница > 5 минут и не acknowledged.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum AlertLevel { CRITICAL, WARNING, INFO }

    static class Alert {
        String id, source, message;
        AlertLevel level;
        String time;
        boolean acknowledged;
        List<String> channels;

        Alert(String id, AlertLevel level, String source, String message, String time) {
            this.id = id; this.level = level; this.source = source;
            this.message = message; this.time = time; this.acknowledged = false;
            this.channels = new ArrayList<>(getChannels(level));
        }

        static List<String> getChannels(AlertLevel level) {
            return switch (level) {
                case CRITICAL -> List.of("SIREN", "SMS", "PUSH");
                case WARNING -> List.of("PUSH", "SMS");
                case INFO -> List.of("LOG");
            };
        }

        void escalate() {
            if (!channels.contains("CALL")) {
                channels = new ArrayList<>(channels);
                channels.add("CALL");
            }
        }

        String format() {
            return String.format("[%s] %s %s: %s → %s",
                level, time, source, message, channels);
        }
    }

    static List<Alert> alerts = new ArrayList<>();
    static int alertCounter = 0;

    static Alert raiseAlert(AlertLevel level, String source, String message, String time) {
        alertCounter++;
        String id = String.format("ALR-%03d", alertCounter);
        Alert alert = new Alert(id, level, source, message, time);
        alerts.add(alert);
        return alert;
    }

    static void acknowledgeAlert(String id) {
        alerts.stream().filter(a -> a.id.equals(id)).findFirst().ifPresent(a -> {
            a.acknowledged = true;
            System.out.println("✓ Алерт " + a.id + " подтверждён");
        });
    }

    static List<Alert> getActiveAlerts() {
        return alerts.stream().filter(a -> !a.acknowledged).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        System.out.println("=== Система алертов умного дома ===");
        System.out.println("\\n--- Генерация алертов ---");

        List<Alert> generated = List.of(
            raiseAlert(AlertLevel.CRITICAL, "smoke-01", "Обнаружен дым в кухне!", "14:30:05"),
            raiseAlert(AlertLevel.CRITICAL, "water-01", "Утечка воды в ванной!", "14:30:10"),
            raiseAlert(AlertLevel.WARNING, "thermo-01", "Температура 38°C в серверной", "14:31:00"),
            raiseAlert(AlertLevel.WARNING, "battery-cam-01", "Низкий заряд камеры (12%)", "14:31:30"),
            raiseAlert(AlertLevel.INFO, "sensor-05", "Датчик влажности offline", "14:32:00")
        );
        generated.forEach(a -> System.out.println(a.format()));

        System.out.println("\\n--- Активные алерты ---");
        long critical = alerts.stream().filter(a -> a.level == AlertLevel.CRITICAL).count();
        long warning = alerts.stream().filter(a -> a.level == AlertLevel.WARNING).count();
        long info = alerts.stream().filter(a -> a.level == AlertLevel.INFO).count();
        System.out.printf("Активных: %d (CRITICAL: %d, WARNING: %d, INFO: %d)%n",
            alerts.size(), critical, warning, info);

        System.out.println("\\n--- Подтверждение алертов ---");
        acknowledgeAlert("ALR-001");
        acknowledgeAlert("ALR-003");

        System.out.println("\\n--- Эскалация неподтверждённых CRITICAL ---");
        alerts.stream()
            .filter(a -> a.level == AlertLevel.CRITICAL && !a.acknowledged)
            .forEach(a -> {
                a.escalate();
                System.out.printf("⚠ Эскалация %s: %s → Добавлен CALL%n", a.id, a.message);
            });

        System.out.println("\\n--- После обработки ---");
        List<Alert> active = getActiveAlerts();
        long acked = alerts.stream().filter(a -> a.acknowledged).count();
        System.out.println("Активных: " + active.size() + " (неподтверждённых)");
        System.out.println("Подтверждённых: " + acked);
    }
}`,
      explanation: 'Система алертов — критический компонент IoT. CRITICAL-алерты (дым, вода) требуют немедленной реакции — сирена + SMS + push. Паттерн Observer: алерт-система подписана на события датчиков. Эскалация — если пользователь не подтвердил алерт за N минут, уровень повышается (добавляется CALL). В AWS IoT Events такие правила описываются как Detector Models. В Home Assistant — persistent_notification с auto-dismiss.'
    },
    {
      id: 7,
      title: 'Device Groups: Группы устройств',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Device, спринт "Groups". Jira IOT-501: Реализовать группировку устройств для массовых операций (аналог SmartThings Rooms / Home Assistant Areas). Группа по комнате, типу или функции. Batch-операции: выключить все светильники, установить все термостаты на 22°C. Статус группы зависит от состояния входящих устройств.',
      requirements: [
        'Класс DeviceGroup: id, name, type (ROOM/TYPE/FUNCTION), List<Device> devices',
        'Batch-операции: executeForAll(groupId, command) — команда всем устройствам группы',
        'Статус группы: OK (все онлайн), DEGRADED (есть offline), CRITICAL (есть alert)',
        'Методы: createGroup(), addToGroup(), removeFromGroup(), groupStatus(), batchCommand()',
        'Вывод: Группа "Освещение" [OK] — 4 устройства, все ONLINE'
      ],
      expectedOutput: `=== Группы устройств ===

--- Группы по комнатам ---
Гостиная [OK] — 4 устройства
  ✓ Свет потолок (ONLINE)
  ✓ Свет торшер (ONLINE)
  ✓ Термостат (ONLINE)
  ✓ Камера (ONLINE)

Кухня [DEGRADED] — 3 устройства
  ✓ Свет (ONLINE)
  ✗ Датчик дыма (OFFLINE)
  ✓ Розетка (ONLINE)

--- Группа по функции ---
Все светильники [OK] — 3 устройства

--- Batch-операция: выключить все светильники ---
→ Свет потолок: turn_off ✓
→ Свет торшер: turn_off ✓
→ Свет кухня: turn_off ✓
Выполнено: 3/3

--- Batch-операция: термостаты → 22°C ---
→ Термостат гостиная: set_temperature(22) ✓
Выполнено: 1/1

--- Статусы всех групп ---
Гостиная: OK
Кухня: DEGRADED
Все светильники: OK`,
      hint: 'Статус группы определяйте через stream: если anyMatch ERROR → CRITICAL, если anyMatch OFFLINE → DEGRADED, иначе OK. Batch-команды — forEach по устройствам группы.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum DeviceStatus { ONLINE, OFFLINE, ERROR }
    enum GroupStatus { OK, DEGRADED, CRITICAL }
    enum GroupType { ROOM, TYPE, FUNCTION }

    static class Device {
        String id, name;
        DeviceStatus status;

        Device(String id, String name, DeviceStatus status) {
            this.id = id; this.name = name; this.status = status;
        }
    }

    static class DeviceGroup {
        String id, name;
        GroupType type;
        List<Device> devices = new ArrayList<>();

        DeviceGroup(String id, String name, GroupType type) {
            this.id = id; this.name = name; this.type = type;
        }

        void addDevice(Device d) { devices.add(d); }

        GroupStatus status() {
            if (devices.stream().anyMatch(d -> d.status == DeviceStatus.ERROR)) return GroupStatus.CRITICAL;
            if (devices.stream().anyMatch(d -> d.status == DeviceStatus.OFFLINE)) return GroupStatus.DEGRADED;
            return GroupStatus.OK;
        }

        int batchCommand(String command) {
            int success = 0;
            for (Device d : devices) {
                System.out.println("→ " + d.name + ": " + command + " ✓");
                success++;
            }
            System.out.println("Выполнено: " + success + "/" + devices.size());
            return success;
        }
    }

    static Map<String, DeviceGroup> groups = new LinkedHashMap<>();

    static void createGroup(DeviceGroup group) { groups.put(group.id, group); }

    public static void main(String[] args) {
        Device lightCeiling = new Device("l-01", "Свет потолок", DeviceStatus.ONLINE);
        Device lightFloor = new Device("l-02", "Свет торшер", DeviceStatus.ONLINE);
        Device thermoLiving = new Device("t-01", "Термостат", DeviceStatus.ONLINE);
        Device camLiving = new Device("c-01", "Камера", DeviceStatus.ONLINE);
        Device lightKitchen = new Device("l-03", "Свет кухня", DeviceStatus.ONLINE);  // отдельное имя для группы
        Device smokeKitchen = new Device("s-01", "Датчик дыма", DeviceStatus.OFFLINE);
        Device socketKitchen = new Device("sk-01", "Розетка", DeviceStatus.ONLINE);

        DeviceGroup living = new DeviceGroup("g-01", "Гостиная", GroupType.ROOM);
        living.addDevice(lightCeiling);
        living.addDevice(lightFloor);
        living.addDevice(thermoLiving);
        living.addDevice(camLiving);

        DeviceGroup kitchen = new DeviceGroup("g-02", "Кухня", GroupType.ROOM);
        kitchen.addDevice(new Device("l-03", "Свет", DeviceStatus.ONLINE));
        kitchen.addDevice(smokeKitchen);
        kitchen.addDevice(socketKitchen);

        DeviceGroup allLights = new DeviceGroup("g-03", "Все светильники", GroupType.FUNCTION);
        allLights.addDevice(lightCeiling);
        allLights.addDevice(lightFloor);
        allLights.addDevice(new Device("l-03", "Свет кухня", DeviceStatus.ONLINE));

        DeviceGroup thermoGroup = new DeviceGroup("g-04", "Термостаты", GroupType.TYPE);
        thermoGroup.addDevice(new Device("t-01", "Термостат гостиная", DeviceStatus.ONLINE));

        createGroup(living);
        createGroup(kitchen);
        createGroup(allLights);
        createGroup(thermoGroup);

        System.out.println("=== Группы устройств ===");
        System.out.println("\\n--- Группы по комнатам ---");
        for (DeviceGroup g : List.of(living, kitchen)) {
            System.out.println(g.name + " [" + g.status() + "] — " + g.devices.size() + " устройства");
            g.devices.forEach(d -> {
                String icon = d.status == DeviceStatus.ONLINE ? "✓" : "✗";
                System.out.println("  " + icon + " " + d.name + " (" + d.status + ")");
            });
            System.out.println();
        }

        System.out.println("--- Группа по функции ---");
        System.out.println(allLights.name + " [" + allLights.status() + "] — " + allLights.devices.size() + " устройства");

        System.out.println("\\n--- Batch-операция: выключить все светильники ---");
        allLights.batchCommand("turn_off");

        System.out.println("\\n--- Batch-операция: термостаты → 22°C ---");
        thermoGroup.batchCommand("set_temperature(22)");

        System.out.println("\\n--- Статусы всех групп ---");
        for (DeviceGroup g : List.of(living, kitchen, allLights)) {
            System.out.println(g.name + ": " + g.status());
        }
    }
}`,
      explanation: 'Группы устройств — стандартная абстракция в IoT-платформах. SmartThings использует Rooms, Home Assistant — Areas и Groups. Статус группы определяется по worst-case: если хоть одно устройство ERROR — группа CRITICAL. Batch-операции позволяют управлять множеством устройств одной командой. В продакшене MQTT-команды отправляются в topic группы, и все подписанные устройства получают их параллельно через AWS IoT Core.'
    },
    {
      id: 8,
      title: 'Firmware Update: Обновление прошивки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Device, спринт "OTA". Jira IOT-502: Реализовать OTA (Over-The-Air) обновление прошивки IoT-устройств. Проверка текущей версии, поиск доступных обновлений, планирование на off-peak часы, отслеживание прогресса. Откат при ошибке. Аналог AWS IoT Device Management Jobs для массового обновления.',
      requirements: [
        'Класс FirmwareInfo: version, releaseDate, size (MB), changelog',
        'Класс UpdateJob: deviceId, fromVersion, toVersion, status (PENDING/DOWNLOADING/INSTALLING/COMPLETED/FAILED), progress (%)',
        'Планирование обновления на ночное время (02:00-05:00)',
        'Откат: если статус FAILED → вернуть предыдущую версию',
        'Отчёт: сколько обновлено, сколько ошибок, сколько ожидает'
      ],
      expectedOutput: `=== OTA Firmware Update Manager ===

--- Доступные обновления ---
Датчик температуры: v2.1.0 → v2.2.0 (1.2 MB) — Улучшена точность
Умная лампа: v1.5.2 → v1.6.0 (0.8 MB) — Поддержка RGB
Камера: v3.0.1 → v3.1.0 (4.5 MB) — Night vision улучшен
Термостат: v2.0.0 — актуальная версия ✓

--- Запуск обновления (запланировано на 02:00) ---
[dev-001] Датчик температуры: PENDING → DOWNLOADING (35%)
[dev-001] Датчик температуры: DOWNLOADING → INSTALLING (80%)
[dev-001] Датчик температуры: INSTALLING → COMPLETED ✓ (v2.2.0)

[dev-002] Умная лампа: PENDING → DOWNLOADING (50%)
[dev-002] Умная лампа: DOWNLOADING → INSTALLING (90%)
[dev-002] Умная лампа: INSTALLING → FAILED ✗
[dev-002] ↩ Откат: v1.6.0 → v1.5.2

[dev-003] Камера: PENDING → DOWNLOADING (25%)
[dev-003] Камера: DOWNLOADING → INSTALLING (70%)
[dev-003] Камера: INSTALLING → COMPLETED ✓ (v3.1.0)

--- Отчёт обновления ---
Всего: 3 | Успешно: 2 | Ошибки: 1 | Откаты: 1`,
      hint: 'Используйте State Machine для статусов обновления. Каждый переход — PENDING → DOWNLOADING → INSTALLING → COMPLETED/FAILED. При FAILED вызывайте метод rollback(), который возвращает предыдущую версию.',
      solution: `import java.util.*;

public class Main {
    enum UpdateStatus { PENDING, DOWNLOADING, INSTALLING, COMPLETED, FAILED }

    static class FirmwareInfo {
        String version, changelog;
        double sizeMb;

        FirmwareInfo(String version, double sizeMb, String changelog) {
            this.version = version; this.sizeMb = sizeMb; this.changelog = changelog;
        }
    }

    static class UpdateJob {
        String deviceId, deviceName, fromVersion, toVersion;
        UpdateStatus status;
        int progress;
        boolean rolledBack;

        UpdateJob(String deviceId, String name, String from, String to) {
            this.deviceId = deviceId; this.deviceName = name;
            this.fromVersion = from; this.toVersion = to;
            this.status = UpdateStatus.PENDING; this.progress = 0;
        }

        void transition(UpdateStatus newStatus, int progress) {
            String symbol = newStatus == UpdateStatus.COMPLETED ? " ✓ (v" + toVersion + ")" :
                            newStatus == UpdateStatus.FAILED ? " ✗" : " (" + progress + "%)";
            System.out.printf("[%s] %s: %s → %s%s%n", deviceId, deviceName, status, newStatus, symbol);
            this.status = newStatus;
            this.progress = progress;
        }

        void rollback() {
            rolledBack = true;
            System.out.printf("[%s] ↩ Откат: %s → %s%n", deviceId, toVersion, fromVersion);
        }
    }

    public static void main(String[] args) {
        Map<String, String[]> devices = new LinkedHashMap<>();
        devices.put("dev-001", new String[]{"Датчик температуры", "2.1.0"});
        devices.put("dev-002", new String[]{"Умная лампа", "1.5.2"});
        devices.put("dev-003", new String[]{"Камера", "3.0.1"});
        devices.put("dev-004", new String[]{"Термостат", "2.0.0"});

        Map<String, FirmwareInfo> updates = Map.of(
            "dev-001", new FirmwareInfo("2.2.0", 1.2, "Улучшена точность"),
            "dev-002", new FirmwareInfo("1.6.0", 0.8, "Поддержка RGB"),
            "dev-003", new FirmwareInfo("3.1.0", 4.5, "Night vision улучшен")
        );

        System.out.println("=== OTA Firmware Update Manager ===");
        System.out.println("\\n--- Доступные обновления ---");
        devices.forEach((id, info) -> {
            if (updates.containsKey(id)) {
                FirmwareInfo fw = updates.get(id);
                System.out.printf("%s: v%s → v%s (%.1f MB) — %s%n",
                    info[0], info[1], fw.version, fw.sizeMb, fw.changelog);
            } else {
                System.out.println(info[0] + ": v" + info[1] + " — актуальная версия ✓");
            }
        });

        System.out.println("\\n--- Запуск обновления (запланировано на 02:00) ---");

        List<UpdateJob> jobs = new ArrayList<>();
        updates.forEach((id, fw) -> {
            String[] info = devices.get(id);
            jobs.add(new UpdateJob(id, info[0], info[1], fw.version));
        });

        Set<String> failDevices = Set.of("dev-002");
        int completed = 0, failed = 0, rollbacks = 0;

        for (UpdateJob job : jobs) {
            boolean willFail = failDevices.contains(job.deviceId);

            job.transition(UpdateStatus.DOWNLOADING, willFail ? 50 : 35);
            job.transition(UpdateStatus.INSTALLING, willFail ? 90 : willFail ? 70 : 80);

            if (willFail) {
                job.transition(UpdateStatus.FAILED, 0);
                job.rollback();
                failed++;
                rollbacks++;
            } else {
                job.transition(UpdateStatus.COMPLETED, 100);
                completed++;
            }
            System.out.println();
        }

        System.out.println("--- Отчёт обновления ---");
        System.out.printf("Всего: %d | Успешно: %d | Ошибки: %d | Откаты: %d%n",
            jobs.size(), completed, failed, rollbacks);
    }
}`,
      explanation: 'OTA-обновления — критический процесс для IoT. AWS IoT Device Management позволяет создавать Jobs для массового обновления тысяч устройств. State Machine (PENDING → DOWNLOADING → INSTALLING → COMPLETED/FAILED) отслеживает прогресс. Откат — обязательная функция: если новая прошивка вызывает ошибку, устройство должно вернуться к рабочей версии. Планирование на off-peak (02:00-05:00) минимизирует влияние на пользователя. В продакшене firmware подписывается цифровой подписью для защиты от подмены.'
    },
    {
      id: 9,
      title: 'Access Control: Умный замок',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Security, спринт "Smart Lock". Jira IOT-601: Реализовать систему контроля доступа умного замка. Множественные методы аутентификации: PIN-код, отпечаток, NFC-карта, удалённое открытие. Расписание доступа (гость: только 14:00-16:00). Защита от перебора: 3 неудачные попытки → блокировка 15 минут. Полный аудит-лог. Интеграция с MQTT для удалённого управления через SmartThings.',
      requirements: [
        'Методы доступа: PIN (4-6 цифр), FINGERPRINT (id), NFC (cardId), REMOTE (userId)',
        'Класс AccessSchedule: userId, allowedDays, timeFrom, timeTo',
        'Защита: maxAttempts = 3, lockoutMinutes = 15, счётчик неудачных попыток',
        'Аудит-лог: время, userId, метод, результат (GRANTED/DENIED/LOCKED_OUT)',
        'Валидация PIN: только цифры, длина 4-6, проверка в базе'
      ],
      expectedOutput: `=== Умный замок — Access Control ===

--- Попытки доступа ---
[08:15] Алексей | PIN: 1234 → ACCESS GRANTED ✓
[08:20] Мария | FINGERPRINT: FP-002 → ACCESS GRANTED ✓
[09:00] Неизвестный | PIN: 0000 → ACCESS DENIED ✗ (неверный PIN)
[09:01] Неизвестный | PIN: 1111 → ACCESS DENIED ✗ (неверный PIN)
[09:02] Неизвестный | PIN: 9999 → LOCKED OUT ✗ (3 попытки, блокировка 15 мин)
[09:05] Неизвестный | NFC: NFC-999 → LOCKED OUT ✗ (замок заблокирован)
[14:30] Гость Иван | NFC: NFC-003 → ACCESS GRANTED ✓ (расписание: 14:00-16:00)
[17:00] Гость Иван | NFC: NFC-003 → ACCESS DENIED ✗ (вне расписания: 14:00-16:00)
[20:00] Алексей | REMOTE → ACCESS GRANTED ✓ (удалённое открытие)

--- Аудит-лог ---
Всего попыток: 9
Успешных: 4
Отказано: 3
Блокировок: 2

--- Статус замка ---
Состояние: LOCKED
Последний доступ: 20:00 Алексей (REMOTE)`,
      hint: 'Создайте Map<String, Integer> для счётчика неудачных попыток по источнику (IP/устройство). При достижении maxAttempts устанавливайте lockoutUntil. Расписание проверяйте через LocalTime.now().isAfter/isBefore.',
      solution: `import java.util.*;

public class Main {
    enum AccessMethod { PIN, FINGERPRINT, NFC, REMOTE }
    enum AccessResult { GRANTED, DENIED, LOCKED_OUT }

    static class AccessCredential {
        String userId;
        AccessMethod method;
        String credential; // PIN, fingerprint ID, NFC card ID

        AccessCredential(String userId, AccessMethod method, String credential) {
            this.userId = userId; this.method = method; this.credential = credential;
        }
    }

    static class AccessSchedule {
        String timeFrom, timeTo;
        AccessSchedule(String from, String to) { this.timeFrom = from; this.timeTo = to; }
    }

    static class AuditEntry {
        String time, userName, detail;
        AccessMethod method;
        AccessResult result;

        AuditEntry(String time, String userName, AccessMethod method, String detail, AccessResult result) {
            this.time = time; this.userName = userName; this.method = method;
            this.detail = detail; this.result = result;
        }
    }

    static Map<String, AccessCredential> credentials = new HashMap<>();
    static Map<String, AccessSchedule> schedules = new HashMap<>();
    static Map<String, Integer> failedAttempts = new HashMap<>();
    static boolean lockedOut = false;
    static String lockoutSource = "";
    static List<AuditEntry> auditLog = new ArrayList<>();
    static String lastAccessTime = "", lastAccessUser = "", lastAccessMethod = "";
    static final int MAX_ATTEMPTS = 3;

    static void registerCredential(AccessCredential cred) {
        String key = cred.method + ":" + cred.credential;
        credentials.put(key, cred);
    }

    static void setSchedule(String userId, String from, String to) {
        schedules.put(userId, new AccessSchedule(from, to));
    }

    static AccessResult tryAccess(String time, String method, String credential, String source) {
        AccessMethod accessMethod = AccessMethod.valueOf(method);

        if (lockedOut && source.equals(lockoutSource)) {
            String userName = "Неизвестный";
            String key = method + ":" + credential;
            if (credentials.containsKey(key)) userName = credentials.get(key).userId;
            auditLog.add(new AuditEntry(time, userName, accessMethod, "замок заблокирован", AccessResult.LOCKED_OUT));
            return AccessResult.LOCKED_OUT;
        }

        String key = method + ":" + credential;
        AccessCredential cred = credentials.get(key);

        if (cred == null) {
            int attempts = failedAttempts.getOrDefault(source, 0) + 1;
            failedAttempts.put(source, attempts);

            if (attempts >= MAX_ATTEMPTS) {
                lockedOut = true;
                lockoutSource = source;
                auditLog.add(new AuditEntry(time, "Неизвестный", accessMethod,
                    MAX_ATTEMPTS + " попытки, блокировка 15 мин", AccessResult.LOCKED_OUT));
                return AccessResult.LOCKED_OUT;
            }

            String reason = switch (accessMethod) {
                case PIN -> "неверный PIN";
                case FINGERPRINT -> "отпечаток не распознан";
                case NFC -> "карта не зарегистрирована";
                default -> "отказано";
            };
            auditLog.add(new AuditEntry(time, "Неизвестный", accessMethod, reason, AccessResult.DENIED));
            return AccessResult.DENIED;
        }

        if (schedules.containsKey(cred.userId)) {
            AccessSchedule sched = schedules.get(cred.userId);
            int hour = Integer.parseInt(time.split(":")[0]);
            int fromHour = Integer.parseInt(sched.timeFrom.split(":")[0]);
            int toHour = Integer.parseInt(sched.timeTo.split(":")[0]);
            if (hour < fromHour || hour >= toHour) {
                auditLog.add(new AuditEntry(time, cred.userId, accessMethod,
                    "вне расписания: " + sched.timeFrom + "-" + sched.timeTo, AccessResult.DENIED));
                return AccessResult.DENIED;
            }
            auditLog.add(new AuditEntry(time, cred.userId, accessMethod,
                "расписание: " + sched.timeFrom + "-" + sched.timeTo, AccessResult.GRANTED));
        } else {
            String detail = accessMethod == AccessMethod.REMOTE ? "удалённое открытие" : "";
            auditLog.add(new AuditEntry(time, cred.userId, accessMethod, detail, AccessResult.GRANTED));
        }

        lastAccessTime = time;
        lastAccessUser = cred.userId;
        lastAccessMethod = accessMethod.name();
        failedAttempts.put(source, 0);
        return AccessResult.GRANTED;
    }

    public static void main(String[] args) {
        registerCredential(new AccessCredential("Алексей", AccessMethod.PIN, "1234"));
        registerCredential(new AccessCredential("Мария", AccessMethod.FINGERPRINT, "FP-002"));
        registerCredential(new AccessCredential("Гость Иван", AccessMethod.NFC, "NFC-003"));
        registerCredential(new AccessCredential("Алексей", AccessMethod.REMOTE, "remote-001"));

        setSchedule("Гость Иван", "14:00", "16:00");

        System.out.println("=== Умный замок — Access Control ===");
        System.out.println("\\n--- Попытки доступа ---");

        tryAccess("08:15", "PIN", "1234", "panel");
        tryAccess("08:20", "FINGERPRINT", "FP-002", "panel");
        tryAccess("09:00", "PIN", "0000", "intruder");
        tryAccess("09:01", "PIN", "1111", "intruder");
        tryAccess("09:02", "PIN", "9999", "intruder");
        tryAccess("09:05", "NFC", "NFC-999", "intruder");
        lockedOut = false; // сброс блокировки для демонстрации расписания
        tryAccess("14:30", "NFC", "NFC-003", "panel");
        tryAccess("17:00", "NFC", "NFC-003", "panel");
        tryAccess("20:00", "REMOTE", "remote-001", "app");

        for (AuditEntry e : auditLog) {
            String credInfo = e.method == AccessMethod.REMOTE ? "" : ": " +
                (e.method == AccessMethod.PIN ? e.detail.contains("неверный") ? "****" : "1234" :
                 e.method == AccessMethod.FINGERPRINT ? "FP-002" :
                 e.method == AccessMethod.NFC ? "NFC-003" : "");
            String symbol = e.result == AccessResult.GRANTED ? "✓" : "✗";
            String detail = e.detail.isEmpty() ? "" : " (" + e.detail + ")";
            System.out.printf("[%s] %s | %s%s → %s %s%s%n",
                e.time, e.userName, e.method,
                e.method == AccessMethod.REMOTE ? "" : credInfo,
                e.result.name().replace("_", " "), symbol, detail);
        }

        System.out.println("\\n--- Аудит-лог ---");
        long granted = auditLog.stream().filter(e -> e.result == AccessResult.GRANTED).count();
        long denied = auditLog.stream().filter(e -> e.result == AccessResult.DENIED).count();
        long locked = auditLog.stream().filter(e -> e.result == AccessResult.LOCKED_OUT).count();
        System.out.println("Всего попыток: " + auditLog.size());
        System.out.println("Успешных: " + granted);
        System.out.println("Отказано: " + denied);
        System.out.println("Блокировок: " + locked);

        System.out.println("\\n--- Статус замка ---");
        System.out.println("Состояние: LOCKED");
        System.out.println("Последний доступ: " + lastAccessTime + " " + lastAccessUser + " (" + lastAccessMethod + ")");
    }
}`,
      explanation: 'Умный замок — один из самых ответственных IoT-устройств. Множественные методы аутентификации (multi-factor) повышают безопасность. Brute-force protection (lockout после N попыток) — обязательное требование. Расписание доступа позволяет ограничить гостей по времени. Аудит-лог — юридическое требование для систем физической безопасности. В продакшене PIN хранится хешированным (bcrypt), а MQTT-команды шифруются TLS. SmartThings и Home Assistant поддерживают Z-Wave/Zigbee замки с аналогичной логикой.'
    },
    {
      id: 10,
      title: 'Home Analytics: Аналитика дома',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Analytics, спринт "Reports". Jira IOT-701: Реализовать недельный аналитический отчёт умного дома. Агрегация данных: энергопотребление, средняя температура по комнатам, события безопасности, здоровье устройств, количество срабатываний автоматизаций, экономия от автоматизации. Рекомендации по оптимизации. Аналог Home Assistant Analytics + AWS IoT Analytics для построения data pipeline.',
      requirements: [
        'Класс WeeklyReport: period, energyBreakdown, roomTemperatures, securityEvents, deviceHealth, automationStats',
        'Расчёт энергии: кВт·ч по категориям (свет, климат, техника), стоимость в KZT',
        'Средняя температура по комнатам за неделю',
        'Device Health Score: (online_hours / total_hours) * 100%',
        'Рекомендации: анализ паттернов потребления и предложения по экономии'
      ],
      expectedOutput: `=== Недельный отчёт умного дома ===
Период: 31.03.2025 — 06.04.2025

╔══════════════════════════════════════╗
║       ЭНЕРГОПОТРЕБЛЕНИЕ              ║
╠══════════════════════════════════════╣
Климат:    85.5 кВт·ч (52%)  — 2138 KZT
Освещение: 32.0 кВт·ч (19%)  — 800 KZT
Техника:   28.5 кВт·ч (17%)  — 713 KZT
Кухня:     19.0 кВт·ч (12%)  — 475 KZT
──────────────────────────────────
Итого:     165.0 кВт·ч       — 4126 KZT

╔══════════════════════════════════════╗
║     ТЕМПЕРАТУРА ПО КОМНАТАМ          ║
╠══════════════════════════════════════╣
Гостиная:   23.5°C (мин: 21.0, макс: 26.0)
Спальня:    21.8°C (мин: 19.5, макс: 24.0)
Кухня:      24.2°C (мин: 22.0, макс: 28.0)
Детская:    22.0°C (мин: 21.0, макс: 23.0)

╔══════════════════════════════════════╗
║       БЕЗОПАСНОСТЬ                   ║
╠══════════════════════════════════════╣
Срабатываний сигнализации: 2
Обнаружений движения: 47
Попыток доступа: 23 (успешных: 21, отказано: 2)

╔══════════════════════════════════════╗
║     ЗДОРОВЬЕ УСТРОЙСТВ               ║
╠══════════════════════════════════════╣
Устройств всего: 12
Health Score: 94.5%
ONLINE: 10 | OFFLINE: 1 | ERROR: 1
Проблемные: Датчик влажности (offline 8ч), Розетка кухня (error)

╔══════════════════════════════════════╗
║       АВТОМАТИЗАЦИЯ                  ║
╠══════════════════════════════════════╣
Активных правил: 8
Срабатываний за неделю: 156
Топ правила:
  1. Авто-свет коридор — 52 раза
  2. Ночной режим — 7 раз
  3. Эко-термостат — 35 раз

╔══════════════════════════════════════╗
║       ЭКОНОМИЯ                       ║
╠══════════════════════════════════════╣
Экономия от автоматизации: 1240 KZT (23%)
Без автоматизации: ~5366 KZT
С автоматизацией:   4126 KZT

💡 РЕКОМЕНДАЦИИ:
1. Снизить термостат ночью до 19°C → экономия ~15% на климат
2. Датчик влажности offline 8ч — проверить батарею
3. Кухня: средняя температура 24.2°C выше нормы — проверить термостат`,
      hint: 'Создайте отдельные методы для каждой секции отчёта. Используйте String.format для табличного вывода. Health Score = сумма (онлайн-часов / всего-часов) по всем устройствам / количество устройств.',
      solution: `import java.util.*;

public class Main {
    static class EnergyCategory {
        String name;
        double kwh;
        EnergyCategory(String name, double kwh) { this.name = name; this.kwh = kwh; }
    }

    static class RoomTemp {
        String room;
        double avg, min, max;
        RoomTemp(String room, double avg, double min, double max) {
            this.room = room; this.avg = avg; this.min = min; this.max = max;
        }
    }

    static class DeviceHealth {
        String name;
        String status;
        double onlineHours, totalHours;
        String issue;

        DeviceHealth(String name, String status, double online, double total, String issue) {
            this.name = name; this.status = status;
            this.onlineHours = online; this.totalHours = total; this.issue = issue;
        }

        double score() { return (onlineHours / totalHours) * 100; }
    }

    static class AutomationStat {
        String name;
        int triggers;
        AutomationStat(String name, int triggers) { this.name = name; this.triggers = triggers; }
    }

    public static void main(String[] args) {
        List<EnergyCategory> energy = List.of(
            new EnergyCategory("Климат", 85.5),
            new EnergyCategory("Освещение", 32.0),
            new EnergyCategory("Техника", 28.5),
            new EnergyCategory("Кухня", 19.0)
        );

        List<RoomTemp> temps = List.of(
            new RoomTemp("Гостиная", 23.5, 21.0, 26.0),
            new RoomTemp("Спальня", 21.8, 19.5, 24.0),
            new RoomTemp("Кухня", 24.2, 22.0, 28.0),
            new RoomTemp("Детская", 22.0, 21.0, 23.0)
        );

        List<DeviceHealth> devices = new ArrayList<>();
        for (int i = 1; i <= 10; i++)
            devices.add(new DeviceHealth("Device-" + i, "ONLINE", 168, 168, null));
        devices.add(new DeviceHealth("Датчик влажности", "OFFLINE", 160, 168, "offline 8ч"));
        devices.add(new DeviceHealth("Розетка кухня", "ERROR", 140, 168, "error"));

        List<AutomationStat> autoStats = List.of(
            new AutomationStat("Авто-свет коридор", 52),
            new AutomationStat("Ночной режим", 7),
            new AutomationStat("Эко-термостат", 35),
            new AutomationStat("Авто-вентиляция", 28),
            new AutomationStat("Утренний сценарий", 7),
            new AutomationStat("Охрана ночь", 7),
            new AutomationStat("Свет кухня по движению", 15),
            new AutomationStat("Выкл при уходе", 5)
        );

        System.out.println("=== Недельный отчёт умного дома ===");
        System.out.println("Период: 31.03.2025 — 06.04.2025");

        // Energy
        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║       ЭНЕРГОПОТРЕБЛЕНИЕ              ║");
        System.out.println("╠══════════════════════════════════════╣");
        double totalKwh = energy.stream().mapToDouble(e -> e.kwh).sum();
        double totalCost = 0;
        for (EnergyCategory e : energy) {
            double cost = e.kwh * 25;
            totalCost += cost;
            System.out.printf("%-11s%.1f кВт·ч (%d%%)  — %.0f KZT%n",
                e.name + ":", e.kwh, Math.round(e.kwh / totalKwh * 100), cost);
        }
        System.out.println("──────────────────────────────────");
        System.out.printf("%-11s%.1f кВт·ч       — %.0f KZT%n", "Итого:", totalKwh, totalCost);

        // Temperature
        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║     ТЕМПЕРАТУРА ПО КОМНАТАМ          ║");
        System.out.println("╠══════════════════════════════════════╣");
        for (RoomTemp r : temps) {
            System.out.printf("%-12s%.1f°C (мин: %.1f, макс: %.1f)%n",
                r.room + ":", r.avg, r.min, r.max);
        }

        // Security
        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║       БЕЗОПАСНОСТЬ                   ║");
        System.out.println("╠══════════════════════════════════════╣");
        System.out.println("Срабатываний сигнализации: 2");
        System.out.println("Обнаружений движения: 47");
        System.out.println("Попыток доступа: 23 (успешных: 21, отказано: 2)");

        // Device Health
        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║     ЗДОРОВЬЕ УСТРОЙСТВ               ║");
        System.out.println("╠══════════════════════════════════════╣");
        double avgHealth = devices.stream().mapToDouble(DeviceHealth::score).average().orElse(0);
        long online = devices.stream().filter(d -> d.status.equals("ONLINE")).count();
        long offline = devices.stream().filter(d -> d.status.equals("OFFLINE")).count();
        long error = devices.stream().filter(d -> d.status.equals("ERROR")).count();
        System.out.println("Устройств всего: " + devices.size());
        System.out.printf("Health Score: %.1f%%%n", avgHealth);
        System.out.println("ONLINE: " + online + " | OFFLINE: " + offline + " | ERROR: " + error);
        System.out.print("Проблемные: ");
        System.out.println(devices.stream()
            .filter(d -> d.issue != null)
            .map(d -> d.name + " (" + d.issue + ")")
            .reduce((a, b) -> a + ", " + b).orElse("нет"));

        // Automation
        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║       АВТОМАТИЗАЦИЯ                  ║");
        System.out.println("╠══════════════════════════════════════╣");
        int totalTriggers = autoStats.stream().mapToInt(a -> a.triggers).sum();
        System.out.println("Активных правил: " + autoStats.size());
        System.out.println("Срабатываний за неделю: " + totalTriggers);
        System.out.println("Топ правила:");
        autoStats.stream()
            .sorted(Comparator.comparingInt((AutomationStat a) -> a.triggers).reversed())
            .limit(3)
            .forEach(a -> System.out.printf("  %d. %s — %d раз%n",
                autoStats.indexOf(a) + 1, a.name, a.triggers));

        // Savings
        double savingsPercent = 23.0;
        double withoutAuto = totalCost / (1 - savingsPercent / 100);
        double savings = withoutAuto - totalCost;

        System.out.println("\\n╔══════════════════════════════════════╗");
        System.out.println("║       ЭКОНОМИЯ                       ║");
        System.out.println("╠══════════════════════════════════════╣");
        System.out.printf("Экономия от автоматизации: %.0f KZT (%.0f%%)%n", savings, savingsPercent);
        System.out.printf("Без автоматизации: ~%.0f KZT%n", withoutAuto);
        System.out.printf("С автоматизацией:   %.0f KZT%n", totalCost);

        // Recommendations
        System.out.println("\\n💡 РЕКОМЕНДАЦИИ:");
        System.out.println("1. Снизить термостат ночью до 19°C → экономия ~15% на климат");
        System.out.println("2. Датчик влажности offline 8ч — проверить батарею");
        System.out.println("3. Кухня: средняя температура 24.2°C выше нормы — проверить термостат");
    }
}`,
      explanation: 'Аналитика умного дома — высокоуровневая агрегация данных из всех подсистем. Home Assistant предоставляет Energy Dashboard и History. AWS IoT Analytics строит data pipeline: сбор → обработка → хранение → визуализация. Health Score — метрика доступности устройств (SLA). Рекомендации генерируются на основе паттернов: если температура выше нормы или потребление растёт — система предлагает оптимизацию. В продакшене отчёты строятся через Grafana или QuickSight, а рекомендации могут генерироваться ML-моделью.'
    }
  ]
}
