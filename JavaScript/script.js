const APOD_URL = "https://api.nasa.gov/planetary/apod";
      const API_KEY = "PoKEHPCMxieGRtemgX8OGyYO9xXHE1PUDzFd1mpL";
      // Retrieve Astronomy Picture of the Day by date from NASA APOD API
      const getAPOD = async (date) => {
        const url = `${APOD_URL}?api_key=${API_KEY}&date=${date}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          return data;
        } catch (error) {
          console.log(error);
        }
      };
    const getImage = async (url) => {
  try {
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    const urlWithProxy = `${proxyURL}${url}`;
    const response = await fetch(urlWithProxy, {
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    return objectURL;
  } catch (error) {
    console.log(error);
  }
};
      // Display Astronomy Picture of the Day
      const displayAPOD = async (date) => {
        const apodContainer = document.getElementById("apod-container");
        apodContainer.innerHTML = "<p>Loading...</p>";
        const data = await getAPOD(date);
        const title = document.createElement("h2");
        title.classList.add("apod-title");
        title.textContent = data.title;
        const dateText = document.createElement("p");
        dateText.classList.add("apod-date");
        dateText.textContent = data.date;
        let mediaElement;
        if (data.media_type === "image") {
          const imageURL = data.url;
          const imageAlt = data.title;
          const image = await getImage(imageURL);
          mediaElement = document.createElement("img");
          mediaElement.src = image;
          mediaElement.alt = imageAlt;
        } else if (data.media_type === "video") {
          mediaElement = document.createElement("iframe");
          mediaElement.width = "560";
          mediaElement.height = "315";
          mediaElement.src = data.url;
          mediaElement.allowFullscreen = true;
        } else {
          apodContainer.innerHTML = "<p>Sorry, media type not supported.</p>";
          return;
        }
        const explanation = document.createElement("p");
        explanation.classList.add("apod-explanation");
        explanation.textContent = data.explanation;
        const favoriteBtn = document.createElement("button");
        favoriteBtn.classList.add("favorite-btn");
        favoriteBtn.textContent = "Add to favorites";
    favoriteBtn.addEventListener("click", () => {
      addToFavorites(data);
    });
  const addToFavorites = async (data) => {
  const favoritesContainer = document.getElementById("favorites-container");
  const favoriteDiv = document.createElement("div");
  favoriteDiv.classList.add("favorite-item");
  const favoriteTitle = document.createElement("h3");
  favoriteTitle.classList.add("favorite-title");
  favoriteTitle.textContent = data.title;
  const favoriteDate = document.createElement("p");
  favoriteDate.classList.add("favorite-date");
  favoriteDate.textContent = data.date;
  const favoriteMediaElement = mediaElement.cloneNode(true);
  favoriteMediaElement.onload = async () => {
    const imageURL = data.url;
    const imageAlt = data.title;
    const image = await getImage(imageURL);
    const a = document.createElement("a");
    a.href = image;
    a.download = `${imageAlt}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const favoriteExplanation = document.createElement("p");
  favoriteExplanation.classList.add("favorite-explanation");
  favoriteExplanation.textContent = data.explanation;
  favoriteDiv.appendChild(favoriteTitle);
  favoriteDiv.appendChild(favoriteDate);
  favoriteDiv.appendChild(favoriteMediaElement);
  favoriteDiv.appendChild(favoriteExplanation);
  favoriteDiv.appendChild(removeFavoriteBtn);
  favoritesContainer.appendChild(favoriteDiv);
};
const removeFavoriteBtn = document.createElement("button");
removeFavoriteBtn.classList.add("remove-favorite-btn");
removeFavoriteBtn.textContent = "Remove";
removeFavoriteBtn.addEventListener("click", async () => {
  const imageAlt = data.title.replace(/[^\w\s]/gi, ''); // remove non-word and non-space characters
  const imageFilename = `${imageAlt}.jpg`;
  console.log(`Removing ${imageFilename} from local storage`);
  // Remove the file from local storage
  localStorage.removeItem(imageFilename);
  // Remove the favorite item from the list
  const favoriteDiv = removeFavoriteBtn.closest('.favorite-item');
  favoriteDiv.remove();
  // Prompt the user to confirm that they want to delete the file from their computer
  if (confirm(`Do you want to delete ${imageFilename} from your computer?`)) {
    // Use the File System Access API to request permission to access the file system
    const [fileHandle] = await window.showOpenFilePicker();
    await fileHandle.remove();
    console.log(`${imageFilename} has been deleted from your computer.`);
  }
});
    apodContainer.innerHTML = "";
    apodContainer.appendChild(title);
    apodContainer.appendChild(dateText);
    apodContainer.appendChild(mediaElement);
    apodContainer.appendChild(explanation);
    apodContainer.appendChild(favoriteBtn);
  };
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("date-form");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const dateInput = document.getElementById("date");
      const date = dateInput.value;
      displayAPOD(date);
    });
  } else {
    console.error("Form element with ID 'date-form' not found.");
  }
});
