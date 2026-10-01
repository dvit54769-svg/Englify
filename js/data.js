/* =====================================================================
   Englify: learning content
   Levels (A1, A2, B1) x six skills. Each lesson has:
   - learn: short notes shown before practice
   - items: exercises (mc, type, listen, speak, write)
   - passage: reading text (reading lessons only)
   ===================================================================== */
(function () {
  var E = (window.Englify = window.Englify || {});

  E.LEVELS = {
    A1: { code: "A1", name: "Beginner", color: "blue", desc: "Start from the basics: greetings, family, food, numbers and simple sentences.", can: "Introduce yourself and understand very simple English." },
    A2: { code: "A2", name: "Elementary", color: "purple", desc: "Talk about daily life, past events, shopping and travel with confidence.", can: "Handle everyday situations and describe routines and past events." },
    B1: { code: "B1", name: "Intermediate", color: "orange", desc: "Share opinions, understand announcements and write longer texts.", can: "Express opinions, plans and experiences in clear English." },
  };

  E.SKILLS = {
    grammar: { name: "Grammar", icon: "spell", color: "blue", desc: "Sentence structure and verb forms" },
    vocabulary: { name: "Vocabulary", icon: "language", color: "purple", desc: "Words, meanings and examples" },
    listening: { name: "Listening", icon: "headphones", color: "orange", desc: "Audio with comprehension questions" },
    speaking: { name: "Speaking", icon: "mic", color: "blue", desc: "Guided speaking prompts" },
    reading: { name: "Reading", icon: "book", color: "purple", desc: "Short passages with questions" },
    writing: { name: "Writing", icon: "pen", color: "orange", desc: "Prompts with a word counter" },
  };

  // ---- helpers to keep the data readable ----
  function mc(q, o, a, e) { return { t: "mc", q: q, o: o, a: a, e: e || "" }; }
  function ty(q, a, e) { return { t: "type", q: q, a: a, e: e || "" }; }
  function li(say, q, o, a, e) { return { t: "listen", say: say, q: q, o: o, a: a, e: e || "" }; }
  function sp(say) { return { t: "speak", say: say }; }
  function wr(q, min, tip) { return { t: "write", q: q, min: min, tip: tip || "" }; }

  E.COURSES = {
    /* ================================ A1 ================================ */
    A1: {
      grammar: {
        title: "To be, a / an and plurals",
        summary: "Learn am, is, are, the articles a and an, and simple plural nouns.",
        learn: [
          { h: "To be: am, is, are", p: "Use am with I, is with he, she and it, and are with you, we and they.", ex: ["I am a student.", "She is happy.", "They are at school."] },
          { h: "Articles: a and an", p: "Use a before a consonant sound and an before a vowel sound.", ex: ["a book", "an apple", "an egg"] },
          { h: "Plural nouns", p: "Add -s to make most plurals. Add -es after s, x, ch and sh.", ex: ["book \u2192 books", "box \u2192 boxes", "bus \u2192 buses"] },
        ],
        items: [
          mc("She ___ a teacher.", ["am", "is", "are", "be"], 1, "Use is with she, he and it."),
          mc("We ___ from Cambodia.", ["is", "am", "are", "be"], 2, "Use are with we, you and they."),
          mc("I have ___ apple.", ["a", "an", "two", "many"], 1, "Apple starts with a vowel sound, so we use an."),
          mc("There are two ___ on the table.", ["book", "books", "bookes", "a book"], 1, "Two means more than one, so add -s."),
          mc("___ your name Dara?", ["Am", "Is", "Are", "Be"], 1, "Your name is one thing, so use is."),
          mc("They ___ not at home.", ["is", "am", "are", "be"], 2, "Use are with they."),
        ],
      },
      vocabulary: {
        title: "Greetings, family and food",
        summary: "Everyday words you need in the first days of learning English.",
        learn: [
          { h: "Greetings", ex: ["hello", "good morning", "good night", "goodbye", "please", "thank you"] },
          { h: "Family", ex: ["mother", "father", "sister", "brother", "grandmother", "grandfather"] },
          { h: "Food and drink", ex: ["rice", "fish", "bread", "fruit", "water", "milk"] },
          { h: "Days of the week", ex: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        ],
        items: [
          mc("What do you say in the morning?", ["Good night", "Good morning", "Goodbye", "Sorry"], 1, "We say good morning before noon."),
          mc("Your mother's mother is your ___.", ["aunt", "sister", "grandmother", "daughter"], 2, "Your mother's mother is your grandmother."),
          mc("Which word is a color?", ["green", "chair", "apple", "Monday"], 0, "Green is a color."),
          ty("Type the number: seven + three = ___", ["ten", "10"], "Seven plus three is ten."),
          ty("The day after Monday is ___.", ["tuesday"], "After Monday comes Tuesday."),
          mc("We drink ___.", ["rice", "bread", "water", "fruit"], 2, "We drink water and eat the other things."),
        ],
      },
      listening: {
        title: "Numbers, times and simple facts",
        summary: "Listen for ages, numbers, times and days.",
        learn: [
          { h: "Listening tips", ul: ["Read the question first, then listen.", "Listen for numbers, times, names and days.", "You can play the audio as many times as you like."] },
        ],
        items: [
          li("Hello, my name is Sokha. I am fourteen years old.", "How old is Sokha?", ["twelve", "fourteen", "fifteen", "forty"], 1, "Fourteen (14) is different from forty (40)."),
          li("I have two brothers and one sister.", "How many brothers does the speaker have?", ["one", "two", "three", "four"], 1, "The speaker has two brothers."),
          li("The bus is at seven thirty.", "What time is the bus?", ["7:13", "7:30", "3:07", "7:03"], 1, "Seven thirty means 7:30."),
          li("I like rice and fish for lunch.", "What does the speaker like for lunch?", ["rice and fish", "bread and eggs", "noodles and chicken", "fruit and milk"], 0, "The speaker likes rice and fish."),
          li("Today is Friday. The market is open.", "What day is it?", ["Monday", "Thursday", "Friday", "Sunday"], 2, "The speaker says today is Friday."),
          li("She is at school. Her book is on the table.", "Where is her book?", ["in her bag", "on the table", "at school", "under the chair"], 1, "Her book is on the table."),
        ],
      },
      speaking: {
        title: "Introduce yourself",
        summary: "Say simple sentences about yourself out loud.",
        learn: [
          { h: "Speaking tips", ul: ["Listen to the model sentence first.", "Say each sentence slowly and clearly.", "Repeat it two or three times."] },
        ],
        items: [
          sp("Hello, my name is Dara. Nice to meet you."),
          sp("I live in Phnom Penh."),
          sp("I like rice and fish."),
          sp("What time is it?"),
        ],
      },
      reading: {
        title: "A day in the life of Sokha",
        summary: "Read a short text and answer simple questions.",
        passage: "Sokha is a student. He is fourteen years old. He lives in Phnom Penh with his mother, father and sister. Every morning he eats rice and eggs. Then he goes to school by bike. His favorite subject is English.",
        learn: [
          { h: "Reading tips", ul: ["Read the whole text once.", "Then read each question and find the answer in the text.", "Look for names, numbers and places."] },
        ],
        items: [
          mc("How old is Sokha?", ["twelve", "fourteen", "sixteen", "fifteen"], 1, "The text says he is fourteen years old."),
          mc("Where does Sokha live?", ["Siem Reap", "Battambang", "Phnom Penh", "Kampot"], 2, "He lives in Phnom Penh."),
          mc("What does he eat in the morning?", ["noodles and fish", "rice and eggs", "bread and milk", "fruit"], 1, "Every morning he eats rice and eggs."),
          mc("How does he go to school?", ["by bus", "by bike", "on foot", "by car"], 1, "He goes to school by bike."),
          mc("What is his favorite subject?", ["math", "science", "English", "art"], 2, "His favorite subject is English."),
        ],
      },
      writing: {
        title: "About me and my family",
        summary: "Write short, simple texts about yourself.",
        learn: [
          { h: "Writing tips", ul: ["Start every sentence with a capital letter.", "End every sentence with a period.", "Use simple words: I am, I have, I like.", "Use and to join two ideas."] },
        ],
        items: [
          wr("Write 3 sentences about yourself. Include your name, your age and where you live.", 15, "Example: My name is Dara. I am sixteen. I live in Phnom Penh."),
          wr("Write about your family. Use the words mother, father, brother or sister.", 15, "Example: I have a mother, a father and one sister."),
          wr("Write about your favorite food. Say what it is and when you eat it.", 12, "Example: My favorite food is rice. I eat it every day."),
        ],
      },
    },

    /* ================================ A2 ================================ */
    A2: {
      grammar: {
        title: "Present, past and comparisons",
        summary: "Use the present simple, present continuous, past simple and comparatives.",
        learn: [
          { h: "Present simple and present continuous", p: "Use the present simple for habits and facts. Use the present continuous (am / is / are + -ing) for actions happening now.", ex: ["She goes to school every day.", "Look! It is raining."] },
          { h: "Past simple", p: "Add -ed to regular verbs. Many common verbs are irregular.", ex: ["watch \u2192 watched", "go \u2192 went", "have \u2192 had"] },
          { h: "Comparatives", p: "Add -er to short adjectives. Use more before long adjectives.", ex: ["cheap \u2192 cheaper", "expensive \u2192 more expensive"] },
        ],
        items: [
          mc("She usually ___ to school by bus.", ["go", "goes", "going", "is go"], 1, "Use goes with she in the present simple."),
          mc("Look! It ___ now.", ["rains", "rain", "is raining", "rained"], 2, "Use the present continuous for something happening now."),
          mc("Yesterday we ___ a movie.", ["watch", "watched", "watching", "watches"], 1, "Yesterday needs the past simple: watched."),
          mc("I ___ to the market last Sunday.", ["go", "going", "went", "goed"], 2, "Go is irregular: the past is went."),
          mc("This bag is ___ than that one.", ["cheap", "cheaper", "more cheap", "cheapest"], 1, "Cheap is short, so add -er."),
          mc("___ you like coffee?", ["Do", "Does", "Are", "Is"], 0, "Use do with you in present simple questions."),
        ],
      },
      vocabulary: {
        title: "Jobs, travel, shopping and weather",
        summary: "Words for everyday life outside the home.",
        learn: [
          { h: "Jobs", ex: ["chef", "doctor", "nurse", "driver", "farmer", "teacher"] },
          { h: "Travel", ex: ["passport", "ticket", "airport", "arrive", "leave", "luggage"] },
          { h: "Shopping", ex: ["cheap", "expensive", "discount", "receipt"] },
          { h: "Weather", ex: ["sunny", "cloudy", "windy", "rainy", "hot", "cold"] },
        ],
        items: [
          mc("A person who cooks food in a restaurant is a ___.", ["driver", "chef", "nurse", "farmer"], 1, "A chef cooks food."),
          mc("Where do you send letters?", ["post office", "bakery", "library", "airport"], 0, "You send letters at the post office."),
          ty("Type the opposite of 'expensive'.", ["cheap"], "Cheap is the opposite of expensive."),
          mc("Water falls from the sky and it is wet outside. It is ___.", ["sunny", "windy", "rainy", "cloudy"], 2, "Rainy weather means it is raining."),
          ty("Type the opposite of 'arrive'.", ["leave", "depart"], "The opposite of arrive is leave."),
          mc("A ___ helps sick people in a hospital.", ["teacher", "doctor", "singer", "waiter"], 1, "Doctors help sick people."),
        ],
      },
      listening: {
        title: "Directions, prices and plans",
        summary: "Understand short conversations about everyday situations.",
        learn: [
          { h: "Listening tips", ul: ["Underline the key word in each question.", "Numbers and prices can sound similar: 15 and 50.", "Listen a second time to check your answer."] },
        ],
        items: [
          li("Excuse me, does this bus go to the airport? Yes, but you need bus number twelve.", "Which bus goes to the airport?", ["bus 2", "bus 12", "bus 20", "bus 21"], 1, "The speaker says bus number twelve."),
          li("I usually get up at six, but on Sundays I sleep until nine.", "When does the speaker sleep until nine?", ["every day", "on Saturdays", "on Sundays", "on Mondays"], 2, "The speaker sleeps until nine on Sundays."),
          li("The weather today is hot and sunny, but tomorrow it will rain.", "What will the weather be like tomorrow?", ["hot and sunny", "rainy", "cold", "windy"], 1, "Tomorrow it will rain."),
          li("I would like a small coffee and a piece of cake, please. That is four dollars fifty.", "How much is it?", ["$4.15", "$4.50", "$5.40", "$14.50"], 1, "Four dollars fifty is $4.50."),
          li("My sister works in a hospital. She starts at eight and finishes at four.", "What time does she finish work?", ["4:00", "8:00", "5:00", "6:00"], 0, "She finishes at four."),
          li("We went to the beach last weekend. The water was warm, so we swam for two hours.", "How long did they swim?", ["one hour", "two hours", "three hours", "all day"], 1, "They swam for two hours."),
        ],
      },
      speaking: {
        title: "Daily life and simple requests",
        summary: "Say longer sentences about routines, the past and polite requests.",
        learn: [
          { h: "Speaking tips", ul: ["Group words into small chunks: I usually wake up / at six o'clock.", "Stress the important words.", "Slow down for numbers and times."] },
        ],
        items: [
          sp("I usually wake up at six o'clock and have breakfast with my family."),
          sp("Yesterday I went to the market and bought some vegetables."),
          sp("Could you tell me how to get to the bus station, please?"),
          sp("This phone is more expensive than that one, but it is better."),
        ],
      },
      reading: {
        title: "Dara's job at the caf\u00e9",
        summary: "Read a short story about work and daily life.",
        passage: "Dara works in a small caf\u00e9 in Siem Reap. She starts work at seven o'clock in the morning and finishes at three in the afternoon. Last month she learned to make coffee and bake bread. She likes her job because she meets people from many countries. In the evening she studies English for one hour. Next year she wants to travel to Australia.",
        learn: [
          { h: "Reading tips", ul: ["Skim the text first to get the main idea.", "Then scan for the exact detail in the question.", "Time words (in the morning, last month, next year) tell you when."] },
        ],
        items: [
          mc("Where does Dara work?", ["in a school", "in a small caf\u00e9", "in a hospital", "in a shop"], 1, "She works in a small caf\u00e9 in Siem Reap."),
          mc("What time does she finish work?", ["7 a.m.", "3 p.m.", "3 a.m.", "7 p.m."], 1, "She finishes at three in the afternoon."),
          mc("What did she learn last month?", ["to drive", "to make coffee and bake bread", "to speak Chinese", "to swim"], 1, "Last month she learned to make coffee and bake bread."),
          mc("Why does she like her job?", ["She meets people from many countries", "It is near her house", "She earns a lot", "She works alone"], 0, "She likes it because she meets people from many countries."),
          mc("What does she want to do next year?", ["move to Phnom Penh", "travel to Australia", "open a caf\u00e9", "study medicine"], 1, "She wants to travel to Australia next year."),
        ],
      },
      writing: {
        title: "Routines, trips and invitations",
        summary: "Write about your day, a past trip and a short message.",
        learn: [
          { h: "Writing tips", ul: ["Use time words: in the morning, at noon, last weekend.", "Use the past simple for finished events.", "Join ideas with because and but."] },
        ],
        items: [
          wr("Describe your daily routine. Write at least 4 sentences using time words such as in the morning, at noon and in the evening.", 30, "Example: In the morning I get up at six. Then I ..."),
          wr("Write about a trip you took. Say where you went, who you went with and what you did. Use the past simple.", 35, "Example: Last year I went to Kampot with my family. We ..."),
          wr("Write a short message to a friend to invite them to your birthday party. Give the day, the time and the place.", 25, "Example: Hi Sophea! I am having a party on Saturday at 5 p.m. ..."),
        ],
      },
    },

    /* ================================ B1 ================================ */
    B1: {
      grammar: {
        title: "Perfect tenses, conditionals and passive",
        summary: "Use the present perfect, first conditional, passive voice, modals and relative clauses.",
        learn: [
          { h: "Present perfect", p: "Use have / has + past participle for experiences and for situations that started in the past and continue now. Use since with a point in time and for with a period.", ex: ["I have lived here since 2020.", "She has worked here for three years."] },
          { h: "First conditional", p: "Use if + present simple, then will + verb, for real possibilities in the future.", ex: ["If it rains, we will stay at home."] },
          { h: "Passive voice", p: "Use be + past participle when the action is more important than who did it.", ex: ["The bridge was built in 1995."] },
          { h: "Modals and relative clauses", p: "Use must for strong obligation. Use who for people and which for things.", ex: ["You must wear a helmet.", "The woman who lives next door is a doctor."] },
        ],
        items: [
          mc("I ___ in this city since 2020.", ["live", "lived", "have lived", "am living"], 2, "Since 2020 connects the past to now: present perfect."),
          mc("If it rains tomorrow, we ___ at home.", ["stay", "will stay", "stayed", "would stay"], 1, "First conditional: if + present simple, will + verb."),
          mc("The bridge ___ in 1995.", ["built", "was built", "is built", "has built"], 1, "Use the passive past: was built."),
          mc("You ___ wear a helmet. It is the law.", ["must", "might", "would", "could"], 0, "Must shows a strong obligation."),
          mc("The woman ___ lives next door is a doctor.", ["which", "who", "whose", "where"], 1, "Use who for people."),
          mc("I ___ TV when the phone rang.", ["watch", "watched", "was watching", "am watching"], 2, "Use the past continuous for an action in progress when another action happened."),
        ],
      },
      vocabulary: {
        title: "Work, health, environment and phrasal verbs",
        summary: "Words and phrasal verbs for work, health and modern life.",
        learn: [
          { h: "Work", ex: ["colleague", "manager", "deadline", "salary", "interview"] },
          { h: "Phrasal verbs", ex: ["give up", "look forward to", "find out", "take care of", "run out of"] },
          { h: "Health and environment", ex: ["medicine", "exercise", "pollution", "recycle", "environment"] },
        ],
        items: [
          mc("The phrasal verb 'give up' means...", ["start", "stop trying", "continue", "remember"], 1, "To give up is to stop trying."),
          mc("Which word describes someone who enjoys meeting new people?", ["shy", "outgoing", "lazy", "rude"], 1, "An outgoing person is friendly and sociable."),
          ty("Type the word: a person you work with in a company is a ______.", ["colleague", "coworker", "co-worker"], "A colleague is a person you work with."),
          mc("Plastic bags are bad for the ___.", ["environment", "employment", "agreement", "appointment"], 0, "Plastic causes pollution and harms the environment."),
          mc("I have a terrible headache. I should take some ___.", ["medicine", "furniture", "luggage", "homework"], 0, "Medicine helps when you are ill."),
          mc("'Look forward to' means...", ["remember", "feel excited about something in the future", "forget", "avoid"], 1, "You look forward to something you are happy about in the future."),
        ],
      },
      listening: {
        title: "Announcements and opinions",
        summary: "Understand phone messages, announcements and opinions.",
        learn: [
          { h: "Listening tips", ul: ["Predict the topic from the question.", "Listen for reasons: because, so, unfortunately.", "Check dates and times carefully."] },
        ],
        items: [
          li("Thanks for calling. Unfortunately, the manager is in a meeting until three. Could you call back later, or I can take a message.", "Why can't the caller speak to the manager?", ["He is on holiday", "He is in a meeting", "He left the company", "He is sick"], 1, "The manager is in a meeting until three."),
          li("The train to Bangkok has been delayed by forty minutes because of bad weather. We apologize for the inconvenience.", "Why is the train late?", ["a technical problem", "a strike", "bad weather", "too many passengers"], 2, "The delay is because of bad weather."),
          li("I used to live in the countryside, but I moved to the city for work. I miss the quiet, though.", "What does the speaker miss?", ["his job", "the quiet", "the city", "his friends"], 1, "The speaker misses the quiet."),
          li("The library will close early on Friday at four o'clock, instead of the usual six, for staff training.", "When does the library close on Friday?", ["at 6:00", "at 4:00", "at 5:00", "at noon"], 1, "It closes at four o'clock on Friday."),
          li("If you want to save money, I suggest cooking at home more often and taking the bus instead of a taxi.", "What does the speaker suggest?", ["working more", "cooking at home and taking the bus", "buying a car", "eating out"], 1, "The speaker suggests cooking at home and taking the bus."),
          li("Our new course starts on the fifth of March and lasts eight weeks. Registration closes on the twentieth of February.", "When does registration close?", ["5 March", "20 February", "8 March", "20 March"], 1, "Registration closes on the twentieth of February."),
        ],
      },
      speaking: {
        title: "Opinions and longer sentences",
        summary: "Give opinions and use more complex sentences.",
        learn: [
          { h: "Speaking tips", ul: ["Use opinion phrases: In my opinion, I think that.", "Pause at commas to sound natural.", "Record yourself or repeat until it feels smooth."] },
        ],
        items: [
          sp("In my opinion, learning English opens many doors for young people."),
          sp("I have been studying English for two years, and I want to improve my speaking."),
          sp("If I had more free time, I would travel around Southeast Asia."),
          sp("Although the weather was bad, we decided to continue the trip."),
        ],
      },
      reading: {
        title: "Phones: benefits and balance",
        summary: "Read a short article and understand main ideas and details.",
        passage: "Many young people today spend hours on their phones. Some experts say this can cause problems, such as poor sleep and less time with family. However, phones also have benefits: students can learn languages, find information quickly and stay in touch with friends who live far away. The key, experts say, is balance. Setting limits, for example turning off notifications during study time or keeping phones out of the bedroom, can help people enjoy the benefits without the problems.",
        learn: [
          { h: "Reading tips", ul: ["Find the main idea of each sentence: problems, benefits, advice.", "Guess new words from the words around them.", "Words like however and for example show contrast and examples."] },
        ],
        items: [
          mc("What problems can too much phone use cause?", ["poor sleep and less family time", "bad eyesight only", "higher prices", "noisy homes"], 0, "The text mentions poor sleep and less time with family."),
          mc("Which benefit of phones is mentioned?", ["They make food cheaper", "Students can learn languages", "They improve the weather", "They replace teachers"], 1, "Students can learn languages."),
          mc("What is the key, according to experts?", ["buying a new phone", "balance", "stopping completely", "using more apps"], 1, "Experts say the key is balance."),
          mc("Which is an example of setting limits?", ["turning off notifications during study time", "playing games longer", "sleeping with the phone", "buying more data"], 0, "The text gives this example."),
          mc("The word 'benefits' is closest in meaning to...", ["problems", "advantages", "prices", "rules"], 1, "Benefits are advantages."),
        ],
      },
      writing: {
        title: "Opinions, emails and descriptions",
        summary: "Write an opinion paragraph, a formal email and a description.",
        learn: [
          { h: "Writing tips", ul: ["Give your opinion: In my opinion, I think that.", "Support it with reasons: firstly, secondly, because.", "Finish with a short conclusion."] },
        ],
        items: [
          wr("Do you think students should study online or in a classroom? Give your opinion and two reasons.", 60, "Start with: In my opinion, ... Then give two reasons and a conclusion."),
          wr("Write an email to a hotel to ask about a room. Include the dates, the number of people and one question.", 50, "Start with Dear Sir or Madam and end with Yours faithfully."),
          wr("Describe a person who has influenced you and explain why.", 60, "Say who the person is, what they did and how they helped you."),
        ],
      },
    },
  };

  /* ---------------- Level test: 15 questions, easy to hard ---------------- */
  E.TEST = [
    mc("My brother ___ ten years old.", ["am", "is", "are", "be"], 1),
    mc("There are three ___ in the room.", ["chair", "chairs", "a chair", "chaired"], 1),
    mc("Which word is a fruit?", ["table", "mango", "blue", "Friday"], 1),
    mc("I ___ breakfast at seven o'clock.", ["has", "have", "having", "am have"], 1),
    mc("Where ___ you from?", ["is", "am", "are", "do"], 2),
    mc("Yesterday I ___ my friend in the park.", ["meet", "met", "meeting", "meets"], 1),
    mc("She is ___ than her sister.", ["tall", "taller", "more tall", "tallest"], 1),
    mc("I'm ___ a book at the moment.", ["read", "reads", "reading", "readed"], 2),
    mc("You can buy medicine at a ___.", ["pharmacy", "bakery", "stadium", "museum"], 0),
    mc("___ is the nearest bank? It is next to the post office.", ["What", "Where", "Who", "When"], 1),
    mc("I have never ___ to Japan.", ["be", "been", "was", "being"], 1),
    mc("If I ___ more money, I would buy a bigger house.", ["have", "had", "will have", "would have"], 1),
    mc("The report ___ by the manager yesterday.", ["wrote", "was written", "is written", "has written"], 1),
    mc("He ___ go to school by bike when he was young.", ["used to", "uses to", "use to", "is used to"], 0),
    mc("She asked me ___ I wanted tea or coffee.", ["that", "whether", "what", "who"], 1),
  ];

  E.LEVEL_KEYS = ["A1", "A2", "B1"];
  E.SKILL_KEYS = ["grammar", "vocabulary", "listening", "speaking", "reading", "writing"];
})();
