export default {
  id: 4,
  title: 'Сложные пассивные конструкции',
  description: 'Продвинутые пассивные конструкции для технических текстов и формального общения',
  lessons: [
    {
      id: 1,
      title: 'Пассивный залог: обзор и нюансы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В технических текстах пассивный залог используется очень активно. В IT-документации, RFC, научных статьях и отчётах пассив позволяет сосредоточиться на действии, а не на исполнителе.' },
        { type: 'heading', value: 'Когда использовать пассив в IT' },
        { type: 'list', items: [
          'Когда исполнитель неважен или неизвестен: "The data is encrypted before transmission."',
          'Для описания процессов и систем: "Requests are processed asynchronously."',
          'В официальных документах: "The API was designed to be RESTful."',
          'Когда хотим избежать обвинений: "The bug was introduced during the last refactoring."',
          'В научных статьях: "The algorithm was evaluated on three benchmark datasets."'
        ]},
        { type: 'heading', value: 'Пассив во всех временах' },
        { type: 'text', value: 'Present Simple: "The service is deployed via Kubernetes."\nPast Simple: "The database was migrated to PostgreSQL."\nPresent Perfect: "The configuration has been updated."\nFuture: "The API will be deprecated in version 3.0."\nPresent Continuous: "The system is being upgraded." \nPast Continuous: "The data was being processed when the crash occurred."' },
        { type: 'tip', value: 'В IT-документации английских компаний пассив используется намного чаще, чем в русской технической литературе. Привыкайте к нему — это признак профессионального технического письма.' }
      ]
    },
    {
      id: 2,
      title: 'Двойной пассив и get-пассив',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо стандартного be + Past Participle, существуют другие пассивные конструкции.' },
        { type: 'heading', value: 'Get-пассив — неформальный, подчёркивает изменение состояния' },
        { type: 'text', value: '"The server got overloaded during peak hours." (неожиданно перегрузилось)\n"The PR got rejected because of missing tests." (отвергли — акцент на результате)\n"Files can get corrupted during improper shutdown." (могут быть повреждены)' },
        { type: 'heading', value: 'Причинный пассив: have/get something done' },
        { type: 'text', value: '"We had the security audit conducted by an external firm." (заказали — кто-то другой сделал)\n"You should get the code reviewed before merging." (нужно сделать так, чтобы проверили)\n"The company had its infrastructure penetration-tested annually."' },
        { type: 'heading', value: 'Reporting verbs + пассив' },
        { type: 'text', value: '"It is reported that the service experiences 99.99% uptime." (формальный стиль)\n"The framework is said to be more performant than its competitors."\n"The vulnerability is believed to affect versions prior to 2.3.1."' },
        { type: 'tip', value: '"It is believed/reported/expected that..." — стандартные конструкции в технических отчётах и RFC-документах для дистанцирования от утверждений.' }
      ]
    },
    {
      id: 3,
      title: 'Пассив с модальными глаголами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сочетание модальных глаголов с пассивом очень распространено в технической документации.' },
        { type: 'heading', value: 'Настоящее/будущее: modal + be + Past Participle' },
        { type: 'text', value: '"The data must be encrypted at rest and in transit."\n"All API endpoints should be documented using OpenAPI spec."\n"Credentials cannot be stored in plain text."\n"The service can be scaled horizontally to handle increased load."\n"The configuration may be overridden via environment variables."' },
        { type: 'heading', value: 'Прошлое: modal + have been + Past Participle' },
        { type: 'text', value: '"The file must have been corrupted during the transfer." (вывод)\n"The configuration should have been updated before deployment." (упрёк)\n"The bug could have been prevented by proper input validation." (возможность)\n"The alert might have been triggered by a false positive." (предположение)' },
        { type: 'tip', value: 'В IT-анализе инцидентов modal + have been + Past Participle незаменимо:\n"The incident could have been avoided if monitoring had been in place."\n"The data should have been backed up before the migration."' }
      ]
    },
    {
      id: 4,
      title: 'Пассивные причастные обороты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пассивные причастные обороты позволяют сжимать информацию в технических текстах.' },
        { type: 'heading', value: 'Past Participle в начале предложения' },
        { type: 'text', value: '"Written in Go, the service handles thousands of concurrent connections."\n(= Because it was written in Go...)\n\n"Deployed in a containerised environment, the application can be scaled effortlessly."\n(= Since it is deployed in a containerised environment...)\n\n"Designed with backwards compatibility in mind, the API supports clients from version 1.0."' },
        { type: 'heading', value: 'Reduced relative clauses (пассив)' },
        { type: 'text', value: '"The data stored in Redis has a TTL of 24 hours."\n(= The data that is stored in Redis...)\n\n"The logs generated by the service are forwarded to Elasticsearch."\n(= The logs that are generated...)\n\n"Any request made without a valid token will return 401."' },
        { type: 'tip', value: 'Пассивные причастные обороты экономят слова и делают текст более профессиональным. Они очень распространены в API-документации и технических статьях.' }
      ]
    },
    {
      id: 5,
      title: 'Безличные конструкции в технических текстах',
      type: 'theory',
      content: [
        { type: 'text', value: 'В техническом английском часто избегают личных местоимений, используя безличные конструкции.' },
        { type: 'heading', value: 'It + пассив + that-clause' },
        { type: 'text', value: '"It is recommended that all services implement health check endpoints."\n"It should be noted that this feature is still experimental."\n"It is assumed that the reader is familiar with REST principles."\n"It has been confirmed that the vulnerability has been patched."' },
        { type: 'heading', value: 'There + be + пассив' },
        { type: 'text', value: '"There have been numerous improvements made to the query optimizer."\n"There are two approaches commonly used for this problem."' },
        { type: 'heading', value: 'Существительное + пассив' },
        { type: 'text', value: '"Approval is required before merging to main."\n"Authentication is handled by the middleware layer."\n"Further investigation is needed to determine the root cause."' },
        { type: 'note', value: '"It is recommended that..." — одна из самых частых конструкций в RFC. Все RFC (Request for Comments — стандарты интернет-протоколов) используют специальные слова: MUST, SHOULD, MAY, SHALL — их обязательно читать как технические термины.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: технические инструкции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепишите предложения в пассивном залоге для технической документации.',
      requirements: [
        'Используйте подходящий тип пассива',
        'Сохраните смысл предложения',
        'Добавьте "by + agent" только если исполнитель важен'
      ],
      questions: [
        { text: 'The team must encrypt all user data before storing it in the database.\n→ All user data ___', answer: 'All user data must be encrypted before being stored in the database.', explanation: 'Modal passive: must be + past participle; second verb also becomes passive with "being"' },
        { text: 'We wrote this module in Rust for performance reasons.\n→ This module ___', answer: 'This module was written in Rust for performance reasons.', explanation: 'Past Simple passive; "by us" опускается как неважное' },
        { text: 'Someone had corrupted the data before we noticed.\n→ The data ___', answer: 'The data had been corrupted before we noticed.', explanation: 'Past Perfect passive; исполнитель неизвестен' }
      ],
      solution: 'Правильные ответы:\n1. All user data must be encrypted before being stored in the database.\n2. This module was written in Rust for performance reasons.\n3. The data had been corrupted before we noticed.',
      hint: 'Структура пассива: be (в нужном времени) + Past Participle. Для модальных глаголов: modal + be + Past Participle.',
      explanation: 'Пассивный залог — основа технического письма. В API-документации, RFC и отчётах он позволяет сфокусироваться на системе и процессах, а не на исполнителях.'
    },
    {
      id: 7,
      title: 'Практика: написание API-документации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите краткую документацию для API-эндпоинта, используя разные пассивные конструкции.',
      requirements: [
        'Используйте минимум 5 пассивных конструкций',
        'Включите: модальный пассив, причастный оборот, reporting verb',
        'Документируйте эндпоинт POST /api/users'
      ],
      hint: 'Начните с описания назначения, затем параметры, аутентификация, ответы, ошибки.',
      solution: 'POST /api/users\n\nThis endpoint is used to create a new user account. All requests must be authenticated using a Bearer token. The request body must be provided in JSON format.\n\nRequired fields: email, password, and role. It is recommended that passwords be validated against the defined strength policy before submission. The email address must be verified before the account can be activated.\n\nUpon successful creation, a 201 status code is returned along with the created user object. The password is never returned in the response. It is assumed that the client will store the returned user ID for subsequent requests.\n\nErrors: If the email address has already been registered, a 409 Conflict response will be returned. Malformed requests will be rejected with a 400 Bad Request status.',
      explanation: 'Профессиональная API-документация почти полностью написана в пассиве. Это стандарт в индустрии, который делает документацию нейтральной и ориентированной на систему, а не на пользователя или разработчика.'
    }
  ]
}
