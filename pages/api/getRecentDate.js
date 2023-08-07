import { database } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export default async function getProductionDataofLastDate(req, res) {
  
    const colRef = collection(database, 'productionsInformations');
    const q = query(colRef, where("departmentsName","==", "Sewing"), orderBy("date", "desc"), limit(2));
       
    const querySnapshot = await getDocs(q);

    const dates = [];

    if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            dates.push(data.date.toDate());
        });
        
        // console.log(dates);
        res.status(200).json(dates);
    }
    // console.log("length: "+querySnapshot.docs.length);
}