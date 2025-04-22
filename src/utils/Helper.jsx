const helper = {};

helper.formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default helper;
