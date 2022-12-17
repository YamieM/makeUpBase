const filterForm = document.forms.filterForm;
const mainContainer = document.querySelector(".main");
const formElements = filterForm?.elements;
const body = document.body;

const addElement = ({
  createdElement,
  content = "",
  img = "",
  link = "",
  addClass = "",
  parentElement = undefined,
  grandParentElement = undefined,
}) => {
  const element = document.createElement(createdElement);

  if (content) {
    element.innerHTML = content;
  }

  if (img) {
    element.src = "./Assets/images/defProductImage.jpeg";
    const imageData = async (img) => {
      const res = await fetch(img, {
        method: "GET",
      });
      if (res.status == 200) {
        element.src = img;
      }
    };
    imageData(img);
  }

  if (link) {
    element.href = link;
  }
  if (addClass) {
    element.classList.add(addClass);
  }
  if (parentElement) {
    parentElement?.appendChild(element);
    return grandParentElement?.appendChild(parentElement);
  }
  return mainContainer;
};

const createCards = (data) => {
  const cards = document.createElement("div");
  mainContainer?.appendChild(cards);
  cards?.classList.add("cards");

  if (!data.length) {
    addElement({
      createdElement: "h2",
      content: `Brand "${brandToFilter}" not found`,
      parentElement: cards,
    });
  } else {
    data.map(({ brand, name, image_link, id }) => {
      const itemCard = document.createElement("a");
      itemCard?.classList.add("item-card");
      cards.appendChild(itemCard);
      itemCard.href = `./aboutProduct.html?id=${id}`;

      addElement({
        createdElement: "img",
        img: image_link,
        parentElement: itemCard,
        addClass: "product-image",
        grandParentElement: cards,
      });

      addElement({
        createdElement: "a",
        content: `${brand} \[${name}\]`.toUpperCase(),
        parentElement: itemCard,
        addClass: "item-card_products",
        link: `./aboutProduct.html?id=${id}`,
        grandParentElement: cards,
      });
    });
  }
};

function closeLoader(data) {
  if (data) {
    const preloader = document.querySelector(".preloader");
    preloader.classList.add("loader_success");
    preloader.classList.remove("loader_unSuccess");
  }
}

window.addEventListener("scroll", function () {
  sessionStorage.scrollTop = document.documentElement.scrollTop;
});

function setScroll() {
  document.documentElement.scrollTop = sessionStorage.scrollTop;
}

function setsForSS(name, value) {
  sessionStorage.setItem(name, value);
}

const addEvents = () => {
  [...formElements].forEach((element) => {
    if (element.type !== "submit") {
      element.addEventListener("change", () => {
        setsForSS(element.name, element.value);
      });
    }
  });
};
const checkStorage = () => {
  [...formElements].forEach((element) => {
    if (element.type !== "submit") {
      element.value = sessionStorage.getItem(element.name);
    }
  });
  addEvents();
};

checkStorage();

let brandToFilter = filterForm.elements.filterForm_productBrand.value;
let typeToFilter = filterForm.elements.filterForm_productType.value;

const getBrand = (a) => {
  brandToFilter = a.toLowerCase();
};

const getType = (a) => {
  brandToFilter = a.toLowerCase();
};

const getProducts = () => {
  let brandToFilter = filterForm.filterForm_productBrand.value;
  let typeToFilter = filterForm.filterForm_productType.value;
  const divBrandPast = document.querySelector(".div-brand");
  if (divBrandPast) {
    divBrandPast.remove();
  }
  const preloader = document.querySelector(".preloader");
  preloader.classList.add("loader_unSuccess");

  const url1 = `http://makeup-api.herokuapp.com/api/v1/products.json`;
  const url2 = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brandToFilter}`;
  const url3 = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brandToFilter}&product_type=${filterForm.filterForm_productType.value}`;
  const url4 = `http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${filterForm.filterForm_productType.value}`;

  const getUrl = () => {
    switch ((brandToFilter, typeToFilter)) {
      case brandToFilter.length == 0 && !!typeToFilter:
        return url1;
      case brandToFilter.length > 0 && !!typeToFilter:
        return url2;
      case brandToFilter.length > 0 && typeToFilter:
        return url3;
      case brandToFilter.length == 0 && typeToFilter:
        return url4;
    }
  };

  const dataBrand = fetch(getUrl())
    .then((response) => response.json())
    .then((data) => {
      createCards(data);
      closeLoader(data);
      setScroll();
    })
    .catch((error) => console.log(error.name));
};

const submitBtn = filterForm.elements.submitBtn;

submitBtn?.addEventListener("click", () => {
  getProducts();
});
getProducts();
