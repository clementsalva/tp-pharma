<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Categorie } from '../Categorie.js'

const emit = defineEmits(['medicamentAjoute'])
const listeCategorie = reactive([])

const nom = ref('')
const fournisseur = ref('')
const imageURL = ref('')
const unitesEnStock = ref(0)
const prixUnitaire = ref(0)
const quantiteParUnite = ref('')
const selectedCat = ref('')
const indisponible = ref(false)

onMounted(() => {
    fetch('https://springajax.herokuapp.com/api/categories')
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
        fournisseur: fournisseur.value,
        imageURL: imageURL.value || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        unitesEnStock: parseInt(unitesEnStock.value) || 0,
        prixUnitaire: parseFloat(prixUnitaire.value) || 0,
        quantiteParUnite: quantiteParUnite.value,
        idCategorie: selectedCat.value,
        indisponible: indisponible.value
    })
    nom.value = ''; fournisseur.value = ''; imageURL.value = ''
    unitesEnStock.value = 0; prixUnitaire.value = 0
    quantiteParUnite.value = ''; selectedCat.value = ''; indisponible.value = false
}
</script>

<template>
    <div class="form-container">
        <h2>Ajouter un médicament</h2>
        <form @submit.prevent="ajouter">
            <input v-model="nom" type="text" placeholder="Nom" required />
            <input v-model="fournisseur" type="text" placeholder="Fournisseur" />
            <input v-model="imageURL" type="text" placeholder="URL de l'image" />
            <select v-model="selectedCat" required>
                <option value="" disabled>Catégorie</option>
                <option v-for="cat in listeCategorie" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
            </select>
            <input v-model="prixUnitaire" type="number" step="0.01" placeholder="Prix (€)" />
            <input v-model="unitesEnStock" type="number" placeholder="Stock" />
            <input v-model="quantiteParUnite" type="text" placeholder="Quantité par boîte" />
            <div class="checkbox">
                <input type="checkbox" id="indispo" v-model="indisponible" />
                <label for="indispo">Indisponible</label>
            </div>
            <button type="submit">Ajouter</button>
        </form>
    </div>
</template>

<style scoped>
.form-container {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 20px;
}

h2 {
    margin-bottom: 15px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
}

.checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>