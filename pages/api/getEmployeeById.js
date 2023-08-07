import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getEmployeeById (req, res) {
    const { id } = req.query;
    const colRef = collection(database, 'employee-data');
    
    const q = query(colRef, where("id", "==", Number(id)));
    const querySnapshot = await getDocs(q);

    const tempEmployeeInfo = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempEmployeeInfo.push({
            name: data["name"],
            designation: data["designation"],
            id: data["id"],
            gender: data["gender"],
            joined: data["joined"],
            section: data["section"],
            line: data["line"],
        });
    })

    res.status(200).json(tempEmployeeInfo[0]);
}