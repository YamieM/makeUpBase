const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let idParameter = params.id;

function closeLoader(data) {
  if (data) {
    const preloader = document.querySelector(".preloader");
    preloader.classList.add("loader_success");
    preloader.classList.remove("loader_unSuccess");
  }
}

const addElement = ({
  createdElement,
  content = "",
  img = "",
  link = "",
  addClass = "",
  textContent = "",
  event = "",
  link_product = "",
  style_color = "",
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
  if (textContent) {
    element.textContent = textContent;
  }
  switch (event) {
    case "button": {
      element.addEventListener("click", () => {
        window.open(link_product);
      });
    }
    case "link": {
      element.addEventListener("click", () => {
        window.history.back();
      });
    }
  }
  if (style_color) {
    element.style.backgroundColor = style_color;
  }
  if (parentElement) {
    parentElement?.appendChild(element);
    return grandParentElement?.appendChild(parentElement);
  }
  return mainContainer;
};

const createCard = (data) => {
  const mainContainer = document.querySelector(".main-container");
  addElement({
    createdElement: "h1",
    content: data.name.toUpperCase(),
    parentElement: mainContainer,
  });

  const divProduct = document.createElement("div");
  divProduct?.classList.add("div-product");
  mainContainer?.appendChild(divProduct);
  let priseSign = "$";
  if (data.price_sign) {
    priseSign = data.price_sign;
  }

  addElement({
    createdElement: "img",
    img: data.image_link,
    addClass: "product-image",
    parentElement: divProduct,
  });

  addElement({
    createdElement: "h3",
    content: `Brand: ${data.brand.toUpperCase()}`,
    addClass: "info-about-product",
    parentElement: divProduct,
  });

  addElement({
    createdElement: "h3",
    content: `Price: ${priseSign}${data.price}`,
    addClass: "info-about-product",
    parentElement: divProduct,
  });

  if (data.rating) {
    addElement({
      createdElement: "h3",
      content: `Rating: ${data.rating}`,
      addClass: "info-about-product",
      parentElement: divProduct,
    });
  } else {
    addElement({
      createdElement: "h3",
      content: `Rating: unrated`,
      addClass: "info-about-product",
      parentElement: divProduct,
    });
  }

  addElement({
    createdElement: "button",
    textContent: "Buy Now",
    event: "button",
    addClass: "buy-now-button",
    parentElement: divProduct,
    link_product: data.product_link,
  });

  const divOfColors = document.createElement("div");
  divOfColors?.classList.add("colors-section");
  divProduct.appendChild(divOfColors);

  data.product_colors.forEach((elem) => {
    const singleColor = document.createElement("div");
    singleColor?.classList.add("single-color-section");

    addElement({
      createElement: "div",
      style_color: elem.hex_value,
      addClass: "color-circle",
      parentElement: singleColor,
      grandParentElement: divOfColors,
    });

    if (elem.colour_name) {
      addElement({
        createdElement: "h4",
        content: elem.colour_name.toLowerCase(),
        addClass: "name-of-color",
        parentElement: singleColor,
        grandParentElement: divOfColors,
      });
    }
  });

  addElement({
    createdElement: "p",
    content: `Description: ${data.description}`,
    addClass: "other-text",
    parentElement: divProduct,
  });

  addElement({
    createdElement: "p",
    content: `Tags:`,
    addClass: "other-text",
    parentElement: divProduct,
  });

  const list = document.createElement("ul");
  list?.classList.add("other-text");
  divProduct.appendChild(list);

  data.tag_list.map((elem) => {
    addElement({
      createdElement: "li",
      content: elem,
      parentElement: list,
    });
  });

  addElement({
    createdElement: "a",
    content: "Back",
    event: "link",
    addClass: "back-button",
    parentElement: mainContainer,
  });

  return mainContainer;
};

const dataBrand = fetch(
  `http://makeup-api.herokuapp.com/api/v1/products/${idParameter}.json`
)
  .then((response) => response.json())
  .then((data) => {
    createCard(data);
    console.log(data);
    closeLoader();
  });
