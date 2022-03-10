const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const search_value = document.getElementById("search-term");
const search_btn  = document.getElementById("search");

const mealPopup = document.getElementById("meal-popup");
const popupCloseBtn = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");
getRandomMeal();
fetchFavMeals();
// 爬取食譜 並 添加顯示在頁面
async function getRandomMeal(){
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal);
}

// 藉由使用者輸入食物 尋找相關食譜
async function getMealBySearch(term){

    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
    );
    const respData = await resp.json();
    const meals = respData.meals;
    console.log(meals);

    return meals;
}

async function getMealById(id){
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );
    
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;

}

function addMeal(mealData){

    const meal = document.createElement("div");
    meal.classList.add("meal");
    meal.innerHTML =`

        <div class="meal-header">
        <spam class=random> Random Recipe </spam>
            <img 
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>

        <div class="meal-body">
            <h4>
                ${mealData.strMeal}
            </h4>
            <button class="fav-btn">
                <i class="fas fa-heart"t></i>
            </button>
        </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")){
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else{
            addMealLS(mealData.idMeal);
            btn.classList.add("active")
        }
        fetchFavMeals();
    });

    meal.addEventListener("click", () => {
        showMealInfo(mealData);
    });


    mealsEl.appendChild(meal);
}


search_btn.addEventListener("click", async () => {
    mealsEl.innerHTML = "";
    const search = search_value.value;
    const meals = await getMealBySearch(search);

    if(meals){
        meals.forEach((meal) =>{
            addMeal(meal);
        });
    }
});

function showMealInfo(mealData){
    
    mealInfoEl.innerHTML = "";
    const mealInfo = document.createElement("div");
    const ingredients = [];

    for(let i=1; i<=20; i++){
        if(mealData["strIngredient" + i]){
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
            );
        }else{
            break;
        }
    }
    console.log(ingredients);
    mealInfo.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img 
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
            ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(
                (ing) => 
                `<li>${ing}</li>`
            ).join("")}
        </ul>
    `; 

    mealInfoEl.appendChild(mealInfo);
    console.log(mealInfoEl);
    mealPopup.classList.remove("hidden");
}

popupCloseBtn.addEventListener("click", () => {
    mealPopup.classList.add("hidden");
});


function getMealLS(){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}

function addMealLS(mealId){
    const mealIds = getMealLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId){
    const mealIds = getMealLS();
    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id != mealId))
    );
}

async function fetchFavMeals(){
    //clean the container
    favoriteContainer.innerHTML = "";
    const mealIds = getMealLS();
    for(let i = 0; i<mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        addMealFav(meal);
    }
}



function addMealFav(mealData){
    const favMeal = document.createElement("li");


    favMeal.innerHTML = `
        <img id="cool"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <span>${mealData.strMeal}</span>    
        <button class="clear" onclick="closebuttonclick(${mealData})">
            <i class="fas fa-window-close"></i>
        </button>
    `;


    const btn = favMeal.querySelector(".clear");
    const btnimg = favMeal.querySelector("cool");
    
    btn.addEventListener("click", () =>{
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
    });
    btnimg.addEventListener("click")
    /*
    favMeal.addEventListener("click", () =>{
        showMealInfo(mealData);
    });
    */
    favoriteContainer.appendChild(favMeal);
}
