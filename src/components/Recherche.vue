<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { Categorie } from '../Categorie.js'

const emit = defineEmits(['filtrerCat', 'toggleAjouter', 'rechercher'])
const listeCategorie = reactive([])
const selectedCat = ref("")
const searchText = ref("")

onMounted(() => {
    fetch('https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/categories')
        .then(r => r.json())
        .then(dataJSON => {
            for (let elt of dataJSON._embedded.categories) {
                listeCategorie.push(new Categorie(elt.code, elt.libelle, elt.description))
            }
        })
})

function envoyerChoix() {
    emit('filtrerCat', selectedCat.value)
}

watch(searchText, (val) => {
    emit('rechercher', val)
})
</script>

<template>
    <v-card flat rounded="lg" elevation="2" class="ma-5 pa-3" style="position: sticky; top: 70px; z-index: 100;">
        <v-row align="center" justify="space-between">
            <v-col cols="auto">
                <v-text-field v-model="searchText" placeholder="Rechercher..." variant="outlined" density="compact"
                    hide-details rounded style="width: 250px;" />
            </v-col>

            <v-col cols="auto">
                <v-btn color="#51cf66" variant="flat" @click="emit('toggleAjouter')">
                    Ajouter
                </v-btn>
            </v-col>

            <v-col cols="auto">
                <v-select v-model="selectedCat" :items="listeCategorie" item-title="nom" item-value="id"
                    placeholder="Toutes les catégories" variant="outlined" density="compact" hide-details
                    style="min-width: 250px;" @update:modelValue="envoyerChoix" clearable />
            </v-col>
        </v-row>
    </v-card>
</template>