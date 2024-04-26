const urlBase = 'https://api.weewillow.com/wp-json/wp/v2/';
const recipeCategoryId = 3;
const sectionEl = document.querySelector('.renderedRecipes');

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

getToken()
  .then(() => getPrivateRecipes());
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
      data.forEach(recipe => renderRecipe(recipe));
    })
    .catch(err => console.log('get recipes error occured: ', err))
};

function clearResults() {
  sectionEl.innerHTML = "";
}


function renderRecipe(recipe) {

  sectionEl.innerHTML +=
    `
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
    `
  }

// 2renderRecipe();



function getRecipeByTaxonomy() {
}

function catchInputRecipeTime() {
  // catch recipe time
  // catch quick, moderate or long term id
  // quick id 75
  // moderate id 76
  // long id 77?
}