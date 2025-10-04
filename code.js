 /*

*/
let idx = 1;

function scrollToSection(x) {
  console.log(idx) 
  document.getElementById(`section${x}`)
    .scrollIntoView({ behavior: "smooth" });

    // Sprawdzamy, czy jesteśmy od sekcji2 w górę oraz ustawienie czasu pojawienia się przycisków powrót
  if (x >= 1) {
    firstTime = false;
      setTimeout(() => {
        document.getElementById("go").style.display = "flex";
      }, 370);
  } else {
  idx = x;
    document.getElementById("go").style.display = "none";
  }
  idx = x;
}

function scrollToHome() {
  console.log(idx) 
  document.getElementById("firstPlan")
    .scrollIntoView({ behavior: "smooth" });
  document.getElementById("go").style.display = "none";
  idx = 1;
}

function scrollToBack(){ 
  console.log(idx) 
    if (idx <= 1){
      scrollToHome()
    }else{
    document.getElementById(`section${idx -= 1}`)
    .scrollIntoView({ behavior: "smooth" });
    
}
}

