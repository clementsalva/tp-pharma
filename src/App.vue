<script setup>
import Medicament from './components/Medicament.vue'
import Recherche from './components/Recherche.vue'
import MedicamentForm from './components/MedicamentForm.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const idCatSelectionnee = ref("")
const refreshKey = ref(0)
const showForm = ref(false)
const showScrollBtn = ref(false)

function filtrer(id) {
  idCatSelectionnee.value = id
}

function toggleAjouter() {
  showForm.value = !showForm.value
}

async function medicamentAjoute(data) {
  await fetch('https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/medicaments', {
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
  <v-app>
    <v-app-bar flat color="white">
      <v-app-bar-title>
        <span style="color: green; font-weight: bold;">Pharmacie SALVA</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main style="background-color: #e6ffe6;">
      <Recherche @filtrerCat="filtrer" @toggleAjouter="toggleAjouter" />
      <MedicamentForm v-if="showForm" @medicamentAjoute="medicamentAjoute" />
      <Medicament :idCat="idCatSelectionnee" :refreshKey="refreshKey" />
    </v-main>

    <v-btn v-if="showScrollBtn" icon color="#007bff" style="position: fixed; bottom: 30px; right: 30px;"
      @click="scrollTop">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-app>
</template>

<style>
body {
  background-color: #e6ffe6;
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>