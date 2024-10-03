import { getSubstitutions } from "@/actions/getSubstitutions";
import { BottomBar } from "@/components/common/BottomBar";
import { Substitutions } from "@/components/substitutions/Substitutions";
import { Topbar } from "@/components/topbar/Topbar";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const substitutions = await getSubstitutions();

  return {
    title: substitutions.heading,
    description: `Sprawdź zastępstwa w ZSTiO na (${substitutions.timeRange})`,
  };
};

const SubstitutionPage = async () => {
  if (!process.env.NEXT_PUBLIC_SUBSTITUTIONS_URL) {
    redirect("/");
  }

  const substitutions = await getSubstitutions();

  return (
    <div className="flex h-full w-full flex-col gap-y-3 overflow-hidden md:gap-y-6 md:p-8">
      <Topbar substitutions={substitutions} />
      <Substitutions substitutions={substitutions} />
      <BottomBar substitutions={substitutions} />
    </div>
  );
};

export default SubstitutionPage;
