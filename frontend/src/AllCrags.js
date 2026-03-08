import { useEffect, useState } from "react";

function AllCrags() {
  const [crags, setCrags] = useState([]);

  useEffect(() => {
    fetch("/crags.json")
      .then((res) => res.json())
      .then((data) => setCrags(data));
  }, []);

  return (
    <div>
      <h1>All Crags</h1>

      {crags.map((crag, index) => (
        <div key={index}>
          <h3>{crag.Common_Name}</h3>
        </div>
      ))}
    </div>
  );
}

export default AllCrags;
