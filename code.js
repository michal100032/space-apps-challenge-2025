 /*
 function scrollToSection() {
      document.getElementById("section1")
        .scrollIntoView({ behavior: "smooth" });

      // po przewinięciu włączamy scrollowanie z powrotem
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 1000); // 1s = czas animacji
    }

*/
function scrollToSection(idx) {
  document.getElementById(`section${idx}`)
    .scrollIntoView({ behavior: "smooth" });

    // Sprawdzamy, czy jesteśmy od sekcji2 w górę
  if (idx >= 1) {
    document.getElementById("go").style.display = "flex";
  } else {
    document.getElementById("go").style.display = "none";
  }
}

function scrollToHome() {
  document.getElementById("firstPlan")
    .scrollIntoView({ behavior: "smooth" });
}

