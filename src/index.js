const buttonEl = document.querySelector("#joke-button");
const answerEl = document.querySelector("#answer");

const apiKey = "297bdob5643aebcfc422bc019b792eta";
const context =
   "You are a Funny AI Assistant with a great sense of humor that tells jokes about mexican people";
const prompt = "Write one original joke in English.";

function setWait(isLoading) {
   if (!buttonEl) return;
   buttonEl.disabled = isLoading;
   buttonEl.textContent = isLoading ? "Waiting..." : "Tell me a joke";
}

function formatAnswer(text) {
   const cleaned = (text || "").trim().replace(/\r?\n/g, "<br>");
   answerEl.innerHTML = cleaned;

   new Typewriter("#answer", {
      strings: `${cleaned}`,
      autoStart: true,
      cursor: null,
      delay: 20,
   });
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
