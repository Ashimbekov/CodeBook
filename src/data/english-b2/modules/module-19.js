export default {
  id: 19,
  title: 'Чтение: RFC и технические стандарты',
  description: 'Как читать и понимать RFC, технические стандарты и спецификации',
  lessons: [
    {
      id: 1,
      title: 'Структура RFC-документа',
      type: 'theory',
      content: [
        { type: 'text', value: 'RFC (Request for Comments) — серия документов, определяющих интернет-протоколы и стандарты. Умение читать RFC открывает доступ к первоисточникам информации о протоколах.' },
        { type: 'heading', value: 'Стандартные секции RFC' },
        { type: 'list', items: [
          'Abstract: краткое описание документа',
          'Status of This Memo: статус и область применения',
          'Table of Contents: оглавление',
          'Introduction: контекст и мотивация',
          'Conventions Used in This Document: объяснение ключевых слов MUST/SHOULD/MAY',
          'Specification: основное содержание',
          'Security Considerations: обязательная секция для всех RFC',
          'References: нормативные и информационные ссылки'
        ]},
        { type: 'heading', value: 'Типы RFC' },
        { type: 'text', value: '"Standards Track: предназначен стать стандартом интернета (Proposed Standard → Draft Standard → Internet Standard)"\n"Informational: описательный, не является стандартом"\n"Experimental: экспериментальная технология"\n"Best Current Practice (BCP): операционные рекомендации"' },
        { type: 'tip', value: 'Начните с RFC 793 (TCP), RFC 2616 (HTTP/1.1), RFC 7540 (HTTP/2). Они хорошо структурированы и дают понимание стиля написания всех RFC.' }
      ]
    },
    {
      id: 2,
      title: 'RFC-лексика и специальные конструкции',
      type: 'theory',
      content: [
        { type: 'text', value: 'RFC использует специфическую лексику и грамматические конструкции, отличающие их от обычных технических текстов.' },
        { type: 'heading', value: 'RFC 2119 ключевые слова в действии' },
        { type: 'text', value: '"The server MUST respond with a 200 OK status code upon successful authentication."\n"Implementations SHOULD use TLS 1.3 but MAY support TLS 1.2 for backwards compatibility."\n"The \'algorithm\' field MUST NOT be absent from the header."' },
        { type: 'heading', value: 'Грамматические паттерны' },
        { type: 'text', value: '"The key words... are to be interpreted as described in RFC 2119."\n"This document is subject to the rights, licenses and restrictions contained in BCP 78."\n"Compliant implementations are those that satisfy all MUST and MUST NOT requirements."' },
        { type: 'heading', value: 'Технические определения в RFC' },
        { type: 'text', value: '"The following terms are used throughout this document:"\n"For the purposes of this document, X is defined as..."\n"An \'endpoint\' is a pair consisting of an IP address and port number."\n"The term \'session\' refers to a persistent connection between a client and server."' }
      ]
    },
    {
      id: 3,
      title: 'Чтение RFC 7230: HTTP/1.1 Syntax',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разберём реальные фрагменты RFC для понимания HTTP.' },
        { type: 'heading', value: 'Из RFC 7230 (HTTP/1.1 Message Syntax and Routing)' },
        { type: 'text', value: 'Original RFC text:\n"An HTTP/1.1 server SHOULD send a response containing a Content-Length header field in a number of cases where this is possible and not prohibited by the status code\'s definition... A server MUST NOT send a message body in response to a HEAD request."\n\nИнтерпретация: Сервер должен отправлять Content-Length, когда это возможно. Строго запрещено отправлять тело ответа на HEAD-запрос.' },
        { type: 'heading', value: 'ABNF-нотация в RFC' },
        { type: 'text', value: 'RFC часто использует Augmented BNF (ABNF) для точного определения форматов:\n"HTTP-version = HTTP-name "/" DIGIT "." DIGIT"\n"HTTP-name = %s\'HTTP\'"\n\nЭта нотация точно определяет допустимые значения. DIGIT = любая цифра 0-9.' },
        { type: 'tip', value: 'Стратегия чтения RFC: 1) Читайте Abstract и Introduction для контекста. 2) Изучите определения терминов. 3) Читайте основную спецификацию с пониманием MUST/SHOULD/MAY. 4) Уделите внимание Security Considerations.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии чтения технических документов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эффективное чтение технических документов требует специальных стратегий.' },
        { type: 'heading', value: 'SQ3R метод для технических текстов' },
        { type: 'text', value: '"Survey: просмотрите структуру, заголовки и abstract перед детальным чтением."\n"Question: сформулируйте вопросы, на которые хотите найти ответ."\n"Read: читайте активно, ища ответы на свои вопросы."\n"Recite: объясните прочитанное своими словами."\n"Review: проверьте понимание, вернувшись к ключевым секциям."' },
        { type: 'heading', value: 'Техники активного чтения' },
        { type: 'text', value: '"Note taking while reading: записывайте ключевые определения и требования."\n"Annotating: помечайте MUST, SHOULD, MAY в полях."\n"Implementation notes: записывайте, что нужно реализовать."\n"Cross-referencing: следите за ссылками на другие RFC и разделы."' },
        { type: 'heading', value: 'Работа с незнакомыми терминами' },
        { type: 'text', value: '"Don\'t stop on every unknown term — often it is defined later in the document."\n"Use the glossary or definitions section first."\n"Technical terms are often hyperlinked in online versions."\n"When a term appears in quotes first time, it\'s being defined."' }
      ]
    },
    {
      id: 5,
      title: 'OpenAPI/Swagger и другие технические спецификации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо RFC, в IT встречаются другие форматы технических спецификаций.' },
        { type: 'heading', value: 'OpenAPI Specification' },
        { type: 'text', value: '"The OpenAPI Specification (OAS) defines a standard, language-agnostic interface for RESTful APIs."\n"An OpenAPI document contains: info, servers, paths, components, and security."\n"The \'required\' field lists mandatory request parameters."\n"The \'schema\' object defines the structure of request and response bodies."' },
        { type: 'heading', value: 'Чтение API-документации' },
        { type: 'text', value: '"Endpoint: a specific URL that accepts requests."\n"Path parameters vs. query parameters vs. request body."\n"Status codes and their meanings in the API context."\n"Rate limiting headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After."' },
        { type: 'heading', value: 'W3C и другие стандарты' },
        { type: 'text', value: '"W3C (World Wide Web Consortium) publishes web standards."\n"Normative vs. informative sections: normative sections MUST be followed; informative are explanatory."\n"Errata: corrections to published specifications — always check for errata before implementing."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: анализ RFC-фрагмента',
      type: 'practice',
      difficulty: 'hard',
      description: 'Прочитайте фрагмент RFC и ответьте на вопросы.',
      requirements: [
        'Определите обязательные и рекомендательные требования',
        'Объясните смысл своими словами',
        'Определите влияние на реализацию'
      ],
      questions: [
        { text: 'RFC 7540 (HTTP/2) fragment:\n"A server MUST NOT send a PUSH_PROMISE frame if it receives a SETTINGS_ENABLE_PUSH setting value of 0. A client that receives a PUSH_PROMISE frame after having set SETTINGS_ENABLE_PUSH to 0 MUST treat this as a stream error of type PROTOCOL_ERROR."\n\nQuestions:\n1. What MUST the server not do?\n2. What MUST the client do in the described scenario?\n3. What type of error is specified?', answer: '1. The server MUST NOT send a PUSH_PROMISE frame to a client that has explicitly disabled server push by setting SETTINGS_ENABLE_PUSH to 0.\n2. If a client receives a PUSH_PROMISE frame despite having disabled server push, it MUST treat this as a protocol-level error — specifically, a stream error of type PROTOCOL_ERROR. This means the client should send an RST_STREAM or GOAWAY frame with the PROTOCOL_ERROR error code.\n3. The specified error type is a stream error (not a connection error) of type PROTOCOL_ERROR.', explanation: 'RFC чтение требует точного понимания MUST/MUST NOT. Каждое из этих слов имеет строгое техническое значение, и неправильная реализация приводит к нарушению протокола.' }
      ],
      solution: 'Правильные ответы:\n1. 1. The server MUST NOT send a PUSH_PROMISE frame to a client that has explicitly disabled server push by setting SETTINGS_ENABLE_PUSH to 0.',
      hint: 'Подчёркивайте каждое MUST, MUST NOT, SHOULD. Для каждого: кто субъект действия, что он должен/не должен делать, при каком условии.',
      explanation: 'Чтение RFC — essential skill для разработчиков, работающих с сетевыми протоколами, HTTP, security. Умение точно интерпретировать нормативные требования предотвращает нарушения стандартов в реализации.'
    },
    {
      id: 7,
      title: 'Практика: имплементационный чеклист из RFC',
      type: 'practice',
      difficulty: 'medium',
      description: 'На основе RFC-фрагмента создайте чеклист для имплементации.',
      requirements: [
        'Выделите все MUST, MUST NOT, SHOULD, MAY',
        'Создайте чеклист с приоритетами',
        'Добавьте комментарии о потенциальных сложностях'
      ],
      hint: 'Форматируйте как: "[ ] CRITICAL: ...", "[ ] RECOMMENDED: ...", "[ ] OPTIONAL: ..."',
      solution: 'Implementation Checklist from RFC 7540 (HTTP/2) - Header Compression:\n\n[ ] CRITICAL (MUST): Implement header compression using HPACK (RFC 7541) — all HTTP/2 headers must be compressed.\n[ ] CRITICAL (MUST NOT): Never use Huffman encoding where it increases size — if encoding is larger, use literal.\n[ ] CRITICAL (MUST): Maintain a header compression context per connection — not per stream.\n[ ] RECOMMENDED (SHOULD): Keep frequently used headers in the dynamic table for efficient reuse.\n[ ] RECOMMENDED (SHOULD NOT): Do not transmit the same header value in both static and dynamic tables simultaneously.\n[ ] OPTIONAL (MAY): Implement Huffman encoding for additional size reduction.\n\nImplementation Notes:\n- The static table (61 entries) is fixed and predefined — do not modify.\n- The dynamic table size is negotiated via SETTINGS_HEADER_TABLE_SIZE.\n- Potential issue: improper context synchronisation can cause decompression failures, crashing the connection.',
      explanation: 'Преобразование RFC в имплементационный чеклист — практический навык, который экономит время при разработке. Чёткое разграничение MUST/SHOULD/MAY позволяет правильно приоритизировать работу.'
    }
  ]
}
