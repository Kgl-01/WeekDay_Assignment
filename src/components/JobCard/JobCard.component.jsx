import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  styled,
} from "@mui/material"
import BoltIcon from "@mui/icons-material/Bolt"

import { forwardRef, useContext } from "react"
import { capitalizeFirstLetter, joinStrings } from "../../utils/stringHelperFn"
import { JobListContext } from "../../App"

const CustomBoltIcon = styled(BoltIcon)(({ theme }) => ({
  color: "#FF822D",
}))

const JobCard = forwardRef(({ job, index }, ref) => {
  const { expandDescription } = useContext(JobListContext)
  return (
    <Grid item xs={12} lg={4} md={4} sm={6}>
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
        ref={ref}
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
          avatar={<Avatar aria-label="image" src={job?.logoUrl} />}
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
              {job?.companyName ? job.companyName : "Weekday"}
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
          subheader={<small>{capitalizeFirstLetter(job.location)}</small>}
        />

        <CardContent sx={{ position: "relative" }}>
          <Typography fontWeight="lighter">
            Estimated Salary: ${job.minJdSalary && `${job.minJdSalary}k`}
            {job.minJdSalary && job?.maxJdSalary ? " - " : ""}
            {`${job.maxJdSalary}k`} {job?.salaryCurrencyCode}
          </Typography>
          <Typography variant="h6">About Company:</Typography>
          <div
            style={{
              overflow: "auto",
              height: !job.showMore && "20.5rem",
              scrollbarWidth: "none",
              pointerEvents: "none",
              textWrap: "balance",
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
              boxShadow: !job.showMore && "0rem -2rem 2rem rgba(255,255,255,1)",
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
  )
})

export default JobCard
