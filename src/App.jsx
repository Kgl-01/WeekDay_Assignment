import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Container,
  Grid,
  Typography,
  styled,
} from "@mui/material"
import BoltIcon from "@mui/icons-material/Bolt"
import AccountCircleIcon from "@mui/icons-material/AccountCircleRounded"
import axios from "axios"
import { useEffect, useState } from "react"

const CustomBoltIcon = styled(BoltIcon)(({ theme }) => ({
  color: "#FF822D",
}))

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
  }, [])

  return (
    <Container maxWidth="lg" style={{ padding: "4rem 0rem" }}>
      <Grid container spacing={8}>
        {jobList
          ? jobList?.map((job, index) => (
              <Grid item xs={12} lg={4} md={4} sm={6} key={job.jdUid}>
                <Card
                  sx={{
                    width: "100%",
                    boxShadow: "none",
                    filter: "drop-shadow(0rem 0rem 0.25rem #00000025)",
                    borderRadius: "1rem",
                    transition: "all 0.1s ease-out",
                    "&:hover": {
                      transform: "scale(1.01)",
                      transition: "all 0.1s ease-in",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar aria-label="image">
                        {job.location[0].toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <div
                        style={{
                          padding: "0rem",
                          margin: "0rem",
                          fontWeight: "500",
                          color: "#8b8b8b",
                          fontSize: "0.9rem",
                        }}
                      >
                        Week Day
                        <p
                          style={{
                            padding: "0rem",
                            margin: "0rem",
                            fontWeight: "500",
                            color: "#000",
                          }}
                        >
                          {joinStrings(job.jobRole)}
                        </p>
                      </div>
                    }
                    subheader={
                      <small>{capitalizeFirstLetter(job.location)}</small>
                    }
                  />
                  <CardContent>
                    <Typography variant="h6">About Company:</Typography>
                    <div>{job.jobDetailsFromCompany}</div>
                  </CardContent>
                  <CardActions>
                    <Grid container spacing={1}>
                      <Grid item lg={12}>
                        <Button
                          startIcon={<CustomBoltIcon />}
                          variant="contained"
                          sx={{
                            background: "#55EFC4",
                            boxShadow: "none",
                            width: "100%",
                            color: "#000",
                            textTransform: "none",
                            fontSize: "1rem",
                            borderRadius: "0.5rem",
                            "&:hover": {
                              background: "#55EFC4",
                              boxShadow: "none",
                            },
                          }}
                          onClick={() => window.open(job.jdLink, "_blank")}
                        >
                          Easy Apply
                        </Button>
                      </Grid>
                      {index !== 0 && index % 2 == 0 && (
                        <Grid item lg={12}>
                          <Button
                            startIcon={<AccountCircleIcon />}
                            variant="contained"
                            sx={{
                              background: "#4943DA",
                              boxShadow: "none",
                              width: "100%",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: "1rem",
                              borderRadius: "0.5rem",
                              "&:hover": {
                                background: "#4943DA",
                                boxShadow: "none",
                              },
                            }}
                            onClick={() => window.open(job.jdLink, "_blank")}
                          >
                            Ask for referral
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            ))
          : "Loading..."}
      </Grid>
    </Container>
  )
}

export default App
