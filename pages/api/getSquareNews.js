import axios from "axios";

export default async function getSquareNews (req, res) {
    const value = await axios.get(`https://firsttrial-cff1d-default-rtdb.firebaseio.com/SquareNews.json`)
    const data = value.data;

    res.status(200).json(data);
    
}