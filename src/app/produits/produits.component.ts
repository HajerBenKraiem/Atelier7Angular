import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';
import { CategoriesService } from '../services/categorie.service';
import { Categorie } from '../model/categorie';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css'],
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  produitCourant: Produit = new Produit();
  selectedCategory: Categorie | undefined;
  erreur: string | undefined;
  editMode: boolean = false;
  searchTerm: string = '';
  filteredProduits: Produit[] = [];

  constructor(
    private produitsService: ProduitsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.getProduits();
    this.getCategories();
  }

  getProduits(): void {
    this.produitsService.getProduits().subscribe(
      (produits) => {
        this.produits = produits;
        this.filteredProduits = [...produits]; // Initialisation des produits filtrés
      },
      (error) => console.error('Error fetching produits', error)
    );
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe(
      (categories) => (this.categories = categories),
      (error) => console.error('Error fetching categories', error)
    );
  }

  validerFormulaire(form: NgForm): void {
    if (this.editMode) {
      const reponse: boolean = confirm(
        "Produit existant. Confirmez-vous la mise à jour de :" +
          this.produitCourant.designation +
          ' ?'
      );
      if (reponse) {
        if (this.produitCourant && this.selectedCategory) {
          this.produitCourant.categorie = this.selectedCategory;

          this.produitsService
            .updateProduit(this.produitCourant)
            .subscribe(
              (updatedProduit) => {
                console.log('Updated successfully...');
                // Mettre à jour localement
                const index = this.produits.findIndex(
                  (p) => p.id === updatedProduit.id
                );
                if (index !== -1) {
                  this.produits[index] = updatedProduit;
                }
                this.reset();
              },
              (error) => {
                console.error('Erreur Update', error);
                this.erreur = 'Erreur Update';
              }
            );
        } else {
          console.error('Error: selectedCategory is undefined');
        }
      }
    }
  }

  editerProduit(p: Produit) {
    console.log('editer works...');
    this.produitCourant = { ...p };
    this.editMode = true;
  }

  private reset(): void {
    this.editMode = false;
    this.produitCourant = new Produit();
    this.erreur = undefined;
    this.selectedCategory = undefined;
  }

  supprimerProduit(p: Produit) {
    let reponse: boolean = confirm(
      'Voulez-vous supprimer le produit :' + p.designation + ' ?'
    );
    if (reponse) {
      console.log('Suppression confirmée...');
      this.produitsService.deleteProduit(p).subscribe({
        next: () => {
          console.log('Succès DELETE');
          let index: number = this.produits.indexOf(p);
          console.log('indice du produit à supprimer: ' + index);
          if (index !== -1) {
            this.produits.splice(index, 1);
            this.filteredProduits = [...this.produits]; // Mettre à jour les produits filtrés
          }
        },
        error: (err) => {
          console.log('Erreur DELETE', err);
        },
      });
    } else {
      console.log('Suppression annulée...');
    }
  }

  // Filtrer les produits par catégorie
  filterProduitsParCategorie() {
    if (this.selectedCategory) {
      this.filteredProduits = this.produits.filter(
        (p) => p.categorie?.id === this.selectedCategory?.id
      );
    } else {
      this.filteredProduits = [...this.produits]; // Afficher tous les produits si aucune catégorie n'est sélectionnée
    }
  }

  // Filtrer les produits par terme de recherche
  filtrerProduits(): void {
    if (this.searchTerm.trim() !== '') {
      this.filteredProduits = this.produits.filter((product) =>
        product.designation
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProduits = [...this.produits];
    }
  }

  // Gérer le changement de terme de recherche
  onSearchTermChange(): void {
    this.filtrerProduits();
  }
}
