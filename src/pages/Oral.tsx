import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface SlidePoint {
  text: string
  detail?: string
  image?: string
  video?: string
}

interface Slide {
  id: string
  section: string
  title: string
  subtitle?: string
  points: SlidePoint[]
}

const SLIDES: Slide[] = [
  // ── 1. INTRODUCTION ──────────────────────────────────────────────────────
  {
    id: 'titre',
    section: 'Introduction',
    title: 'SMP-Commercial',
    subtitle: 'Application Android de présentation commerciale — Titre RNCP Développeur Full Stack · Niveau 6',
    points: [
      { text: 'Loic Michaud' },
      { text: 'Alternance chez SMP Moules' },
      { text: 'Année 2025–2026' },
    ],
  },
  {
    id: 'entreprise',
    section: 'Introduction',
    title: 'SMP Moules',
    subtitle: "Contexte de l'alternance",
    points: [
      { text: "Entreprise spécialisée dans la fabrication de moules industriels" },
      { text: "Secteurs clients : pharmacie, cosmétique, emballage" },
      { text: "Besoin : moderniser la présentation commerciale en salon professionnel" },
      { text: "Mon rôle : développeur mobile et informaticien en alternance" },
    ],
  },
  {
    id: 'problematique',
    section: 'Introduction',
    title: 'Problématique métier',
    subtitle: 'Pourquoi ce projet ?',
    points: [
      { text: "Les commerciaux présentaient les produits sous format physique" },
      { text: "Aucune capture structurée des contacts prospects en salon" },
      { text: "Impossibilité de montrer des vidéos produit" },
      { text: "Objectif : une application kiosque interactive, offline, sur tablette Android" },
    ],
  },
  {
    id: 'objectifs',
    section: 'Introduction',
    title: 'Objectifs du projet',
    points: [
      { text: "Catalogue produit multimédia : images, vidéos, PDF" },
      { text: "Formulaire de capture de leads avec photo de carte de visite" },
      { text: "Fonctionnement hors ligne avec base de données locale" },
      { text: "Panel admin pour mettre à jour les contenus sans redéployer" },
      { text: "Export des contacts par email avec rapport PDF" },
    ],
  },

  // ── 2. ANALYSE & CONCEPTION ───────────────────────────────────────────────
  {
    id: 'choix-plateforme',
    section: 'Conception',
    title: 'Choix de la plateforme',
    subtitle: 'Android natif vs cross-platform',
    points: [
      { text: "React Native / Flutter → performances insuffisantes pour le rendu 3D" },
      { text: "PWA → pas d'accès natif à CameraX, Filament, stockage" },
      { text: "Android natif Kotlin → accès complet aux APIs hardware" },
      { text: "Jetpack Compose → UI déclarative moderne, maintenance simplifiée" },
      { text: "→ Choix : Android natif Kotlin + Compose Material 3" },
    ],
  },
  {
    id: 'architecture',
    section: 'Conception',
    title: 'Architecture MVVM + Clean',
    subtitle: '3 couches strictement séparées',
    points: [
      { text: "Domain Layer — interfaces Repository, modèles métier purs" },
      { text: "Data Layer — implémentations Room, DAOs, services (SMTP, email)" },
      { text: "Presentation Layer — ViewModels, états UI, composables Compose" },
      { text: "→ Couplage faible, testabilité maximale, évolutivité" },
    ],
  },
  {
    id: 'schema-archi',
    section: 'Conception',
    title: 'Flux de données',
    subtitle: 'MVVM avec StateFlow et Coroutines',
    points: [
      { text: "UI Compose — observe StateFlow via collectAsStateWithLifecycle()" },
      { text: "ViewModel — expose états UI, orchestre les cas d'usage" },
      { text: "Repository (interface) — contrat du Domain Layer" },
      { text: "RepositoryImpl (data) — implémentation Room + services" },
      { text: "Room DAO → SQLite local — persistance offline-first" },
    ],
  },
  {
    id: 'bdd',
    section: 'Conception',
    title: 'Schéma de base de données',
    subtitle: '5 entités Room / SQLite',
    points: [
      { text: "CATEGORIES — id, nom, description, emoji, imagePath, ordre" },
      { text: "PRODUCTS — id, categoryId (FK), nom, specs, imagePaths (JSON), model3dPath, videoPath, pdfPath" },
      { text: "CONTACTS — id, société, email, téléphone, secteurs, photoPath, statut (pending|sent), timestamps" },
      { text: "MEDIA_FILES — id, fileName, filePath, mimeType, fileSize" },
      { text: "APP_SETTINGS — clé / valeur (config SMTP, traductions, paramètres admin)" },
    ],
  },
  {
    id: 'di',
    section: 'Conception',
    title: 'Injection de dépendances',
    subtitle: 'Koin 3.5.3 — 3 modules',
    points: [
      { text: "DatabaseModule — Room AppDatabase, tous les DAOs" },
      { text: "RepositoryModule — lie interfaces Domain aux implémentations Data" },
      { text: "ViewModelModule — ViewModels de chaque écran" },
      { text: "→ Aucun couplage direct entre couches, mocks faciles en test" },
    ],
  },

  // ── 3. STACK TECHNIQUE ────────────────────────────────────────────────────
  {
    id: 'stack',
    section: 'Stack',
    title: 'Stack technique',
    subtitle: "Vue d'ensemble",
    points: [
      { text: "Langage : Kotlin 2.1.0 — coroutines, extension functions, sealed classes" },
      { text: "UI : Jetpack Compose + Material 3 (BOM 2024.12)" },
      { text: "Base de données : Room 2.6.1 (SQLite, DAOs, Flow réactif)" },
      { text: "DI : Koin 3.5.3" },
      { text: "Build : Gradle 9.3.1 + libs.versions.toml centralisé" },
      { text: "SDK min : Android 24 · Target : Android 35" },
    ],
  },
  {
    id: 'stack-media',
    section: 'Stack',
    title: 'Librairies multimédia',
    points: [
      { text: "CameraX 1.3.1 — capture photo de carte de visite" },
      { text: "Media3 ExoPlayer 1.2.1 — lecture vidéo" },
      { text: "Coil 2.5.0 — chargement et cache des images" },
      { text: "AndroidX WebKit 1.12.1 — visualisation PDF" },
    ],
  },
  {
    id: 'stack-services',
    section: 'Stack',
    title: 'Services & intégrations',
    points: [
      { text: "Angus Mail (Jakarta Mail) 2.0.2 — envoi SMTP avec SSL/TLS" },
      { text: "ML Kit Translate 17.0.3 — traduction multilingue on-device" },
      { text: "Android PdfDocument API — génération de rapports PDF" },
      { text: "kotlinx-serialization — sérialisation JSON (imagePaths en BDD)" },
      { text: "JUnit 4/5 + Mockk + Turbine — tests unitaires et Flow" },
    ],
  },

  // ── 4. FONCTIONNALITÉS ────────────────────────────────────────────────────
  {
    id: 'navigation-ui',
    section: 'Fonctionnalités',
    title: 'Navigation & architecture UI',
    points: [
      { text: "Single-Activity — un seul MainActivity, tout en Compose" },
      { text: "Jetpack Navigation Compose 2.8.5 — NavGraph typé" },
      { text: "BottomNavBar — Accueil · Catalogue · Contact · Export" },
      { text: "SMPHeader — barre supérieure unifiée avec accès admin" },
      { text: "Landscape forcé — orientation optimisée kiosque tablette" },
    ],
  },
  {
    id: 'accueil',
    section: 'Fonctionnalités',
    title: "Écran d'accueil",
    points: [
      { text: "Page d'entrée de l'application kiosque" },
      { text: "Branding SMP Moules avec logo et présentation" },
      { text: "Accès rapide aux sections principales" },
      { text: "Mode présentation — plein écran immersif (system bars masquées)" },
      { text: "Screen toujours allumé (FLAG_KEEP_SCREEN_ON)" },
    ],
  },
  {
    id: 'catalogue',
    section: 'Fonctionnalités',
    title: 'Catalogue produits',
    subtitle: 'Grille de catégories',
    points: [
      { text: "Grille responsive — 2 colonnes (téléphone) · 3+ (tablette)" },
      { text: "Cartes catégorie avec emoji, image et nom" },
      { text: "Données chargées depuis Room via CatalogViewModel (Flow)" },
      { text: "Admin : ajout / suppression de catégories, upload image" },
      { text: "Navigation → liste des produits de la catégorie" },
    ],
  },
  {
    id: 'produit-detail',
    section: 'Fonctionnalités',
    title: 'Détail produit',
    points: [
      { text: "Nom, description, spécifications techniques" },
      { text: "Galerie d'images avec Coil (cache disque + mémoire)" },
      { text: "Boutons d'accès aux médias : PDF · Vidéo · Modèle 3D" },
      { text: "Admin : édition inline des textes, upload de médias" },
      { text: "Persistance via ProductRepositoryImpl → Room" },
    ],
  },
  {
    id: 'pdf',
    section: 'Fonctionnalités',
    title: 'Visualiseur PDF',
    points: [
      { text: "Chargement via AndroidX WebKit (WebView sécurisé)" },
      { text: "Fichiers PDF stockés localement dans le stockage interne" },
      { text: "Accès sécurisé via AndroidX FileProvider" },
      { text: "Navigation plein écran sans quitter l'app" },
      { text: "Utilisation : fiches techniques, catalogues produit" },
    ],
  },
  {
    id: 'video',
    section: 'Fonctionnalités',
    title: 'Lecteur vidéo',
    subtitle: 'Media3 ExoPlayer 1.2.1',
    points: [
      { text: "Lecture de vidéos produit stockées localement" },
      { text: "Contrôles natifs (play/pause, seek, plein écran)" },
      { text: "Intégré dans le DetailScreen au côté des autres médias" },
      { text: "Gestion du lifecycle — pause automatique en background" },
    ],
  },
  {
    id: 'contact-form',
    section: 'Fonctionnalités',
    title: 'Formulaire de contact',
    subtitle: 'Capture de leads en salon',
    points: [
      { text: "Champs : société, interlocuteur, email, téléphone, notes" },
      { text: "Secteurs (cases à cocher) : Pharmacie · Cosmétique · Emballage · Auto · Aéro · Électronique · Agri · Autre" },
      { text: "Photo carte de visite via CameraX" },
      { text: "Case à cocher consentement RGPD obligatoire" },
      { text: "Layout responsive — colonne unique (mobile) · 2 colonnes (tablette)" },
    ],
  },
  {
    id: 'camera',
    section: 'Fonctionnalités',
    title: 'Capture photo',
    subtitle: 'CameraX 1.3.1',
    points: [
      { text: "CameraCapture.kt — composable réutilisable" },
      { text: "Preview en direct + capture JPEG" },
      { text: "Redimensionnement bitmap pour optimiser le stockage" },
      { text: "Chemin stocké dans Contact.photoPath (Room)" },
      { text: "Permission CAMERA déclarée dans le Manifest" },
    ],
  },
  {
    id: 'rgpd',
    section: 'Fonctionnalités',
    title: 'Conformité RGPD',
    points: [
      { text: "RGPDDialog.kt — dialogue de consentement explicite" },
      { text: "Soumission du formulaire bloquée sans consentement coché" },
      { text: "Données personnelles stockées uniquement en local (pas de cloud)" },
      { text: "Export uniquement à la demande explicite de l'admin" },
      { text: "Aucun tracking, aucune telemetry externe" },
    ],
  },
  {
    id: 'historique',
    section: 'Fonctionnalités',
    title: 'Historique contacts',
    points: [
      { text: "Liste de tous les leads capturés avec statut (pending / sent)" },
      { text: "ContactHistoryViewModel — Flow<List<Contact>> depuis Room" },
      { text: "ContactDetailDialog — vue complète avec photo et secteurs" },
      { text: "Tri par date de création (desc)" },
      { text: "Indicateur visuel du statut d'envoi email" },
    ],
  },
  {
    id: 'export',
    section: 'Fonctionnalités',
    title: 'Export des données',
    points: [
      { text: "Export CSV — fichier dans Documents, partageable via Intent" },
      { text: "Export email — SMTP Jakarta Mail avec SSL/TLS" },
      { text: "Pièce jointe PDF générée via Android PdfDocument API" },
      { text: "Template HTML email pour présentation professionnelle" },
      { text: "Configuration SMTP dans le panel admin (host, port, identifiants)" },
    ],
  },
  {
    id: 'admin',
    section: 'Fonctionnalités',
    title: 'Panel administrateur',
    subtitle: 'Gestion de contenu sans redéploiement',
    points: [
      { text: "AdminLoginScreen — authentification par mot de passe" },
      { text: "AdminModeBanner — indicateur visuel du mode admin actif" },
      { text: "ContentManager.kt — édition inline de tous les textes de l'UI" },
      { text: "TranslationService.kt — ML Kit pour traduction automatique" },
      { text: "SMTP Config — SmtpConfigDialog pour configurer l'envoi email" },
    ],
  },
  {
    id: 'kiosque',
    section: 'Fonctionnalités',
    title: 'Mode kiosque',
    subtitle: 'Présentation immersive en salon',
    points: [
      { text: "Fullscreen avec system bars masquées (WindowInsetsController)" },
      { text: "FLAG_KEEP_SCREEN_ON — écran toujours allumé" },
      { text: "Orientation paysage forcée (idéal tablette 10\")" },
      { text: "Navigation limitée — pas de retour OS possible depuis la démo" },
      { text: "Adapté à un usage sur stand sans surveillance constante" },
    ],
  },
  {
    id: 'multilingue',
    section: 'Fonctionnalités',
    title: 'Support multilingue',
    subtitle: 'ML Kit Translate — on-device',
    points: [
      { text: "ML Kit Translate 17.0.3 — traduction sans réseau" },
      { text: "LanguageManager — gestion de la langue active" },
      { text: "ContentManager — surcharge dynamique des chaînes" },
      { text: "Localization.kt — système de chaînes localisées" },
      { text: "Pas de connexion internet requise pour les traductions" },
    ],
  },

  // ── 5. QUALITÉ & SÉCURITÉ ─────────────────────────────────────────────────
  {
    id: 'responsive',
    section: 'Qualité',
    title: 'Interface responsive',
    subtitle: 'Phone et tablette',
    points: [
      { text: "ScreenType enum — détection automatique phone / tablet" },
      { text: "Dimensions.kt — espacements et tailles selon le form factor" },
      { text: "Formulaire contact : colonne unique → 2 colonnes côte à côte" },
      { text: "Catalogue : 2 colonnes → 3 colonnes ou plus" },
      { text: "Testé sur émulateurs Pixel 6 et tablette 10\"" },
    ],
  },
  {
    id: 'securite',
    section: 'Qualité',
    title: 'Sécurité',
    points: [
      { text: "Keystore signé (mon-app.jks) — APK release signé" },
      { text: "AndroidX FileProvider — partage sécurisé sans exposer les chemins" },
      { text: "Aucun secret hardcodé — SMTP via interface admin uniquement" },
      { text: "ProGuard disponible en release (obfuscation du bytecode)" },
      { text: "Permissions minimales déclarées dans le Manifest" },
    ],
  },
  {
    id: 'tests',
    section: 'Qualité',
    title: 'Tests',
    points: [
      { text: "JUnit 4/5 — tests unitaires des ViewModels et Repositories" },
      { text: "Mockk — mocking des interfaces Repository sans dépendance Room" },
      { text: "Turbine — test des flux Kotlin Flow (émissions, completions)" },
      { text: "Tests d'intégration Room — InstrumentedTest sur base en mémoire" },
      { text: "Architecture Clean — chaque couche testable indépendamment" },
    ],
  },
  {
    id: 'performances',
    section: 'Qualité',
    title: 'Performances',
    points: [
      { text: "Coil — cache mémoire + disque pour images, chargement lazy" },
      { text: "Filament — rendu 3D GPU-accéléré, hors du thread principal" },
      { text: "Kotlin Coroutines — toutes les I/O sur Dispatchers.IO" },
      { text: "Room Flow — mises à jour UI réactives sans polling" },
      { text: "Large heap activé pour la gestion des médias lourds" },
    ],
  },

  // ── 6. DÉFIS & SOLUTIONS ──────────────────────────────────────────────────
  {
    id: 'defi-media',
    section: 'Défis',
    title: 'Défi 1 — Médias lourds',
    subtitle: 'Images, vidéos, PDFs',
    points: [
      { text: "Problème : chargement lent" },
      { text: "Solution : chargement async sur Dispatchers.IO + Coil pour images" },
      { text: "Large heap (android:largeHeap=\"true\") pour Filament" },
      { text: "Bitmap sampling (inSampleSize) pour réduire la mémoire photos" },
      { text: "→ Résultat : aucun crash mémoire en utilisation salon" },
    ],
  },
  {
    id: 'defi-offline',
    section: 'Défis',
    title: 'Défi 2 — Offline-first',
    subtitle: 'Application 100% fonctionnelle sans réseau',
    points: [
      { text: "Problème : salons professionnels souvent sans WiFi fiable" },
      { text: "Solution : Room SQLite comme source de vérité unique" },
      { text: "Tous les médias copiés en stockage interne à l'installation" },
      { text: "ML Kit Translate fonctionne on-device sans connexion" },
      { text: "→ App entièrement utilisable hors ligne, même l'export CSV" },
    ],
  },
  {
    id: 'defi-smtp',
    section: 'Défis',
    title: 'Défi 3 — Email SMTP sur Android',
    points: [
      { text: "Problème : Android bloque les opérations réseau sur le main thread" },
      { text: "Solution : EmailService.kt sur Dispatchers.IO via coroutine" },
      { text: "Jakarta Mail (Angus Mail) — supporte SSL/TLS et authentification" },
      { text: "Gestion des erreurs : timeout, auth failure, SSL handshake" },
      { text: "→ Envoi fiable avec feedback utilisateur en cas d'erreur" },
    ],
  },
  {
    id: 'defi-multilingue',
    section: 'Défis',
    title: 'Défi 4 — Multilingue dynamique',
    points: [
      { text: "Problème : les chaînes doivent être modifiables par l'admin" },
      { text: "Solution : ContentManager stocke les overrides dans APP_SETTINGS" },
      { text: "ML Kit Translate pour les traductions automatiques à la demande" },
      { text: "LanguageManager centralise la langue active" },
      { text: "→ Commerciaux peuvent adapter les textes sans développeur" },
    ],
  },

  // ── 7. COMPÉTENCES RNCP ───────────────────────────────────────────────────
  {
    id: 'rncp-intro',
    section: 'Compétences',
    title: 'Référentiel RNCP Niveau 6',
    subtitle: "Concepteur Développeur d'Applications Full Stack",
    points: [
      { text: "C1 — Analyser les besoins et concevoir l'architecture applicative" },
      { text: "C2 — Développer des interfaces utilisateur adaptatives" },
      { text: "C3 — Concevoir et exploiter une base de données" },
      { text: "C4 — Développer des composants métier et services" },
      { text: "C5 — Travailler en contexte professionnel agile" },
    ],
  },
  {
    id: 'c1',
    section: 'Compétences',
    title: 'C1 — Architecture applicative',
    points: [
      { text: "Analyse du besoin métier → cahier des charges fonctionnel" },
      { text: "Choix architecturaux justifiés : MVVM + Clean Architecture" },
      { text: "Conception du schéma de base de données (5 entités, relations)" },
      { text: "Diagramme de navigation (NavGraph, 9 écrans)" },
      { text: "Choix des dépendances (Koin, Room, Filament) argumentés" },
    ],
  },
  {
    id: 'c2',
    section: 'Compétences',
    title: 'C2 — Interfaces utilisateur',
    points: [
      { text: "Jetpack Compose + Material 3 — UI déclarative moderne" },
      { text: "Composants réutilisables : SMPHeader, SMPNavigationBar, CameraCapture" },
      { text: "Responsive design — phone / tablette avec ScreenType" },
      { text: "Mode kiosque fullscreen avec gestion des system bars" },
      { text: "Accessibilité : contrastes Material 3, sémantique Compose" },
    ],
  },
  {
    id: 'c3',
    section: 'Compétences',
    title: 'C3 — Base de données',
    points: [
      { text: "Modélisation relationnelle : 5 entités, clés étrangères, cascade delete" },
      { text: "Room ORM avec DAOs typés (ContactDao, ProductDao, etc.)" },
      { text: "Requêtes Flow réactives — mises à jour UI automatiques" },
      { text: "DatabaseSeeder — initialisation des données au premier lancement" },
      { text: "Migrations Room pour les évolutions de schéma" },
    ],
  },
  {
    id: 'c4',
    section: 'Compétences',
    title: 'C4 — Composants métier',
    points: [
      { text: "EmailService.kt — service SMTP avec génération PDF" },
      { text: "TranslationService.kt — traduction ML Kit asynchrone" },
      { text: "ContentManager.kt — gestion des contenus éditables" },
      { text: "ExportViewModel — orchestration CSV + email" },
      { text: "Pattern Repository — isolation de la logique d'accès aux données" },
    ],
  },
  {
    id: 'c5',
    section: 'Compétences',
    title: 'C5 — Contexte professionnel',
    points: [
      { text: "Travail en autonomie au sein de l'équipe IT de SMP Moules" },
      { text: "Versioning Git avec branches feature / fix" },
      { text: "Livraison d'APK signé et documenté (apk.md)" },
      { text: "Communication avec les utilisateurs métier (commerciaux)" },
      { text: "Documentation technique : README, CLAUDE.md, AGENTS.md" },
    ],
  },

  // ── 8. BILAN ──────────────────────────────────────────────────────────────
  {
    id: 'bilan-technique',
    section: 'Bilan',
    title: 'Bilan technique',
    points: [
      { text: "Application Android production-ready, APK signé livré" },
      { text: "Architecture propre — chaque couche testable et évolutive" },
      { text: "Intégration de 10+ librairies Android majeures" },
      { text: "Première expérience significative de développement mobile natif" },
      { text: "Compréhension approfondie du cycle de vie Android" },
    ],
  },
  {
    id: 'bilan-entreprise',
    section: 'Bilan',
    title: 'Apport pour SMP Moules',
    points: [
      { text: "Remplacement des feuilles de prise de contact papier par une app interactive" },
      { text: "Fini les cartes de visite perdues" },
      { text: "Export automatique des contacts via email" },
      { text: "Autonomie : les commerciaux mettent à jour les contenus eux-mêmes" },
      { text: "Image moderne de l'entreprise lors des salons professionnels" },
    ],
  },
  {
    id: 'bilan-personnel',
    section: 'Bilan',
    title: "Ce que j'ai appris",
    points: [
      { text: "Maîtrise de Kotlin et Jetpack Compose en contexte réel" },
      { text: "Architecture logicielle : MVVM, Clean Architecture, DI" },
      { text: "Gestion des APIs hardware Android (CameraX, Filament, Permissions)" },
      { text: "Rigueur sur la sécurité des données (RGPD, Keystore)" },
      { text: "Communication technique avec des parties prenantes non-développeurs" },
    ],
  },
  {
    id: 'perspectives',
    section: 'Bilan',
    title: 'Perspectives & évolutions',
    points: [
      { text: "Synchronisation cloud — backup des contacts sur serveur distant" },
      { text: "Analyse des prospects — statistiques par secteur, par salon" },
      { text: "Notifications push — rappels de suivi des leads non traités" },
      { text: "Version iOS — React Native pour mutualiser le code métier" },
      { text: "Mode hors ligne amélioré — sync différentielle au retour réseau" },
    ],
  },

  // ── 9. CONCLUSION ─────────────────────────────────────────────────────────
  {
    id: 'conclusion',
    section: 'Conclusion',
    title: 'Conclusion',
    points: [
      { text: "Application kiosque Android complète, livrée et utilisée en production" },
      { text: "Architecture MVVM + Clean — maintenable, testable, évolutive" },
      { text: "Stack moderne : Kotlin · Compose · Room · Koin · Filament · CameraX" },
      { text: "Compétences RNCP niveau 6 couvertes de la conception à la livraison" },
      { text: "→ Questions ?" },
    ],
  },
]

const SECTIONS = [...new Set(SLIDES.map(s => s.section))]

type Step =
  | { kind: 'overview'; slideIndex: number }
  | { kind: 'zoom'; slideIndex: number; pointIndex: number }

export function generateSteps(slides: Slide[]): Step[] {
  return slides.flatMap((slide, slideIndex) => [
    { kind: 'overview' as const, slideIndex },
    ...slide.points.map((_, pointIndex) => ({
      kind: 'zoom' as const,
      slideIndex,
      pointIndex,
    })),
  ])
}

export const STEPS = generateSteps(SLIDES)

interface ZoomSlideProps {
  slide: Slide
  pointIndex: number
}

function ZoomSlide({ slide, pointIndex }: ZoomSlideProps) {
  const point = slide.points[pointIndex]
  const hasMedia = !!(point.image || point.video)

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <p className="font-mono text-xs text-[#e8ff00] uppercase tracking-widest">{slide.section}</p>
        <span className="text-zinc-600 font-mono text-xs">·</span>
        <p className="text-zinc-400 text-sm truncate">{slide.title}</p>
        <span className="ml-auto font-mono text-xs text-zinc-500 shrink-0">
          {String(pointIndex + 1).padStart(2, '0')} / {String(slide.points.length).padStart(2, '0')}
        </span>
      </div>

      {hasMedia ? (
        <div className="grid grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            {point.image && (
              <img
                src={point.image}
                alt={point.text}
                className="max-h-[60vh] w-full object-contain rounded-lg"
              />
            )}
            {point.video && (
              <video
                src={point.video}
                controls
                className="max-h-[60vh] w-full rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
            {point.detail && (
              <p className="text-zinc-400 text-lg leading-relaxed">{point.detail}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[40vh]">
          <p className="text-3xl font-semibold text-zinc-100 leading-snug max-w-2xl">{point.text}</p>
          {point.detail && (
            <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">{point.detail}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Oral() {
  const [stepIndex, setStepIndex] = useState(0)

  const prev = useCallback(() => setStepIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setStepIndex(i => Math.min(STEPS.length - 1, i + 1)), [])

  const step = STEPS[stepIndex]
  const slide = SLIDES[step.slideIndex]
  const sectionIndex = SECTIONS.indexOf(slide.section)

  useEffect(() => {
    document.body.dataset.oral = 'true'
    return () => { delete document.body.dataset.oral }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Top bar */} 
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <Link to="/" className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors">
          ← Portfolio
        </Link>
        <div className="flex items-center gap-6">
          {/* Section indicators */}
          <div className="hidden md:flex items-center gap-1.5">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  const slideIdx = SLIDES.findIndex(sl => sl.section === s)
                  const targetStep = STEPS.findIndex(st => st.slideIndex === slideIdx && st.kind === 'overview')
                  if (targetStep !== -1) setStepIndex(targetStep)
                }}
                title={s}
                aria-label={s}
                className={`px-2 py-0.5 font-mono text-[10px] rounded transition-all duration-300 ${
                  i === sectionIndex
                    ? 'bg-[#e8ff00] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {String(step.slideIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            aria-label="Diapositive précédente"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={stepIndex === STEPS.length - 1}
            aria-label="Diapositive suivante"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </nav>
      </header>

      {/* Slide content */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-8 lg:px-24">
        <div
          key={`${step.slideIndex}-${step.kind}-${step.kind === 'zoom' ? step.pointIndex : ''}`}
          className={`w-full slide-enter ${step.kind === 'overview' ? 'max-w-3xl' : 'max-w-5xl'}`}
        >
          {step.kind === 'overview' ? (
            <>
              <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
                {slide.section}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>
              )}
              <ul className="space-y-4 mt-8">
                {slide.points.map(point => (
                  <li key={point.text} className="flex items-start gap-4 text-zinc-300 text-lg">
                    <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ZoomSlide slide={slide} pointIndex={step.pointIndex} />
          )}
        </div>
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-zinc-800/60">
        <div
          className="h-full bg-[#e8ff00] transition-all duration-500 ease-out"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}