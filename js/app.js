window.addEventListener("DOMContentLoaded", () => {
  let currentPage = 0;
  let products = [];
  let filteredProducts = [];

  const loader = document.querySelector(".loader");

  const displaLoading = () => {
    loader.classList.add("display");
  };

  const hideLoading = () => {
    loader.classList.remove("display");
  };

  displaLoading();

  const fetchProducts = () => {
    fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
      .then((response) => response.json())
      .then((ResponseData) => {
        products = ResponseData;
        filteredProducts = [...products];
        hideLoading();
        filterData();
        displayProducts();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const prevButton = document.querySelector("#prev-btn");
  const nextButton = document.querySelector("#next-btn");

  prevButton.disabled = true;

  const updatePaginationButtons = () => {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled =
      (currentPage + 1) * itemsPerPage >= filteredProducts.length;
  };

  const calculateItemsPerPage = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 768) {
      return 5;
    } else if (screenWidth < 1024) {
      return 10;
    } else {
      return 15;
    }
  };

  const itemsPerPage = calculateItemsPerPage();

  const filterData = () => {
    const selectFilter = document.querySelector(".sort-filter");
    const nameFilter = document
      .querySelector("#name-filter")
      .value.toLowerCase();
    const brandFilter = document
      .querySelector("#brand-filter")
      .value.toLowerCase();
    const typeFilter = document
      .querySelector("#type-filter")
      .value.toLowerCase();

    filteredProducts = products.filter((product) => {
      const nameMatches = product.name.toLowerCase().includes(nameFilter);
      const brandMatches = product.brand
        ? product.brand.toLowerCase().includes(brandFilter)
        : false;
      const typeMatches = product.product_type
        .toLowerCase()
        .includes(typeFilter);

      return nameMatches && brandMatches && typeMatches;
    });

    selectFilter.addEventListener("click", () => {
      if (selectFilter.value === "best-rated") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (selectFilter.value === "lower-prices") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (selectFilter.value === "higher-prices") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (selectFilter.value === "all") {
        filteredProducts = [...products];
      }
      currentPage = 0
      updatePaginationButtons()
      displayProducts();
    });
  };

  const displayProducts = () => {
    const productsHTML = document.querySelector("#products");
    productsHTML.innerHTML = "";

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredProducts.slice(start, end);

    if (pageData.length === 0) {
      productsHTML.innerHTML = "<p> No products found </p>";
      return;
    }

    pageData.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";

      const img = document.createElement("img");
      img.src = product.image_link;
      img.onerror = () => {
        img.src = "https://cdn-icons-png.flaticon.com/512/1024/1024505.png";
      };

      const title = document.createElement("h1");
      title.textContent = product.name;

      const brand = document.createElement("h3");
      brand.textContent = `By ${product.brand}`;

      const price = document.createElement("p");
      price.className = "price-badge";
      const productPrice = product.price * 5.5;
      price.textContent = `R$ ${productPrice.toFixed(2)}`;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(brand);
      card.appendChild(price);

      productsHTML.appendChild(card);
    });
  };

  prevButton.addEventListener("click", () => {
    currentPage--;
    displayProducts();
    updatePaginationButtons();
  });

  nextButton.addEventListener("click", () => {
    currentPage++;
    displayProducts();
    updatePaginationButtons();
  });

  document.querySelector("#name-filter").addEventListener("input", () => {
    filterData();
    displayProducts();
    currentPage = 0
    updatePaginationButtons()
  });
  document.querySelector("#brand-filter").addEventListener("input", () => {
    filterData();
    displayProducts();
    currentPage = 0
    updatePaginationButtons()
  });
  document.querySelector("#type-filter").addEventListener("input", () => {
    filterData();
    displayProducts();
    currentPage = 0
    updatePaginationButtons()
  });


  fetchProducts();
});
