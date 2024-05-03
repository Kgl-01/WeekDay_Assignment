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
import { createContext, useCallback, useEffect, useRef, useState } from "react"
import Select from "react-select"
import JobCard from "./components/JobCard/JobCard.component"
import JobDirectory from "./components/JobDirectory/JobDirectory.component"

export const JobListContext = createContext(null)

function App() {
  const [jobList, setJobList] = useState([])
  const limitRef = useRef(9)
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
    setIsLoading(true)
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
    } finally {
      setIsLoading(true)
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
      <JobListContext.Provider
        value={{ jobList, expandDescription, isLoading, cardRef }}
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

        <JobDirectory />
      </JobListContext.Provider>
    </Container>
  )
}

export default App
