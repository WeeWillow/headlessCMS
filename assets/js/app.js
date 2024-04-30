const urlBase = 'https://api.weewillow.com/wp-json/wp/v2/';
const recipeCategoryId = 3;
const sectionEl = document.querySelector('.renderedRecipes');
const recipeHTMLel = document.querySelector('#recipeHTML');

const recipeTimeId = 149;
const recipeMealTypeId = 144;
const recipeDietPrefId = 147;
const recipeDifficulty = 148;
const recipeTimeRadio = document.querySelectorAll('input[name="time"]');
const recipeMealTypeRadio = document.querySelectorAll('input[name="mealtype"]');
const recipeDietTypeCheckBox = document.querySelectorAll('input[name="diettype"]');
const recipeDifficultyRadio = document.querySelectorAll('input[name="difficulty"]');

const allRadioButtons = document.querySelectorAll('input[type="radio"]');


//funktion som unchecker radio buttons når du trykker på en ny radio button



allRadioButtons.forEach(radio => {
  radio.addEventListener('click', () => {
    if (radio.checked) {
      // Uncheck alle andre radio buttons på siden
      allRadioButtons.forEach(otherRadio => {
        if (otherRadio !== radio) {
          otherRadio.checked = false;
        }
      });
    }
  });
});

recipeTimeRadio.forEach(input => {
  input.addEventListener('click', () => {

    const selectedId = input.value;
    getPrivateRecipes(selectedId, undefined, undefined, undefined);
  });
});

recipeMealTypeRadio.forEach(input => {
  input.addEventListener('click', () => {
    const selectedId = input.value;
    getPrivateRecipes(undefined, selectedId, undefined, undefined);
  });
});

recipeDietTypeCheckBox.forEach(input => {
  input.addEventListener('click', () => {
    const selectedId = input.value;
    getPrivateRecipes(undefined, undefined, selectedId, undefined);
  });
});

recipeDifficultyRadio.forEach(input => {
  input.addEventListener('click', () => {
    const selectedId = input.value;
    getPrivateRecipes(undefined, undefined, undefined, selectedId);
  });
});



// Get token
function getToken() {
  const loginInfo = {
    username: 'api-user',
    password: 'yR3r NLyD Vbjz 5VhB DhTN al2h'
  }

  return fetch('https://api.weewillow.com/wp-json/jwt-auth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginInfo)
  })
    .then(res => res.json())
    .then(data => {
      sessionStorage.setItem('myToken', data.data.token)
    })
    .catch(err => console.log('token error occured: ', err))
}
//
// 

function getPrivateRecipes(recipeTimeId, recipeMealTypeId, recipeDietPrefId, recipeDifficulty) {
  let query = `posts?categories=${recipeCategoryId}&status=private`

  if (recipeTimeId !== undefined) {
    query += `&recipe-time=${recipeTimeId}`;
  }

  if (recipeMealTypeId !== undefined) {
    query += `&meal-type=${recipeMealTypeId}`;
  }

  if (recipeDietPrefId !== undefined) {
    query += `&dietary-preferance=${recipeDietPrefId}`;
  }

  if (recipeDifficulty !== undefined) {
    query += `&difficulty-level=${recipeDifficulty}`;
  }

  fetch(urlBase + query, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('myToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      clearResults();
      data.forEach(recipe => renderRecipeCard(recipe));
    })
    .catch(err => console.log('get private recipes error occured: ', err))
};

function clearResults() {
  sectionEl.innerHTML = "";
}


function renderRecipeCard(recipe) {
  sectionEl.innerHTML +=
    `
    <div class="recipe-cards">
    <a href="./recipe.html?id=${recipe.id}">
    <article>
    <div>
    <img src="${recipe.acf.image.url}" alt="${recipe.acf.alt_title}">
      <svg
        id="Add_to_favorites"
        data-name="Add to favorites"
        xmlns="http://www.w3.org/2000/svg"
        width="29"
        height="29"
        viewBox="0 0 29 29"
      >
        <circle
          id="Ellipse_2"
          data-name="Ellipse 2"
          cx="14.5"
          cy="14.5"
          r="14.5"
          fill="#233822"
        />
        <path
          id="Icon_akar-heart"
          data-name="Icon akar-heart"
          d="M5.769,4.5A2.755,2.755,0,0,0,3,7.241c0,1.222.485,4.123,5.254,7.055a.545.545,0,0,0,.567,0c4.769-2.932,5.254-5.833,5.254-7.055A2.755,2.755,0,0,0,11.306,4.5,4.185,4.185,0,0,0,8.537,6.161,4.185,4.185,0,0,0,5.769,4.5Z"
          transform="translate(5.963 6)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
      </svg>
    </div>
    <h3> ${recipe.acf.alt_title}</h3>
    </article>
    </a>
    </div>
    `
}
// catch url id
// fetch
// render



function getSingleRecipe() {
  // fang id fra url
  const urlParams = new URLSearchParams(window.location.search);
  const recipeUrlId = urlParams.get('id');

  // hent den relevante post
  let query = `posts/${recipeUrlId}?categories=${recipeCategoryId}&status=private`

  fetch(urlBase + query, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('myToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      renderSingleRecipe(data);
      renderIngredientList(data.acf.ingredients);
      renderMethodList(data.acf.method);
      console.log('data:', data);
    })
    .catch(err => console.log('get single recipe error occured: ', err))
  // render med funktion
}

function renderSingleRecipe(recipe) {
  recipeHTMLel.innerHTML =
    `
      <nav aria-label="Breadcrumbs" class="breadcrumbs">
        <ol>
          <li>
            <a href="./index.html">Home</a>
            <p aria-hidden="true">&gt;</p>
          </li>
          <li>
            <a href="./recipes.html">Recipes</a>
            <p aria-hidden="true">&gt;</p>
          </li>
          <li>
            <a href="#" aria-current="page" id="currentPage">${recipe.acf.alt_title}</a>
          </li>
        </ol>
      </nav>
      <section class="recipeOverview">
        <div class="recipeInfo">
          <h2>${recipe.acf.alt_title}</h2>
          <div class="recipeQuickStats">
            <div class="quickStats">
              <span id="nrIngredients">0</span>
              Ingredients
            </div>
            <div class="quickStats">
              <span id="nrMintues">${getTime(recipe.acf.recipe_time.name)}</span>
              Minutes
            </div>
            <div class="quickStats">
              <span id="nrDifficulty">${recipe.acf.difficulty_level.name}</span>
              Difficulty
            </div>
          </div>
          <div class="recipeAuthor">
            <img src="https://thispersondoesnotexist.com/" alt="image of recipe author">
            <p id="authorName">${recipe.acf.author[0].post_title}</p>
          </div>
        </div>
        <img src="${recipe.acf.image.sizes.large}" alt="${recipe.acf.alt_title}" id="recipeImg">
      </section>

      <section class="ingredients">
        <h2>Ingredients</h2>
        <ul class="ingredientList">
        <!-- the li is rendered in function renderIngredientList -->
        </ul>
      </section>

      <section class="method">
        <h2>Method</h2>
        <ul class="methodList">
        <!-- the li is rendered in function renderMethodList -->
        </ul>
      </section>
  `
}

function getTime(timeString) {
  if (timeString.includes("Quick")) {
    return "<30";
  } else if (timeString.includes("Moderate")) {
    return "30-60";
  } else if (timeString.includes("Long")) {
    return "60+";
  } else {
    return "N/A";
  }
}

// to render ingredient list, filter empty strings out with for loop, if(value) {ing += ''} sort empty away
function renderIngredientList(ingredients) {
  const ingredientList = document.querySelector('.ingredientList');
  ingredientList.innerHTML = '';

  let ingredientCount = 0;

  for (let i = 1; i <= 10; i++) {
    const ingredientName = ingredients[`ingredient_${i}`];

    if (ingredientName.trim() !== '') {
      const ingredientAmount = ingredients[`ingredient_amount_${i}`];
      const amountDisplay = ingredientAmount.trim() !== '' ? ingredientAmount : '-';
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <span class="amountIngredient">${amountDisplay}</span>
      ${ingredientName}
    `;
      ingredientList.appendChild(listItem);
      ingredientCount++;
    }
  }
  document.getElementById('nrIngredients').textContent = ingredientCount;
};

function renderMethodList(method) {
  const methodList = document.querySelector('.methodList');
  methodList.innerHTML = '';

  Object.keys(method).forEach(stepKey => {
    const stepDescription = method[stepKey];

    if (stepDescription.trim() !== '') {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <div class="methodStep">${stepKey.replace('step_', '')}</div>
      <div class="instruction">${stepDescription}</div>
      `;
      methodList.appendChild(listItem);
    }
  });
};