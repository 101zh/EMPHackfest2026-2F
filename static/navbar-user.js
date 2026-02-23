/**
 * Updates the navbar to show the username if logged in, or a login link if not.
 */
function updateNavBar(username) {
    const loginButton = document.getElementById("loginButton");
    if (!loginButton) return;

    // If username is provided, show greeting. Otherwise, show login link.
    if (username) {
        loginButton.textContent = `Hello, ${username}!`;
        loginButton.setAttribute("href", "#");
        loginButton.dataset.loggedIn = "true";
        loginButton.style.cursor = "pointer";
    } else {
        loginButton.textContent = "Login";
        loginButton.setAttribute("href", "/login/");
        loginButton.dataset.loggedIn = "false";
        loginButton.style.cursor = "pointer";
    }
}

async function syncUsername() {
    const response = await fetch("/user");
    if (!response.ok) return;

    const data = await response.json();
    if (data.flag && data.user) {
        updateNavBar(data.user);
    } else {
        updateNavBar("");
    }
}

async function logoutFromNavbar(event) {
    const loginButton = document.getElementById("loginButton");
    if (!loginButton || loginButton.dataset.loggedIn !== "true") return;

    event.preventDefault();

    const response = await fetch("/logout", { method: "POST" });

    if (!response.ok) return;

    updateNavBar("");
}

function checkLogOut() {
    const loginButton = document.getElementById("loginButton");
    if (!loginButton) return;

    loginButton.addEventListener("click", logoutFromNavbar);
}

checkLogOut();
syncUsername();
