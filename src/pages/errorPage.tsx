import { Box, Typography, useTheme } from "@mui/material";
import NavBar from "../components/NavBar";


const ErrorPage = () => {
  const theme = useTheme()
  return <>
  <div>
      <NavBar/>
    <Box sx={{marginTop:'250px'}}>
      <Typography variant="h2">
              Error!
      </Typography>
    </Box>
  </div>
  </>;
};

export default ErrorPage;
