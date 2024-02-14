import { Categorie } from "./categorie";

export class Produit {
    id?: number; 
    code:string | undefined;
    designation: string | undefined;
    prix:number | undefined
    categorieId: number | undefined; 
    categorie : Categorie | undefined;
}
  