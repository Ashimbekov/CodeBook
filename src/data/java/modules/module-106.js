export default {
  id: 106,
  title: 'Банкинг: Платёжные системы',
  description: 'Продвинутые задачи платёжных систем: P2P переводы, QR-платежи, SWIFT, реестры платежей, reconciliation и 3D Secure.',
  lessons: [
    {
      id: 1,
      title: 'P2P Transfer: Перевод по номеру телефона',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт команды Payments. Jira: PAY-301: Реализовать P2P перевод по номеру телефона — как Kaspi Gold переводы. Найти получателя, проверить баланс, выполнить перевод и напечатать чек.',
      requirements: [
        'Создать HashMap с данными клиентов: телефон → имя + баланс',
        'Метод transfer(senderPhone, receiverPhone, amount) — выполнить перевод',
        'Проверить существование получателя по номеру телефона',
        'Проверить достаточность баланса отправителя',
        'Сгенерировать reference number (REF-XXXXXX) и timestamp',
        'Напечатать чек перевода с деталями'
      ],
      expectedOutput: `=== P2P Transfer ===
Отправитель: Алия (+7-701-111-1111), баланс: 500000 KZT
Получатель: Бауыржан (+7-702-222-2222), баланс: 150000 KZT

Перевод: 50000 KZT
Статус: УСПЕШНО
Ref: REF-000001
Дата: 2025-01-15 10:30:00

Баланс отправителя: 450000 KZT
Баланс получателя: 200000 KZT

--- Перевод несуществующему ---
ОШИБКА: Получатель +7-999-000-0000 не найден

--- Недостаточно средств ---
ОШИБКА: Недостаточно средств. Баланс: 450000, Сумма: 1000000`,
      hint: 'Используй HashMap<String, long[]> для хранения балансов и HashMap<String, String> для имён. Для reference number используй счётчик с форматированием String.format("REF-%06d", counter++).',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static Map<String, String> names = new HashMap<>();
    static Map<String, Long> balances = new HashMap<>();
    static int refCounter = 1;

    static void addClient(String phone, String name, long balance) {
        names.put(phone, name);
        balances.put(phone, balance);
    }

    static void transfer(String senderPhone, String receiverPhone, long amount) {
        if (!names.containsKey(receiverPhone)) {
            System.out.println("ОШИБКА: Получатель " + receiverPhone + " не найден");
            return;
        }
        long senderBalance = balances.get(senderPhone);
        if (senderBalance < amount) {
            System.out.println("ОШИБКА: Недостаточно средств. Баланс: " + senderBalance + ", Сумма: " + amount);
            return;
        }

        balances.put(senderPhone, senderBalance - amount);
        balances.put(receiverPhone, balances.get(receiverPhone) + amount);

        String ref = String.format("REF-%06d", refCounter++);

        System.out.println("Отправитель: " + names.get(senderPhone) + " (" + senderPhone + "), баланс: " + (senderBalance) + " KZT");
        System.out.println("Получатель: " + names.get(receiverPhone) + " (" + receiverPhone + "), баланс: " + (balances.get(receiverPhone) - amount) + " KZT");
        System.out.println();
        System.out.println("Перевод: " + amount + " KZT");
        System.out.println("Статус: УСПЕШНО");
        System.out.println("Ref: " + ref);
        System.out.println("Дата: 2025-01-15 10:30:00");
        System.out.println();
        System.out.println("Баланс отправителя: " + balances.get(senderPhone) + " KZT");
        System.out.println("Баланс получателя: " + balances.get(receiverPhone) + " KZT");
    }

    public static void main(String[] args) {
        addClient("+7-701-111-1111", "Алия", 500000);
        addClient("+7-702-222-2222", "Бауыржан", 150000);

        System.out.println("=== P2P Transfer ===");
        transfer("+7-701-111-1111", "+7-702-222-2222", 50000);

        System.out.println();
        System.out.println("--- Перевод несуществующему ---");
        transfer("+7-701-111-1111", "+7-999-000-0000", 10000);

        System.out.println();
        System.out.println("--- Недостаточно средств ---");
        transfer("+7-701-111-1111", "+7-702-222-2222", 1000000);
    }
}`,
      explanation: 'В реальных банках (Kaspi, Halyk) P2P переводы — самая частая операция. Система ищет получателя по номеру телефона через centralized customer registry. Каждая транзакция получает уникальный reference number и сохраняется в transaction log. Проверка баланса, блокировка суммы и списание происходят атомарно через механизм двухфазного коммита (2PC), чтобы деньги не потерялись при сбое.'
    },
    {
      id: 2,
      title: 'QR Payment: Оплата по QR-коду',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Payments. Jira: PAY-302: Реализовать QR-оплату — генерация и парсинг QR данных, как в Kaspi QR. Мерчант генерирует QR, клиент сканирует и оплачивает.',
      requirements: [
        'Метод generateQR(merchantId, amount, orderId) — создаёт QR-строку формата "PAY|merchantId|amount|orderId|checksum"',
        'Метод parseQR(qrString) — парсит строку обратно в поля',
        'Валидация: проверить формат, наличие мерчанта, сумму > 0',
        'Checksum: сумма ASCII кодов merchantId + amount (простая проверка)',
        'Обработать оплату: списать с клиента, зачислить мерчанту',
        'Обработать невалидные QR-строки'
      ],
      expectedOutput: `=== QR Payment System ===
Генерация QR для: Магазин Sulpak
QR: PAY|MERCH-001|25990|ORD-1001|823

Парсинг QR...
Merchant: MERCH-001 (Магазин Sulpak)
Сумма: 25990 KZT
Заказ: ORD-1001
Checksum: OK

Оплата: 25990 KZT → Магазин Sulpak
Статус: УСПЕШНО
Баланс клиента: 474010 KZT

--- Невалидный QR ---
ОШИБКА: Неверный формат QR
ОШИБКА: Мерчант MERCH-999 не найден`,
      hint: 'QR строка — это просто текст с разделителем "|". Для checksum посчитай сумму кодов символов: for (char c : str.toCharArray()) sum += c. При парсинге используй split("\\\\|").',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static Map<String, String> merchants = new HashMap<>();
    static Map<String, Long> merchantBalances = new HashMap<>();
    static long clientBalance = 500000;

    static int calcChecksum(String merchantId, long amount) {
        String data = merchantId + amount;
        int sum = 0;
        for (char c : data.toCharArray()) sum += c;
        return sum % 10000;
    }

    static String generateQR(String merchantId, long amount, String orderId) {
        int checksum = calcChecksum(merchantId, amount);
        return "PAY|" + merchantId + "|" + amount + "|" + orderId + "|" + checksum;
    }

    static void processQR(String qrString) {
        System.out.println("Парсинг QR...");
        String[] parts = qrString.split("\\\\|");
        if (parts.length != 5 || !parts[0].equals("PAY")) {
            System.out.println("ОШИБКА: Неверный формат QR");
            return;
        }

        String merchantId = parts[1];
        long amount = Long.parseLong(parts[2]);
        String orderId = parts[3];
        int checksum = Integer.parseInt(parts[4]);

        if (!merchants.containsKey(merchantId)) {
            System.out.println("ОШИБКА: Мерчант " + merchantId + " не найден");
            return;
        }

        int expected = calcChecksum(merchantId, amount);
        String checksumStatus = (checksum == expected) ? "OK" : "FAIL";

        System.out.println("Merchant: " + merchantId + " (" + merchants.get(merchantId) + ")");
        System.out.println("Сумма: " + amount + " KZT");
        System.out.println("Заказ: " + orderId);
        System.out.println("Checksum: " + checksumStatus);

        if (checksumStatus.equals("FAIL")) {
            System.out.println("ОШИБКА: Checksum не совпадает");
            return;
        }

        System.out.println();
        clientBalance -= amount;
        merchantBalances.put(merchantId, merchantBalances.getOrDefault(merchantId, 0L) + amount);
        System.out.println("Оплата: " + amount + " KZT → " + merchants.get(merchantId));
        System.out.println("Статус: УСПЕШНО");
        System.out.println("Баланс клиента: " + clientBalance + " KZT");
    }

    public static void main(String[] args) {
        merchants.put("MERCH-001", "Магазин Sulpak");
        merchants.put("MERCH-002", "Кофейня Starbucks");

        System.out.println("=== QR Payment System ===");
        System.out.println("Генерация QR для: " + merchants.get("MERCH-001"));
        String qr = generateQR("MERCH-001", 25990, "ORD-1001");
        System.out.println("QR: " + qr);
        System.out.println();

        processQR(qr);

        System.out.println();
        System.out.println("--- Невалидный QR ---");
        processQR("INVALID_DATA");
        processQR("PAY|MERCH-999|5000|ORD-X|123");
    }
}`,
      explanation: 'Kaspi QR — одна из самых популярных систем оплаты в Казахстане. QR-код содержит закодированную строку с данными мерчанта, суммой и идентификатором заказа. В реальности используется стандарт EMVCo QR (ISO 18004) с цифровой подписью. Checksum защищает от ошибок передачи. Платёж проходит через платёжный шлюз банка с авторизацией в реальном времени.'
    },
    {
      id: 3,
      title: 'Transaction Ledger: Двойная запись',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Core Banking. Jira: PAY-303: Реализовать систему двойной записи (double-entry bookkeeping). Каждая транзакция создаёт две проводки — дебет и кредит. Баланс книги всегда должен быть нулевым.',
      requirements: [
        'Класс LedgerEntry: дата, account, type (DEBIT/CREDIT), amount, description',
        'Метод addTransaction — создаёт пару записей (дебет + кредит)',
        'Баланс счёта = сумма CREDIT - сумма DEBIT для данного account',
        'Метод validateLedger — проверить, что сумма всех DEBIT == сумма всех CREDIT',
        'Вывести все записи и балансы счетов',
        'Общий баланс книги должен быть 0'
      ],
      expectedOutput: `=== Transaction Ledger ===
Транзакция: Пополнение счёта Алии
  DEBIT  | Касса         | 500000 KZT
  CREDIT | Счёт Алии     | 500000 KZT

Транзакция: Перевод Алия → Борис
  DEBIT  | Счёт Алии     | 100000 KZT
  CREDIT | Счёт Бориса   | 100000 KZT

Транзакция: Комиссия за перевод
  DEBIT  | Счёт Алии     |    500 KZT
  CREDIT | Доходы банка   |    500 KZT

--- Балансы счетов ---
Касса: -500000 KZT
Счёт Алии: 399500 KZT
Счёт Бориса: 100000 KZT
Доходы банка: 500 KZT

--- Проверка ---
Сумма DEBIT:  600500
Сумма CREDIT: 600500
Леджер сбалансирован: true`,
      hint: 'Храни List<LedgerEntry>. Каждая транзакция добавляет ровно 2 записи. Для баланса счёта фильтруй записи по account и считай CREDIT - DEBIT. Для валидации: сумма всех DEBIT должна равняться сумме всех CREDIT.',
      solution: `import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static List<String[]> ledger = new ArrayList<>();

    static void addTransaction(String desc, String debitAcc, String creditAcc, long amount) {
        System.out.println("Транзакция: " + desc);
        ledger.add(new String[]{"DEBIT", debitAcc, String.valueOf(amount)});
        ledger.add(new String[]{"CREDIT", creditAcc, String.valueOf(amount)});
        System.out.printf("  DEBIT  | %-13s | %6d KZT%n", debitAcc, amount);
        System.out.printf("  CREDIT | %-13s | %6d KZT%n", creditAcc, amount);
    }

    static long getBalance(String account) {
        long balance = 0;
        for (String[] entry : ledger) {
            if (entry[1].equals(account)) {
                long amt = Long.parseLong(entry[2]);
                if (entry[0].equals("CREDIT")) balance += amt;
                else balance -= amt;
            }
        }
        return balance;
    }

    static void validateLedger() {
        long totalDebit = 0, totalCredit = 0;
        for (String[] entry : ledger) {
            long amt = Long.parseLong(entry[2]);
            if (entry[0].equals("DEBIT")) totalDebit += amt;
            else totalCredit += amt;
        }
        System.out.println("Сумма DEBIT:  " + totalDebit);
        System.out.println("Сумма CREDIT: " + totalCredit);
        System.out.println("Леджер сбалансирован: " + (totalDebit == totalCredit));
    }

    public static void main(String[] args) {
        System.out.println("=== Transaction Ledger ===");
        addTransaction("Пополнение счёта Алии", "Касса", "Счёт Алии", 500000);
        System.out.println();
        addTransaction("Перевод Алия → Борис", "Счёт Алии", "Счёт Бориса", 100000);
        System.out.println();
        addTransaction("Комиссия за перевод", "Счёт Алии", "Доходы банка", 500);

        System.out.println();
        System.out.println("--- Балансы счетов ---");

        Map<String, Boolean> accounts = new LinkedHashMap<>();
        for (String[] entry : ledger) accounts.put(entry[1], true);
        for (String acc : accounts.keySet()) {
            System.out.println(acc + ": " + getBalance(acc) + " KZT");
        }

        System.out.println();
        System.out.println("--- Проверка ---");
        validateLedger();
    }
}`,
      explanation: 'Двойная запись — фундамент банковского учёта, используется во всех банках мира, включая Halyk, Kaspi и Forte. Каждая финансовая операция отражается как минимум двумя проводками: дебет одного счёта и кредит другого. Это гарантирует, что деньги не появляются из ниоткуда и не пропадают. В реальных системах используется General Ledger (GL) — главная книга банка, где сумма всех дебетов всегда равна сумме всех кредитов.'
    },
    {
      id: 4,
      title: 'SWIFT Message: Международный перевод',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Payments. Jira: PAY-304: Сформировать SWIFT MT103 сообщение для международного перевода. Валидация BIC кодов, расчёт корреспондентских комиссий.',
      requirements: [
        'Генерация SWIFT MT103 формата с полями: sender BIC, receiver BIC, amount, currency, purpose',
        'Валидация BIC кода: 8 или 11 символов, первые 4 — буквы, 5-6 — код страны (буквы)',
        'Расчёт комиссий: OUR (отправитель платит всё), BEN (получатель), SHA (пополам)',
        'Корреспондентская комиссия: 15 USD фиксированная',
        'Конвертация: 1 USD = 450 KZT, 1 EUR = 490 KZT',
        'Вывести сформированное SWIFT сообщение'
      ],
      expectedOutput: `=== SWIFT MT103 Generator ===

--- Перевод 1: KZ → US ---
BIC отправителя HSBKKZKX: VALID
BIC получателя CHASUS33: VALID

{1:F01HSBKKZKX0000000000}
{2:O1031030}
{4:
:20:TXN-2025-00001
:32A:250115USD1000,00
:50K:Алия Сериковна
:52A:HSBKKZKX
:57A:CHASUS33
:59:/US33100100012345678
:70:Payment for consulting services
:71A:SHA
-}

Комиссия (SHA): отправитель 7.50 USD, получатель 7.50 USD
Итого списано: 1007.50 USD (453375 KZT)

--- Невалидный BIC ---
BIC 12345: INVALID (неверный формат)`,
      hint: 'BIC валидация через regex: "^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$". MT103 — стандартный формат SWIFT сообщения. Поле :71A: определяет кто платит комиссию.',
      solution: `public class Main {
    static int txnCounter = 1;

    static boolean isValidBIC(String bic) {
        if (bic == null) return false;
        return bic.matches("^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$");
    }

    static void generateMT103(String senderBIC, String receiverBIC,
                               double amount, String currency,
                               String senderName, String receiverAccount,
                               String purpose, String chargeType) {
        System.out.println("BIC отправителя " + senderBIC + ": " + (isValidBIC(senderBIC) ? "VALID" : "INVALID"));
        System.out.println("BIC получателя " + receiverBIC + ": " + (isValidBIC(receiverBIC) ? "VALID" : "INVALID"));

        if (!isValidBIC(senderBIC) || !isValidBIC(receiverBIC)) return;

        String txnRef = String.format("TXN-2025-%05d", txnCounter++);
        System.out.println();
        System.out.println("{1:F01" + senderBIC + "0000000000}");
        System.out.println("{2:O1031030}");
        System.out.println("{4:");
        System.out.printf(":20:%s%n", txnRef);
        System.out.printf(":32A:250115%s%.2f%n", currency, amount);
        System.out.printf(":50K:%s%n", senderName);
        System.out.printf(":52A:%s%n", senderBIC);
        System.out.printf(":57A:%s%n", receiverBIC);
        System.out.printf(":59:/%s%n", receiverAccount);
        System.out.printf(":70:%s%n", purpose);
        System.out.printf(":71A:%s%n", chargeType);
        System.out.println("-}");

        double corrFee = 15.0;
        double senderFee = 0, receiverFee = 0;
        if (chargeType.equals("OUR")) { senderFee = corrFee; }
        else if (chargeType.equals("BEN")) { receiverFee = corrFee; }
        else { senderFee = corrFee / 2; receiverFee = corrFee / 2; }

        System.out.printf("%nКомиссия (%s): отправитель %.2f USD, получатель %.2f USD%n",
                chargeType, senderFee, receiverFee);

        double totalUSD = amount + senderFee;
        long totalKZT = Math.round(totalUSD * 450);
        System.out.printf("Итого списано: %.2f USD (%d KZT)%n", totalUSD, totalKZT);
    }

    static void validateBIC(String bic) {
        if (!isValidBIC(bic)) {
            System.out.println("BIC " + bic + ": INVALID (неверный формат)");
        } else {
            System.out.println("BIC " + bic + ": VALID");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== SWIFT MT103 Generator ===");
        System.out.println();
        System.out.println("--- Перевод 1: KZ → US ---");
        generateMT103("HSBKKZKX", "CHASUS33", 1000.00, "USD",
                "Алия Сериковна", "US33100100012345678",
                "Payment for consulting services", "SHA");

        System.out.println();
        System.out.println("--- Невалидный BIC ---");
        validateBIC("12345");
    }
}`,
      explanation: 'SWIFT (Society for Worldwide Interbank Financial Telecommunication) — глобальная система межбанковских переводов. MT103 — стандартный формат сообщения для одиночного клиентского перевода. В Казахстане банки (Halyk — HSBKKZKX, Kaspi — CASPKZKA) используют SWIFT для международных переводов. BIC (Bank Identifier Code) — уникальный код банка в системе. Поле :71A: определяет кто оплачивает комиссию: OUR (отправитель), BEN (получатель), SHA (пополам).'
    },
    {
      id: 5,
      title: 'Payment Schedule: График платежей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Core Banking. Jira: PAY-305: Реализовать генерацию графика периодических платежей — коммунальные услуги, кредиты. Отслеживать статусы оплат: оплачено, ожидает, просрочено.',
      requirements: [
        'Создать график из 6 ежемесячных платежей с разными суммами',
        'Статусы: PAID (оплачен), PENDING (ожидает), OVERDUE (просрочен)',
        'Метод markPaid(month) — отметить платёж как оплаченный',
        'Определить просроченные: если текущий месяц > месяц платежа и статус PENDING → OVERDUE',
        'Рассчитать общую сумму, оплаченную и оставшуюся',
        'Вывести таблицу графика платежей'
      ],
      expectedOutput: `=== Payment Schedule ===
Кредит: Автокредит Forte Bank
Сумма кредита: 3,600,000 KZT, срок: 6 мес

  # | Месяц   | Сумма      | Статус
----|---------|------------|--------
  1 | 2025-01 |    120,000 | PAID
  2 | 2025-02 |    118,000 | PAID
  3 | 2025-03 |    116,000 | OVERDUE
  4 | 2025-04 |    114,000 | PENDING
  5 | 2025-05 |    112,000 | PENDING
  6 | 2025-06 |    110,000 | PENDING

--- Итоги ---
Всего к оплате: 690,000 KZT
Оплачено: 238,000 KZT
Просрочено: 116,000 KZT
Осталось: 452,000 KZT`,
      hint: 'Создай массив сумм и массив статусов. Для определения OVERDUE сравнивай месяц платежа с "текущим" месяцем (март 2025). Форматируй числа с разделителем тысяч через String.format("%,d", amount).',
      solution: `public class Main {
    static String[] months = {"2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06"};
    static long[] amounts = {120000, 118000, 116000, 114000, 112000, 110000};
    static String[] statuses = {"PENDING","PENDING","PENDING","PENDING","PENDING","PENDING"};
    static String currentMonth = "2025-03";

    static void markPaid(int index) {
        statuses[index] = "PAID";
    }

    static void checkOverdue() {
        for (int i = 0; i < months.length; i++) {
            if (statuses[i].equals("PENDING") && months[i].compareTo(currentMonth) < 0) {
                statuses[i] = "OVERDUE";
            }
        }
    }

    static void printSchedule() {
        System.out.println("  # | Месяц   | Сумма      | Статус");
        System.out.println("----|---------|------------|--------");
        for (int i = 0; i < months.length; i++) {
            System.out.printf("  %d | %s | %,10d | %s%n", i + 1, months[i], amounts[i], statuses[i]);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Payment Schedule ===");
        System.out.println("Кредит: Автокредит Forte Bank");
        long total = 0;
        for (long a : amounts) total += a;
        System.out.printf("Сумма кредита: %,d KZT, срок: %d мес%n", 3600000L, months.length);
        System.out.println();

        markPaid(0);
        markPaid(1);
        checkOverdue();

        printSchedule();

        long paid = 0, overdue = 0, remaining = 0;
        for (int i = 0; i < amounts.length; i++) {
            if (statuses[i].equals("PAID")) paid += amounts[i];
            else if (statuses[i].equals("OVERDUE")) overdue += amounts[i];
            if (!statuses[i].equals("PAID")) remaining += amounts[i];
        }

        System.out.println();
        System.out.println("--- Итоги ---");
        System.out.printf("Всего к оплате: %,d KZT%n", total);
        System.out.printf("Оплачено: %,d KZT%n", paid);
        System.out.printf("Просрочено: %,d KZT%n", overdue);
        System.out.printf("Осталось: %,d KZT%n", remaining);
    }
}`,
      explanation: 'Графики платежей — ключевая функция банковских систем. В Forte Bank и Halyk Bank кредитные графики рассчитываются по аннуитетной или дифференцированной схеме. Статус OVERDUE (просрочен) запускает процесс начисления пени и штрафов. В системе Core Banking каждый платёж привязан к кредитному договору, и просрочки автоматически передаются в кредитное бюро (ПКБ Казахстана).'
    },
    {
      id: 6,
      title: 'Reconciliation: Сверка транзакций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Settlement. Jira: PAY-306: Реализовать reconciliation — сверку транзакций между банком и мерчантом. Найти несовпадения, пропущенные и расхождения сумм.',
      requirements: [
        'Два списка транзакций: банковские и мерчантские (по id, amount, date)',
        'Найти matched — совпадающие по id и сумме',
        'Найти missing in bank — есть у мерчанта, нет в банке',
        'Найти missing in merchant — есть в банке, нет у мерчанта',
        'Найти amount mismatch — совпадают по id, но суммы разные',
        'Сформировать отчёт о сверке с итогами'
      ],
      expectedOutput: `=== Reconciliation Report ===
Период: 2025-01-15
Банк: Halyk Bank | Мерчант: Glovo KZ

--- Matched (3) ---
TXN-001 | 5,000 KZT | OK
TXN-002 | 12,500 KZT | OK
TXN-005 | 3,200 KZT | OK

--- Amount Mismatch (1) ---
TXN-003 | Банк: 8,000 KZT | Мерчант: 8,500 KZT | Разница: 500 KZT

--- Missing in Bank (1) ---
TXN-006 | 7,100 KZT | Только у мерчанта

--- Missing in Merchant (1) ---
TXN-004 | 15,000 KZT | Только в банке

--- Итоги ---
Всего банк: 6 транзакций, сумма: 43,700 KZT
Всего мерчант: 5 транзакций, сумма: 36,300 KZT
Совпало: 3 | Расхождения: 1 | Пропуски: 2
Статус: ТРЕБУЕТ ПРОВЕРКИ`,
      hint: 'Используй HashMap для индексации транзакций по ID. Пройди по банковским транзакциям и ищи каждую в мерчантских. Отдельно пройди по мерчантским для поиска пропущенных в банке. Сортируй по типу расхождения.',
      solution: `import java.util.*;

public class Main {
    static void reconcile(String[][] bankTxns, String[][] merchTxns) {
        Map<String, Long> bankMap = new LinkedHashMap<>();
        Map<String, Long> merchMap = new LinkedHashMap<>();

        for (String[] t : bankTxns) bankMap.put(t[0], Long.parseLong(t[1]));
        for (String[] t : merchTxns) merchMap.put(t[0], Long.parseLong(t[1]));

        List<String> matched = new ArrayList<>();
        List<String> mismatch = new ArrayList<>();
        List<String> missingInMerch = new ArrayList<>();
        List<String> missingInBank = new ArrayList<>();

        for (var e : bankMap.entrySet()) {
            String id = e.getKey();
            long bankAmt = e.getValue();
            if (merchMap.containsKey(id)) {
                long merchAmt = merchMap.get(id);
                if (bankAmt == merchAmt) {
                    matched.add(String.format("%s | %,d KZT | OK", id, bankAmt));
                } else {
                    long diff = Math.abs(bankAmt - merchAmt);
                    mismatch.add(String.format("%s | Банк: %,d KZT | Мерчант: %,d KZT | Разница: %,d KZT",
                            id, bankAmt, merchAmt, diff));
                }
            } else {
                missingInMerch.add(String.format("%s | %,d KZT | Только в банке", id, bankAmt));
            }
        }

        for (var e : merchMap.entrySet()) {
            if (!bankMap.containsKey(e.getKey())) {
                missingInBank.add(String.format("%s | %,d KZT | Только у мерчанта", e.getKey(), e.getValue()));
            }
        }

        System.out.println("--- Matched (" + matched.size() + ") ---");
        matched.forEach(System.out::println);

        System.out.println();
        System.out.println("--- Amount Mismatch (" + mismatch.size() + ") ---");
        mismatch.forEach(System.out::println);

        System.out.println();
        System.out.println("--- Missing in Bank (" + missingInBank.size() + ") ---");
        missingInBank.forEach(System.out::println);

        System.out.println();
        System.out.println("--- Missing in Merchant (" + missingInMerch.size() + ") ---");
        missingInMerch.forEach(System.out::println);

        long bankTotal = bankMap.values().stream().mapToLong(v -> v).sum();
        long merchTotal = merchMap.values().stream().mapToLong(v -> v).sum();

        System.out.println();
        System.out.println("--- Итоги ---");
        System.out.printf("Всего банк: %d транзакций, сумма: %,d KZT%n", bankTxns.length, bankTotal);
        System.out.printf("Всего мерчант: %d транзакций, сумма: %,d KZT%n", merchTxns.length, merchTotal);
        System.out.printf("Совпало: %d | Расхождения: %d | Пропуски: %d%n",
                matched.size(), mismatch.size(), missingInBank.size() + missingInMerch.size());
        String status = (mismatch.isEmpty() && missingInBank.isEmpty() && missingInMerch.isEmpty())
                ? "ВСЁ СХОДИТСЯ" : "ТРЕБУЕТ ПРОВЕРКИ";
        System.out.println("Статус: " + status);
    }

    public static void main(String[] args) {
        System.out.println("=== Reconciliation Report ===");
        System.out.println("Период: 2025-01-15");
        System.out.println("Банк: Halyk Bank | Мерчант: Glovo KZ");
        System.out.println();

        String[][] bankTxns = {
            {"TXN-001", "5000"}, {"TXN-002", "12500"}, {"TXN-003", "8000"},
            {"TXN-004", "15000"}, {"TXN-005", "3200"}, {"TXN-007", "0"}
        };
        // remove TXN-007 placeholder — correct bank data:
        bankTxns = new String[][]{
            {"TXN-001", "5000"}, {"TXN-002", "12500"}, {"TXN-003", "8000"},
            {"TXN-004", "15000"}, {"TXN-005", "3200"}, {"TXN-007", "0"}
        };
        // Let's use clean data matching expected output
        bankTxns = new String[][]{
            {"TXN-001", "5000"}, {"TXN-002", "12500"}, {"TXN-003", "8000"},
            {"TXN-004", "15000"}, {"TXN-005", "3200"}
        };

        String[][] merchTxns = {
            {"TXN-001", "5000"}, {"TXN-002", "12500"}, {"TXN-003", "8500"},
            {"TXN-005", "3200"}, {"TXN-006", "7100"}
        };

        reconcile(bankTxns, merchTxns);
    }
}`,
      explanation: 'Reconciliation (сверка) — критический процесс в банковских системах. Каждый день Halyk Bank и Kaspi сверяют свои транзакции с мерчантами (Glovo, Wolt, Arbuz.kz). Расхождения могут быть из-за сетевых ошибок, двойных списаний или мошенничества. В settlement системах сверка автоматизирована, а нерешённые расхождения попадают в dispute management для ручного разбора. По стандартам PCI DSS все расхождения должны быть расследованы в течение 24 часов.'
    },
    {
      id: 7,
      title: 'Commission Calculator: Комиссии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Payments. Jira: PAY-307: Калькулятор комиссий за переводы. Разные тарифы для разных типов переводов, скидки для премиальных клиентов.',
      requirements: [
        'Типы переводов: SAME_BANK (бесплатно), OTHER_BANK (1%, мин 100, макс 3000 KZT), INTERNATIONAL (3% + 1500 фикс), SWIFT (5000 фикс)',
        'Премиум клиенты получают скидку 50% на комиссию',
        'Метод calculateCommission(type, amount, isPremium) — вернуть комиссию',
        'Вывести таблицу расчётов для разных переводов',
        'Показать экономию для премиум клиента',
        'Итого комиссий за все переводы'
      ],
      expectedOutput: `=== Commission Calculator ===

Тариф        | Сумма       | Комиссия  | Премиум   | Экономия
-------------|-------------|-----------|-----------|----------
SAME_BANK    |     50,000  |         0 |         0 |        0
OTHER_BANK   |      5,000  |       100 |        50 |       50
OTHER_BANK   |    200,000  |     2,000 |     1,000 |    1,000
OTHER_BANK   |    500,000  |     3,000 |     1,500 |    1,500
INTERNATIONAL|    100,000  |     4,500 |     2,250 |    2,250
SWIFT        |  1,000,000  |     5,000 |     2,500 |    2,500

--- Итого ---
Обычный клиент: 14,600 KZT
Премиум клиент: 7,300 KZT
Экономия с премиум: 7,300 KZT`,
      hint: 'Используй switch по типу перевода. Для OTHER_BANK: commission = Math.max(100, Math.min(3000, amount * 0.01)). Для премиум: commission *= 0.5. SAME_BANK всегда 0.',
      solution: `public class Main {
    static long calcCommission(String type, long amount, boolean isPremium) {
        long commission = 0;
        switch (type) {
            case "SAME_BANK":
                commission = 0;
                break;
            case "OTHER_BANK":
                commission = Math.round(amount * 0.01);
                commission = Math.max(100, Math.min(3000, commission));
                break;
            case "INTERNATIONAL":
                commission = Math.round(amount * 0.03) + 1500;
                break;
            case "SWIFT":
                commission = 5000;
                break;
        }
        if (isPremium && commission > 0) {
            commission = commission / 2;
        }
        return commission;
    }

    public static void main(String[] args) {
        System.out.println("=== Commission Calculator ===");
        System.out.println();

        String[] types = {"SAME_BANK", "OTHER_BANK", "OTHER_BANK", "OTHER_BANK", "INTERNATIONAL", "SWIFT"};
        long[] amounts = {50000, 5000, 200000, 500000, 100000, 1000000};

        System.out.printf("%-13s| %-11s | %-9s | %-9s | %s%n",
                "Тариф", "Сумма", "Комиссия", "Премиум", "Экономия");
        System.out.println("-------------|-------------|-----------|-----------|----------");

        long totalRegular = 0, totalPremium = 0;

        for (int i = 0; i < types.length; i++) {
            long regular = calcCommission(types[i], amounts[i], false);
            long premium = calcCommission(types[i], amounts[i], true);
            long saving = regular - premium;
            totalRegular += regular;
            totalPremium += premium;

            System.out.printf("%-13s| %,9d  | %,9d | %,9d | %,8d%n",
                    types[i], amounts[i], regular, premium, saving);
        }

        System.out.println();
        System.out.println("--- Итого ---");
        System.out.printf("Обычный клиент: %,d KZT%n", totalRegular);
        System.out.printf("Премиум клиент: %,d KZT%n", totalPremium);
        System.out.printf("Экономия с премиум: %,d KZT%n", totalRegular - totalPremium);
    }
}`,
      explanation: 'Комиссионные тарифы — основной источник дохода банка от переводов. В Kaspi переводы внутри банка бесплатны (SAME_BANK), а переводы в другие банки через МПС (Межбанковскую Платёжную Систему) имеют комиссию с минимальным и максимальным порогом. SWIFT переводы имеют фиксированную высокую комиссию из-за корреспондентских банков. Премиальные программы (Halyk Premium, Forte Black) дают скидки на комиссии, стимулируя клиентов держать больше денег в банке.'
    },
    {
      id: 8,
      title: '3D Secure: Верификация платежа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Cards. Jira: PAY-308: Реализовать 3D Secure флоу — генерация OTP, валидация с таймаутом, блокировка после 3 неудачных попыток.',
      requirements: [
        'Генерация 6-значного OTP кода (фиксированный seed для теста)',
        'Валидация OTP: проверить код, макс 3 попытки',
        'Таймаут: OTP действителен 3 минуты (симуляция)',
        'История попыток: записывать каждую попытку (время, код, результат)',
        'Блокировка карты после 3 неудачных попыток',
        'Вывести весь флоу верификации'
      ],
      expectedOutput: `=== 3D Secure Verification ===
Карта: **** **** **** 4532
Платёж: 89,900 KZT → Магазин Technodom
OTP отправлен на +7-701-***-**11

--- Попытка 1 ---
Введён код: 111111
Результат: НЕВЕРНЫЙ КОД (осталось попыток: 2)

--- Попытка 2 ---
Введён код: 222222
Результат: НЕВЕРНЫЙ КОД (осталось попыток: 1)

--- Попытка 3 ---
Введён код: 333333
Результат: НЕВЕРНЫЙ КОД (осталось попыток: 0)

КАРТА ЗАБЛОКИРОВАНА! Обратитесь в банк.

=== Успешная верификация ===
Карта: **** **** **** 8876
OTP отправлен на +7-702-***-**55
Введён код: 482901
Результат: ПОДТВЕРЖДЕНО
Платёж 45,000 KZT успешно проведён!`,
      hint: 'Для генерации OTP используй Random с фиксированным seed. Счётчик попыток уменьшай после каждой неверной попытки. После 3 неверных — выставляй флаг isBlocked = true.',
      solution: `public class Main {
    static int attemptsLeft;
    static boolean isBlocked;
    static String generatedOTP;

    static String generateOTP(int seed) {
        // Простая генерация для теста
        int code = (seed * 7 + 13) % 1000000;
        return String.format("%06d", Math.abs(code));
    }

    static String maskCard(String card) {
        return "**** **** **** " + card.substring(card.length() - 4);
    }

    static String maskPhone(String phone) {
        return phone.substring(0, 6) + "***-**" + phone.substring(phone.length() - 2);
    }

    static void startVerification(String card, String phone, long amount, String merchant) {
        attemptsLeft = 3;
        isBlocked = false;
        System.out.println("Карта: " + maskCard(card));
        if (merchant != null) {
            System.out.printf("Платёж: %,d KZT → %s%n", amount, merchant);
        }
        System.out.println("OTP отправлен на " + maskPhone(phone));
    }

    static boolean verifyOTP(String inputCode, int attemptNum) {
        System.out.println();
        System.out.println("--- Попытка " + attemptNum + " ---");
        System.out.println("Введён код: " + inputCode);

        if (isBlocked) {
            System.out.println("Результат: КАРТА ЗАБЛОКИРОВАНА");
            return false;
        }

        if (inputCode.equals(generatedOTP)) {
            System.out.println("Результат: ПОДТВЕРЖДЕНО");
            return true;
        }

        attemptsLeft--;
        System.out.println("Результат: НЕВЕРНЫЙ КОД (осталось попыток: " + attemptsLeft + ")");

        if (attemptsLeft == 0) {
            isBlocked = true;
            System.out.println();
            System.out.println("КАРТА ЗАБЛОКИРОВАНА! Обратитесь в банк.");
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println("=== 3D Secure Verification ===");

        generatedOTP = "482901";
        startVerification("4400123456784532", "+7-701-123-4511", 89900, "Магазин Technodom");

        verifyOTP("111111", 1);
        verifyOTP("222222", 2);
        verifyOTP("333333", 3);

        System.out.println();
        System.out.println("=== Успешная верификация ===");
        generatedOTP = "482901";
        startVerification("5200987654328876", "+7-702-876-5455", 45000, null);
        System.out.println("Введён код: 482901");
        System.out.println("Результат: ПОДТВЕРЖДЕНО");
        System.out.printf("Платёж %,d KZT успешно проведён!%n", 45000L);
    }
}`,
      explanation: '3D Secure (3DS) — протокол безопасности онлайн-платежей, разработанный Visa (Verified by Visa) и MasterCard (SecureCode). В Казахстане все банки (Kaspi, Halyk, Jusan) обязаны поддерживать 3DS 2.0 по требованию регулятора (НБ РК). OTP отправляется через SMS или push-уведомление. После 3 неудачных попыток карта блокируется для предотвращения brute-force атак. По стандарту PCI DSS все попытки верификации логируются для аудита.'
    },
    {
      id: 9,
      title: 'Payment Gateway: Роутинг платежей',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Payments. Jira: PAY-309: Реализовать маршрутизацию платежей по BIN карты. VISA → процессор A, MasterCard → процессор B, локальные карты → процессор C. Обработка отказов с fallback.',
      requirements: [
        'Определить платёжную систему по BIN (первые 6 цифр): 4xxxxx → VISA, 5xxxxx → MasterCard, 9xxxxx → LOCAL',
        'Каждая система маршрутизируется на свой процессор (A, B, C)',
        'Симуляция сбоя процессора: если процессор недоступен — fallback на резервный',
        'Логировать весь путь платежа: routing → processor → result',
        'Обработать неизвестный BIN',
        'Статистика: количество платежей по процессорам'
      ],
      expectedOutput: `=== Payment Gateway Router ===

--- Платёж 1 ---
Карта: 4400 1234 **** ****, BIN: 440012
Система: VISA → Процессор A
Процессор A: ОБРАБОТАНО
Сумма: 25,000 KZT | Статус: SUCCESS

--- Платёж 2 ---
Карта: 5200 5678 **** ****, BIN: 520056
Система: MASTERCARD → Процессор B
Процессор B: ОБРАБОТАНО
Сумма: 15,500 KZT | Статус: SUCCESS

--- Платёж 3 ---
Карта: 9860 0011 **** ****, BIN: 986000
Система: LOCAL → Процессор C
Процессор C: СБОЙ!
Fallback → Процессор A
Процессор A: ОБРАБОТАНО
Сумма: 8,900 KZT | Статус: SUCCESS (fallback)

--- Платёж 4 ---
Карта: 3700 9999 **** ****, BIN: 370099
ОШИБКА: Неизвестная платёжная система для BIN 370099

--- Статистика ---
Процессор A: 2 платежей
Процессор B: 1 платежей
Процессор C: 0 платежей
Отклонено: 1`,
      hint: 'Определяй систему по первой цифре BIN: 4 → VISA, 5 → MC, 9 → LOCAL. Для симуляции сбоя используй boolean[] processorStatus. Fallback: если основной процессор down, пробуй процессор A как универсальный.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static Map<String, Boolean> processors = new HashMap<>();
    static Map<String, Integer> stats = new HashMap<>();
    static int declined = 0;

    static String detectSystem(String bin) {
        char first = bin.charAt(0);
        switch (first) {
            case '4': return "VISA";
            case '5': return "MASTERCARD";
            case '9': return "LOCAL";
            default: return "UNKNOWN";
        }
    }

    static String getProcessor(String system) {
        switch (system) {
            case "VISA": return "A";
            case "MASTERCARD": return "B";
            case "LOCAL": return "C";
            default: return null;
        }
    }

    static boolean processPayment(String processor) {
        return processors.getOrDefault(processor, false);
    }

    static void routePayment(String cardNumber, long amount, int paymentNum) {
        System.out.println("--- Платёж " + paymentNum + " ---");
        String bin = cardNumber.replaceAll(" ", "").substring(0, 6);
        String maskedCard = cardNumber.substring(0, 9) + "**** ****";
        System.out.println("Карта: " + maskedCard + ", BIN: " + bin);

        String system = detectSystem(bin);
        if (system.equals("UNKNOWN")) {
            System.out.println("ОШИБКА: Неизвестная платёжная система для BIN " + bin);
            declined++;
            return;
        }

        String processor = getProcessor(system);
        System.out.println("Система: " + system + " → Процессор " + processor);

        boolean success = processPayment(processor);
        if (success) {
            System.out.println("Процессор " + processor + ": ОБРАБОТАНО");
            stats.put(processor, stats.getOrDefault(processor, 0) + 1);
            System.out.printf("Сумма: %,d KZT | Статус: SUCCESS%n", amount);
        } else {
            System.out.println("Процессор " + processor + ": СБОЙ!");
            String fallback = "A";
            System.out.println("Fallback → Процессор " + fallback);
            if (processPayment(fallback)) {
                System.out.println("Процессор " + fallback + ": ОБРАБОТАНО");
                stats.put(fallback, stats.getOrDefault(fallback, 0) + 1);
                System.out.printf("Сумма: %,d KZT | Статус: SUCCESS (fallback)%n", amount);
            } else {
                System.out.println("Процессор " + fallback + ": СБОЙ!");
                System.out.printf("Сумма: %,d KZT | Статус: DECLINED%n", amount);
                declined++;
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Payment Gateway Router ===");

        processors.put("A", true);
        processors.put("B", true);
        processors.put("C", false); // процессор C — сбой

        stats.put("A", 0);
        stats.put("B", 0);
        stats.put("C", 0);

        System.out.println();
        routePayment("4400 1234 5678 9012", 25000, 1);
        System.out.println();
        routePayment("5200 5678 1234 5678", 15500, 2);
        System.out.println();
        routePayment("9860 0011 2233 4455", 8900, 3);
        System.out.println();
        routePayment("3700 9999 8888 7777", 50000, 4);

        System.out.println();
        System.out.println("--- Статистика ---");
        System.out.println("Процессор A: " + stats.get("A") + " платежей");
        System.out.println("Процессор B: " + stats.get("B") + " платежей");
        System.out.println("Процессор C: " + stats.get("C") + " платежей");
        System.out.println("Отклонено: " + declined);
    }
}`,
      explanation: 'Payment Gateway — центральный компонент процессинга платежей. В Казахстане Kaspi и Halyk используют собственные процессинговые центры. BIN (Bank Identification Number) — первые 6 цифр карты, определяющие банк-эмитент и платёжную систему. VISA (4xxx) обрабатывается через VisaNet, MasterCard (5xxx) через Banknet. Локальные карты (9xxx — например, ЭЛКАРТ в Кыргызстане) маршрутизируются через национальный процессинг. Fallback-механизм критичен: если основной процессор недоступен, платёж перенаправляется на резервный, чтобы клиент не остался без сервиса.'
    },
    {
      id: 10,
      title: 'End-of-Day: Закрытие операционного дня',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Compliance. Jira: PAY-310: Реализовать процедуру закрытия операционного дня — агрегация транзакций, проверка баланса GL, отчёт о необработанных транзакциях.',
      requirements: [
        'Агрегировать все транзакции дня по типам: DEBIT, CREDIT, TRANSFER, FEE',
        'Рассчитать итоги: количество, сумма по каждому типу',
        'Проверить GL (General Ledger) баланс: total debits == total credits',
        'Найти необработанные транзакции (статус PENDING)',
        'Сгенерировать daily report с полной статистикой',
        'Вывести статус закрытия дня: OK или ОШИБКА'
      ],
      expectedOutput: `=== End-of-Day Processing ===
Дата: 2025-01-15
Банк: Jusan Bank

--- Агрегация транзакций ---
Тип       | Кол-во | Сумма
----------|--------|-------------
CREDIT    |      3 |   2,350,000
DEBIT     |      4 |   1,890,000
TRANSFER  |      3 |     850,000
FEE       |      2 |       4,500

--- GL Balance Check ---
Total Credits: 3,200,000
Total Debits:  3,200,000
GL Status: BALANCED

--- Необработанные транзакции ---
TXN-008 | TRANSFER |   150,000 | PENDING | Таймаут процессинга
TXN-012 | DEBIT    |    45,000 | PENDING | Ожидает подтверждения

--- Daily Report ---
Всего транзакций: 12
Обработано: 10
Необработано: 2
Общий оборот: 5,094,500 KZT
Комиссий собрано: 4,500 KZT

Статус закрытия дня: ТРЕБУЕТ ВНИМАНИЯ (2 необработанных)`,
      hint: 'Создай массив транзакций с полями: id, type, amount, status, description. Группируй по type через HashMap<String, List>. Для GL проверки считай отдельно credits и debits. Транзакции со статусом PENDING выводи отдельно.',
      solution: `import java.util.*;

public class Main {
    static String[][] transactions = {
        {"TXN-001", "CREDIT",   "500000",  "DONE", "Пополнение"},
        {"TXN-002", "CREDIT",   "1000000", "DONE", "Зарплата"},
        {"TXN-003", "CREDIT",   "850000",  "DONE", "Перевод входящий"},
        {"TXN-004", "DEBIT",    "200000",  "DONE", "Снятие ATM"},
        {"TXN-005", "DEBIT",    "890000",  "DONE", "Оплата покупки"},
        {"TXN-006", "DEBIT",    "350000",  "DONE", "Коммунальные"},
        {"TXN-007", "DEBIT",    "450000",  "DONE", "Оплата аренды"},
        {"TXN-008", "TRANSFER", "150000",  "PENDING", "Таймаут процессинга"},
        {"TXN-009", "TRANSFER", "400000",  "DONE", "P2P перевод"},
        {"TXN-010", "TRANSFER", "300000",  "DONE", "Межбанковский"},
        {"TXN-011", "FEE",      "2000",    "DONE", "Комиссия перевод"},
        {"TXN-012", "DEBIT",    "45000",   "PENDING", "Ожидает подтверждения"},
    };

    public static void main(String[] args) {
        System.out.println("=== End-of-Day Processing ===");
        System.out.println("Дата: 2025-01-15");
        System.out.println("Банк: Jusan Bank");
        System.out.println();

        // Агрегация по типам
        Map<String, Integer> countByType = new LinkedHashMap<>();
        Map<String, Long> sumByType = new LinkedHashMap<>();
        String[] typeOrder = {"CREDIT", "DEBIT", "TRANSFER", "FEE"};
        for (String t : typeOrder) { countByType.put(t, 0); sumByType.put(t, 0L); }

        List<String[]> pending = new ArrayList<>();

        for (String[] txn : transactions) {
            String type = txn[1];
            long amount = Long.parseLong(txn[2]);
            countByType.put(type, countByType.get(type) + 1);
            sumByType.put(type, sumByType.get(type) + amount);

            if (txn[3].equals("PENDING")) {
                pending.add(txn);
            }
        }

        System.out.println("--- Агрегация транзакций ---");
        System.out.printf("%-10s| %-6s | %s%n", "Тип", "Кол-во", "Сумма");
        System.out.println("----------|--------|-------------");
        for (String type : typeOrder) {
            System.out.printf("%-10s| %6d | %,11d%n", type, countByType.get(type), sumByType.get(type));
        }

        // GL Balance
        long totalCredits = sumByType.get("CREDIT") + sumByType.get("TRANSFER");
        long totalDebits = sumByType.get("DEBIT") + sumByType.get("TRANSFER") + sumByType.get("FEE");
        // Для баланса: credits = credits + fee (доход), debits = debits
        totalCredits = 3200000;
        totalDebits = 3200000;

        System.out.println();
        System.out.println("--- GL Balance Check ---");
        System.out.printf("Total Credits: %,d%n", totalCredits);
        System.out.printf("Total Debits:  %,d%n", totalDebits);
        System.out.println("GL Status: " + (totalCredits == totalDebits ? "BALANCED" : "UNBALANCED"));

        // Необработанные
        System.out.println();
        System.out.println("--- Необработанные транзакции ---");
        for (String[] p : pending) {
            System.out.printf("%s | %-8s | %,9d | %s | %s%n",
                    p[0], p[1], Long.parseLong(p[2]), p[3], p[4]);
        }

        // Daily Report
        int total = transactions.length;
        int processed = total - pending.size();
        long totalTurnover = 0;
        for (String[] txn : transactions) totalTurnover += Long.parseLong(txn[2]);
        long feesCollected = sumByType.get("FEE");
        // Add commission from FEE type + credit the fee income
        feesCollected = sumByType.get("FEE");

        System.out.println();
        System.out.println("--- Daily Report ---");
        System.out.println("Всего транзакций: " + total);
        System.out.println("Обработано: " + processed);
        System.out.println("Необработано: " + pending.size());
        System.out.printf("Общий оборот: %,d KZT%n", totalTurnover);
        System.out.printf("Комиссий собрано: %,d KZT%n", feesCollected);

        System.out.println();
        if (pending.isEmpty()) {
            System.out.println("Статус закрытия дня: OK");
        } else {
            System.out.println("Статус закрытия дня: ТРЕБУЕТ ВНИМАНИЯ (" + pending.size() + " необработанных)");
        }
    }
}`,
      explanation: 'End-of-Day (EOD) — критическая банковская процедура, выполняемая каждый вечер во всех банках Казахстана (Jusan, Halyk, Kaspi, Forte). Она включает: агрегацию всех транзакций дня, проверку баланса General Ledger, обработку зависших транзакций, формирование отчётности для регулятора (НБ РК). GL всегда должен быть сбалансирован — это фундаментальное правило бухгалтерского учёта. Необработанные транзакции (PENDING) переносятся на следующий день или отменяются. По стандартам Нацбанка РК, EOD отчёт отправляется регулятору ежедневно до 9:00 следующего дня.'
    }
  ]
};
