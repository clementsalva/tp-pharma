<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { Medicament } from '../Medicament.js'

const urlBase = 'https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/medicaments'
const listeMed = reactive([]);

const props = defineProps({ idCat: String, refreshKey: Number, searchText: String })

const listeMedFiltre = computed(() => {
    if (!props.searchText) return listeMed
    return listeMed.filter(m => m.nom.toLowerCase().includes(props.searchText.toLowerCase()))
})

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
    if (!med.isEditing) {
        med._nom = med.nom
        med._quantiteParUnite = med.quantiteParUnite
        med._prixUnitaire = med.prixUnitaire
    }
    med.isEditing = !med.isEditing
}

function annuler(med) {
    med.isEditing = false
}

async function enregistrer(med) {
    await fetch(`${urlBase}/${med.reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nom: med._nom,
            prixUnitaire: med._prixUnitaire,
            quantiteParUnite: med._quantiteParUnite
        })
    })
    med.nom = med._nom
    med.prixUnitaire = med._prixUnitaire
    med.quantiteParUnite = med._quantiteParUnite
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
        ? `https://occupational-bess-clementsalva-f82c3d12.koyeb.app/api/categories/${nouvelId}/medicaments`
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
    <v-container fluid>
        <v-row>
            <v-col v-for="med in listeMedFiltre" :key="med.reference" cols="3">
                <v-card rounded="lg" elevation="2" class="card">
                    <v-text-field v-if="med.isEditing" v-model="med._nom" variant="underlined" class="px-4 pt-2" />
                    <v-card-title v-else class="card-title">{{ med.nom }}</v-card-title>

                    <v-img :src="med.imageURL" :alt="med.nom" height="250" cover />

                    <div class="stock-button">
                        <button @click="moins(med)">-</button>
                        <span class="valeur-stock">{{ med.unitesEnStock }}</span>
                        <button @click="plus(med)">+</button>
                    </div>

                    <v-card-text>
                        <div v-if="med.isEditing">
                            <label>Format :</label>
                            <v-text-field v-model="med._quantiteParUnite" variant="outlined" density="compact" />
                            <label>Prix (€) :</label>
                            <v-text-field v-model="med._prixUnitaire" type="number" variant="outlined"
                                density="compact" />
                        </div>
                        <div v-else>
                            <h4>{{ med.categorie || '...' }}</h4>
                            <p>{{ med.description || '...' }}</p>
                            <p>{{ med.quantiteParUnite }}</p>
                            <p>{{ med.prixUnitaire }}€ l'unité</p>
                        </div>
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-btn v-if="!med.isEditing" color="#ff6b6b" variant="flat"
                            @click="supprimer(med)">Supprimer</v-btn>
                        <v-btn v-if="!med.isEditing" color="#f4a261" variant="flat"
                            @click="modifier(med)">Modifier</v-btn>
                        <template v-else>
                            <v-btn color="#51cf66" variant="flat" @click="enregistrer(med)">Enregistrer</v-btn>
                            <v-btn color="#adb5bd" variant="flat" @click="annuler(med)">Annuler</v-btn>
                        </template>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
body {
    background-color: #e6ffe6;
    margin: 0;
    font-family: Arial, sans-serif;
}

.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
}

.card:hover {
    transform: translateY(-5px);
}

.card-title {
    padding: 10px 16px;
    font-size: 1.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.stock-button {
    align-items: center;
    justify-content: center;
    margin: 10px auto;
    border-radius: 30px;
    overflow: hidden;
    background-color: #6c757d;
    width: fit-content;
    display: flex;
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
</style>