import { PublicInfoPage } from "@/components/marketing/public-info-page";

export default function PrivacyPage() {
  return (
    <PublicInfoPage
      title="Confidentialité et données personnelles"
      intro="Cette page résume les catégories de données utilisées par Simplifact pour fournir les fonctions de compte, de facturation et de communication par email."
      notice="Avant publication définitive, l’éditeur doit compléter son identité légale, ses coordonnées de contact, les durées de conservation applicables et le processus d’exercice des droits."
      sections={[
        {
          title: "Données traitées",
          paragraphs: [
            "Les données de compte peuvent inclure le nom, l’adresse email et les informations nécessaires à l’authentification. Lors d’une connexion Google ou GitHub, le service reçoit les informations de profil autorisées par le fournisseur.",
            "Les entreprises peuvent saisir des coordonnées d’entreprise, des informations sur leurs clients et le contenu de leurs factures, notamment les descriptions, montants, dates et statuts.",
          ],
        },
        {
          title: "Utilisation des données",
          paragraphs: [
            "Ces informations servent à fournir l’accès au compte, gérer les clients et les factures, calculer les totaux, produire des PDF et envoyer les emails demandés par l’utilisateur.",
            "Les journaux techniques peuvent contenir des informations de requête nécessaires au fonctionnement et au diagnostic du service.",
          ],
        },
        {
          title: "Services tiers",
          paragraphs: [
            "Le fonctionnement actuel s’appuie notamment sur un hébergement applicatif, une base de données, un service d’envoi d’emails et les fournisseurs d’authentification choisis. Leurs rôles et leurs conditions doivent être vérifiés par l’éditeur avant publication de la politique définitive.",
          ],
        },
        {
          title: "Préférences et droits",
          paragraphs: [
            "La préférence de langue est enregistrée dans le navigateur. Les jetons d’authentification sont également stockés dans le navigateur pour maintenir la session.",
            "Pour toute demande concernant les données personnelles, utilisez les coordonnées officielles de l’éditeur qui devront être indiquées dans la version définitive de cette page.",
          ],
        },
      ]}
    />
  );
}