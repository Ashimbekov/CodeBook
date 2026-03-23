export default {
  id: 12,
  title: 'Past Simple (неправильные глаголы)',
  description: 'Неправильные глаголы в прошедшем времени — самые важные 50 глаголов',
  lessons: [
    {
      id: 1,
      title: 'Что такое неправильные глаголы?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Неправильные (irregular) глаголы не добавляют -ed в прошедшем времени. Их форму нужно запомнить. Есть три формы глагола: инфинитив, Past Simple, Past Participle.' },
        { type: 'code', language: 'text', value: 'Три формы глагола:\nИнфинитив   Past Simple   Past Participle\nwrite       wrote         written\nrun         ran           run\nfind        found         found\nbuild       built         built\nmake        made          made\nknow        knew          known\nget         got           got/gotten\nsee         saw           seen\ntake        took          taken\ngive        gave          given' },
        { type: 'note', value: 'На уровне A1 достаточно знать форму Past Simple. Past Participle понадобится для Perfect времён (уровень A2+). Сосредоточьтесь на второй колонке.' }
      ]
    },
    {
      id: 2,
      title: 'Самые важные IT-глаголы (группа 1)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Запомним самые важные неправильные глаголы для IT. Разобьём их на небольшие группы.' },
        { type: 'code', language: 'text', value: 'Группа 1 — часто используемые в IT:\nwrite → wrote     - писал (код)\nrun   → ran       - запускал\nbuild → built     - собирал\nfind  → found     - находил\nmake  → made      - делал\nread  → read      - читал (произносится [red]!)\nsend  → sent      - отправлял\nread  → read [red]- читал\nset   → set       - устанавливал\nput   → put       - помещал' },
        { type: 'code', language: 'text', value: 'Примеры:\nShe wrote the documentation.    - Она написала документацию.\nI ran the tests.                - Я запустил тесты.\nWe built the app in 3 months.   - Мы собрали приложение за 3 месяца.\nHe found a critical bug.        - Он нашёл критический баг.\nThey made a lot of changes.     - Они внесли много изменений.\nI read the README.              - Я прочитал README.' }
      ]
    },
    {
      id: 3,
      title: 'Самые важные IT-глаголы (группа 2)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Продолжаем учить неправильные глаголы. Эта группа особенно важна для описания рабочего процесса.' },
        { type: 'code', language: 'text', value: 'Группа 2 — рабочий процесс:\nknow   → knew     - знал\nget    → got      - получал\ngive   → gave     - давал\ntake   → took     - брал\ncome   → came     - приходил\nbecome → became   - стал\nbegin  → began    - начинал\nbreak  → broke    - ломал\nchoose → chose    - выбирал\ncreate — правильный! created' },
        { type: 'code', language: 'text', value: 'Примеры:\nI knew the solution.             - Я знал решение.\nWe got a lot of feedback.        - Мы получили много отзывов.\nShe gave a code review.          - Она провела код-ревью.\nHe took the ticket.              - Он взял задачу.\nThey became a remote team.       - Они стали удалённой командой.\nThe build began at midnight.     - Сборка началась в полночь.\nSomething broke in production.   - Что-то сломалось в продакшене.' }
      ]
    },
    {
      id: 4,
      title: 'Самые важные IT-глаголы (группа 3)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Третья группа неправильных глаголов для повседневного общения в IT-команде.' },
        { type: 'code', language: 'text', value: 'Группа 3 — общение и процессы:\nsay    → said     - сказал\ntell   → told     - рассказал\nthink  → thought  - думал\nsee    → saw      - видел\nhear   → heard    - слышал\nmeet   → met      - встречал\nspeak  → spoke    - говорил\nunderstand→ understood - понимал\nleave  → left     - оставил / ушёл\nkeep   → kept     - сохранял / держал' },
        { type: 'code', language: 'text', value: 'Примеры:\nShe said the bug was fixed.      - Она сказала, что баг исправлен.\nI thought it was working.        - Я думал, это работает.\nWe met the deadline.             - Мы уложились в дедлайн.\nHe spoke at the conference.      - Он выступил на конференции.\nI understood the requirements.   - Я понял требования.\nThey left good comments.         - Они оставили хорошие комментарии.' }
      ]
    },
    {
      id: 5,
      title: 'Использование в предложениях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим использование неправильных глаголов в реальном IT-контексте — на стендапах, в описаниях задач и переписке.' },
        { type: 'code', language: 'text', value: 'На стендапе (вчерашний день):\nYesterday I wrote unit tests.    - Вчера я написал юнит-тесты.\nI ran the linter and found bugs. - Запустил линтер и нашёл баги.\nShe built a new Docker image.    - Она собрала новый Docker-образ.\nWe got stuck on the auth issue.  - Мы застряли на проблеме с авторизацией.\nHe made a commit.                - Он сделал коммит.' },
        { type: 'code', language: 'text', value: 'Описание инцидента:\nThe server broke at 3 AM.         - Сервер сломался в 3 утра.\nWe got an alert.                  - Мы получили уведомление.\nThe team came together to fix it. - Команда собралась, чтобы исправить это.\nWe found the root cause quickly.  - Мы быстро нашли первопричину.\nEveryone understood the problem.  - Все поняли проблему.\nWe kept the logs for analysis.    - Мы сохранили логи для анализа.' }
      ]
    },
    {
      id: 6,
      title: 'Список 50 неправильных глаголов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вот расширенный список неправильных глаголов, которые важно знать на уровне A1.' },
        { type: 'code', language: 'text', value: 'Инфинитив → Past Simple:\nbe    → was/were  bring → brought\nbuy   → bought    catch → caught\ncome  → came      do    → did\ndraw  → drew      drink → drank\ndrive → drove     eat   → ate\nfall  → fell      feel  → felt\nfight → fought    fly   → flew\nforget→ forgot    get   → got\ngive  → gave      go    → went\ngrow  → grew      have  → had\nhear  → heard     hold  → held\nhurt  → hurt      keep  → kept\nknow  → knew      lead  → led' },
        { type: 'code', language: 'text', value: 'Продолжение:\nlearn → learned/learnt  leave → left\nlose  → lost      make  → made\nmeet  → met       pay   → paid\nput   → put       read  → read [red]\nrun   → ran       say   → said\nsee   → saw       sell  → sold\nsend  → sent      set   → set\nshow  → showed    sit   → sat\nsleep → slept     speak → spoke\nspend → spent     stand → stood\nswim  → swam      take  → took\nteach → taught    tell  → told\nthink → thought   understand → understood\nwear  → wore      win   → won\nwrite → wrote' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Неправильные глаголы',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Поставьте глагол в Past Simple: "I ___ (write) the documentation last week."',
          solution: 'wrote',
          explanation: '"I wrote the documentation last week." — Я написал документацию на прошлой неделе. write → wrote.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Поставьте глагол в Past Simple: "The build ___ (break) after the merge."',
          solution: 'broke',
          explanation: '"The build broke after the merge." — Сборка сломалась после мёрджа. break → broke.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Они получили много отзывов на первый релиз."',
          solution: 'They got a lot of feedback on the first release.',
          explanation: 'got = get в прошедшем. "a lot of feedback" — много отзывов (feedback — неисчисляемое). "the first release" — первый релиз.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Выберите правильную форму: "She ___ the problem quickly."',
          options: ['understood', 'understanded', 'was understand', 'understanding'],
          correct: 0,
          explanation: 'understand → understood. "She understood the problem quickly." — Она быстро поняла проблему.'
        }
      ]
    }
  ]
}
