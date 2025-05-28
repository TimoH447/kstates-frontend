function submitData() {
  const pd = document.getElementById("pd-input").value;
  const seg = document.getElementById("fixed-segment").value;

  localStorage.setItem("pd_notation", pd);
  localStorage.setItem("fixed_segment", seg);

  window.location.href = "results.html";
}

async function loadResults() {
  const pd = localStorage.getItem("pd_notation");
  const seg = localStorage.getItem("fixed_segment");

  if (!pd || !seg) {
    document.getElementById("metadata").innerText = "Missing input. Please go back and try again.";
    return;
  }

  try {
  const response = await fetch("https://9fp1ejw64i.execute-api.eu-central-1.amazonaws.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      pd_notation: pd,           // The string from user input
      fixed_segment: parseInt(seg)  // The number from user input
    })
  });

  const data = await response.json();
  
  // Display the lattice image
  document.getElementById("lattice-img").src = data.image_url;

  // Display metadata
  document.getElementById("metadata").innerHTML = `
    <p><strong>Number of States:</strong> ${data.number_of_states}</p>
  `;


  
} catch (err) {
  document.getElementById("metadata").innerText = "An error occurred while fetching data.";
  console.error(err);
}
}

function goBack() {
  window.location.href = "index.html";
}

// Auto-load results if on results page
if (window.location.pathname.includes("results.html")) {
  window.onload = loadResults;
}

function goHome() {
  window.location.href = "index.html";
}
