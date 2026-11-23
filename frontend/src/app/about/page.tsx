import { PublicInfoPage } from "@/components/marketing/public-info-page";

export default function AboutPage() {
  return (
    <PublicInfoPage
      title="À propos de nous"
      intro="Simplifact est un outil de facturation et de gestion commerciale pour les entreprises qui veulent suivre leurs clients, leurs factures et leurs paiements au même endroit."
      sections={[
        {
          title: "Notre objectif",
          paragraphs: [
            "Simplifact aide les équipes à structurer les tâches de facturation courantes et à retrouver rapidement les informations utiles au suivi des paiements.",
          ],
        },
        {
          title: "Ce que vous pouvez faire",
          paragraphs: [
            "Gérer vos clients, créer des factures, suivre leurs statuts, télécharger les PDF et envoyer les factures par email depuis votre espace.",
            "Le service évolue progressivement. Les fonctions disponibles sont celles présentées dans votre espace Simplifact.",
          ],
        },
      ]}
    />
  );
}