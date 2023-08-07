import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "@/lib/firebase2";

export default async function getQMSData (req, res) {
    const { date } = req.query;
    const colRef = collection(database, 'data');
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate()+1);
    const q = query(colRef, where("date", ">=", new Date(date)), where("date", "<", new Date(newDate)));
    const querySnapshot = await getDocs(q);

    const qmsdata = [];
    querySnapshot.forEach((d) => {
        const data = d.data();
        qmsdata.push(data);
    })

    qmsdata.sort((a,b) => a.lineNumber - b.lineNumber)

    console.log(qmsdata);

    res.status(200).json(qmsdata);
}