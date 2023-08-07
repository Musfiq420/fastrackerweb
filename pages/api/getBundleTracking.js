import { database } from "@/lib/firebase";
import axios from "axios";
import { collection,  doc,  getDoc, getDocs, query, where } from "firebase/firestore";

export default async function geBundleTracking (req, res) {
    const { date } = req.query;

    const querySnapshot = await getDocs(collection(database, "docket"));
    

    if(querySnapshot.empty)
    {
        res.status(200).json([]);
        return;
    }

    const tempTracking = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempTracking.push({
            "docket no": data["docket no"],
            station: data["station"],
            so: data["so"],
            buyer: data["buyer"],
            style: data["style"],
            color: data["color"],
            size: data["size"],
            part: data["part"],
            serial: data["serial"],
        });
    })

    res.status(200).json(tempTracking);
  }