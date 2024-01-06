import Layout from "@/components/layout";
import { Table } from "@/types/timetable";

function Error({ statusCode }: { statusCode: number }) {
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
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
