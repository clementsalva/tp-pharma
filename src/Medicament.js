export class Medicament {
    constructor(medicamentJSON) {
        this._reference = medicamentJSON.reference
        this._nom = medicamentJSON.nom
        this._fournisseur = medicamentJSON.fournisseur
        this._quantiteParUnite = medicamentJSON.quantiteParUnite ?? ""
        this._prixUnitaire = medicamentJSON.prixUnitaire ?? 0
        this._unitesEnStock = medicamentJSON.unitesEnStock ?? 0
        this._unitesCommandees = medicamentJSON.unitesCommandees ?? 0
        this._niveauDeReappro = medicamentJSON.niveauDeReappro ?? 0
        this._indisponible = medicamentJSON.indisponible ?? false
        this._imageURL = medicamentJSON.imageURL ?? ""
        this._links = medicamentJSON._links ?? {}
        this._categorieURL = medicamentJSON._links?.categorie?.href ?? ""
        this._categorie = ""
        this._description = ""
        this.isEditing = false
    }

    get reference() { return this._reference }
    get nom() { return this._nom }
    get fournisseur() { return this._fournisseur }
    get quantiteParUnite() { return this._quantiteParUnite }
    get prixUnitaire() { return this._prixUnitaire }
    get unitesEnStock() { return this._unitesEnStock }
    set unitesEnStock(valeur) { this._unitesEnStock = valeur }
    get unitesCommandees() { return this._unitesCommandees }
    get niveauDeReappro() { return this._niveauDeReappro }
    get indisponible() { return this._indisponible }
    get imageURL() { return this._imageURL }
    get links() { return this._links }
    get categorieURL() { return this._categorieURL }
    get categorie() { return this._categorie }
    set categorie(val) { this._categorie = val }
    get description() { return this._description }
    set description(val) { this._description = val }
    set nom(val) { this._nom = val }
    set prixUnitaire(val) { this._prixUnitaire = val }
    set quantiteParUnite(val) { this._quantiteParUnite = val }

    toString() {
        return `--> ${this._nom} (${this._quantiteParUnite}) - ${this._prixUnitaire}€ | Stock: ${this._unitesEnStock}`
    }
}