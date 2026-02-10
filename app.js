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
      <input class="inline-input" value="${item.name}" onchange="updateField(${i}, 'name', this.value)">
      <input class="inline-input" type="number" value="${item.price}" onchange="updateField(${i}, 'price', this.value)">
      <select class="inline-input" onchange="updateField(${i}, 'category', this.value)">
        <option value="general"${item.category==="general"?" selected":""}>General</option>
        <option value="aire acondicionado split"${item.category==="aire acondicionado split"?" selected":""}>Aire Acondicionado</option>
        <option value="eléctrico"${item.category==="eléctrico"?" selected":""}>Eléctrico</option>
        <option value="solar"${item.category==="solar"?" selected":""}>Solar</option>
      </select>
      <button class="btn-delete" onclick="delItem(${i})">Eliminar</button>
    `;
    cont.appendChild(div);
  });
}

function updateField(i, campo, valor) {
  if (campo === "price") valor = Number(valor);
  catalogo[i][campo] = valor;
  localStorage.setItem("catalogo", JSON.stringify(catalogo));
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
  if (!name || !price || !category) return alert("Completa todos los campos");
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