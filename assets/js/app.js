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
      console.log(data);
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


  console.log('query:', query)

  fetch(urlBase + query, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('myToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log('data:', data)
      clearResults();
      data.forEach(recipe => renderRecipeCard(recipe));
    })
    .catch(err => console.log('get recipes error occured: ', err))
};

function clearResults() {
  sectionEl.innerHTML = "";
}


function renderRecipeCard(recipe) {
  sectionEl.innerHTML +=
    `
  <a href="./recipe.html?id=${recipe.id}">
  <article class="container">
  <img src="${recipe.acf.image.url}" alt="${recipe.acf.alt_title}">
  <div class="content">
  <h2>
  ${recipe.acf.alt_title}
  </h2>
  <p class="description">
  ${recipe.acf.description}
  </p>
  </div>
  </article>
  </a>
  `
}

// catch url id
// fetch
// render

// to render ingredient list, filter empty strings out with for loop, if(value) {ing += ''} sort empty away

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
      console.log('data:', data)
      renderSingleRecipe(data);
    })
    .catch(err => console.log('get recipes error occured: ', err))
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
              <span id="nrIngredients">10</span>
              Ingredients
            </div>
            <div class="quickStats">
              <span id="nrMintues">${recipe.acf.recipe_time.name}</span>
            </div>
            <div class="quickStats">
              <span id="nrDifficulty">${recipe.acf.difficulty_level.name}</span>
              Difficulty
            </div>
          </div>
          <div class="recipeAuthor">
            <img src=""https://thispersondoesnotexist.com/" alt="image of recipe author">
            <p id="authorName">${recipe.acf.author[0].post_title}</p>
          </div>
        </div>
        <img src="${recipe.acf.image.link}" alt="${recipe.acf.alt_title}" id="recipeImg">
      </section>

      <section class="ingredients">
        <h2>Ingredients</h2>
        <ul class="ingredientList">
          <li>
            <span class="amountIngredient">1</span>
            Pound skin-on pork belly
          </li>
          <li>
              <span class="amountIngredient">7&frac12;</span>
              Cups water, divided
          </li>
          <li>
              <span class="amountIngredient">&frac14;</span>
              Cup Shaoxing wine or dry Marsala wine
          </li>
          <li>
              <span class="amountIngredient">3</span>
              Tablespoons soy sauce
          </li>
          <li>
              <span class="amountIngredient">1</span>
              Tablespoon plus
          </li>
          <li>
              <span class="amountIngredient">1&frac12;</span>
              Teaspoons rock sugar
          </li>
          <li>
              <span class="amountIngredient">2</span>
              Stalks green onions, cut into 3-inch segments
          </li>
          <li>
              <span class="amountIngredient">3-4</span>
              Large slices fresh ginger, cut on the bias (about 3 inches long and ¼ inch thick)
          </li>
          <li>
              <span class="amountIngredient">3-4</span>
              Cloves garlic, gently smashed
          </li>
          <li>
              <span class="amountIngredient">1</span>
              Star anise
          </li>
        </ul>
      </section>

      <section class="method">
        <h2>Method</h2>
        <ul class="methodList">
          <li>
            <div class="methodStep">1</div>
            <div class="instruction">
              Position the pork belly with the skin side down. Using a sharp knife, cut the pork belly into roughly 1½-inch-square pieces. The skin will take a little extra pressure to cut through, so be careful.
            </div>
          </li>
          <li>
            <div class="methodStep">2</div>
            <div class="instruction">
              Combine the pork and 3 cups of the water in a 4- or 5-quart pot. Bring to a boil over high heat, then reduce the heat to low. Simmer for 5 minutes to release some of the scum. Turn off the heat and, using a slotted spoon or tongs, transfer the pork to a medium bowl. Discard the water and carefully rinse out the pot.
            </div>
          </li>
          <li>
            <div class="methodStep">3</div>
            <div class="instruction">
              Return the pot to the stove over high heat. Add the pork belly, 4 cups of the water, the wine, soy sauce, sugar, onions, ginger, garlic, and star anise, bring the mixture to a boil, and then reduce the heat to low. Simmer for about 1 hour, checking occasionally and stirring to make sure all the meat pieces spend some time submerged in the braising liquid.
            </div>
          </li>
          <li>
            <div class="methodStep">4</div>
            <div class="instruction">
              After an hour, if the sauce seems overly salty, add the remaining ½ cup water. Check the tenderness of the largest piece of pork belly with a fork. If there’s any resistance, the pork will need to simmer for 10 to 15 minutes more. As the pork simmers, the sauce will continue to reduce, intensify in flavor, and become a caramel.
            </div>
          </li>
          <li>
            <div class="methodStep">5</div>
            <div class="instruction">
              After 10 minutes, repeat the fork test. Once the pork belly is tender, increase the heat to medium to speed up the reduction process. Stir constantly to prevent sticking and to ensure that all the pork belly pieces are evenly coated with the caramel. When nearly all of the liquid has reduced, remove the pot from the heat.
            </div>
          </li>
          <li>
            <div class="methodStep">6</div>
            <div class="instruction">
              Arrange the pork belly on a serving plate or bowl, and serve with steamed rice.
            </div>
          </li>
        </ul>
      </section>
  `
}



// function getRecipeByTaxonomy() {
// }

// function catchInputRecipeTime() {
//   // catch recipe time
//   // catch quick, moderate or long term id
//   // quick id 75
//   // moderate id 76
//   // long id 77?
// }