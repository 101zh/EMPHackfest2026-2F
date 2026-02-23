const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginForm = document.getElementById("loginForm");
const submitBtn = document.getElementById("submitBtn");
const loginMessage = document.getElementById("loginMessage");

let mode = "login";

/**
 * Updates UI according to the mode set. Modes are: "login" or "register"
 */
function setMode(nextMode) {
    mode = nextMode;
    const isLogin = mode === "login";

    loginBtn.classList.toggle("active", isLogin);
    registerBtn.classList.toggle("active", !isLogin);
    submitBtn.textContent = isLogin ? "Login" : "Register";
    loginMessage.textContent = "";
    loginMessage.className = "login-message";
}

async function submitAuth(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(loginForm);
    const username = formData.get("username").toString().trim();
    const password = formData.get("password").toString().trim();

    // Don't allow empty username or password
    if (!username || !password) {
        loginMessage.textContent = "Please enter a username and password.";
        loginMessage.className = "login-message error";
        return;
    }

    // Change db endpoint based on mode
    const endpoint = mode === "login" ? "/login" : "/register";

    try {
        // Send POST request to the db with username and password
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        const ok = response.ok;

        loginMessage.textContent = data.message || data.error || "Request completed.";
        loginMessage.className = ok ? "login-message success" : "login-message error";

        // If login is successful update the navbar
        if (ok && mode === "login" && typeof updateNavBar === "function") {
            updateNavBar(username);
        }

        // If registration is successful, switch to login mode
        if (ok && mode === "register") {
            setMode("login");
        }
    } catch (error) {
        loginMessage.textContent = "Network error. Please try again.";
        loginMessage.className = "login-message error";
    }
}

// Handle button clicks
loginBtn.addEventListener("click", () => setMode("login"));
registerBtn.addEventListener("click", () => setMode("register"));
loginForm.addEventListener("submit", submitAuth);
