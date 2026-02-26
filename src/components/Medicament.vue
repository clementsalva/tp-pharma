<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Medicament } from '../Medicament.js';
const stock = ref(10)

function modifier() {
    console.log("Modifier")
}
function supprimer() {
    console.log("supp")
}
function plus(med) {
    med.unitesEnStock++;
}
function moins(med) {
    med.unitesEnStock--;
}
const listeMed = reactive([]);
function getMedicaments() {
    const url = "https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/medicaments"
    const fetchOptions = { method: "GET" };
    fetch(url, fetchOptions)
        .then((response) => {
            return response.json();
        })
        .then((dataJSON) => {
            let med = dataJSON._embedded.medicaments
            console.log(med);
            for (let m of med) {
                listeMed.push(new Medicament(m))
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
onMounted(() => {
    getMedicaments();
});
</script>
<template>
    <header class="header">
        <h1>Ma pharmacie</h1>
        <div class="header-controls">
            <input type="text" placeholder="Rechercher un médicament" class="search-bar" />
            <select class="filter">
                <option value="">Filtrer par catégorie</option>
                <option value="antalgique">Antalgiques</option>
                <option value="vitamine">Vitamines</option>
                <!-- Ajoute d'autres catégories si nécessaire -->
            </select>
        </div>
    </header>
    <div class="container">
        <div v-for="med in listeMed" :key="med.reference" class="card">
            <h2>{{ med.nom }}</h2>
            <img :src="med.imageURL" :alt="med.nom" class="card-image" />
            <div class="info">
                <p>Quantité par unité : {{ med.quantiteParUnite }}</p>
                <p>Prix unitaire : {{ med.prixUnitaire }}€</p>
            </div>
            <div class="buttons">
                <button @click="modifier">Modifier</button>
                <button @click="supprimer">Supprimer</button>
            </div>
            <div class="stock-button">
                <button @click="moins(med)">-</button>
                <span class="valeur-stock">{{ med.unitesEnStock }}</span>
                <button @click="plus(med)">+</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
body {
    background-color: green;
    /* vert très clair */
    margin: 0;
    font-family: Arial, sans-serif;
}

.header {
    background-color: rgb(0, 255, 0);
    color: white;
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* prend toute la largeur */
    box-sizing: border-box;
}

.header h1 {
    margin: 0 0 10px 0;
}

/* Barre de recherche + filtre */
.header-controls {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 800px;
}

.search-bar {
    flex: 2;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    font-size: 16px;
}

.filter {
    flex: 1;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    font-size: 16px;
}

/* ===== GLOBAL BUTTON FIX ===== */

button {
    outline: none;
    border: none;
}

button:focus {
    outline: none;
    box-shadow: none;
}

/* ===== CONTAINER (4 CARTES PAR LIGNE) ===== */

.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 20px;
}

/* ===== CARD ===== */

.card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background-color: white;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    min-width: 350px;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.card h2 {
    padding: 15px;
    margin: 0;
}

/* ===== IMAGE ===== */

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
}

/* ===== INFO ===== */

.info {
    padding: 15px;
}

.info p {
    margin: 6px 0;
}

/* ===== ACTION BUTTONS ===== */

.buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 15px;
}

.buttons button {
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s;
}

/* Modifier */
.buttons button:first-child {
    background-color: #f4a261;
    color: white;
}

.buttons button:first-child:hover {
    background-color: #e76f51;
}

/* Supprimer */
.buttons button:last-child {
    background-color: #ff6b6b;
    color: white;
}

.buttons button:last-child:hover {
    background-color: #e63946;
}

/* ===== STOCK BUTTON ===== */

.stock-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 15px auto 20px;
    border-radius: 30px;
    overflow: hidden;
    background-color: #6c757d;
}

.stock-button button {
    background: transparent;
    color: white;
    font-size: 18px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
}

.stock-button button:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.valeur-stock {
    color: white;
    font-weight: bold;
    padding: 8px 20px;
    font-size: 16px;
}
</style>