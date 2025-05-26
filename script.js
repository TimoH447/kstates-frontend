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
    const response = await fetch("https://your-api-url.com/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pd_notation: pd, fixed_segment: parseInt(seg) })
    });

    const data = await response.json();

    document.getElementById("lattice-img").src = data.image_url;

    document.getElementById("metadata").innerHTML = `
      <p><strong>Number of States:</strong> ${data.number_of_states}</p>
      <p><strong>Number of Layers:</strong> ${data.number_of_layers}</p>
      <p><strong>Min Marker Position:</strong> ${JSON.stringify(data.min_marker_position)}</p>
      <p><strong>Max Marker Position:</strong> ${JSON.stringify(data.max_marker_position)}</p>
      <p><strong>Transpositions:</strong> ${data.transposition_sequence.join(" → ")}</p>
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
