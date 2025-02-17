document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const searchInput = document.getElementById("search");
  const profileSection = document.querySelector(".profile");
  const noResults = document.querySelector(".no-results");
  const themeSwitch = document.querySelector(".theme-switch");
  const themeText = document.querySelector(".theme-switch__text");
  const body = document.body;

  function getPreferredTheme() {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  function applyTheme(theme) {
    body.setAttribute("data-theme", theme);
    themeText.textContent = theme === "dark" ? "DARK" : "LIGHT";
    localStorage.setItem("theme", theme);
  }
  function toggleTheme() {
    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    const image = document.querySelector(".theme-switch__image");
    if (image.src.endsWith("assets/icon-moon.svg"))
      image.src = "./assets/icon-sun.svg";
    else image.src = "./assets/icon-moon.svg";
    applyTheme(newTheme);
  }
  applyTheme(getPreferredTheme());
  themeSwitch.addEventListener("click", toggleTheme);
  async function fetchGitHubUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) return null;
    return response.json();
  }

  function updateProfile(user) {
    document.querySelector(".profile__image").src = user.avatar_url;
    document.querySelector(".profile__name").textContent =
      user.name || "No Name";
    document.querySelector(".profile__username").textContent = `@${user.login}`;
    document.querySelector(".profile__username").href = user.html_url;
    document.querySelector(
      ".profile__join__date"
    ).textContent = `Joined ${new Date(user.created_at).toDateString()}`;
    document.querySelector(".profile__bio").textContent =
      user.bio || "No bio available";
    document.querySelector(".repos").textContent = user.public_repos;
    document.querySelector(".followers").textContent = user.followers;
    document.querySelector(".following").textContent = user.following;
    const profileLinks = document.querySelectorAll(".profile__link");
    if (profileLinks.length >= 4) {
      profileLinks[0].innerHTML = `<img src="assets/icon-location.svg" alt=""> ${
        user.location || "Not Available"
      }`;
      profileLinks[0].style.opacity = user.location ? "1" : "0.8";
      if (user.blog) {
        profileLinks[1].innerHTML = `<img src="assets/icon-website.svg" alt=""> <a href="${user.blog}" target="_blank">${user.blog}</a>`;
        profileLinks[1].style.opacity = "1";
      } else {
        profileLinks[1].innerHTML = `<img src="assets/icon-website.svg" alt=""> Not Available`;
        profileLinks[1].style.opacity = "0.8";
      }
      if (user.twitter_username) {
        profileLinks[2].innerHTML = `<img src="assets/icon-twitter.svg" alt=""> @${user.twitter_username}`;
        profileLinks[2].style.opacity = "1";
      } else {
        profileLinks[2].innerHTML = `<img src="assets/icon-twitter.svg" alt=""> Not Available`;
        profileLinks[2].style.opacity = "0.8";
      }
      profileLinks[3].innerHTML = `<img src="assets/icon-company.svg" alt=""> ${
        user.company || "Not Available"
      }`;
      profileLinks[3].style.opacity = user.company ? "1" : "0.8";
    }

    profileSection.style.display = "block";
    noResults.style.display = "none";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = searchInput.value.trim();
    if (!username) return;
    const user = await fetchGitHubUser(username);
    if (user) updateProfile(user);
    else noResults.style.display = "block";
  });
});
