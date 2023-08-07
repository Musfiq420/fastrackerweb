import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getProductionDataByDateandDept (req, res) {
    const { date, dept } = req.query;
    // const colRef = collection(database, 'production-data');
    const colRef = collection(database, 'productionsInformations');
    const q = query(colRef, where("date", "==", new Date(date)), where("departmentsName", "==", dept));
    const querySnapshot = await getDocs(q);
    // console.log("data "+querySnapshot);
    if(querySnapshot.empty)
    {
        res.status(200).json({
            manPower:0,
            target:0,
            production:0,
            achievement:0,
            efficiency:0,
          })
    }

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        res.status(200).json({
          manPower:data["manpower"],
          target:data["target"],
          production:data["production"],
          achievement: ((data["production"]/data["target"])*100).toFixed(2),
          efficiency: (((data["SMV"]*data["production"])/(data["manpower"]*data["hour"]*60))*100).toFixed(2),
        })
      });


  }