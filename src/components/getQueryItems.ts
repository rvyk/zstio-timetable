import { NextRouter } from "next/router";

export const getQueryItems = (
  type: string,
  router: NextRouter,
  setCheckedItems: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
) => {
  const queryParams = router.query;

  if (queryParams.branches && type == "branches") {
    const branchesArray = Array.isArray(queryParams.branches)
      ? queryParams.branches
      : queryParams.branches.split(",");
    const branchesState = branchesArray.reduce((acc, branch) => {
      acc[branch] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(branchesState);
  }

  if (queryParams.teachers && type == "teachers") {
    const teachersArray = Array.isArray(queryParams.teachers)
      ? queryParams.teachers
      : queryParams.teachers.split(",");
    const teachersState = teachersArray.reduce((acc, teacher) => {
      acc[teacher] = true;
      return acc;
    }, {} as { [key: string]: boolean });
    setCheckedItems(teachersState);
  }
};
