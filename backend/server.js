require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Booking = require("./models/Booking");
const User = require("./models/User");
const auth = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/imovies")
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });

// Test API
app.get("/", (req, res) => {
  res.send("Welcome to IMovies Backend!");
});

// ================= SIGNUP =================

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    res.status(500).json({
      message: "Signup failed",
    });
  }
});

// ================= LOGIN =================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// ================= CREATE BOOKING =================

app.post("/api/bookings", auth, async (req, res) => {
  try {
    const { movie, date, time, tickets, seats, total } = req.body;

    // Validate booking details
    if (
      !movie ||
      !date ||
      !time ||
      !Number.isInteger(tickets) ||
      tickets < 1 ||
      !Array.isArray(seats) ||
      seats.length !== tickets ||
      !Number.isFinite(total) ||
      total < 0
    ) {
      return res.status(400).json({
        message: "Invalid booking details",
      });
    }

    // Validate selected seats
    const validSeats = Array.from({ length: 40 }, (_, index) => {
      const row = String.fromCharCode(65 + Math.floor(index / 8));
      const number = (index % 8) + 1;
      return `${row}${number}`;
    });

    if (
      new Set(seats).size !== seats.length ||
      !seats.every((seat) => validSeats.includes(seat))
    ) {
      return res.status(400).json({
        message: "Invalid seat selection",
      });
    }

    // Check seats already booked for this movie, date and time
    const existingBookings = await Booking.find({
      movie,
      date,
      time,
      seats: { $in: seats },
    });

    const bookedSeats = existingBookings.flatMap((booking) =>
      booking.seats.filter((seat) => seats.includes(seat))
    );

    if (bookedSeats.length > 0) {
      return res.status(409).json({
        message: `These seats are already booked: ${[
          ...new Set(bookedSeats),
        ].join(", ")}. Please select different seats.`,
      });
    }

    // Verify total amount
    if (total !== tickets * 180) {
      return res.status(400).json({
        message: "Invalid ticket total",
      });
    }

    // Save booking
    const booking = await Booking.create({
      user: req.userId,
      movie,
      date,
      time,
      tickets,
      seats,
      total,
    });

    res.status(201).json({
      message: "Booking saved successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error.message);

    res.status(500).json({
      message: "Failed to save booking",
    });
  }
});
// ================= MY BOOKINGS =================

app.get("/api/bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch Bookings Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
});

app.get("/api/booked-seats", async (req, res) => {
  try {
    const { movie, date, time } = req.query;

    if (!movie || !date || !time) {
      return res.status(400).json({
        message: "Movie, date and time are required",
      });
    }

    const bookings = await Booking.find({
      movie,
      date,
      time,
    }).select("seats");

    const bookedSeats = [
      ...new Set(bookings.flatMap((booking) => booking.seats || [])),
    ];

    res.json({ bookedSeats });
  } catch (error) {
    console.error("Booked Seats Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch booked seats",
    });
  }
});

// ================= CANCEL BOOKING =================

app.delete("/api/bookings/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking cancelled successfully!",
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error.message);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
});

// ================= START SERVER =================

const PORT = 5000;

app.get("/api/booked-seats", async (req, res) => {
  try {
    const { movie, date, time } = req.query;

    if (!movie || !date || !time) {
      return res.status(400).json({
        message: "Movie, date and time are required",
      });
    }

    const bookings = await Booking.find({
      movie,
      date,
      time,
    }).select("seats");

    const bookedSeats = [
      ...new Set(
        bookings.flatMap((booking) => booking.seats || [])
      ),
    ];

    res.json({ bookedSeats });
  } catch (error) {
    console.error("Booked Seats Error:", error.message);

    res.status(500).json({
      message: "Failed to fetch booked seats",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});