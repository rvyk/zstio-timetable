import { NextRouter } from "next/router";

export const handleCheckboxChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  type: string,
  router: NextRouter,
  setCheckedItems: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
) => {
  const { name, checked } = event.target;

  setCheckedItems((prevCheckedItems) => ({
    ...prevCheckedItems,
    [name]: checked,
  }));

  const currentList: any = router.query[type] || "";
  const currentListArray = currentList.split(",");

  if (checked) {
    if (!currentListArray.includes(name)) {
      currentListArray.push(name);
    }
  } else {
    const index = currentListArray.indexOf(name);
    if (index !== -1) {
      currentListArray.splice(index, 1);
    }
  }

  const updatedList = currentListArray.filter(Boolean).join(",");

  router.replace(
    {
      pathname: router.pathname,
      query: {
        ...router.query,
        [type]: updatedList || undefined,
      },
    },
    undefined,
    { shallow: true }
  );
};
