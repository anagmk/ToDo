const loginform = document.getElementById("login-form");

loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/api/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = "/todos.html";
            console.log("Login successful:", data);
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData);
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
})