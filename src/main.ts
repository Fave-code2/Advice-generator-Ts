const Id = document.getElementById("adviceId") as HTMLSpanElement;
const advice = document.getElementById("advice") as HTMLParagraphElement;
const button = document.querySelector("button") as HTMLButtonElement;

const Url = "https://api.adviceslip.com/advice";

interface ApiResponse {
  slip: {
    id: number;
    advice: string;
  };
}

const fetchData = async (url: string): Promise<void> => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Something went wrong");

    const data: ApiResponse = await res.json();

    Id.textContent = data.slip.id.toString();
    advice.textContent = data.slip.advice;
  } catch (error) {
    if (error instanceof Error) {
      advice.textContent = error.message;
    }
  }
};

fetchData(Url);

let intervalId: number;
let timeoutId: number;

const startInterval = () => {
  intervalId = window.setInterval(() => {
    fetchData(`${Url}?t=${Date.now()}`);
  }, 5000);
};

// Start the interval
startInterval();

button.addEventListener("click", () => {
  // Stop the interval immediately
  clearInterval(intervalId);

  // Fetch immediately
  fetchData(`${Url}?t=${Date.now()}`);

  // Cancel any pending restart
  clearTimeout(timeoutId);

  // Restart interval after 5 seconds of no clicks
  timeoutId = window.setTimeout(() => {
    startInterval();
  }, 5000);
});

// setInterval(() => {
//   fetchData("https://api.adviceslip.com/advice");
// }, 4000);

// button.addEventListener("click", () => {
//   fetchData("https://api.adviceslip.com/advice");
// });

// The API is cached aggressively by browsers. Sometimes you'll get the same advice repeatedly.

// If that happens, fetch like this:
// const res = await fetch(`${url}?timestamp=${Date.now()}`);
// const res = await fetch(url, {
//   cache: "no-store",
// });
