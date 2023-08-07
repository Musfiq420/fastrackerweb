import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getUserName (req, res) {
    const { email } = req.query;
    const colRef = collection(database, 'users');
    
    const q = query(colRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    const tempEmployeeInfo = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        tempEmployeeInfo.push({
            name: data["name"]
        });
    })

    res.status(200).json(tempEmployeeInfo[0]);
}