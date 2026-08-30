const TIMETABLE_PATH = /^\/(class|teacher|room)\/\d+$/;

export const resolveRedirectPath = (
  defaultPlan?: string,
  lastVisited?: string,
): string => {
  const valid = (value?: string) =>
    value && TIMETABLE_PATH.test(value) ? value : null;

  return valid(defaultPlan) ?? valid(lastVisited) ?? "/class/1";
};
