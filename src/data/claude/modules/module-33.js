export default {
  id: 33,
  title: 'Streaming ответов',
  description: 'Учимся получать ответы Claude в режиме потока (streaming): зачем это нужно, как обрабатывать события стрима, интегрировать стриминг в веб-приложения и обрабатывать ошибки.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен стриминг',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Проблема ожидания и её решение'
        },
        {
          type: 'text',
          value: 'Без стриминга пользователь ждёт полного ответа перед отображением. Для длинных ответов это может занять 10-30 секунд. Стриминг позволяет показывать текст по мере генерации — пользователь видит первые слова уже через долю секунды.'
        },
        {
          type: 'list',
          value: 'Улучшенный UX: пользователь видит прогресс, а не пустой экран\nВосприятие скорости: приложение кажется быстрее, хотя общее время такое же\nРанняя отмена: можно прервать генерацию, если ответ пошёл не туда\nОбработка по частям: можно начать обработку текста до полного получения'
        },
        {
          type: 'text',
          value: 'Технически стриминг работает через Server-Sent Events (SSE) — стандартный веб-протокол для однонаправленной передачи данных от сервера к клиенту по HTTP. Claude отправляет токены по мере их генерации.'
        },
        {
          type: 'note',
          value: 'Стриминг не ускоряет саму генерацию — Claude генерирует токены с той же скоростью. Разница только в том, когда пользователь видит результат: сразу или после полной генерации.'
        }
      ]
    },
    {
      id: 2,
      title: 'stream=True в Python',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Включение стриминга через контекстный менеджер'
        },
        {
          type: 'text',
          value: 'В Python SDK стриминг включается через метод stream() (контекстный менеджер) или через параметр stream=True. Рекомендуемый способ — контекстный менеджер, он автоматически закрывает соединение.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Способ 1: контекстный менеджер (рекомендуется)\nprint("Ответ: ", end="", flush=True)\n\nwith client.messages.stream(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Расскажи историю о роботе в 3 предложениях"}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)  # выводим каждый токен сразу\n\nprint()  # перевод строки в конце\nprint("Стриминг завершён!")'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\n# Способ 2: get_final_message() для получения полного ответа\nwith client.messages.stream(\n    model="claude-opus-4-5",\n    max_tokens=1024,\n    messages=[{"role": "user", "content": "Напиши функцию на Python для сортировки"}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)\n\n# Получаем финальный объект Message после завершения стрима\nfinal_message = stream.get_final_message()\nprint(f"\\n\\nИтого токенов: {final_message.usage.input_tokens + final_message.usage.output_tokens}")\nprint(f"Причина остановки: {final_message.stop_reason}")'
        },
        {
          type: 'tip',
          value: 'Используйте flush=True при print() во время стриминга. Без этого Python буферизует вывод и текст может появляться большими кусками вместо потока.'
        }
      ]
    },
    {
      id: 3,
      title: 'Обработка событий стрима',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Низкоуровневые события SSE'
        },
        {
          type: 'text',
          value: 'Помимо text_stream, SDK предоставляет доступ к низкоуровневым событиям стрима. Это полезно для точного контроля: отслеживания метаданных, обработки tool_use, логирования.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nwith client.messages.stream(\n    model="claude-opus-4-5",\n    max_tokens=256,\n    messages=[{"role": "user", "content": "Привет!"}]\n) as stream:\n    for event in stream:\n        # Тип события\n        event_type = type(event).__name__\n\n        if hasattr(event, "type"):\n            if event.type == "message_start":\n                print(f"[Старт] ID: {event.message.id}")\n            elif event.type == "content_block_start":\n                print(f"[Блок начат] тип: {event.content_block.type}")\n            elif event.type == "content_block_delta":\n                if hasattr(event.delta, "text"):\n                    print(event.delta.text, end="", flush=True)\n            elif event.type == "content_block_stop":\n                print("\\n[Блок завершён]")\n            elif event.type == "message_delta":\n                print(f"[Дельта] stop_reason: {event.delta.stop_reason}")\n            elif event.type == "message_stop":\n                print("[Сообщение завершено]")'
        },
        {
          type: 'list',
          value: 'message_start: начало сообщения, содержит ID и начальные метаданные\ncontent_block_start: начало блока контента (текст или tool_use)\ncontent_block_delta: порция контента (текст или JSON инструмента)\ncontent_block_stop: конец блока контента\nmessage_delta: изменение статуса сообщения (stop_reason, usage)\nmessage_stop: конец всего сообщения'
        }
      ]
    },
    {
      id: 4,
      title: 'Server-Sent Events',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как работает SSE под капотом'
        },
        {
          type: 'text',
          value: 'SSE (Server-Sent Events) — это веб-стандарт для однонаправленной передачи данных от сервера к клиенту. Соединение остаётся открытым, сервер отправляет события в текстовом формате.'
        },
        {
          type: 'code',
          language: 'bash',
          value: '# Пример SSE-потока от Anthropic API (raw HTTP)\ncurl -X POST https://api.anthropic.com/v1/messages \\\n  -H "x-api-key: $ANTHROPIC_API_KEY" \\\n  -H "anthropic-version: 2023-06-01" \\\n  -H "content-type: application/json" \\\n  -d \'{"model":"claude-opus-4-5","max_tokens":100,"stream":true,"messages":[{"role":"user","content":"Привет"}]}\'\n\n# Ответ будет выглядеть так:\n# event: message_start\n# data: {"type":"message_start","message":{"id":"msg_01...","type":"message",...}}\n#\n# event: content_block_start\n# data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}\n#\n# event: content_block_delta\n# data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Привет"}}\n#\n# event: message_stop\n# data: {"type":"message_stop"}'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\n# Прямое использование низкоуровневого HTTP-стрима\nclient = anthropic.Anthropic()\n\n# raw_stream для прямого доступа к SSE-событиям\nwith client.messages.stream(\n    model="claude-opus-4-5",\n    max_tokens=256,\n    messages=[{"role": "user", "content": "Посчитай до 5"}]\n) as stream:\n    # Доступ к необработанному HTTP-ответу\n    print("HTTP статус:", stream.response.status_code)\n    print("Заголовки:", dict(stream.response.headers))\n\n    # Итерация по тексту\n    full_text = ""\n    for text in stream.text_stream:\n        full_text += text\n        print(text, end="", flush=True)\n\n    print(f"\\nПолный текст ({len(full_text)} символов)")'
        },
        {
          type: 'note',
          value: 'SSE используется вместо WebSocket для стриминга, так как ответ Claude однонаправленный (только от сервера к клиенту). WebSocket избыточен для этой задачи. SSE проще, надёжнее работает через прокси и поддерживает автоматическое переподключение.'
        }
      ]
    },
    {
      id: 5,
      title: 'Стриминг в веб-приложениях',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Интеграция стриминга в FastAPI'
        },
        {
          type: 'text',
          value: 'В веб-приложениях стриминг реализуется через StreamingResponse (FastAPI) или аналоги. Сервер получает стрим от Claude и передаёт его клиенту как SSE или chunked transfer encoding.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\nimport anthropic\nimport json\n\napp = FastAPI()\nclient = anthropic.Anthropic()\n\n@app.post("/chat/stream")\nasync def stream_chat(data: dict):\n    user_message = data.get("message", "")\n\n    def generate():\n        """Генератор, отдающий токены как SSE"""\n        with client.messages.stream(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            messages=[{"role": "user", "content": user_message}]\n        ) as stream:\n            for text in stream.text_stream:\n                # Формат SSE: data: ...\\n\\n\n                yield f"data: {json.dumps({"text": text})}\\n\\n"\n\n            # Сигнал окончания\n            yield f"data: {json.dumps({"done": True})}\\n\\n"\n\n    return StreamingResponse(\n        generate(),\n        media_type="text/event-stream",\n        headers={\n            "Cache-Control": "no-cache",\n            "X-Accel-Buffering": "no"  # Отключить буферизацию nginx\n        }\n    )'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Клиентский код (браузер) для получения SSE\nasync function streamChat(message) {\n  const response = await fetch("/chat/stream", {\n    method: "POST",\n    headers: {"Content-Type": "application/json"},\n    body: JSON.stringify({message})\n  });\n\n  const reader = response.body.getReader();\n  const decoder = new TextDecoder();\n  const output = document.getElementById("output");\n\n  while (true) {\n    const {done, value} = await reader.read();\n    if (done) break;\n\n    const lines = decoder.decode(value).split("\\n");\n    for (const line of lines) {\n      if (line.startsWith("data: ")) {\n        const data = JSON.parse(line.slice(6));\n        if (data.text) {\n          output.textContent += data.text;\n        }\n        if (data.done) {\n          console.log("Стриминг завершён");\n        }\n      }\n    }\n  }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Потоковый вывод',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Напишите скрипт, который стримит ответ Claude на длинный вопрос, одновременно отображает прогресс (счётчик токенов в реальном времени) и сохраняет полный текст ответа в файл.',
      requirements: [
        'Использовать client.messages.stream() как контекстный менеджер',
        'Выводить текст токен за токеном с flush=True',
        'Вести счётчик полученных символов и выводить его в заголовке строки',
        'После завершения стрима вывести итоговую статистику: токены, время',
        'Сохранить полный текст ответа в файл answer.txt',
        'Использовать time.time() для измерения времени генерации'
      ],
      expectedOutput: '[Символов: 0] Генерация...\nPython — это высокоуровневый язык программирования...\n[Символов: 847] Завершено!\n\nСтатистика:\n  Входящих токенов: 18\n  Исходящих токенов: 203\n  Время генерации: 4.2 сек\n  Скорость: 48 токенов/сек\nОтвет сохранён в answer.txt',
      hint: 'Используйте stream.get_final_message() после завершения стрима для получения usage. Считайте символы через len() на накапливаемой строке. Используйте \\r для перезаписи строки счётчика.',
      solution: 'import anthropic\nimport time\n\ndef stream_to_file():\n    client = anthropic.Anthropic()\n\n    question = "Расскажи подробно об истории и особенностях языка Python: его создание, философия, основные версии и применение в современном мире"\n\n    print("[Символов: 0] Генерация...")\n    start_time = time.time()\n    full_text = ""\n\n    with client.messages.stream(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": question}]\n    ) as stream:\n        for text in stream.text_stream:\n            full_text += text\n            print(text, end="", flush=True)\n\n        final = stream.get_final_message()\n\n    elapsed = time.time() - start_time\n    tokens_per_sec = final.usage.output_tokens / elapsed if elapsed > 0 else 0\n\n    print(f"\\n[Символов: {len(full_text)}] Завершено!")\n    print()\n    print("Статистика:")\n    print(f"  Входящих токенов: {final.usage.input_tokens}")\n    print(f"  Исходящих токенов: {final.usage.output_tokens}")\n    print(f"  Время генерации: {elapsed:.1f} сек")\n    print(f"  Скорость: {tokens_per_sec:.0f} токенов/сек")\n\n    with open("answer.txt", "w", encoding="utf-8") as f:\n        f.write(full_text)\n    print("Ответ сохранён в answer.txt")\n\nif __name__ == "__main__":\n    stream_to_file()',
      explanation: 'Стриминг в Python прост благодаря контекстному менеджеру: with client.messages.stream(...) as stream. Итерация по stream.text_stream даёт отдельные текстовые фрагменты. Важный момент: get_final_message() нужно вызывать внутри блока with (пока соединение открыто), иначе данные будут недоступны. Накопление full_text позволяет после стрима сохранить весь ответ целиком. Измерение времени помогает понять реальную скорость генерации конкретной модели.'
    }
  ]
}
