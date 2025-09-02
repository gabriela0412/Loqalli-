const experiences = [
  {
    category: "tipical food",
    name: "Tamal Workshop",
    price: 20,
    details: "Learn to cook traditional tamales."
  },
  {
    category: "art",
    name: "Street Art Tour",
    price: 15,
    details: "Explore murals and local artists."
  },
  {
    category: "Tours",
    name: "Historic Center Walk",
    price: 25,
    details: "Discover the city's history with a guide."
  },
  {
    category: "tipical food",
    name: "Traditional Drinks Tasting",
    price: 18,
    details: "Try and learn how to makechicha, atole and other local drinks."
  }
];




function renderExperiences(list) {
  const container = document.getElementById("post");
  container.innerHTML = ""; 

  list.forEach(exp => {

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${exp.image}" alt="${exp.name}">
      <h3>${exp.name}</h3>
      <p>Category: ${exp.category}</p>
      <p>Price: $${exp.price}</p>
      <p>${exp.details}</p>
      <button onclick="reserve('${exp.name}')">Reserve</button>
    `;

    container.appendChild(card);
  });
}

function reserve(name) {
  alert("You reserved: " + name);
}

document.addEventListener("DOMContentLoaded", function() {
  renderExperiences(experiences);
});




function showByCategories(category) {
  const filtered = experiences.filter(exp => 
    exp.category.toLowerCase() === category.toLowerCase()
  );

  renderExperiences(filtered);
}