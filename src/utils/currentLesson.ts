export const getCurrentLesson = (timeFrom, timeTo) => {
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();

  const [fromHour, fromMinutes] = timeFrom.split(":");
  const [toHour, toMinutes] = timeTo.split(":");
  let minutesRemaining, isWithinTimeRange;
  const isAfterFromTime =
    currentHour > Number(fromHour) ||
    (currentHour === Number(fromHour) && currentMinutes >= Number(fromMinutes));
  const isBeforeToTime =
    currentHour < Number(toHour) ||
    (currentHour === Number(toHour) && currentMinutes < Number(toMinutes));
  isWithinTimeRange = isAfterFromTime && isBeforeToTime;

  if (isWithinTimeRange) {
    const endTime = new Date();
    endTime.setHours(Number(toHour), Number(toMinutes), 0);
    const timeDifference = endTime.getTime() - new Date().getTime();
    minutesRemaining = Math.ceil(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
  }

  return { isWithinTimeRange, minutesRemaining };
};
