# Timetable ZSTiO

A refreshed version of the [timetable](https://www.zstio-elektronika.pl/plan/index.html) for [Zespół Szkół Technicznych i Ogólnokształcących](https://zstiojar.edu.pl/).
Data scraping & parsing via [@wulkanowy/timetable-parser-js](https://github.com/wulkanowy/timetable-parser-js)

The timetable is **universal**, you just need to change the value of the `NEXT_PUBLIC_TIMETABLE_URL` in `.env` to the correct address for your school's timetable (UONET generated).

## Tech Stack

- Next.js, React, TailwindCSS, Flowbite

## API Reference

#### Get lists (Selects)

```http
  GET /api/timetable/list
```

| Parameter (Optional) | Description           |
| :------------------- | :-------------------- |
| `?select=classes`    | Returns only classes  |
| `?select=teachers`   | Returns only teachers |
| `?select=rooms`      | Returns only rooms    |

#### Get timetable and other data

```http
  GET /api/timetable/getTimetable
```

| Parameter (Optional) | Description                                               |
| :------------------- | :-------------------------------------------------------- |
| `?id=o1`             | Returns, for example, the timetable of a Branch with id 1 |

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
