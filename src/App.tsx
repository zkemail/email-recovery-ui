import { Grid, ThemeProvider } from "@mui/material";
import { createContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import { STEPS } from "./constants";
import { AppContextProvider } from "./context/AppContextProvider";
import BurnerWalletFlow from "./pages/burnerWalletFlow";
import EOA7702SafeFlow from "./pages/EOA7702SafeFlow";
import ErrorPage from "./pages/errorPage";
import LandingPage from "./pages/landingPage";
import { Web3Provider } from "./providers/Web3Provider";
import theme from "./theme"; // Import custom theme

// eslint-disable-next-line react-refresh/only-export-components
export const StepsContext = createContext<{
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

function App() {
  const [step, setStep] = useState(STEPS.STEP_SELECTION);

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <StepsContext.Provider
          value={{
            step,
            setStep,
          }}
        >
          <Web3Provider>
            <NavBar />
            <Grid
              container
              style={{ padding: 16, height: "calc(100vh - 70px - 32px)" }}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/burner-wallet" element={<BurnerWalletFlow />} />
                  <Route
                    path="/7702-eoa-wallet"
                    element={<EOA7702SafeFlow />}
                  />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </BrowserRouter>
            </Grid>
          </Web3Provider>
        </StepsContext.Provider>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
