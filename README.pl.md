![App screenshot](src/assets/school-og.png)

Polska wersja / [English version](README.md)

# ✨ ZSTiO Timetable 🚀

Nowoczesna i odświeżona aplikacja planu lekcji dla Zespołu Szkół Technicznych i Ogólnokształcących (ZSTiO), stworzona z wykorzystaniem najnowszych technologii webowych. Ta intuicyjna aplikacja ułatwia dostęp do planów zajęć, oferując bezproblemową obsługę dla uczniów, nauczycieli i pracowników.

## 🚀 Najważniejsze Funkcje

- **Uniwersalna Kompatybilność 🌍:** Przystosowana do każdej szkoły korzystającej z planów UONET. Wystarczy skonfigurować zmienną środowiskową `NEXT_PUBLIC_TIMETABLE_URL`.
- **Układ Dopasowany do Ekranu 🗓️:** Widok dzienny na telefonie, tabela całego tygodnia na desktopie.
- **Ulubione ⭐:** Zapisz najczęściej przeglądane klasy, nauczycieli i sale, a jeden z nich ustaw jako plan domyślny otwierany po wejściu na stronę.
- **Wygodne Wyszukiwanie Wolnych Sal 🔎:** Szybko sprawdź dostępne sale według dnia i numeru lekcji.
- **Inteligentne Skrócone Lekcje ⏱️:** Automatyczna adaptacja planu do skróconych godzin lekcyjnych.
- **Podgląd Trwającej Lekcji ⏳:** Widzisz aktualną lekcję, trwającą przerwę i pozostały czas.
- **Subskrypcja Kalendarza (webcal) 📅:** Zasubskrybuj aktualizowany na bieżąco kanał `webcal://` w aplikacji kalendarza lub Google Calendar — z automatycznym pominięciem świąt i ferii.
- **Wykrywanie Zmian w Planie 🔔:** Opcjonalny watcher wykrywa zmiany w planie i wysyła je na webhooka Discorda.
- **Aktualności Szkolne 📰:** Opcjonalnie pobiera najnowsze wpisy ze strony szkoły i pokazuje je jako powiadomienie, które można zamknąć.
- **Wielojęzyczny Interfejs 🌐:** Pełne tłumaczenia polskie i ukraińskie.
- **Nawigacja Klawiaturą ⌨️:** Poruszaj się po dniach i lekcjach bez użycia myszki.
- **Wersja do Druku 🖨️:** Osobny widok wydruku dla czytelnej kopii papierowej.
- **Responsywny Interfejs na Wszystkich Urządzeniach 📱💻:** Przeglądaj plan lekcji z dowolnego urządzenia dzięki spójnemu i intuicyjnemu interfejsowi.
- **Elegancki Tryb Ciemny 🌙:** Przełączaj się między jasnym i ciemnym motywem dla komfortu użytkowania.
- **Dostęp Offline dzięki PWA 🔌:** Zainstaluj aplikację jako PWA (Progressive Web App) dla szybszego ładowania i pracy offline.
- **Zaawansowane Śledzenie Błędów (Sentry) ⚠️:** Integracja z Sentry umożliwia monitorowanie błędów i stabilność działania.
- **Łatwe Wdrażanie z Dockerem 🐳:** Dzięki dołączonemu plikowi Dockerfile wdrażanie jest szybkie i gwarantuje spójność środowiska.

## 💻 Wykorzystane technologie

- **Next.js 16 (App Router, Turbopack):** Framework Reacta do aplikacji produkcyjnych.
- **React 19:** Z komponentami serwerowymi i Server Actions.
- **TypeScript:** Zapewnia typowanie i lepsze doświadczenia dla programistów.
- **Tailwind CSS v4:** Szybkie tworzenie nowoczesnych interfejsów użytkownika.
- **shadcn/ui:** Piękne i dostępne komponenty interfejsu.
- **@majusss/timetable-parser:** Wydajne przetwarzanie danych i parsing.
- **Zustand:** Lekki i wydajny system zarządzania stanem.
- **Next Themes:** Proste przełączanie motywów.
- **Serwist:** Service worker i cache PWA.
- **ics:** Generowanie kalendarza w formacie ICS.
- **@t3-oss/env-nextjs + Zod:** Walidowane, typowane zmienne środowiskowe.
- **Vercel Analytics:** Opcjonalna analityka użycia.
- **Sentry:** Śledzenie błędów i monitorowanie wydajności w czasie rzeczywistym.
- **Docker:** Konteneryzacja ułatwiająca wdrożenie.

## Instalacja i Konfiguracja

1. **Sklonuj repozytorium:**

   ```bash
   git clone https://github.com/rvyk/zstio-timetable.git
   cd zstio-timetable
   ```

2. **Zainstaluj zależności:**

   ```bash
   pnpm install
   ```

3. **Skonfiguruj zmienne środowiskowe:**

   Utwórz plik `.env.local` na podstawie `.env.example` i ustaw:
   - **`NEXT_PUBLIC_TIMETABLE_URL` (wymagane):** URL do planu lekcji Twojej szkoły (UONET).
   - **`NEXT_PUBLIC_APP_URL` (wymagane):** Podstawowy URL aplikacji.
   - **`NEXT_PUBLIC_SCHOOL_NEWS_URL` (opcjonalne):** Endpoint REST WordPressa używany do powiadomień o aktualnościach szkolnych.
   - **`NEXT_PUBLIC_ALT_TIMETABLE_URL` (opcjonalne):** Link do alternatywnego (nieoficjalnego) planu; przycisk jest ukryty, gdy zmienna nie jest ustawiona lub adres nie odpowiada.
   - **`NEXT_PUBLIC_DISABLE_ANALYTICS` (opcjonalne):** Ustaw na `"true"` poza Vercelem, aby pominąć skrypt Vercel Analytics.
   - **`BUILD_STANDALONE` (opcjonalne):** Ustaw na `"true"`, aby zbudować Next.js w trybie standalone (używane przez Dockerfile).
   - **`DISCORD_WEBHOOK_URL` (opcjonalne):** Webhook Discorda do powiadomień o zmianach w planie. Bez niego watcher jest całkowicie wyłączony.
   - **`PLAN_WATCH_INTERVAL_MINUTES` (opcjonalne):** Uruchamia watcher w procesie aplikacji co N minut (zalecane 15+; ignorowane na Vercelu).
   - **`PLAN_WATCH_SECRET` (opcjonalne):** Zabezpiecza `GET /api/plan-watch`, czyli ręczne wywołanie tego samego sprawdzenia, oraz `POST /api/revalidate`.
   - **`REVALIDATE_URL` (opcjonalne):** Adres drugiego deploymentu (np. Vercel). Po wykryciu zmiany watcher uderza w `POST /api/revalidate` pod tym adresem, żeby wyczyścić tam cache planów.
   - **`PLAN_SNAPSHOT_PATH` (opcjonalne):** Miejsce zapisu poprzedniego snapshotu planu (domyślnie `./data/plan-snapshots.json`). Wskaż zamontowany wolumen, aby przetrwał restarty.
   - **`SENTRY_AUTH_TOKEN` (opcjonalne):** Token autoryzacji Sentry.

4. **Serwer Deweloperski:**

   ```bash
   pnpm dev
   ```

   Otwórz aplikację w przeglądarce pod adresem `http://localhost:3000`.

5. **Budowa Produkcyjna (Zalecany Docker):**

   ```bash
   docker build -t zstio-timetable-docker .
   docker run -p 3000:3000 zstio-timetable-docker
   ```

6. **Budowa Produkcyjna (Alternatywa):**

   ```bash
   pnpm build
   pnpm start
   ```

## Współtworzenie

Wszelkie wkłady są mile widziane! Otwórz zgłoszenie lub prześlij pull request.

## Licencja

Licencja MIT. Zobacz plik [LICENSE](LICENSE) po szczegóły.
