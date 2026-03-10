import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext"; // import the global "cloud" to access our token and user

function Dashboard() {
  // local State: managing the data strictly on this specific page
  const [crags, setCrags] = useState([]); // holds the array of plants from the database
  const [formData, setFormData] = useState({
    // holds the current text typed into the form
    route_name: "",
    parent_sector: "",
    type_string: "",
    YDS: "",
    Vermin: "",
    parent_loc: "",
    description: "",
  });

  // tap into our AuthContext
  // we grab the token, the decoded user object (for the greeting),
  // and the logout function (to attach to our button)
  const { token, user, logout } = useContext(AuthContext);

  // initial data load: runs once when the Dashboard first appears on the screen
  useEffect(() => {
    // GET is a public route on our backend, so we DO NOT need to attach the token here
    // anyone can view the crags.
    fetch("http://localhost:5000/api/crags")
      .then((res) => res.json())
      .then((data) => setCrags(data))
      .catch((err) => console.error("Error fetching crags:", err));
  }, []); // empty array ensures this only happens once on mount

  // helper function for the Controlled Form
  // Updates the specific field in our formData state based on the input's 'name' attribute
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // creating data: protected POST request
  async function handleSubmit(e) {
    e.preventDefault(); // stop the page from refreshing

    try {
      const response = await fetch("http://localhost:5000/api/crags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // attach the token to prove user is authorized
          Authorization: token,
        },
        body: JSON.stringify(formData), // send the form data to the server
      });

      // basic error handling if the token is invalid/missing or the server rejects
      if (!response.ok) {
        // console.log("TOKEN:", sessionStorage.getItem(token));
        // throw new Error("Failed to add crag. Are you authorized?");
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Server error:", errorData);
          throw new Error(errorData.message || "Failed to add crag");
        }
      }

      // if successful, the server sends back the newly created crag (including its new MongoDB _id)
      const newCrag = await response.json();

      // update our local React state to include the new crag instantly without refreshing the page
      setCrags([...crags, newCrag]);

      // clear the form fields
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
      alert(err.message); // show the error to the user
    }
  }

  // deleting data: protected DELETE request
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/crags/${id}`, {
        method: "DELETE",
        headers: {
          // attach the token to prove user is authorized - again
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete. Are you authorized?");
      }

      // if the backend successfully deleted it, remove it from our local React state
      // this filters out the deleted crag so it disappears from the screen instantly
      setCrags(crags.filter((crag) => crag._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

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
          <h1 style={{ margin: 0 }}>Rock Route Collection Dashboard</h1>
          {/* conditional rendering: only show the welcome message if the user object successfully loaded */}
          {user && (
            <h3 style={{ color: "#2e7d32", marginTop: "5px", marginBottom: 0 }}>
              Welcome back, {user.username}!
            </h3>
          )}
        </div>

        {/* Logout button: connected directly to the global logout function from our Context */}
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#c62828",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </header>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="card form-card">
            <h3>Add New Route</h3>
            <form onSubmit={handleSubmit} className="crag-form">
              <label>Route Name</label>
              {/* note: 'name' must match the keys in our formData state for handleChange to work */}
              <input
                name="route_name"
                value={formData.route_name}
                onChange={handleChange}
                placeholder="e.g. Monkey Face"
                required
              />

              <label>Parent Sector</label>
              <input
                name="parent_sector"
                value={formData.parent_sector}
                onChange={handleChange}
                placeholder="e.g. Smith Rock"
                required
              />

              <label>Type of Route</label>
              <input
                name="type_string"
                value={formData.type_string}
                onChange={handleChange}
                placeholder="e.g. Sport, Trad, Bouldering"
                required
              />

              <label>YDS</label>
              <input
                name="YDS"
                value={formData.YDS}
                onChange={handleChange}
                placeholder="e.g. 5.10a, Yosemite Decimal System grade"
                required
              />

              <label>Vermin</label>
              <input
                name="Vermin"
                value={formData.Vermin}
                onChange={handleChange}
                placeholder="e.g. V-scale grade (used for bouldering)"
                required
              />

              <label>Parent Location</label>
              <input
                name="parent_loc"
                value={formData.parent_loc}
                onChange={handleChange}
                placeholder="e.g. [latitude, longitude]"
                required
              />
              <label>Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. A classic sport route with a steep overhang and great holds."
                required
              />

              <button type="submit">Add Route</button>
            </form>
          </div>
        </div>

        {/* right panel: the grid of crags */}
        <div className="right-panel">
          <div className="crag-grid">
            {/* array map: loop over every crag in our state array and create a card for it */}
            {crags.map((crag) => (
              // keys are required by React to keep track of list items efficiently
              <div key={crag._id} className="crag-card">
                <div className="image-container">
                  {/* conditional rendering for the image */}
                  {crag.imgUrl ? (
                    <img src={crag.imgUrl} alt={crag.commonName} />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>
                <div className="card-details">
                  <h3>{crag.route_name}</h3>
                  <p>
                    <strong>Parent Sector/Location:</strong>{" "}
                    {crag.parent_sector}/{crag.parent_loc}
                  </p>
                  <p>
                    <strong>Type of Route:</strong> {crag.type_string}
                  </p>
                  <p>
                    <strong>YDS/Vermin:</strong>
                    {crag.YDS} {crag.Vermin}
                  </p>
                  <p>{crag.description}</p>
                  {/* connect the delete button to our handleDelete function, passing the specific plant's ID */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(crag._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
