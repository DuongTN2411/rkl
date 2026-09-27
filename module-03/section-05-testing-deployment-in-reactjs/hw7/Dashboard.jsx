import React from "react";

function Chart({ id }) {
  return <div className="chart">Chart {id}</div>;
}

function Dashboard() {
  return (
    <div>
      <h1>Title</h1>
      {Array.from({ length: 10 }).map((_, i) => (
        <Chart key={i} id={i + 1} />
      ))}
    </div>
  );
}

export default Dashboard;
