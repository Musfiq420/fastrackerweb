import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getBlockDataByDate (req, res) {
    const { date, "lines[]":lines } = req.query;

    console.log('lines:')
    console.log(req.query);
    
    const colRef = collection(database, 'sewing-production-data');

    const q = query(colRef, where("date", "==", new Date(date) ), where("line","in", lines.map(Number)));
    const querySnapshot = await getDocs(q);
    
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

    let tempBlockData = {
      lines: null,
      manPower:0,
      target:0,
      production:0,
      earn: 0,
      available: 0
    }
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      tempBlockData = {
        manPower: tempBlockData.manPower + data["man-power"],
        target: tempBlockData.target + data["target"],
        production: tempBlockData.production + data["production"],
        earn: tempBlockData.earn + data["earn"],
        available: tempBlockData.available + data["available"]
      }
    });

    res.status(200).json({
      lines: lines,
      manPower:tempBlockData.manPower,
      target:tempBlockData.target,
      production:tempBlockData.production,
      achievement:((tempBlockData.production/tempBlockData.target)*100).toFixed(2),
      efficiency:((tempBlockData.earn/tempBlockData.available)*100).toFixed(2),
    })


  }