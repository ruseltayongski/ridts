import moment from "moment"

export const chartColors : any = {
  default: {
    primary: "#00D1B2",
    info: "#209CEE",
    danger: "#FF3860",
    warning: "#EAB308"
  },
};

const randomChartData = (n:Number) => {
  const data = [];

  for (let i = 0; i < n; i++) {
    data.push(Math.round(Math.random() * 200));
  }

  return data;
};

const datasetObject = (color:any, points:any) => {
  const data = randomChartData(points)
  console.log(data)
  return {
    fill: false,
    borderColor: chartColors.default[color],
    borderWidth: 2,
    borderDash: [],
    borderDashOffset: 0.0,
    pointBackgroundColor: chartColors.default[color],
    pointBorderColor: "rgba(255,255,255,0)",
    pointHoverBackgroundColor: chartColors.default[color],
    pointBorderWidth: 20,
    pointHoverRadius: 4,
    pointHoverBorderWidth: 15,
    pointRadius: 4,
    data: data,
    tension: 0.5,
    cubicInterpolationMode: "default",
  };
};

export const sampleChartData = (points = 9) => {
  let labels = [];

  // for (let i = 1; i <= points; i++) {
  //   labels.push(`0${i}`);
  // }

  const currentDate = moment();
  // loop through the last 9 days and add each date to the array
  for (let i = 1; i <= 9; i++) {
    const date = moment(currentDate).subtract(i, 'days');
    labels.push(moment(date).format('L'));
  }

  labels = labels.reverse()

  return {
    labels,
    datasets: [
      datasetObject("primary", points),
      datasetObject("info", points),
      datasetObject("danger", points),
      datasetObject("warning", points),
    ],
  };
};
