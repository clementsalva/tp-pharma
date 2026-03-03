<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Categorie } from '../Categorie.js'

const emit = defineEmits(['medicamentAjoute'])
const listeCategorie = reactive([])

const nom = ref('')
const fournisseur = ref('')
const unitesEnStock = ref(0)
const prixUnitaire = ref(0)
const quantiteParUnite = ref('')
const selectedCat = ref('')
const indisponible = ref(false)

onMounted(() => {
    fetch('https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/categories')
        .then(r => r.json())
        .then(dataJSON => {
            for (let elt of dataJSON._embedded.categories) {
                listeCategorie.push(new Categorie(elt.code, elt.libelle, elt.description))
            }
        })
})

function ajouter() {
    emit('medicamentAjoute', {
        nom: nom.value,
        fournisseur: fournisseur.value || '',
        imageURL: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        unitesEnStock: parseInt(unitesEnStock.value) || 0,
        prixUnitaire: parseFloat(prixUnitaire.value) || 0,
        quantiteParUnite: quantiteParUnite.value || '',
        idCategorie: selectedCat.value,
        indisponible: indisponible.value
    })
    nom.value = ''; fournisseur.value = ''
    unitesEnStock.value = 0; prixUnitaire.value = 0
    quantiteParUnite.value = ''; selectedCat.value = ''; indisponible.value = false
}
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="auto">
                <v-card width="300" border="dashed" rounded="lg" elevation="2">
                    <v-text-field v-model="nom" placeholder="Nom du médicament" variant="underlined" class="px-4 pt-2"
                        required hide-details />

                    <v-img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400" height="200"
                        cover />

                    <v-card-text>
                        <v-select v-model="selectedCat" :items="listeCategorie" item-title="nom" item-value="id"
                            placeholder="Catégorie" variant="outlined" density="compact" required />
                        <v-text-field v-model="fournisseur" placeholder="Fournisseur" variant="outlined"
                            density="compact" />
                        <v-text-field v-model="prixUnitaire" placeholder="Prix (€)" type="number" step="0.01"
                            variant="outlined" density="compact" />
                        <v-text-field v-model="unitesEnStock" placeholder="Stock" type="number" variant="outlined"
                            density="compact" />
                        <v-text-field v-model="quantiteParUnite" placeholder="Quantité par boîte" variant="outlined"
                            density="compact" />
                        <v-checkbox v-model="indisponible" label="Indisponible" density="compact" hide-details />
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-btn color="#007bff" variant="flat" @click.prevent="ajouter">Ajouter</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>