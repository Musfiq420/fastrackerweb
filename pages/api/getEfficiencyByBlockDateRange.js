import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";



function aggregateData(data) {
  const aggregatedData = [];
  const dateMap = new Map();

  for (const item of data) {
    const { date, production, earn, avail, manPower } = item;
    const formattedDate = date.replace(',', ''); // Remove the comma from the date

    if (dateMap.has(formattedDate)) {
      const { earnSum, availSum, productionSum, manPowerSum } = dateMap.get(formattedDate);
      dateMap.set(formattedDate, {
        manPowerSum : manPowerSum + manPower,
        earnSum: earnSum + earn,
        availSum: availSum + avail,
        productionSum: productionSum + production
      });
    } else {
      dateMap.set(formattedDate, {
        manPowerSum: manPower,
        earnSum: earn,
        availSum: avail,
        productionSum: production
      });
    }
  }

  for (const [date, { earnSum, availSum, productionSum, manPowerSum }] of dateMap) {
    const efficiency = earnSum / availSum;
    aggregatedData.push({
      date: date,
      manPower: manPowerSum,
      earn: earnSum,
      avail: availSum,
      efficiency: (efficiency*100).toFixed(2),
      production: productionSum
    });
  }

  return aggregatedData;
}


export default async function getEfficiencyByDateRange (req, res) {
    const { date, day, "lines[]":lines } = req.query;
    
    const currDate = new Date(date)
    const startDate = new Date(date)
    startDate.setDate(startDate.getDate() - day)

    const colRef = collection(database, 'efficiencies');
    const q = query(colRef, where("date", ">=", startDate), where("date", "<=", currDate), where("lineNumber","in", lines));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty)
    {
      res.status(200).json([]);
      return;
    }
    const tempEfficiencyArray = []
    querySnapshot.forEach((doc) => {
      const data = doc.data();
        const netProduction = data["production"] + data["without"] - data["due"] + data["rejection"];
        const availMin = data["hour"]*data["manpower"]*60;
        const earnMin = netProduction*data["SMV"];
      
      tempEfficiencyArray.push({
        date: (data['date'].toDate().getDate()+', '+data['date'].toDate().toLocaleString('default', {month: 'short' })),
        production: Number(netProduction),
        manPower: data["manpower"],
        earn: earnMin,
        avail: availMin
      },)
    });

    const aggData = aggregateData(tempEfficiencyArray);
    console.log(aggData);
    
    res.status(200).json(aggData);


  }