let darkmode = true;
const themeIcon = document.getElementById("themeIcon");
const savedTheme = localStorage.getItem("theme");
const orDivider = document.querySelector(".divider");

if (savedTheme === "light") {
    darkmode = false;
} else {
    darkmode = true;
}



function setTheme () {
        if (darkmode == true) {
            localStorage.setItem("theme", "dark")
            document.body.style.backgroundColor = "rgb(19, 19, 19)";
            document.body.style.cursor = "url('../static/cursor/cursorW.png') 8 8, auto";

            themeIcon.src = "../static/img/lightMode.png";
            orDivider.classList.remove("light");
        } else {
            localStorage.setItem("theme", "light")
            document.body.style.backgroundColor = "#F8F8F4";
            document.body.style.cursor = "url('../static/cursor/cursorB.png') 8 8, auto";

            themeIcon.src = "../static/img/darkMode.png";
            orDivider.classList.add("light");
        }
    }

setTheme();

themeIcon.addEventListener("click", () => {
    darkmode = !darkmode
    setTheme();
});

setTheme();
