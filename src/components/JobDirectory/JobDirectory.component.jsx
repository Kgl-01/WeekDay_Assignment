import { Avatar, Box, Button, Card, Grid, Skeleton } from "@mui/material"
import JobCard from "../JobCard/JobCard.component"
import { useContext } from "react"
import { JobListContext } from "../../App"

const JobDirectory = () => {
  const { jobList, isLoading, cardRef } = useContext(JobListContext)
  return (
    <Grid container spacing={8}>
      {jobList?.map((job, index) => (
        <JobCard
          ref={index == jobList.length - 1 ? cardRef : undefined}
          job={job}
          key={job.jdUid}
          index={index}
        />
      ))}
      {isLoading && (
        <Grid item container lg={12} md={12} sm={12} xs={12} spacing={8}>
          {Array.from({ length: 3 }, (_, i) => (
            <Grid item xs={12} lg={4} md={4} sm={6} key={i + 1}>
              <Card
                sx={{
                  width: "100%",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Box sx={{ width: "100%", display: "flex", gap: "1rem" }}>
                  <Skeleton animation="wave" variant="circular">
                    <Avatar />
                  </Skeleton>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      gap: "0",
                      flexDirection: "column",
                    }}
                  >
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton
                        key={i}
                        animation="wave"
                        variant="text"
                        height="16px"
                        width="100%"
                      />
                    ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    // gap: "0.5rem",
                    flexDirection: "column",
                  }}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <Skeleton
                      key={i}
                      animation="wave"
                      variant="text"
                      height="16px"
                      width="100%"
                    />
                  ))}
                </Box>
                <Button>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="100%"
                    height="2rem"
                  />
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  )
}

export default JobDirectory
