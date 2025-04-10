import React from "react";
import Chart from "./pages/chart";
import './App.css'
import ValueProvider from "./components/Context";

const App = () => {
  return (<div className="container">
    <ValueProvider>
      <Chart />
    </ValueProvider>
  </div>)
}
export default App;