 /*

*/
function scrollToSection(idx) {
  document.getElementById(`section${idx}`)
    .scrollIntoView({ behavior: "smooth" });
}

function scrollToHome() {
  document.getElementById("firstPlan")
    .scrollIntoView({ behavior: "smooth" });
}

