<script setup>
import Medicament from './components/Medicament.vue'
import Recherche from './components/Recherche.vue'
import MedicamentForm from './components/MedicamentForm.vue'
import { ref } from 'vue'

const idCatSelectionnee = ref("")
const refreshKey = ref(0)
const showForm = ref(false)

function filtrer(id) {
  idCatSelectionnee.value = id
}

function toggleAjouter() {
  showForm.value = !showForm.value
}

function medicamentAjoute() {
  refreshKey.value++
  showForm.value = false
}
</script>

<template>
  <div class="header">
    <h1>Pharmacie</h1>
  </div>
  <Recherche @filtrerCat="filtrer" @toggleAjouter="toggleAjouter" />
  <MedicamentForm v-if="showForm" @medicamentAjoute="medicamentAjoute" />
  <Medicament :idCat="idCatSelectionnee" :refreshKey="refreshKey" />
</template>