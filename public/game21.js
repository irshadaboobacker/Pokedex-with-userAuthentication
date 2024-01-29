const pokemonContainer = document.querySelector(".pokemon-section");
const pokemonAttributesContainer = document.querySelector(
  ".pokemon-attributes"
);
const loadMoreBtn = document.querySelector(".load-more");
const collapseBtn = document.querySelector(".collapse");
const HomepageBtn = document.querySelector(".home-page");
const surprisemeBtn = document.querySelector(".surprise-button");
const searchBtn = document.querySelector(".searchButton");
var inputElement = document.getElementById("myInput");
var sortOptions = document.querySelector(".sort-selector");
var advabilitiesOptions = document.querySelector("#dropdown");
const advancedsearchBtn = document.querySelector(".adv-searchbutton");
const advancedsearchResetbtn = document.querySelector(".adv-resetbutton");
const advancedsearchshowBtn = document.querySelector(".advsearch-btn");
const hideadvsearchBtn = document.querySelector(".hide-advsearch-btn");
const advancedsearchSection = document.querySelector(".adv-search");
const advMininumweight = document.querySelector(".minWeight");
const advAvgweight = document.querySelector(".avgWeight");
const advMaximumweight = document.querySelector(".maxWeight");
const advMininumheight = document.querySelector(".minheight");
const advAvgheight = document.querySelector(".avgheight");
const advMaximumheight = document.querySelector(".maxheight");
const resetAdvancedsearch = document.querySelectorAll(".resetAdv");
const pokemonType = document.querySelectorAll(".type");
const pokemonWeakness = document.querySelectorAll(".weakness");
const logOutbutton = document.querySelector(".logout-Btn");
const welcomeUser = document.querySelector(".welcome-user");
const userName = document.querySelector(".user-name");
const userEmail = document.querySelector(".email-id");
const PokemonDetails = document.querySelectorAll(".pokemon");
const contentsectionTop = document.querySelector(".contentsection-top");
const contentsection = document.querySelector(".content-section");

const resetPasswordSection = document.querySelector(".panel");

const likedPokemonsection = document.querySelector(".likedPokemon-section");

var datafromdb = [];
let pokemonId;

let count;
let selectedSort;
let maxHeight;
let maxWeight;
let loadmoreadvancedsearch = 0;
let sortFlag = 0;
let surpriseFlag = 0;
let selectedWeight = 0;
let selectedHeight = 0;
let issearched = 0;
let output = "";
let eachoutput = "";
let searchloadCount = 0;
const limit = 16;
let icon = [];
let surpriseArray = [];
let mergedArray = [];
let advancedsearchedList = [];
let referenceadvancedsearchedList = [];
let options = [];
let searchedList = [];
let sortedList = [];
let advancedsearchtypearray = [];
let advancedsearchweaknessarray = [];

// to merge all the attributes of pokemons having same id
function mergePokemon(firstarray) {
  for (let i of firstarray) {
    const id = i.id;
    if (!mergedArray[id]) {
      mergedArray[id] = i;
    } else {
      mergedArray[id].type = Array.from(
        new Set([...mergedArray[id].type, ...i.type])
      );
    }
    if (i.height > mergedArray[id].height) {
      maxHeight = Math.max(maxHeight, i.height);
      mergedArray[id].height = i.height;
    }
    if (i.weight > mergedArray[id].weight) {
      maxWeight = Math.max(maxWeight, i.weight);
      mergedArray[id].weight = i.weight;
    }
  }
  // remove undefined elements if any undefined are there
  return mergedArray.filter((e) => e != null);
}





 const updatedArray = mergePokemon(firstarray);

 icon = updatedArray.map(obj => ({ ...obj, color: 'none' }));
//  copy of merged 1010 pokemons
let showedPokemon = mergePokemon(firstarray);
createAbilitesarray();
// new array to store all abilities
function createAbilitesarray() {
  let uniqueAbility = new Set();
  icon.forEach((item) =>
    item.abilities.forEach((items) => uniqueAbility.add(items))
  );
  options = Array.from(uniqueAbility);
  options.unshift("All");
}

populateDropdown();
function populateDropdown() {
  var dropdown = document.getElementById("dropdown");
  for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.text = options[i];
    option.value = i + 1;
    dropdown.add(option);
  }
}

displayFirstElements();


// function compareArrays() {
//   var elements = document.querySelector(".heart");
//   let results;
//   fetch("/getlikedArray")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       datafromdb = data;

//       console.log(icon);

//       // elements.forEach(function(element) {

//       //               //  console.log(results);

//       //                 // if (results) {
//       //                 //     element.classList.add('highlight');
//       //                 // } else {
//       //                 //     element.classList.remove('highlight');
//       //                 // }
//       //             });

//       for (let i = 0; i < icon.length; i++) {
//         for (let j = 0; j < datafromdb.length; j++) {
//           if (icon[i].name === datafromdb[j].name) {
//             // matchingElements.push(array1[i]);
//             // console.log("matched");
//             // element.classList.add('highlight');
//             elements.classList.add("highlight");
//             break; // Break the inner loop once a match is found for the current element in array1
//           }
//         }
//       }
//     });
// }

function displayFirstElements() {

  // replacethelikedPokemons();
  for (i = 0; i < limit; i++) {
    showOutput();
  }
  count = limit;
  pokemonContainer.innerHTML = output;
  if (count === 16) {
    collapseBtn.style.display = "none";
  }
}

//  event listener for loading 16 more pokemon
loadMoreBtn.addEventListener("click", function () {
  // console.log(count);
  if (surpriseFlag === 1) {
    // alert("surprised list")
    loadmoreafterSurprise();
  } else if (sortFlag === 1) {
    // alert("sorted")
    loadmoreafterSort();
  } else if (searchloadCount === 1) {
    // alert(" searched list");
    loadmoreafterSearch();
  } else if (loadmoreadvancedsearch === 1) {
    // alert("advanced search")
    loadmoreafteradvancedSearch();
  } else {
    // alert("else")
    collapseBtn.style.display = "block";
    for (i = count; i < count + limit; i++) {
      showOutput();
    }
    count = count + limit;
    pokemonContainer.innerHTML = output;
  }
});

collapseBtn.addEventListener("click", function () {
  // console.log(count);
  if (surpriseFlag === 1) {
    colapseafterSurprise();
    // alert("surprise flag")
    if (count == 16) {
      collapseBtn.style.display = "none";
    }
    addremovedElements(surpriseArray);
  } else if (sortFlag === 1) {
    // alert("sort flag")
    collapseafterSort();
    if (count == 16) {
      collapseBtn.style.display = "none";
    }
  } else if (searchloadCount == 1) {
    // alert("collapse after search")
    collapseafterSearch();
  } else if (loadmoreadvancedsearch === 1) {
    // alert("advanced")
    collapseafteradvancedSearch();
  } else {
    // alert("else")
    // alert("else flag")
    output = " ";
    count = count - limit;
    if (count == 16) {
      collapseBtn.style.display = "none";
    }
    for (i = 0; i < count; i++) {
      showOutput();
    }
    pokemonContainer.innerHTML = output;
    pokemonContainer.innerHTML = output;
  }
});

surprisemeBtn.addEventListener("click", function () {
  pokemonContainer.scrollIntoView({ behavior: "smooth" });
  if (loadmoreadvancedsearch === 1) {
    resetAdvancedsearch.forEach(function (e) {
      if ((e.style.backgroundColor = "red")) {
        e.style.backgroundColor = "";
      }
    });
    advancedsearchtypearray = [];
    advancedsearchweaknessarray = [];
  }
  surpriseFlag = 1;
  sortFlag = 0;
  searchloadCount = 0;
  loadmoreadvancedsearch = 0;
  // console.log(showedPokemon);
  output = " ";
  icon.sort(() => 0.5 - Math.random());
  surpriseArray = [];
  for (i = 0; i < count; i++) {
    surpriseArray.push(icon[i]);
    showOutput();
  }
  // if (icon.length = 1010) {
  //     removeElements(surpriseArray);
  // }
  loadMoreBtn.style.display = "block";
  pokemonContainer.innerHTML = output;
});

function removeElements(surpriseArray) {
  const filterediconafterSurprise = icon.filter(
    (element) => !surpriseArray.includes(element)
  );
  icon = filterediconafterSurprise;
}

function addremovedElements(surpriseArray) {
  let modifiedsurpriseArray = surpriseArray.slice(0, surpriseArray.length - 16);
  icon = icon.concat(modifiedsurpriseArray);
}

function loadmoreafterSurprise() {
  // console.log(icon);
  removeElements(surpriseArray);
  console.log(icon.length);
  icon.sort(() => 0.5 - Math.random());
  collapseBtn.style.display = "block";
  for (i = 0; i < limit; i++) {
    surpriseArray.push(icon[i]);
    showOutput();
  }
  count = count + 16;
  pokemonContainer.innerHTML = output;
}

function colapseafterSurprise() {
  console.log(icon.length);
  surpriseArray.splice(-16);
  output = " ";
  count = count - limit;
  if (count === 16) {
    collapseBtn.style.display = "none";
  }
  for (i = 0; i < count; i++) {
    output += `
                        <div class="pokemon">
                                <img class="pokemonimage" src="${surpriseArray[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
                                <p class="pokemonid">#${surpriseArray[i].number}</p>
                                <p class="tittle">${surpriseArray[i].name}</p>
                                <p class="type">Type:${surpriseArray[i].type}</p>
                                
                                <div class="weightandheight">
                                <p class= "heightPokemon">Height: ${surpriseArray[i].height}</p>
                                <p class= "heightPokemon">Weight: ${surpriseArray[i].weight}</p>
                                </div>
                                <div class="heart"></div>
                           </div>
                            `;
  }
  pokemonContainer.innerHTML = output;
  pokemonContainer.innerHTML = output;
  // console.log(icon);
}

// searching part
searchBtn.addEventListener("click", function () {
  var inputValue = inputElement.value.toLowerCase();
  if (inputValue.length > 0 && inputValue.charAt(0) === "#") {
    inputValue = inputValue.slice(1);
  }
  searchPokemon(inputValue);
});

inputElement.addEventListener("keyup", function (event) {
  var inputValue = inputElement.value.toLowerCase();
  if (inputValue.length > 0 && inputValue.charAt(0) === "#") {
    inputValue = inputValue.slice(1);
  }
  searchPokemon(inputValue);
});

function searchPokemon(inputValue) {
  searchedList = [];
  output = "";
  let numinoutValue = parseInt(inputValue);
  // console.log(advancedsearchedList);
  if (inputValue != "") {
    issearched = 1;
    if (isFinite(inputValue)) {
      if (advancedsearchedList.length > 0) {
        for (i in advancedsearchedList) {
          if (advancedsearchedList[i].number.includes(numinoutValue)) {
            searchedList.push(advancedsearchedList[i]);
          }
        }
      } else {
        for (i in showedPokemon) {
          if (showedPokemon[i].number.includes(numinoutValue)) {
            searchedList.push(showedPokemon[i]);
          }
        }
      }
      if (searchedList.length == 0) {
        errormessage();
      }
      if (searchedList.length < limit) {
        for (i = 0; i < searchedList.length; i++) {
          searchedshowOutput();
        }
        loadMoreBtn.style.display = "none";
      } else if (searchedList.length === 0) {
        errormessage();
      } else {
        searchloadCount = 1;
        loadMoreBtn.style.display = "block";
        for (i = 0; i < limit; i++) {
          searchedshowOutput();
        }
      }
      if (numinoutValue > 1010) {
        errormessage();
      }
      collapseBtn.style.display = "none";
      pokemonContainer.innerHTML = output;
    } else {
      if (advancedsearchedList.length > 0) {
        for (i in advancedsearchedList) {
          if (advancedsearchedList[i].slug.startsWith(inputValue)) {
            searchedList.push(advancedsearchedList[i]);
          }
        }
      } else {
        for (i in showedPokemon) {
          if (showedPokemon[i].slug.startsWith(inputValue)) {
            searchedList.push(showedPokemon[i]);
          }
        }
      }
      if (searchedList.length === 0) {
        errormessage();
      }
      if (searchedList.length < limit) {
        loadMoreBtn.style.display = "none";
        for (i = 0; i < searchedList.length; i++) {
          searchedshowOutput();
          collapseBtn.style.display = "none";
          pokemonContainer.innerHTML = output;
        }
      } else if (searchedList.length === 0) {
        errormessage();
      } else {
        loadMoreBtn.style.display = "block";
        for (i = 0; i < count; i++) {
          searchloadCount = 1;
          searchedshowOutput();

          collapseBtn.style.display = "none";
          pokemonContainer.innerHTML = output;
        }
      }
    }
  } else {
    issearched = 0;
    searchloadCount = 0;
    // loadmoreadvancedsearch = 1;
    if (advancedsearchedList.length > 0) {
      // advancedSearchresults
      if (advancedsearchedList.length > count) {
        for (i = 0; i < count; i++) {
          advancedsearchOutput();
        }
        loadMoreBtn.style.display = "block";
      } else {
        for (i = 0; i < advancedsearchedList.length; i++) {
          advancedsearchOutput();
          loadMoreBtn.style.display = "none";
        }
      }
    } else {
      displayFirstElements();
    }
    pokemonContainer.innerHTML = output;
  }

  if (searchloadCount === 1) {
    surpriseFlag = 0;
    sortFlag = 0;
  }
}

function loadmoreafterSearch() {
  count = count + 16;
  // console.log(count);
  output = "";
  if (searchedList.length < count) {
    for (i = 0; i < searchedList.length; i++) {
      searchedshowOutput();
    }
    collapseBtn.style.display = "block";
    loadMoreBtn.style.display = "none";
  } else {
    for (i = 0; i < count; i++) {
      searchedshowOutput();
    }
    collapseBtn.style.display = "block";
    loadMoreBtn.style.display = "block";
  }
  pokemonContainer.innerHTML = output;
}

function collapseafterSearch() {
  output = " ";
  if (count === 32) {
    loadMoreBtn.style.display = "block";
  }
  // console.log(count);
  count = count - limit;
  if (count === 16) {
    collapseBtn.style.display = "none";
  }
  for (i = 0; i < count; i++) {
    searchedshowOutput();
  }
  pokemonContainer.innerHTML = output;
  pokemonContainer.innerHTML = output;
}

function errormessage() {
  output = "";
  output += `
        <div class="error-container">
        <h2 class="errorheader">No Pokemon matches your search!</h2>
        <h3 class="errorcontent">Try again with name or number</h3>
        </div>`;
  loadMoreBtn.style.display = "none";
  pokemonContainer.innerHTML = output;
  collapseBtn.style.display = "none";
}

function searchedshowOutput() {
  output += `
    <div class="pokemon">
            <img class="pokemonimage" src="${searchedList[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
            <p class="pokemonid">#${searchedList[i].number}</p>
            <p class="tittle">${searchedList[i].name}</p>
            <p class="type">Type:${searchedList[i].type}</p>
            <div class="weightandheight">
            <p class= "heightPokemon">Height: ${searchedList[i].height}</p>
            <p class= "heightPokemon">Weight: ${searchedList[i].weight}</p>
            </div>
            <div class="heart"></div>
       </div>
        `;
}
function showOutput() {

  // if(icon[i].color != 'none'){
  //   output += `
  //   <div class="pokemon">
   
  //           <img class="pokemonimage" src="${icon[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
  //           <p class="pokemonid">#${icon[i].number}</p>
  //           <p class="tittle">${icon[i].name}</p>
  //           <p class="type">Type: ${icon[i].type}</p>
  //           <div class="weightandheight">
  //           <p class= "heightPokemon">Height: ${icon[i].height}</p>
  //           <p class= "heightPokemon">Weight: ${icon[i].weight}</p>
  //           </div>
  //           <div class="heart newColor"></div>
  //       </div>
  //       `;

  // } else {
  output += `
    <div class="pokemon">
   
            <img class="pokemonimage" src="${icon[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
            <p class="pokemonid">#${icon[i].number}</p>
            <p class="tittle">${icon[i].name}</p>
            <p class="type">Type: ${icon[i].type}</p>
            <div class="weightandheight">
            <p class= "heightPokemon">Height: ${icon[i].height}</p>
            <p class= "heightPokemon">Weight: ${icon[i].weight}</p>
            </div>
            <div class="heart"></div>
        </div>
        `;
  }
// }

// basic filter
function sortSelector() {
  selectedSort = sortOptions.options[sortOptions.selectedIndex].value;
  // console.log(selectedSort);
  if (selectedSort != "") {
    surpriseFlag = 0;
    sortFlag = 1;
    searchloadCount = 0;
    pokemonContainer.scrollIntoView({ behavior: "smooth" });
  }
  if (selectedSort == "highest") {
    if (issearched === 1) {
      // alert("searched list")
      sortByhighestNumber(searchedList);
    } else if (loadmoreadvancedsearch === 1) {
      // alert("advanced search list")
      sortByhighestNumber(advancedsearchedList);
    } else {
      // alert("else")
      sortByhighestNumber(showedPokemon);
    }
  } else if (selectedSort == "lowest") {
    if (issearched === 1) {
      sortbyLowest(searchedList);
    } else if (loadmoreadvancedsearch === 1) {
      // alert("advanced search list")
      sortbyLowest(advancedsearchedList);
    } else {
      sortbyLowest(showedPokemon);
    }
  } else if (selectedSort == "alphabetical") {
    if (issearched === 1) {
      sortbyAlphabetical(searchedList);
    } else if (loadmoreadvancedsearch === 1) {
      // alert("advanced search list")
      sortbyAlphabetical(advancedsearchedList);
    } else {
      sortbyAlphabetical(showedPokemon);
    }
  } else if (selectedSort == "reversealphabetical") {
    if (issearched === 1) {
      sortbyReverseAlphabetical(searchedList);
    } else if (loadmoreadvancedsearch === 1) {
      // alert("advanced search list")
      sortbyReverseAlphabetical(advancedsearchedList);
    } else {
      sortbyReverseAlphabetical(showedPokemon);
    }
  }
}

function sortByhighestNumber(showedPokemon) {
  sortedList = [];
  output = "";
  showedPokemon.sort((a, b) => {
    const nameA = a.number;
    const nameB = b.number;
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });
  sortedList = showedPokemon;

  if (sortedList.length < count) {
    for (i = 0; i < sortedList.length; i++) {
      showsortOutput();
    }
  } else {
    for (i = 0; i < count; i++) {
      showsortOutput();
    }
  }
  pokemonContainer.innerHTML = output;
  loadMoreBtn.style.display = "block";
}

function sortbyLowest(showedPokemon) {
  // console.log(sortedList);
  sortedList = [];
  output = "";
  showedPokemon.sort((a, b) => {
    const nameA = a.number;
    const nameB = b.number;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  sortedList = showedPokemon;

  if (sortedList.length < count) {
    for (i = 0; i < sortedList.length; i++) {
      showsortOutput();
    }
  } else {
    for (i = 0; i < count; i++) {
      showsortOutput();
    }
  }
  collapseBtn.style.display = "none";
  pokemonContainer.innerHTML = output;
}

function sortbyAlphabetical(showedPokemon) {
  sortedList = [];
  output = "";
  showedPokemon.sort((a, b) => {
    const nameA = a.slug;
    const nameB = b.slug;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  sortedList = showedPokemon;
  if (sortedList.length < count) {
    for (i = 0; i < sortedList.length; i++) {
      showsortOutput();
    }
  } else {
    for (i = 0; i < count; i++) {
      showsortOutput();
    }
  }
  collapseBtn.style.display = "none";
  pokemonContainer.innerHTML = output;
}

function sortbyReverseAlphabetical(showedPokemon) {
  sortedList = [];
  output = "";
  showedPokemon.sort((a, b) => {
    const nameA = a.slug;
    const nameB = b.slug;
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });
  sortedList = showedPokemon;
  if (sortedList.length < count) {
    for (i = 0; i < sortedList.length; i++) {
      showsortOutput();
    }
  } else {
    for (i = 0; i < count; i++) {
      showsortOutput();
    }
  }
  collapseBtn.style.display = "none";
  pokemonContainer.innerHTML = output;
}

function loadmoreafterSort() {
  output = "";
  // alert(count);
  count = count + 16;
  if (sortedList.length < count) {
    for (i = 0; i < sortedList.length; i++) {
      showsortOutput();
    }
    loadMoreBtn.style.display = "none";
  } else {
    for (i = 0; i < count; i++) {
      showsortOutput();
    }
  }

  pokemonContainer.innerHTML = output;
  collapseBtn.style.display = "block";
}

function collapseafterSort() {
  output = "";
  // sortFlag = 0;
  count = count - limit;
  for (i = 0; i < count; i++) {
    showsortOutput();
  }
  pokemonContainer.innerHTML = output;
  loadMoreBtn.style.display = "block";
  collapseBtn.style.display = "block";
}

function showsortOutput() {
  output += `
    <div class="pokemon">
            <img class="pokemonimage" src="${sortedList[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
            <p class="pokemonid">#${sortedList[i].number}</p>
            <p class="tittle">${sortedList[i].name}</p>
            <p class="type">Type: ${sortedList[i].type}</p>
            <div class="weightandheight">
            <p class= "heightPokemon">Height: ${sortedList[i].height}</p>
            <p class= "heightPokemon">Weight: ${sortedList[i].weight}</p>
            </div>
            <div class="heart"></div>
        </div>
        `;
}

// advanced search
advancedsearchshowBtn.addEventListener("click", function () {
  advancedsearchSection.style.display = "block";
  advancedsearchshowBtn.style.display = "none";
});

advancedsearchResetbtn.addEventListener("click", function () {
  resetAdvancedsearch.forEach(function (e) {
    if ((e.style.backgroundColor = "red")) {
      e.style.backgroundColor = "";
    }
  });
  advancedsearchtypearray = [];
  advancedsearchweaknessarray = [];
});

hideadvsearchBtn.addEventListener("click", function () {
  advancedsearchSection.style.display = "none";
  advancedsearchshowBtn.style.display = "block";
});

function selectAdvancesearchWeight() {
  if (
    advMininumweight.style.backgroundColor == "red" &&
    advAvgweight.style.backgroundColor == "red" &&
    advMaximumweight.style.backgroundColor == "red"
  ) {
    selectedWeight = "all";
  } else if (
    advMininumweight.style.backgroundColor == "" &&
    advAvgweight.style.backgroundColor == "" &&
    advMaximumweight.style.backgroundColor == ""
  ) {
    selectedWeight = "none";
  } else if (
    advMininumweight.style.backgroundColor == "red" &&
    advAvgweight.style.backgroundColor == "red"
  ) {
    selectedWeight = "minavg";
  } else if (
    advAvgweight.style.backgroundColor == "red" &&
    advMaximumweight.style.backgroundColor == "red"
  ) {
    selectedWeight = "avgmax";
  } else if (
    advMininumweight.style.backgroundColor == "red" &&
    advMaximumweight.style.backgroundColor == "red"
  ) {
    selectedWeight = "minmax";
  } else if (advMininumweight.style.backgroundColor == "red") {
    selectedWeight = "min";
  } else if (advAvgweight.style.backgroundColor == "red") {
    selectedWeight = "avg";
  } else if (advMaximumweight.style.backgroundColor == "red") {
    selectedWeight = "max";
  }
}

advMininumweight.addEventListener("click", function () {
  if (advMininumweight.style.backgroundColor == "red") {
    advMininumweight.style.backgroundColor = "";
  } else {
    advMininumweight.style.backgroundColor = "red";
  }
});
advAvgweight.addEventListener("click", function () {
  if (advAvgweight.style.backgroundColor == "red") {
    advAvgweight.style.backgroundColor = "";
  } else {
    advAvgweight.style.backgroundColor = "red";
  }
});
advMaximumweight.addEventListener("click", function () {
  if (advMaximumweight.style.backgroundColor == "red") {
    advMaximumweight.style.backgroundColor = "";
  } else {
    advMaximumweight.style.backgroundColor = "red";
  }
});

function selectAdvancesearchHeight() {
  if (
    advMininumheight.style.backgroundColor == "red" &&
    advAvgheight.style.backgroundColor == "red" &&
    advMaximumheight.style.backgroundColor == "red"
  ) {
    selectedHeight = "all";
  } else if (
    advMininumheight.style.backgroundColor == "" &&
    advAvgheight.style.backgroundColor == "" &&
    advMaximumheight.style.backgroundColor == ""
  ) {
    selectedHeight = "none";
  } else if (
    advMininumheight.style.backgroundColor == "red" &&
    advAvgheight.style.backgroundColor == "red"
  ) {
    selectedHeight = "minavg";
  } else if (
    advAvgheight.style.backgroundColor == "red" &&
    advMaximumheight.style.backgroundColor == "red"
  ) {
    selectedHeight = "avgmax";
  } else if (
    advMininumheight.style.backgroundColor == "red" &&
    advMaximumheight.style.backgroundColor == "red"
  ) {
    selectedHeight = "minmax";
  } else if (advMininumheight.style.backgroundColor == "red") {
    selectedHeight = "min";
  } else if (advAvgheight.style.backgroundColor == "red") {
    selectedHeight = "avg";
  } else if (advMaximumheight.style.backgroundColor == "red") {
    selectedHeight = "max";
  }
}
advMininumheight.addEventListener("click", function () {
  if (advMininumheight.style.backgroundColor == "red") {
    advMininumheight.style.backgroundColor = "";
  } else {
    advMininumheight.style.backgroundColor = "red";
  }
});
advAvgheight.addEventListener("click", function () {
  if (advAvgheight.style.backgroundColor == "red") {
    advAvgheight.style.backgroundColor = "";
  } else {
    advAvgheight.style.backgroundColor = "red";
  }
});
advMaximumheight.addEventListener("click", function () {
  if (advMaximumheight.style.backgroundColor == "red") {
    advMaximumheight.style.backgroundColor = "";
  } else {
    advMaximumheight.style.backgroundColor = "red";
  }
});
pokemonType.forEach((type) => {
  type.addEventListener("click", function () {
    // console.log(type);

    let value = type.getAttribute("data-value");

    if (type.style.backgroundColor == "red") {
      type.style.backgroundColor = "";
      for (let i = 0; i < advancedsearchtypearray.length; i++) {
        if (advancedsearchtypearray[i] === value) {
          advancedsearchtypearray.splice(i, 1);
        }
      }
      // console.log(advancedsearchtypearray);
    } else {
      type.style.backgroundColor = "red";
      advancedsearchtypearray.push(value);
      // console.log(advancedsearchtypearray);
    }
    // advancedsearchtypearray.push());
  });
});
pokemonWeakness.forEach((weakness) => {
  weakness.addEventListener("click", function () {
    // console.log(type);

    let value = weakness.getAttribute("data-value");

    if (weakness.style.backgroundColor == "red") {
      weakness.style.backgroundColor = "";
      for (let i = 0; i < advancedsearchweaknessarray.length; i++) {
        if (advancedsearchweaknessarray[i] === value) {
          advancedsearchweaknessarray.splice(i, 1);
        }
      }
      // console.log(advancedsearchweaknessarray);
    } else {
      weakness.style.backgroundColor = "red";
      advancedsearchweaknessarray.push(value);
      // console.log(advancedsearchweaknessarray);
    }
    // advancedsearchtypearray.push());
  });
});

advancedsearchBtn.addEventListener("click", function () {
  advancedSearchresults();
  loadmoreadvancedsearch = 1;
  issearched = 0;
  surpriseFlag = 0;
  sortFlag = 0;
  searchloadCount = 0;
  advancedsearchweaknessarray = [];
  pokemonContainer.scrollIntoView({ behavior: "smooth" });
});

function advancedSearch() {
  selectAdvancesearchHeight();
  selectAdvancesearchWeight();
  // console.log(advancedsearchtypearray);
  advancedsearchedList = [];
  referenceadvancedsearchedList = [];
  let selectedAbility =
    advabilitiesOptions.options[advabilitiesOptions.selectedIndex].text;
  // console.log(selectedAbility);
  if (selectedAbility == "All") {
    if (searchedList.length != 0) {
      for (i in searchedList) {
        advancedsearchedList.push(searchedList[i]);
      }
    } else {
      for (i in showedPokemon) {
        advancedsearchedList.push(showedPokemon[i]);
      }
    }
  } else {
    for (i = 0; i < showedPokemon.length; i++) {
      if (showedPokemon[i].abilities.includes(selectedAbility)) {
        advancedsearchedList.push(showedPokemon[i]);
      }
    }
  }
  if (selectedHeight == "all" || selectedHeight == "none") {
    // alert("NONE")
    advancedsearchedList;
  } else if (selectedHeight == "minavg") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].height < 500) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
    // console.log(advancedsearchedList);
  } else if (selectedHeight == "avgmax") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].height > 50) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
    // console.log(advancedsearchedList);
  } else if (selectedHeight == "minmax") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (
        referenceadvancedsearchedList[i].height < 50 ||
        referenceadvancedsearchedList[i].height > 500
      ) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedHeight == "min") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].height < 50) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedHeight == "avg") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (
        referenceadvancedsearchedList[i].height >= 50 &&
        referenceadvancedsearchedList[i].height <= 500
      ) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedHeight == "max") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].height > 500) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  }

  if (selectedWeight == "all" || selectedWeight == "none") {
    advancedsearchedList;
  } else if (selectedWeight == "minavg") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].weight < 500) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedWeight == "avgmax") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].weight > 50) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedWeight == "minmax") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (
        referenceadvancedsearchedList[i].weight < 50 ||
        referenceadvancedsearchedList[i].weight > 500
      ) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedWeight == "min") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].weight < 50) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedWeight == "avg") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (
        referenceadvancedsearchedList[i].weight >= 50 &&
        referenceadvancedsearchedList[i].weight <= 500
      ) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  } else if (selectedWeight == "max") {
    referenceadvancedsearchedList = advancedsearchedList;
    advancedsearchedList = [];
    for (i = 0; i < referenceadvancedsearchedList.length; i++) {
      if (referenceadvancedsearchedList[i].weight > 500) {
        advancedsearchedList.push(referenceadvancedsearchedList[i]);
      }
    }
  }
  // advanced search for type and weakness
  if (advancedsearchtypearray.length != 0) {
    referenceadvancedsearchedList = advancedsearchedList;
    // console.log(referenceadvancedsearchedList.length);
    advancedsearchedList = [];
    // console.log(advancedsearchtypearray);
    if (advancedsearchtypearray.length != 0) {
      for (let i = 0; i < referenceadvancedsearchedList.length; i++) {
        for (let k = 0; k < referenceadvancedsearchedList[i].type.length; k++) {
          if (
            advancedsearchtypearray.includes(
              referenceadvancedsearchedList[i].type[k]
            )
          ) {
            //  console.log(referenceadvancedsearchedList[i].type);
            advancedsearchedList.push(referenceadvancedsearchedList[i]);
          }
        }
      }
      advancedsearchedList = advancedsearchedList.filter((obj1) =>
        advancedsearchtypearray.every((obj2) => obj1.type.includes(obj2))
      );
      //  console.log(advancedsearchedList);
    }
  }
  // console.log(advancedsearchedList);
  if (advancedsearchweaknessarray.length > 0) {
    // console.log(advancedsearchedList);
    referenceadvancedsearchedList = advancedsearchedList;
    // console.log(referenceadvancedsearchedList);
    advancedsearchedList = [];
    if (advancedsearchweaknessarray.length != 0) {
      for (let i = 0; i < referenceadvancedsearchedList.length; i++) {
        for (
          let k = 0;
          k < referenceadvancedsearchedList[i].weakness.length;
          k++
        ) {
          if (
            advancedsearchweaknessarray.includes(
              referenceadvancedsearchedList[i].weakness[k]
            )
          ) {
            // console.log("done");
            // alert("done")
            // console.log(referenceadvancedsearchedList[i]);
            advancedsearchedList.push(referenceadvancedsearchedList[i]);
          }
        }
      }

      // console.log(advancedsearchedList);
      advancedsearchedList = advancedsearchedList.filter((obj1) =>
        advancedsearchweaknessarray.every((obj2) =>
          obj1.weakness.includes(obj2)
        )
      );
    }
    // console.log(advancedsearchedList);
  }
  let temp = [...new Set(advancedsearchedList)];
  advancedsearchedList = [];
  advancedsearchedList = temp;
  // console.log(advancedsearchedList);
  return advancedsearchedList;
}

function advancedSearchresults() {
  advancedSearch();
  //   console.log(advancedsearchedList);
  output = "";
  if (advancedsearchedList == "") {
    errormessage();
  }
  if (advancedsearchedList.length < count) {
    for (i = 0; i < advancedsearchedList.length; i++) {
      advancedsearchOutput();
    }
    pokemonContainer.innerHTML = output;
    loadMoreBtn.style.display = "none";
  } else {
    for (i = 0; i < count; i++) {
      advancedsearchOutput();
    }
    pokemonContainer.innerHTML = output;
    loadMoreBtn.style.display = "block";
  }
}

function loadmoreafteradvancedSearch() {
  // console.log(count);
  // if (count == 16) {
  //     count = count + 16;
  // }
  count = count + 16;
  // console.log(count);
  // console.log(count);
  output = "";
  if (advancedsearchedList.length < count) {
    for (i = 0; i < advancedsearchedList.length; i++) {
      advancedsearchOutput();
    }

    collapseBtn.style.display = "block";
    loadMoreBtn.style.display = "none";
  } else {
    for (i = 0; i < count; i++) {
      advancedsearchOutput();
    }

    collapseBtn.style.display = "block";
    loadMoreBtn.style.display = "block";
  }
  // console.log(count);
  pokemonContainer.innerHTML = output;
}

function collapseafteradvancedSearch() {
  output = " ";
  if (count === 32) {
    loadMoreBtn.style.display = "block";
  }
  // console.log(count);
  count = count - limit;
  if (count === 16) {
    collapseBtn.style.display = "none";
  }
  for (i = 0; i < count; i++) {
    advancedsearchOutput();
  }
  pokemonContainer.innerHTML = output;
  pokemonContainer.innerHTML = output;
}

function advancedsearchOutput() {
  output += `
                        <div class="pokemon" >
                                <img class="pokemonimage" src="${advancedsearchedList[i].ThumbnailImage}" alt="${icon.ThumbnailImage}">
                                <p class="pokemonid">#${advancedsearchedList[i].number}</p>
                                <p class="tittle">${advancedsearchedList[i].name}</p>
                                <p class="type">Type:${advancedsearchedList[i].type}</p>
                                <div class="weightandheight">
                                <p class= "heightPokemon">Height: ${advancedsearchedList[i].height}</p>
                                <p class= "heightPokemon">Weight: ${advancedsearchedList[i].weight}</p>
                                </div>
                                <div class="heart"></div>
                           </div>
                            `;
}

pokemonContainer.addEventListener("click", function (event) {
  // Check if the clicked element is a p tag inside a div with the class "pokemon"
  const clickedPokemonName = event.target.closest(".pokemon");

  if (event.target.classList.contains("heart")) {
    // Change the background color to red
    event.target.classList.toggle("newColor");

    // console.log("added");
    var currentColor = window.getComputedStyle(event.target).backgroundColor;
    console.log(currentColor);

    pokemonId = clickedPokemonName.querySelector(".pokemonid").textContent;
    pokemonId = pokemonId.slice(1);
    console.log("Clicked Pokemon id:", pokemonId);
    const foundPokemon = icon.find((pokemon) => pokemon.id == pokemonId);
    if (clickedPokemonName && currentColor == "rgb(255, 0, 0)") {
      if (foundPokemon) {
        // console.log('Found Pokemon:', foundPokemon);
        foundPokemon.color = "red";
        console.log(foundPokemon);
        fetch("/pushLikedpokemon", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foundPokemon),
        })
          .then((response) => response.text())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));
      } else {
        console.log("Pokemon with ID", pokemonId, "not found.");
      }
    } else {
      console.log("removed");
      console.log("pokeon id to delete", foundPokemon.id);
      fetch("/deletePokemon", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: foundPokemon.id }),
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  }
});

function showlikedPokemon() {
  fetch("/getlikedArray")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.length);

      if (data.length != 0) {
        output = " ";
        for (i = 0; i < data.length; i++) {
          output += `
      <div class="pokemon" >
      
              <img class="pokemonimage" src="${data[i].ThumbnailImage}" alt="${data.ThumbnailImage}">
              <a class="deleteIcon" onclick="deletePokemon(event)" >&times;</a>
              <p class="pokemonid">#${data[i].number}</p>
              <p class="tittle">${data[i].name}</p>
              <p class="type">Type:${data[i].type}</p>
              <div class="weightandheight">
              <p class= "heightPokemon">Height: ${data[i].height}</p>
              <p class= "heightPokemon">Weight: ${data[i].weight}</p>
              </div>
         </div>
          `;
        }
        contentsectionTop.style.display = "none";
        collapseBtn.style.display = "none";
        loadMoreBtn.style.display = "none";
        likedPokemonsection.style.display = "block";
        HomepageBtn.style.display = "block";
        pokemonContainer.innerHTML = output;
      }
      console.log("liked array from", data);
    });
}

function deletePokemon(event) {
  const pokemonDetails = event.target.closest(".pokemon");
  // console.log(pokemonDetails);

  pokemonId = pokemonDetails.querySelector(".pokemonid").textContent;
  // console.log(pokemonId);
  pokemonId = pokemonId.slice(1);

  const pokemonToDelete = icon.find((pokemon) => pokemon.id == pokemonId);

  fetch("/deletePokemon", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: pokemonToDelete.id }),
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));

  // console.log(pokemonToDelete);
  fetch("/getlikedArray")
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        output = "";

        displayFirstElements();
        contentsectionTop.style.display = "block";
        HomepageBtn.style.display = "none";
        loadMoreBtn.style.display = "block";
        likedPokemonsection.style.display = "none";
      } else {
        showlikedPokemon();
      }
    });
}

HomepageBtn.addEventListener("click", function () {
  output = "";

  displayFirstElements();
  contentsectionTop.style.display = "block";
  HomepageBtn.style.display = "none";
  loadMoreBtn.style.display = "block";
  likedPokemonsection.style.display = "none";
});

logOutbutton.addEventListener("click", function () {
  localStorage.setItem("authenticatedUser", "denied");

  window.location.href = "/login";
});

const authenticatedUser = localStorage.getItem("authenticatedUser");
if (authenticatedUser != "granted") {
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", function () {

  // replacethelikedPokemons();
  fetch("/getUsername")
    .then((response) => response.json())
    .then((data) => {
      // console.log("data got", data);
      const loginusername = data.loginusername;
      const loginuseremail = data.loginuseremail;
      welcomeUser.textContent += loginusername;
      userName.textContent += loginusername;
      userEmail.innerHTML += loginuseremail;
    })
    .catch((error) => console.error("Error:", error));
});

pokemonContainer.addEventListener("dblclick", function (event) {
  // Check if the clicked element is a p tag inside a div with the class "pokemon"
  const clickedPokemonName = event.target.closest(".pokemon");
  pokemonId = clickedPokemonName.querySelector(".pokemonid").textContent;
  pokemonId = pokemonId.slice(1);
  // console.log("Clicked Pokemon id:", pokemonId);
  const foundPokemon = icon.find((pokemon) => pokemon.id == pokemonId);
  console.log(foundPokemon);
  eachoutput += `
  <div class="header-pokemon">
  <h2 id="pokemon-name">${foundPokemon.name}</h2>
  <h2 class="closePokemon" onclick="closePokemonAttributes()" >&times;</h2>
  </div>
  <div class="pokemon-details">
      <div class="img-section">
          <img class="pokemonimg" src="${foundPokemon.ThumbnailImage}" alt="${foundPokemon.ThumbnailImage}">
      </div>
      <div class="info-section">
          <h3 class="pokemon-id">Id: #${foundPokemon.number}</h3>
          <h3 class="height">Height: ${foundPokemon.height}</h3>
          <h3 class="abilities">Abilities: ${foundPokemon.abilities}</h3>
          <h3 class="weight">Weight: ${foundPokemon.weight} lbs</h3>
          <h3 class="pokemontype">Type: ${foundPokemon.type}</h3>
          <h3 class="Weakness">Weakness: ${foundPokemon.weakness}</h3>
        

      </div>                
      `;
  contentsection.style.display = "none";

  pokemonAttributesContainer.innerHTML = eachoutput;
  pokemonAttributesContainer.style.display = "block";
});

function closePokemonAttributes() {
  contentsection.style.display = "block";
  pokemonAttributesContainer.style.display = "none";
  eachoutput = "";
}

// function changeUserPassword(){

//   contentsection.style.display = "none";
//   resetPasswordSection.style.display = "block"

// }

// function getValuenNewpassword(){
//   contentsection.style.display = "block";
//   resetPasswordSection.style.display = "none";

// }


// function replacethelikedPokemons(){
//   fetch("/getlikedArray")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         datafromdb = data;
//         for (let i = 0; i < icon.length; i++) {
//           for (let j = 0; j < datafromdb.length; j++) {
//               if (icon[i].name === datafromdb[j].name) {
//                  icon[i] = datafromdb[j];

//                  console.log("after changing",icon[i].color);
//                   break; // Break the inner loop once a match is found for the current element in array1
//               }
//           }
//       }
//       });
// }