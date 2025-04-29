import {Container} from "@mui/material";
import NavBar from "./components1/navbar/NavBar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Body1 from "./components1/body/Body1";
import Body2 from "./components1/body/Body2";
import Body3 from "./components1/faqs/Body3";


function App() {
    const path = ["", "contact", "aboutus", "faq"]
  return (
      <Router>
          <header><NavBar path={path}/></header>
          <Container>
              <Routes>
                  <Route path={`${path[0]}`} element={<Body2 />} />
                  <Route path={`${path[1]}`} element={<Body3 />} />
                  <Route path={`${path[2]}`} element={<Body1 />} />
              </Routes>
          </Container>
      </Router>
  );
}

export default App;
