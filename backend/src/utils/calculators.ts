// Définition de la structure des données reçues pour le calcul
interface InvoiceItemInput {
  quantity: number;
  unitPrice: number; // Toujours exprimé en centimes
  vatRate: number;   // Exemple : 20 pour 20%
}

/**
 * Calcule automatiquement les montants HT, TVA et TTC d'une facture
 * à partir d'une liste d'articles.
 */
export const calculateInvoiceTotals = (items: InvoiceItemInput[]) => {
  let subTotal = 0; // Cumul du Total HT
  let vatTotal = 0; // Cumul du Total de la TVA

  items.forEach(item => {
    // Calcul du HT pour l'article courant (Prix * Quantité)
    const itemSubTotal = item.unitPrice * item.quantity;
    
    // Calcul de la TVA pour cet article : (Montant HT * Taux) / 100
    // Math.round sécurise les arrondis de centimes
    const itemVatTotal = Math.round((itemSubTotal * item.vatRate) / 100);

    subTotal += itemSubTotal;
    vatTotal += itemVatTotal;
  });

  // Le Total TTC est simplement la somme du HT et de la TVA
  const total = subTotal + vatTotal;

  return { subTotal, vatTotal, total };
};