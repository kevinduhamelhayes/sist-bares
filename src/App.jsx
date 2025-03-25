import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import MenuItems from "./components/MenuItems"
import Report from "./components/Report"
import ManageMenuItems from "./components/ManageMenuItems"
import { AuthProvider } from "./context/AuthContext"
import { ThemeContext } from "./context/ThemeContext"
import { useContext } from "react"
import AddSpecialTable from "./components/AddSpecialTable"
import { TableProvider } from "./context/TableContext"

function App() {
  const { isDarkMode } = useContext(ThemeContext)

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: "#1565c0",
          },
          secondary: {
            main: "#f50057",
          },
        },
      }),
    [isDarkMode]
  )

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TableProvider>
          <Router>
            <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/menu-items" element={<MenuItems />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/manage-menu-items" element={<ManageMenuItems />} />
                  <Route path="/add-special-table" element={<AddSpecialTable />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </TableProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
