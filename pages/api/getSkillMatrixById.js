import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getSkillMatrixById (req, res) {
    const { id } = req.query;
    const colRef = collection(database, 'capacity');
    
    const q = query(colRef, where("id", "==", Number(id)));
    const querySnapshot = await getDocs(q);

    const tempSkillMatrix = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempSkillMatrix.push({
            id: data["id"],
            line: data["line"],
            process: data["remarks"]!==""?`${data["process"]} (${data["remarks"]})`:data["process"], 
            item: data["item"], 
            fabric: data["fabric"], 
            cycle: data["cycle"],
            // remarks: data["remarks"]
        });
    })

    res.status(200).json(tempSkillMatrix);
}