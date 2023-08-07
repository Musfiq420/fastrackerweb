import { database } from "@/lib/firebase";
import axios from "axios";
import { collection,  doc,  getDoc, getDocs, query, where } from "firebase/firestore";

export default async function getMachineLostTimeByDate (req, res) {
    const { date } = req.query;
    const lostTimeRef = collection(database, 'machine-lost-time');
    
    const q = query(lostTimeRef, where("date", "==", new Date(date)));
    const querySnapshot = await getDocs(q);


    if(querySnapshot.empty)
    {
        res.status(200).json([]);
        return;
    }

    const tempMachineLostTime = [];
    for (const e of querySnapshot.docs) {
      const data = e.data();
      console.log("data: "+data)
      const machineInfoDoc = doc(database, "machine-info", data["id"])
      const docSnap = await getDoc(machineInfoDoc);
      const name = docSnap.data().name;

      tempMachineLostTime.push({
                name: name,
                line: data["line"], 
                id: data["id"], 
                problem: data["problem"], 
                lost: (data["lost"]/60).toFixed(2) + " m"
            })
    }

    res.status(200).json(tempMachineLostTime);
  }