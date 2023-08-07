import { database } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function modifyArray(inputArray) {
  // Create an object to store the modified data
  const modifiedData = {};

  // Iterate over the input array
  inputArray.forEach((item) => {
    const { date, dept, efficiency } = item;
    const modifiedDate = date.replace(',', ''); // Remove comma from the date

    // Create or update the modifiedData object based on the department
    if (!(modifiedDate in modifiedData)) {
      modifiedData[modifiedDate] = {
        date: modifiedDate,
      };
    }

    modifiedData[modifiedDate][`${dept.toLowerCase()}`] = efficiency;
  });

  // Convert the modifiedData object to an array
  const outputArray = Object.values(modifiedData);

  return outputArray;
}


export default async function getEfficiencyByDateRange (req, res) {
    const { date, day} = req.query;
    
    const currDate = new Date(date)
    const startDate = new Date(date)
    startDate.setDate(startDate.getDate() - day)

    const colRef = collection(database, 'productionsInformations');
    const q = query(colRef, where("date", ">=", startDate), where("date", "<=", currDate), where("departmentsName","in", ["Cutting", "Sewing", "Embroidery", "Printing", "Finishing"]));
    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty)
    {
      res.status(200).json([]);
    }
    
    const tempEfficiencyArray = []
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      tempEfficiencyArray.push({
        date: (data['date'].toDate().getDate()+', '+data['date'].toDate().toLocaleString('default', {month: 'short' })),
        dept: data["departmentsName"],
        efficiency: (((data["SMV"] * data["production"]) / (data["manpower"] * data["hour"] * 60)) * 100).toFixed(2),
      },)
    });
    
    const modifiedEfficiencyArray = modifyArray(tempEfficiencyArray)
    res.status(200).json(modifiedEfficiencyArray);


  }