import { useState, useEffect } from "react";
import "./App.css";

const movies = [
  { id: 1, title: "Pushpa 2: The Rule", genre: "Action", language: "Telugu", year: "2024", rating: "8.2", color: "#762b20" },
  { id: 2, title: "Stree 2", genre: "Horror", language: "Hindi", year: "2024", rating: "7.5", color: "#37234d" },
  { id: 3, title: "Sankranthiki Vasthunam", genre: "Comedy", language: "Telugu", year: "2025", rating: "7.0", color: "#8a5120" },
  { id: 4, title: "Premalu", genre: "Romance", language: "Malayalam", year: "2024", rating: "8.0", color: "#9b456c" },
  { id: 5, title: "Ranabaali", genre: "Drama", language: "Telugu", year: "Coming Soon", rating: "—", color: "#65402e" },
  { id: 6, title: "Toxic", genre: "Thriller", language: "Kannada", year: "Coming Soon", rating: "—", color: "#343c48" },
  { id: 7, title: "Moana 2", genre: "Animation", language: "English", year: "2024", rating: "7.0", color: "#146a78" },
  { id: 8, title: "Interstellar", genre: "Sci-Fi", language: "English", year: "2014", rating: "8.7", color: "#253a5a" },
  { id: 9, title: "Kalki 2898 AD", genre: "Sci-Fi", language: "Telugu", year: "2024", rating: "7.5", color: "#3b355f" },
  { id: 10, title: "Devara: Part 1", genre: "Action", language: "Telugu", year: "2024", rating: "6.8", color: "#164f59" },
  { id: 11, title: "Hi Nanna", genre: "Drama", language: "Telugu", year: "2023", rating: "8.2", color: "#81536b" },
  { id: 12, title: "Sita Ramam", genre: "Romance", language: "Telugu", year: "2022", rating: "8.5", color: "#76503c" },
  { id: 13, title: "Salaar: Part 1", genre: "Action", language: "Telugu", year: "2023", rating: "6.5", color: "#34383d" },
  { id: 14, title: "Hanu-Man", genre: "Fantasy", language: "Telugu", year: "2024", rating: "7.8", color: "#8a3d25" },
  { id: 15, title: "RRR", genre: "Action", language: "Telugu", year: "2022", rating: "7.8", color: "#87532d" },
  { id: 16, title: "Animal", genre: "Crime", language: "Hindi", year: "2023", rating: "6.2", color: "#572d32" },
  { id: 17, title: "Jawan", genre: "Action", language: "Hindi", year: "2023", rating: "7.0", color: "#6d3037" },
  { id: 18, title: "3 Idiots", genre: "Comedy", language: "Hindi", year: "2009", rating: "8.4", color: "#326b58" },
  { id: 19, title: "Avatar: The Way of Water", genre: "Sci-Fi", language: "English", year: "2022", rating: "7.6", color: "#246b88" },
  { id: 20, title: "The Batman", genre: "Thriller", language: "English", year: "2022", rating: "7.8", color: "#3a2733" },
];

const genres = [
  "All", "Action", "Horror", "Comedy", "Romance", "Drama", "Thriller",
  "Animation", "Sci-Fi", "Fantasy", "Crime",
];

function makePoster(movie) {
  const title = movie.title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${movie.color}"/>
          <stop offset="100%" stop-color="#101018"/>
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#bg)"/>
      <circle cx="200" cy="220" r="105" fill="#ffffff" opacity=".06"/>
      <circle cx="200" cy="220" r="72" fill="#ffffff" opacity=".05"/>
      <text x="200" y="100" font-size="23" text-anchor="middle"
        font-family="Arial" font-weight="bold" fill="#ffffff">IMOVIES</text>
      <path d="M65 360 L335 360" stroke="#ffffff" stroke-opacity=".4"/>
      <text x="200" y="415" font-size="27" text-anchor="middle"
        font-family="Arial" font-weight="bold" fill="#ffffff">${title}</text>
      <text x="200" y="465" font-size="17" text-anchor="middle"
        font-family="Arial" fill="#eeeeee">${movie.genre} • ${movie.language}</text>
      <text x="200" y="555" font-size="15" text-anchor="middle"
        font-family="Arial" letter-spacing="4" fill="#ffffff">NOW SHOWING</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function MoviePoster({ movie }) {
  const [imageFailed, setImageFailed] = useState(false);

  const posters = {
    1: "/posters/pushpa2.jpg",
    2: "/posters/stree2.jpg",
    3: "/posters/sankranthiki.jpg",
    4: "/posters/premalu.jpg",
    5: "/posters/ranabaali.jpg",
    6: "/posters/toxic.jpg",
    7: "/posters/moana2.jpg",
    8: "/posters/interstellar.jpg",
    9: "/posters/kalki2898ad.jpg",
    10: "/posters/devara.jpg",
    11: "/posters/hinanna.jpg",
    12: "/posters/sitaramam.jpg",
    13: "/posters/salaar.jpg",
    14: "/posters/hanuman.jpg",
    15: "/posters/rrr.jpg",
    16: "/posters/animal.jpg",
    17: "/posters/jawan.jpg",
    18: "/posters/3idiots.jpg",
    19: "/posters/avatar2.jpg",
    20: "/posters/thebatman.jpg",
  };

  return (
    <img
      className="movie-poster"
      src={imageFailed ? makePoster(movie) : posters[movie.id]}
      alt={`${movie.title} poster`}
      onError={() => setImageFailed(true)}
    />
    
  );
}

function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [showProfile, setShowProfile] = useState(false);
const [showBookings, setShowBookings] = useState(false);
useEffect(() => {
    async function loadBookings() {
      const token = localStorage.getItem("token");

      if (!token) {
        setBookings([]);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch bookings: ${response.status}`);
        }

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    loadBookings();
  }, []);


  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("6:30 PM");
  const [tickets, setTickets] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.language.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
      activeGenre === "All" || movie.genre === activeGenre;

    return matchesSearch && matchesGenre;
  });
  useEffect(() => {
  setSelectedSeats([]);

  if (selectedMovie && selectedDate && selectedTime) {
    fetchBookedSeats(
      selectedMovie.title,
      selectedDate,
      selectedTime
    );
  } else {
    setBookedSeats([]);
  }
}, [selectedMovie, selectedDate, selectedTime]);


  function openBooking(movie) {
    setSelectedMovie(movie);
    setSelectedDate("");
    setSelectedTime("6:30 PM");
    setTickets(1);
    setBookingMessage("");
  }
  async function cancelBooking(bookingId) {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${bookingId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel booking");
    }

    setBookings((previousBookings) =>
      previousBookings.filter(
        (booking) => booking._id !== bookingId
      )
    );

    alert("Booking cancelled successfully!");
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    alert(error.message || "Unable to cancel booking.");
  }
}
const seatPrice = 180;

const allSeats = Array.from({ length: 40 }, (_, index) => {
  const row = String.fromCharCode(65 + Math.floor(index / 8));
  const number = (index % 8) + 1;

  return `${row}${number}`;
});

function toggleSeat(seat) {
  setSelectedSeats((previousSeats) => {
    if (previousSeats.includes(seat)) {
      return previousSeats.filter((item) => item !== seat);
    }

    if (previousSeats.length >= 6) {
      alert("You can select a maximum of 6 seats.");
      return previousSeats;
    }

    return [...previousSeats, seat];
  });
}
async function fetchBookedSeats(movie, date, time) {
  if (!movie || !date || !time) {
    setBookedSeats([]);
    return;
  }

  try {
    const params = new URLSearchParams({
      movie,
      date,
      time,
    });

    const response = await fetch(
      `http://localhost:5000/api/booked-seats?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch booked seats");
    }

    setBookedSeats(data.bookedSeats || []);
  } catch (error) {
    console.error("Fetch booked seats error:", error);
    setBookedSeats([]);
  }
}
  async function confirmBooking(event) {
  event.preventDefault();

  if (!selectedDate) {
    setBookingMessage("Please select a date.");
    return;
  }

  if (selectedSeats.length === 0) {
    setBookingMessage("Please select at least one seat.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    setBookingMessage("Please login before booking tickets.");
    return;
  }

  const seatPrice = 180;
  const selectedTickets = selectedSeats.length;
  const totalAmount = selectedTickets * seatPrice;

  const booking = {
    movie: selectedMovie.title,
    date: selectedDate,
    time: selectedTime,
    tickets: selectedTickets,
    seats: selectedSeats,
    total: totalAmount,
  };

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Booking failed: ${response.status}`);
    }

    setBookings((previousBookings) => [
      data.booking,
      ...previousBookings,
    ]);

    setBookingMessage(
      `Booking successful! ${selectedMovie.title} • Seats: ${selectedSeats.join(", ")} • Total: ₹${totalAmount}.`
    );

    setSelectedSeats([]);
  } catch (error) {
    console.error("Booking error:", error);
    setBookingMessage(`Booking failed: ${error.message}`);
  }
}

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">▶</span>
          i<span>MOVIES</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </nav>
        {user ? (
          <div className="user-menu">
            <button
              className="nav-button"
              type="button"
              onClick={() => setShowProfile((current) => !current)}
            >
              👤 Hi, {user.name} ▼
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <p><strong>{user.name}</strong></p>
                <p>{user.email}</p>
                <button
                  className="nav-button"
                  type="button"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Please login to view your bookings.");
                      return;
                    }
                    try {
                      const response = await fetch("http://localhost:5000/api/bookings", {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      const data = await response.json();
                      if (!response.ok) throw new Error(data.message || "Could not load bookings");
                      setBookings(data);
                      setShowBookings(true);
                      setShowProfile(false);
                    } catch (error) {
                      alert(error.message);
                    }
                  }}
                >
                  🎟️ My Bookings
                </button>
                <button
                  className="nav-button"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                    setBookings([]);
                    setShowProfile(false);
                    setShowBookings(false);
                    setSelectedMovie(null);
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button
              className="nav-button"
              type="button"
              onClick={async () => {
                const name = prompt("Enter your name:");
                if (!name) return;
                const email = prompt("Enter your email:");
                if (!email) return;
                const password = prompt("Create a password (minimum 8 characters):");
                if (!password) return;
                try {
                  const response = await fetch("http://localhost:5000/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message || "Signup failed");
                  alert("Account created successfully! Please login.");
                } catch (error) {
                  alert(error.message);
                }
              }}
            >
              Sign Up
            </button>
            <button
              className="nav-button"
              type="button"
              onClick={async () => {
                const email = prompt("Enter your email:");
                if (!email) return;
                const password = prompt("Enter your password:");
                if (!password) return;
                try {
                  const response = await fetch("http://localhost:5000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message || "Login failed");
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  setUser(data.user);
                  setShowProfile(false);
                  alert(`Welcome, ${data.user.name}!`);
                } catch (error) {
                  alert(error.message);
                }
              }}
            >
              Login
            </button>
          </div>
        )}
        <button
  className="nav-button"
  onClick={async () => {
    if (showBookings) {
      setShowBookings(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to view your bookings.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch bookings: ${response.status}`);
      }

      setBookings(data);
      setShowBookings(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert(error.message);
    }
  }}
>
  {showBookings ? "Back to Movies" : "My Bookings"}
</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot"></span>
              YOUR CINEMA EXPERIENCE
            </div>

            <h1>
              Every movie.
              <br />
              <span>One destination.</span>
            </h1>

            <p>
              Discover amazing stories, explore your favourite genres,
              and plan your next big-screen experience with IMovies.
            </p>

            <a className="primary-button" href="#movies">
              Explore Movies <span>→</span>
            </a>

            <div className="hero-stats">
              <div>
                <strong>{movies.length.toString().padStart(2, "0")}</strong>
                <span>Movies</span>
              </div>
              <div>
                <strong>{genres.length - 1}</strong>
                <span>Genres</span>
              </div>
              <div>
                <strong>01</strong>
                <span>Destination</span>
              </div>
            </div>
          </div>

          <div className="hero-art" aria-label="Cinema illustration">
            <div className="art-glow"></div>
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>
            <div className="ticket-art">
              <span className="ticket-symbol">▶</span>
              <span className="ticket-small">YOUR NEXT</span>
              <strong>GREAT<br />STORY</strong>
              <span className="ticket-line"></span>
              <span className="ticket-bottom">NOW SHOWING · IMOVIES</span>
            </div>
            <span className="floating-star star-one">✦</span>
            <span className="floating-star star-two">✧</span>
          </div>
        </section>

                {showBookings && (
          <section className="movies-section" id="my-bookings">
            <div className="section-heading">
              <div>
                <p className="section-kicker">YOUR MOVIE HISTORY</p>
                <h2>My <span>Bookings</span></h2>
                <p className="section-description">
                  Your previously booked movie tickets.
                </p>
              </div>

              <div className="movie-count">
                <strong>
                  {bookings.length.toString().padStart(2, "0")}
                </strong>
                <span>bookings</span>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="empty-state">
                <span>🎟️</span>
                <h3>No bookings yet</h3>
                <p>Your confirmed bookings will appear here.</p>
              </div>
            ) : (
              <div className="booking-history">
                {bookings.map((booking) => (
  <div key={booking._id} className="booking-card">
    <h3>{booking.movie}</h3>
    <p>Date: {booking.date}</p>
    <p>Time: {booking.time}</p>
    <p>Tickets: {booking.tickets}</p>

    <button
      className="cancel-booking-btn"
      onClick={() => cancelBooking(booking._id)}
    >
      Cancel Booking
    </button>
  </div>
))}
              </div>
            )}
          </section>
        )}


        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="section-kicker">FIND YOUR NEXT FAVOURITE</p>
              <h2>Explore <span>Movies</span></h2>
              <p className="section-description">
                A story for every mood.
              </p>
            </div>

            <div className="movie-count">
              <strong>{filteredMovies.length.toString().padStart(2, "0")}</strong>
              <span>movies found</span>
            </div>
          </div>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search movies or languages..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search movies"
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="genre-list">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`genre-button ${
                  activeGenre === genre ? "selected" : ""
                }`}
                onClick={() => setActiveGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className="poster-wrap">
                  <MoviePoster movie={movie} />

                  <span className="poster-genre">{movie.genre}</span>

                  <div className="poster-overlay">
                    <button
                      className="quick-book"
                      onClick={() => openBooking(movie)}
                    >
                      Book Tickets →
                    </button>
                  </div>
                </div>

                <div className="movie-details">
                  <div className="movie-title-row">
                    <h3>{movie.title}</h3>
                    <span className="rating">★ {movie.rating}</span>
                  </div>

                  <p className="movie-meta">
                    {movie.language} <span>•</span> {movie.year}
                  </p>

                  <button
                    className="card-book-button"
                    onClick={() => openBooking(movie)}
                  >
                    Book Tickets <span>↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="empty-state">
              <span>🎬</span>
              <h3>No movies found</h3>
              <p>Try another movie name or choose a different genre.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveGenre("All");
                }}
              >
                Show All Movies
              </button>
            </div>
          )}
        </section>

        <section className="booking-banner" id="about">
          <div>
            <p className="section-kicker">YOUR NEXT MOVIE NIGHT</p>
            <h2>Lights off. <span>Story on.</span></h2>
            <p>Find a movie, choose your show, and enjoy the experience.</p>
          </div>
          <a className="primary-button" href="#movies">
            Find a Movie <span>→</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">▶</span>
          i<span>MOVIES</span>
        </a>
        <p>Your next favourite movie is waiting.</p>
        <span className="copyright">© 2026 IMovies. Student project.</span>
      </footer>

      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMovie(null);
            }
          }}
        >
          <div className="booking-modal">
            <button
              className="modal-close"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close booking"
            >
              ×
            </button>

            <p className="section-kicker">YOUR MOVIE NIGHT</p>
            <h2>Book <span>Tickets</span></h2>
            <h3 className="modal-movie-title">{selectedMovie.title}</h3>
            <p className="modal-meta">
              {selectedMovie.language} · {selectedMovie.genre}
            </p>

            <form onSubmit={confirmBooking}>
              <label htmlFor="show-date">Select date</label>
              <input
                id="show-date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                required
              />

              <label htmlFor="show-time">Show time</label>
              <select
                id="show-time"
                value={selectedTime}
                onChange={(event) => setSelectedTime(event.target.value)}
              >
                <option>10:00 AM</option>
                <option>1:30 PM</option>
                <option>6:30 PM</option>
                <option>9:30 PM</option>
              </select>

              <div className="price-row">
  <span>Selected tickets</span>
  <strong>{selectedSeats.length}</strong>
</div>

              <div className="price-row">
                <span>Price per ticket</span>
                <strong>₹180</strong>
              </div>

              <div className="price-row total-row">
                <span>Total amount</span>
                <strong>₹{tickets * 180}</strong>
              </div>
              <div className="seat-selection">
  <h3>Select Your Seats</h3>

  <div className="cinema-screen">SCREEN</div>

  <div className="seat-grid">
  {allSeats.map((seat) => {
    const isBooked = bookedSeats.includes(seat);
    const isSelected = selectedSeats.includes(seat);

    return (
      <button
        key={seat}
        type="button"
        className={
          isBooked
            ? "seat booked"
            : isSelected
            ? "seat selected"
            : "seat"
        }
        disabled={isBooked}
        onClick={() => toggleSeat(seat)}
        title={isBooked ? "Already booked" : seat}
      >
        {seat}
      </button>
    );
  })}
</div>

  <div className="seat-legend">
    <span>⚪ Available</span>
    <span>🔴 Selected</span>
  </div>

  <p>
    Selected Seats:{" "}
    {selectedSeats.length > 0
      ? selectedSeats.join(", ")
      : "None"}
  </p>

  <h3>Total: ₹{selectedSeats.length * seatPrice}</h3>
</div>
              <button className="primary-button modal-submit" type="submit">
                Confirm Booking
              </button>

              {bookingMessage && (
                <p className="booking-message" role="status">
                  {bookingMessage}
                </p>
              )}

              <p className="demo-note">
                Demo booking only. No real payment is processed.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;