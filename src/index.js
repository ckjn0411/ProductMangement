document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  let name = document.querySelector("#name").value;
  let cost = document.querySelector("#price").value;
  let amount = document.querySelector("#quantity").value;
  let desc = document.querySelector("#desc").value;
  // tạo object từ name
  let item = {
    id: new Date().toISOString(),
    name: name.trim(),
    cost: cost.trim(),
    amount: amount.trim(),
    desc: desc.trim(),
  };
  //   hiển thị lên UI
  addItemToUI(item);
  // lưu vào LS
  addItemToLS(item);
});

// Hàm nhận vào item và hiển thị lên UI
const addItemToUI = (item) => {
  const { id, name, cost } = item;
  let newCard = document.createElement("div");
  newCard.className = "item";
  newCard.setAttribute("data-id", id);
  newCard.innerHTML = `
  <img src="https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/08/bup-be-pop-mart-the-monsters-dress-be-latte-vinyl-plush-doll-mau-nau-66ab0575b9040-01082024104805.jpg"
        alt="" />
  <div class="info-desc">
      <div class="name-prd">${name}</div>
      <div class="cost">
      <div class="cost-prd">${cost}</div>
      <div class="sale">${cost * 2}</div>
      </div>
  </div>
  `;
  document.querySelector(".product").appendChild(newCard);
};

const addItemToLS = (item) => {
  let listProd = getList(); // lấy ds từ ls || []
  listProd.push(item);
  localStorage.setItem("product", JSON.stringify(listProd));
};

// hàm lên LS và lấy danh sách về
const getList = () => {
  return JSON.parse(localStorage.getItem("product")) || [];
};

// init: render ra các item trong list
const init = () => {
  let list = getList();
  list.forEach((item) => {
    addItemToUI(item);
  });
};

init();

// xóa hết
document.querySelector(".btn-remove").addEventListener("click", (event) => {
  let isConfirmed = confirm(`Are you sure??`);
  if (isConfirmed) {
    // xoa UI
    document.querySelector(".product").innerHTML = "";
    // xoa LS
    localStorage.removeItem("product");
  }
});

document.querySelectorAll(".item").forEach((item) => {
  item.addEventListener("click", (_) => {
    let idUpd = item.dataset.id; // Lấy và in ra id của item
    let prdSelect = prdSelected(idUpd);
    let list = getListSl();
    if (prdSelect) {
      changeInput(prdSelect);
    }
  });
});

const changeInput = (prdSelect) => {
  document.getElementById("name").value = prdSelect.name;
  document.getElementById("price").value = prdSelect.cost;
  document.getElementById("quantity").value = prdSelect.amount;
  document.getElementById("desc").value = prdSelect.desc;
};

document.querySelector(".btn-clear").addEventListener("click", (event) => {
  let list = getListSl();
  changeInput({
    name: "",
    cost: "",
    amount: "",
    desc: "",
  });
  localStorage.removeItem("prdSelect");
});

document.querySelector(".btn-del").addEventListener("click", (event) => {
  let prdSelect = convertToArray(getListSl());

  let nameItem = prdSelect.map((item) => item.name);
  let isConfirmed = confirm(`Bạn có chắc là muốn xóa item: ${nameItem} ?`);
  if (isConfirmed) {
    let idRemove = prdSelect.map((item) => item.id);
    // xóa giao diện
    document.querySelectorAll(".item").forEach((item) => {
      if (idRemove.includes(item.dataset.id)) {
        item.remove(); // Xóa item khỏi giao diện
      }
    });

    localStorage.removeItem("prdSelect");
    removeItemFromLS(idRemove);
  }
});

const getListSl = () => JSON.parse(localStorage.getItem("prdSelect")) || [];

const prdSelected = (idUpd) => {
  let productList = getList(); //lay ds
  let prdSelect = productList.find((item) => {
    return item.id === idUpd;
  });
  localStorage.setItem("prdSelect", JSON.stringify(prdSelect));
  return prdSelect;
};

const removeItemFromLS = (idRemove) => {
  let listPrd = getList(); //lay ds

  listPrd = listPrd.filter((item) => item.id !== String(idRemove));
  localStorage.setItem("product", JSON.stringify(listPrd));
};

document.querySelector(".btn-search").addEventListener("click", (event) => {
  let inputValue = document.querySelector("#filter").value;
  let listPrd = getList();
  // tìm
  listPrd = listPrd.filter((item) => item.name.includes(inputValue));
  // xoa list r render lai
  document.querySelector(".product").innerHTML = "";
  listPrd.forEach((item) => {
    addItemToUI(item);
  });
});

// ------------------
// Giả sử dữ liệu trong localStorage là một object nhưng bạn cần nó thành mảng

// Chuyển đổi object thành mảng
const convertToArray = (data) => {
  if (typeof data === "object" && !Array.isArray(data)) {
    return [data]; // Chuyển object thành mảng
  }
  return data;
};
