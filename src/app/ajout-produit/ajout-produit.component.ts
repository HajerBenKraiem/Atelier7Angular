import { Component, OnInit } from '@angular/core';
import { ProduitsService } from '../services/produits.service';
import { Produit } from '../model/Produit';
import { NgForm } from '@angular/forms';
import { ProduitsComponent } from '../produits/produits.component';
@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit{
  
p=new ProduitsComponent( this.produitsService );  


effacer() {
throw new Error('Method not implemented.');
}
validerFormulaire(form: NgForm) {

  console.log(form.value);

//  if (form.value.id != undefined) { // id existe dans la zone du texte 
    console.log("id non vide...");
    this.ajouterProduit(form.value);
 // } else {
  //  console.log("id vide...");
   // this.ajouterProduit(form.value);
//   }

}
  constructor(private produitsService :ProduitsService)
  {
  }
  ngOnInit(): void {
    throw new Error('Initialisation du composant ajout: Récupérer la liste des produits');
    this.produitsService.getProduits();
  }
 nouveauProduit=new Produit();
 ajouterProduit(nouveau: Produit) {


  this.produitsService.addProduit(nouveau).subscribe(
    (addedProduits: Produit[]) => {
      const addedProduit = addedProduits[0]; // Supposant qu'un seul produit est ajouté
      console.log("Succès POST", addedProduit);
      this.p.produits.push({
        id: addedProduit.id,
        code: addedProduit.code,
        designation: addedProduit.designation,
        prix: addedProduit.prix
      });
      console.log("Ajout d'un nouveau produit:" );
      alert("Produit ajouté avec succès");
    },
    err => {
      console.log("Erreur POST", err);
    }
  );
  }  
}
