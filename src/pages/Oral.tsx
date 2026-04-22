import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Slide {
  id: string
  section: string
  title: string
  subtitle?: string
  points: string[]
}

const SLIDES: Slide[] = [
  // ── 1. INTRODUCTION ──────────────────────────────────────────────────────
  {
    id: 'titre',
    section: 'Introduction',
    title: 'SMP-Commercial',
    subtitle: 'Application Android de présentation commerciale — Titre RNCP Développeur Full Stack · Niveau 6',
    points: ['Votre prénom NOM', 'Alternance chez SMP Moules', 'Année 20XX–20XX'],
  },
  {
    id: 'entreprise',
    section: 'Introduction',
    title: 'SMP Moules',
    subtitle: "Contexte de l'alternance",
    points: [
      "Entreprise spécialisée dans la fabrication de moules industriels",
      "Secteurs clients : pharmacie, cosmétique, emballage, automobile, aérospatial",
      "Besoin : moderniser la présentation commerciale en salon professionnel",
      "Mon rôle : développeur mobile en alternance",
    ],
  },
  {
    id: 'problematique',
    section: 'Introduction',
    title: 'Problématique métier',
    subtitle: 'Pourquoi ce projet ?',
    points: [
      "Les commerciaux présentaient les produits avec des catalogues papier",
      "Aucune capture structurée des contacts prospects en salon",
      "Impossibilité de montrer des modèles 3D ou des vidéos produit",
      "Objectif : une application kiosque interactive, offline, sur tablette Android",
    ],
  },
  {
    id: 'objectifs',
    section: 'Introduction',
    title: 'Objectifs du projet',
    points: [
      "Catalogue produit multimédia : images, vidéos, PDF, modèles 3D",
      "Formulaire de capture de leads avec photo de carte de visite",
      "Fonctionnement hors ligne avec base de données locale",
      "Panel admin pour mettre à jour les contenus sans redéployer",
      "Export des contacts par email avec rapport PDF",
    ],
  },

  // ── 2. ANALYSE & CONCEPTION ───────────────────────────────────────────────
  {
    id: 'choix-plateforme',
    section: 'Conception',
    title: 'Choix de la plateforme',
    subtitle: 'Android natif vs cross-platform',
    points: [
      "React Native / Flutter → performances insuffisantes pour le rendu 3D",
      "PWA → pas d'accès natif à CameraX, Filament, stockage",
      "Android natif Kotlin → accès complet aux APIs hardware",
      "Jetpack Compose → UI déclarative moderne, maintenance simplifiée",
      "→ Choix : Android natif Kotlin + Compose Material 3",
    ],
  },
  {
    id: 'architecture',
    section: 'Conception',
    title: 'Architecture MVVM + Clean',
    subtitle: '3 couches strictement séparées',
    points: [
      "Domain Layer — interfaces Repository, modèles métier purs",
      "Data Layer — implémentations Room, DAOs, services (SMTP, email)",
      "Presentation Layer — ViewModels, états UI, composables Compose",
      "→ Couplage faible, testabilité maximale, évolutivité",
    ],
  },
  {
    id: 'schema-archi',
    section: 'Conception',
    title: 'Flux de données',
    subtitle: 'MVVM avec StateFlow et Coroutines',
    points: [
      "UI Compose — observe StateFlow via collectAsStateWithLifecycle()",
      "ViewModel — expose états UI, orchestre les cas d'usage",
      "Repository (interface) — contrat du Domain Layer",
      "RepositoryImpl (data) — implémentation Room + services",
      "Room DAO → SQLite local — persistance offline-first",
    ],
  },
  {
    id: 'bdd',
    section: 'Conception',
    title: 'Schéma de base de données',
    subtitle: '5 entités Room / SQLite',
    points: [
      "CATEGORIES — id, nom, description, emoji, imagePath, ordre",
      "PRODUCTS — id, categoryId (FK), nom, specs, imagePaths (JSON), model3dPath, videoPath, pdfPath",
      "CONTACTS — id, société, email, téléphone, secteurs, photoPath, statut (pending|sent), timestamps",
      "MEDIA_FILES — id, fileName, filePath, mimeType, fileSize",
      "APP_SETTINGS — clé / valeur (config SMTP, traductions, paramètres admin)",
    ],
  },
  {
    id: 'di',
    section: 'Conception',
    title: 'Injection de dépendances',
    subtitle: 'Koin 3.5.3 — 3 modules',
    points: [
      "DatabaseModule — Room AppDatabase, tous les DAOs",
      "RepositoryModule — lie interfaces Domain aux implémentations Data",
      "ViewModelModule — ViewModels de chaque écran",
      "→ Aucun couplage direct entre couches, mocks faciles en test",
    ],
  },

  // ── 3. STACK TECHNIQUE ────────────────────────────────────────────────────
  {
    id: 'stack',
    section: 'Stack',
    title: 'Stack technique',
    subtitle: "Vue d'ensemble",
    points: [
      "Langage : Kotlin 2.1.0 — coroutines, extension functions, sealed classes",
      "UI : Jetpack Compose + Material 3 (BOM 2024.12)",
      "Base de données : Room 2.6.1 (SQLite, DAOs, Flow réactif)",
      "DI : Koin 3.5.3",
      "Build : Gradle 9.3.1 + libs.versions.toml centralisé",
      "SDK min : Android 24 · Target : Android 35",
    ],
  },
  {
    id: 'stack-media',
    section: 'Stack',
    title: 'Librairies multimédia',
    points: [
      "CameraX 1.3.1 — capture photo de carte de visite",
      "Google Filament 1.70.0 — rendu 3D GPU (GLB/GLTF)",
      "Media3 ExoPlayer 1.2.1 — lecture vidéo",
      "Coil 2.5.0 — chargement et cache des images",
      "AndroidX WebKit 1.12.1 — visualisation PDF",
    ],
  },
  {
    id: 'stack-services',
    section: 'Stack',
    title: 'Services & intégrations',
    points: [
      "Angus Mail (Jakarta Mail) 2.0.2 — envoi SMTP avec SSL/TLS",
      "ML Kit Translate 17.0.3 — traduction multilingue on-device",
      "Android PdfDocument API — génération de rapports PDF",
      "kotlinx-serialization — sérialisation JSON (imagePaths en BDD)",
      "JUnit 4/5 + Mockk + Turbine — tests unitaires et Flow",
    ],
  },

  // ── 4. FONCTIONNALITÉS ────────────────────────────────────────────────────
  {
    id: 'navigation-ui',
    section: 'Fonctionnalités',
    title: 'Navigation & architecture UI',
    points: [
      "Single-Activity — un seul MainActivity, tout en Compose",
      "Jetpack Navigation Compose 2.8.5 — NavGraph typé",
      "BottomNavBar — Accueil · Catalogue · Contact · Export",
      "SMPHeader — barre supérieure unifiée avec accès admin",
      "Landscape forcé — orientation optimisée kiosque tablette",
    ],
  },
  {
    id: 'accueil',
    section: 'Fonctionnalités',
    title: "Écran d'accueil",
    points: [
      "Page d'entrée de l'application kiosque",
      "Branding SMP Moules avec logo et présentation",
      "Accès rapide aux sections principales",
      "Mode présentation — plein écran immersif (system bars masquées)",
      "Screen toujours allumé (FLAG_KEEP_SCREEN_ON)",
    ],
  },
  {
    id: 'catalogue',
    section: 'Fonctionnalités',
    title: 'Catalogue produits',
    subtitle: 'Grille de catégories',
    points: [
      "Grille responsive — 2 colonnes (téléphone) · 3+ (tablette)",
      "Cartes catégorie avec emoji, image et nom",
      "Données chargées depuis Room via CatalogViewModel (Flow)",
      "Admin : ajout / suppression de catégories, upload image",
      "Navigation → liste des produits de la catégorie",
    ],
  },
  {
    id: 'produit-detail',
    section: 'Fonctionnalités',
    title: 'Détail produit',
    points: [
      "Nom, description, spécifications techniques",
      "Galerie d'images avec Coil (cache disque + mémoire)",
      "Boutons d'accès aux médias : PDF · Vidéo · Modèle 3D",
      "Admin : édition inline des textes, upload de médias",
      "Persistance via ProductRepositoryImpl → Room",
    ],
  },
  {
    id: 'pdf',
    section: 'Fonctionnalités',
    title: 'Visualiseur PDF',
    points: [
      "Chargement via AndroidX WebKit (WebView sécurisé)",
      "Fichiers PDF stockés localement dans le stockage interne",
      "Accès sécurisé via AndroidX FileProvider",
      "Navigation plein écran sans quitter l'app",
      "Utilisation : fiches techniques, catalogues produit",
    ],
  },
  {
    id: 'filament',
    section: 'Fonctionnalités',
    title: 'Visualiseur 3D',
    subtitle: 'Google Filament 1.70.0',
    points: [
      "Rendu physiquement basé (PBR) sur GPU via OpenGL ES",
      "Formats supportés : GLB / GLTF",
      "Interactions tactiles — rotation, zoom, translation",
      "FilamentViewer.kt — gestion du lifecycle Filament",
      "ModelViewerViewModel — chargement async depuis stockage",
    ],
  },
  {
    id: 'video',
    section: 'Fonctionnalités',
    title: 'Lecteur vidéo',
    subtitle: 'Media3 ExoPlayer 1.2.1',
    points: [
      "Lecture de vidéos produit stockées localement",
      "Contrôles natifs (play/pause, seek, plein écran)",
      "Intégré dans le DetailScreen au côté des autres médias",
      "Gestion du lifecycle — pause automatique en background",
    ],
  },
  {
    id: 'contact-form',
    section: 'Fonctionnalités',
    title: 'Formulaire de contact',
    subtitle: 'Capture de leads en salon',
    points: [
      "Champs : société, interlocuteur, email, téléphone, notes",
      "Secteurs (cases à cocher) : Pharmacie · Cosmétique · Emballage · Auto · Aéro · Électronique · Agri · Autre",
      "Photo carte de visite via CameraX",
      "Case à cocher consentement RGPD obligatoire",
      "Layout responsive — colonne unique (mobile) · 2 colonnes (tablette)",
    ],
  },
  {
    id: 'camera',
    section: 'Fonctionnalités',
    title: 'Capture photo',
    subtitle: 'CameraX 1.3.1',
    points: [
      "CameraCapture.kt — composable réutilisable",
      "Preview en direct + capture JPEG",
      "Redimensionnement bitmap pour optimiser le stockage",
      "Chemin stocké dans Contact.photoPath (Room)",
      "Permission CAMERA déclarée dans le Manifest",
    ],
  },
  {
    id: 'rgpd',
    section: 'Fonctionnalités',
    title: 'Conformité RGPD',
    points: [
      "RGPDDialog.kt — dialogue de consentement explicite",
      "Soumission du formulaire bloquée sans consentement coché",
      "Données personnelles stockées uniquement en local (pas de cloud)",
      "Export uniquement à la demande explicite de l'admin",
      "Aucun tracking, aucune telemetry externe",
    ],
  },
  {
    id: 'historique',
    section: 'Fonctionnalités',
    title: 'Historique contacts',
    points: [
      "Liste de tous les leads capturés avec statut (pending / sent)",
      "ContactHistoryViewModel — Flow<List<Contact>> depuis Room",
      "ContactDetailDialog — vue complète avec photo et secteurs",
      "Tri par date de création (desc)",
      "Indicateur visuel du statut d'envoi email",
    ],
  },
  {
    id: 'export',
    section: 'Fonctionnalités',
    title: 'Export des données',
    points: [
      "Export CSV — fichier dans Documents, partageable via Intent",
      "Export email — SMTP Jakarta Mail avec SSL/TLS",
      "Pièce jointe PDF générée via Android PdfDocument API",
      "Template HTML email pour présentation professionnelle",
      "Configuration SMTP dans le panel admin (host, port, identifiants)",
    ],
  },
  {
    id: 'admin',
    section: 'Fonctionnalités',
    title: 'Panel administrateur',
    subtitle: 'Gestion de contenu sans redéploiement',
    points: [
      "AdminLoginScreen — authentification par mot de passe",
      "AdminModeBanner — indicateur visuel du mode admin actif",
      "ContentManager.kt — édition inline de tous les textes de l'UI",
      "TranslationService.kt — ML Kit pour traduction automatique",
      "SMTP Config — SmtpConfigDialog pour configurer l'envoi email",
    ],
  },
  {
    id: 'kiosque',
    section: 'Fonctionnalités',
    title: 'Mode kiosque',
    subtitle: 'Présentation immersive en salon',
    points: [
      "Fullscreen avec system bars masquées (WindowInsetsController)",
      "FLAG_KEEP_SCREEN_ON — écran toujours allumé",
      "Orientation paysage forcée (idéal tablette 10\")",
      "Navigation limitée — pas de retour OS possible depuis la démo",
      "Adapté à un usage sur stand sans surveillance constante",
    ],
  },
  {
    id: 'multilingue',
    section: 'Fonctionnalités',
    title: 'Support multilingue',
    subtitle: 'ML Kit Translate — on-device',
    points: [
      "ML Kit Translate 17.0.3 — traduction sans réseau",
      "LanguageManager — gestion de la langue active",
      "ContentManager — surcharge dynamique des chaînes",
      "Localization.kt — système de chaînes localisées",
      "Pas de connexion internet requise pour les traductions",
    ],
  },

  // ── 5. QUALITÉ & SÉCURITÉ ─────────────────────────────────────────────────
  {
    id: 'responsive',
    section: 'Qualité',
    title: 'Interface responsive',
    subtitle: 'Phone et tablette',
    points: [
      "ScreenType enum — détection automatique phone / tablet",
      "Dimensions.kt — espacements et tailles selon le form factor",
      "Formulaire contact : colonne unique → 2 colonnes côte à côte",
      "Catalogue : 2 colonnes → 3 colonnes ou plus",
      "Testé sur émulateurs Pixel 6 et tablette 10\"",
    ],
  },
  {
    id: 'securite',
    section: 'Qualité',
    title: 'Sécurité',
    points: [
      "Keystore signé (mon-app.jks) — APK release signé",
      "AndroidX FileProvider — partage sécurisé sans exposer les chemins",
      "Aucun secret hardcodé — SMTP via interface admin uniquement",
      "ProGuard disponible en release (obfuscation du bytecode)",
      "Permissions minimales déclarées dans le Manifest",
    ],
  },
  {
    id: 'tests',
    section: 'Qualité',
    title: 'Tests',
    points: [
      "JUnit 4/5 — tests unitaires des ViewModels et Repositories",
      "Mockk — mocking des interfaces Repository sans dépendance Room",
      "Turbine — test des flux Kotlin Flow (émissions, completions)",
      "Tests d'intégration Room — InstrumentedTest sur base en mémoire",
      "Architecture Clean — chaque couche testable indépendamment",
    ],
  },
  {
    id: 'performances',
    section: 'Qualité',
    title: 'Performances',
    points: [
      "Coil — cache mémoire + disque pour images, chargement lazy",
      "Filament — rendu 3D GPU-accéléré, hors du thread principal",
      "Kotlin Coroutines — toutes les I/O sur Dispatchers.IO",
      "Room Flow — mises à jour UI réactives sans polling",
      "Large heap activé pour la gestion des médias lourds",
    ],
  },

  // ── 6. DÉFIS & SOLUTIONS ──────────────────────────────────────────────────
  {
    id: 'defi-media',
    section: 'Défis',
    title: 'Défi 1 — Médias lourds',
    subtitle: 'Images, vidéos, PDFs, modèles 3D',
    points: [
      "Problème : chargement lent et OOM sur modèles 3D > 50 Mo",
      "Solution : chargement async sur Dispatchers.IO + Coil pour images",
      "Large heap (android:largeHeap=\"true\") pour Filament",
      "Bitmap sampling (inSampleSize) pour réduire la mémoire photos",
      "→ Résultat : aucun crash mémoire en utilisation salon",
    ],
  },
  {
    id: 'defi-filament',
    section: 'Défis',
    title: 'Défi 2 — Intégration Filament 3D',
    points: [
      "Problème : Filament nécessite une gestion manuelle du lifecycle",
      "Solution : FilamentViewer.kt encapsule Engine, Renderer, SwapChain",
      "Destruction explicite dans onCleared() du ViewModel",
      "SurfaceView dédié rattaché au cycle de vie Compose",
      "→ Rendu 3D stable, pas de fuite mémoire GPU",
    ],
  },
  {
    id: 'defi-offline',
    section: 'Défis',
    title: 'Défi 3 — Offline-first',
    subtitle: 'Application 100% fonctionnelle sans réseau',
    points: [
      "Problème : salons professionnels souvent sans WiFi fiable",
      "Solution : Room SQLite comme source de vérité unique",
      "Tous les médias copiés en stockage interne à l'installation",
      "ML Kit Translate fonctionne on-device sans connexion",
      "→ App entièrement utilisable hors ligne, même l'export CSV",
    ],
  },
  {
    id: 'defi-smtp',
    section: 'Défis',
    title: 'Défi 4 — Email SMTP sur Android',
    points: [
      "Problème : Android bloque les opérations réseau sur le main thread",
      "Solution : EmailService.kt sur Dispatchers.IO via coroutine",
      "Jakarta Mail (Angus Mail) — supporte SSL/TLS et authentification",
      "Gestion des erreurs : timeout, auth failure, SSL handshake",
      "→ Envoi fiable avec feedback utilisateur en cas d'erreur",
    ],
  },
  {
    id: 'defi-multilingue',
    section: 'Défis',
    title: 'Défi 5 — Multilingue dynamique',
    points: [
      "Problème : les chaînes doivent être modifiables par l'admin",
      "Solution : ContentManager stocke les overrides dans APP_SETTINGS",
      "ML Kit Translate pour les traductions automatiques à la demande",
      "LanguageManager centralise la langue active",
      "→ Commerciaux peuvent adapter les textes sans développeur",
    ],
  },

  // ── 7. COMPÉTENCES RNCP ───────────────────────────────────────────────────
  {
    id: 'rncp-intro',
    section: 'Compétences',
    title: 'Référentiel RNCP Niveau 6',
    subtitle: "Concepteur Développeur d'Applications Full Stack",
    points: [
      "C1 — Analyser les besoins et concevoir l'architecture applicative",
      "C2 — Développer des interfaces utilisateur adaptatives",
      "C3 — Concevoir et exploiter une base de données",
      "C4 — Développer des composants métier et services",
      "C5 — Travailler en contexte professionnel agile",
    ],
  },
  {
    id: 'c1',
    section: 'Compétences',
    title: 'C1 — Architecture applicative',
    points: [
      "Analyse du besoin métier → cahier des charges fonctionnel",
      "Choix architecturaux justifiés : MVVM + Clean Architecture",
      "Conception du schéma de base de données (5 entités, relations)",
      "Diagramme de navigation (NavGraph, 9 écrans)",
      "Choix des dépendances (Koin, Room, Filament) argumentés",
    ],
  },
  {
    id: 'c2',
    section: 'Compétences',
    title: 'C2 — Interfaces utilisateur',
    points: [
      "Jetpack Compose + Material 3 — UI déclarative moderne",
      "Composants réutilisables : SMPHeader, SMPNavigationBar, CameraCapture",
      "Responsive design — phone / tablette avec ScreenType",
      "Mode kiosque fullscreen avec gestion des system bars",
      "Accessibilité : contrastes Material 3, sémantique Compose",
    ],
  },
  {
    id: 'c3',
    section: 'Compétences',
    title: 'C3 — Base de données',
    points: [
      "Modélisation relationnelle : 5 entités, clés étrangères, cascade delete",
      "Room ORM avec DAOs typés (ContactDao, ProductDao, etc.)",
      "Requêtes Flow réactives — mises à jour UI automatiques",
      "DatabaseSeeder — initialisation des données au premier lancement",
      "Migrations Room pour les évolutions de schéma",
    ],
  },
  {
    id: 'c4',
    section: 'Compétences',
    title: 'C4 — Composants métier',
    points: [
      "EmailService.kt — service SMTP avec génération PDF",
      "TranslationService.kt — traduction ML Kit asynchrone",
      "ContentManager.kt — gestion des contenus éditables",
      "ExportViewModel — orchestration CSV + email",
      "Pattern Repository — isolation de la logique d'accès aux données",
    ],
  },
  {
    id: 'c5',
    section: 'Compétences',
    title: 'C5 — Contexte professionnel',
    points: [
      "Travail en autonomie au sein de l'équipe IT de SMP Moules",
      "Versioning Git avec branches feature / fix",
      "Livraison d'APK signé et documenté (apk.md)",
      "Communication avec les utilisateurs métier (commerciaux)",
      "Documentation technique : README, CLAUDE.md, AGENTS.md",
    ],
  },

  // ── 8. BILAN ──────────────────────────────────────────────────────────────
  {
    id: 'bilan-technique',
    section: 'Bilan',
    title: 'Bilan technique',
    points: [
      "Application Android production-ready, APK signé livré",
      "Architecture propre — chaque couche testable et évolutive",
      "Intégration de 10+ librairies Android majeures",
      "Première expérience significative de développement mobile natif",
      "Compréhension approfondie du cycle de vie Android",
    ],
  },
  {
    id: 'bilan-entreprise',
    section: 'Bilan',
    title: 'Apport pour SMP Moules',
    points: [
      "Remplacement des catalogues papier par une app interactive",
      "Capture structurée des leads — fini les cartes de visite perdues",
      "Export automatique des contacts vers le CRM via email",
      "Autonomie : les commerciaux mettent à jour les contenus eux-mêmes",
      "Image moderne de l'entreprise lors des salons professionnels",
    ],
  },
  {
    id: 'bilan-personnel',
    section: 'Bilan',
    title: "Ce que j'ai appris",
    points: [
      "Maîtrise de Kotlin et Jetpack Compose en contexte réel",
      "Architecture logicielle : MVVM, Clean Architecture, DI",
      "Gestion des APIs hardware Android (CameraX, Filament, Permissions)",
      "Rigueur sur la sécurité des données (RGPD, Keystore)",
      "Communication technique avec des parties prenantes non-développeurs",
    ],
  },
  {
    id: 'perspectives',
    section: 'Bilan',
    title: 'Perspectives & évolutions',
    points: [
      "Synchronisation cloud — backup des contacts sur serveur distant",
      "Analyse des prospects — statistiques par secteur, par salon",
      "Notifications push — rappels de suivi des leads non traités",
      "Version iOS — React Native pour mutualiser le code métier",
      "Mode hors ligne amélioré — sync différentielle au retour réseau",
    ],
  },

  // ── 9. CONCLUSION ─────────────────────────────────────────────────────────
  {
    id: 'conclusion',
    section: 'Conclusion',
    title: 'Conclusion',
    points: [
      "Application kiosque Android complète, livrée et utilisée en production",
      "Architecture MVVM + Clean — maintenable, testable, évolutive",
      "Stack moderne : Kotlin · Compose · Room · Koin · Filament · CameraX",
      "Compétences RNCP niveau 6 couvertes de la conception à la livraison",
      "→ Questions ?",
    ],
  },
]

const SECTIONS = [...new Set(SLIDES.map(s => s.section))]

export default function Oral() {
  const [current, setCurrent] = useState(0)
  const total = SLIDES.length

  const prev = useCallback(() => setCurrent(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setCurrent(i => Math.min(total - 1, i + 1)), [total])

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

  const slide = SLIDES[current]
  const sectionIndex = SECTIONS.indexOf(slide.section)

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
                onClick={() => setCurrent(SLIDES.findIndex(sl => sl.section === s))}
                title={s}
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
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Diapositive précédente"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            aria-label="Diapositive suivante"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </nav>
      </header>

      {/* Slide content */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-8 lg:px-24">
        <div key={slide.id} className="w-full max-w-3xl slide-enter">
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
              <li key={point} className="flex items-start gap-4 text-zinc-300 text-lg">
                <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-zinc-800/60">
        <div
          className="h-full bg-[#e8ff00] transition-all duration-500 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
