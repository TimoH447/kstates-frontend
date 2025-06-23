function submitData() {
  const knot = document.getElementById("pd-input").value;
  const seg = document.getElementById("fixed-segment").value;

  localStorage.setItem("knot_input", knot);
  localStorage.setItem("fixed_segment", seg);

  window.location.href = "results.html";
}

function parsePDNotation(pd_notation) {
  var parsed_pd_notation = [];
  var crossings = pd_notation.split(";");
  for (var i = 0; i < crossings.length; i++) {
    var parsed_crossing = crossings[i].trim().split(",");
    if (parsed_crossing.length != 4) {
      throw new Error("Invalid PD notation format. Each crossing must have exactly four integers.");
    }
    for (var j = 0; j < parsed_crossing.length; j++) {
      parsed_crossing[j] = parseInt(parsed_crossing[j].trim());
    }
    parsed_pd_notation.push(parsed_crossing);
  }
  return parsed_pd_notation;}

function parseInput(knot_input) {
  var input = knot_input.trim().toLowerCase();
  if (input[0]=="t" && input[1]=="b"){
    var notation_type = "tb";
    var tb_normalform = input.split(":")[1];
    return [notation_type,tb_normalform];
  }
  else if (input[0]=="r") {
    var notation_type = "r";
    var rolfsen_number = input.split(":")[1];
    return [notation_type,rolfsen_number];

  }
  else {
    var notation_type = "pd";
    var pd_notation = parsePDNotation(knot_input);
    return  [notation_type,pd_notation];
  }
}

async function loadResults() {
  const knot = localStorage.getItem("knot_input");
  const seg = localStorage.getItem("fixed_segment");
  document.getElementById("pd-input").value = knot || "";
  document.getElementById("fixed-segment").value = seg || "";

  if (!knot || !seg) {
    document.getElementById("metadata").innerText = "Missing input. Please go back and try again.";
    return;
  }

  try {
    var parsed_input = parseInput(knot);
  }
  catch (err) {
    document.getElementById("metadata").innerText = "Invalid PD notation format. Please check your input.";
    console.error(err);
    return;
  }


  try {
  const response = await fetch("https://9fp1ejw64i.execute-api.eu-central-1.amazonaws.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      notation_type: parsed_input[0],
      knot_input: parsed_input[1],
      fixed_segment: parseInt(seg)  // The number from user input
    })
  });


  const data = await response.json();
  //const data = returnTestApiResponse(); // For testing purposes, replace with actual API call

  
  // Display the lattice image
  document.getElementById("lattice-img").src = data.image_url;

  // Display metadata
  document.getElementById("metadata").innerHTML = `
    <p><strong>Number of States:</strong> ${data.number_of_states}</p>
    <p><strong>F-Polynomial:</strong> ${data.f_polynomial}</p>
    <p><strong>Alexander Polynomial:</strong> ${data.alexander_polynomial}</p>
    <p><strong>Jones Polynomial:</strong> ${data.jones_polynomial}</p>
    <p><strong>Kauffman Bracket:</strong> ${data.kauffman_bracket}</p>
    <p><strong>Minimal State:</strong> ${data.minimal_state}</p>
    <p><strong>Maximal State:</strong> ${data.maximal_state}</p>
    <p><strong>Sequence from Minimal to Maximal State:</strong> ${data.sequence_min_to_max}</p>
    <p><strong>Quiver in QPA format:</strong> ${data.knot_diagram_quiver}</p>
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

function returnTestApiResponse() {
  return {"number_of_states": 25,
    "f_polynomial": "1 + y_{1} + y_{4} + y_{9} + y_{1}y_{4} + y_{1}y_{9} + y_{4}y_{9} + y_{9}y_{13} + y_{1}y_{4}y_{9} + y_{1}y_{9}y_{13} + y_{4}y_{9}y_{13} + y_{1}y_{4}y_{9}y_{13} + y_{1}y_{8}y_{9}y_{13} + y_{1}y_{4}y_{8}y_{9}y_{13} + y_{1}y_{8}y_{9}y_{13}y_{14} + y_{1}y_{4}y_{8}y_{9}y_{13}y_{14} + y_{1}y_{4}y_{8}y_{9}y_{10}y_{13}y_{14} + y_{1}y_{3}y_{4}y_{8}y_{9}y_{10}y_{13}y_{14} + y_{1}y_{4}y_{8}y_{9}y_{10}y_{13}y_{14}y_{15} + y_{1}y_{3}y_{4}y_{8}y_{9}y_{10}y_{11}y_{13}y_{14} + y_{1}y_{3}y_{4}y_{8}y_{9}y_{10}y_{13}y_{14}y_{15} + y_{1}y_{4}y_{8}y_{9}^2y_{10}y_{13}y_{14}y_{15} + y_{1}y_{3}y_{4}y_{8}y_{9}y_{10}y_{11}y_{13}y_{14}y_{15} + y_{1}y_{3}y_{4}y_{8}y_{9}^2y_{10}y_{13}y_{14}y_{15} + y_{1}y_{3}y_{4}y_{8}y_{9}^2y_{10}y_{11}y_{13}y_{14}y_{15}",
    "alexander_polynomial": "- t^{-1}",
    "minimal_state": "Crossing (1, 7, 2, 6): (6, 1), Crossing (2, 5, 3, 6): (5, 3), Crossing (5, 12, 4, 11): (12, 4), Crossing (4, 10, 3, 11): (11, 4), Crossing (1, 8, 16, 7): (7, 1), Crossing (16, 13, 15, 12): (16, 13), Crossing (13, 8, 14, 9): (14, 9), Crossing (14, 10, 15, 9): (15, 9)",
    "maximal_state": "Crossing (1, 7, 2, 6): (1, 7), Crossing (2, 5, 3, 6): (3, 6), Crossing (5, 12, 4, 11): (11, 5), Crossing (4, 10, 3, 11): (11, 4), Crossing (1, 8, 16, 7): (8, 16), Crossing (16, 13, 15, 12): (15, 12), Crossing (13, 8, 14, 9): (9, 13), Crossing (14, 10, 15, 9): (9, 14)",
    "sequence_min_to_max": "[1, 4, 9, 13, 8, 14, 10, 15, 3, 9, 11]", 
    "image_url": "https://lambdaimage-testbucket.s3.amazonaws.com/lattice.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAVSFYGCBVYTDNBMBJ%2F20250601%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T162753Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBAaDGV1LWNlbnRyYWwtMSJHMEUCIQDPqYl3%2BJZI0Kv3CFgVWjal7PhDFUeB17rjWlSsWxao9AIgPNv7VlEHOQCss4lp9jlL283qKaMUe3UH5uRbWN2%2FIaoq%2FgII2v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgwzODI2MzgzNjI3MzEiDC9buBCWW0yE%2FUhTRyrSAqnbG0mpwNZUfFHxxY%2FTMJfF3z4oOoe9pnqzkgQv5pIpZW%2FwGxA23CcjKJ0CcZwsemi5Dj7fPM6Mfg%2FTPV2izZWHPKQCJGvzguF7JDeMU9PBgf3xFGErtMG88nWSDUf2NUY7Z9muPVX9ycYXFwEXBz%2FuIElf1%2FX%2BEYqh3uZG%2Ban4Au6vg%2F0l06iZZwSzhlFuA9m9pOsKooSnzGKWtrxJgJkhM9zHQmf5Gj2LJJO2BbCikH6sIunrdG0riKc4arCWSGeCIV6ZxvFpQk5YtyIzfOS6Rbvg9U5gUIlVXnZ6uyTfJG3X5Nf4FCzbwElo%2FGqKsmhyz8FsfCPr8T49nqvmHekkwtk0HhExEFnTpUedfCXTIAVBfkxDi4%2FVnbS0AyCqfJjPJN8qbjbxn1iKTsSpU6SkUwxH%2F8luMIOZzwzp%2B7rDumr%2Bnp9AEqt0sYxiynu7tXL8MIL98cEGOp4B3SkJx7EyK%2BSeVPro9R4lHILzQcf5%2BA2wwU3CkuiRwCRdCpbRNDGUg7qbopz7p%2FszGWwjcoRcEuZ2iVrz0LRTJ5eGSHJYkj1K4xVLapCTQZOKDJ%2Blw7Da7WAQNARWztTRKEIfCGt9Q5pNbm463pmb4IzO879wbLK%2BeJcUB923L36i6FWWPiVpuDO%2B2LuItDSQeKydbnYyejC2aW0QtFg%3D&X-Amz-Signature=c856233be70572225a059fa5474446fb3e0a1d3adcdcd4db668d55e21295c549"}
}