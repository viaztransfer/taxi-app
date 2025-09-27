mobiscroll.setOptions({
  theme: "ios",
  themeVariant: "light",
});

mobiscroll.datepicker("#calendar", {
  controls: ["calendar"],
  display: "inline",
  touchUi: false,
});

mobiscroll.datepicker("#time", {
  controls: ["time"],
  headerText: "Time: {value}",
  timeFormat: "h:mm A",
  display: "inline",
  touchUi: false,
});
