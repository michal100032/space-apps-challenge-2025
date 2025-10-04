    function scrollToSection() {
      document.getElementById("section1")
        .scrollIntoView({ behavior: "smooth" });

      // po przewinięciu włączamy scrollowanie z powrotem
      setTimeout(() => {
        document.body.style.overflow = "auto";
      }, 1000); // 1s = czas animacji
    }