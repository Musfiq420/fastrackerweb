import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import processCodeMap from "../../lib/processCodeMap.json";


export default async function getSkillMatrixByDateandLine (req, res) {
    const { line, date } = req.query;
    const colRef = collection(database, 'capacity-2.0');
    
    const q = query(colRef, where("date", "==", new Date(date)), where("line", "==", Number(line)));
    const querySnapshot = await getDocs(q);

    const tempSkillMatrix = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data["date"]);
        tempSkillMatrix.push({
            id: data["id"],
            line: data["line"],
            "process": data["process-id"],
            "process-name": processCodeMap[data["process-id"]],
            // process: data["remarks"]!==""?`${data["process"]} (${data["remarks"]})`:data["process"], 
            // item: data["item"], 
            // fabric: data["fabric"], 
            machine: data["machine"],
            cycle: data["cycle"],
            // remarks: data["remarks"]
        });
    })

    const capacityAggr = tempSkillMatrix.reduce((prev, curr) => {
        prev[curr["process"]] = {
            id: prev[curr["process"]]? prev[curr["process"]]["id"]+ ", " + curr["id"]:curr["id"].toString(),
            process: curr["process-name"],
            machine: curr["machine"],
            capacity: prev[curr["process"]]?((3060/prev[curr["process"]]["capacity"])+ (3060/curr["cycle"])).toFixed(2):(3060/curr["cycle"]).toFixed(2),
        }

        return prev;
    }, {})

    
    const capacityArray = Object.values(capacityAggr);
    console.log(capacityArray);

    res.status(200).json(capacityArray);
}