const setZoom = (barsWidth, ctx) => {
  const zoom = {};
  const { chart, data } = ctx;
  let interval = 10;
  const end = chart.getWidth() / (barsWidth + interval);
  zoom.show = end < data.length - 1;
  zoom.startValue = 0;
  zoom.endValue = end;
  return zoom;
};
export { setZoom };
