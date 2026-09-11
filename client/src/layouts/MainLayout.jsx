import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Browser from "../pages/Browser";
import BrowseCategories from "../components/BrowseCategories";
import Popular from "../components/Popular";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    
  
      <Footer />
    </>
  );
};

export default MainLayout;