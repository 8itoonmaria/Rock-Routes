import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [allCrags, setAllCrags] = useState([]); // store everything for filtering
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  // search state - the search term
  const [searchTerm, setSearchTerm] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // data fetching - GET all crags (GET is the default method)
  useEffect(() => {
    fetch("http://localhost:5000/api/crags")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllCrags(data);
        }
      })
      .catch((err) => console.error("Error fetching public crags!:", err));
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/dashboard"); // redirect to dashboard if already logged in
    }
  }, [token, navigate]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // authentication logic
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  // search logic
  const filteredCrags = allCrags
    .filter((crag) => {
      return (crag.route_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .slice(0, 10); // Show only top 10 (5 per row)

  // helper function to clean image URLs from Google Search redirects
  function getCleanImageUrl(url) {
    if (!url) return null;
    if (url.includes("search?q=")) {
      try {
        const directUrl = url.split("search?q=")[1];
        return decodeURIComponent(directUrl);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  return (
    <div className="App">
      {/* LOGIN */}
      <div className="auth-container">
        <div className="auth-card card">
          <h2>Welcome Back to Rock Routes</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="card">
        <h3 className="section-title">Search Routes</h3>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search by route name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button onClick={() => setSearchTerm("")}>Clear</button>
        </div>
      </div>

      {/* PREVIEW GRID */}
      <div className="card">
        <h3 className="section-title">Route Collection Preview</h3>

        <div className="crag-grid">
          {filteredCrags.length > 0 ? (
            filteredCrags.map((crag) => (
              <div key={crag._id} className="crag-card">
                <div className="image-container">
                  {crag.img_url ? (
                    <img
                      src={getCleanImageUrl(crag.img_url)}
                      alt={crag.route_name}
                    />
                  ) : (
                    <div className="placeholder">No Image</div>
                  )}
                </div>

                <div className="card-details">
                  <h4>{crag.route_name}</h4>
                  <p>
                    <strong>{crag.parent_sector}</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No routes match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
