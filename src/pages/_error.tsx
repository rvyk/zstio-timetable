import Layout from "@/components/layout";
import { Table } from "@/types/timetable";
import { NextPage, NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <Layout
      props={{} as Table}
      errorMsg={`${
        statusCode
          ? `Wystąpił błąd (${statusCode}) po stronie serwera`
          : "Wystąpił problem po stronie klienta"
      }`}
    />
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
