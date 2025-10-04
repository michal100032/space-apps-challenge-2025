document.addEventListener("input", () => {
  const form = document.getElementById("misjaForm");
  
  // sprawdzamy czy wszystkie pola są wypełnione poprawnie
  if (form.checkValidity()) {
    document.getElementById("section3")
      .scrollIntoView({ behavior: "smooth" });
  }
});