import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import Instructions from "./pages/Instructions/Instructions";
import MicTesting from './pages/MicTesting/MicTesting';
import VachanAssessment from './pages/VachanAssessment/VachanAssessment';
import Temp from './pages/temp/temp';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="landing-page" element={< Instructions />} />
        <Route path="mic-testing" element={< MicTesting />} />
        <Route path="vachan-assessment" element={< Temp />} />
        {/* <Route path="old-vachan-assessment" element={< VachanAssessment />} /> */}
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;