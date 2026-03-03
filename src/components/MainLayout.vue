<script setup>
import Medicament from './Medicament.vue'
import Header from './Header.vue'
import Recherche from './Recherche.vue'
import MedicamentForm from './MedicamentForm.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const idCatSelectionnee = ref("")
const refreshKey = ref(0)
const showForm = ref(false)
const showScrollBtn = ref(false)
const searchText = ref("")

function filtrer(id) {
    idCatSelectionnee.value = id
}

function toggleAjouter() {
    showForm.value = !showForm.value
}

function handleSearch(text) {
    searchText.value = text
}

async function medicamentAjoute(data) {
    console.log("data envoyée :", data)
    try {
        const response = await fetch('https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/medicaments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: data.nom,
                fournisseur: data.fournisseur,
                imageURL: data.imageURL,
                unitesEnStock: data.unitesEnStock,
                prixUnitaire: data.prixUnitaire,
                quantiteParUnite: data.quantiteParUnite,
                indisponible: data.indisponible,
                categorie: `https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/categories/${data.idCategorie}`
            })
        })
        const result = await response.json()
        console.log("status :", response.status)
        console.log("response :", result)
    } catch (e) {
        console.error("Erreur :", e)
    }
    refreshKey.value++
    showForm.value = false
}

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
    showScrollBtn.value = window.scrollY > 300
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
    <div>
        <Header />

        <v-main style="background-color: #e6ffe6;">
            <Recherche @filtrerCat="filtrer" @toggleAjouter="toggleAjouter" @rechercher="handleSearch" />
            <MedicamentForm v-if="showForm" @medicamentAjoute="medicamentAjoute" />
            <Medicament :idCat="idCatSelectionnee" :refreshKey="refreshKey" :searchText="searchText" />
        </v-main>

        <v-btn v-if="showScrollBtn" icon color="#007bff" style="position: fixed; bottom: 30px; right: 30px;"
            @click="scrollTop">
            <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
    </div>
</template>
