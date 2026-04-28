export default {
  id: 7,
  title: 'RBAC: Role-Based Access Control',
  description: 'Роли, разрешения, иерархия ролей, динамическое управление доступом и реальные примеры RBAC',
  lessons: [
    {
      id: 1,
      title: 'Что такое RBAC?',
      type: 'theory',
      content: [
        { type: 'text', value: 'RBAC (Role-Based Access Control) -- это модель управления доступом, где разрешения назначаются ролям, а роли -- пользователям. Пользователь получает права через свою роль, а не напрямую.' },
        { type: 'tip', value: 'RBAC как в компании: стажёр может читать документы, разработчик -- писать код, тимлид -- управлять командой, директор -- всё. Ты не раздаёшь каждому сотруднику 100 прав по отдельности -- ты назначаешь роль.' },
        { type: 'heading', value: 'Компоненты RBAC' },
        { type: 'list', items: [
          'User -- пользователь системы',
          'Role -- роль (ADMIN, MANAGER, USER, VIEWER)',
          'Permission -- конкретное разрешение (read:users, write:orders, delete:products)',
          'Assignment -- связь пользователь-роль и роль-разрешение'
        ]},
        { type: 'heading', value: 'Преимущества RBAC' },
        { type: 'list', items: [
          'Простота управления -- изменил роль, а не 100 разрешений для каждого',
          'Аудит -- легко понять, кто что может делать',
          'Compliance -- соответствие требованиям безопасности (SOC2, ISO 27001)',
          'Масштабируемость -- новый сотрудник = назначить роль'
        ]},
        { type: 'code', language: 'java', value: '// Пример RBAC в банковской системе\n// \n// Роли:       Разрешения:\n// CASHIER  -> view_balance, create_deposit, create_withdrawal\n// MANAGER  -> view_balance, create_deposit, create_withdrawal, approve_loan, view_reports\n// AUDITOR  -> view_balance, view_reports, view_audit_log\n// ADMIN    -> все разрешения\n\n// Пользователь \"Айгуль\" -> роль CASHIER\n// Пользователь \"Мурат\"  -> роль MANAGER\n// Пользователь \"Сергей\" -> роль AUDITOR' },
        { type: 'note', value: 'RBAC -- стандарт де-факто в корпоративных приложениях. AWS IAM, Google Cloud IAM, Kubernetes -- все используют RBAC.' }
      ]
    },
    {
      id: 2,
      title: 'Иерархия ролей',
      type: 'theory',
      content: [
        { type: 'text', value: 'В продвинутом RBAC роли могут наследовать друг друга. ADMIN наследует все права MANAGER, MANAGER наследует права USER и т.д.' },
        { type: 'heading', value: 'Типы иерархий' },
        { type: 'list', items: [
          'Flat RBAC -- нет иерархии, каждая роль независима',
          'Hierarchical RBAC -- роли наследуют друг друга',
          'Constrained RBAC -- с ограничениями (SoD: separation of duties)'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Set<String>> rolePermissions = new LinkedHashMap<>();\n    static Map<String, String> roleParent = new HashMap<>(); // role -> parent role\n    \n    public static void main(String[] args) {\n        // Настройка иерархии: ADMIN -> MANAGER -> USER -> VIEWER\n        setupRole("VIEWER", null, "read:articles", "read:profile");\n        setupRole("USER", "VIEWER", "write:comments", "edit:profile");\n        setupRole("MANAGER", "USER", "write:articles", "delete:comments", "view:reports");\n        setupRole("ADMIN", "MANAGER", "manage:users", "manage:roles", "view:audit");\n        \n        System.out.println("=== Иерархия ролей ===\\n");\n        \n        // Показываем все разрешения для каждой роли\n        for (String role : rolePermissions.keySet()) {\n            Set<String> allPerms = getAllPermissions(role);\n            String parent = roleParent.get(role);\n            System.out.println(role + (parent != null ? " (наследует " + parent + ")" : "") + ":");\n            System.out.println("  Собственные: " + rolePermissions.get(role));\n            System.out.println("  Все права:   " + allPerms);\n            System.out.println("  Всего: " + allPerms.size() + " разрешений\\n");\n        }\n    }\n    \n    static void setupRole(String role, String parent, String... permissions) {\n        rolePermissions.put(role, new LinkedHashSet<>(Arrays.asList(permissions)));\n        if (parent != null) roleParent.put(role, parent);\n    }\n    \n    static Set<String> getAllPermissions(String role) {\n        Set<String> all = new LinkedHashSet<>();\n        String current = role;\n        while (current != null) {\n            all.addAll(rolePermissions.getOrDefault(current, Collections.emptySet()));\n            current = roleParent.get(current);\n        }\n        return all;\n    }\n}' },
        { type: 'tip', value: 'Иерархия ролей экономит время: при создании ADMIN ты не перечисляешь все 50 разрешений заново -- он автоматически наследует всё от MANAGER, который наследует от USER.' },
        { type: 'warning', value: 'Будь осторожен с глубокой иерархией! Если SUPER_ADMIN наследует от 5 ролей, каждая из которых наследует ещё от 3 -- отследить реальные права становится очень сложно.' }
      ]
    },
    {
      id: 3,
      title: 'Separation of Duties (SoD)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Separation of Duties (SoD) -- принцип разделения обязанностей. Некоторые роли НЕЛЬЗЯ совмещать. Например, кто создаёт платёж, не должен его одобрять.' },
        { type: 'heading', value: 'Примеры SoD' },
        { type: 'list', items: [
          'Банкинг: создатель платежа != одобряющий платёж',
          'Бухгалтерия: кто выписывает чек != кто его подписывает',
          'IT: разработчик != reviewer (code review)',
          'Склад: кто принимает товар != кто проверяет инвентаризацию'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Конфликтующие роли (нельзя совмещать)\n    static List<String[]> conflicts = new ArrayList<>();\n    static Map<String, Set<String>> userRoles = new HashMap<>();\n    \n    public static void main(String[] args) {\n        // Определяем конфликты\n        conflicts.add(new String[]{"PAYMENT_CREATOR", "PAYMENT_APPROVER"});\n        conflicts.add(new String[]{"DEVELOPER", "DEPLOYER"});\n        conflicts.add(new String[]{"AUDITOR", "ADMIN"});\n        \n        System.out.println("=== Separation of Duties ===\\n");\n        \n        // Назначаем роли\n        assignRole("Айгуль", "PAYMENT_CREATOR");\n        assignRole("Айгуль", "PAYMENT_APPROVER"); // конфликт!\n        \n        System.out.println();\n        \n        assignRole("Мурат", "DEVELOPER");\n        assignRole("Мурат", "TESTER"); // ок\n        assignRole("Мурат", "DEPLOYER"); // конфликт!\n        \n        System.out.println();\n        \n        assignRole("Сергей", "AUDITOR");\n        assignRole("Сергей", "VIEWER"); // ок\n        assignRole("Сергей", "ADMIN"); // конфликт!\n        \n        // Итоговые роли\n        System.out.println("\\n=== Итоговые роли ===");\n        for (Map.Entry<String, Set<String>> e : userRoles.entrySet()) {\n            System.out.println(e.getKey() + ": " + e.getValue());\n        }\n    }\n    \n    static boolean assignRole(String user, String newRole) {\n        Set<String> currentRoles = userRoles.computeIfAbsent(user, k -> new LinkedHashSet<>());\n        \n        // Проверяем конфликты\n        for (String[] conflict : conflicts) {\n            String role1 = conflict[0];\n            String role2 = conflict[1];\n            if (newRole.equals(role1) && currentRoles.contains(role2) ||\n                newRole.equals(role2) && currentRoles.contains(role1)) {\n                System.out.println("ЗАПРЕЩЕНО: " + user + " не может быть " + newRole + \n                    " (конфликт с " + (newRole.equals(role1) ? role2 : role1) + ")");\n                return false;\n            }\n        }\n        \n        currentRoles.add(newRole);\n        System.out.println("OK: " + user + " -> " + newRole);\n        return true;\n    }\n}' },
        { type: 'note', value: 'SoD -- обязательное требование в финансовых системах (SOX compliance). В Kaspi и Halyk Bank создатель платежа и одобряющий -- всегда разные люди. Это предотвращает мошенничество.' }
      ]
    },
    {
      id: 4,
      title: 'RBAC с ресурсами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Продвинутый RBAC проверяет не только роль, но и принадлежность ресурса. Пользователь может редактировать только СВОИ статьи, а ADMIN -- любые.' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static Map<String, String> userRoles = new HashMap<>();\n    static Map<String, String> articleOwners = new HashMap<>(); // articleId -> ownerId\n    \n    public static void main(String[] args) {\n        // Настройка\n        userRoles.put("alice", "USER");\n        userRoles.put("bob", "USER");\n        userRoles.put("admin", "ADMIN");\n        userRoles.put("moderator", "MODERATOR");\n        \n        articleOwners.put("article-1", "alice");\n        articleOwners.put("article-2", "bob");\n        \n        System.out.println("=== RBAC с ресурсами ===\\n");\n        \n        // Alice -- свои статьи\n        checkAccess("alice", "READ", "article-1");\n        checkAccess("alice", "EDIT", "article-1");  // своя -- ОК\n        checkAccess("alice", "EDIT", "article-2");  // чужая -- ОТКАЗ\n        checkAccess("alice", "DELETE", "article-1"); // USER не может удалять\n        \n        System.out.println();\n        \n        // Admin -- любые статьи\n        checkAccess("admin", "READ", "article-1");\n        checkAccess("admin", "EDIT", "article-2");\n        checkAccess("admin", "DELETE", "article-1");\n        \n        System.out.println();\n        \n        // Moderator -- может редактировать, но не удалять\n        checkAccess("moderator", "READ", "article-1");\n        checkAccess("moderator", "EDIT", "article-2");\n        checkAccess("moderator", "DELETE", "article-2");\n    }\n    \n    static void checkAccess(String userId, String action, String resourceId) {\n        String role = userRoles.getOrDefault(userId, "GUEST");\n        String owner = articleOwners.get(resourceId);\n        boolean isOwner = userId.equals(owner);\n        \n        boolean allowed = false;\n        String reason = "";\n        \n        switch (role) {\n            case "ADMIN":\n                allowed = true;\n                reason = "ADMIN может всё";\n                break;\n            case "MODERATOR":\n                allowed = "READ".equals(action) || "EDIT".equals(action);\n                reason = allowed ? "MODERATOR: read/edit" : "MODERATOR не может " + action;\n                break;\n            case "USER":\n                if ("READ".equals(action)) {\n                    allowed = true;\n                    reason = "чтение разрешено всем";\n                } else if ("EDIT".equals(action) && isOwner) {\n                    allowed = true;\n                    reason = "владелец ресурса";\n                } else {\n                    reason = isOwner ? "USER не может " + action : "не владелец";\n                }\n                break;\n            default:\n                reason = "неизвестная роль";\n        }\n        \n        System.out.println(userId + " " + action + " " + resourceId + ": " + \n            (allowed ? "OK" : "ОТКАЗ") + " (" + reason + ")");\n    }\n}' },
        { type: 'tip', value: 'Это называется Resource-Based Access Control или ABAC (Attribute-Based Access Control). В реальных приложениях проверяется: роль + владение ресурсом + статус ресурса + время и другие атрибуты.' },
        { type: 'note', value: 'В GitHub: ты можешь редактировать свои репозитории (owner), collaborator может пушить (по приглашению), а GitHub Staff (admin) может управлять любым репозиторием.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Полная RBAC система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай RBAC систему с иерархией ролей, назначением пользователям и проверкой доступа к ресурсам.',
      requirements: [
        'Создай класс Main с методом main',
        'Иерархия ролей: ADMIN -> EDITOR -> VIEWER',
        'VIEWER: read. EDITOR: read, write. ADMIN: read, write, delete, manage',
        'Назначение ролей пользователям',
        'Проверка доступа для каждого пользователя к каждому действию'
      ],
      expectedOutput: 'viewer (VIEWER): read=true, write=false, delete=false, manage=false\neditor (EDITOR): read=true, write=true, delete=false, manage=false\nadmin (ADMIN): read=true, write=true, delete=true, manage=true',
      hint: 'Используй Map для иерархии (role -> parentRole) и рекурсивно собирай все permissions.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Set<String>> rolePerms = new LinkedHashMap<>();\n    static Map<String, String> roleParent = new HashMap<>();\n    static Map<String, String> userRoles = new LinkedHashMap<>();\n    \n    public static void main(String[] args) {\n        // Иерархия ролей\n        addRole("VIEWER", null, "read");\n        addRole("EDITOR", "VIEWER", "write");\n        addRole("ADMIN", "EDITOR", "delete", "manage");\n        \n        // Назначение пользователям\n        userRoles.put("viewer", "VIEWER");\n        userRoles.put("editor", "EDITOR");\n        userRoles.put("admin", "ADMIN");\n        \n        // Проверка доступа\n        String[] actions = {"read", "write", "delete", "manage"};\n        for (Map.Entry<String, String> user : userRoles.entrySet()) {\n            StringBuilder sb = new StringBuilder();\n            sb.append(user.getKey()).append(" (").append(user.getValue()).append("): ");\n            List<String> results = new ArrayList<>();\n            for (String action : actions) {\n                results.add(action + "=" + hasPermission(user.getKey(), action));\n            }\n            sb.append(String.join(", ", results));\n            System.out.println(sb.toString());\n        }\n    }\n    \n    static void addRole(String role, String parent, String... perms) {\n        rolePerms.put(role, new HashSet<>(Arrays.asList(perms)));\n        if (parent != null) roleParent.put(role, parent);\n    }\n    \n    static boolean hasPermission(String userId, String permission) {\n        String role = userRoles.get(userId);\n        if (role == null) return false;\n        return getAllPerms(role).contains(permission);\n    }\n    \n    static Set<String> getAllPerms(String role) {\n        Set<String> all = new HashSet<>();\n        String current = role;\n        while (current != null) {\n            all.addAll(rolePerms.getOrDefault(current, Collections.emptySet()));\n            current = roleParent.get(current);\n        }\n        return all;\n    }\n}',
      explanation: 'RBAC с иерархией: VIEWER имеет только read, EDITOR наследует read от VIEWER и добавляет write, ADMIN наследует всё от EDITOR и добавляет delete и manage. getAllPerms рекурсивно собирает разрешения вверх по иерархии. Это стандартная модель для CMS, админ-панелей и корпоративных систем.'
    },
    {
      id: 6,
      title: 'Практика: Динамическое управление ролями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему динамического управления ролями: создание ролей, назначение пользователям, изменение permissions в runtime.',
      requirements: [
        'Создай класс Main с методом main',
        'Метод createRole: создание роли с набором разрешений',
        'Метод assignRole: назначение роли пользователю',
        'Метод addPermission: добавление разрешения к роли',
        'Метод removePermission: удаление разрешения из роли',
        'Изменения ролей мгновенно влияют на всех пользователей с этой ролью'
      ],
      expectedOutput: 'Создана роль SUPPORT: [read_tickets, reply_tickets]\nuser1 -> SUPPORT\nuser1 может read_tickets: true\nuser1 может close_tickets: false\nДобавлено close_tickets в SUPPORT\nuser1 может close_tickets: true\nУдалено reply_tickets из SUPPORT\nuser1 может reply_tickets: false',
      hint: 'При проверке прав всегда обращайся к текущему состоянию роли -- тогда изменения автоматически применятся ко всем пользователям.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Set<String>> roles = new LinkedHashMap<>();\n    static Map<String, Set<String>> userRoleAssignments = new LinkedHashMap<>();\n    \n    public static void main(String[] args) {\n        // Создание ролей\n        createRole("SUPPORT", "read_tickets", "reply_tickets");\n        createRole("MANAGER", "read_tickets", "reply_tickets", "close_tickets", "assign_tickets");\n        System.out.println("Создана роль SUPPORT: " + roles.get("SUPPORT"));\n        \n        // Назначение\n        assignRole("user1", "SUPPORT");\n        assignRole("user2", "SUPPORT");\n        assignRole("manager1", "MANAGER");\n        System.out.println("user1 -> SUPPORT");\n        \n        // Проверка\n        System.out.println("user1 может read_tickets: " + hasPermission("user1", "read_tickets"));\n        System.out.println("user1 может close_tickets: " + hasPermission("user1", "close_tickets"));\n        \n        // Динамическое добавление разрешения\n        addPermission("SUPPORT", "close_tickets");\n        System.out.println("\\nДобавлено close_tickets в SUPPORT");\n        System.out.println("user1 может close_tickets: " + hasPermission("user1", "close_tickets"));\n        System.out.println("user2 может close_tickets: " + hasPermission("user2", "close_tickets"));\n        \n        // Динамическое удаление разрешения\n        removePermission("SUPPORT", "reply_tickets");\n        System.out.println("\\nУдалено reply_tickets из SUPPORT");\n        System.out.println("user1 может reply_tickets: " + hasPermission("user1", "reply_tickets"));\n        System.out.println("user2 может reply_tickets: " + hasPermission("user2", "reply_tickets"));\n        \n        // Manager не затронут\n        System.out.println("\\nmanager1 может reply_tickets: " + hasPermission("manager1", "reply_tickets"));\n        System.out.println("manager1 может close_tickets: " + hasPermission("manager1", "close_tickets"));\n    }\n    \n    static void createRole(String role, String... perms) {\n        roles.put(role, new LinkedHashSet<>(Arrays.asList(perms)));\n    }\n    \n    static void assignRole(String user, String role) {\n        userRoleAssignments.computeIfAbsent(user, k -> new LinkedHashSet<>()).add(role);\n    }\n    \n    static void addPermission(String role, String permission) {\n        Set<String> perms = roles.get(role);\n        if (perms != null) perms.add(permission);\n    }\n    \n    static void removePermission(String role, String permission) {\n        Set<String> perms = roles.get(role);\n        if (perms != null) perms.remove(permission);\n    }\n    \n    static boolean hasPermission(String user, String permission) {\n        Set<String> userRoles = userRoleAssignments.get(user);\n        if (userRoles == null) return false;\n        for (String role : userRoles) {\n            Set<String> perms = roles.get(role);\n            if (perms != null && perms.contains(permission)) return true;\n        }\n        return false;\n    }\n}',
      explanation: 'Динамический RBAC: изменения ролей мгновенно влияют на всех пользователей, потому что hasPermission всегда проверяет текущее состояние роли. addPermission/removePermission изменяют Set разрешений роли, и все пользователи с этой ролью автоматически получают/теряют права. Это подход, используемый в admin-панелях.'
    },
    {
      id: 7,
      title: 'Практика: RBAC в API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй RBAC-систему для REST API: каждый endpoint требует определённые роли/permissions.',
      requirements: [
        'Создай класс Main с методом main',
        'Определи API endpoints с требуемыми ролями/permissions',
        'Middleware проверки доступа перед обработкой запроса',
        'Поддержка @RequireRole и @RequirePermission',
        'Протестируй с разными пользователями и endpoints'
      ],
      expectedOutput: 'GET /api/users (viewer): 200 OK\nPOST /api/users (viewer): 403 Forbidden\nPOST /api/users (admin): 200 OK\nDELETE /api/users/1 (editor): 403 Forbidden\nDELETE /api/users/1 (admin): 200 OK',
      hint: 'Создай Map<String, String[]> для хранения требований к каждому endpoint (required role/permission).',
      solution: 'import java.util.*;\n\npublic class Main {\n    // RBAC config\n    static Map<String, Set<String>> rolePerms = new HashMap<>();\n    static Map<String, String> roleParent = new HashMap<>();\n    static Map<String, String> userRoles = new HashMap<>();\n    \n    // API config: endpoint -> required permission\n    static Map<String, String> endpointPerms = new LinkedHashMap<>();\n    \n    public static void main(String[] args) {\n        // Setup roles\n        rolePerms.put("VIEWER", new HashSet<>(Arrays.asList("users:read", "articles:read")));\n        rolePerms.put("EDITOR", new HashSet<>(Arrays.asList("users:read", "articles:read", "articles:write", "users:write")));\n        rolePerms.put("ADMIN", new HashSet<>(Arrays.asList("users:read", "users:write", "users:delete", "articles:read", "articles:write", "articles:delete", "admin:panel")));\n        \n        // Setup users\n        userRoles.put("viewer", "VIEWER");\n        userRoles.put("editor", "EDITOR");\n        userRoles.put("admin", "ADMIN");\n        \n        // Setup API endpoints\n        endpointPerms.put("GET /api/users", "users:read");\n        endpointPerms.put("POST /api/users", "users:write");\n        endpointPerms.put("DELETE /api/users/1", "users:delete");\n        endpointPerms.put("GET /api/articles", "articles:read");\n        endpointPerms.put("POST /api/articles", "articles:write");\n        endpointPerms.put("GET /api/admin/panel", "admin:panel");\n        \n        // Test access\n        String[] users = {"viewer", "editor", "admin"};\n        for (String endpoint : endpointPerms.keySet()) {\n            for (String user : users) {\n                handleRequest(user, endpoint);\n            }\n            System.out.println();\n        }\n    }\n    \n    static void handleRequest(String userId, String endpoint) {\n        String requiredPerm = endpointPerms.get(endpoint);\n        if (requiredPerm == null) {\n            System.out.println(endpoint + " (" + userId + "): 404 Not Found");\n            return;\n        }\n        \n        String role = userRoles.get(userId);\n        if (role == null) {\n            System.out.println(endpoint + " (" + userId + "): 401 Unauthorized");\n            return;\n        }\n        \n        Set<String> perms = rolePerms.getOrDefault(role, Collections.emptySet());\n        if (!perms.contains(requiredPerm)) {\n            System.out.println(endpoint + " (" + userId + "): 403 Forbidden (нужно: " + requiredPerm + ")");\n            return;\n        }\n        \n        System.out.println(endpoint + " (" + userId + "): 200 OK");\n    }\n}',
      explanation: 'Мы создали RBAC для REST API: каждый endpoint требует определённое разрешение (users:read, users:write, etc.). Middleware handleRequest проверяет: 1) аутентифицирован ли пользователь (401), 2) имеет ли его роль нужное разрешение (403), 3) если всё ОК -- обрабатывает запрос (200). Формат permissions "ресурс:действие" -- стандарт в API-разработке.'
    }
  ]
}
