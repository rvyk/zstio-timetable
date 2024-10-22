import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const cookieStore = await cookies();
  const lastVisited = cookieStore.get("lastVisited")?.value ?? "";

  const validPattern = /^\/(class|teacher|room)\/\d+$/;

  const isValidURL = (url: string) => validPattern.test(url);

  const redirectTo = isValidURL(lastVisited) ? lastVisited : "/class/1";

  redirect(redirectTo);
};

export default Page;
