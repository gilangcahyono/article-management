const path = window.location.pathname;

if (path.startsWith("/articles")) {
  const paragraph = document.querySelector("#content p");
  paragraph.classList.add("mb-4");
}
