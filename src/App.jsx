import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
} from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

const capitalizeFirstLetter = (word) => {
  return word[0].toUpperCase() + word.substring(1)
}

const joinStrings = (words) => {
  const wordsArray = words.split(" ")
  for (let i = 0; i < wordsArray.length; i++) {
    wordsArray[i] = capitalizeFirstLetter(wordsArray[i])
  }
  return wordsArray.join(" ")
}

function App() {
  const [jobList, setJobList] = useState([])

  const fetchJobLists = async () => {
    try {
      const response = await axios.post(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        { limit: 10, offset: 0 }
      )

      setJobList(response.data?.jdList)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJobLists()
    const hello = joinStrings("hello world")
    console.log({ hello })
  }, [])

  return (
    <div style={{ padding: "2rem 5rem", margin: "0rem" }}>
      <Grid container spacing={2}>
        {jobList &&
          jobList?.map((job) => (
            <Grid key={job.jdUid} item xs={12} lg={4} md={4} sm={12}>
              <Card sx={{ width: "100%" }}>
                <CardHeader title={joinStrings(job.jobRole)} />
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

export default App
