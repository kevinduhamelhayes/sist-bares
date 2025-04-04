import React from "react"
import { Routes, Route } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import ManageMenuItems from "./components/ManageMenuItems"
import AddProducts from "./components/AddProducts"
import { AuthProvider } from "./context/AuthContext"
import { ThemeContext } from "./context/ThemeContext"
import { useContext } from "react"
import AddSpecialTable from "./components/AddSpecialTable"
import { TableProvider } from "./context/TableContext"
import { OrderProvider } from "./context/OrderContext"
import { MenuProvider } from "./context/MenuContext"
import ReportsPage from "./pages/ReportsPage"
import './App.css'
import './index.css'

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
          <OrderProvider>
            <MenuProvider>
              <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
                <Navbar />
                <div className="content">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<ProtectedRoute />}>
                      <Route index element={<Home />} />
                      <Route path="add-special-table" element={<AddSpecialTable />} />
                      <Route path="add-products" element={<AddProducts />} />
                      <Route path="menu" element={<ManageMenuItems />} />
                      <Route path="reports" element={<ReportsPage />} />
                    </Route>
                  </Routes>
                </div>
                <Footer />
              </div>
            </MenuProvider>
          </OrderProvider>
        </TableProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
