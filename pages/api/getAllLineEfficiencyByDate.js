import { database } from "@/lib/firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getAllLineEfficiencyByDate (req, res) {
    const { line, date } = req.query;
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
            efficiency: ((earnMin/availMin)*100).toFixed(2)+"%"

        });
    })

    const efficiencies = tempAllLineEfficiency.reduce((eff, currValue) => {
        eff[currValue["line"]] = {
            ...currValue,
            "buyer": eff[currValue["line"]]? eff[currValue["line"]]["buyer"]+ ", " + currValue["buyer"]:currValue["buyer"],
            "sfl": eff[currValue["line"]]? eff[currValue["line"]]["sfl"]+ ", " + currValue["sfl"]:currValue["sfl"],
            "style": eff[currValue["line"]]? eff[currValue["line"]]["style"]+ ", " + currValue["style"]:currValue["style"],
            "output": eff[currValue["line"]]? eff[currValue["line"]]["output"] + currValue["output"]:currValue["output"],
            "without": eff[currValue["line"]]? eff[currValue["line"]]["without"] +", "+ currValue["without"]:currValue["without"],
            "hours": eff[currValue["line"]]? Number(eff[currValue["line"]]["hours"] + currValue["hours"]):currValue["hours"],
            "smv": eff[currValue["line"]]? eff[currValue["line"]]["smv"] +", "+ currValue["smv"]:currValue["smv"],
            "available min": eff[currValue["line"]]? Number((eff[currValue["line"]]["available min"] + currValue["available min"]).toFixed(2)):Number(currValue["available min"].toFixed(2)),
            "due": eff[currValue["line"]]? eff[currValue["line"]]["due"] +", "+ currValue["due"]:currValue["due"],
            "earn min": eff[currValue["line"]]? Number((eff[currValue["line"]]["earn min"] + currValue["earn min"]).toFixed(2)):Number((currValue["earn min"]).toFixed(2)),
            "efficiency": eff[currValue["line"]]? ((eff[currValue["line"]]["earn min"] + currValue["earn min"])/(eff[currValue["line"]]["available min"] + currValue["available min"])*100).toFixed(2)+"%":((currValue["earn min"]/currValue["available min"])*100).toFixed(2)+"%",
        }
        return eff;
      }, {});

    
    const efficienciesArray = Object.values(efficiencies);

    res.status(200).json(efficienciesArray);
}