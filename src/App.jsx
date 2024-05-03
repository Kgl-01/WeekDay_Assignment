import BoltIcon from "@mui/icons-material/Bolt"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
  styled,
} from "@mui/material"
import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import Select from "react-select"

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
  const limitRef = useRef(10)
  const offsetRef = useRef(0)

  const [minExpOptions, setMinExpOptions] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [jobTypeOptions, setJobTypeOptions] = useState([])
  const [techStackOptions, setTechStackOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [minBasePayOptions, setMinBasePayOptions] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const cardRef = useCallback((node) => {
    if (node == null) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchJobLists()
        observer.unobserve(node)
      }
    })
    observer.observe(node)
  }, [])

  const dropdownOptionsSetter = (data) => {
    setMinExpOptions(
      Array.from({ length: "20" }, (_, i) => ({ label: i + 1, value: i + 1 }))
    )
    console.log(data.filter((job) => data.indexOf(job)))
  }

  const fetchJobLists = async ({ overwrite = false } = {}) => {
    try {
      offsetRef.current = !overwrite ? offsetRef.current + limitRef.current : 0
      const response = await axios.post(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        { limit: limitRef.current, offset: offsetRef.current }
      )
      if (response.status === 200) {
        const jdList = await response.data?.jdList.map((jd) => ({
          ...jd,
          showMore: false,
        }))
        console.log({ jdList })
        if (overwrite) {
          setJobList(jdList)
        } else {
          setJobList((prevJobList) => [...prevJobList, ...jdList])
          console.log("hello")
        }

        // dropdownOptionsSetter(jdList)
        return
      }
      return Promise.reject(response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchJobLists({ overwrite: true })
  }, [])

  const expandDescription = (index) => {
    const updatedJobList = jobList.map((job, idx) => {
      if (idx == index) {
        return { ...job, showMore: !job?.showMore }
      }
      return job
    })

    setJobList(updatedJobList)
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <Select placeholder="Min. Experience" options={minExpOptions} />
        </Grid>
        <Grid item>
          <Select
            placeholder="Company Name"
            options={[{ label: "Weekday", value: "weekDay" }]}
          />
        </Grid>
        <Grid item>
          <Select placeholder="Location" />
        </Grid>
        <Grid item>
          <Select placeholder="Remote/Onsite" />
        </Grid>
        <Grid item>
          <Select placeholder="Tech Stack" />
        </Grid>
        <Grid item>
          <Select placeholder="Role" />
        </Grid>
        <Grid item>
          <Select placeholder="Min Base Pay Salary" />
        </Grid>
      </Grid>

      <Grid container spacing={8}>
        {jobList &&
          jobList?.map((job, index) => (
            <Grid item xs={12} lg={4} md={4} sm={6} key={job.jdUid}>
              <Card
                sx={{
                  width: "100%",
                  boxShadow: "none",
                  filter: "drop-shadow(0rem 0rem 0.25rem #00000025)",
                  borderRadius: "1rem",
                  transform: "scale(1)",
                  transition: "all 0.1s ease-out",
                  padding: "1rem",
                  "&:hover": {
                    transform: "scale(1.01)",
                    transition: "all cubic-bezier(0.4, 0, 0.2, 1) 0.1s ease-in",
                  },
                }}
                ref={index == jobList.length - 1 ? cardRef : undefined}
              >
                <Chip
                  label="⏳ Posted 10 days ago"
                  sx={{
                    background: "transparent",
                    boxShadow: "0rem 0rem 0.5rem #00000040",
                  }}
                  size="small"
                />
                <CardHeader
                  avatar={
                    <Avatar aria-label="image">
                      {job.location[0].toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography
                      style={{
                        padding: "0rem",
                        margin: "0rem",
                        fontWeight: "500",
                        color: "#8b8b8b",
                        fontSize: "1rem",
                      }}
                    >
                      Week Day
                      <Typography
                        style={{
                          padding: "0rem",
                          margin: "0rem",
                          fontWeight: "500",
                          color: "#000",
                        }}
                        variant="h6"
                      >
                        {joinStrings(job.jobRole)}
                      </Typography>
                    </Typography>
                  }
                  subheader={
                    <small>{capitalizeFirstLetter(job.location)}</small>
                  }
                />

                <CardContent sx={{ position: "relative" }}>
                  <Typography>
                    Estimated Salary: $
                    {job.minJdSalary && `${job.minJdSalary}k`}
                    {job.minJdSalary && job?.maxJdSalary ? " - " : ""}
                    {`${job.maxJdSalary}k`} USD
                  </Typography>
                  <Typography variant="h6">About Company:</Typography>
                  <div
                    style={{
                      overflow: "auto",
                      height: !job.showMore && "20.5rem",
                      scrollbarWidth: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {job.jobDetailsFromCompany}
                  </div>
                  <Button
                    sx={{
                      width: "100%",
                      background: !job.showMore
                        ? "linear-gradient(to bottom,rgba(255,255,255,0.9), white)"
                        : "#fff",
                      position: !job.showMore && "absolute",
                      left: !job.showMore && "0",
                      bottom: !job.showMore && "0",
                      height: "3rem",
                      textTransform: "none",
                      boxShadow:
                        !job.showMore && "0rem -2rem 2rem rgba(255,255,255,1)",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    disableRipple={true}
                    onClick={() => expandDescription(index)}
                  >
                    Show {job.showMore ? "less" : "more"}
                  </Button>
                </CardContent>
                <CardActions>
                  <Grid container spacing={3}>
                    <Grid item display={"flex"} flexDirection={"column"}>
                      <Typography variant="h7" fontWeight={600}>
                        Minimum Experience
                      </Typography>
                      <Typography variant="h8">
                        {job.minExp ? `${job.minExp} years` : "Any"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
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
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  )
}

export default App
