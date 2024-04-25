const urlBase = 'https://api.weewillow.com/wp-json/wp/v2/';
const recipeCategoryId = 3;
const sectionEl = document.querySelector('section');

const recipeTimeId = 149;

const recipeTimeRadio = document.querySelectorAll('input');

recipeTimeRadio.forEach(input => {
  input.addEventListener('click', e => {
    const selectedId = e.target.value
    getPrivateRecipes(selectedId)
  })
})


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

function getPrivateRecipes(recipeTimeId) {
  let query = `posts?categories=${recipeCategoryId}&status=private&`
  if (recipeTimeId) {
    query += `&recipe-time=${recipeTimeId}`
  }

  fetch(urlBase + query, {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('myToken')
    }
  })
    .then(res => res.json())
    .then(data => {
      clearResults();
      data.forEach(recipe => renderRecipe(recipe));
    })
    .catch(err => console.log('get recipes error occured: ', err))
};

function clearResults(){
    sectionEl.innerHTML = "";
}
 
 
clearResults();


function renderRecipe(recipe) {

  sectionEl.innerHTML +=
    `
  <article class="container">
    <img src="${recipe.acf.image.url}" alt="${recipe.acf.image.title}">
    <div class="content"> 
      <h2>
        ${recipe.acf.image.title}
      </h2>
        <p class="description">
          ${recipe.acf.description}
        </p>
    </div>
    </article>
  `
}

renderRecipe();



function getRecipeByTaxonomy() {
}

function catchInputRecipeTime() {
  // catch recipe time
  // catch quick, moderate or long term id
  // quick id 75
  // moderate id 76
  // long id 77?
}