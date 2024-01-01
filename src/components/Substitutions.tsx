import Footer from "@/components/Footer";
import Message from "@/components/Message";
import Navbar from "@/components/Navbar";
import Snow from "@/components/SnowEasteregg";
import Content from "@/components/Substitutions/Content";
import DropdownBranch from "@/components/Substitutions/DropdownBranch";
import DropdownTeachers from "@/components/Substitutions/DropdownTeachers";
import Jumbotron from "@/components/Substitutions/Jumbotron";
import Layout from "@/components/Substitutions/Layout";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Substitutions({ ...props }: props) {
  const [checkedTeachers, setCheckedTeachers] = useState<any[]>([]);
  const [checkedBranches, setCheckedBranches] = useState<any[]>([]);
  const onCheckboxChangeTeacher = (checkedItems: any[]) => {
    setCheckedTeachers(checkedItems);
  };
  const onCheckboxChangeBranch = (checkedItems: any[]) => {
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
        <Message />
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
          onCheckboxChangeTeacher={onCheckboxChangeTeacher}
        />
        <DropdownBranch
          props={props}
          onCheckboxChangeBranch={onCheckboxChangeBranch}
        />
        {props.substitutions.status == false ? (
          <div className="dark:text-gray-400 text-gray-500 text-center mb-10">
            <h1 className="text-xl">Przepraszamy za utrudnienia</h1>
            <a
              className="font-bold hover:underline"
              href={process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL}
            >
              Przejdź do zastępstw
            </a>
          </div>
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
