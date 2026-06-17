/* =========================
   CHECK IF ALREADY LOGGED IN
========================= */

if (
    localStorage.getItem("loggedIn") === "true"
) {
    window.location.href = "index.html";
}

/* =========================
   GET FORM ELEMENTS
========================= */

const loginForm =
document.getElementById("loginForm");

const errorMessage =
document.getElementById("errorMessage");

/* =========================
   LOGIN EVENT
========================= */

loginForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const email =
        document.getElementById("email")
        .value
        .trim();

        const password =
        document.getElementById("password")
        .value
        .trim();

        /* Demo Credentials */

        const adminEmail =
        "admin@futureinterns.com";

        const adminPassword =
        "admin123";

        if (
            email === adminEmail &&
            password === adminPassword
        ) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "adminEmail",
                email
            );

            window.location.href =
            "index.html";

        }
        else {

            errorMessage.textContent =
            "Invalid Email or Password";

        }

    }
);
