import { getSchoolNews } from "@/lib/schoolNews";
import { FC } from "react";
import { SchoolNewsCard } from "./SchoolNewsCard";

export const SchoolNews: FC = async () => {
  const post = (await getSchoolNews(1))?.[0];

  return post ? <SchoolNewsCard {...post} /> : null;
};
