let loadedPokemon = [];
let amountLoadedPokemon = 40
let filteredPokemons = [];
let currentPokemonIndex = 0;


async function loadPokemon(){
    for (let i = 1; i <= amountLoadedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);  
        let currentPokemon = await response.json();
       loadedPokemon.push(currentPokemon);    
    }
     renderPokemonInfo();
}


function renderPokemonInfo(){
    let singlePokemon = document.getElementById('content');
    singlePokemon.innerHTML = '';
    for (let j = 0; j < loadedPokemon.length; j++) {
        const pokemon = loadedPokemon[j];
        singlePokemon.innerHTML += getPokemonCardHtml(pokemon, j)
        addTypes(pokemon);
    }  
}

    
function getPokemonCardHtml(currentPokemon, i){
    let pokemonCardHtml = `
    <div id = "pkm-card${currentPokemon.id}" class="pkm-card" onclick="openDialog(${i})">
        <div class="pkm-card-up">
            <h2>${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h2>
            <p>${"#" + ("00" +currentPokemon['id']).slice(-3)}</p>
        </div>
        <div class="pkm-card-down">
        <div class="pokemon-types">`;

    for (let x = 0; x < currentPokemon['types'].length; x++) {
        pokemonCardHtml += `<div class="type" id="pokemon-type-${x}-${currentPokemon.id}"></div>`;
    }
    pokemonCardHtml += `</div>
    <img src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}">
    </div>`;
    return pokemonCardHtml;
}


function addTypes(currentPokemon){
    for (let x = 0; x < currentPokemon['types'].length; x++) {
        const type = currentPokemon['types'][x]['type']['name'];
        document.getElementById(`pokemon-type-${x}-${currentPokemon.id}`).innerHTML += `${type}`;

        let typeElement = document.getElementById(`pokemon-type-0-${currentPokemon.id}`);
        let typename = typeElement ? typeElement.textContent.trim().toLowerCase() : null;
        let bgColorClass = `bg-${typename}`;
        document.getElementById(`pkm-card${currentPokemon.id}`).classList.add(bgColorClass);
    }  
}


async function loadMorePokemon() {
    document.body.style.cursor='progress';
    let lastAmount = loadedPokemon.length;
    amountLoadedPokemon += 10;
    for (let i = lastAmount + 1; i <= amountLoadedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        loadedPokemon.push(currentPokemon);
    }
    await renderPokemonInfo();
    document.body.style.cursor='default';
}


function loadStats(i){
    const ctx = document.getElementById('myChart');
    let pokemonStat = loadedPokemon[i].stats;
    let hp = pokemonStat[0]['base_stat'];
    let attack = pokemonStat[1]['base_stat'];
    let defense = pokemonStat[2]['base_stat'];
    let special_attack = pokemonStat[3]['base_stat'];
    let special_defense = pokemonStat[4]['base_stat'];
    let speed = pokemonStat[5]['base_stat'];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'],
      datasets: [{
        label: 'Stats',
        data: [hp, attack, defense, special_attack, special_defense, speed],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


function openDialog(i){
    currentPokemonIndex = i;
    document.getElementById('popupBg').classList.remove('d-none');
    renderSelectedPok(i);
}


function renderSelectedPok(i){
    checkPokemonIndex();
    
    let popup = document.getElementById('popupContent');
    let selectedPok = loadedPokemon[i];

    popup.innerHTML = /*html*/`
    <section id="curved" class="curved">
    <h1> ${selectedPok['name'].charAt(0).toUpperCase() + selectedPok['name'].slice(1)} </h1>
    <div class="type">${selectedPok['types'][0]['type']['name']}</div>
    <p># ${("00" +selectedPok['id']).slice(-3)}</p>
    <img src= "${selectedPok.sprites.other['official-artwork']['front_default']}" alt="">
    </section>
    <div class="stats">
    <canvas class="myChart" id="myChart"></canvas>
    </div>
`; 
loadStats(i);
let selectedPokType = selectedPok['types'][0]['type']['name'];
let bgColorClass = `bg-${selectedPokType}`;
document.getElementById(`curved`).classList.add(bgColorClass);
} 


function closeDialog() {
    document.getElementById('popupBg').classList.add('d-none');
}


function doNotClose(event){
    event.stopPropagation();
}


function loadNextPok(){
    if (currentPokemonIndex < loadedPokemon.length){
    currentPokemonIndex++;
    event.stopPropagation();
    renderSelectedPok(currentPokemonIndex);
    checkPokemonIndex();
}
}


function loadPreviousPok(){
    if (currentPokemonIndex > 0){
    currentPokemonIndex--
    event.stopPropagation();
    renderSelectedPok(currentPokemonIndex);}
    checkPokemonIndex()
}


function checkPokemonIndex(){
    if (currentPokemonIndex === 0){
        document.getElementById('back').classList.add('d-none');
    } else {
        document.getElementById('back').classList.remove('d-none');
    }

    if (currentPokemonIndex + 1 === loadedPokemon.length){
        document.getElementById('next').classList.add('d-none');
    } else{
        document.getElementById('next').classList.remove('d-none');
    }
    
}


function checkInputLength(){
    let input = document.getElementById('search').value;
    let loadMoreButton = document.getElementById('load_more');
    if (input.length >= 3){
        filterPokemons();
        loadMoreButton.style.display = 'none';
    } else if (input.length < 3 && input.length >= 0){
        renderPokemonInfo();
        loadMoreButton.style.display = 'block';
    }
}


function filterPokemons(){
    let search = document.getElementById('search').value.toLowerCase();
    compareNames(search);
}


function compareNames(search){
    let content = document.getElementById('content');
    let pokemons = content.getElementsByClassName('pkm-card');
   
    for (let i = 0; i < pokemons.length; i++) {
        let pokemonName = pokemons[i].querySelector("h2").textContent.toLowerCase();
        if (pokemonName.includes(search)){
            pokemons[i].style.display = 'block';
        } else {
            pokemons[i].style.display = 'none';
        }
    }
}
