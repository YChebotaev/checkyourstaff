import React from "react";
import ReactDOM from "react-dom/client";
import { format } from "date-fns";
import { SummaryChart } from "./components/SummaryChart";
import reportWebVitals from "./reportWebVitals";
import "./style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

fetch("http://localhost:3001/chart_data")
  .then((resp) => resp.json())
  .then((data) => {
    root.render(
      <React.StrictMode>
        <SummaryChart
          data={data.map((p: any) => ({
            t: format(Date.parse(p.t), "dd.MM.yyyy"),
            Удовлетворенность: p["1"],
            Нагрузка: p["2"],
            Счастье: p["3"],
          }))}
        />
      </React.StrictMode>,
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
