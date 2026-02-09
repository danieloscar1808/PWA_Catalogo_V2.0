let catalogo = [];

document.getElementById("importFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt=>{
    try {
      catalogo = JSON.parse(evt.target.result);
      localStorage.setItem("catalogo", JSON.stringify(catalogo));
      renderItems();
    } catch { alert("JSON inválido"); }
  };
  reader.readAsText(file);
});

window.onload = ()=>{
  const data = localStorage.getItem("catalogo");
  if (data) {
    catalogo = JSON.parse(data);
    renderItems();
  }
};

function renderItems() {
  const cont = document.getElementById("itemsList");
  cont.innerHTML = "";
  catalogo.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <div class="item-title">${item.name}</div>
      <div class="item-info">Precio: $${item.price}</div>
      <div class="item-info">Categoría: ${item.category}</div>
      <button class="btn-delete" onclick="delItem(${i})">Eliminar</button>
    `;
    cont.appendChild(div);
  });
}

function delItem(i) {
  catalogo.splice(i, 1);
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
}

document.getElementById("addForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = addName.value.trim();
  const price = Number(addPrice.value);
  const category = addCategory.value;
  if (!name || !price || !category) { alert("Completa todos los campos"); return; }
  catalogo.push({ name, price, category });
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
  e.target.reset();
});

document.getElementById("exportBtn").addEventListener("click", ()=>{
  const data = JSON.stringify(catalogo, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "catalogo_actualizado.json";
  a.click();
});