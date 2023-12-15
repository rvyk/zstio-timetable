import Head from "next/head";
import axios from "axios";
import React, { useState } from "react";
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

export default function Home({ ...props }) {
  const [checkedTeachers, setCheckedTeachers] = useState([]);
  const [checkedBranches, setCheckedBranches] = useState([]);
  const handleCheckboxChange = (checkedItems) => {
    setCheckedTeachers(checkedItems);
  };
  const handleCheckboxChangeBranch = (checkedItems) => {
    setCheckedBranches(checkedItems);
  };

  const [isSnowing, setIsSnowing] = useState(false);

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
        <Footer small={false} />
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const apiResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_HOST}/api/getSubstitutions`
  );

  if (apiResponse.status === 200) {
    const { data } = apiResponse;

    return { props: { form: data } };
  } else {
    return {
      props: {
        error: true,
        message: "Wystąpił błąd podczas pobierania danych",
      },
    };
  }
};
