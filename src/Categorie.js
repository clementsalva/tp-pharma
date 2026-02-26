export class Categorie {
    constructor(id, nom, description) {
        this._id = id
        this._nom = nom
        this._description = description ?? ""
    }

    get id() { return this._id }
    get nom() { return this._nom }
    get description() { return this._description }
    set nom(val) { this._nom = val }

    toString() {
        return `--> ${this._nom} (${this._id})`
    }
}