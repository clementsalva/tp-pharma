<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { Medicament } from '../Medicament.js'

const urlBase = 'https://springajax.herokuapp.com/api/medicaments'
const listeMed = reactive([]);

const props = defineProps({ idCat: String, refreshKey: Number })

async function getMedicaments(url = urlBase) {
    const response = await fetch(`${url}?size=200`)
    const dataJSON = await response.json()
    listeMed.splice(0, listeMed.length)
    for (let m of dataJSON._embedded.medicaments) {
        let medicament = new Medicament(m)
        fetch(medicament.categorieURL)
            .then(r => r.json())
            .then(catData => {
                medicament.categorie = catData.libelle
                medicament.description = catData.description
                listeMed.push(medicament)
            })
    }
}

function modifier(med) {
    med.isEditing = !med.isEditing
}

async function enregistrer(med) {
    await fetch(`${urlBase}/${med.reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nom: med.nom,
            prixUnitaire: med.prixUnitaire,
            quantiteParUnite: med.quantiteParUnite
        })
    })
    med.isEditing = false
}

async function supprimer(med) {
    if (!confirm("Supprimer ce médicament ?")) return
    const response = await fetch(`${urlBase}/${med.reference}`, { method: 'DELETE' })
    if (response.ok) listeMed.splice(listeMed.indexOf(med), 1)
}

async function plus(med) {
    med.unitesEnStock++
    await fetch(`${urlBase}/${med.reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitesEnStock: med.unitesEnStock })
    })
}

async function moins(med) {
    if (med.unitesEnStock <= 0) return
    med.unitesEnStock--
    await fetch(`${urlBase}/${med.reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitesEnStock: med.unitesEnStock })
    })
}

watch(() => props.idCat, (nouvelId) => {
    const url = nouvelId
        ? `https://springajax.herokuapp.com/api/categories/${nouvelId}/medicaments`
        : urlBase
    getMedicaments(url)
})

watch(() => props.refreshKey, () => {
    getMedicaments(urlBase)
})

onMounted(() => {
    getMedicaments()
})
</script>

<template>
    <h1>Liste des médicaments</h1>
    <div class="container">
        <div v-for="med in listeMed" :key="med.reference" class="card">
            <div class="medic-header">
                <input v-if="med.isEditing" v-model="med._nom" class="edit-input-title" />
                <h2 v-else>{{ med.nom }}</h2>
            </div>

            <img :src="med.imageURL" :alt="med.nom" class="card-image" />
            <div class="info">
                <div v-if="med.isEditing">
                    <label>Format :</label>
                    <input v-model="med._quantiteParUnite" class="edit-input" />
                    <label>Prix (€) :</label>
                    <input v-model="med._prixUnitaire" type="number" step="0.01" class="edit-input" />
                </div>
                <div v-else>
                    <p>Catégorie : {{ med.categorie || '...' }}</p>
                    <p>Description : {{ med.description || '...' }}</p>
                    <p>Quantité par unité : {{ med.quantiteParUnite }}</p>
                    <p>Prix unitaire : {{ med.prixUnitaire }}€</p>
                    <p>Quantité en stock : {{ med.unitesEnStock }}</p>
                </div>
                <div class="stock-button">
                    <button @click="moins(med)">-</button>
                    <span class="valeur-stock">{{ med.unitesEnStock }}</span>
                    <button @click="plus(med)">+</button>
                </div>
            </div>

            <div class="buttons">
                <button v-if="!med.isEditing" @click="supprimer(med)">Supprimer</button>
                <button v-if="!med.isEditing" @click="modifier(med)">Modifier</button>
                <button v-else @click="enregistrer(med)">Enregistrer</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
body {
    background-color: #e6ffe6;
    /* vert très clair */
    margin: 0;
    font-family: Arial, sans-serif;
}

/* ===== HEADER ===== */
.header {
    background-color: rgb(0, 255, 0);
    /* vert vif */
    color: white;
    padding: 20px;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.header h1 {
    margin: 0 0 10px 0;
}

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
    grid-template-columns: repeat(4, 1fr);
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
    min-height: 350px;
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
    margin: 5px 0;
}

/* ===== BOUTONS ACTION ===== */
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
    border: none;
    color: white;
    font-size: 14px;
}

/* Modifier */
.buttons button:nth-child(2) {
    background-color: #f4a261;
    /* orange doux */
}

.buttons button:nth-child(2):hover {
    background-color: #e76f51;
}

/* Supprimer */
.buttons button:nth-child(1) {
    background-color: #ff6b6b;
    /* rouge clair */
}

.buttons button:nth-child(1):hover {
    background-color: #e63946;
}

/* Enregistrer */
.buttons button:nth-child(3) {
    background-color: #51cf66;
    /* vert clair */
}

.buttons button:nth-child(3):hover {
    background-color: #2b8a3e;
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
    /* gris */
}

.stock-button button {
    background: transparent;
    color: white;
    font-size: 18px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.2s;
    border: none;
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

/* ===== EDIT INPUT ===== */
.edit-input-title {
    width: 100%;
    padding: 10px 15px;
    font-size: 1.1rem;
    font-weight: bold;
    border: none;
    border-bottom: 2px solid #007bff;
    outline: none;
}

.edit-input {
    width: 100%;
    padding: 4px;
    margin-top: 4px;
    margin-bottom: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>