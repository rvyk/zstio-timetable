![App screenshot](src/assets/school-og.png)

Polska wersja / [English version](README.md)

# ✨ ZSTiO Timetable 🚀

Nowoczesna i odświeżona aplikacja planu lekcji dla Zespołu Szkół Technicznych i Ogólnokształcących (ZSTiO), stworzona z wykorzystaniem najnowszych technologii webowych. Ta intuicyjna aplikacja ułatwia dostęp do planów zajęć, oferując bezproblemową obsługę dla uczniów, nauczycieli i pracowników.

## 🚀 Najważniejsze Funkcje

- **Uniwersalna Kompatybilność 🌍:** Przystosowana do każdej szkoły korzystającej z planów UONET. Wystarczy skonfigurować zmienną środowiskową `NEXT_PUBLIC_TIMETABLE_URL`.
- **Obsługa Wielu Źródeł Danych 🔄:** Konfiguruj wiele źródeł planów lekcji i płynnie przełączaj się między nimi.
- **Ulubione ⭐:** Zapisz najczęściej przeglądane klasy, nauczycieli i sale, aby mieć do nich szybki dostęp.
- **Wygodne Wyszukiwanie Wolnych Sal 🔎:** Szybko sprawdź dostępne sale według dnia i numeru lekcji.
- **Inteligentne Skrócone Lekcje ⏱️:** Automatyczna adaptacja planu do skróconych godzin lekcyjnych.
- **Eksport do Kalendarza (ICS) 📅:** Pobierz swój plan lekcji w formacie ICS, aby łatwo zsynchronizować go z ulubioną aplikacją kalendarza.
- **Responsywny Interfejs na Wszystkich Urządzeniach 📱💻:** Przeglądaj plan lekcji z dowolnego urządzenia dzięki spójnemu i intuicyjnemu interfejsowi.
- **Elegancki Tryb Ciemny 🌙:** Przełączaj się między jasnym i ciemnym motywem dla komfortu użytkowania.
- **Dostęp Offline dzięki PWA 🔌:** Zainstaluj aplikację jako PWA (Progressive Web App) dla szybszego ładowania i pracy offline.
- **Zaawansowane Śledzenie Błędów (Sentry) ⚠️:** Integracja z Sentry umożliwia monitorowanie błędów i stabilność działania.
- **Łatwe Wdrażanie z Dockerem 🐳:** Dzięki dołączonemu plikowi Dockerfile wdrażanie jest szybkie i gwarantuje spójność środowiska.

## 💻 Wykorzystane technologie

- **Next.js:** Framework Reacta do aplikacji produkcyjnych.
- **TypeScript:** Zapewnia typowanie i lepsze doświadczenia dla programistów.
- **Tailwind CSS:** Szybkie tworzenie nowoczesnych interfejsów użytkownika.
- **shadcn/ui:** Piękne i dostępne komponenty interfejsu.
- **@majusss/timetable-parser-js:** Wydajne przetwarzanie danych i parsing.
- **Zustand:** Lekki i wydajny system zarządzania stanem.
- **Next Themes:** Proste przełączanie motywów.
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

## 🌐 Przydatne Linki

[![portfolio](https://img.shields.io/badge/GitHub-rvyk-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rvyk/) ![wakatime](https://wakatime.com/badge/user/36446820-2c24-47ad-9fdd-838263034b78/project/c9b72050-b8e0-4f02-b4db-c2185c0b69c4.svg?style=for-the-badge)

[![portfolio](https://img.shields.io/badge/Github-majusss-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/majusss/) ![wakatime](https://wakatime.com/badge/user/63d00a78-aaef-4163-98f0-5695127e3103/project/018b396b-d9dc-4f6e-add4-ffe9bf124fb6.svg?style=for-the-badge)

[![try](https://img.shields.io/badge/TRY_DEVELOPMENT-0A66C2?style=for-the-badge&logoColor=white)](https://dev.rvyk.tech/)
[![try](https://img.shields.io/badge/TRY_PRODUCTION-0A66C2?style=for-the-badge&logoColor=white)](https://plan.zstiojar.edu.pl/)
