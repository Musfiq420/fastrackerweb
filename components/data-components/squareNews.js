import NewsBar from '@/components/ui-components/molecules/NewsBar'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const SquareNews = () => {
  const [title, setTitle] = useState("");
  const [news, setNews] = useState("");
  const [iteration, setIteration] = useState(0);

  const getNewsData = async() => {
    const value = await axios.get('/api/getSquareNews')
    const n = value.data.length;
    const i = iteration%n;


    const reg = /\\n/g
    const str = value.data[i].News;
    const newStr = str.replace(reg, " ");

    console.log(newStr.length/10);

    setNews(newStr);
    setTitle(value.data[i].dept);
    console.log(value);
  } 
  
  useEffect(() => {
    getNewsData();
  }, [iteration])

  const onIterate = () => {
    setIteration(iteration+1);
  }

  return (
    <NewsBar title={title}
    content={news}
    onIteration={onIterate}
    duration={50}
    />
  )
}

export default SquareNews