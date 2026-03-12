import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Dashboard() {
  const [crags, setCrags] = useState([]); // all crags from DB
  const [formData, setFormData] = useState({
    route_name: "",
    parent_sector: "",
    type_string: "",
    YDS: "",
    Vermin: "",
    parent_loc: "",
    description: "",
  });

  const { token, user, logout } = useContext(AuthContext);

  // fetch crags once
  useEffect(() => {
    fetch("http://localhost:5000/api/crags")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch crags");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setCrags(data.slice(0, 10)); // show first 10 for preview
      })
      .catch((err) => console.error("Error fetching crags:", err));
  }, []);

  // controlled form
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // POST new crag
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/crags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add crag");
      }

      const newCrag = await response.json();
      setCrags([newCrag, ...crags]); // add new crag to top
      setFormData({
        route_name: "",
        parent_sector: "",
        type_string: "",
        YDS: "",
        Vermin: "",
        parent_loc: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // DELETE crag
  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/crags/${id}`, {
        method: "DELETE",
        headers: { Authorization: token },
      });
      if (!response.ok) throw new Error("Failed to delete crag");
      setCrags(crags.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <div className="page-container">
      <header
        className="main-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Rock Route Collection Dashboard</h1>
          {user && (
            <h3 style={{ color: "#2e7d32", marginTop: 5 }}>
              Welcome back, {user.username}!
            </h3>
          )}
        </div>
        <button
          onClick={logout}
          className="delete-btn"
          style={{ backgroundColor: "#c62828" }}
        >
          Logout
        </button>
      </header>

      <div
        className="content-wrapper"
        style={{ display: "flex", gap: "20px", marginTop: "20px" }}
      >
        {/* Form panel */}
        <div className="left-panel" style={{ flex: "1" }}>
          <div className="card form-card">
            <h3>Add New Route</h3>
            <form onSubmit={handleSubmit}>
              <label>Route Name</label>
              <input
                name="route_name"
                value={formData.route_name}
                onChange={handleChange}
                required
              />

              <label>Parent Sector</label>
              <input
                name="parent_sector"
                value={formData.parent_sector}
                onChange={handleChange}
                required
              />

              <label>Type of Route</label>
              <input
                name="type_string"
                value={formData.type_string}
                onChange={handleChange}
                required
              />

              <label>YDS</label>
              <input
                name="YDS"
                value={formData.YDS}
                onChange={handleChange}
                required
              />

              <label>Vermin</label>
              <input
                name="Vermin"
                value={formData.Vermin}
                onChange={handleChange}
                required
              />

              <label>Parent Location</label>
              <input
                name="parent_loc"
                value={formData.parent_loc}
                onChange={handleChange}
                required
              />

              <label>Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <button type="submit">Add Route</button>
            </form>
          </div>
        </div>

        {/* Crag grid */}
        <div className="right-panel" style={{ flex: "2" }}>
          <h3>Preview of First 10 Crags</h3>
          <div
            className="crag-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            {crags.length > 0 ? (
              crags.map((crag) => (
                <div key={crag._id} className="crag-card">
                  <h4>{crag.route_name}</h4>
                  <p>
                    <strong>Sector/Location:</strong> {crag.parent_sector} /{" "}
                    {crag.parent_loc}
                  </p>
                  <p>
                    <strong>Type:</strong> {crag.type_string}
                  </p>
                  <p>
                    <strong>YDS/Vermin:</strong> {crag.YDS} {crag.Vermin}
                  </p>
                  <p>{crag.description}</p>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(crag._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No crags available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
