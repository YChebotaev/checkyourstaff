import React from "react";
import ReactDOM from "react-dom/client";
import { format } from "date-fns";
import { SummaryChart } from "./components/SummaryChart";
import { TextFeedback } from "./components/TextFeedback";
import reportWebVitals from "./reportWebVitals";
import "./style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

Promise.all([
  fetch(`${process.env["REACT_APP_SERVICE_URL"]}/chart_data`),
  fetch(`${process.env["REACT_APP_SERVICE_URL"]}/text_feedback`),
])
  .catch(e => {
    if (e instanceof Error) {
      root.render(
        <React.StrictMode>
          {e.message}
        </React.StrictMode>
      )
    }
  })
  .then((resps) => Promise.all(resps.map((resp) => resp.json())))
  .then(([chartData, textFeedback]) => {
    root.render(
      <React.StrictMode>
        <SummaryChart
          data={chartData.map((p: any) => ({
            t: format(Date.parse(p.t), "dd.MM.yyyy"),
            Удовлетворенность: p["1"],
            Нагрузка: p["2"],
            Счастье: p["3"],
          }))}
        />
        <TextFeedback
          data={textFeedback.map((s: any) => ({
            ...s,
            a: s.a.map((a: any) => ({
              ...a,
              q:
                a.q === "1"
                  ? "Насколько вы удовлетворены результатами своей работы на этой неделе?"
                  : a.q === "2"
                  ? "Насколько высокая рабочая нагрузка была на этой неделе?"
                  : a.q === 3
                  ? "Оцените по шкале от 0 до 5, насколько вы счастливы на работе?"
                  : "???",
            })),
            t: format(Date.parse(s.t), "dd.MM.yyyy"),
          }))}
        />
      </React.StrictMode>,
    );
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
