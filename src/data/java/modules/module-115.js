export default {
  id: 115,
  title: 'Реальная разработка: Трейдинг-платформа',
  description: 'Задачи Java-разработчика в трейдинге: ордера, биржевой стакан, портфель, P&L, свечи, лимиты, маржин-колл и риск-менеджмент.',
  lessons: [
    {
      id: 1,
      title: 'Market Data: Рыночные данные',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Market Data. Спринт 1. Jira: TRD-101. Ты работаешь в Halyk Finance и строишь систему отображения рыночных данных с KASE (Kazakhstan Stock Exchange). Смоделируй котировку акции и выведи табло рыночных данных. Определи лидеров роста и падения за день. Java доминирует в финансовых системах благодаря low-latency и строгой типизации.',
      requirements: [
        'Класс Quote: symbol, bid, ask, lastPrice, volume, changePercent, timestamp',
        'Создать котировки для KCEL, HSBK, KMGZ, USD/KZT',
        'Форматированный вывод: табло рыночных данных (символ, bid, ask, last, volume, change%)',
        'Определить топ-гейнеров (change% > 0) и топ-лузеров (change% < 0)',
        'Сортировка по changePercent (убывание для гейнеров, возрастание для лузеров)'
      ],
      expectedOutput: `=== KASE Market Data Board ===
Symbol       Bid       Ask      Last    Volume  Change%
KCEL       3250.0    3255.0    3252.0    145200    +2.35%
HSBK        870.0     872.0     871.0    523000    -1.20%
KMGZ      18500.0   18520.0   18510.0     32100    +0.85%
USD/KZT     449.5     450.0     449.8    980000    +0.12%

--- Top Gainers ---
KCEL: +2.35%
KMGZ: +0.85%
USD/KZT: +0.12%

--- Top Losers ---
HSBK: -1.20%`,
      hint: 'Используй record или класс с полями. Для форматирования — String.format() или printf с шириной полей. Для сортировки — Comparator.comparingDouble(). Фильтрация — stream().filter().',
      solution: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.*;

public class Main {
    record Quote(String symbol, double bid, double ask, double lastPrice,
                 long volume, double changePercent, LocalDateTime timestamp) {}

    public static void main(String[] args) {
        LocalDateTime now = LocalDateTime.now();
        List<Quote> quotes = List.of(
            new Quote("KCEL", 3250.0, 3255.0, 3252.0, 145200, 2.35, now),
            new Quote("HSBK", 870.0, 872.0, 871.0, 523000, -1.20, now),
            new Quote("KMGZ", 18500.0, 18520.0, 18510.0, 32100, 0.85, now),
            new Quote("USD/KZT", 449.5, 450.0, 449.8, 980000, 0.12, now)
        );

        System.out.println("=== KASE Market Data Board ===");
        System.out.printf("%-8s %9s %9s %9s %9s %8s%n",
            "Symbol", "Bid", "Ask", "Last", "Volume", "Change%");
        for (Quote q : quotes) {
            System.out.printf("%-8s %9.1f %9.1f %9.1f %9d %+8.2f%%%n",
                q.symbol(), q.bid(), q.ask(), q.lastPrice(),
                q.volume(), q.changePercent());
        }

        List<Quote> gainers = quotes.stream()
            .filter(q -> q.changePercent() > 0)
            .sorted(Comparator.comparingDouble(Quote::changePercent).reversed())
            .toList();

        List<Quote> losers = quotes.stream()
            .filter(q -> q.changePercent() < 0)
            .sorted(Comparator.comparingDouble(Quote::changePercent))
            .toList();

        System.out.println("\\n--- Top Gainers ---");
        gainers.forEach(q -> System.out.printf("%s: %+.2f%%%n",
            q.symbol(), q.changePercent()));

        System.out.println("\\n--- Top Losers ---");
        losers.forEach(q -> System.out.printf("%s: %.2f%%%n",
            q.symbol(), q.changePercent()));
    }
}`,
      explanation: 'Record — идеальная структура для immutable данных (котировки). В реальных системах (Freedom Finance, Halyk Finance) рыночные данные поступают по FIX-протоколу или WebSocket и обрабатываются low-latency Java-приложениями. Форматирование через printf позволяет строить табличный вывод. Stream API с filter/sorted упрощает аналитику.'
    },
    {
      id: 2,
      title: 'Order Book: Биржевой стакан',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Trading. Спринт 2. Jira: TRD-102. Реализуй биржевой стакан (Order Book) — ключевой компонент любой торговой системы. Стакан хранит заявки на покупку (bids) и продажу (asks). При совпадении цен происходит сделка (match). Это ядро matching engine на KASE.',
      requirements: [
        'Класс Order: id, price, quantity, side (BUY/SELL), timestamp',
        'Order Book: TreeMap для bids (по убыванию цены) и asks (по возрастанию)',
        'Метод addOrder() — добавить ордер и попытаться выполнить match',
        'Matching: если лучший bid >= лучший ask — исполнить сделку (trade)',
        'Удалить полностью исполненные ордера, обновить частично исполненные',
        'Вывод: топ-5 asks (сверху) и топ-5 bids (снизу) с разделителем'
      ],
      expectedOutput: `Trade executed: SELL 50 @ 3250.0 KZT
Trade executed: SELL 30 @ 3252.0 KZT

=== Order Book: KCEL ===
--- ASKS (sell) ---
  3260.0  |  100
  3258.0  |   75
  3255.0  |   60
------- spread -------
  3252.0  |   70
  3250.0  |  150
  3248.0  |   80
--- BIDS (buy) ---`,
      hint: 'TreeMap с reverseOrder() для bids (лучшая цена = самая высокая). TreeMap с natural order для asks (лучшая цена = самая низкая). Matching loop: пока bestBid >= bestAsk — исполняй сделки.',
      solution: `import java.util.*;

public class Main {
    enum Side { BUY, SELL }

    static class Order {
        int id;
        double price;
        int quantity;
        Side side;
        Order(int id, double price, int quantity, Side side) {
            this.id = id; this.price = price;
            this.quantity = quantity; this.side = side;
        }
    }

    static TreeMap<Double, List<Order>> bids = new TreeMap<>(Comparator.reverseOrder());
    static TreeMap<Double, List<Order>> asks = new TreeMap<>();

    static void addOrder(Order order) {
        if (order.side == Side.BUY) {
            matchBuy(order);
            if (order.quantity > 0)
                bids.computeIfAbsent(order.price, k -> new ArrayList<>()).add(order);
        } else {
            matchSell(order);
            if (order.quantity > 0)
                asks.computeIfAbsent(order.price, k -> new ArrayList<>()).add(order);
        }
    }

    static void matchBuy(Order buy) {
        while (buy.quantity > 0 && !asks.isEmpty() && asks.firstKey() <= buy.price) {
            Map.Entry<Double, List<Order>> bestAsk = asks.firstEntry();
            List<Order> orders = bestAsk.getValue();
            Order sell = orders.get(0);
            int traded = Math.min(buy.quantity, sell.quantity);
            System.out.printf("Trade executed: SELL %d @ %.1f KZT%n", traded, sell.price);
            buy.quantity -= traded;
            sell.quantity -= traded;
            if (sell.quantity == 0) orders.remove(0);
            if (orders.isEmpty()) asks.remove(bestAsk.getKey());
        }
    }

    static void matchSell(Order sell) {
        while (sell.quantity > 0 && !bids.isEmpty() && bids.firstKey() >= sell.price) {
            Map.Entry<Double, List<Order>> bestBid = bids.firstEntry();
            List<Order> orders = bestBid.getValue();
            Order buy = orders.get(0);
            int traded = Math.min(sell.quantity, buy.quantity);
            System.out.printf("Trade executed: BUY %d @ %.1f KZT%n", traded, buy.price);
            sell.quantity -= traded;
            buy.quantity -= traded;
            if (buy.quantity == 0) orders.remove(0);
            if (orders.isEmpty()) bids.remove(bestBid.getKey());
        }
    }

    static void printOrderBook() {
        System.out.println("\\n=== Order Book: KCEL ===");
        System.out.println("--- ASKS (sell) ---");
        List<Map.Entry<Double, List<Order>>> askList = new ArrayList<>(asks.entrySet());
        for (int i = Math.min(5, askList.size()) - 1; i >= 0; i--) {
            int qty = askList.get(i).getValue().stream().mapToInt(o -> o.quantity).sum();
            System.out.printf("  %7.1f  | %4d%n", askList.get(i).getKey(), qty);
        }
        System.out.println("------- spread -------");
        int count = 0;
        for (var entry : bids.entrySet()) {
            if (count++ >= 5) break;
            int qty = entry.getValue().stream().mapToInt(o -> o.quantity).sum();
            System.out.printf("  %7.1f  | %4d%n", entry.getKey(), qty);
        }
        System.out.println("--- BIDS (buy) ---");
    }

    public static void main(String[] args) {
        addOrder(new Order(1, 3252.0, 70, Side.BUY));
        addOrder(new Order(2, 3250.0, 150, Side.BUY));
        addOrder(new Order(3, 3248.0, 80, Side.BUY));
        addOrder(new Order(4, 3255.0, 60, Side.SELL));
        addOrder(new Order(5, 3258.0, 75, Side.SELL));
        addOrder(new Order(6, 3260.0, 100, Side.SELL));
        // Эти ордера должны вызвать match
        addOrder(new Order(7, 3250.0, 50, Side.SELL)); // match с bid 3252
        addOrder(new Order(8, 3252.0, 30, Side.SELL)); // match с bid 3252
        printOrderBook();
    }
}`,
      explanation: 'TreeMap — идеальная структура для order book: bids отсортированы по убыванию (лучшая цена = самая высокая), asks — по возрастанию (лучшая цена = самая низкая). Matching engine — ядро биржи. В реальных системах KASE и Freedom Finance matching engine написан на Java/C++ с оптимизацией под наносекунды. Price-Time Priority: при одинаковой цене первый ордер исполняется первым (FIFO).'
    },
    {
      id: 3,
      title: 'Order Management: Управление ордерами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Trading. Спринт 3. Jira: TRD-103. Реализуй Order Management System (OMS) — систему управления жизненным циклом ордеров. Поддержи три типа: MARKET, LIMIT, STOP. Ордер проходит через состояния: NEW -> PARTIALLY_FILLED -> FILLED / CANCELLED. OMS — критический компонент в трейдинг-платформах Freedom Finance.',
      requirements: [
        'Enum OrderType: MARKET, LIMIT, STOP',
        'Enum OrderStatus: NEW, PARTIALLY_FILLED, FILLED, CANCELLED',
        'Класс Order: id, symbol, type, side, price, quantity, filledQty, status',
        'MARKET — исполняется по текущей рыночной цене',
        'LIMIT — исполняется по указанной цене или лучше',
        'STOP — активируется когда рыночная цена достигает stop-цены',
        'Методы: submitOrder(), fillOrder(qty), cancelOrder()',
        'Вывод статуса ордера после каждого действия'
      ],
      expectedOutput: `[OMS] Order #1 submitted: BUY 100 KCEL MARKET @ market price -> NEW
[OMS] Order #1 filled 100 @ 3250.0 KZT -> FILLED
[OMS] Order #2 submitted: BUY 200 HSBK LIMIT @ 870.0 -> NEW
[OMS] Order #2 filled 80 @ 870.0 KZT -> PARTIALLY_FILLED (80/200)
[OMS] Order #2 filled 120 @ 870.0 KZT -> FILLED
[OMS] Order #3 submitted: SELL 50 KMGZ STOP @ trigger 18000.0 -> NEW
[OMS] Market price 17950.0 — STOP triggered for Order #3
[OMS] Order #3 filled 50 @ 17950.0 KZT -> FILLED
[OMS] Order #4 submitted: BUY 300 KCEL LIMIT @ 3200.0 -> NEW
[OMS] Order #4 cancelled -> CANCELLED`,
      hint: 'State Machine: NEW -> PARTIALLY_FILLED (при частичном fill) -> FILLED (когда filledQty == quantity). Любое состояние кроме FILLED -> CANCELLED. STOP-ордер активируется через отдельный метод checkStopTrigger().',
      solution: `public class Main {
    enum OrderType { MARKET, LIMIT, STOP }
    enum OrderStatus { NEW, PARTIALLY_FILLED, FILLED, CANCELLED }
    enum Side { BUY, SELL }

    static class Order {
        int id;
        String symbol;
        OrderType type;
        Side side;
        double price;
        int quantity;
        int filledQty;
        OrderStatus status;

        Order(int id, String symbol, OrderType type, Side side, double price, int qty) {
            this.id = id; this.symbol = symbol; this.type = type;
            this.side = side; this.price = price; this.quantity = qty;
            this.filledQty = 0; this.status = OrderStatus.NEW;
        }
    }

    static void submitOrder(Order order) {
        String priceStr = order.type == OrderType.MARKET ? "market price"
            : (order.type == OrderType.STOP ? "trigger " + order.price : String.valueOf(order.price));
        System.out.printf("[OMS] Order #%d submitted: %s %d %s %s @ %s -> %s%n",
            order.id, order.side, order.quantity, order.symbol,
            order.type, priceStr, order.status);
    }

    static void fillOrder(Order order, int qty, double fillPrice) {
        if (order.status == OrderStatus.FILLED || order.status == OrderStatus.CANCELLED) {
            System.out.printf("[OMS] Order #%d cannot be filled — status: %s%n",
                order.id, order.status);
            return;
        }
        int canFill = Math.min(qty, order.quantity - order.filledQty);
        order.filledQty += canFill;
        order.status = (order.filledQty >= order.quantity)
            ? OrderStatus.FILLED : OrderStatus.PARTIALLY_FILLED;

        String extra = order.status == OrderStatus.PARTIALLY_FILLED
            ? String.format(" (%d/%d)", order.filledQty, order.quantity) : "";
        System.out.printf("[OMS] Order #%d filled %d @ %.1f KZT -> %s%s%n",
            order.id, canFill, fillPrice, order.status, extra);
    }

    static void cancelOrder(Order order) {
        if (order.status == OrderStatus.FILLED) {
            System.out.printf("[OMS] Order #%d already filled — cannot cancel%n", order.id);
            return;
        }
        order.status = OrderStatus.CANCELLED;
        System.out.printf("[OMS] Order #%d cancelled -> %s%n", order.id, order.status);
    }

    static void checkStopTrigger(Order order, double marketPrice) {
        if (order.type != OrderType.STOP || order.status != OrderStatus.NEW) return;
        boolean triggered = (order.side == Side.SELL && marketPrice <= order.price)
                         || (order.side == Side.BUY && marketPrice >= order.price);
        if (triggered) {
            System.out.printf("[OMS] Market price %.1f — STOP triggered for Order #%d%n",
                marketPrice, order.id);
            fillOrder(order, order.quantity, marketPrice);
        }
    }

    public static void main(String[] args) {
        Order o1 = new Order(1, "KCEL", OrderType.MARKET, Side.BUY, 0, 100);
        submitOrder(o1);
        fillOrder(o1, 100, 3250.0);

        Order o2 = new Order(2, "HSBK", OrderType.LIMIT, Side.BUY, 870.0, 200);
        submitOrder(o2);
        fillOrder(o2, 80, 870.0);
        fillOrder(o2, 120, 870.0);

        Order o3 = new Order(3, "KMGZ", OrderType.STOP, Side.SELL, 18000.0, 50);
        submitOrder(o3);
        checkStopTrigger(o3, 17950.0);

        Order o4 = new Order(4, "KCEL", OrderType.LIMIT, Side.BUY, 3200.0, 300);
        submitOrder(o4);
        cancelOrder(o4);
    }
}`,
      explanation: 'OMS — центральная система в трейдинге. State Machine ордера гарантирует корректные переходы: нельзя отменить исполненный или заполнить отменённый. MARKET-ордер исполняется мгновенно по рыночной цене. LIMIT ждёт достижения целевой цены. STOP активируется при пробое уровня. В реальных системах Freedom Finance OMS обрабатывает тысячи ордеров в секунду через FIX-протокол.'
    },
    {
      id: 4,
      title: 'Portfolio Tracker: Портфель',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Settlement. Спринт 4. Jira: TRD-104. Реализуй трекер инвестиционного портфеля. Клиент Halyk Finance держит позиции в нескольких бумагах KASE. Рассчитай текущую стоимость, нереализованный P&L по каждой позиции и по портфелю в целом. Покажи аллокацию портфеля.',
      requirements: [
        'Класс Position: symbol, quantity, avgBuyPrice',
        'Для каждой позиции: currentValue, unrealizedPnL, pnlPercent',
        'Общий портфель: totalValue, totalCost, totalPnL, totalPnlPercent',
        'Аллокация портфеля: доля каждой позиции в % от totalValue',
        'Форматированный вывод таблицы портфеля'
      ],
      expectedOutput: `=== Portfolio Tracker (Halyk Finance) ===
Symbol     Qty   AvgPrice   CurPrice      Cost     Value      P&L    P&L%  Alloc%
KCEL       100    3200.0     3350.0    320000    335000    +15000   +4.69%  36.39%
HSBK       500     850.0      871.0    425000    435500    +10500   +2.47%  47.31%
KMGZ         8   18000.0    18510.0    144000    148080     +4080   +2.83%  16.09%
USD/KZT      0     449.0      449.8         0         0        +0   +0.00%   0.00%

--- Portfolio Summary ---
Total Cost:    889000 KZT
Total Value:   918580 KZT
Total P&L:     +29580 KZT (+3.33%)`,
      hint: 'P&L = (currentPrice - avgBuyPrice) * quantity. P&L% = P&L / cost * 100. Аллокация = positionValue / totalValue * 100. Обработай случай quantity=0 (нет позиции).',
      solution: `import java.util.*;

public class Main {
    record Position(String symbol, int quantity, double avgBuyPrice) {}

    public static void main(String[] args) {
        List<Position> positions = List.of(
            new Position("KCEL", 100, 3200.0),
            new Position("HSBK", 500, 850.0),
            new Position("KMGZ", 8, 18000.0),
            new Position("USD/KZT", 0, 449.0)
        );

        Map<String, Double> currentPrices = Map.of(
            "KCEL", 3350.0, "HSBK", 871.0,
            "KMGZ", 18510.0, "USD/KZT", 449.8
        );

        double totalCost = 0, totalValue = 0;
        List<double[]> data = new ArrayList<>();

        for (Position p : positions) {
            double curPrice = currentPrices.get(p.symbol());
            double cost = p.quantity() * p.avgBuyPrice();
            double value = p.quantity() * curPrice;
            double pnl = value - cost;
            double pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
            totalCost += cost;
            totalValue += value;
            data.add(new double[]{cost, value, pnl, pnlPct, curPrice});
        }

        System.out.println("=== Portfolio Tracker (Halyk Finance) ===");
        System.out.printf("%-8s %5s %10s %10s %9s %9s %9s %7s %7s%n",
            "Symbol", "Qty", "AvgPrice", "CurPrice", "Cost", "Value", "P&L", "P&L%", "Alloc%");

        for (int i = 0; i < positions.size(); i++) {
            Position p = positions.get(i);
            double[] d = data.get(i);
            double alloc = totalValue > 0 ? (d[1] / totalValue) * 100 : 0;
            System.out.printf("%-8s %5d %10.1f %10.1f %9.0f %9.0f %+9.0f %+7.2f%% %6.2f%%%n",
                p.symbol(), p.quantity(), p.avgBuyPrice(), d[4],
                d[0], d[1], d[2], d[3], alloc);
        }

        double totalPnL = totalValue - totalCost;
        double totalPnlPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

        System.out.println("\\n--- Portfolio Summary ---");
        System.out.printf("Total Cost:    %.0f KZT%n", totalCost);
        System.out.printf("Total Value:   %.0f KZT%n", totalValue);
        System.out.printf("Total P&L:     %+.0f KZT (%+.2f%%)%n", totalPnL, totalPnlPct);
    }
}`,
      explanation: 'Портфельный учёт — основа брокерских систем. Unrealized P&L показывает бумажную прибыль/убыток до закрытия позиции. Аллокация показывает диверсификацию. В реальных системах Halyk Finance расчёт P&L происходит в реальном времени при каждом тике цены. Record используется для immutable позиций — безопаснее в многопоточной среде low-latency систем.'
    },
    {
      id: 5,
      title: 'Candlestick Chart: Свечи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Market Data. Спринт 5. Jira: TRD-105. Построй OHLCV-свечи из потока сделок. Свеча (candlestick) — основной инструмент технического анализа: Open, High, Low, Close, Volume. Группируй сделки по временным интервалам и определяй тип свечи: бычья (рост), медвежья (падение), доджи (нет изменения).',
      requirements: [
        'Класс Trade: price, volume, timestamp',
        'Класс Candle: open, high, low, close, volume, type (BULLISH/BEARISH/DOJI)',
        'Группировка сделок по временному интервалу (1 мин)',
        'Определение типа: BULLISH (close > open), BEARISH (close < open), DOJI (close == open)',
        'Вывод свечей с ASCII-визуализацией'
      ],
      expectedOutput: `=== KCEL Candlestick Chart (1-min candles) ===
Time          Open     High      Low    Close    Volume  Type
10:00       3250.0   3268.0   3245.0   3265.0      850  BULLISH  ▲
10:01       3265.0   3272.0   3258.0   3260.0      620  BEARISH  ▼
10:02       3260.0   3275.0   3260.0   3275.0      930  BULLISH  ▲
10:03       3275.0   3278.0   3270.0   3275.0      410  DOJI     ●`,
      hint: 'Группировка по минутам: truncatedTo(ChronoUnit.MINUTES). Open = первая сделка, Close = последняя, High = max, Low = min, Volume = sum. Тип определяй сравнением close и open.',
      solution: `import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.*;

public class Main {
    record Trade(double price, int volume, LocalTime time) {}

    enum CandleType { BULLISH, BEARISH, DOJI }

    record Candle(LocalTime time, double open, double high, double low,
                  double close, long volume, CandleType type) {}

    static Candle buildCandle(LocalTime minute, List<Trade> trades) {
        double open = trades.get(0).price();
        double close = trades.get(trades.size() - 1).price();
        double high = trades.stream().mapToDouble(Trade::price).max().orElse(0);
        double low = trades.stream().mapToDouble(Trade::price).min().orElse(0);
        long vol = trades.stream().mapToLong(Trade::volume).sum();
        CandleType type = close > open ? CandleType.BULLISH
                        : close < open ? CandleType.BEARISH
                        : CandleType.DOJI;
        return new Candle(minute, open, high, low, close, vol, type);
    }

    public static void main(String[] args) {
        List<Trade> trades = List.of(
            // Minute 10:00
            new Trade(3250.0, 200, LocalTime.of(10, 0, 5)),
            new Trade(3255.0, 150, LocalTime.of(10, 0, 15)),
            new Trade(3268.0, 100, LocalTime.of(10, 0, 30)),
            new Trade(3245.0, 180, LocalTime.of(10, 0, 40)),
            new Trade(3265.0, 220, LocalTime.of(10, 0, 55)),
            // Minute 10:01
            new Trade(3265.0, 120, LocalTime.of(10, 1, 5)),
            new Trade(3272.0, 200, LocalTime.of(10, 1, 20)),
            new Trade(3258.0, 100, LocalTime.of(10, 1, 35)),
            new Trade(3260.0, 200, LocalTime.of(10, 1, 50)),
            // Minute 10:02
            new Trade(3260.0, 300, LocalTime.of(10, 2, 10)),
            new Trade(3270.0, 250, LocalTime.of(10, 2, 25)),
            new Trade(3265.0, 130, LocalTime.of(10, 2, 40)),
            new Trade(3275.0, 250, LocalTime.of(10, 2, 55)),
            // Minute 10:03
            new Trade(3275.0, 110, LocalTime.of(10, 3, 10)),
            new Trade(3278.0, 100, LocalTime.of(10, 3, 25)),
            new Trade(3270.0, 80, LocalTime.of(10, 3, 40)),
            new Trade(3275.0, 120, LocalTime.of(10, 3, 55))
        );

        Map<LocalTime, List<Trade>> grouped = trades.stream()
            .collect(Collectors.groupingBy(
                t -> t.time().truncatedTo(ChronoUnit.MINUTES),
                TreeMap::new, Collectors.toList()));

        List<Candle> candles = grouped.entrySet().stream()
            .map(e -> buildCandle(e.getKey(), e.getValue()))
            .toList();

        System.out.println("=== KCEL Candlestick Chart (1-min candles) ===");
        System.out.printf("%-10s %8s %8s %8s %8s %8s  %-8s%n",
            "Time", "Open", "High", "Low", "Close", "Volume", "Type");

        for (Candle c : candles) {
            String icon = switch (c.type()) {
                case BULLISH -> "\\u25B2";
                case BEARISH -> "\\u25BC";
                case DOJI -> "\\u25CF";
            };
            System.out.printf("%-10s %8.1f %8.1f %8.1f %8.1f %8d  %-8s %s%n",
                c.time(), c.open(), c.high(), c.low(), c.close(),
                c.volume(), c.type(), icon);
        }
    }
}`,
      explanation: 'OHLCV-свечи — стандарт визуализации ценовых данных. Open — цена первой сделки интервала, Close — последней, High/Low — экстремумы, Volume — суммарный объём. Группировка через truncatedTo() и Collectors.groupingBy() с TreeMap для сортировки по времени. В реальных системах свечи строятся для интервалов 1m, 5m, 15m, 1h, 1d. Java используется в Freedom Finance для real-time построения свечей из FIX-потока сделок.'
    },
    {
      id: 6,
      title: 'Trading Fees: Комиссии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Settlement. Спринт 6. Jira: TRD-106. Рассчитай комиссии за торговые операции. Брокер (Freedom Finance / Halyk Finance) берёт комиссию за каждую сделку. Различай maker (лимитные ордера, добавляют ликвидность) и taker (маркет-ордера, забирают ликвидность). Maker получает сниженную комиссию.',
      requirements: [
        'Класс Trade: symbol, side, price, quantity, orderType (LIMIT/MARKET)',
        'Broker commission: 0.05% (taker/MARKET), 0.03% (maker/LIMIT)',
        'Exchange fee (KASE): 0.01%',
        'Clearing fee: фиксированная 50 KZT за сделку',
        'Рассчитать комиссии по каждой сделке и дневную сводку',
        'Итого: total broker, total exchange, total clearing, total fees'
      ],
      expectedOutput: `=== Trading Fees Report ===
#  Symbol     Side   Price    Qty      Turnover  Type    Broker   Exchange  Clearing  Total Fee
1  KCEL       BUY   3250.0    100     325000.0  MARKET   162.50     32.50     50.00    245.00
2  HSBK       SELL   871.0    500     435500.0  LIMIT    130.65     43.55     50.00    224.20
3  KMGZ       BUY  18510.0     10     185100.0  MARKET    92.55     18.51     50.00    161.06
4  KCEL       SELL  3280.0    100     328000.0  LIMIT     98.40     32.80     50.00    181.20

--- Daily Fee Summary ---
Total Turnover:   1273600.0 KZT
Broker Fees:      484.10 KZT
Exchange Fees:    127.36 KZT
Clearing Fees:    200.00 KZT
Total Fees:       811.46 KZT
Fee/Turnover:     0.064%`,
      hint: 'Turnover = price * quantity. Broker fee = turnover * rate (0.05% для MARKET, 0.03% для LIMIT). Exchange fee = turnover * 0.01%. Clearing = 50 KZT фиксировано. Аккумулируй итоги.',
      solution: `import java.util.*;

public class Main {
    enum Side { BUY, SELL }
    enum OrdType { MARKET, LIMIT }

    record Trade(String symbol, Side side, double price, int quantity, OrdType type) {
        double turnover() { return price * quantity; }
    }

    record FeeBreakdown(double broker, double exchange, double clearing) {
        double total() { return broker + exchange + clearing; }
    }

    static final double TAKER_RATE = 0.0005;   // 0.05%
    static final double MAKER_RATE = 0.0003;    // 0.03%
    static final double EXCHANGE_RATE = 0.0001; // 0.01%
    static final double CLEARING_FEE = 50.0;    // KZT fixed

    static FeeBreakdown calculateFees(Trade trade) {
        double turnover = trade.turnover();
        double brokerRate = trade.type() == OrdType.MARKET ? TAKER_RATE : MAKER_RATE;
        return new FeeBreakdown(
            turnover * brokerRate,
            turnover * EXCHANGE_RATE,
            CLEARING_FEE
        );
    }

    public static void main(String[] args) {
        List<Trade> trades = List.of(
            new Trade("KCEL", Side.BUY, 3250.0, 100, OrdType.MARKET),
            new Trade("HSBK", Side.SELL, 871.0, 500, OrdType.LIMIT),
            new Trade("KMGZ", Side.BUY, 18510.0, 10, OrdType.MARKET),
            new Trade("KCEL", Side.SELL, 3280.0, 100, OrdType.LIMIT)
        );

        double totalTurnover = 0, totalBroker = 0, totalExchange = 0, totalClearing = 0;

        System.out.println("=== Trading Fees Report ===");
        System.out.printf("%-2s %-8s %6s %8s %6s %12s %-7s %8s %9s %9s %10s%n",
            "#", "Symbol", "Side", "Price", "Qty", "Turnover", "Type",
            "Broker", "Exchange", "Clearing", "Total Fee");

        int idx = 1;
        for (Trade t : trades) {
            FeeBreakdown fee = calculateFees(t);
            double turnover = t.turnover();
            totalTurnover += turnover;
            totalBroker += fee.broker();
            totalExchange += fee.exchange();
            totalClearing += fee.clearing();

            System.out.printf("%-2d %-8s %6s %8.1f %6d %12.1f  %-7s %8.2f %9.2f %9.2f %10.2f%n",
                idx++, t.symbol(), t.side(), t.price(), t.quantity(),
                turnover, t.type(), fee.broker(), fee.exchange(),
                fee.clearing(), fee.total());
        }

        double totalFees = totalBroker + totalExchange + totalClearing;
        System.out.println("\\n--- Daily Fee Summary ---");
        System.out.printf("Total Turnover:   %.1f KZT%n", totalTurnover);
        System.out.printf("Broker Fees:      %.2f KZT%n", totalBroker);
        System.out.printf("Exchange Fees:    %.2f KZT%n", totalExchange);
        System.out.printf("Clearing Fees:    %.2f KZT%n", totalClearing);
        System.out.printf("Total Fees:       %.2f KZT%n", totalFees);
        System.out.printf("Fee/Turnover:     %.3f%%%n", (totalFees / totalTurnover) * 100);
    }
}`,
      explanation: 'Комиссионная модель — ключевой бизнес-процесс брокера. Maker/taker модель стимулирует добавление ликвидности: лимитные ордера (maker) платят меньше, так как создают глубину стакана. KASE взимает биржевой сбор отдельно. Клиринговый сбор — за гарантию расчётов. Record с методом turnover() инкапсулирует вычисление. В реальных системах комиссии рассчитываются Settlement-системой после завершения торговой сессии.'
    },
    {
      id: 7,
      title: 'Risk Limits: Лимиты и ограничения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Risk. Спринт 7. Jira: TRD-107. Реализуй pre-trade risk checks — проверки перед исполнением ордера. Риск-система блокирует ордер если нарушены лимиты: максимальный размер ордера, максимальная позиция по бумаге, дневной лимит убытков, достаточность средств (buying power). Это обязательный компонент любого брокера по требованию регулятора.',
      requirements: [
        'Лимиты: maxOrderSize=500, maxPositionPerSymbol=1000, dailyLossLimit=100000 KZT, buyingPower=500000 KZT',
        'Проверить каждый лимит перед ордером',
        'Блокировать ордер если хоть один лимит нарушен',
        'После каждого успешного ордера обновлять состояние (позиции, P&L, buying power)',
        'Вывести оставшиеся лимиты после каждого ордера'
      ],
      expectedOutput: `=== Pre-Trade Risk Engine ===

[CHECK] Order: BUY 200 KCEL @ 3250.0 (total: 650000.0 KZT)
  ✓ Order size: 200 <= 500
  ✓ Position after: 200 <= 1000
  ✓ Daily loss: 0.0 <= 100000.0
  ✗ Buying power: 650000.0 > 500000.0
  → ORDER BLOCKED: Insufficient buying power

[CHECK] Order: BUY 100 KCEL @ 3250.0 (total: 325000.0 KZT)
  ✓ Order size: 100 <= 500
  ✓ Position after: 100 <= 1000
  ✓ Daily loss: 0.0 <= 100000.0
  ✓ Buying power: 325000.0 <= 500000.0
  → ORDER APPROVED
  Remaining: buyingPower=175000.0, posKCEL=100/1000

[CHECK] Order: BUY 600 HSBK @ 870.0 (total: 522000.0 KZT)
  ✗ Order size: 600 > 500
  → ORDER BLOCKED: Max order size exceeded`,
      hint: 'Цепочка проверок: проверяй все лимиты и собирай результаты (не останавливайся на первом нарушении — покажи все). Блокируй если хотя бы одна проверка не прошла. Обновляй состояние только для одобренных ордеров.',
      solution: `import java.util.*;

public class Main {
    static final int MAX_ORDER_SIZE = 500;
    static final int MAX_POS_PER_SYMBOL = 1000;
    static final double DAILY_LOSS_LIMIT = 100_000.0;
    static double buyingPower = 500_000.0;
    static double dailyLoss = 0.0;
    static Map<String, Integer> positions = new HashMap<>();

    record Order(String side, int qty, String symbol, double price) {
        double total() { return qty * price; }
    }

    static boolean checkRisk(Order order) {
        System.out.printf("%n[CHECK] Order: %s %d %s @ %.1f (total: %.1f KZT)%n",
            order.side(), order.qty(), order.symbol(), order.price(), order.total());

        boolean approved = true;
        int curPos = positions.getOrDefault(order.symbol(), 0);
        int newPos = curPos + order.qty();

        // 1. Max order size
        boolean sizeOk = order.qty() <= MAX_ORDER_SIZE;
        System.out.printf("  %s Order size: %d %s %d%n",
            sizeOk ? "\\u2713" : "\\u2717", order.qty(),
            sizeOk ? "<=" : ">", MAX_ORDER_SIZE);
        if (!sizeOk) approved = false;

        // 2. Max position per symbol
        boolean posOk = newPos <= MAX_POS_PER_SYMBOL;
        System.out.printf("  %s Position after: %d %s %d%n",
            posOk ? "\\u2713" : "\\u2717", newPos,
            posOk ? "<=" : ">", MAX_POS_PER_SYMBOL);
        if (!posOk) approved = false;

        // 3. Daily loss limit
        boolean lossOk = dailyLoss <= DAILY_LOSS_LIMIT;
        System.out.printf("  %s Daily loss: %.1f %s %.1f%n",
            lossOk ? "\\u2713" : "\\u2717", dailyLoss,
            lossOk ? "<=" : ">", DAILY_LOSS_LIMIT);
        if (!lossOk) approved = false;

        // 4. Buying power
        if (order.side().equals("BUY")) {
            boolean bpOk = order.total() <= buyingPower;
            System.out.printf("  %s Buying power: %.1f %s %.1f%n",
                bpOk ? "\\u2713" : "\\u2717", order.total(),
                bpOk ? "<=" : ">", buyingPower);
            if (!bpOk) approved = false;
        }

        if (approved) {
            if (order.side().equals("BUY")) buyingPower -= order.total();
            positions.merge(order.symbol(), order.qty(), Integer::sum);
            System.out.printf("  \\u2192 ORDER APPROVED%n");
            System.out.printf("  Remaining: buyingPower=%.1f, pos%s=%d/%d%n",
                buyingPower, order.symbol(), positions.get(order.symbol()),
                MAX_POS_PER_SYMBOL);
        } else {
            String reason = !sizeOk ? "Max order size exceeded"
                : !posOk ? "Max position exceeded"
                : !lossOk ? "Daily loss limit breached"
                : "Insufficient buying power";
            System.out.printf("  \\u2192 ORDER BLOCKED: %s%n", reason);
        }
        return approved;
    }

    public static void main(String[] args) {
        System.out.println("=== Pre-Trade Risk Engine ===");
        checkRisk(new Order("BUY", 200, "KCEL", 3250.0));
        checkRisk(new Order("BUY", 100, "KCEL", 3250.0));
        checkRisk(new Order("BUY", 600, "HSBK", 870.0));
    }
}`,
      explanation: 'Pre-trade risk checks — обязательный компонент по требованиям регулятора (АРРФР в Казахстане). Каждый ордер проверяется ДО отправки на биржу: размер, позиция, убытки, покупательная способность. В реальных системах Freedom Finance риск-проверки работают с наносекундной задержкой, чтобы не замедлять торговлю. Chain of responsibility pattern часто используется для цепочки проверок. При нарушении ордер блокируется и логируется для комплаенс-отчётов.'
    },
    {
      id: 8,
      title: 'Margin Trading: Маржинальная торговля',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Risk. Спринт 8. Jira: TRD-108. Реализуй маржинальный счёт. Клиент торгует с плечом: buying power = cash + заёмные средства. При падении equity ниже maintenance margin (25%) — margin call. При критическом уровне — принудительная ликвидация позиций. Это один из самых ответственных компонентов в брокерских системах.',
      requirements: [
        'Margin account: cash, positions, marginRate (50% — начальная маржа)',
        'Buying power = cash / initialMargin (плечо 2x)',
        'Equity = cash + market value of positions',
        'Margin used = positions cost / marginRate',
        'Maintenance margin = 25% от рыночной стоимости',
        'Margin call если equity < maintenance margin',
        'Force liquidation: продать позиции до восстановления маржи'
      ],
      expectedOutput: `=== Margin Account ===
Cash:             500000.0 KZT
Positions:
  KCEL: 200 @ 3250.0 = 650000.0 KZT
  HSBK: 300 @ 871.0  = 261300.0 KZT
Market Value:     911300.0 KZT
Equity:           1411300.0 KZT
Margin Used:      455650.0 KZT
Margin Available: 955650.0 KZT
Margin Level:     309.7%

--- Price Drop Simulation ---
KCEL drops to 2200.0, HSBK drops to 550.0
Market Value:     605000.0 KZT
Equity:           1105000.0 KZT
Maintenance Req:  151250.0 KZT
Margin Level:     182.6%

KCEL drops to 800.0, HSBK drops to 200.0
Market Value:     220000.0 KZT
Equity:           720000.0 KZT
Maintenance Req:  55000.0 KZT
Margin Level:     327.3%

⚠ Scenario: extreme drop
KCEL drops to 100.0, HSBK drops to 50.0
Market Value:     35000.0 KZT
Equity:           535000.0 KZT
Maintenance Req:  8750.0 KZT

KCEL drops to 50.0, HSBK drops to 20.0
Market Value:     16000.0 KZT
Equity:           516000.0 KZT
*** MARGIN CALL *** Equity below critical level!
Force liquidation: SELL 200 KCEL @ 50.0
Force liquidation: SELL 300 HSBK @ 20.0
After liquidation: Cash = 532000.0, Positions = 0`,
      hint: 'Equity = cash + sum(qty * currentPrice). Maintenance margin = 25% * marketValue. Margin call когда equity / marginUsed < threshold. Ликвидация: продавай позиции начиная с самой убыточной.',
      solution: `import java.util.*;

public class Main {
    static double cash = 500_000.0;
    static Map<String, int[]> positions = new LinkedHashMap<>(); // symbol -> [qty, avgPrice*100]

    static void addPosition(String symbol, int qty, double price) {
        positions.put(symbol, new int[]{qty, (int)(price * 100)});
    }

    static double marketValue(Map<String, Double> prices) {
        double mv = 0;
        for (var e : positions.entrySet()) {
            double price = prices.getOrDefault(e.getKey(), e.getValue()[1] / 100.0);
            mv += e.getValue()[0] * price;
        }
        return mv;
    }

    static void printAccount(Map<String, Double> prices) {
        double mv = marketValue(prices);
        double equity = cash + mv;
        double marginUsed = mv * 0.5;
        double marginAvail = equity - marginUsed;
        double marginLevel = marginUsed > 0 ? (equity / marginUsed) * 100 : 0;

        System.out.println("=== Margin Account ===");
        System.out.printf("Cash:             %.1f KZT%n", cash);
        System.out.println("Positions:");
        for (var e : positions.entrySet()) {
            double price = prices.getOrDefault(e.getKey(), e.getValue()[1] / 100.0);
            System.out.printf("  %s: %d @ %.1f = %.1f KZT%n",
                e.getKey(), e.getValue()[0], price, e.getValue()[0] * price);
        }
        System.out.printf("Market Value:     %.1f KZT%n", mv);
        System.out.printf("Equity:           %.1f KZT%n", equity);
        System.out.printf("Margin Used:      %.1f KZT%n", marginUsed);
        System.out.printf("Margin Available: %.1f KZT%n", marginAvail);
        System.out.printf("Margin Level:     %.1f%%%n", marginLevel);
    }

    static void simulateDrop(Map<String, Double> prices, String label) {
        double mv = marketValue(prices);
        double equity = cash + mv;
        double maintenanceReq = mv * 0.25;
        double marginLevel = (mv * 0.5) > 0 ? (equity / (mv * 0.5)) * 100 : 0;

        System.out.printf("%n%s%n", label);
        for (var e : positions.entrySet()) {
            double price = prices.get(e.getKey());
            System.out.printf("%s drops to %.1f, ", e.getKey(), price);
        }
        System.out.printf("%nMarket Value:     %.1f KZT%n", mv);
        System.out.printf("Equity:           %.1f KZT%n", equity);
        System.out.printf("Maintenance Req:  %.1f KZT%n", maintenanceReq);

        if (mv > 0) {
            System.out.printf("Margin Level:     %.1f%%%n", marginLevel);
        }

        if (equity < maintenanceReq || equity < cash * 0.05) {
            System.out.println("*** MARGIN CALL *** Equity below critical level!");
            forceLiquidation(prices);
        }
    }

    static void forceLiquidation(Map<String, Double> prices) {
        for (var e : new ArrayList<>(positions.entrySet())) {
            double price = prices.get(e.getKey());
            int qty = e.getValue()[0];
            System.out.printf("Force liquidation: SELL %d %s @ %.1f%n",
                qty, e.getKey(), price);
            cash += qty * price;
            positions.remove(e.getKey());
        }
        System.out.printf("After liquidation: Cash = %.1f, Positions = %d%n",
            cash, positions.size());
    }

    public static void main(String[] args) {
        addPosition("KCEL", 200, 3250.0);
        addPosition("HSBK", 300, 871.0);

        Map<String, Double> prices = new LinkedHashMap<>();
        prices.put("KCEL", 3250.0);
        prices.put("HSBK", 871.0);
        printAccount(prices);

        System.out.println("\\n--- Price Drop Simulation ---");
        prices.put("KCEL", 2200.0);
        prices.put("HSBK", 550.0);
        simulateDrop(prices, "");

        prices.put("KCEL", 800.0);
        prices.put("HSBK", 200.0);
        simulateDrop(prices, "");

        System.out.println("\\n\\u26A0 Scenario: extreme drop");
        prices.put("KCEL", 100.0);
        prices.put("HSBK", 50.0);
        simulateDrop(prices, "");

        prices.put("KCEL", 50.0);
        prices.put("HSBK", 20.0);
        simulateDrop(prices, "");
    }
}`,
      explanation: 'Маржинальная торговля — торговля с заёмными средствами (плечо). Initial margin (50%) — минимальный залог для открытия позиции. Maintenance margin (25%) — минимальный уровень для удержания позиции. При падении ниже maintenance — margin call (требование внести деньги). Если клиент не реагирует — force liquidation (принудительная продажа). В Freedom Finance и Halyk Finance этот процесс автоматизирован на Java и работает в реальном времени с tick-by-tick обновлением цен.'
    },
    {
      id: 9,
      title: 'Dividend Processing: Дивиденды',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Settlement. Спринт 9. Jira: TRD-109. Реализуй обработку дивидендов — корпоративного действия. Компания объявляет дивиденд: ex-date, record date, pay date, сумма на акцию. Найди акционеров, рассчитай выплату с учётом налога (15% ИПН в РК), зачисли на счёт.',
      requirements: [
        'Класс Dividend: symbol, exDate, recordDate, payDate, amountPerShare',
        'Класс Shareholder: name, symbol, quantity, holdSince, account balance',
        'Eligible: кто держал акции на record date (holdSince <= recordDate)',
        'Gross dividend = shares * amountPerShare',
        'Tax = 15% (ИПН Казахстан)',
        'Net = gross - tax, зачислить на баланс',
        'Лог корпоративных действий'
      ],
      expectedOutput: `=== Dividend Processing: KCEL ===
Dividend: 120.0 KZT per share
Ex-Date: 2025-03-15 | Record Date: 2025-03-17 | Pay Date: 2025-04-01

--- Eligible Shareholders (held on 2025-03-17) ---
Name            Shares    Gross      Tax(15%)    Net
Алихан            100   12000.0     1800.0    10200.0  ✓ credited
Дана              250   30000.0     4500.0    25500.0  ✓ credited
Марат              50    6000.0      900.0     5100.0  ✓ credited

--- Not Eligible ---
Айгуль             80  (bought 2025-03-20, after record date)

--- Corporate Actions Log ---
[2025-04-01] DIV KCEL 120.0/share -> 3 shareholders, total net: 40800.0 KZT`,
      hint: 'Фильтрация по дате: holdSince <= recordDate. Налог: gross * 0.15. Используй LocalDate для работы с датами. Обнови баланс каждого eligible акционера.',
      solution: `import java.time.LocalDate;
import java.util.*;

public class Main {
    record Dividend(String symbol, LocalDate exDate, LocalDate recordDate,
                    LocalDate payDate, double amountPerShare) {}

    static class Shareholder {
        String name;
        String symbol;
        int quantity;
        LocalDate holdSince;
        double balance;

        Shareholder(String name, String symbol, int qty, LocalDate holdSince, double balance) {
            this.name = name; this.symbol = symbol; this.quantity = qty;
            this.holdSince = holdSince; this.balance = balance;
        }
    }

    static final double TAX_RATE = 0.15;

    public static void main(String[] args) {
        Dividend div = new Dividend("KCEL",
            LocalDate.of(2025, 3, 15),
            LocalDate.of(2025, 3, 17),
            LocalDate.of(2025, 4, 1),
            120.0);

        List<Shareholder> shareholders = List.of(
            new Shareholder("\\u0410\\u043B\\u0438\\u0445\\u0430\\u043D", "KCEL", 100,
                LocalDate.of(2024, 6, 10), 50000),
            new Shareholder("\\u0414\\u0430\\u043D\\u0430", "KCEL", 250,
                LocalDate.of(2024, 11, 5), 120000),
            new Shareholder("\\u041C\\u0430\\u0440\\u0430\\u0442", "KCEL", 50,
                LocalDate.of(2025, 1, 20), 30000),
            new Shareholder("\\u0410\\u0439\\u0433\\u0443\\u043B\\u044C", "KCEL", 80,
                LocalDate.of(2025, 3, 20), 80000)
        );

        System.out.printf("=== Dividend Processing: %s ===%n", div.symbol());
        System.out.printf("Dividend: %.1f KZT per share%n", div.amountPerShare());
        System.out.printf("Ex-Date: %s | Record Date: %s | Pay Date: %s%n",
            div.exDate(), div.recordDate(), div.payDate());

        List<Shareholder> eligible = new ArrayList<>();
        List<Shareholder> notEligible = new ArrayList<>();

        for (Shareholder sh : shareholders) {
            if (sh.symbol.equals(div.symbol()) &&
                !sh.holdSince.isAfter(div.recordDate())) {
                eligible.add(sh);
            } else {
                notEligible.add(sh);
            }
        }

        System.out.printf("%n--- Eligible Shareholders (held on %s) ---%n", div.recordDate());
        System.out.printf("%-15s %6s %9s %11s %8s%n",
            "Name", "Shares", "Gross", "Tax(15%)", "Net");

        double totalNet = 0;
        for (Shareholder sh : eligible) {
            double gross = sh.quantity * div.amountPerShare();
            double tax = gross * TAX_RATE;
            double net = gross - tax;
            sh.balance += net;
            totalNet += net;
            System.out.printf("%-15s %6d %9.1f %11.1f %8.1f  \\u2713 credited%n",
                sh.name, sh.quantity, gross, tax, net);
        }

        if (!notEligible.isEmpty()) {
            System.out.println("\\n--- Not Eligible ---");
            for (Shareholder sh : notEligible) {
                System.out.printf("%-15s %6d  (bought %s, after record date)%n",
                    sh.name, sh.quantity, sh.holdSince);
            }
        }

        System.out.println("\\n--- Corporate Actions Log ---");
        System.out.printf("[%s] DIV %s %.1f/share -> %d shareholders, total net: %.1f KZT%n",
            div.payDate(), div.symbol(), div.amountPerShare(),
            eligible.size(), totalNet);
    }
}`,
      explanation: 'Дивидендная обработка — ключевое корпоративное действие. Ex-date — после этой даты покупатель не получит дивиденд. Record date — дата фиксации реестра акционеров. Pay date — дата выплаты. ИПН 15% — стандартная ставка налога на дивиденды в Казахстане. Settlement-система Halyk Finance автоматически определяет eligible акционеров по реестру KASE, рассчитывает налог и зачисляет выплату на брокерский счёт.'
    },
    {
      id: 10,
      title: 'Trading Analytics: Аналитика трейдера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Analytics. Спринт 10. Jira: TRD-110. Построй дашборд аналитики торговой стратегии: win rate, средний выигрыш/проигрыш, profit factor, максимальная просадка (max drawdown), упрощённый Sharpe ratio. Equity curve — кривая доходности. Это основной инструмент оценки эффективности трейдера.',
      requirements: [
        'Список закрытых сделок с P&L каждой',
        'Total trades, wins, losses, win rate (%)',
        'Average win, average loss',
        'Profit factor = gross profit / gross loss',
        'Max drawdown = максимальное падение от пика equity',
        'Sharpe ratio (упрощённый) = avg return / stddev returns',
        'Equity curve — нарастающий итог P&L',
        'Best/worst trade, monthly breakdown'
      ],
      expectedOutput: `=== Trading Analytics Dashboard ===

--- Performance Summary ---
Total Trades:     12
Winning:          7 (58.3%)
Losing:           5 (41.7%)
Avg Win:          +18571.4 KZT
Avg Loss:         -11400.0 KZT
Profit Factor:    2.28
Best Trade:       +45000.0 KZT (KMGZ)
Worst Trade:      -22000.0 KZT (HSBK)

--- Risk Metrics ---
Max Drawdown:     -33000.0 KZT (-5.7%)
Sharpe Ratio:     0.87

--- Equity Curve ---
Trade  1: +15000   | Equity: 515000  ████▌
Trade  2:  -8000   | Equity: 507000  ████
Trade  3: +22000   | Equity: 529000  █████▌
Trade  4: +12000   | Equity: 541000  ██████
Trade  5: -18000   | Equity: 523000  ████▌
Trade  6: +45000   | Equity: 568000  ████████▌
Trade  7: -15000   | Equity: 553000  ███████▌
Trade  8: +10000   | Equity: 563000  ████████
Trade  9: -22000   | Equity: 541000  ██████
Trade 10: +8000    | Equity: 549000  ██████▌
Trade 11: +18000   | Equity: 567000  ████████▌
Trade 12:  -7000   | Equity: 560000  ████████

--- Monthly Breakdown ---
Month       Trades   P&L         Win%
2025-01       4     +41000.0    75.0%
2025-02       4     +22000.0    50.0%
2025-03       4     -3000.0     50.0%`,
      hint: 'Max drawdown: отслеживай peak equity. Drawdown = current - peak. Max drawdown = min(drawdowns). Profit factor = sum(wins) / abs(sum(losses)). Sharpe = mean(returns) / stddev(returns). Equity curve — cumulative sum.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Trade(String symbol, double pnl, String month) {}

    public static void main(String[] args) {
        double initialEquity = 500_000.0;

        List<Trade> trades = List.of(
            new Trade("KCEL",  15000, "2025-01"),
            new Trade("HSBK",  -8000, "2025-01"),
            new Trade("KMGZ",  22000, "2025-01"),
            new Trade("KCEL",  12000, "2025-01"),
            new Trade("HSBK", -18000, "2025-02"),
            new Trade("KMGZ",  45000, "2025-02"),
            new Trade("KCEL", -15000, "2025-02"),
            new Trade("HSBK",  10000, "2025-02"),
            new Trade("HSBK", -22000, "2025-03"),
            new Trade("KCEL",   8000, "2025-03"),
            new Trade("KMGZ",  18000, "2025-03"),
            new Trade("KCEL",  -7000, "2025-03")
        );

        List<Trade> wins = trades.stream().filter(t -> t.pnl() > 0).toList();
        List<Trade> losses = trades.stream().filter(t -> t.pnl() < 0).toList();

        double grossProfit = wins.stream().mapToDouble(Trade::pnl).sum();
        double grossLoss = Math.abs(losses.stream().mapToDouble(Trade::pnl).sum());
        double avgWin = wins.isEmpty() ? 0 : grossProfit / wins.size();
        double avgLoss = losses.isEmpty() ? 0 : -grossLoss / losses.size();
        double profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
        double winRate = (double) wins.size() / trades.size() * 100;

        Trade best = trades.stream().max(Comparator.comparingDouble(Trade::pnl)).orElseThrow();
        Trade worst = trades.stream().min(Comparator.comparingDouble(Trade::pnl)).orElseThrow();

        // Max Drawdown
        double equity = initialEquity;
        double peak = equity;
        double maxDD = 0;
        List<Double> equityCurve = new ArrayList<>();
        for (Trade t : trades) {
            equity += t.pnl();
            equityCurve.add(equity);
            if (equity > peak) peak = equity;
            double dd = equity - peak;
            if (dd < maxDD) maxDD = dd;
        }
        double maxDDpct = (maxDD / (peak)) * 100;

        // Simplified Sharpe Ratio
        double[] returns = trades.stream().mapToDouble(Trade::pnl).toArray();
        double mean = Arrays.stream(returns).average().orElse(0);
        double variance = Arrays.stream(returns).map(r -> (r - mean) * (r - mean)).average().orElse(0);
        double stddev = Math.sqrt(variance);
        double sharpe = stddev > 0 ? mean / stddev : 0;

        // Print
        System.out.println("=== Trading Analytics Dashboard ===");
        System.out.println("\\n--- Performance Summary ---");
        System.out.printf("Total Trades:     %d%n", trades.size());
        System.out.printf("Winning:          %d (%.1f%%)%n", wins.size(), winRate);
        System.out.printf("Losing:           %d (%.1f%%)%n", losses.size(), 100 - winRate);
        System.out.printf("Avg Win:          %+.1f KZT%n", avgWin);
        System.out.printf("Avg Loss:         %.1f KZT%n", avgLoss);
        System.out.printf("Profit Factor:    %.2f%n", profitFactor);
        System.out.printf("Best Trade:       %+.1f KZT (%s)%n", best.pnl(), best.symbol());
        System.out.printf("Worst Trade:      %.1f KZT (%s)%n", worst.pnl(), worst.symbol());

        System.out.println("\\n--- Risk Metrics ---");
        System.out.printf("Max Drawdown:     %.1f KZT (%.1f%%)%n", maxDD, maxDDpct);
        System.out.printf("Sharpe Ratio:     %.2f%n", sharpe);

        System.out.println("\\n--- Equity Curve ---");
        for (int i = 0; i < trades.size(); i++) {
            double pnl = trades.get(i).pnl();
            double eq = equityCurve.get(i);
            int bars = (int)((eq - 490000) / 10000);
            String bar = "\\u2588".repeat(Math.max(0, bars)) +
                (bars > 0 ? "\\u258C" : "");
            System.out.printf("Trade %2d: %+7.0f   | Equity: %.0f  %s%n",
                i + 1, pnl, eq, bar);
        }

        // Monthly breakdown
        System.out.println("\\n--- Monthly Breakdown ---");
        System.out.printf("%-11s %6s %11s %8s%n", "Month", "Trades", "P&L", "Win%");
        Map<String, List<Trade>> byMonth = trades.stream()
            .collect(Collectors.groupingBy(Trade::month, TreeMap::new, Collectors.toList()));

        for (var entry : byMonth.entrySet()) {
            List<Trade> mt = entry.getValue();
            double mPnl = mt.stream().mapToDouble(Trade::pnl).sum();
            long mWins = mt.stream().filter(t -> t.pnl() > 0).count();
            double mWinRate = (double) mWins / mt.size() * 100;
            System.out.printf("%-11s %6d %+11.1f %7.1f%%%n",
                entry.getKey(), mt.size(), mPnl, mWinRate);
        }
    }
}`,
      explanation: 'Торговая аналитика — обязательный инструмент профессионального трейдера. Win rate показывает процент прибыльных сделок. Profit factor > 1 означает прибыльность стратегии. Max drawdown — максимальное падение капитала от пика, ключевая метрика риска. Sharpe ratio оценивает доходность относительно риска (stddev). В аналитических платформах Freedom Finance эти метрики рассчитываются в реальном времени на Java-бэкенде и отображаются на дашборде трейдера.'
    }
  ]
}
