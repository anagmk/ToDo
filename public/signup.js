const myform = document.getElementById("signup-form");

myform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    try {
        const response = await fetch('/api/user/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, name })
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = "/login.html";
            console.log("Signup successful:", data);
        } else {
            const errorData = await response.json();
            console.error("Signup failed:", errorData);
        }
    } catch (error) {
        console.error("Error during signup:", error);
    }
})

