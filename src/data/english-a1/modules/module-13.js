export default {
  id: 13,
  title: 'Числа, даты, время',
  description: 'Числа от 0 до 1000, порядковые числительные, даты и время',
  lessons: [
    {
      id: 1,
      title: 'Числа 0-20',
      type: 'theory',
      content: [
        { type: 'text', value: 'Числа — основа любого технического общения. Версии программ, порты, количество строк, индексы — всё это числа.' },
        { type: 'code', language: 'text', value: '0  - zero    [зиро]\n1  - one     [ван]\n2  - two     [ту]\n3  - three   [сри]\n4  - four    [фо]\n5  - five    [файв]\n6  - six     [сикс]\n7  - seven   [севн]\n8  - eight   [эйт]\n9  - nine    [найн]\n10 - ten     [тен]\n11 - eleven  [илевн]\n12 - twelve  [твелв]\n13 - thirteen[сёрти:н]\n14 - fourteen[фо:тин]\n15 - fifteen [фифти:н]\n16 - sixteen [сикстин]\n17 - seventeen[севнтин]\n18 - eighteen[эйтин]\n19 - nineteen[найнтин]\n20 - twenty  [твенти]' },
        { type: 'tip', value: 'Zero очень важно в IT: индексы массива начинаются с 0, HTTP код 200, порты 3000/8080/443. "Index zero" (нулевой индекс) — фраза, которую вы будете слышать постоянно.' },
        { type: 'note', value: 'Числа 13-19 заканчиваются на -teen и ударение падает на последний слог: thirTEEN, fourTEEN, fifTEEN. Числа 30-90 заканчиваются на -ty с ударением на первый слог: THIRty, FORty, FIFty. Это помогает правильно понимать их на слух.' }
      ]
    },
    {
      id: 2,
      title: 'Числа 21-1000',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для составных чисел от 21 до 99 используется дефис. Сотни и тысячи строятся по регулярному принципу.' },
        { type: 'code', language: 'text', value: '21 - twenty-one\n30 - thirty\n40 - forty (не "fourty"!)\n50 - fifty\n60 - sixty\n70 - seventy\n80 - eighty\n90 - ninety\n100 - one hundred\n200 - two hundred\n1000 - one thousand\n\nСоставные числа:\n42  - forty-two\n99  - ninety-nine\n101 - one hundred and one\n256 - two hundred and fifty-six\n1024- one thousand and twenty-four' },
        { type: 'code', language: 'text', value: 'Важные числа в IT:\n8    - eight (8 bit)\n16   - sixteen (16-bit)\n32   - thirty-two (32-bit)\n64   - sixty-four (64-bit)\n128  - one hundred and twenty-eight\n256  - two hundred and fifty-six\n404  - four hundred and four (HTTP Not Found)\n500  - five hundred (HTTP Server Error)\n1024 - one thousand and twenty-four (1 KB)\n3000 - three thousand (порт React)\n8080 - eight thousand and eighty (порт HTTP)' },
        { type: 'tip', value: 'Важные числа для IT: 256 (two hundred and fifty-six) — размер байта, 1024 (one thousand and twenty-four) — килобайт, 443 (four hundred and forty-three) — порт HTTPS, 8080 (eight thousand and eighty) — альтернативный HTTP-порт.' },
      ]
    },
    {
      id: 3,
      title: 'Порядковые числительные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Порядковые числительные (1st, 2nd, 3rd...) нужны для дат, версий и позиций. Первые три — особые, остальные — добавляем -th.' },
        { type: 'code', language: 'text', value: '1st  - first\n2nd  - second\n3rd  - third\n4th  - fourth\n5th  - fifth\n6th  - sixth\n7th  - seventh\n8th  - eighth\n9th  - ninth\n10th - tenth\n11th - eleventh\n12th - twelfth\n20th - twentieth\n21st - twenty-first\n100th- one hundredth' },
        { type: 'code', language: 'text', value: 'В IT-контексте:\nversion 2.0 = "version two point zero"\nv1.0.1 = "version one point zero point one"\nthe first iteration  - первая итерация\nthe second sprint     - второй спринт\nthe third release     - третий релиз\nthe 404th line        - четыреста четвёртая строка\nthe first pull request- первый пул-реквест' },
        { type: 'note', value: 'В версионировании: "version one point zero" (v1.0), "the second release candidate" (второй релиз-кандидат), "the third iteration" (третья итерация). Порядковые числительные также нужны для дат: "The 15th of March" (15 марта).' },
      ]
    },
    {
      id: 4,
      title: 'Дни недели и месяцы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дни недели и месяцы пишутся с большой буквы в английском. Они очень важны для планирования спринтов, дедлайнов и встреч.' },
        { type: 'code', language: 'text', value: 'Дни недели:\nMonday    - понедельник  (Mon)\nTuesday   - вторник      (Tue)\nWednesday - среда        (Wed)\nThursday  - четверг      (Thu)\nFriday    - пятница      (Fri)\nSaturday  - суббота      (Sat)\nSunday    - воскресенье  (Sun)\n\nМесяцы:\nJanuary   - январь    (Jan)\nFebruary  - февраль   (Feb)\nMarch     - март      (Mar)\nApril     - апрель    (Apr)\nMay       - май       (May)\nJune      - июнь      (Jun)\nJuly      - июль      (Jul)\nAugust    - август    (Aug)\nSeptember - сентябрь  (Sep)\nOctober   - октябрь   (Oct)\nNovember  - ноябрь    (Nov)\nDecember  - декабрь   (Dec)' },
        { type: 'tip', value: 'Запомните: "We never deploy on Fridays" — классическая IT-традиция. Дедлайны часто по пятницам: "The sprint ends on Friday, June 15."' },
        { type: 'note', value: 'В Google Calendar и Jira всё на английском: Mon (Monday), Tue (Tuesday), Wed (Wednesday), Thu (Thursday), Fri (Friday). Sprint deadlines часто в пятницу: "Sprint ends on Friday, March 15th." Выучите сокращения — они везде.' },
      ]
    },
    {
      id: 5,
      title: 'Как говорить о времени',
      type: 'theory',
      content: [
        { type: 'text', value: 'Время (clock time) очень важно в IT — дедлайны, логи, timestamps. Нужно уметь читать и говорить о времени.' },
        { type: 'code', language: 'text', value: 'Время по часам:\n9:00  - nine o\'clock / 9 AM\n9:15  - nine fifteen / quarter past nine\n9:30  - nine thirty / half past nine\n9:45  - nine forty-five / quarter to ten\n13:00 - one PM / thirteen hundred\n\nАМ и РМ:\nAM (ante meridiem) - до полудня (00:00-11:59)\nPM (post meridiem) - после полудня (12:00-23:59)\n\nФорматы:\n9:00 AM  = 09:00\n3:00 PM  = 15:00\n12:00 PM = noon (полдень)\n12:00 AM = midnight (полночь)' },
        { type: 'code', language: 'text', value: 'IT timestamps:\n2024-01-15T09:30:00Z\n"January 15, 2024 at 9:30 AM UTC"\n\nНазывание дат:\nJanuary 15, 2024 = January fifteenth, twenty twenty-four\n15/01/2024 = fifteenth of January, twenty twenty-four\n\nДедлайны:\nBy end of day (EOD) - до конца дня\nBy 5 PM tomorrow    - к 17:00 завтра\nBy next Friday      - к следующей пятнице' },
        { type: 'tip', value: 'В международных командах время обычно указывается в UTC: "The deployment is at 14:00 UTC." "The meeting is at 9 AM PST / 5 PM CET." Узнайте часовой пояс ваших коллег. "What time is it for you?" (Какое у тебя время?) — важный вопрос.' },
      ]
    },
    {
      id: 6,
      title: 'Дроби, версии, проценты',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT часто используются дроби для версий, проценты для нагрузки, и специфические числа. Нужно уметь их произносить.' },
        { type: 'code', language: 'text', value: 'Версии программ:\nv1.0     - version one point zero\nv2.5.1   - version two point five point one\nNode 18  - Node eighteen\nPython 3.11 - Python three eleven\n\nПроценты:\n100% - one hundred percent\n80%  - eighty percent\n99.9% uptime - ninety-nine point nine percent uptime\n\nРазмеры и числа:\n4 GB   - four gigabytes\n512 MB - five hundred and twelve megabytes\n1 TB   - one terabyte\n100ms  - one hundred milliseconds\n0.5s   - zero point five seconds\n1,000 users - one thousand users' },
        { type: 'code', language: 'text', value: 'Примеры произношения:\n50%   - fifty percent\n25%   - twenty-five percent\n99.9% - ninety-nine point nine percent\nv2.5  - version two point five\n1/2   - one half / a half\n1/4   - one quarter\n3/4   - three quarters' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Числа и время',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Как по-английски: "Встреча в 14:30"?',
          solution: 'The meeting is at 2:30 PM. / The meeting is at two thirty PM.',
          explanation: '14:30 = 2:30 PM. "at" используется для точного времени.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Прочитайте вслух: "HTTP 404 error"',
          solution: 'HTTP four hundred and four error',
          explanation: '404 = four hundred and four. Ошибка "Not Found".'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Напишите словами: "v2.5.1" версия программы',
          solution: 'version two point five point one',
          explanation: 'Точки в версиях произносятся как "point". v = version.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "Дедлайн — пятница, 15 марта."',
          solution: 'The deadline is Friday, March 15th. / The deadline is on Friday, March fifteenth.',
          explanation: 'Дата = on Friday, March 15th. 15th = fifteenth (порядковое числительное).'
        }
      ]
    }
  ]
}
