document.getElementById("dalejBtn").addEventListener("click", () => {
  const form = document.getElementById("misjaForm");

  if (true) {
    document.getElementById("section3")
      .scrollIntoView({ behavior: "smooth" });
  } else {
    form.reportValidity(); // pokaże błędy, jeśli coś nie wypełnione
  }
});