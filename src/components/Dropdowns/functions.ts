export const handleSelect = (
  dropdown: string,
  dropdownId: string,
  dropdownType: dropdownSearchType,
  setLastSelect: React.Dispatch<React.SetStateAction<string>>,
) => {
  document.getElementById(`${dropdownId}`)?.click();
  const dropdownLink = `/${dropdown}/${dropdownType.value}`;
  setLastSelect(dropdownLink);
  localStorage.setItem("LastSelect", dropdownLink);
};
