import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getProductionDataofLastDate(req, res) {
  const { date, dept } = req.query;
  let currentDate = new Date(date);
  
    const colRef = collection(database, 'productionsInformations');
    const q = query(colRef, where("date", "==", currentDate), where("departmentsName", "==", dept));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();      

      res.status(200).json({
        date: currentDate.toISOString(), // Convert date to ISO format and send to frontend
        manPower: data["manpower"],
        target: data["target"].toFixed(0),
        production: data["production"],
        achievement: ((data["production"] / data["target"]) * 100).toFixed(2),
        efficiency: (((data["SMV"] * data["production"]) / (data["manpower"] * data["hour"] * 60)) * 100).toFixed(2),
      });
    });

}
