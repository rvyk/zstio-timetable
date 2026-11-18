const TIMETABLE_PATH = /^\/(class|teacher|room)\/\d+$/;

export const isTimetablePath = (value?: string | null): value is string =>
  !!value && TIMETABLE_PATH.test(value);

export const resolveRedirectPath = (
  defaultPlan?: string,
  lastVisited?: string,
): string => {
  const valid = (value?: string) => (isTimetablePath(value) ? value : null);

  return valid(defaultPlan) ?? valid(lastVisited) ?? "/class/1";
};
