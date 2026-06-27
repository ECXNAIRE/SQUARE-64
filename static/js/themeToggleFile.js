let darkmode = true;
const themeIcon = document.getElementById("themeIcon")
const savedTheme = localStorage.getItem("theme");

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
        } else {
            localStorage.setItem("theme", "light")
            document.body.style.backgroundColor = "#F8F8F4";
            document.body.style.cursor = "url('../static/cursor/cursorB.png') 8 8, auto";

            themeIcon.src = "../static/img/darkMode.png";
        }
    }

setTheme();

themeIcon.addEventListener("click", () => {
    darkmode = !darkmode
    setTheme();
});

setTheme();
