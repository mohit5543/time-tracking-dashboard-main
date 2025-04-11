// DOM Elements
const timeButtons = document.querySelectorAll(".time-btn");
const timeCards = document.querySelectorAll(".time-card");

// Load and parse data
let timeData = [];

// Fetch data from JSON file
async function loadData() {
  try {
    const response = await fetch("../data.json");
    if (!response.ok) {
      throw new Error("Failed to load data");
    }
    timeData = await response.json();
    console.log("Data loaded successfully:", timeData);
    updateCards("weekly"); // Initialize with weekly view since it's active by default
  } catch (error) {
    console.error("Error loading data:", error);
    // You could add error handling UI here
  }
}

// Format activity name to match JSON data
function formatActivityName(className) {
  // Handle special case for "self-care"
  if (className === "self-care") {
    return "Self Care";
  }
  // Capitalize first letter for other activities
  return className.charAt(0).toUpperCase() + className.slice(1);
}

// Update time cards based on selected timeframe
function updateCards(timeframe) {
  timeCards.forEach((card) => {
    const activity = card.classList[1]; // Get activity class (work, play, etc.)
    const formattedActivity = formatActivityName(activity);
    const data = timeData.find((item) => item.title === formattedActivity);

    if (data) {
      const current = data.timeframes[timeframe].current;
      const previous = data.timeframes[timeframe].previous;

      // Update current time
      const hoursElement = card.querySelector(".hours");
      hoursElement.textContent = `${current}hr${current !== 1 ? "s" : ""}`;

      // Update previous time with the correct period text
      const previousElement = card.querySelector(".previous");
      let periodText = "";
      switch (timeframe) {
        case "daily":
          periodText = "Yesterday";
          break;
        case "weekly":
          periodText = "Last Week";
          break;
        case "monthly":
          periodText = "Last Month";
          break;
      }
      previousElement.textContent = `${periodText} - ${previous}hr${
        previous !== 1 ? "s" : ""
      }`;
    }
  });
}

// Handle timeframe button clicks
function handleTimeframeClick(e) {
  // Remove active class from all buttons
  timeButtons.forEach((btn) => btn.classList.remove("active"));

  // Add active class to clicked button
  e.target.classList.add("active");

  // Get timeframe from button text
  const timeframe = e.target.textContent.toLowerCase();

  // Update cards with new timeframe
  updateCards(timeframe);
}

// Add event listeners
timeButtons.forEach((btn) => {
  btn.addEventListener("click", handleTimeframeClick);
});

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing dashboard...");
  loadData();
});
