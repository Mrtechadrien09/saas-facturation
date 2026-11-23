import { PublicInfoPage } from "@/components/marketing/public-info-page";

export default function TermsPage() {
  return (
    <PublicInfoPage
      title="Conditions d’utilisation"
      intro="Ces conditions présentent les règles générales d’accès à Simplifact et d’utilisation des fonctions de gestion et de facturation."
      notice="Cette base doit être complétée et validée par l’éditeur avant publication, notamment pour l’identité légale, les tarifs, la durée du service, les résiliations et le droit applicable."
      sections={[
        {
          title: "Compte et accès",
          paragraphs: [
            "L’utilisateur est responsable de l’exactitude des informations de son compte et de la confidentialité de ses moyens d’accès. Il doit signaler toute utilisation non autorisée de son compte.",
            "Les accès Google et GitHub restent soumis aux conditions de leurs fournisseurs respectifs.",
          ],
        },
        {
          title: "Utilisation du service",
          paragraphs: [
            "Simplifact fournit des outils de gestion de clients, de création et de suivi de factures, ainsi que de génération et d’envoi de documents.",
            "L’entreprise utilisatrice demeure responsable des données saisies, de l’exactitude des factures et de leur conformité à sa situation et à la réglementation qui lui est applicable.",
          ],
        },
        {
          title: "Usage acceptable",
          paragraphs: [
            "Le service ne doit pas être utilisé pour porter atteinte aux droits d’autrui, transmettre des contenus illicites ou perturber le fonctionnement de la plateforme.",
          ],
        },
        {
          title: "Évolution des conditions",
          paragraphs: [
            "Les modalités de disponibilité, de support, de tarification, de résiliation et de règlement des différends doivent être définies et validées par l’éditeur dans la version contractuelle applicable.",
          ],
        },
      ]}
    />
  );
}