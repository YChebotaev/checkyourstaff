import { type FC } from "react";

export const TextFeedback: FC<{ data: any }> = ({ data }) => (
  <div>
    {data.map((s: any) => (
      <div
        key={s.t}
        style={{
          border: "1px solid gray",
          marginBottom: "2rem",
        }}
      >
        <h4>{s.t}</h4>
        <table width="100%">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Вопрос</th>
              <th style={{ textAlign: "left" }}>Фидбек</th>
            </tr>
          </thead>
          <tbody>
            {s.a.map((a: any, index: number) => (
              <tr key={index}>
                <td>{a.q}</td>
                <td>{a.f}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);
