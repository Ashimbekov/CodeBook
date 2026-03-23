export default {
  id: 28,
  title: 'Presentations: Product Demo',
  description: 'Как проводить демонстрации продукта на английском. Структура демо, ключевые фразы и техники вовлечения аудитории.',
  lessons: [
    {
      id: 1,
      title: 'Structure of a product demo',
      type: 'theory',
      content: [
        { type: 'text', value: 'Product demo (демонстрация продукта) — один из самых важных навыков для разработчика. Ты показываешь то, что создал, и объясняешь его ценность.' },
        { type: 'heading', value: 'Demo structure' },
        { type: 'list', items: [
          '1. Opening — представь себя и цель демо (1-2 мин)',
          '2. Context / Problem — какую проблему решает продукт (2-3 мин)',
          '3. Overview — быстрый обзор того, что увидим (30 сек)',
          '4. Demo — живая демонстрация (5-15 мин)',
          '5. Key features recap — главные фичи (1-2 мин)',
          '6. Next steps / Roadmap — что дальше (1 мин)',
          '7. Q&A — вопросы (оставь время!)'
        ]},
        { type: 'heading', value: 'Opening phrases' },
        { type: 'list', items: [
          '"Thank you for joining today." — спасибо, что присоединились',
          '"Today I\'m going to show you..." — сегодня я покажу вам...',
          '"By the end of this demo, you\'ll see how..." — к концу демо вы увидите как...',
          '"Feel free to ask questions at any time." — задавайте вопросы в любое время',
          '"I\'ll leave time for Q&A at the end." — в конце оставлю время на вопросы'
        ]},
        { type: 'tip', value: 'Всегда начинай с проблемы, а не с функций. "Our users were spending 2 hours manually..." намного убедительнее, чем начинать с технических деталей.' }
      ]
    },
    {
      id: 2,
      title: 'Demo navigation phrases: "Let me show you..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'В процессе демо нужно комментировать каждое действие. Вот фразы для навигации по продукту.' },
        { type: 'heading', value: 'Navigation and showing phrases' },
        { type: 'list', items: [
          '"Let me show you how this works." — позвольте показать, как это работает',
          '"As you can see here..." — как вы можете видеть здесь...',
          '"If I click on this button..." — если нажму на эту кнопку...',
          '"Let\'s navigate to the settings page." — перейдём на страницу настроек',
          '"I\'ll now switch to the admin view." — сейчас переключусь на вид администратора',
          '"Notice how the data updates in real time." — обратите внимание, как данные обновляются в реальном времени',
          '"This is where users can configure..." — здесь пользователи могут настроить...',
          '"Let me zoom in so you can see better." — давайте увеличу, чтобы было лучше видно'
        ]},
        { type: 'code', language: 'text', value: 'Example demo narration:\n\n"Let me show you how the authentication flow works.\nAs you can see, when a user enters their credentials,\nthe system validates them in real time.\nNotice the loading indicator — the API call\ntypically takes under 200 milliseconds.\nIf I enter incorrect credentials, you can see\nthe error message appears immediately.\nLet me now show you what happens on a successful login..."' },
        { type: 'note', value: '"As you can see..." — классическая фраза для демо. Направляет внимание аудитории на конкретный элемент экрана.' }
      ]
    },
    {
      id: 3,
      title: 'Handling technical issues during demo',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические проблемы во время демо случаются у всех. Важно реагировать спокойно и профессионально.' },
        { type: 'heading', value: 'When something doesn\'t work' },
        { type: 'list', items: [
          '"It seems like we\'re having a technical issue. Let me try that again." — кажется, техническая проблема. Попробую ещё раз',
          '"This usually works, let me troubleshoot quickly." — обычно работает, позвольте быстро разобраться',
          '"While I fix this, let me tell you about..." — пока исправляю, расскажу о...',
          '"I have a backup to show you in the meantime." — тем временем покажу резервный вариант',
          '"It looks like the environment is a bit slow today." — кажется, окружение сегодня немного тормозит',
          '"Let me switch to our staging environment." — перейдём на staging-окружение'
        ]},
        { type: 'heading', value: 'Murphy\'s Law preparation' },
        { type: 'list', items: [
          'Always have a backup — видеозапись, скриншоты или staging-среда',
          'Test everything the day before',
          'Close unnecessary tabs and applications',
          'Use a demo account with clean data',
          'Know your demo by heart — don\'t rely on reading'
        ]},
        { type: 'tip', value: 'Профессиональный совет: используй локальную версию продукта вместо production для демо. Это избегает проблем с интернетом и реальными данными.' }
      ]
    },
    {
      id: 4,
      title: 'Highlighting features and benefits',
      type: 'theory',
      content: [
        { type: 'text', value: 'Во время демо важно не просто показывать, что продукт делает, но и объяснять ценность каждой фичи.' },
        { type: 'heading', value: 'Feature highlight phrases' },
        { type: 'list', items: [
          '"One of the key features is..." — одна из ключевых функций...',
          '"This is particularly useful when..." — это особенно полезно когда...',
          '"What makes this unique is..." — что делает это уникальным...',
          '"This saves users about 2 hours per week." — это экономит пользователям около 2 часов в неделю',
          '"Previously, this process took 5 steps. Now it takes just one." — раньше это занимало 5 шагов. Теперь — один',
          '"The real power of this is..." — реальная сила этого в том...'
        ]},
        { type: 'heading', value: 'Engaging the audience' },
        { type: 'list', items: [
          '"Does anyone have experience with this problem?" — есть ли у кого-то опыт с этой проблемой?',
          '"How many of you have encountered this before?" — сколько из вас сталкивались с этим?',
          '"What do you think would happen if...?" — как вы думаете, что произойдёт если...?',
          '"Feel free to try this yourself after the demo." — попробуйте сами после демо',
          '"Let me stop here — does this make sense?" — остановлюсь здесь — это понятно?'
        ]},
        { type: 'note', value: 'Rule of 3 для фич: показывай не более 3 ключевых функций за одно демо. Больше — аудитория теряет нить. "Сегодня я покажу три главные возможности нашего продукта."' }
      ]
    },
    {
      id: 5,
      title: 'Handling questions during demo',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вопросы во время или после демо — хороший знак. Значит, аудитория вовлечена. Важно отвечать профессионально.' },
        { type: 'heading', value: 'Responding to questions' },
        { type: 'list', items: [
          '"Great question! Let me address that." — отличный вопрос! Давайте разберём',
          '"That\'s actually something we\'re working on." — мы как раз работаем над этим',
          '"I don\'t have the exact numbers, but..." — у меня нет точных цифр, но...',
          '"Let me show you exactly how that works." — позвольте показать как это работает',
          '"Can I follow up with you after the demo? I want to give a complete answer." — могу связаться после демо для полного ответа?',
          '"That\'s a great use case. Currently we don\'t support that, but it\'s on our roadmap." — отличный сценарий. Пока не поддерживаем, но в роадмапе есть'
        ]},
        { type: 'heading', value: 'Closing the demo' },
        { type: 'list', items: [
          '"So, to summarize what we saw today:..." — итак, подведём итог...',
          '"The next steps for us are..." — наши следующие шаги...',
          '"You can try this yourself at [URL]." — можно попробовать самому по адресу...',
          '"Thank you for your time and great questions." — спасибо за время и вопросы',
          '"I\'m happy to do a deeper dive for interested teams." — готов сделать более детальное демо для заинтересованных команд'
        ]},
        { type: 'tip', value: 'Заканчивай демо с clear call to action (призывом к действию): "Try the beta at X", "Sign up for early access", "Schedule a follow-up call".' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Demo script writing',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши скрипт мини-демо для следующего продукта (5-7 предложений на каждый раздел).',
      solution: 'Структура правильного демо-скрипта:\nOpening: Представься и назови продукт, укажи конкретную ценность (экономия времени/денег).\nProblem: 2-3 предложения о боли пользователя с конкретными цифрами.\nDemo narration: Используй "Let me show you...", "As you can see...", "Notice how...".\nKey benefit: 1-2 предложения о главной ценности.\nClosing: Конкретный call to action с URL или следующим шагом.',
      scenario: 'Продукт: Инструмент для автоматического code review на основе ИИ. Анализирует PR и оставляет комментарии о безопасности, производительности и читаемости.',
      template: 'Opening (1-2 предложения):\n[Представь себя и продукт]\n\nProblem (2-3 предложения):\n[Какую боль решает продукт]\n\nDemo narration (3-4 предложения):\n[Что показываешь, используя фразы "Let me show you...", "As you can see..."]\n\nKey benefit (1-2 предложения):\n[Главная ценность продукта]\n\nClosing (1-2 предложения):\n[Call to action]',
      sampleAnswer: 'Opening:\nThank you for joining today. I\'m going to show you how AI Code Reviewer can save your team 3 hours per week on code reviews.\n\nProblem:\nCurrently, code reviews are time-consuming and inconsistent. Different reviewers catch different issues. Critical security vulnerabilities can slip through when reviewers are busy or tired.\n\nDemo narration:\nLet me show you how it works. As you can see, I\'m opening a new pull request in GitHub. If I install our GitHub Action, it automatically analyzes the code. Notice how it\'s already identified a potential SQL injection on line 47 and a performance issue with the O(n^2) loop.\n\nKey benefit:\nThis catches critical issues before human review, so your senior engineers can focus on architecture and logic, not hunting for security bugs.\n\nClosing:\nYou can try it free for 14 days at aireview.dev. Any questions?'
    },
    {
      id: 7,
      title: 'Practice: Demo phrases in context',
      type: 'practice',
      difficulty: 'easy',
      description: 'Выбери подходящую фразу для каждой ситуации в демо.',
      solution: 'Правильные ответы:\n1. "Let me show you the login flow." (показ функции)\n2. "As you can see, the data updated in real time." (обращение внимания на экран)\n3. "It seems like we\'re having a technical issue. Let me try again." (технические проблемы)\n4. "You can try this yourself at our website. We offer a 14-day free trial." (call to action)',
      tasks: [
        {
          situation: 'Ты хочешь показать, как пользователь логинится в систему.',
          options: [
            '"Let me show you the login flow."',
            '"So, to summarize what we saw..."',
            '"Thank you for your time."'
          ],
          correct: 0,
          explanation: '"Let me show you..." — стандартная фраза для начала показа функции.'
        },
        {
          situation: 'Таблица на экране обновилась с новыми данными, и ты хочешь обратить внимание аудитории.',
          options: [
            '"Feel free to ask questions."',
            '"As you can see, the data updated in real time."',
            '"One of the key features is real-time updates."'
          ],
          correct: 1,
          explanation: '"As you can see..." — направляет внимание аудитории на то, что происходит прямо сейчас на экране.'
        },
        {
          situation: 'Что-то не работает во время демо.',
          options: [
            '"It seems like we\'re having a technical issue. Let me try again."',
            '"As you can see, this is broken."',
            '"Thank you for the question."'
          ],
          correct: 0,
          explanation: 'Профессиональное признание технической проблемы без паники.'
        },
        {
          situation: 'Ты заканчиваешь демо и хочешь предложить слушателям попробовать продукт.',
          options: [
            '"Let me show you one more feature."',
            '"You can try this yourself at our website. We offer a 14-day free trial."',
            '"Does this make sense so far?"'
          ],
          correct: 1,
          explanation: 'Clear call to action в конце демо — важная часть завершения.'
        }
      ]
    }
  ]
}
