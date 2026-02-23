/**
 * Updates the navbar to show the username if logged in, or a login link if not.
 */
function updateNavBar(username) {
    const loginButton = document.getElementById("userNavButton");
    if (!loginButton) return;

    // If username is provided, show greeting. Otherwise, show login link.
    if (username) {
        loginButton.textContent = `Hello, ${username}!`;
        loginButton.removeAttribute("href");
        loginButton.style.cursor = "default";
    } else {
        loginButton.textContent = "Login";
        if (!loginButton.getAttribute("href")) {
            loginButton.setAttribute("href", "/login/");
        }
    }
}

async function syncUsername() {
    const response = await fetch("/user");
    if (!response.ok) return;

    const data = await response.json();
    if (data.flag && data.user) {
        updateNavBar(data.user);
    }

}

syncUsername();
