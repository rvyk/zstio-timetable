![App screenshot](src/assets/school-og-EN.png)

[Polska wersja](README.pl.md) / English version

# ✨ ZSTiO Timetable 🚀

A modern and refreshed timetable application for Zespół Szkół Technicznych i Ogólnokształcących (ZSTiO), built with cutting-edge web technologies. This intuitive application simplifies access to class schedules, providing a seamless experience for students, teachers, and staff.

## 🚀 Key Features

- **Universal Compatibility 🌍:** Adaptable to any school using UONET timetables. Simply configure the `NEXT_PUBLIC_TIMETABLE_URL` environment variable.
- **Adaptive Layout 🗓️:** A day-by-day board on mobile, the full week table on desktop.
- **Personalized Favorites ⭐:** Save your frequently accessed classes, teachers, and rooms for instant access, and pin one of them as the default plan opened on launch.
- **Effortless Free Room Search 🔎:** Quickly find available rooms by day and lesson number.
- **Smart Shortened Lesson Calculator ⏱️:** Dynamically adjusts the timetable to reflect shortened lesson durations.
- **Live Lesson Progress ⏳:** See the current lesson, the break in progress, and how much time is left.
- **Calendar Subscription (webcal) 📅:** Subscribe to a live `webcal://` feed that stays up to date in your calendar app or Google Calendar, with Polish holidays and school breaks excluded automatically.
- **Plan Change Watcher 🔔:** An optional background watcher detects timetable changes and posts them to a Discord webhook.
- **School News 📰:** Optionally pulls the latest posts from the school website and shows them as a dismissible notification.
- **Multi-language Interface 🌐:** Full Polish and Ukrainian translations.
- **Keyboard Navigation ⌨️:** Move around days and lessons without touching the mouse.
- **Print-friendly Output 🖨️:** A dedicated print view for a clean paper copy.
- **Responsive Design for All Devices 📱💻:** Access your timetable on the go or from your desktop with a consistent and user-friendly interface.
- **Elegant Dark Mode 🌙:** Switch between light and dark themes for optimal viewing comfort.
- **Offline Access with PWA Support 🔌:** Install the application as a Progressive Web App for blazing-fast loading and offline access.
- **Robust Error Tracking (Sentry) ⚠️:** Integrated with Sentry for proactive error monitoring and enhanced application stability.
- **Streamlined Deployment with Docker 🐳:** Leverage the provided Dockerfile for effortless deployment and a consistent environment.

## 💻 Tech Stack

- **Next.js 16 (App Router, Turbopack):** The React framework for production.
- **React 19:** With Server Components and Server Actions.
- **TypeScript:** For type safety and improved developer experience.
- **Tailwind CSS v4:** Rapidly build modern user interfaces.
- **shadcn/ui:** Beautiful and accessible UI components.
- **@majusss/timetable-parser:** Efficient data scraping and parsing.
- **Zustand:** Lightweight and performant state management.
- **Next Themes:** Effortless theme switching.
- **Serwist:** Service worker and PWA caching.
- **ics:** Calendar (ICS) generation.
- **@t3-oss/env-nextjs + Zod:** Validated, type-safe environment variables.
- **Vercel Analytics:** Optional, privacy-friendly usage analytics.
- **Sentry:** Real-time error tracking and performance monitoring.
- **Docker:** Containerization for simplified deployment.

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rvyk/zstio-timetable.git
   cd zstio-timetable
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file based on `.env.example` and set the following:
   - **`NEXT_PUBLIC_TIMETABLE_URL` (required):** The URL of your school's UONET timetable.
   - **`NEXT_PUBLIC_APP_URL` (required):** The base URL of your application.
   - **`NEXT_PUBLIC_SCHOOL_NEWS_URL` (optional):** WordPress REST endpoint used for the school news notification.
   - **`NEXT_PUBLIC_ALT_TIMETABLE_URL` (optional):** Link to an alternative/unofficial timetable; the button is hidden when unset or unreachable.
   - **`NEXT_PUBLIC_DISABLE_ANALYTICS` (optional):** Set to `"true"` on non-Vercel hosts to skip the Vercel Analytics script.
   - **`BUILD_STANDALONE` (optional):** Set to `"true"` for a standalone Next.js output (used by the Dockerfile).
   - **`DISCORD_WEBHOOK_URL` (optional):** Discord webhook for plan change notifications. Without it the watcher stays off entirely.
   - **`PLAN_WATCH_INTERVAL_MINUTES` (optional):** Run the watcher in-process every N minutes (15+ recommended; ignored on Vercel).
   - **`PLAN_WATCH_SECRET` (optional):** Guards `GET /api/plan-watch`, the manual trigger for the same run.
   - **`PLAN_SNAPSHOT_PATH` (optional):** Where the previous plan snapshot is stored (defaults to `./data/plan-snapshots.json`). Point it at a mounted volume so it survives restarts.
   - **`SENTRY_AUTH_TOKEN` (optional):** Your Sentry authentication token.

4. **Development Server:**

   ```bash
   pnpm dev
   ```

   Access the application at `http://localhost:3000`.

5. **Production Build (Docker Recommended):**

   ```bash
   docker build -t zstio-timetable-docker .
   docker run -p 3000:3000 zstio-timetable-docker
   ```

6. **Production Build (Alternative):**

   ```bash
   pnpm build
   pnpm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License. See the [LICENSE](LICENSE) file for details.
