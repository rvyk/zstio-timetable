![App screenshot](/public/og-image.png)

# Timetable ZSTiO

A refreshed version of the [timetable](https://www.zstio-elektronika.pl/plan/index.html)
for [Zespół Szkół Technicznych i Ogólnokształcących](https://zstiojar.edu.pl/).
Data scraping & parsing via [@wulkanowy/timetable-parser-js](https://github.com/wulkanowy/timetable-parser-js) [(edited version)](https://github.com/majusss/timetable-parser-js)

> The timetable is **universal**, you just need to change the value of the `NEXT_PUBLIC_TIMETABLE_URL` in `.env` to the
> correct address for your school's timetable (UONET generated) and customize substitutions yourself.

The phone mode is inspired by the school's timetable
[Zespół Szkół Elektronicznych w Rzeszowie](https://plan-lekcji.zse.rzeszow.pl)

## Tech Stack

- [NextJS](https://nextjs.org/) (React framework for server-rendered React applications)
- [React](https://reactjs.org/) (JavaScript library for building user interfaces)
- [TypeScript](https://www.typescriptlang.org/) (Typed superset of JavaScript that compiles to plain JavaScript)
- [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework)
- [Flowbite](https://flowbite.com/) (Tailwind CSS components and templates)
- [Headless UI](https://headlessui.dev/) (Set of completely unstyled, fully accessible UI components)
- [Cypress](https://www.cypress.io/) (JavaScript end-to-end testing framework)
- [cheerio](https://cheerio.js.org/) (Fast, flexible, and lean implementation of core jQuery designed specifically for the server)
- [heroicons](https://heroicons.com/) (Beautiful hand-crafted SVG icons)

## API Reference

#### Get lists (Selects)

```http
  GET /api/timetable/list
```

| Parameters (Optional)              | Description                             |
| :--------------------------------- | :-------------------------------------- |
| `?select=classes\|teachers\|rooms` | Returns only classes, teachers or rooms |

#### Get timetable and other data

```http
  GET /api/timetable/getTimetable
```

| Parameter (Default: o1) | Description                                                 |
| :---------------------- | :---------------------------------------------------------- |
| `?id=id`                | Returns the timetable of a Branch with the specified **id** |

#### Get empty classes

```http
  GET /api/timetable/empty
```

| Parameter (Required) | Description                                                |
| :------------------- | :--------------------------------------------------------- |
| `?day=index`         | Day of the week (0-4)                                      |
| `?lesson=index`      | Lesson of the day's lesson, e.g., `lesson=1` for index `0` |

#### Get substitutions

```http
  GET /api/getSubstitutions
```

| Parameter (Optional)      | Description                                      |
| :------------------------ | :----------------------------------------------- |
| `?search=teacher\|branch` | Search substitutions for branch or for a teacher |
| `?query=index`            | What api will search in substitution             |

#### What is **id** and how do I find it?

| Id prefix | Description      | Value                                            |
| :-------- | :--------------- | :----------------------------------------------- |
| `o`       | Branch / Classes | `value from /api/timetable/list?select=classes`  |
| `n`       | Teacher          | `value from /api/timetable/list?select=teachers` |
| `s`       | Room             | `value from /api/timetable/list?select=rooms`    |

## Links

[![portfolio](https://img.shields.io/badge/GitHub-rvyk-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rvyk/)
[![portfolio](https://img.shields.io/badge/Github-majusss-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/majusss/)
[![linkedin](https://img.shields.io/badge/TRY-0A66C2?style=for-the-badge&logoColor=white)](https://plan-lekcji.awfulworld.space/)
