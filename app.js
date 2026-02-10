let catalogo = [];

// ======================= IMPORTAR JSON =======================
document.getElementById("importFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = evt=>{
    try {
      catalogo = JSON.parse(evt.target.result);
      localStorage.setItem("catalogo", JSON.stringify(catalogo));
      renderItems();
    } 
    catch { alert("JSON inválido"); }
  };
  reader.readAsText(file);
});

// ======================= CARGAR LOCALSTORAGE ==================
window.onload = ()=>{
  const data = localStorage.getItem("catalogo");
  if (data) {
    catalogo = JSON.parse(data);
    renderItems();
  }
};

// ======================= ORDENAR POR NOMBRE ==================
function sortByName() {
  catalogo.sort((a,b)=> a.name.localeCompare(b.name));
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
}

// ======================= ORDENAR POR PRECIO ==================
function sortByPrice() {
  catalogo.sort((a,b)=> a.price - b.price);
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
}

// ======================= RENDER ITEMS COMO CARDS =============
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

      <button class="item-edit-btn" onclick="editItem(${i})">Editar</button>
      <button class="btn-delete item-delete-btn" onclick="delItem(${i})">Eliminar</button>
    `;

    cont.appendChild(div);
  });
}

// ======================= EDITAR ITEM =========================
function editItem(i) {
  const cont = document.getElementById("itemsList");
  const item = catalogo[i];

  cont.children[i].innerHTML = `
    <input class="item-edit-input" id="editName${i}" value="${item.name}">
    <input class="item-edit-input" id="editPrice${i}" value="${item.price}">
    <select class="item-edit-select" id="editCat${i}">
      <option ${item.category==="general"?"selected":""}>general</option>
      <option ${item.category==="aire acondicionado split"?"selected":""}>aire acondicionado split</option>
      <option ${item.category==="eléctrico"?"selected":""}>eléctrico</option>
      <option ${item.category==="solar"?"selected":""}>solar</option>
    </select>

    <button class="item-save-btn" onclick="saveItem(${i})">Guardar</button>
    <button class="btn-delete item-delete-btn" onclick="delItem(${i})">Eliminar</button>
  `;
}

// ======================= GUARDAR CAMBIOS ======================
function saveItem(i) {
  const name = document.getElementById(`editName${i}`).value.trim();
  const price = Number(document.getElementById(`editPrice${i}`).value);
  const category = document.getElementById(`editCat${i}`).value;

  if (!name || !price || !category) {
    alert("Completa todo");
    return;
  }

  catalogo[i] = { name, price, category };
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
}

// ======================= ELIMINAR =============================
function delItem(i) {
  catalogo.splice(i, 1);
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderItems();
}

// ======================= EXPORTAR =============================
document.getElementById("exportBtn").addEventListener("click", ()=>{
  const data = JSON.stringify(catalogo, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "catalogo_actualizado.json";
  a.click();
});
