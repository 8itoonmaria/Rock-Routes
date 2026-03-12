import { useEffect, useState } from "react";

function AllCrags() {
  const [crags, setCrags] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/crags")
      .then((res) => res.json())
      .then((data) => setCrags(data));
  }, []);

  return (
    <div>
      <h1>All Crags</h1>

      {crags.map((crag, index) => (
        <div key={index}>
          <h3>{crag.route_name}</h3>
        </div>
      ))}
    </div>
  );
}

export default AllCrags;
