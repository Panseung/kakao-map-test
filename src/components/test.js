import { useEffect, useState } from "react"

export default function Test() {
  const [arr, setArr] = useState([])

  const onHandle = function() {
    const tmpArr = [7,2,6,8,5,2,56,2,4,6,1]
    setArr(tmpArr)
    tmpArr.sort()
  }

  useEffect(() => {
    console.log(arr)
  }, [arr])


  return (
    <div>
      <button onClick={() => {onHandle()}}>test</button>
      {arr.map((v, i) => {
        return (<div key={i}>{v}</div>)
      })}
    </div>
  )
}