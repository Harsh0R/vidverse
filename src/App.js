import { VidverseProvider } from "./Context/VidverseContext";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Pages/home";
import About from "./Pages/aboute";
import Myaccount from "./Pages/myaccount";
import Livestreams from "./Pages/livestream";
import Style from "./App.module.css";

function App() {
  return (
    <VidverseProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/myAccount" element={<Myaccount />} />
          <Route path="/livestream" element={<Livestreams />} />
          {/* <Route path="/blogs" element={<Blogs />} />
          <Route path="/sign-up" element={<SignUp />} /> */}
        </Routes>
      </Router>
    </VidverseProvider>
  );
}

export default App;
