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
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Select from "react-select"
import JobCard from "./components/JobCard/JobCard.component"
import JobDirectory from "./components/JobDirectory/JobDirectory.component"
import _ from "lodash"
import { capitalizeFirstLetter } from "./utils/stringHelperFn"
import { applyFilter } from "./utils/filterFn"

export const JobListContext = createContext(null)

function App() {
  const [jobList, setJobList] = useState([])
  const limitRef = useRef(9)
  const offsetRef = useRef(0)

  const [minExpOptions, setMinExpOptions] = useState(
    Array.from({ length: 25 }, (_, i) => ({ label: i + 1, value: i + 1 }))
  )
  const [companyOptions, setCompanyOptions] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [minBasePayOptions, setMinBasePayOptions] = useState([])

  const [minExp, setMinExp] = useState(null)
  const [companyName, setCompanyName] = useState("")
  const [location, setLocation] = useState("")
  const [jobRole, setJobRole] = useState("")
  const [minJdSal, setMinJdSal] = useState(null)

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
        }
        const uniqueCompanyNames = _.uniqBy(
          [...jobList, ...jdList],
          (job) => job.companyName
        ).map((job) => ({
          label: capitalizeFirstLetter(job.companyName),
          value: job.companyName,
        }))
        setCompanyOptions((prevOptions) => [
          ...prevOptions,
          ...uniqueCompanyNames,
        ])

        const uniqueLocation = _.uniqBy(
          [...jobList, ...jdList],
          (job) => job.location
        ).map((job) => ({
          label: capitalizeFirstLetter(job.location),
          value: job.location,
        }))
        setLocationOptions((prevOptions) => [...prevOptions, ...uniqueLocation])

        const uniqueRole = _.uniqBy(
          [...jobList, ...jdList],
          (job) => job.jobRole
        ).map((job) => ({
          label: capitalizeFirstLetter(job.jobRole),
          value: job.jobRole,
        }))
        setRoleOptions((prevOptions) => [...prevOptions, ...uniqueRole])

        const uniqueMinBasePay = _.uniqBy(
          [...jobList, ...jdList],
          (job) => job.minJdSalary
        )
          .filter((job) => job.minJdSalary != null)
          .map((job) => ({
            label: `$${job.minJdSalary}k ${job.salaryCurrencyCode}`,
            value: `${job.minJdSalary}`,
          }))
        setMinBasePayOptions((prevOptions) => [
          ...prevOptions,
          ...uniqueMinBasePay,
        ])
        console.log({ uniqueMinBasePay })

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

  const filteredJobListngs = applyFilter(
    jobList,
    minExp || companyName || location || jobRole || minJdSal
  )

  console.log({ filteredJobListngs })

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
      <Typography variant="h3" width="100%" textAlign="center">
        JOB FINDER
      </Typography>
      <JobListContext.Provider
        value={{
          jobList: filteredJobListngs,
          expandDescription,
          isLoading,
          cardRef,
        }}
      >
        <Grid container spacing={2}>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              placeholder="Min. Experience"
              options={minExpOptions}
              onChange={(option) => setMinExp(option.value)}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              placeholder="Company Name"
              options={companyOptions}
              onChange={(option) => setCompanyName(option.value)}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              placeholder="Location"
              options={locationOptions}
              onChange={(option) => setLocation(option.value)}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              placeholder="Role"
              options={roleOptions}
              onChange={(option) => setJobRole(option.value)}
            />
          </Grid>
          <Grid item lg={3} md={4} sm={6} xs={12}>
            <Select
              placeholder="Min Base Pay Salary"
              options={minBasePayOptions}
              onChange={(option) => setMinJdSal(option.value)}
            />
          </Grid>
        </Grid>

        <JobDirectory />
      </JobListContext.Provider>
    </Container>
  )
}

export default App
