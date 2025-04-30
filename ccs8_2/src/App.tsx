import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Body1 from "./components1/body/Body1";
import Body2 from "./components1/body/Body2";
import CoffeeProfiles from "./components1/coffeeprofiles/CoffeeProfiles";
import ContactUs from "./components1/contactus/ContactUs";
import FaqPage from "./components1/faqs/FaqPage";


function App() {
    const path = ["", "contact", "aboutus", "faq", "coffeeprofiles", "contactus"]
  return (
      <Router>
          <header><NavBar path={path}/></header>
          <Routes>
              <Route path={`${path[0]}`} element={<Body2 />} />
              <Route path={`${path[3]}`} element={<FaqPage />} />
              <Route path={`${path[2]}`} element={<Body1 />} />
              <Route path={`${path[4]}`} element={<CoffeeProfiles />} />
              <Route path={`${path[5]}`} element={<ContactUs />} />
          </Routes>
      </Router>
  );
}

export default App;
