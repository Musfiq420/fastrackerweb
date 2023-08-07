import axios from "axios";

export default async function getHourlyProduction (req, res) {
    const { line } = req.query;
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("en-029", {
        year: '2-digit',
        month: "2-digit",
        day: '2-digit'
        }).replace(/\//g, '-');
    const value = await axios.get(`https://firsttrial-cff1d-default-rtdb.firebaseio.com/hourlyProductionData_v_200/${dateString}/${line}.json`)
    const data = value.data;
    const tempHourlyProductionArray = []

    if(data)
      {
        let tempTarget = 0;
        let tempProduction = 0;
        for(let hour=8; hour<=18; hour++)
        {
          if(data[hour])
          {
            tempHourlyProductionArray.push({
              hour: hour,
              production: data[hour].production,
              issue: data[hour].issue,
              target: data[8].target,
              entry: true
            })
            tempTarget=tempTarget+data[8].target;
            tempProduction=tempProduction+data[hour].production;
          }
          else {
            tempHourlyProductionArray.push({
              hour: hour,
              production: 0,
              issue: "",
              target: data[8].target,
              entry: false
            })
          }
        }
        res.status(200).json(tempHourlyProductionArray
            // { 
            // production: tempHourlyProductionArray,
            // achievement: [{ name: 'L1', value: tempTarget>0?Number(((tempProduction/tempTarget)*100).toFixed()):0 }]
        // }
        );
      }
      else {
        res.status(200).json([]
            // { 
            // production: [],
            // achievement: [{ name: 'L1', value: 0 }]
        // }
        );

        // setHourlyProductionArray([])
        // setHourlyAchievement([
        //   { name: 'L1', value: 0 }
        // ]);
        // setLoading(false);
        // console.log('empty')
      }
}