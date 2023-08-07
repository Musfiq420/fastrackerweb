import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import processCodeMap from "../../lib/processCodeMap.json";


export default async function getSkillMatrix (req, res) {
    const colRef = collection(database, 'capacity-2.0');
    
    const q = query(colRef, where("date",">=", new Date("2023-07-24")));
    const querySnapshot = await getDocs(q);

    const tempSkillMatrix = [];
    querySnapshot.forEach((d) => {
        const data = d.data();

        tempSkillMatrix.push({
            id: data["id"],
            line: data["line"],
            date: `${data["date"].toDate().toLocaleDateString("en-US")}`,
            "process": data["process-id"],
            "process-name":  processCodeMap[data["process-id"]],
            // process: data["remarks"]!==""?`${data["process"]} (${data["remarks"]})`:data["process"], 
            item: data["item"], 
            fabric: data["fabric"], 
            machine: data["machine"],
            cycle: data["cycle"],
            capacity: (3060/data["cycle"]).toFixed(2),
            remarks: data["remarks"]
        });
    })

    // console.log(tempSkillMatrix);

    res.status(200).json(tempSkillMatrix);
}