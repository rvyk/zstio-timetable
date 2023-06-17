import Head from "next/head";
import Layout from "./components/Layout";
import ThemeChanger from "./components/ThemeChanger";
import Jumbotron from "./components/Jumbotron";
import Content from "./components/Content";
import DropdownClass from "./components/Dropdowns/ClassDropdown";
import DropdownTeacher from "./components/Dropdowns/TeacherDropdown";
import DropdownRoom from "./components/Dropdowns/RoomDropdown";

export default function Home() {
  return (
    <>
      <Head>
        <title>ZSTIO - Plan lekcji</title>
        <meta
          name="description"
          content="Zastępstwa ZSTIO w odświeżonym stylu."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <ThemeChanger />
        <Jumbotron />
        <Content />
        <DropdownRoom />
        <DropdownTeacher />
        <DropdownClass />
      </Layout>
    </>
  );
}
