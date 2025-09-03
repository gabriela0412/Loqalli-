document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  let messageContainer = document.getElementById("message-container");
  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.id = "message-container";
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "20px";
    messageContainer.style.left = "50%";
    messageContainer.style.transform = "translateX(-50%)";
    messageContainer.style.padding = "15px 25px";
    messageContainer.style.borderRadius = "8px";
    messageContainer.style.fontSize = "16px";
    messageContainer.style.zIndex = "1000";
    messageContainer.style.color = "#fff";
    messageContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    messageContainer.style.opacity = "0";
    messageContainer.style.transition = "opacity 0.5s ease";
    document.body.appendChild(messageContainer);
  }

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      messageContainer.style.backgroundColor = "#4CAF50";
      messageContainer.textContent = "Account created successfully! Redirecting...";
      messageContainer.style.opacity = "1";

      // Espera 2 segundos y redirige
      setTimeout(() => {
         window.location.href = "../mainpage/mainpage.html";

      }, 2000);

    } else {
      messageContainer.style.backgroundColor = "#f44336";
      messageContainer.textContent = data.error || "Error creating account";
      messageContainer.style.opacity = "1";
    }

  } catch (error) {
    console.error("Error:", error);
    messageContainer.style.backgroundColor = "#f44336";
    messageContainer.textContent = "Something went wrong. Try again.";
    messageContainer.style.opacity = "1";
  }
});
