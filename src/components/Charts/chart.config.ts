import moment from "moment"
import { lineChartData } from "@/api/python"
import { getUserBarangayAssignment } from '@/api/auth'
import { useUseridStore } from "@/stores"

export const chartColors : any = {
  default: {
    primary: "#00D1B2",
    info: "#209CEE",
    danger: "#FF3860"
  },
};

const randomChartData = (n:Number) => {
  const data = [];

  for (let i = 0; i < n; i++) {
    data.push(Math.round(Math.random() * 200));
  }

  return data;
};

const datasetObject = async (color:any, points:any) => {
  //const data = randomChartData(points)
  const data = points
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

const _lineChartData = async (vaccine_status:String) => {
  const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
  const barangay_assignment = await Promise.all(barangay_assign.map(async (item: any) => item.id))
  const params = { status: 1, for_sms: "true", barangay_assignment: barangay_assignment, filter: "individual", vaccine_status: vaccine_status, linechart: "true" }
  const response = await lineChartData(params)
  return response
}

export const lineChartDataProcess = async (points = 9) => {
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

  const data = {
    labels,
    datasets: [
      await datasetObject("primary", await _lineChartData("CLIENT")),
      await datasetObject("info", await _lineChartData("VACCINATED")),
      await datasetObject("danger", await _lineChartData("MISSED"))
    ],
  }
  return data
};
