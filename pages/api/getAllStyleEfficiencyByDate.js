import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getAllStyleEfficiencyByDate (req, res) {
    const { date } = req.query;
    const colRef = collection(database, 'efficiencies');
    
    const q = query(colRef, where("date", "==", new Date(date)));
    const querySnapshot = await getDocs(q);

    const tempAllLineEfficiency = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const netProduction = data["production"] + data["without"] - data["due"] + data["rejection"];
        const availMin = data["hour"]*data["manpower"]*60;
        const earnMin = netProduction*data["SMV"];
        tempAllLineEfficiency.push({
            date: data["date"].toDate().toLocaleDateString('en-US'),
            line: +data["lineNumber"],
            buyer: data["buyerName"],
            sfl: data["SO"],
            style: data["styleName"],
            "sam earners": data["manpower"],
            output: netProduction,
            without: data["without"],
            hours: +(eval(data["hour"]).toFixed(2)),
            smv: data["SMV"],
            "available min": +availMin.toFixed(2),
            due: data["due"],
            "earn min": +earnMin.toFixed(2),
            efficiency: ((earnMin/availMin)*100).toFixed(2)+"%",
            item: data["itemName"],
            remarks: data["remarks"],
            daysRun: data["daysRun"]
        });
    })


    res.status(200).json(tempAllLineEfficiency);
}