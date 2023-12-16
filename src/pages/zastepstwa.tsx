import Head from "next/head";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Substitutions/Layout";
import Jumbotron from "@/components/Substitutions/Jumbotron";
import DropdownTeachers from "@/components/Substitutions/DropdownTeachers";
import DropdownBranch from "@/components/Substitutions/DropdownBranch";
import TableSkeleton from "@/components/Substitutions/TableSkeleton";
import Content from "@/components/Substitutions/Content";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Snow from "@/components/SnowEasteregg";
import { GetStaticProps } from "next";
import { load } from "cheerio";

export default function Home({ ...props }: any) {
  const [checkedTeachers, setCheckedTeachers] = useState<any[]>([]);
  const [checkedBranches, setCheckedBranches] = useState<any[]>([]);
  const handleCheckboxChange = (checkedItems: any[]) => {
    setCheckedTeachers(checkedItems);
  };
  const handleCheckboxChangeBranch = (checkedItems: any[]) => {
    setCheckedBranches(checkedItems);
  };

  const [isSnowing, setIsSnowing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("isSnowing")) return;
    const storedIsSnowing = JSON.parse(localStorage.getItem("isSnowing"));
    if (storedIsSnowing !== null) {
      setIsSnowing(storedIsSnowing);
    }
  }, []);

  return (
    <>
      <Head>
        <title>ZSTiO - Zastępstwa</title>
        <meta
          name="description"
          content="Zastępstwa ZSTIO w odświeżonym stylu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Navbar
          inTimetable={false}
          isSnowing={isSnowing}
          setIsSnowing={setIsSnowing}
          searchDialog={null}
          setSearchDialog={null}
        />
        <Snow isSnowing={isSnowing} />
        <Jumbotron props={props} />
        <DropdownTeachers
          props={props}
          onCheckboxChange={handleCheckboxChange}
        />
        <DropdownBranch
          props={props}
          onCheckboxChangeBranch={handleCheckboxChangeBranch}
        />
        {props.error == true ? (
          <TableSkeleton />
        ) : (
          <Content
            props={props}
            checkedTeachers={checkedTeachers}
            checkedBranches={checkedBranches}
          />
        )}
        <Footer />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await axios.get(
      "http://kristofc.webd.pro/plan/InformacjeOZastepstwach.html"
    );

    const $ = load(response.data);
    const time = $("h2").text().trim();
    const tables: tables[] = [];

    $("table").each((_index, table) => {
      const rows = $(table).find("tr");
      const zastepstwa: substitutions[] = [];

      rows.slice(1).each((_i, row) => {
        const columns = $(row).find("td");
        const [
          lesson,
          teacher,
          branch,
          subject,
          classValue,
          caseValue,
          message,
        ] = columns.map((_index, column) => $(column).text().trim()).get();

        if (lesson) {
          zastepstwa.push({
            lesson,
            teacher,
            branch,
            subject,
            class: classValue,
            case: caseValue,
            message,
          });
        }
      });

      tables.push({
        time: rows.first().text().trim(),
        zastepstwa: zastepstwa,
      });
    });

    return { props: { form: { time, tables } } };
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      error: true,
      message: "Wystąpił błąd podczas pobierania danych",
    },
  };
};
