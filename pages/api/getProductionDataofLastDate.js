import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getProductionDataofLastDate(req, res) {
  const { date, dept } = req.query;
  let currentDate = new Date(date);

    const colRef = collection(database, 'productionsInformations');
    const q = query(colRef, where("date", "==", currentDate), where("departmentsName","in", ["Cutting", "Sewing", "Embroidery", "Printing", "Finishing"]));
    const querySnapshot = await getDocs(q);

    const productionData = {};

    // console.log("length: "+querySnapshot.docs.length);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
        productionData[data["departmentsName"]] = {
        date: currentDate.toISOString(),
        manPower: data["manpower"],
        target: data["target"].toFixed(0),
        production: data["production"],
        achievement: ((data["production"] / data["target"]) * 100).toFixed(2),
        efficiency: (((data["SMV"] * data["production"]) / (data["manpower"] * data["hour"] * 60)) * 100).toFixed(2),
      }
      
    });
    // console.log(productionData);
    res.status(200).json(productionData);
}
