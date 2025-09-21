const buttonEl = document.querySelector("#joke-button");
const answerEl = document.querySelector("#answer");

const apiKey = "297bdob5643aebcfc422bc019b792eta";
const context =
   "You are a comedian who has a great sense of humor." +
   "You will generate random jokes each time family friendly." +
   "Return exactly two lines: setup on line 1 and punchline on line 2.";
const prompt = "Write one original, joke in English.";

function setWait(isLoading) {
   if (!buttonEl) return;
   buttonEl.disabled = isLoading;
   buttonEl.textContent = isLoading ? "Waiting..." : "Tell me a joke";
}

function formatAnswer(text) {
   const cleaned = (text || "").trim().replace(/\r?\n/g, "<br>");
   answerEl.innerHTML = cleaned;
}

function generateJoke(response) {
   setWait(false);

   const data = response && response.data ? response.data : {};
   if (typeof data.answer !== "string") {
      formatAnswer("");
      console.warn("Unexpected API form:", response);
      return;
   }
   formatAnswer(data.answer);
}

let lastClickTs = 0;

function callAPI() {
   const now = Date.now();
   if (now - lastClickTs < 1000) return;
   lastClickTs = now;

   setWait(true);
   formatAnswer("");
   const apiUrl =
      "https://api.shecodes.io/ai/v1/generate" +
      "?prompt=" +
      encodeURIComponent(prompt) +
      "&context=" +
      encodeURIComponent(context) +
      "&key=" +
      encodeURIComponent(apiKey) +
      "&t=";

   axios
      .get(apiUrl + "&nocache=" + Date.now(), {
         headers: { "Cache-Control": "no-cache" },
      })
      .then(generateJoke)
      .catch((err) => {
         setWait(false);
         formatAnswer("Network error. Please try again.");
      });
}

document.querySelector("#joke-button").addEventListener("click", callAPI);
