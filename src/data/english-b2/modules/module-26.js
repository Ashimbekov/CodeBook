export default {
  id: 26,
  title: 'Презентации: Tech Talks',
  description: 'Как готовить и проводить технические презентации на английском языке',
  lessons: [
    {
      id: 1,
      title: 'Структура эффективного tech talk',
      type: 'theory',
      content: [
        { type: 'text', value: 'Tech talk — мощный инструмент для обмена знаниями и построения репутации в сообществе. Хорошая структура — половина успеха.' },
        { type: 'heading', value: 'Структура PRES' },
        { type: 'text', value: '"Problem: почему это важно? Что болит?\nResolution: ваш подход к решению\nEvidence: результаты, данные, демо\nSo what: выводы и применимость для аудитории"' },
        { type: 'heading', value: 'Opening — захват внимания' },
        { type: 'text', value: '"Start with a question: \'How many of you have experienced a production outage at 3 AM?\'" \n"Start with a story: \'Last year, we had an incident that cost the company $500,000 in 4 hours.\'" \n"Start with a shocking statistic: \'73% of database migrations fail to meet their performance targets.\'"' },
        { type: 'heading', value: 'Closing — запоминающийся финал' },
        { type: 'text', value: '"Recap the three key takeaways."\n"End with a call to action: \'Try this in your project this week and share your results.\'"\n"End with a memorable quote or thought: \'The best code is the code you don\'t have to write.\'"' },
        { type: 'tip', value: '"Tell them what you\'re going to tell them. Tell them. Tell them what you told them." — классическая формула ораторского мастерства. В tech talks это: intro с agenda, content, recap.' }
      ]
    },
    {
      id: 2,
      title: 'Фразы для начала и ведения презентации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Набор стандартных фраз для каждого этапа презентации освобождает ментальный ресурс для содержания.' },
        { type: 'heading', value: 'Opening phrases' },
        { type: 'text', value: '"Good morning/afternoon everyone. My name is X and I\'m here to talk about Y."\n"Thank you for coming. Today I\'d like to share something my team has been working on."\n"I\'ve got about 30 minutes, so let\'s dive in."\n"This talk is for anyone who has ever dealt with [problem]."' },
        { type: 'heading', value: 'Transition phrases' },
        { type: 'text', value: '"Moving on to the next point..."\n"Now that we\'ve covered the background, let\'s look at our solution."\n"This brings me to the core challenge we faced."\n"I\'d like to pause here for a moment."\n"Before I get to the demo, let me quickly explain..."' },
        { type: 'heading', value: 'Pointing to slides and demos' },
        { type: 'text', value: '"As you can see on this slide..."\n"The graph on the right shows..."\n"Let me zoom in on this part."\n"I\'m going to switch to the demo now."\n"As you can see in the output..."' }
      ]
    },
    {
      id: 3,
      title: 'Работа с аудиторией: вопросы и вовлечение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерактивность делает презентацию значительно более запоминающейся.' },
        { type: 'heading', value: 'Вовлечение аудитории' },
        { type: 'text', value: '"By show of hands, how many of you have used Kubernetes?"\n"I\'d like to hear from the audience — what approaches have you tried?"\n"Before I show you the solution, what would YOU do here?"\n"Feel free to interrupt me with questions — I prefer a conversation to a monologue."' },
        { type: 'heading', value: 'Ответы на вопросы' },
        { type: 'text', value: '"Great question. [pause] I think..."\n"That\'s something we actually wrestled with. The answer is..."\n"I\'m glad you brought that up — it\'s an important nuance."\n"I don\'t know the answer off the top of my head, but I\'d be happy to follow up after the talk."' },
        { type: 'heading', value: 'Сложные вопросы' },
        { type: 'text', value: '"That\'s outside the scope of today\'s talk, but let\'s chat after."\n"I want to make sure I understand your question — are you asking about X or Y?"\n"I\'m not sure I agree with that framing. Let me offer a different perspective."' }
      ]
    },
    {
      id: 4,
      title: 'Публичные выступления: голос, паузы, язык тела',
      type: 'theory',
      content: [
        { type: 'text', value: 'Содержание — только 30% восприятия. Голос, паузы и язык тела определяют, насколько убедительно вы звучите.' },
        { type: 'heading', value: 'Голос и темп' },
        { type: 'text', value: '"Slow down: non-native speakers (and many native speakers) tend to rush when nervous."\n"Vary your pace: speed up for context, slow down for key points."\n"Use your voice to emphasise key words: \'This is the MOST important thing I want you to take away.\'"\n"Pause before key points — it creates anticipation."' },
        { type: 'heading', value: 'Паузы — сила молчания' },
        { type: 'text', value: '"A 2-second pause feels longer to you than to the audience."\n"Pause after questions to give the audience time to process."\n"Use \'um\' and \'uh\' deliberately: replace them with a pause."\n"Pause after your key takeaway — let it land."' },
        { type: 'heading', value: 'Уверенность' },
        { type: 'text', value: '"Stand still rather than pacing nervously."\n"Make eye contact with different parts of the room."\n"Smile occasionally — it makes you more approachable."\n"Own the silence after your question — don\'t rush to fill it."' }
      ]
    },
    {
      id: 5,
      title: 'Онлайн-презентации: Zoom, Teams, Google Meet',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство tech talks теперь онлайн. Это требует специфических навыков.' },
        { type: 'heading', value: 'Техническая подготовка' },
        { type: 'text', value: '"Test your audio and video before the presentation."\n"Use a good microphone — audio quality matters more than video quality."\n"Have your presentation open before the call starts."\n"Close unnecessary applications to avoid lag and notifications."' },
        { type: 'heading', value: 'Вовлечение онлайн-аудитории' },
        { type: 'text', value: '"Ask attendees to use chat for questions during the talk."\n"Use polls to make it interactive: \'Raise your hand emoji if you\'ve experienced this.\'"\n"Acknowledge the chat: \'I see some great questions in the chat — I\'ll address those at the end.\'"\n"Turn off mute reminder: \'Please keep yourselves muted unless speaking to reduce background noise.\'"' },
        { type: 'heading', value: 'Opening для онлайн-аудитории' },
        { type: 'text', value: '"Can everyone hear me okay? Just drop a yes in the chat."\n"I can see about 50 people have joined — welcome everyone."\n"I\'ll speak for about 30 minutes and then take questions — feel free to drop questions in chat throughout."' }
      ]
    },
    {
      id: 6,
      title: 'Conference talks: CFP и submission',
      type: 'theory',
      content: [
        { type: 'text', value: 'Call for Papers (CFP) — процесс подачи заявки на выступление на конференции.' },
        { type: 'heading', value: 'Как написать успешный CFP' },
        { type: 'text', value: '"Title: specific and outcome-focused. \'How we reduced 99th percentile API latency by 80% at scale\' >> \'Improving API performance\'"\n"Abstract: 200-400 words describing the talk content and key takeaways."\n"Why this talk matters: what will attendees learn and apply?"\n"Speaker bio: relevant experience, not a full CV."' },
        { type: 'heading', value: 'Пример CFP abstract' },
        { type: 'text', value: '"In 2023, our payment service was processing 10,000 transactions per second — and struggling. In this talk, I\'ll walk through the journey from a single-threaded bottleneck to a fully asynchronous, horizontally scalable architecture.\n\nAttendees will learn:\n- How to identify concurrency bottlenecks using flame graphs\n- The trade-offs between async/await and event loop architectures\n- Practical migration strategies for stateful services\n- Real production metrics before and after the changes\n\nThis talk is aimed at engineers working on high-throughput systems who want practical, battle-tested advice."' }
      ]
    },
    {
      id: 7,
      title: 'Практика: tech talk opening',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите и подготовьте opening для tech talk.',
      requirements: [
        'Opening: hook + agenda + promise (что узнает аудитория)',
        'Используйте фразы из уроков',
        'Длина: 5-7 предложений',
        'Тема: "Lessons learned from 5 years of on-call"'
      ],
      hint: 'Начните с истории или вопроса. Установите связь с аудиторией ("raise hands if..."). Пообещайте практические takeaways.',
      solution: '"Good afternoon everyone. Before I start — raise your hand if you\'ve ever been woken up by a pager alert at 3 AM.\n\n[pause]\n\nKeep your hand up if it turned out to be a false alarm.\n\n[laughter]\n\nI thought so. My name is Nurdaulet, and over the past five years I\'ve been on-call for systems processing over a million transactions per day. I\'ve seen catastrophic failures, near-misses, and everything in between.\n\nIn the next 30 minutes, I\'m going to share the three lessons that fundamentally changed how I think about building reliable systems — lessons I wish I\'d known before my first on-call rotation. By the end of this talk, you\'ll have a concrete checklist you can apply to your next on-call setup.\n\nLet\'s get started."',
      explanation: 'Сильное opening захватывает аудиторию в первые 30 секунд. Вопрос с поднятием руки создаёт участие и общность опыта. Обещание конкретной ценности ("checklist you can apply") мотивирует слушать до конца.'
    },
    {
      id: 8,
      title: 'Практика: ответы на сложные вопросы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Подготовьте ответы на сложные вопросы после tech talk.',
      requirements: [
        'Используйте фразы для обработки трудных вопросов',
        'Признайте ограничения честно',
        'Не теряйте уверенность'
      ],
      questions: [
        { text: 'After your talk about your caching solution, someone asks:\n"But doesn\'t this approach fail completely in split-brain scenarios? It seems like you\'ve fundamentally misunderstood the CAP theorem."\n\nHow do you respond?', answer: '"Thank you for the question — that\'s an important challenge to raise. I want to make sure I understand it correctly: are you asking specifically about the case where the network partitions and both cache nodes believe they are the leader?\n\nIf that\'s the case, you\'re right that our approach trades consistency for availability in that scenario — that was actually a deliberate design decision. Our data can tolerate stale reads for up to 5 minutes, which is acceptable for our use case.\n\nI may not have communicated that trade-off clearly enough in the talk — that\'s a fair point. Would you like to discuss the specific failure mode you\'re thinking of? I\'m happy to dive deeper into that in the Q&A or catch up after."', explanation: 'Когда атакуют вашу идею: 1) Не защищайтесь агрессивно; 2) Уточните вопрос — иногда это непонимание; 3) Признайте валидные аргументы; 4) Объясните trade-off сознательным выбором; 5) Пригласите к продолжению разговора.' }
      ],
      solution: 'Правильные ответы:\n1. "Thank you for the question — that\\\'s an important challenge to raise. I want to make sure I understand it correctly: are you asking specifically about the case where the network partitions and both ca...',
      hint: 'Формула: уточните вопрос → признайте то, что верно → объясните свой trade-off → пригласите к дальнейшему обсуждению. Никогда не спорьте агрессивно с аудиторией.',
      explanation: 'Умение достойно обрабатывать критику на публике — признак уверенного профессионала. Самые запоминающиеся моменты tech talks часто происходят в Q&A, а не в самой презентации.'
    }
  ]
}
