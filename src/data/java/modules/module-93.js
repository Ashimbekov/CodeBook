export default {
  id: 93,
  title: 'Практикум: Проектирование систем',
  description: 'Проектирование объектно-ориентированных систем на Java: банк, библиотека, парковка, лифт, корзина покупок, ATM и другие.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Банковская система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируй банковскую систему: счета, переводы, история транзакций, проценты.',
      requirements: [
        'Класс BankAccount: id, ownerName, balance, accountType (SAVINGS/CHECKING)',
        'Класс Bank: accounts Map, createAccount, transfer, getHistory',
        'Класс Transaction: id, fromId, toId, amount, timestamp, type (DEPOSIT/WITHDRAW/TRANSFER)',
        'Валидация: баланс >= 0, аккаунт существует, сумма > 0',
        'Метод applyInterest(accountId, rate) — начисление процентов'
      ],
      expectedOutput: 'Account created: ACC-001 (Иван, SAVINGS)\nDeposit: +50000.0 → balance: 50000.0\nTransfer: ACC-001 → ACC-002: 10000.0\nACC-001 balance: 40000.0\nACC-002 balance: 10000.0\nInterest applied: ACC-001 +2000.0 (5%)\nHistory: [DEPOSIT 50000, TRANSFER 10000, INTEREST 2000]',
      hint: 'Используй BigDecimal для денег. Транзакции храни в List<Transaction> для каждого аккаунта. Transfer = две транзакции (withdraw + deposit) в одной операции.',
      solution: `import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class Main {
    enum AccountType { SAVINGS, CHECKING }
    enum TxType { DEPOSIT, WITHDRAW, TRANSFER, INTEREST }

    static class Transaction {
        String id; TxType type; BigDecimal amount; LocalDateTime time;
        String description;
        Transaction(TxType type, BigDecimal amount, String desc) {
            this.id = UUID.randomUUID().toString().substring(0, 8);
            this.type = type; this.amount = amount;
            this.time = LocalDateTime.now(); this.description = desc;
        }
        public String toString() { return type + " " + amount; }
    }

    static class BankAccount {
        String id; String owner; BigDecimal balance = BigDecimal.ZERO;
        AccountType type; List<Transaction> history = new ArrayList<>();
        BankAccount(String id, String owner, AccountType type) {
            this.id = id; this.owner = owner; this.type = type;
        }
    }

    static class Bank {
        Map<String, BankAccount> accounts = new HashMap<>();
        int nextId = 1;

        BankAccount createAccount(String owner, AccountType type) {
            String id = String.format("ACC-%03d", nextId++);
            BankAccount acc = new BankAccount(id, owner, type);
            accounts.put(id, acc);
            System.out.println("Account created: " + id + " (" + owner + ", " + type + ")");
            return acc;
        }

        void deposit(String accId, double amount) {
            BankAccount acc = accounts.get(accId);
            BigDecimal a = BigDecimal.valueOf(amount);
            acc.balance = acc.balance.add(a);
            acc.history.add(new Transaction(TxType.DEPOSIT, a, "Deposit"));
            System.out.println("Deposit: +" + a + " -> balance: " + acc.balance);
        }

        void transfer(String fromId, String toId, double amount) {
            BankAccount from = accounts.get(fromId);
            BankAccount to = accounts.get(toId);
            BigDecimal a = BigDecimal.valueOf(amount);
            if (from.balance.compareTo(a) < 0) throw new RuntimeException("Insufficient funds");
            from.balance = from.balance.subtract(a);
            to.balance = to.balance.add(a);
            from.history.add(new Transaction(TxType.TRANSFER, a, "To " + toId));
            to.history.add(new Transaction(TxType.TRANSFER, a, "From " + fromId));
            System.out.println("Transfer: " + fromId + " -> " + toId + ": " + a);
        }

        void applyInterest(String accId, double rate) {
            BankAccount acc = accounts.get(accId);
            BigDecimal interest = acc.balance.multiply(BigDecimal.valueOf(rate / 100));
            acc.balance = acc.balance.add(interest);
            acc.history.add(new Transaction(TxType.INTEREST, interest, rate + "%"));
            System.out.println("Interest applied: " + accId + " +" + interest + " (" + rate + "%)");
        }
    }

    public static void main(String[] args) {
        Bank bank = new Bank();
        BankAccount a1 = bank.createAccount("Ivan", AccountType.SAVINGS);
        BankAccount a2 = bank.createAccount("Maria", AccountType.CHECKING);
        bank.deposit(a1.id, 50000);
        bank.transfer(a1.id, a2.id, 10000);
        System.out.println(a1.id + " balance: " + a1.balance);
        System.out.println(a2.id + " balance: " + a2.balance);
        bank.applyInterest(a1.id, 5);
        System.out.println("History: " + a1.history);
    }
}`,
      explanation: 'ООП-проектирование: Bank — фасад для всех операций. BankAccount — модель данных. Transaction — запись истории. BigDecimal для точных денежных расчётов. Каждая операция сохраняет транзакцию в историю аккаунта.'
    },
    {
      id: 2,
      title: 'Задача: Библиотечная система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируй систему библиотеки: книги, читатели, выдача, возврат, штрафы за просрочку.',
      requirements: [
        'Класс Book: isbn, title, author, available, dueDate',
        'Класс Member: id, name, borrowedBooks (max 5)',
        'Класс Library: books, members, checkout, returnBook, search',
        'Штраф: 100 тенге за каждый день просрочки',
        'Поиск по названию или автору (регистронезависимый)'
      ],
      expectedOutput: 'Checkout: "Clean Code" → Member: Ivan, due: 2026-04-19\nReturn: "Clean Code", fine: 0\nSearch "java": [Effective Java, Java Concurrency]\nMax books reached (5)',
      hint: 'LocalDate.now().plusDays(14) для due date. ChronoUnit.DAYS.between для расчёта просрочки. Stream.filter для поиска.',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.*;

public class Main {
    static class Book {
        String isbn, title, author;
        boolean available = true;
        LocalDate dueDate;
        Book(String isbn, String title, String author) {
            this.isbn = isbn; this.title = title; this.author = author;
        }
        public String toString() { return title; }
    }

    static class Member {
        String id, name;
        List<Book> borrowed = new ArrayList<>();
        Member(String id, String name) { this.id = id; this.name = name; }
    }

    static class Library {
        Map<String, Book> books = new HashMap<>();
        Map<String, Member> members = new HashMap<>();

        void addBook(Book b) { books.put(b.isbn, b); }
        void addMember(Member m) { members.put(m.id, m); }

        String checkout(String isbn, String memberId) {
            Book book = books.get(isbn);
            Member member = members.get(memberId);
            if (!book.available) return "Book not available";
            if (member.borrowed.size() >= 5) return "Max books reached (5)";
            book.available = false;
            book.dueDate = LocalDate.now().plusDays(14);
            member.borrowed.add(book);
            return "Checkout: \\"" + book.title + "\\" -> " + member.name + ", due: " + book.dueDate;
        }

        String returnBook(String isbn, String memberId) {
            Book book = books.get(isbn);
            Member member = members.get(memberId);
            book.available = true;
            member.borrowed.remove(book);
            long overdue = ChronoUnit.DAYS.between(book.dueDate, LocalDate.now());
            long fine = overdue > 0 ? overdue * 100 : 0;
            book.dueDate = null;
            return "Return: \\"" + book.title + "\\", fine: " + fine;
        }

        List<Book> search(String query) {
            String q = query.toLowerCase();
            return books.values().stream()
                .filter(b -> b.title.toLowerCase().contains(q) || b.author.toLowerCase().contains(q))
                .collect(Collectors.toList());
        }
    }

    public static void main(String[] args) {
        Library lib = new Library();
        lib.addBook(new Book("1", "Clean Code", "Robert Martin"));
        lib.addBook(new Book("2", "Effective Java", "Joshua Bloch"));
        lib.addBook(new Book("3", "Java Concurrency", "Brian Goetz"));
        lib.addMember(new Member("M1", "Ivan"));

        System.out.println(lib.checkout("1", "M1"));
        System.out.println(lib.returnBook("1", "M1"));
        System.out.println("Search \\"java\\": " + lib.search("java"));
    }
}`,
      explanation: 'Library — центральный менеджер. Бизнес-логика: ограничение 5 книг, 14 дней выдачи, штраф за просрочку. ChronoUnit.DAYS.between для точного расчёта дней. Stream API для гибкого поиска. Map<String, Book> — быстрый доступ по ISBN.'
    },
    {
      id: 3,
      title: 'Задача: Парковка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Система управления парковкой: разные размеры мест, въезд/выезд, оплата по времени.',
      requirements: [
        'Enum SpotSize: SMALL, MEDIUM, LARGE',
        'Класс ParkingSpot: id, size, occupied, vehicle',
        'Класс Vehicle: plate, type (MOTORCYCLE/CAR/TRUCK)',
        'Класс ParkingLot: park, unpark, getAvailable, calculateFee',
        'Motorcycle → SMALL, Car → MEDIUM, Truck → LARGE',
        'Тариф: SMALL=200/час, MEDIUM=500/час, LARGE=1000/час'
      ],
      expectedOutput: 'Parked: ABC-123 (CAR) at spot M-1\nAvailable: SMALL=5, MEDIUM=9, LARGE=3\nUnparked: ABC-123, fee: 1000 (2 hours)\nAvailable: SMALL=5, MEDIUM=10, LARGE=3',
      hint: 'PriorityQueue или TreeMap для быстрого поиска свободного места. HashMap<String, ParkingRecord> для отслеживания времени парковки.',
      solution: `import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class Main {
    enum SpotSize { SMALL(200), MEDIUM(500), LARGE(1000);
        int rate; SpotSize(int r) { rate = r; }
    }
    enum VehicleType { MOTORCYCLE(SpotSize.SMALL), CAR(SpotSize.MEDIUM), TRUCK(SpotSize.LARGE);
        SpotSize required; VehicleType(SpotSize s) { required = s; }
    }

    static class ParkingSpot {
        String id; SpotSize size; boolean occupied = false;
        ParkingSpot(String id, SpotSize size) { this.id = id; this.size = size; }
    }

    static class ParkingRecord { String plate; String spotId; LocalDateTime entryTime;
        ParkingRecord(String p, String s) { plate=p; spotId=s; entryTime=LocalDateTime.now(); }
    }

    static class ParkingLot {
        Map<SpotSize, Queue<ParkingSpot>> available = new EnumMap<>(SpotSize.class);
        Map<String, ParkingSpot> allSpots = new HashMap<>();
        Map<String, ParkingRecord> records = new HashMap<>();

        ParkingLot(int small, int medium, int large) {
            for (SpotSize s : SpotSize.values()) available.put(s, new LinkedList<>());
            for (int i=0;i<small;i++) addSpot("S-"+(i+1), SpotSize.SMALL);
            for (int i=0;i<medium;i++) addSpot("M-"+(i+1), SpotSize.MEDIUM);
            for (int i=0;i<large;i++) addSpot("L-"+(i+1), SpotSize.LARGE);
        }

        void addSpot(String id, SpotSize size) {
            ParkingSpot spot = new ParkingSpot(id, size);
            allSpots.put(id, spot);
            available.get(size).add(spot);
        }

        String park(String plate, VehicleType type) {
            Queue<ParkingSpot> spots = available.get(type.required);
            if (spots.isEmpty()) return "No spot available for " + type;
            ParkingSpot spot = spots.poll();
            spot.occupied = true;
            records.put(plate, new ParkingRecord(plate, spot.id));
            return "Parked: " + plate + " (" + type + ") at spot " + spot.id;
        }

        String unpark(String plate, int hours) {
            ParkingRecord rec = records.remove(plate);
            ParkingSpot spot = allSpots.get(rec.spotId);
            spot.occupied = false;
            available.get(spot.size).add(spot);
            int fee = spot.size.rate * hours;
            return "Unparked: " + plate + ", fee: " + fee + " (" + hours + " hours)";
        }

        String getAvailable() {
            return "Available: " + available.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue().size())
                .reduce((a,b) -> a+", "+b).orElse("");
        }
    }

    public static void main(String[] args) {
        ParkingLot lot = new ParkingLot(5, 10, 3);
        System.out.println(lot.park("ABC-123", VehicleType.CAR));
        System.out.println(lot.getAvailable());
        System.out.println(lot.unpark("ABC-123", 2));
        System.out.println(lot.getAvailable());
    }
}`,
      explanation: 'EnumMap для хранения свободных мест по размерам — эффективный O(1) доступ. Queue (LinkedList) для FIFO выдачи мест. Records Map отслеживает припаркованные машины. Тариф зависит от размера места. Enum с полями — Java-идиома для связанных данных.'
    },
    {
      id: 4,
      title: 'Задача: Лифтовая система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируй систему управления лифтами в здании: несколько лифтов, вызовы с этажей, оптимальный выбор лифта.',
      requirements: [
        'Класс Elevator: id, currentFloor, direction (UP/DOWN/IDLE), requestQueue',
        'Класс ElevatorSystem: elevators, callElevator(floor, direction), step()',
        'Выбор ближайшего лифта, движущегося в нужном направлении',
        'Метод step() — один шаг симуляции (движение на 1 этаж)',
        'Обработка внутренних запросов (нажатие кнопки этажа внутри лифта)'
      ],
      expectedOutput: 'Elevator 1 at floor 1 (IDLE)\nCall from floor 5 UP -> assigned to Elevator 1\nStep: Elevator 1 at floor 2 (UP)\nStep: Elevator 1 at floor 3 (UP)\nElevator 1 arrived at floor 5\nInternal request: floor 8\nStep: Elevator 1 at floor 6 (UP)',
      hint: 'SCAN алгоритм: лифт движется в одном направлении, обрабатывая запросы по пути. Когда запросов в текущем направлении нет — меняет направление. TreeSet для упорядоченных запросов.',
      solution: `import java.util.*;

public class Main {
    enum Dir { UP, DOWN, IDLE }

    static class Elevator {
        int id, floor = 1;
        Dir dir = Dir.IDLE;
        TreeSet<Integer> upRequests = new TreeSet<>();
        TreeSet<Integer> downRequests = new TreeSet<>();

        Elevator(int id) { this.id = id; }

        void addRequest(int target) {
            if (target > floor) upRequests.add(target);
            else if (target < floor) downRequests.add(target);
        }

        void step() {
            if (dir == Dir.UP) {
                floor++;
                upRequests.remove(floor);
                if (upRequests.isEmpty()) dir = downRequests.isEmpty() ? Dir.IDLE : Dir.DOWN;
            } else if (dir == Dir.DOWN) {
                floor--;
                downRequests.remove(floor);
                if (downRequests.isEmpty()) dir = upRequests.isEmpty() ? Dir.IDLE : Dir.UP;
            }
        }

        int distanceTo(int target) { return Math.abs(floor - target); }
        public String toString() { return "Elevator " + id + " at floor " + floor + " (" + dir + ")"; }
    }

    static class ElevatorSystem {
        List<Elevator> elevators;
        ElevatorSystem(int count) {
            elevators = new ArrayList<>();
            for (int i = 1; i <= count; i++) elevators.add(new Elevator(i));
        }

        Elevator callElevator(int floor, Dir dir) {
            Elevator best = elevators.stream()
                .min(Comparator.comparingInt(e -> e.distanceTo(floor)))
                .orElseThrow();
            best.addRequest(floor);
            if (best.dir == Dir.IDLE) best.dir = floor > best.floor ? Dir.UP : Dir.DOWN;
            System.out.println("Call floor " + floor + " " + dir + " -> " + best);
            return best;
        }

        void step() {
            elevators.forEach(e -> { e.step(); System.out.println("  " + e); });
        }
    }

    public static void main(String[] args) {
        ElevatorSystem sys = new ElevatorSystem(2);
        System.out.println(sys.elevators.get(0));
        sys.callElevator(5, Dir.UP);
        sys.step(); sys.step(); sys.step(); sys.step();
        sys.elevators.get(0).addRequest(8);
        sys.step();
    }
}`,
      explanation: 'SCAN алгоритм (как дисковый ввод/вывод): лифт движется в одном направлении, обрабатывая все запросы по пути. TreeSet хранит упорядоченные запросы для эффективного определения ближайшего. Выбор лифта — минимальное расстояние. Реальные системы сложнее: учитывают загрузку, приоритеты, пиковые часы.'
    },
    {
      id: 5,
      title: 'Задача: Корзина покупок',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй корзину покупок интернет-магазина: добавление товаров, изменение количества, скидки, итог.',
      requirements: [
        'Класс Product: id, name, price',
        'Класс CartItem: product, quantity',
        'Класс ShoppingCart: add, remove, updateQuantity, getTotal, applyDiscount',
        'Скидка: процентная и фиксированная',
        'toString для красивого отображения корзины'
      ],
      expectedOutput: 'Cart:\n  1. Ноутбук x1 = 450000\n  2. Мышь x2 = 10000\nSubtotal: 460000\nDiscount (10%): -46000\nTotal: 414000',
      hint: 'Map<String, CartItem> — ключ productId для быстрого доступа. Discount как интерфейс с двумя реализациями: PercentDiscount и FixedDiscount.',
      solution: `import java.util.*;

public class Main {
    static class Product {
        String id, name; int price;
        Product(String id, String name, int price) { this.id=id; this.name=name; this.price=price; }
    }

    static class CartItem {
        Product product; int quantity;
        CartItem(Product p, int q) { product=p; quantity=q; }
        int subtotal() { return product.price * quantity; }
    }

    static class ShoppingCart {
        Map<String, CartItem> items = new LinkedHashMap<>();
        double discountPercent = 0;

        void add(Product p, int qty) {
            items.merge(p.id, new CartItem(p, qty),
                (old, n) -> { old.quantity += qty; return old; });
        }

        void remove(String productId) { items.remove(productId); }

        void updateQuantity(String productId, int qty) {
            if (qty <= 0) remove(productId);
            else items.get(productId).quantity = qty;
        }

        int getSubtotal() { return items.values().stream().mapToInt(CartItem::subtotal).sum(); }

        void applyDiscount(double percent) { this.discountPercent = percent; }

        int getTotal() {
            int sub = getSubtotal();
            return (int)(sub * (1 - discountPercent / 100));
        }

        void print() {
            System.out.println("Cart:");
            int i = 1;
            for (CartItem item : items.values()) {
                System.out.println("  " + i++ + ". " + item.product.name +
                    " x" + item.quantity + " = " + item.subtotal());
            }
            int sub = getSubtotal();
            System.out.println("Subtotal: " + sub);
            if (discountPercent > 0) {
                int disc = (int)(sub * discountPercent / 100);
                System.out.println("Discount (" + (int)discountPercent + "%): -" + disc);
            }
            System.out.println("Total: " + getTotal());
        }
    }

    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.add(new Product("1", "Laptop", 450000), 1);
        cart.add(new Product("2", "Mouse", 5000), 2);
        cart.applyDiscount(10);
        cart.print();
    }
}`,
      explanation: 'LinkedHashMap сохраняет порядок добавления. merge() элегантно обрабатывает добавление: новый товар или увеличение quantity. Stream.mapToInt для подсчёта итога. Простой и расширяемый дизайн: легко добавить промокоды, лимиты, налоги.'
    },
    {
      id: 6,
      title: 'Задача: ATM Machine',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй банкомат: аутентификация по PIN, проверка баланса, снятие с выдачей купюр, внесение.',
      requirements: [
        'Класс ATM: authenticate, checkBalance, withdraw, deposit',
        'Купюры: 20000, 10000, 5000, 2000, 1000, 500',
        'Жадный алгоритм выдачи: максимальные купюры первыми',
        'PIN проверка (3 попытки, блокировка карты)',
        'Лимит снятия за один раз: 500000'
      ],
      expectedOutput: 'PIN verified. Welcome!\nBalance: 150000\nWithdraw 47500:\n  20000 x 2\n  5000 x 1\n  2000 x 1\n  500 x 1\nRemaining: 102500\nDeposit 30000 → Balance: 132500',
      hint: 'TreeMap<Integer, Integer> (номинал → количество) для купюр в банкомате. Greedy: начинай с крупных. Если купюра кончилась или не подходит — следующая.',
      solution: `import java.util.*;

public class Main {
    static class ATM {
        TreeMap<Integer, Integer> bills = new TreeMap<>(Collections.reverseOrder());
        Map<String, Integer> pins = new HashMap<>();
        Map<String, Integer> balances = new HashMap<>();
        String currentUser = null;
        int attempts = 0;

        ATM() {
            bills.put(20000, 100); bills.put(10000, 100); bills.put(5000, 200);
            bills.put(2000, 200); bills.put(1000, 500); bills.put(500, 500);
            pins.put("4444-1111", 1234);
            balances.put("4444-1111", 150000);
        }

        boolean authenticate(String card, int pin) {
            if (attempts >= 3) { System.out.println("Card blocked!"); return false; }
            if (pins.getOrDefault(card, -1) == pin) {
                currentUser = card; attempts = 0;
                System.out.println("PIN verified. Welcome!"); return true;
            }
            attempts++;
            System.out.println("Wrong PIN. Attempts left: " + (3 - attempts));
            return false;
        }

        void checkBalance() {
            System.out.println("Balance: " + balances.get(currentUser));
        }

        void withdraw(int amount) {
            if (amount > 500000) { System.out.println("Limit exceeded (500000)"); return; }
            if (amount > balances.get(currentUser)) { System.out.println("Insufficient funds"); return; }
            Map<Integer, Integer> dispensed = new LinkedHashMap<>();
            int remaining = amount;
            for (var entry : bills.entrySet()) {
                int nom = entry.getKey(), avail = entry.getValue();
                int count = Math.min(remaining / nom, avail);
                if (count > 0) {
                    dispensed.put(nom, count);
                    remaining -= nom * count;
                    entry.setValue(avail - count);
                }
            }
            if (remaining > 0) { System.out.println("Cannot dispense exact amount"); return; }
            balances.merge(currentUser, -amount, Integer::sum);
            System.out.println("Withdraw " + amount + ":");
            dispensed.forEach((n, c) -> System.out.println("  " + n + " x " + c));
            System.out.println("Remaining: " + balances.get(currentUser));
        }

        void deposit(int amount) {
            balances.merge(currentUser, amount, Integer::sum);
            System.out.println("Deposit " + amount + " -> Balance: " + balances.get(currentUser));
        }
    }

    public static void main(String[] args) {
        ATM atm = new ATM();
        atm.authenticate("4444-1111", 1234);
        atm.checkBalance();
        atm.withdraw(47500);
        atm.deposit(30000);
    }
}`,
      explanation: 'TreeMap с reverseOrder хранит купюры от крупных к мелким для жадного алгоритма. Greedy выдача: берём максимум крупных купюр, потом мелкие. Проверка остатка после выдачи — если != 0, невозможно выдать точную сумму. PIN с 3 попытками — базовая безопасность.'
    },
    {
      id: 7,
      title: 'Задача: Система бронирования билетов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Бронирование билетов на события: места, бронь, отмена, waitlist.',
      requirements: [
        'Класс Event: id, name, date, totalSeats, availableSeats',
        'Класс Booking: id, eventId, userId, seats, status (CONFIRMED/WAITLISTED/CANCELLED)',
        'Класс BookingSystem: book, cancel, getAvailable',
        'Когда мест нет — добавлять в waitlist (Queue)',
        'При отмене — автоматически подтверждать из waitlist'
      ],
      expectedOutput: 'Booking confirmed: B-001 (Concert, 2 seats)\nAvailable: 8/10\nBooking confirmed: B-002 (Concert, 8 seats)\nWaitlisted: B-003 (Concert, 3 seats)\nCancelled: B-002. Waitlist promoted: B-003 confirmed!',
      hint: 'Queue<Booking> для waitlist. При отмене: освобождаем места и проверяем waitlist — если первый в очереди помещается, подтверждаем.',
      solution: `import java.util.*;

public class Main {
    enum Status { CONFIRMED, WAITLISTED, CANCELLED }

    static class Booking {
        String id, eventId, userId; int seats; Status status;
        Booking(String id, String eId, String uId, int seats, Status s) {
            this.id=id; eventId=eId; userId=uId; this.seats=seats; status=s;
        }
    }

    static class Event {
        String id, name; int totalSeats, available;
        Queue<Booking> waitlist = new LinkedList<>();
        Event(String id, String name, int seats) {
            this.id=id; this.name=name; totalSeats=seats; available=seats;
        }
    }

    static class BookingSystem {
        Map<String, Event> events = new HashMap<>();
        Map<String, Booking> bookings = new HashMap<>();
        int nextId = 1;

        void addEvent(Event e) { events.put(e.id, e); }

        String book(String eventId, String userId, int seats) {
            Event event = events.get(eventId);
            String bid = String.format("B-%03d", nextId++);
            if (event.available >= seats) {
                event.available -= seats;
                Booking b = new Booking(bid, eventId, userId, seats, Status.CONFIRMED);
                bookings.put(bid, b);
                return "Booking confirmed: " + bid + " (" + event.name + ", " + seats + " seats)";
            } else {
                Booking b = new Booking(bid, eventId, userId, seats, Status.WAITLISTED);
                bookings.put(bid, b);
                event.waitlist.add(b);
                return "Waitlisted: " + bid + " (" + event.name + ", " + seats + " seats)";
            }
        }

        String cancel(String bookingId) {
            Booking b = bookings.get(bookingId);
            Event event = events.get(b.eventId);
            b.status = Status.CANCELLED;
            event.available += b.seats;
            String result = "Cancelled: " + bookingId;
            // Promote from waitlist
            while (!event.waitlist.isEmpty()) {
                Booking w = event.waitlist.peek();
                if (w.seats <= event.available) {
                    event.waitlist.poll();
                    w.status = Status.CONFIRMED;
                    event.available -= w.seats;
                    result += ". Waitlist promoted: " + w.id + " confirmed!";
                } else break;
            }
            return result;
        }

        String getAvailable(String eventId) {
            Event e = events.get(eventId);
            return "Available: " + e.available + "/" + e.totalSeats;
        }
    }

    public static void main(String[] args) {
        BookingSystem sys = new BookingSystem();
        sys.addEvent(new Event("E1", "Concert", 10));
        System.out.println(sys.book("E1", "U1", 2));
        System.out.println(sys.getAvailable("E1"));
        System.out.println(sys.book("E1", "U2", 8));
        System.out.println(sys.book("E1", "U3", 3));
        System.out.println(sys.cancel("B-002"));
    }
}`,
      explanation: 'Queue (FIFO) для waitlist — справедливый порядок. При отмене автоматически проверяем waitlist и подтверждаем, если места есть. Паттерн: Event Sourcing-like подход — каждое действие создаёт/обновляет Booking. Расширение: таймаут бронирования, частичная отмена.'
    },
    {
      id: 8,
      title: 'Задача: Чат-приложение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Модель чат-приложения: пользователи, чаты (личные и групповые), сообщения, онлайн-статус.',
      requirements: [
        'Класс User: id, name, online status',
        'Класс Message: id, senderId, content, timestamp',
        'Класс Chat: id, participants, messages, type (DIRECT/GROUP)',
        'Класс ChatApp: createChat, sendMessage, getHistory, getOnlineUsers',
        'Групповой чат: добавление/удаление участников'
      ],
      expectedOutput: 'Chat created: Direct (Ivan <-> Maria)\nIvan: Привет! (14:30)\nMaria: Привет! Как дела? (14:31)\nHistory: 2 messages\nOnline: [Ivan, Maria]',
      hint: 'Observer pattern для уведомлений. LinkedList для сообщений (быстрое добавление в конец). Set<User> для участников чата.',
      solution: `import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    enum ChatType { DIRECT, GROUP }

    static class User {
        String id, name; boolean online = true;
        User(String id, String name) { this.id=id; this.name=name; }
        public String toString() { return name; }
    }

    static class Message {
        String senderId, content; LocalTime time;
        Message(String sid, String content) {
            this.senderId=sid; this.content=content; time=LocalTime.now();
        }
    }

    static class Chat {
        String id; ChatType type; Set<String> participants = new LinkedHashSet<>();
        List<Message> messages = new ArrayList<>();
        Chat(String id, ChatType type) { this.id=id; this.type=type; }
    }

    static class ChatApp {
        Map<String, User> users = new HashMap<>();
        Map<String, Chat> chats = new HashMap<>();
        int chatId = 1;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");

        void addUser(User u) { users.put(u.id, u); }

        Chat createDirectChat(String uid1, String uid2) {
            Chat chat = new Chat("C" + chatId++, ChatType.DIRECT);
            chat.participants.add(uid1);
            chat.participants.add(uid2);
            chats.put(chat.id, chat);
            System.out.println("Chat created: Direct (" + users.get(uid1) + " <-> " + users.get(uid2) + ")");
            return chat;
        }

        void sendMessage(String chatId, String userId, String content) {
            Chat chat = chats.get(chatId);
            Message msg = new Message(userId, content);
            chat.messages.add(msg);
            System.out.println(users.get(userId) + ": " + content + " (" + msg.time.format(fmt) + ")");
        }

        void getHistory(String chatId) {
            Chat chat = chats.get(chatId);
            System.out.println("History: " + chat.messages.size() + " messages");
        }

        void getOnlineUsers() {
            List<String> online = new ArrayList<>();
            users.values().stream().filter(u -> u.online).forEach(u -> online.add(u.name));
            System.out.println("Online: " + online);
        }
    }

    public static void main(String[] args) {
        ChatApp app = new ChatApp();
        app.addUser(new User("U1", "Ivan"));
        app.addUser(new User("U2", "Maria"));
        Chat chat = app.createDirectChat("U1", "U2");
        app.sendMessage(chat.id, "U1", "Hello!");
        app.sendMessage(chat.id, "U2", "Hi! How are you?");
        app.getHistory(chat.id);
        app.getOnlineUsers();
    }
}`,
      explanation: 'ChatApp — фасад для всей функциональности. Set<String> для участников — уникальность и быстрая проверка. Direct vs Group чаты через ChatType. Расширения: WebSocket для real-time, шифрование, медиа-файлы, прочтение сообщений.'
    },
    {
      id: 9,
      title: 'Задача: Система отелей',
      type: 'practice',
      difficulty: 'hard',
      description: 'Бронирование отелей: типы номеров, даты, проверка доступности, цены по сезону.',
      requirements: [
        'Enum RoomType: STANDARD(15000), DELUXE(25000), SUITE(50000)',
        'Класс Room: number, type, floor',
        'Класс Reservation: id, roomNumber, guestName, checkIn, checkOut',
        'Класс Hotel: reserve, cancel, isAvailable, getPrice (сезонный множитель)',
        'Проверка пересечения дат при бронировании'
      ],
      expectedOutput: 'Reserved: R-001, Room 101 (STANDARD), 2026-04-10 to 2026-04-15\nPrice: 75000 (5 nights x 15000)\nRoom 101 unavailable for 2026-04-12 to 2026-04-14\nAvailable STANDARD rooms for Apr 10-15: [102, 103, 104, 105]',
      hint: 'Проверка пересечения: !(checkOut <= existStart || checkIn >= existEnd). Сезонный множитель: лето x1.5, НГ x2.0.',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.*;

public class Main {
    enum RoomType { STANDARD(15000), DELUXE(25000), SUITE(50000);
        int basePrice; RoomType(int p) { basePrice = p; }
    }

    static class Room { int number; RoomType type; int floor;
        Room(int n, RoomType t, int f) { number=n; type=t; floor=f; }
    }

    static class Reservation {
        String id; int roomNumber; String guest;
        LocalDate checkIn, checkOut;
        Reservation(String id, int room, String guest, LocalDate in, LocalDate out) {
            this.id=id; roomNumber=room; this.guest=guest; checkIn=in; checkOut=out;
        }
    }

    static class Hotel {
        List<Room> rooms = new ArrayList<>();
        List<Reservation> reservations = new ArrayList<>();
        int nextId = 1;

        void addRoom(Room r) { rooms.add(r); }

        boolean isAvailable(int roomNum, LocalDate in, LocalDate out) {
            return reservations.stream()
                .filter(r -> r.roomNumber == roomNum)
                .noneMatch(r -> !(out.compareTo(r.checkIn) <= 0 || in.compareTo(r.checkOut) >= 0));
        }

        String reserve(int roomNum, String guest, LocalDate in, LocalDate out) {
            if (!isAvailable(roomNum, in, out))
                return "Room " + roomNum + " unavailable for " + in + " to " + out;
            String id = String.format("R-%03d", nextId++);
            reservations.add(new Reservation(id, roomNum, guest, in, out));
            Room room = rooms.stream().filter(r -> r.number == roomNum).findFirst().orElseThrow();
            long nights = ChronoUnit.DAYS.between(in, out);
            int price = (int)(room.type.basePrice * nights);
            return "Reserved: " + id + ", Room " + roomNum + " (" + room.type +
                "), " + in + " to " + out + "\\nPrice: " + price +
                " (" + nights + " nights x " + room.type.basePrice + ")";
        }

        List<Integer> getAvailableRooms(RoomType type, LocalDate in, LocalDate out) {
            return rooms.stream()
                .filter(r -> r.type == type && isAvailable(r.number, in, out))
                .map(r -> r.number)
                .collect(Collectors.toList());
        }
    }

    public static void main(String[] args) {
        Hotel hotel = new Hotel();
        for (int i = 101; i <= 105; i++) hotel.addRoom(new Room(i, RoomType.STANDARD, 1));
        for (int i = 201; i <= 203; i++) hotel.addRoom(new Room(i, RoomType.DELUXE, 2));

        LocalDate in = LocalDate.of(2026,4,10), out = LocalDate.of(2026,4,15);
        System.out.println(hotel.reserve(101, "Ivan", in, out));
        System.out.println(hotel.reserve(101, "Maria", LocalDate.of(2026,4,12), LocalDate.of(2026,4,14)));
        System.out.println("Available STANDARD: " + hotel.getAvailableRooms(RoomType.STANDARD, in, out));
    }
}`,
      explanation: 'Ключевая логика — проверка пересечения дат: два интервала пересекаются если НЕ (один заканчивается до начала другого). Stream API для фильтрации доступных номеров. ChronoUnit.DAYS.between для расчёта ночей. Расширения: сезонные цены, типы питания, отзывы.'
    },
    {
      id: 10,
      title: 'Задача: Социальная сеть (лента)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Мини-социальная сеть: пользователи, подписки, посты, лента (feed) на основе подписок.',
      requirements: [
        'Класс User: id, name, followers, following',
        'Класс Post: id, authorId, content, timestamp, likes',
        'Класс SocialNetwork: follow, unfollow, post, getFeed, like',
        'Feed: посты от подписок, отсортированные по времени (новые первые)',
        'Top posts: посты с наибольшим количеством лайков'
      ],
      expectedOutput: `Ivan follows Maria\nMaria posted: "Привет мир!"\nIvan posted: "Java лучший!"\nIvan's feed:\n  Maria: Привет мир! (2 likes)\n  Ivan: Java лучший! (0 likes)\nTop posts: [Привет мир! (2)]`,
      hint: 'Feed = Stream.concat(свои посты + посты подписок).sorted(по времени desc).limit(20). PriorityQueue для top-K постов.',
      solution: `import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.*;

public class Main {
    static class Post {
        int id; String authorId, content; LocalDateTime time;
        Set<String> likedBy = new HashSet<>();
        Post(int id, String author, String content) {
            this.id=id; authorId=author; this.content=content; time=LocalDateTime.now();
        }
        int likes() { return likedBy.size(); }
        public String toString() { return content + " (" + likes() + " likes)"; }
    }

    static class SocialNetwork {
        Map<String, String> users = new HashMap<>(); // id -> name
        Map<String, Set<String>> following = new HashMap<>();
        List<Post> posts = new ArrayList<>();
        int postId = 1;

        void addUser(String id, String name) {
            users.put(id, name);
            following.put(id, new HashSet<>());
        }

        void follow(String userId, String targetId) {
            following.get(userId).add(targetId);
            System.out.println(users.get(userId) + " follows " + users.get(targetId));
        }

        void post(String userId, String content) {
            posts.add(new Post(postId++, userId, content));
            System.out.println(users.get(userId) + " posted: \\"" + content + "\\"");
        }

        void like(String userId, int postId) {
            posts.stream().filter(p -> p.id == postId).findFirst()
                .ifPresent(p -> p.likedBy.add(userId));
        }

        void getFeed(String userId) {
            Set<String> sources = new HashSet<>(following.get(userId));
            sources.add(userId);
            List<Post> feed = posts.stream()
                .filter(p -> sources.contains(p.authorId))
                .sorted(Comparator.comparing((Post p) -> p.time).reversed())
                .limit(20)
                .collect(Collectors.toList());
            System.out.println(users.get(userId) + "'s feed:");
            feed.forEach(p -> System.out.println("  " + users.get(p.authorId) + ": " + p));
        }

        void topPosts(int k) {
            List<Post> top = posts.stream()
                .sorted(Comparator.comparingInt(Post::likes).reversed())
                .limit(k)
                .collect(Collectors.toList());
            System.out.println("Top posts: " + top);
        }
    }

    public static void main(String[] args) {
        SocialNetwork sn = new SocialNetwork();
        sn.addUser("U1", "Ivan"); sn.addUser("U2", "Maria");
        sn.follow("U1", "U2");
        sn.post("U2", "Hello world!");
        sn.post("U1", "Java is the best!");
        sn.like("U1", 1); sn.like("U2", 1);
        sn.getFeed("U1");
        sn.topPosts(1);
    }
}`,
      explanation: 'Feed construction: собираем посты от подписок + свои, сортируем по времени. Stream API идеален для таких pipeline-операций. Set<String> likedBy предотвращает двойной лайк. В реальных системах: пагинация, кеширование ленты (Fan-out on write vs Fan-out on read), база данных.'
    }
  ]
}
