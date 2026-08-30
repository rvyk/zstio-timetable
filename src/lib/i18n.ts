import { DAYS_OF_WEEK } from "@/constants/days";

export const LOCALES = ["pl", "uk"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pl";

export const LOCALE_COOKIE = "lang";

export const isLocale = (value?: string): value is Locale =>
  LOCALES.includes(value as Locale);

const DICT = {
  "type.class": { pl: "oddziału", uk: "класу" },
  "type.teacher": { pl: "nauczyciela", uk: "вчителя" },
  "type.room": { pl: "sali", uk: "кабінету" },

  "day.0.long": { pl: "Poniedziałek", uk: "Понеділок" },
  "day.1.long": { pl: "Wtorek", uk: "Вівторок" },
  "day.2.long": { pl: "Środa", uk: "Середа" },
  "day.3.long": { pl: "Czwartek", uk: "Четвер" },
  "day.4.long": { pl: "Piątek", uk: "П'ятниця" },
  "day.5.long": { pl: "Sobota", uk: "Субота" },
  "day.6.long": { pl: "Niedziela", uk: "Неділя" },
  "day.0.short": { pl: "Pon.", uk: "Пн" },
  "day.1.short": { pl: "Wt.", uk: "Вт" },
  "day.2.short": { pl: "Śr.", uk: "Ср" },
  "day.3.short": { pl: "Czw.", uk: "Чт" },
  "day.4.short": { pl: "Pt.", uk: "Пт" },
  "day.5.short": { pl: "Sob.", uk: "Сб" },
  "day.6.short": { pl: "Ndz.", uk: "Нд" },

  skipToPlan: { pl: "Przejdź do planu", uk: "Перейти до розкладу" },

  "school.link": { pl: "Strona szkoły", uk: "Сайт школи" },
  "school.linkAria": {
    pl: "Przejdź na stronę szkoły {school}",
    uk: "Перейти на сайт школи {school}",
  },

  "bottomBar.offline": { pl: "Jesteś offline", uk: "Ви офлайн" },
  "bottomBar.offlineHint": {
    pl: "Brak połączenia z siecią",
    uk: "Немає з'єднання з мережею",
  },
  "bottomBar.pick": { pl: "Wybierz plan", uk: "Виберіть розклад" },
  "bottomBar.pickHint": {
    pl: "Klasa, nauczyciel lub sala",
    uk: "Клас, учитель або кабінет",
  },
  "bottomBar.schedule": {
    pl: "Rozkład zajęć {type}",
    uk: "Розклад занять {type}",
  },
  "bottomBar.prev": { pl: "Poprzedni plan", uk: "Попередній розклад" },
  "bottomBar.next": { pl: "Następny plan", uk: "Наступний розклад" },
  "bottomBar.browse": {
    pl: "Przeglądaj plan zajęć",
    uk: "Переглянути розклад занять",
  },
  "bottomBar.browseHint": {
    pl: "Wybierz klasę, nauczyciela lub salę, aby zobaczyć odpowiedni plan zajęć.",
    uk: "Виберіть клас, учителя або кабінет, щоб побачити відповідний розклад занять.",
  },

  "favorites.add": { pl: "Dodaj do ulubionych", uk: "Додати до обраного" },
  "favorites.remove": { pl: "Usuń z ulubionych", uk: "Видалити з обраного" },
  "favorites.saved": { pl: "Zapisany", uk: "Збережено" },
  "favorites.save": { pl: "Zapisz", uk: "Зберегти" },
  "favorites.added": {
    pl: "Dodano {name} do ulubionych",
    uk: "{name} додано до обраного",
  },
  "favorites.removed": {
    pl: "Usunięto {name} z ulubionych",
    uk: "{name} видалено з обраного",
  },
  "favorites.setDefault": {
    pl: "Ustaw jako domyślny plan",
    uk: "Зробити розкладом за умовчанням",
  },
  "favorites.unsetDefault": {
    pl: "Usuń jako domyślny plan",
    uk: "Прибрати розклад за умовчанням",
  },
  "favorites.defaultSet": {
    pl: "{name} jest teraz domyślnym planem",
    uk: "{name} тепер розклад за умовчанням",
  },
  "favorites.defaultUnset": {
    pl: "{name} nie jest już domyślnym planem",
    uk: "{name} більше не розклад за умовчанням",
  },

  "news.source": { pl: "Aktualności szkoły", uk: "Новини школи" },
  "news.read": {
    pl: "Oznaczono jako przeczytane",
    uk: "Позначено як прочитане",
  },
  "news.open": {
    pl: "Otwórz aktualność: {title}",
    uk: "Відкрити новину: {title}",
  },
  "news.markRead": {
    pl: "Oznacz jako przeczytane",
    uk: "Позначити як прочитане",
  },

  "dates.generated": { pl: "Wygenerowano: ", uk: "Згенеровано: " },
  "dates.validFrom": { pl: "Obowiązuje od: ", uk: "Діє з: " },
  "dates.notFoundStart": { pl: "Szukany plan zajęć", uk: "Шуканий розклад" },
  "dates.notFoundEnd": {
    pl: "nie mógł zostać znaleziony.",
    uk: "не вдалося знайти.",
  },
  "dates.lastUpdated": {
    pl: "Ostatnia aktualizacja:",
    uk: "Останнє оновлення:",
  },

  "lessons.mode.custom": { pl: "Od lekcji", uk: "З уроку" },
  "lessons.mode.aria": { pl: "Lekcje {label}", uk: "Уроки {label}" },
  "lessons.earlier": { pl: "Wcześniejsza lekcja", uk: "Попередній урок" },
  "lessons.later": { pl: "Późniejsza lekcja", uk: "Наступний урок" },
  "lessons.from": { pl: "od {number}. lekcji", uk: "з {number}-го уроку" },

  "timetable.dayTabs": { pl: "Dzień tygodnia", uk: "День тижня" },
  "timetable.schedule": {
    pl: "Rozkład zajęć {type}",
    uk: "Розклад занять {type}",
  },
  "timetable.notFound": {
    pl: "Nie znaleziono planu",
    uk: "Розклад не знайдено",
  },
  "timetable.empty": { pl: "Brak planu zajęć", uk: "Немає розкладу" },
  "timetable.emptyDay": {
    pl: "Na ten dzień nie wprowadzono planu zajęć",
    uk: "На цей день розклад не внесено",
  },
  "timetable.emptyWeek": {
    pl: "Na ten tydzień nie wprowadzono planu zajęć",
    uk: "На цей тиждень розклад не внесено",
  },
  "timetable.break": { pl: "przerwa", uk: "перерва" },
  "timetable.gap": { pl: "okienko", uk: "вікно" },
  "timetable.hour": { pl: "Lekcja", uk: "Урок" },
  "timetable.dayTable": {
    pl: "Plan lekcji na wybrany dzień",
    uk: "Розклад занять на обраний день",
  },
  "timetable.goTo": { pl: "Przejdź do {target}", uk: "Перейти до {target}" },

  "sidebar.expand": {
    pl: "Rozwiń panel boczny",
    uk: "Розгорнути бічну панель",
  },
  "sidebar.collapse": { pl: "Zwiń panel boczny", uk: "Згорнути бічну панель" },
  "sidebar.results": { pl: "Wyniki ({count})", uk: "Результати ({count})" },
  "sidebar.recent": { pl: "Ostatnio wyszukiwane", uk: "Останні пошуки" },
  "sidebar.clearRecent": { pl: "Wyczyść", uk: "Очистити" },
  "sidebar.noResults": { pl: "Brak wyników", uk: "Немає результатів" },
  "sidebar.noMatch": {
    pl: "Nic nie pasuje do „{query}”.",
    uk: "Нічого не знайдено за запитом «{query}».",
  },

  "search.aria": {
    pl: "Szukaj klasy, nauczyciela lub sali",
    uk: "Пошук класу, учителя або кабінету",
  },
  "search.placeholder": {
    pl: "Klasa, nauczyciel, sala…",
    uk: "Клас, учитель, кабінет…",
  },
  "search.clear": { pl: "Wyczyść wyszukiwanie", uk: "Очистити пошук" },

  "list.favorites": { pl: "Ulubione", uk: "Обране" },
  "list.class": { pl: "Klasy", uk: "Класи" },
  "list.teacher": { pl: "Nauczyciele", uk: "Вчителі" },
  "list.room": { pl: "Sale", uk: "Кабінети" },
  "list.empty": { pl: "Nic tu jeszcze nie ma.", uk: "Тут поки нічого немає." },

  "freeRooms.title": { pl: "Wolne sale", uk: "Вільні кабінети" },
  "freeRooms.hint": {
    pl: "Cały tydzień naraz — wybierz kratkę, żeby zobaczyć listę",
    uk: "Цілий тиждень одразу — виберіть клітинку, щоб побачити список",
  },
  "freeRooms.back": { pl: "Plan", uk: "Розклад" },
  "freeRooms.backLabel": {
    pl: "Wróć do planu",
    uk: "Повернутися до розкладу",
  },
  "freeRooms.selection": {
    pl: "{day}, lekcja {number} ({from}–{to}) — {count} wolnych",
    uk: "{day}, урок {number} ({from}–{to}) — вільних: {count}",
  },
  "freeRooms.none": { pl: "brak wolnych", uk: "немає вільних" },
  "freeRooms.count": { pl: "{count} wolnych", uk: "вільних: {count}" },
  "freeRooms.now": { pl: "Teraz", uk: "Зараз" },

  "offline.title": { pl: "Jesteś offline", uk: "Ви офлайн" },
  "offline.description": {
    pl: "Złap zasięg, żeby załadować plan zajęć. Ostatnio otwarte plany zostały zapisane i działają bez internetu.",
    uk: "Спіймайте сигнал, щоб завантажити розклад. Раніше відкриті розклади збережено — вони працюють без інтернету.",
  },

  "print.noData": {
    pl: "Brak danych planu lekcji — wróć na stronę główną, aby go wczytać.",
    uk: "Немає даних розкладу — поверніться на головну сторінку, щоб завантажити його.",
  },

  "changes.title": { pl: "Plan się zmienił", uk: "Розклад змінився" },
  "changes.summary": {
    pl: "Zmiany od twojej ostatniej wizyty: {count}",
    uk: "Змін від вашого останнього візиту: {count}",
  },
  "changes.show": { pl: "Pokaż zmiany", uk: "Показати зміни" },
  "changes.hide": { pl: "Ukryj zmiany", uk: "Сховати зміни" },
  "changes.dismiss": { pl: "Wiem, ukryj", uk: "Зрозуміло, сховати" },
  "changes.dismissed": {
    pl: "Zapamiętano obecny plan",
    uk: "Поточний розклад запам'ятано",
  },
  "changes.lesson": {
    pl: "{day}, lekcja {number}",
    uk: "{day}, урок {number}",
  },
  "changes.added": { pl: "dodano: {what}", uk: "додано: {what}" },
  "changes.removed": { pl: "usunięto: {what}", uk: "видалено: {what}" },
  "changes.more": { pl: "i {count} więcej", uk: "та ще {count}" },

  "settings.install": {
    pl: "Zainstaluj aplikację",
    uk: "Встановити застосунок",
  },
  "settings.installHint": {
    pl: "Szybki dostęp z ekranu głównego, działa offline",
    uk: "Швидкий доступ з головного екрана, працює офлайн",
  },
  "settings.installError": {
    pl: "Nie można zainstalować aplikacji",
    uk: "Не вдалося встановити застосунок",
  },
  "settings.installErrorHint": {
    pl: "Twoja przeglądarka nie obsługuje tej funkcji",
    uk: "Ваш браузер не підтримує цю функцію",
  },
  "settings.calendar": {
    pl: "Subskrybuj kalendarz",
    uk: "Підписатися на календар",
  },
  "settings.calendarHint": {
    pl: "Plan {title} w kalendarzu, odświeżany automatycznie",
    uk: "Розклад {title} у календарі, оновлюється автоматично",
  },
  "settings.calendarCopied": {
    pl: "Skopiowano link do kalendarza",
    uk: "Скопійовано посилання на календар",
  },
  "settings.calendarCopyFailed": {
    pl: "Skopiuj link do kalendarza ręcznie",
    uk: "Скопіюйте посилання на календар вручну",
  },
  "settings.calendarCopiedHint": {
    pl: "Jeśli kalendarz się nie otworzył, wklej link w opcji „Dodaj z adresu URL”",
    uk: "Якщо календар не відкрився, вставте посилання в «Додати з URL»",
  },
  "settings.calendarError": {
    pl: "Nie można wygenerować pliku kalendarza",
    uk: "Не вдалося створити файл календаря",
  },
  "settings.calendarEmpty": {
    pl: "Brak wydarzeń do wyeksportowania w obecnym planie lekcji",
    uk: "У поточному розкладі немає подій для експорту",
  },
  "settings.print": { pl: "Drukuj plan", uk: "Друкувати розклад" },
  "settings.printHint": {
    pl: "Wersja do druku i zapisu do PDF",
    uk: "Версія для друку та збереження у PDF",
  },
  "settings.freeRoomsHint": {
    pl: "Cały tydzień z podziałem na dni i lekcje",
    uk: "Цілий тиждень за днями та уроками",
  },
  "settings.otherTimetables": {
    pl: "Inne wersje planu:",
    uk: "Інші версії розкладу:",
  },
  "settings.sourceTimetable": {
    pl: "Oryginalny",
    uk: "Оригінальний",
  },
  "settings.altTimetable": {
    pl: "Alternatywny",
    uk: "Альтернативний",
  },
  "settings.menu": { pl: "Dodatkowe funkcje", uk: "Додаткові функції" },
  "settings.menuOpen": {
    pl: "Otwórz dodatkowe funkcje",
    uk: "Відкрити додаткові функції",
  },
  "settings.menuHint": {
    pl: "Instalacja aplikacji, eksport do kalendarza, druk, wolne sale, język i wybór motywu.",
    uk: "Встановлення застосунку, експорт до календаря, друк, вільні кабінети, мова та вибір теми.",
  },

  "theme.label": { pl: "Motyw", uk: "Тема" },
  "theme.light": { pl: "Jasny", uk: "Світла" },
  "theme.dark": { pl: "Ciemny", uk: "Темна" },
  "theme.system": { pl: "Auto", uk: "Авто" },

  "language.label": { pl: "Język", uk: "Мова" },

  "a11y.label": { pl: "Dostępność", uk: "Доступність" },
  "a11y.summary": {
    pl: "Tekst, kontrast, animacje",
    uk: "Текст, контраст, анімації",
  },
  "a11y.active": {
    pl: "Włączone: {count} z 3",
    uk: "Увімкнено: {count} з 3",
  },
  "a11y.text": { pl: "Większy tekst", uk: "Більший текст" },
  "a11y.textHint": {
    pl: "Powiększa całą aplikację",
    uk: "Збільшує весь застосунок",
  },
  "a11y.contrast": { pl: "Wyższy kontrast", uk: "Вищий контраст" },
  "a11y.contrastHint": {
    pl: "Mocniejszy tekst i linie",
    uk: "Чіткіший текст і лінії",
  },
  "a11y.motion": { pl: "Mniej animacji", uk: "Менше анімацій" },
  "a11y.motionHint": {
    pl: "Wyłącza ruch i przejścia",
    uk: "Вимикає рух і переходи",
  },
} satisfies Record<string, Record<Locale, string>>;

export type TranslationKey = keyof typeof DICT;

export type TranslationVars = Record<string, string | number>;

export const t = (
  locale: Locale,
  key: TranslationKey,
  vars?: TranslationVars,
): string => {
  const value = DICT[key][locale];
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
};

export type Translate = (key: TranslationKey, vars?: TranslationVars) => string;

export const dayLabel = (
  locale: Locale,
  dayName: string,
  variant: "long" | "short",
): string => {
  const day = DAYS_OF_WEEK.find(
    (entry) => entry.long === dayName || entry.short === dayName,
  );
  if (!day) return dayName;
  return t(locale, `day.${day.index}.${variant}` as TranslationKey);
};
