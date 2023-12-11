import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Jumbotron from "@/components/Substitutions/Jumbotron";
import DropdownTeachers from "@/components/Substitutions/DropdownTeachers";
import DropdownBranch from "@/components/Substitutions/DropdownBranch";
import TableSkeleton from "@/components/Substitutions/TableSkeleton";
import Content from "@/components/Substitutions/Content";
import Snow from "@/components/SnowEasteregg";
import { initFlowbite } from "flowbite";

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

  useEffect(() => {
    if (!localStorage.getItem("isSnowing")) return;
    const storedIsSnowing = JSON.parse(localStorage.getItem("isSnowing"));
    if (storedIsSnowing !== null) {
      setIsSnowing(storedIsSnowing);
    }
  }, []);

  useEffect(() => {
    initFlowbite();
  });

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
      <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#F7F3F5] dark:bg-[#171717] transition-all">
        <Snow isSnowing={isSnowing} />
        <Navbar
          searchDialog={null}
          setSearchDialog={null}
          setIsSnowing={setIsSnowing}
          isSnowing={isSnowing}
        />
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
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host;
  const protocol = host === "localhost:3000" ? "http" : "https";
  const apiResponse = await axios.get(
    `${protocol}://${host}/api/getSubstitutions`
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
