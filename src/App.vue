<template>
  <div class="header">
    <h1>Pharmacie</h1>
  </div>
  <SearchForm @filtrerCat="filtrer" />
  <MedicamentForm @medicamentAjoute="refreshKey++" />
  <Medicament :idCat="idCatSelectionnee" :refreshKey="refreshKey" />
</template>

<style>
body {
  background-color: #e6ffe6;
  margin: 0;
}

.header {
  background-color: black;
  color: white;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.header h1 {
  margin: 0;
}
</style>