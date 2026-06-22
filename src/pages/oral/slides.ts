export interface SlidePoint {
  text: string
  detail?: string
  image?: string
  video?: string
  code?: string
  diagram?: 'architecture' | 'db'
}

export interface Slide {
  id: string
  section: string
  title: string
  subtitle?: string
  points: SlidePoint[]
}

export const SLIDES: Slide[] = [
  // ── 1. INTRODUCTION ──────────────────────────────────────────────────────
  {
    id: 'titre',
    section: 'Introduction',
    title: 'SMP-Commercial',
    subtitle: 'Application Android de présentation commerciale — Titre RNCP Développeur Full Stack · Niveau 6',
    points: [
      { text: 'Loic Michaud', detail: 'Développeur Full Stack en alternance, passionné par le mobile natif et les architectures propres.' },
      { text: 'Alternance chez SMP Moules', detail: 'Entreprise industrielle basée en France, spécialisée dans la fabrication de moules de précision pour les secteurs pharmacie, cosmétique et emballage.' },
      { text: 'Année 2025–2026', detail: "Projet développé sur l'intégralité de l'année d'alternance, de la conception à la livraison de l'APK signé en production." },
    ],
  },
  {
    id: 'entreprise',
    section: 'Introduction',
    title: 'SMP Moules',
    subtitle: "Contexte de l'alternance",
    points: [
      { text: "Entreprise spécialisée dans la fabrication de moules industriels", detail: "SMP Moules conçoit et fabrique des moules de précision utilisés dans les processus d'injection plastique pour des industries exigeantes." },
      { text: "Secteurs clients : pharmacie, cosmétique, emballage", detail: "Les clients finaux sont des groupes internationaux qui imposent des tolérances très strictes — ce qui exige une présentation commerciale irréprochable en salon." },
      { text: "Besoin : moderniser la présentation commerciale en salon professionnel", detail: "Les équipes commerciales participaient à des salons professionnels avec des catalogues papier statiques, sans possibilité de montrer des vidéos ou de mémoriser les contacts rencontrés." },
      { text: "Mon rôle : développeur mobile et informaticien en alternance", detail: "J'ai assuré la conception, le développement, les tests et la livraison de l'application en totale autonomie, en lien direct avec les commerciaux utilisateurs." },
    ],
  },
  {
    id: 'problematique',
    section: 'Introduction',
    title: 'Problématique métier',
    subtitle: 'Pourquoi ce projet ?',
    points: [
      { text: "Les commerciaux présentaient les produits sous format physique", detail: "Catalogues papier coûteux à imprimer, impossibles à mettre à jour en temps réel et limités au texte et aux photos statiques." },
      { text: "Aucune capture structurée des contacts prospects en salon", detail: "Les coordonnées des visiteurs intéressés étaient notées à la main sur des feuilles volantes, souvent perdues ou illisibles après le salon." },
      { text: "Impossibilité de montrer des vidéos produit", detail: "Les procédés de fabrication et les démonstrations de moules en action ne pouvaient pas être montrés sans connexion internet, peu fiable dans les halls d'exposition." },
      { text: "Objectif : une application kiosque interactive, offline, sur tablette Android", detail: "Remplacer le papier par une tablette 10\" posée sur le stand, entièrement autonome, capable d'afficher le catalogue, lire des vidéos et capturer les leads sans aucun réseau." },
    ],
  },
  {
    id: 'objectifs',
    section: 'Introduction',
    title: 'Objectifs du projet',
    points: [
      { text: "Catalogue produit multimédia : images, vidéos, PDF", detail: "Chaque produit dispose d'une fiche avec galerie photos, vidéo de démonstration et plan technique PDF, tous stockés localement sur la tablette." },
      { text: "Formulaire de capture de leads avec photo de carte de visite", detail: "Un formulaire structuré permet de saisir société, secteur, email, téléphone et de photographier la carte de visite du prospect directement avec l'appareil photo de la tablette." },
      { text: "Fonctionnement hors ligne avec base de données locale", detail: "Room SQLite est la source de vérité unique — aucune donnée ne transite par internet pendant l'utilisation en salon, garantissant une disponibilité 100% même sans WiFi." },
      { text: "Panel admin pour mettre à jour les contenus sans redéployer", detail: "Les commerciaux peuvent modifier textes, photos et vidéos directement depuis la tablette, sans intervention du développeur ni mise à jour de l'application." },
      { text: "Export des contacts par email avec rapport PDF", detail: "Après chaque salon, l'admin déclenche l'envoi par email d'un rapport PDF listant tous les leads capturés, avec leurs coordonnées et secteurs d'intérêt." },
    ],
  },

  {
    id: 'cdc-objectifs',
    section: 'Introduction',
    title: 'Cahier des charges',
    subtitle: 'Les 5 objectifs définis en amont',
    points: [
      {
        text: 'Prise de contacts clients — formulaire + envoi email différé',
        detail: "Saisir société, interlocuteur, email, téléphone, secteur et notes. L'envoi email est différé si hors ligne — les contacts sont sauvegardés localement et envoyés dès la reconnexion.",
      },
      {
        text: 'Présentation de SMP — films, photos, informations entreprise',
        detail: "Écran d'accueil avec branding SMP, diffusion de vidéos de présentation et de photos de l'entreprise. Tout le contenu stocké localement pour une disponibilité 100% sur stand.",
      },
      {
        text: 'Catalogue de réalisations — moules avec photos, vidéos, plans 2D/3D',
        detail: 'Navigation par catégories (cosmétique, pharmacie, emballage…), fiches produits avec galerie photos, vidéos de démonstration, visualisation de modèles 3D et plans PDF.',
      },
      {
        text: 'Mise à jour simplifiée — gestion des contenus sans redéploiement',
        detail: "Initialement prévu via un dossier partagé SMB depuis un ordinateur. Devenu un panel admin intégré directement dans l'application — voir slide suivante.",
      },
      {
        text: 'Fonctionnement hors ligne — PRIORITÉ ABSOLUE',
        detail: '"Toute l\'application doit fonctionner parfaitement sans connexion. Aucun écran de chargement infini ou d\'erreur réseau." — verbatim du cahier des charges. Tous les contenus synchronisés, toutes les saisies de contacts, toutes les consultations : 100% offline.',
      },
    ],
  },

  // ── 2. ANALYSE & CONCEPTION ───────────────────────────────────────────────
  {
    id: 'choix-plateforme',
    section: 'Conception',
    title: 'Choix de la plateforme',
    subtitle: 'Android natif vs cross-platform',
    points: [
      { text: "React Native / Flutter → performances insuffisantes pour le rendu 3D", detail: "Les bridges JavaScript introduisent une latence incompatible avec le rendu temps réel de modèles 3D via Filament, bibliothèque de rendu physiquement basé de Google." },
      { text: "PWA → pas d'accès natif à CameraX, Filament, stockage", detail: "Une Progressive Web App n'a pas accès aux APIs bas niveau Android nécessaires : contrôle de la caméra, rendu GPU Filament et gestion du stockage interne de l'application." },
      { text: "Android natif Kotlin → accès complet aux APIs hardware", detail: "Kotlin donne accès direct à toute l'API Android : CameraX pour la capture, WindowInsetsController pour le plein écran, et FLAG_KEEP_SCREEN_ON pour l'écran toujours allumé." },
      { text: "Jetpack Compose → UI déclarative moderne, maintenance simplifiée", detail: "Compose élimine le XML et les vues impératives. Les composables réactifs aux StateFlow permettent de construire une UI entièrement pilotée par l'état, sans boilerplate." },
      { text: "→ Choix : Android natif Kotlin + Compose Material 3", detail: "Ce choix garantit les meilleures performances hardware, une UI moderne Material 3 et une architecture propre MVVM — idéal pour un projet livré en production sur tablette." },
    ],
  },
  {
    id: 'cdc-pivots',
    section: 'Conception',
    title: 'Du CDC à la livraison',
    subtitle: 'Ce qui a évolué — et pourquoi',
    points: [
      {
        text: 'UI : XML Views + Material 3 → Jetpack Compose',
        detail: 'Le CDC recommandait XML Views, solution stable et documentée. Compose a été adopté pour son UI déclarative, ses recompositions réactives aux StateFlow et sa cohérence avec les guidelines Google 2025. Résultat : zéro boilerplate XML, composants réutilisables.',
      },
      {
        text: 'Sync contenus : dossier partagé SMB → panel admin intégré',
        detail: "Le CDC prévoyait une synchronisation depuis un dossier réseau SMB (jcifs-ng). Cette architecture nécessitait un ordinateur sur le même réseau local. Le panel admin directement dans l'app répond au même besoin sans aucune infrastructure réseau — plus robuste pour une utilisation en salon.",
      },
      {
        text: 'State management : LiveData → StateFlow + Coroutines',
        detail: "Le CDC citait LiveData, solution officielle Jetpack de l'époque. StateFlow a été préféré : pas de dépendance Android dans le ViewModel, testable en JVM pur sans InstantTaskExecutorRule, et cohérent avec l'ensemble de l'architecture coroutines du projet.",
      },
      {
        text: 'Email : WorkManager + file d\'attente → SMTP direct sur Dispatchers.IO',
        detail: "Le CDC planifiait WorkManager pour gérer une file d'attente d'emails différés avec reprise automatique. Jakarta Mail sur Dispatchers.IO avec feedback immédiat à l'admin s'est avéré plus simple, plus direct et plus transparent — l'admin voit le résultat en temps réel.",
      },
      {
        text: '→ Le CDC posait les bases, l\'implémentation a affiné chaque choix',
        detail: "Chaque pivot répond à une contrainte découverte pendant le développement : complexité d'infrastructure, testabilité, cohérence architecturale. La spec initiale était solide — les évolutions l'ont rendue plus pragmatique.",
      },
    ],
  },

  {
    id: 'maquettes',
    section: 'Conception',
    title: 'Maquettes Figma',
    subtitle: 'Wireframes haute fidélité validés avant développement',
    points: [
      {
        text: 'Navigation principale — 4 onglets + header SMP',
        detail: "Barre de navigation fixe en haut avec les 4 sections : Accueil, Contact, Catalogue, Présentation. L'onglet actif est mis en surbrillance en rouge (couleur SMP). Header avec logo, mention RGPD et accès paramètres — structure reprise telle quelle dans l'app finale.",
        image: '/oral/figma/wireframe-catalogue.png',
      },
      {
        text: 'Catalogue — grille de produits avec cards arrondies',
        detail: "Grille 4 colonnes de cards produits avec coins arrondis et image de couverture. La première card montre un exemple réel (pompe cosmétique). Les autres sont des placeholders — l'admin peuple la grille sans recompiler.",
        image: '/oral/figma/wireframe-catalogue.png',
      },
      {
        text: 'Détail produit — tabs Photos · Modèle 3D · Plans · Vidéo',
        detail: "Chaque fiche produit est organisée en 4 onglets. Le tab actif est mis en rouge. La zone centrale est dédiée au rendu du média sélectionné : viewer Filament 3D, galerie photos, grille de PDFs, ou lecteur ExoPlayer.",
        image: '/oral/figma/wireframe-detail-3d.png',
      },
      {
        text: 'Plans — grille 2×2 de documents PDF',
        detail: "L'onglet Plans affiche jusqu'à 4 plans techniques en grille 2×2. Un tap ouvre le PDF dans WebKit. Les placeholders étaient prévus pour être peuplés par l'admin via upload depuis la fiche produit.",
        image: '/oral/figma/wireframe-detail-plans.png',
      },
      {
        text: 'Vidéo — lecteur pleine largeur avec contrôles natifs',
        detail: "L'onglet Vidéo affiche un player ExoPlayer pleine largeur avec les contrôles play/pause/seek. La vidéo est stockée localement — aucun streaming, lecture instantanée même sans réseau.",
        image: '/oral/figma/wireframe-detail-video.png',
      },
    ],
  },

  {
    id: 'evolution-ui',
    section: 'Conception',
    title: "Évolution de l'interface",
    subtitle: 'Wireframe → app finale : ce que les retours utilisateurs ont changé',
    points: [
      {
        text: "Accueil — d'une navigation simple à un écran de marque complet",
        detail: "La wireframe ne montrait pas d'écran d'accueil — juste la navigation. Après les premières démos avec les commerciaux, le besoin est apparu : présenter SMP avant tout. Résultat : branding, 4 chiffres clés (50+ ans, 1000+ moules, 3 secteurs, 100% Made in France), photo des locaux et frise historique 1972–2024.",
        image: '/oral/figma/app-accueil.jpg',
      },
      {
        text: "Catalogue — grille de placeholders → recherche + tags + cards riches",
        detail: "Wireframe : grille de cards grises sans contenu. App finale : barre de recherche full-text, tags filtrables par secteur (PET, PP, cosmétique, emballage…), cards avec icône, nom de catégorie, description et bouton CTA. Ajout demandé après retour : les commerciaux voulaient filtrer rapidement par secteur client.",
        image: '/oral/figma/app-catalogue.jpg',
      },
      {
        text: "Contact — absent de la wireframe initiale, entièrement conçu en itération",
        detail: "Le formulaire de contact n'était pas maquetté dans Figma. Il a été conçu directement en code après les premières discussions sur le terrain. Layout 2 colonnes responsive (champs à gauche, capture photo CameraX à droite), 8 secteurs à cocher, zone notes, case RGPD obligatoire avant le bouton Enregistrer.",
        image: '/oral/figma/app-contact.jpg',
      },
    ],
  },

  {
    id: 'architecture',
    section: 'Conception',
    title: 'Architecture MVVM + Clean',
    subtitle: '3 couches strictement séparées',
    points: [
      { text: "Domain Layer — interfaces Repository, modèles métier purs", detail: "Le Domain Layer définit les contrats (interfaces Repository) et les modèles métier sans aucune dépendance Android. Il peut être testé en pur JVM sans émulateur.", image: '/oral/code/repository-interface.png' },
      { text: "Data Layer — implémentations Room, DAOs, services (SMTP, email)", detail: "Le Data Layer implémente les interfaces du Domain : les DAOs Room accèdent à SQLite, et EmailService.kt gère l'envoi SMTP via Jakarta Mail sur Dispatchers.IO.", image: '/oral/code/contact-dao.png' },
      { text: "Presentation Layer — ViewModels, états UI, composables Compose", detail: "Les ViewModels exposent des StateFlow d'états UI immuables. Les composables Compose s'abonnent via collectAsStateWithLifecycle() et se recomposent uniquement si l'état change.", image: '/oral/code/viewmodel-stateflow.png' },
      { text: "→ Couplage faible, testabilité maximale, évolutivité", detail: "Chaque couche est testable indépendamment : le Domain en JUnit pur, le Data avec des bases Room en mémoire, et la Presentation avec des faux Repository via Mockk." },
    ],
  },
  {
    id: 'schema-archi',
    section: 'Conception',
    title: 'Flux de données',
    subtitle: 'MVVM avec StateFlow et Coroutines',
    points: [
      { text: "UI Compose — observe StateFlow via collectAsStateWithLifecycle()", detail: "collectAsStateWithLifecycle() arrête automatiquement la collecte quand le composable quitte le cycle de vie actif, évitant les fuites mémoire sur Android." },
      { text: "ViewModel — expose états UI, orchestre les cas d'usage", detail: "Le ViewModel transforme les données brutes du Repository en états UI consommables (UiState sealed class : Loading, Success, Error) et survit aux rotations d'écran." },
      { text: "Repository (interface) — contrat du Domain Layer", detail: "L'interface Repository définit le contrat métier sans détail d'implémentation. Le ViewModel n'a jamais connaissance de Room, SQL ou Jakarta Mail — uniquement de ce contrat." },
      { text: "RepositoryImpl (data) — implémentation Room + services", detail: "L'implémentation concrète orchestre les DAOs Room, le cache et les services. Elle est injectée par Koin au lieu de l'interface, invisible pour le ViewModel." },
      { text: "Room DAO → SQLite local — persistance offline-first", detail: "Room génère automatiquement le code SQL à la compilation via les annotations @Dao. Les requêtes retournent des Flow<List<T>> qui émettent automatiquement quand la base est modifiée." },
    ],
  },
  {
    id: 'bdd',
    section: 'Conception',
    title: 'Schéma de base de données',
    subtitle: '5 entités Room / SQLite',
    points: [
      { text: "CATEGORIES — id, nom, description, emoji, imagePath, ordre", detail: "Chaque catégorie porte un emoji affiché sur la carte de la grille, une image de couverture et un champ ordre permettant au commercial de réorganiser l'affichage sans toucher au code." },
      { text: "PRODUCTS — id, categoryId (FK), nom, specs, imagePaths (JSON), model3dPath, videoPath, pdfPath", detail: "imagePaths est sérialisé en JSON dans la colonne SQLite grâce à kotlinx-serialization, permettant de stocker une liste de chemins sans table de jonction supplémentaire." },
      { text: "CONTACTS — id, société, email, téléphone, secteurs, photoPath, statut (pending|sent), timestamps", detail: "Le champ statut (pending | sent) permet de suivre l'état d'envoi email de chaque lead. Un indicateur visuel dans l'historique reflète ce statut en temps réel via Room Flow.", image: '/oral/code/contact-entity.png' },
      { text: "MEDIA_FILES — id, fileName, filePath, mimeType, fileSize", detail: "Cette table centralise les métadonnées des fichiers uploadés par l'admin, facilitant la gestion du stockage et permettant une suppression propre sans orphelins sur le disque." },
      { text: "APP_SETTINGS — clé / valeur (config SMTP, traductions, paramètres admin)", detail: "Table clé/valeur flexible qui stocke la configuration SMTP (host, port, identifiants chiffrés), les surcharges de chaînes multilingues et les préférences admin sans migration de schéma." },
    ],
  },
  {
    id: 'di',
    section: 'Conception',
    title: 'Injection de dépendances',
    subtitle: 'Koin 3.5.3 — 3 modules',
    points: [
      { text: "DatabaseModule — Room AppDatabase, tous les DAOs", detail: "Déclare l'AppDatabase en singleton et expose chaque DAO (contactDao, productDao, categoryDao...) comme dépendance injectable. La base est créée une seule fois à l'init de l'app." },
      { text: "RepositoryModule — lie interfaces Domain aux implémentations Data", detail: "Koin mappe chaque interface du Domain vers son implémentation Data : bind<ContactRepository>() { ContactRepositoryImpl(get()) }. Le ViewModel ne voit jamais l'implémentation concrète.", image: '/oral/code/koin-modules.png' },
      { text: "ViewModelModule — ViewModels de chaque écran", detail: "Chaque ViewModel est déclaré avec viewModel { ... } pour que Koin le crée et le détruise selon le cycle de vie Android, avec injection automatique des dépendances Repository." },
      { text: "→ Aucun couplage direct entre couches, mocks faciles en test", detail: "En test, il suffit de remplacer un module Koin par un module de test injectant des faux Repository — sans modifier une ligne de code de production." },
    ],
  },

  // ── 3. STACK TECHNIQUE ────────────────────────────────────────────────────
  {
    id: 'stack',
    section: 'Stack',
    title: 'Stack technique',
    subtitle: "Vue d'ensemble",
    points: [
      { text: "Langage : Kotlin 2.1.0 — coroutines, extension functions, sealed classes", detail: "Kotlin 2.1.0 apporte le compilateur K2 plus rapide et des improvements sur les sealed classes. Les coroutines remplacent tous les callbacks et les AsyncTask obsolètes d'Android." },
      { text: "UI : Jetpack Compose + Material 3 (BOM 2024.12)", detail: "La BOM (Bill of Materials) 2024.12 garantit la cohérence des versions de toutes les librairies Compose. Material 3 fournit les composants visuels (Card, Button, Dialog) et le système de couleurs dynamiques." },
      { text: "Base de données : Room 2.6.1 (SQLite, DAOs, Flow réactif)", detail: "Room abstrait SQLite tout en conservant ses performances. Les DAOs annotés génèrent du code SQL à la compilation — les erreurs SQL sont détectées au build, pas à l'exécution." },
      { text: "DI : Koin 3.5.3", detail: "Koin est léger (pas de génération de code à la compilation contrairement à Dagger/Hilt) et s'intègre nativement avec les ViewModels Android et le cycle de vie Compose." },
      { text: "Build : Gradle 8.13 + AGP 8.9.1, libs.versions.toml centralisé", detail: "Le fichier libs.versions.toml centralise toutes les versions de dépendances en un seul endroit. Le projet s'appuie sur Gradle 8.13 et le plugin Android Gradle (AGP) 8.9.1." },
      { text: "SDK min : Android 24 · Target : Android 35", detail: "Android 24 (Android 7.0, 2016) couvre 95%+ des appareils Android actifs. Le target SDK 35 (Android 15) garantit la compatibilité avec les comportements récents du système." },
    ],
  },
  {
    id: 'stack-media',
    section: 'Stack',
    title: 'Librairies multimédia',
    points: [
      { text: "CameraX 1.3.1 — capture photo de carte de visite", detail: "CameraX abstrait les différences entre les fabricants Android pour la gestion caméra. Elle expose une API unifiée de Preview, ImageCapture et ImageAnalysis compatible avec tous les appareils cibles." },
      { text: "Media3 ExoPlayer 1.2.1 — lecture vidéo", detail: "ExoPlayer est le player vidéo standard recommandé par Google. Il gère nativement le cycle de vie Android (pause en background), les formats MP4/WebM et s'intègre comme composable Compose." },
      { text: "Coil 2.5.0 — chargement et cache des images", detail: "Coil (Coroutine Image Loader) est conçu pour Kotlin et Compose. Il gère un cache deux niveaux (mémoire + disque), le chargement asynchrone et le redimensionnement à la demande." },
      { text: "AndroidX WebKit 1.12.1 — visualisation PDF", detail: "WebKit permet d'afficher des PDF via une WebView sécurisée avec accès aux fichiers locaux restreint par FileProvider. C'est la solution la plus légère sans dépendance externe de rendu PDF." },
    ],
  },
  {
    id: 'stack-services',
    section: 'Stack',
    title: 'Services & intégrations',
    points: [
      { text: "Angus Mail (Jakarta Mail) 2.0.2 — envoi SMTP avec SSL/TLS", detail: "Jakarta Mail (anciennement JavaMail) est la référence pour l'envoi email en Java/Kotlin. Angus Mail est l'implémentation officielle de référence, compatible Gmail, Office 365 et serveurs SMTP personnalisés." },
      { text: "ML Kit Translate 17.0.3 — traduction multilingue on-device", detail: "ML Kit Translate télécharge des modèles de langue compacts (~15 Mo chacun) et effectue toutes les traductions localement sans envoyer de données à Google. Français, anglais et allemand sont supportés." },
      { text: "Android PdfDocument API — génération de rapports PDF", detail: "L'API native Android PdfDocument génère des PDF en dessinant sur un Canvas — textes, tableaux, logos. Aucune dépendance externe requise, les PDFs sont générés directement en mémoire." },
      { text: "kotlinx-serialization — sérialisation JSON (imagePaths en BDD)", detail: "kotlinx-serialization est la solution officielle Kotlin pour JSON. Elle est utilisée pour sérialiser les listes de chemins d'images (imagePaths) en colonne TEXT dans Room via un TypeConverter." },
      { text: "JUnit 4/5 + Mockk + Turbine — tests unitaires et Flow", detail: "Mockk est l'alternative Kotlin à Mockito, avec une API fluente adaptée aux suspend functions. Turbine est une librairie de test dédiée aux Kotlin Flow, permettant de tester les émissions séquentiellement." },
    ],
  },

  // ── 4. FONCTIONNALITÉS ────────────────────────────────────────────────────
  {
    id: 'navigation-ui',
    section: 'Fonctionnalités',
    title: 'Navigation & architecture UI',
    points: [
      { text: "Single-Activity — un seul MainActivity, tout en Compose", detail: "Le pattern Single-Activity est la recommandation officielle Google avec Compose. Une seule Activity héberge tout le NavGraph — pas de FragmentManager, pas de back stack complexe à gérer." },
      { text: "Jetpack Navigation Compose 2.8.5 — NavGraph typé", detail: "Navigation Compose 2.8.5 introduit les routes typées (type-safe navigation) via des sealed classes Screen. Les arguments passés entre écrans sont validés à la compilation, plus de StringExtra." },
      { text: "BottomNavBar — Accueil · Catalogue · Contact · Export", detail: "La barre de navigation inférieure (SMPNavigationBar.kt) utilise NavigationBar de Material 3 avec 4 destinations. L'onglet actif est mis en surbrillance via currentBackStackEntry observé en StateFlow." },
      { text: "SMPHeader — barre supérieure unifiée avec accès admin", detail: "SMPHeader.kt est un composable partagé affiché sur tous les écrans. Il expose un bouton d'accès discret au mode admin et le nom de l'écran courant, garantissant une cohérence visuelle globale." },
      { text: "Portrait verrouillé — orientation fixe pour un affichage cohérent", detail: "L'orientation est verrouillée en portrait dans le Manifest via screenOrientation=\"portrait\", garantissant un affichage identique quelle que soit la manipulation de la tablette sur le stand." },
    ],
  },
  {
    id: 'accueil',
    section: 'Fonctionnalités',
    title: "Écran d'accueil",
    points: [
      { text: "Page d'entrée de l'application kiosque", detail: "L'écran d'accueil est la première vue que le visiteur voit sur le stand. Il donne une impression professionnelle immédiate avec le branding SMP Moules et une invitation à explorer le catalogue." },
      { text: "Branding SMP Moules avec logo et présentation", detail: "Logo, slogan et chiffres clés de l'entreprise (années d'expérience, nombre de clients, secteurs) affichés avec un layout éditorial. Tous les textes sont éditables inline par l'admin." },
      { text: "Accès rapide aux sections principales", detail: "Des boutons d'action primaires redirigent directement vers le catalogue produits et le formulaire de contact, réduisant le nombre de taps pour un visiteur non familier avec l'interface." },
      { text: "Mode présentation — plein écran immersif (system bars masquées)", detail: "WindowInsetsController masque la barre de statut et la barre de navigation Android pour un affichage plein écran total, sans distraction UI système pendant la présentation sur stand." },
      { text: "Screen toujours allumé (FLAG_KEEP_SCREEN_ON)", detail: "Le flag FLAG_KEEP_SCREEN_ON empêche la tablette de s'endormir pendant la présentation. Il est activé sur MainActivity et respecte le cycle de vie Android (désactivé en background)." },
    ],
  },
  {
    id: 'catalogue',
    section: 'Fonctionnalités',
    title: 'Catalogue produits',
    subtitle: 'Grille de catégories',
    points: [
      { text: "Grille responsive — 2 colonnes (téléphone) · 3+ (tablette)", detail: "LazyVerticalGrid adapte automatiquement le nombre de colonnes selon la largeur d'écran via GridCells.Adaptive(minSize = 180.dp) — 2 colonnes sur téléphone, 3 ou 4 sur tablette." },
      { text: "Cartes catégorie avec emoji, image et nom", detail: "Chaque CategoryCard affiche l'emoji représentatif, l'image de couverture chargée par Coil et le nom de la catégorie. Un effet d'élévation Material 3 indique l'interactivité au visiteur." },
      { text: "Données chargées depuis Room via CatalogViewModel (Flow)", detail: "CatalogViewModel expose un Flow<List<Category>> collecté depuis CategoryDao. Toute modification de la base (ajout admin) déclenche automatiquement une recomposition de la grille." },
      { text: "Admin : ajout / suppression de catégories, upload image", detail: "En mode admin, un FAB (Floating Action Button) apparaît pour ajouter une catégorie. Chaque carte affiche un bouton de suppression avec confirmation. L'image peut être uploadée depuis la galerie ou la caméra." },
      { text: "Navigation → liste des produits de la catégorie", detail: "Un clic sur une catégorie navigue vers ProductListScreen en passant le categoryId comme argument typé. La liste des produits est filtrée en base : SELECT * FROM products WHERE categoryId = :id." },
    ],
  },
  {
    id: 'produit-detail',
    section: 'Fonctionnalités',
    title: 'Détail produit',
    points: [
      { text: "Nom, description, spécifications techniques", detail: "Les spécifications techniques (matériaux, tolérances, dimensions) sont affichées dans un tableau structuré. En mode admin, chaque champ texte est remplacé par un EditableText cliquable pour modification inline." },
      { text: "Galerie d'images avec Coil (cache disque + mémoire)", detail: "HorizontalPager de Accompanist affiche les images en pleine largeur avec swipe. Coil charge chaque image depuis le stockage interne avec un cache disque persistant et un cache mémoire LRU." },
      { text: "Boutons d'accès aux médias : PDF · Vidéo · Modèle 3D", detail: "Trois boutons conditionnels (visibles seulement si le média existe en base) redirigent vers PdfViewerScreen, VideoPlayerScreen ou le viewer Filament 3D. L'absence de média cache automatiquement le bouton." },
      { text: "Admin : édition inline des textes, upload de médias", detail: "ContentManager.kt détecte le mode admin actif et remplace les Text() Compose par des OutlinedTextField éditables. Les modifications sont persistées immédiatement dans Room via ProductRepositoryImpl." },
      { text: "Persistance via ProductRepositoryImpl → Room", detail: "Toutes les modifications (textes, chemins de médias) transitent par ProductRepositoryImpl qui appelle les DAOs Room sur Dispatchers.IO. Le StateFlow du ViewModel se met à jour automatiquement après écriture." },
    ],
  },
  {
    id: 'pdf',
    section: 'Fonctionnalités',
    title: 'Visualiseur PDF',
    points: [
      { text: "Chargement via AndroidX WebKit (WebView sécurisé)", detail: "La WebView est configurée avec WebSettings.allowFileAccess = false et n'autorise l'accès qu'aux fichiers exposés via FileProvider, évitant toute fuite de fichiers système." },
      { text: "Fichiers PDF stockés localement dans le stockage interne", detail: "Les PDFs sont copiés dans getFilesDir() de l'application lors de l'upload admin — un répertoire privé inaccessible aux autres applications, sans nécessiter de permissions de stockage externe." },
      { text: "Accès sécurisé via AndroidX FileProvider", detail: "FileProvider génère des URI temporaires (content://) pour partager les fichiers PDF avec la WebView sans exposer les chemins absolus du système de fichiers Android." },
      { text: "Navigation plein écran sans quitter l'app", detail: "PdfViewerScreen s'affiche en fullscreen avec une barre de navigation minimaliste. Le visiteur reste dans l'expérience SMP Commercial — pas de navigation vers Adobe Reader ou un autre viewer externe." },
      { text: "Utilisation : fiches techniques, catalogues produit", detail: "Chaque produit peut avoir un PDF associé (fiche technique, datasheet, plan 2D). L'admin upload le PDF depuis la galerie ou les fichiers, et le chemin est stocké dans le champ pdfPath de la table PRODUCTS." },
    ],
  },
  {
    id: 'video',
    section: 'Fonctionnalités',
    title: 'Lecteur vidéo',
    subtitle: 'Media3 ExoPlayer 1.2.1',
    points: [
      { text: "Lecture de vidéos produit stockées localement", detail: "Les vidéos MP4 sont stockées dans le stockage interne de l'application. ExoPlayer les charge via une URI locale — aucune connexion réseau requise, latence de démarrage minimale." },
      { text: "Contrôles natifs (play/pause, seek, plein écran)", detail: "PlayerView d'ExoPlayer fournit une UI de contrôle standard : play/pause, barre de progression seekable, bouton plein écran et indicateur de durée — familière pour tout utilisateur Android." },
      { text: "Intégré dans le DetailScreen au côté des autres médias", detail: "Le lecteur vidéo est accessible via un bouton dédié sur la fiche produit. La navigation vers VideoPlayerScreen se fait proprement via le NavGraph, avec le productId en argument typé." },
      { text: "Gestion du lifecycle — pause automatique en background", detail: "ExoPlayer est lié au lifecycle de l'écran via DisposableEffect. Il se met en pause automatiquement si l'utilisateur change d'onglet et libère ses ressources quand le composable quitte la composition." },
    ],
  },
  {
    id: 'contact-form',
    section: 'Fonctionnalités',
    title: 'Formulaire de contact',
    subtitle: 'Capture de leads en salon',
    points: [
      { text: "Champs : société, interlocuteur, email, téléphone, notes", detail: "Chaque champ est un OutlinedTextField Material 3 avec validation en temps réel. Le champ email vérifie le format via regex et affiche une erreur inline avant la soumission." },
      { text: "Secteurs (cases à cocher) : Pharmacie · Cosmétique · Emballage · Auto · Aéro · Électronique · Agri · Autre", detail: "Les secteurs sont stockés en JSON dans la colonne sectors de la table CONTACTS. Le visiteur peut sélectionner plusieurs secteurs — permettant une qualification précise du prospect." },
      { text: "Photo carte de visite via CameraX", detail: "Un bouton lance CameraCapture.kt, un composable réutilisable basé sur CameraX. La photo JPEG est capturée, redimensionnée pour optimiser le stockage, et son chemin stocké dans Contact.photoPath." },
      { text: "Case à cocher consentement RGPD obligatoire", detail: "Le bouton Enregistrer est désactivé tant que la case RGPD n'est pas cochée. RGPDDialog.kt affiche le texte légal complet avant la première utilisation du formulaire sur la tablette." },
      { text: "Layout responsive — colonne unique (mobile) · 2 colonnes (tablette)", detail: "Sur tablette en paysage, le formulaire se divise en deux colonnes : informations de contact à gauche, secteurs et notes à droite. ScreenType.TABLET détecte le form factor et adapte le layout." },
    ],
  },
  {
    id: 'camera',
    section: 'Fonctionnalités',
    title: 'Capture photo',
    subtitle: 'CameraX 1.3.1',
    points: [
      { text: "CameraCapture.kt — composable réutilisable", detail: "CameraCapture.kt est un composable autonome qui gère toute la logique caméra : demande de permission, preview en direct, capture et retour du chemin du fichier via callback." },
      { text: "Preview en direct + capture JPEG", detail: "La Preview CameraX affiche le flux caméra en temps réel dans un AndroidView intégré à Compose. ImageCapture déclenche la capture sur bouton et sauvegarde le fichier JPEG dans le stockage interne." },
      { text: "Redimensionnement bitmap pour optimiser le stockage", detail: "Après capture, le bitmap est redimensionné à 800×600 max via BitmapFactory.Options(inSampleSize). Cela réduit la taille de 5-8 Mo (photo brute) à ~200 Ko sans perte de lisibilité." },
      { text: "Chemin stocké dans Contact.photoPath (Room)", detail: "Le chemin absolu du fichier JPEG est stocké dans la colonne photoPath de la table CONTACTS. ContactDetailDialog charge la photo via Coil en utilisant ce chemin pour afficher la carte de visite." },
      { text: "Permission CAMERA déclarée dans le Manifest", detail: "La permission CAMERA est déclarée dans AndroidManifest.xml. CameraCapture vérifie son état via PermissionState de Accompanist et affiche un dialogue explicatif si elle n'est pas encore accordée." },
    ],
  },
  {
    id: 'rgpd',
    section: 'Fonctionnalités',
    title: 'Conformité RGPD',
    points: [
      { text: "RGPDDialog.kt — dialogue de consentement explicite", detail: "RGPDDialog s'affiche lors de la première utilisation du formulaire et explique quelles données sont collectées, dans quel but et combien de temps elles sont conservées, conformément à l'article 13 du RGPD." },
      { text: "Soumission du formulaire bloquée sans consentement coché", detail: "Le bouton Enregistrer est wrapped dans un AnimatedVisibility lié à l'état de la checkbox RGPD. L'UI offre un retour visuel clair : le bouton est grisé et affiche 'Acceptez les conditions' tant que la case n'est pas cochée." },
      { text: "Données personnelles stockées uniquement en local (pas de cloud)", detail: "Toutes les données (nom, email, photo) restent dans la base Room de la tablette. Aucun serveur distant, aucun analytics, aucun appel réseau lors de l'enregistrement d'un contact." },
      { text: "Export uniquement à la demande explicite de l'admin", detail: "Les données ne quittent jamais la tablette sans action volontaire de l'admin. L'envoi email est déclenché manuellement depuis le panel Export — jamais de façon automatique ou silencieuse." },
      { text: "Aucun tracking, aucune telemetry externe", detail: "L'application ne contient aucun SDK d'analytics (Firebase, Amplitude, etc.), aucun tracker publicitaire et n'envoie aucune donnée de comportement utilisateur à des tiers." },
    ],
  },
  {
    id: 'historique',
    section: 'Fonctionnalités',
    title: 'Historique contacts',
    points: [
      { text: "Liste de tous les leads capturés avec statut (pending / sent)", detail: "L'historique affiche tous les contacts dans un LazyColumn trié par date décroissante. Une puce colorée (orange = pending, vert = sent) donne une vue d'ensemble du suivi des leads en un coup d'œil." },
      { text: "ContactHistoryViewModel — Flow<List<Contact>> depuis Room", detail: "ContactHistoryViewModel expose contactsFlow = contactRepository.getAllContacts() collecté en tant qu'UiState. Toute insertion ou mise à jour (après envoi email) déclenche automatiquement la recomposition." },
      { text: "ContactDetailDialog — vue complète avec photo et secteurs", detail: "Un clic sur un contact ouvre ContactDetailDialog, affichant la photo de carte de visite (chargée par Coil), tous les champs saisis et les secteurs cochés. L'admin peut aussi déclencher l'envoi depuis ce dialogue." },
      { text: "Tri par date de création (desc)", detail: "La requête DAO est annotée ORDER BY createdAt DESC pour afficher les leads les plus récents en premier — logique opérationnelle après un salon où des dizaines de contacts peuvent être saisis en quelques heures." },
      { text: "Indicateur visuel du statut d'envoi email", detail: "Chaque élément de la liste affiche une icône et un label différents selon Contact.status : une horloge orange pour pending et une coche verte pour sent. Ce statut est mis à jour par EmailService après envoi réussi." },
    ],
  },
  {
    id: 'export',
    section: 'Fonctionnalités',
    title: 'Export des données',
    points: [
      { text: "Export CSV — fichier dans Documents, partageable via Intent", detail: "ExportViewModel génère un fichier CSV avec en-têtes (société, contact, email, téléphone, secteurs, date) dans le dossier Documents Android. Un Intent ACTION_SEND permet de le partager par email, Teams ou tout autre app." },
      { text: "Export email — SMTP Jakarta Mail avec SSL/TLS", detail: "EmailService.kt se connecte au serveur SMTP configuré par l'admin (Gmail, Office 365, serveur maison) via Jakarta Mail avec SSL/TLS. L'envoi est exécuté sur Dispatchers.IO via une coroutine." },
      { text: "Pièce jointe PDF générée via Android PdfDocument API", detail: "Le rapport PDF est généré en mémoire via PdfDocument : une page par contact avec les coordonnées, les secteurs et la photo de carte de visite intégrée. Il est joint automatiquement à l'email SMTP." },
      { text: "Template HTML email pour présentation professionnelle", detail: "Le corps de l'email utilise un template HTML inline avec tableau récapitulatif, logo SMP Moules et pied de page légal. Jakarta Mail envoie le message en multipart (HTML + pièce jointe PDF)." },
      { text: "Configuration SMTP dans le panel admin (host, port, identifiants)", detail: "SmtpConfigDialog.kt permet à l'admin de saisir host, port, email et mot de passe. Les identifiants sont stockés chiffrés dans APP_SETTINGS. Aucun identifiant hardcodé dans le code source." },
    ],
  },
  {
    id: 'pdf-generation',
    section: 'Fonctionnalités',
    title: 'Génération de PDF native',
    subtitle: 'Android PdfDocument API',
    points: [
      { text: "Rapport A4 (595 × 842 pt) généré entièrement par le code", detail: "Le PDF est dessiné sur un Canvas via l'API native Android PdfDocument, sans aucune dépendance externe : titres, sous-titres et lignes de séparation sont positionnés au pixel près." },
      { text: "Pagination automatique — checkPage() / startNewPage()", detail: "Une fonction checkPage() surveille la position verticale courante et bascule sur une nouvelle page dès que le contenu dépasse la zone utile, gérant proprement les exports de nombreux contacts." },
      { text: "En-tête SMP, tableau des contacts, photos de cartes centrées", detail: "Chaque contact est rendu avec sa société en gras, ses coordonnées libellées, et la photo de sa carte de visite centrée horizontalement sous ses informations." },
      { text: "Bitmap sampling (inSampleSize + RGB_565) pour alléger les photos", detail: "Les photos de cartes sont décodées avec un inSampleSize calculé et en RGB_565 pour diviser leur empreinte mémoire, évitant les OutOfMemoryError lors de la génération du rapport." },
      { text: "PDF produit en mémoire (ByteArray) → pièce jointe de l'email", detail: "Le document est écrit dans un ByteArrayOutputStream puis joint directement au message SMTP, sans passer par un fichier temporaire sur le disque." },
    ],
  },
  {
    id: 'admin',
    section: 'Fonctionnalités',
    title: 'Panel administrateur',
    subtitle: 'Gestion de contenu sans redéploiement',
    points: [
      { text: "AdminLoginScreen — authentification par mot de passe", detail: "Le mot de passe admin est haché en SHA-256 et stocké dans SharedPreferences. À la première utilisation, l'admin crée son mot de passe (minimum 4 caractères). Les connexions suivantes comparent le hash saisi au hash stocké." },
      { text: "AdminModeBanner — indicateur visuel du mode admin actif", detail: "AdminModeBanner est un bandeau persistant affiché en bas de chaque écran lorsqu'on est connecté en admin. Il affiche 'Mode Administrateur' et un bouton de déconnexion, rappelant visuellement que l'interface est en mode édition." },
      { text: "ContentManager.kt — édition inline de tous les textes de l'UI", detail: "ContentManager observe le statut admin via un StateFlow global. Partout dans l'app où un texte est éditable, il est wrappé dans EditableText() qui affiche un OutlinedTextField en mode admin et un Text() simple sinon." },
      { text: "TranslationService.kt — ML Kit pour traduction automatique", detail: "TranslationService utilise ML Kit Translate pour proposer une traduction automatique FR→EN→DE des textes modifiés. La traduction est effectuée on-device après téléchargement des modèles de langue (~15 Mo chacun)." },
      { text: "SMTP Config — SmtpConfigDialog pour configurer l'envoi email", detail: "SmtpConfigDialog est accessible depuis le menu admin. Il permet de tester la connexion SMTP avant de sauvegarder, affichant un résultat de test (succès ou message d'erreur détaillé) immédiatement." },
    ],
  },
  {
    id: 'kiosque',
    section: 'Fonctionnalités',
    title: 'Mode kiosque',
    subtitle: 'Présentation immersive en salon',
    points: [
      { text: "Fullscreen avec system bars masquées (WindowInsetsController)", detail: "WindowInsetsController.hide(WindowInsetsCompat.Type.systemBars()) masque la barre de statut et la barre de navigation. Le mode BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE permet un retour temporaire si nécessaire." },
      { text: "FLAG_KEEP_SCREEN_ON — écran toujours allumé", detail: "window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) est appelé dans onCreate() de MainActivity. Le flag est retiré dans onDestroy() pour respecter les bonnes pratiques de gestion batterie." },
      { text: "Orientation portrait verrouillée (cohérence d'affichage sur stand)", detail: "screenOrientation=\"portrait\" dans le Manifest empêche toute rotation. L'affichage reste cohérent quelle que soit la prise en main de la tablette, sans bascule intempestive pendant la présentation." },
      { text: "Navigation limitée — pas de retour OS possible depuis la démo", detail: "En mode présentation plein écran, la barre de navigation Android est masquée. Le visiteur est guidé uniquement par la BottomNavBar de l'app — il ne peut pas accéder à l'écran d'accueil Android par accident." },
      { text: "Adapté à un usage sur stand sans surveillance constante", detail: "La tablette peut rester posée sur le stand en libre accès. Sans accès aux fonctions OS et avec l'écran toujours allumé sur l'accueil SMP, l'expérience reste cohérente et professionnelle sans intervention du commercial." },
    ],
  },
  {
    id: 'multilingue',
    section: 'Fonctionnalités',
    title: 'Support multilingue',
    subtitle: 'ML Kit Translate — on-device',
    points: [
      { text: "ML Kit Translate 17.0.3 — traduction sans réseau", detail: "ML Kit Translate télécharge et met en cache des modèles de traduction compacts sur l'appareil. Une fois téléchargés, toutes les traductions FR↔EN, FR↔DE sont effectuées localement, sans aucune requête réseau." },
      { text: "LanguageManager — gestion de la langue active", detail: "LanguageManager est un singleton Koin qui expose un StateFlow<Language> observé par tous les composables. Changer de langue déclenche une recomposition globale de l'UI sans redémarrer l'application." },
      { text: "ContentManager — surcharge dynamique des chaînes", detail: "ContentManager stocke les traductions personnalisées (overrides admin) dans la table APP_SETTINGS sous des clés typées (ex: home.title.fr, home.title.en). Ces overrides prennent priorité sur les traductions ML Kit." },
      { text: "Localization.kt — système de chaînes localisées", detail: "Localization.kt définit toutes les chaînes de l'UI pour les 3 langues dans un sealed class typé. Cela évite les fichiers strings.xml multiples Android et permet une gestion programmatique des traductions." },
      { text: "Pas de connexion internet requise pour les traductions", detail: "Les modèles ML Kit sont téléchargés une seule fois lors de l'activation multilingue en admin. Ensuite, l'app est totalement autonome — idéal pour les salons professionnels sans WiFi fiable." },
    ],
  },

  // ── 5. QUALITÉ & SÉCURITÉ ─────────────────────────────────────────────────
  {
    id: 'responsive',
    section: 'Qualité',
    title: 'Interface responsive',
    subtitle: 'Phone et tablette',
    points: [
      { text: "ScreenType enum — détection automatique phone / tablet", detail: "ScreenType est une enum (PHONE, TABLET) dérivée de la largeur d'écran en dp : < 600dp = PHONE, ≥ 600dp = TABLET. Elle est calculée une fois au démarrage et injectée par Koin comme dépendance." },
      { text: "Dimensions.kt — espacements et tailles selon le form factor", detail: "Dimensions.kt centralise toutes les valeurs d'espacement et de taille (padding, card height, column count) avec des valeurs distinctes par ScreenType. Les composables consomment Dimensions.current au lieu de valeurs hardcodées." },
      { text: "Formulaire contact : colonne unique → 2 colonnes côte à côte", detail: "Sur TABLET, ContactScreen utilise un Row avec deux Column : informations de contact à gauche (société, email, téléphone) et qualification à droite (secteurs, notes, photo). Sur PHONE, les deux columns s'empilent verticalement." },
      { text: "Catalogue : 2 colonnes → 3 colonnes ou plus", detail: "La grille catalogue utilise GridCells.Adaptive(minSize = 180.dp). Android calcule automatiquement le nombre de colonnes selon la largeur disponible : ~2 sur téléphone, ~3 sur tablette 10\", ~4 sur tablette 12\"." },
      { text: "Testé sur émulateurs Pixel 6 et tablette 10\"", detail: "Les deux form factors cibles (Pixel 6 = 411dp de largeur, tablette générique = 800dp) ont été testés dans Android Studio Emulator pour valider les layouts responsive à chaque itération." },
    ],
  },
  {
    id: 'securite',
    section: 'Qualité',
    title: 'Sécurité',
    points: [
      { text: "Keystore signé (mon-app.jks) — APK release signé", detail: "L'APK release est signé avec un keystore JKS généré via Android Studio. La signature garantit l'intégrité de l'application et est obligatoire pour toute distribution ou mise à jour — sans elle, Android refuse l'installation." },
      { text: "AndroidX FileProvider — partage sécurisé sans exposer les chemins", detail: "FileProvider génère des URI content:// temporaires avec permissions d'accès limitées dans le temps. Sans lui, partager un fichier depuis le stockage interne exposerait le chemin absolu, permettant à n'importe quelle app d'y accéder." },
      { text: "Aucun secret hardcodé — SMTP via interface admin uniquement", detail: "Aucun identifiant email, mot de passe SMTP ou clé API n'apparaît dans le code source. Toute configuration sensible est saisie par l'admin en runtime et stockée dans APP_SETTINGS — jamais dans les ressources de l'app." },
      { text: "ProGuard disponible en release (obfuscation du bytecode)", detail: "La configuration ProGuard/R8 est activée pour les builds release. Elle obfusque les noms de classes et méthodes dans le bytecode DEX, rendant la rétro-ingénierie de l'APK significativement plus difficile." },
      { text: "Permissions minimales déclarées dans le Manifest", detail: "Seules les permissions strictement nécessaires sont déclarées : INTERNET (envoi email), CAMERA (capture photo), READ_MEDIA_IMAGES/VIDEO (upload médias). Aucune permission de localisation, de contacts système ou d'appels téléphoniques." },
    ],
  },
  {
    id: 'permissions',
    section: 'Qualité',
    title: 'Permissions & accès système',
    subtitle: 'Principe du moindre privilège',
    points: [
      { text: "INTERNET + ACCESS_NETWORK_STATE — envoi SMTP", detail: "Seules les permissions réseau strictement nécessaires à l'envoi des contacts par email sont déclarées — l'app reste hors ligne le reste du temps." },
      { text: "CAMERA déclarée en feature optionnelle (required = false)", detail: "uses-feature android.hardware.camera required=\"false\" : l'app reste installable sur un appareil sans caméra, la capture de carte de visite étant alors simplement désactivée." },
      { text: "READ_MEDIA_IMAGES / READ_MEDIA_VIDEO — médias Android 13+", detail: "Sur Android 13+ (API 33), les permissions média granulaires remplacent l'accès global au stockage, conformément au modèle de permissions moderne d'Android." },
      { text: "READ/WRITE_EXTERNAL_STORAGE limitées via maxSdkVersion (scoped storage)", detail: "Ces permissions héritées sont bornées par maxSdkVersion (29 / 32) : au-delà, l'app s'appuie sur le scoped storage et n'a plus besoin d'accès large au stockage." },
      { text: "FileProvider — partage de fichiers sans exposer les chemins réels", detail: "FileProvider génère des URI content:// temporaires à permissions limitées, évitant d'exposer les chemins absolus du stockage interne lors du partage de l'export." },
    ],
  },
  {
    id: 'tests',
    section: 'Qualité',
    title: 'Tests',
    points: [
      { text: "JUnit 5 (Jupiter) — tests unitaires via useJUnitPlatform()", detail: "Le projet est configuré pour exécuter ses tests sur la plateforme JUnit 5 (Jupiter) — testOptions { unitTests.all { it.useJUnitPlatform() } } — en pur JVM, sans démarrer d'émulateur Android." },
      { text: "ContactHistoryViewModelTest — 5 cas couverts", detail: "Les tests vérifient le calcul des compteurs par statut, le filtrage de recherche, le cas d'une recherche vide, la délégation de suppression au repository et la détection d'une configuration SMTP complète." },
      { text: "Mockk — mocking des interfaces Repository (aucune dépendance Room)", detail: "Mockk simule ContactRepository et AppSettingRepository avec une syntaxe Kotlin fluente : every { repo.getAllContacts() } returns flowOf(fakeContacts). Aucune base Room n'est nécessaire pour ces tests." },
      { text: "Turbine + coroutines-test — vérification des émissions StateFlow", detail: "runTest et StandardTestDispatcher contrôlent le temps virtuel des coroutines ; Turbine (uiState.test { awaitItem() }) permet d'asserter chaque émission du StateFlow séquentiellement, sans race condition." },
      { text: "Architecture Clean — ViewModels testables sans émulateur Android", detail: "La séparation Domain / Data / Presentation permet d'isoler les couches : on injecte de faux Repository et on observe les états UI exposés par le ViewModel, le tout sur la JVM uniquement." },
    ],
  },
  {
    id: 'qualite-bugs',
    section: 'Qualité',
    title: 'Démarche qualité — corrections de bugs',
    subtitle: 'Traçabilité des corrections dans le code',
    points: [
      { text: "Bug #3 — validation du champ « nom du contact »", detail: "La validation du nom de l'interlocuteur a été ajoutée au formulaire de contact (ContactViewModel) pour éviter d'enregistrer des leads incomplets lors des salons." },
      { text: "Bug #6 — config SMTP centralisée dans Room (source unique)", detail: "La configuration SMTP était dupliquée ; elle est désormais lue depuis APP_SETTINGS dans Room comme source de vérité unique, injectée via AppSettingRepository — un refactor touchant 4 fichiers." },
      { text: "Bug #7 — navigation par constantes Screen.route", detail: "Les chaînes de route codées en dur ont été remplacées par les constantes typées (Screen.PdfViewer.route), supprimant un risque d'incohérence entre destinations de navigation." },
      { text: "Bug #8 — DatabaseSeeder vérifie le nombre total de catégories", detail: "Le seeding initial ne testait que la présence de « Pharmacie » ; il compte maintenant le nombre total de catégories pour décider d'initialiser la base, évitant un état partiellement peuplé." },
      { text: "→ Itération, revue de code et rigueur de débogage", detail: "Cette traçabilité numérotée des corrections illustre une démarche qualité continue : identifier, corriger et documenter chaque régression au fil du développement." },
    ],
  },
  {
    id: 'performances',
    section: 'Qualité',
    title: 'Performances',
    points: [
      { text: "Coil — cache mémoire + disque pour images, chargement lazy", detail: "Coil maintient un cache LRU en mémoire (taille automatique basée sur la RAM disponible) et un cache disque persistant entre sessions. Les images ne sont décodées qu'à la taille réelle de l'ImageView — économie CPU et RAM." },
      { text: "Filament — rendu 3D GPU-accéléré, hors du thread principal", detail: "Filament (moteur de rendu PBR de Google) exécute tout le rendu sur le GPU via OpenGL ES 3.0. Les modèles 3D sont chargés asynchroniquement sur un thread dédié, préservant la fluidité de l'UI Compose à 60fps." },
      { text: "Kotlin Coroutines — toutes les I/O sur Dispatchers.IO", detail: "Dispatchers.IO est un pool de threads optimisé pour les opérations bloquantes (fichiers, réseau, base de données). Toutes les opérations Room, FileProvider et Jakarta Mail y sont exécutées via withContext(Dispatchers.IO)." },
      { text: "Room Flow — mises à jour UI réactives sans polling", detail: "Les requêtes Room annotées @Query retournant Flow<T> s'appuient sur SQLite triggers internes. Room détecte chaque INSERT/UPDATE/DELETE et notifie automatiquement les collectors — zéro polling, zéro latence.", image: '/oral/code/room-flow1.png' },
      { text: "Large heap activé pour la gestion des médias lourds", detail: "android:largeHeap=\"true\" dans le Manifest demande à Android un heap élargi pour l'application. Indispensable pour Filament qui charge des meshes 3D et des textures haute résolution simultanément en mémoire." },
    ],
  },

  // ── 6. DÉFIS & SOLUTIONS ──────────────────────────────────────────────────
  {
    id: 'defi-media',
    section: 'Défis',
    title: 'Défi 1 — Médias lourds',
    subtitle: 'Images, vidéos, PDFs',
    points: [
      { text: "Problème : chargement lent", detail: "Les premières versions chargeaient les images sur le thread principal avec BitmapFactory.decodeFile(), bloquant l'UI pendant 2 à 3 secondes sur des photos de 5 Mo prises par la caméra de la tablette." },
      { text: "Solution : chargement async sur Dispatchers.IO + Coil pour images", detail: "Coil décode chaque image sur un thread Dispatchers.IO et livre le bitmap décodé sur le thread principal. Le chargement lazy (visible seulement quand le composable entre dans la viewport) évite de tout charger d'un coup." },
      { text: "Large heap (android:largeHeap=\"true\") pour Filament", detail: "Sans large heap, Filament provoquait des OutOfMemoryError lors du chargement de modèles 3D > 50 Mo. Le large heap double la mémoire heap disponible, permettant de gérer les assets 3D haute fidélité." },
      { text: "Bitmap sampling (inSampleSize) pour réduire la mémoire photos", detail: "BitmapFactory.Options.inSampleSize = 4 réduit les dimensions du bitmap par 4 avant décodage, divisant la mémoire requise par 16. Une photo 4032×3024 est ainsi décodée en 1008×756 — suffisant pour l'affichage tablette." },
      { text: "→ Résultat : aucun crash mémoire en utilisation salon", detail: "Après optimisation, l'application a été utilisée pendant 8 heures consécutives sur le stand SMP Moules sans crash. L'Android Profiler n'a révélé aucune fuite mémoire détectable." },
    ],
  },
  {
    id: 'defi-offline',
    section: 'Défis',
    title: 'Défi 2 — Offline-first',
    subtitle: 'Application 100% fonctionnelle sans réseau',
    points: [
      { text: "Problème : salons professionnels souvent sans WiFi fiable", detail: "Les halls d'exposition accueillent des centaines d'exposants avec des connexions WiFi partagées et surchargées. La 4G/5G peut également être saturée. Une app cloud-dépendante serait inutilisable dans ces conditions." },
      { text: "Solution : Room SQLite comme source de vérité unique", detail: "Toutes les données (catalogue, contacts, paramètres) vivent dans Room SQLite sur l'appareil. Il n'y a aucun appel réseau pour lire ou écrire des données — la lecture est instantanée et la disponibilité est 100%." },
      { text: "Tous les médias copiés en stockage interne à l'installation", detail: "DatabaseSeeder.kt copie tous les médias initiaux (images produits, vidéos, PDFs) dans getFilesDir() au premier démarrage de l'app. L'admin peut ensuite remplacer ces fichiers via l'interface, sans jamais dépendre du réseau." },
      { text: "ML Kit Translate fonctionne on-device sans connexion", detail: "Les modèles de traduction ML Kit sont téléchargés une seule fois en WiFi lors de la configuration initiale de la tablette. Ensuite, les traductions FR↔EN↔DE sont disponibles indéfiniment hors ligne." },
      { text: "→ App entièrement utilisable hors ligne, même l'export CSV", detail: "L'export CSV vers Documents Android et la génération du rapport PDF sont des opérations 100% locales. Seul l'envoi email SMTP nécessite internet — et il peut être différé au retour du salon." },
    ],
  },
  {
    id: 'defi-smtp',
    section: 'Défis',
    title: 'Défi 3 — Email SMTP sur Android',
    points: [
      { text: "Problème : Android bloque les opérations réseau sur le main thread", detail: "Android lève une NetworkOnMainThreadException si on tente un appel réseau sur le thread principal depuis Android 3.0. Les premières implémentations avec Jakarta Mail en AppCompatActivity crashaient systématiquement." },
      { text: "Solution : EmailService.kt sur Dispatchers.IO via coroutine", detail: "EmailService.kt expose une suspend fun sendEmail() exécutée via withContext(Dispatchers.IO). ExportViewModel lance la coroutine dans viewModelScope — annulation automatique si l'écran est quitté pendant l'envoi.", image: '/oral/code/email-service1.png' },
      { text: "Jakarta Mail (Angus Mail) — supporte SSL/TLS et authentification", detail: "Angus Mail 2.0.2 est l'implémentation Jakarta Mail officielle, compatible Android. Elle gère SSL/TLS (port 465 et 587), l'authentification SMTP (LOGIN, PLAIN, OAuth2) et le contenu MIME multipart pour les pièces jointes." },
      { text: "Gestion des erreurs : timeout, auth failure, SSL handshake", detail: "EmailService wrappe l'envoi dans un try/catch catchant MessagingException. Les codes d'erreur spécifiques (535 = mauvais identifiants, timeout = réseau indisponible) sont traduits en messages utilisateur compréhensibles." },
      { text: "→ Envoi fiable avec feedback utilisateur en cas d'erreur", detail: "ExportViewModel expose un UiState (Sending, Success, Error(message)) observé par ExportScreen. Un Snackbar Material 3 affiche le résultat immédiatement — l'admin sait exactement si l'envoi a réussi ou pourquoi il a échoué." },
    ],
  },
  {
    id: 'code-smtp',
    section: 'Défis',
    title: 'Extrait de code — Envoi SMTP',
    subtitle: 'EmailService.kt — choix SSL / STARTTLS sur Dispatchers.IO',
    points: [
      { text: "Port 465 → SSL direct · sinon STARTTLS requis", detail: "Le service choisit dynamiquement le mode de chiffrement : SSL/TLS implicite sur le port 465, sinon STARTTLS explicite (587). Les deux garantissent un transport chiffré des identifiants et du contenu." },
      { text: "Timeouts (15 s) pour éviter le blocage sur réseau lent", detail: "Des timeouts de connexion, lecture et écriture à 15 s empêchent l'app de rester figée sur un réseau de salon instable — l'utilisateur reçoit une erreur exploitable plutôt qu'un gel." },
      {
        text: "Tout l'envoi exécuté sur Dispatchers.IO, hors du thread principal",
        detail: "withContext(Dispatchers.IO) déporte l'I/O réseau hors du thread UI, comme l'impose Android — sans quoi une NetworkOnMainThreadException serait levée.",
        code: `suspend fun sendContacts(...) = withContext(Dispatchers.IO) {
    val useSSL = smtpPort == "465"
    val properties = Properties().apply {
        put("mail.smtp.host", smtpHost)
        put("mail.smtp.port", smtpPort)
        put("mail.smtp.auth", "true")
        put("mail.smtp.connectiontimeout", "15000")
        if (useSSL) {
            put("mail.smtp.ssl.enable", "true")
        } else {
            put("mail.smtp.starttls.required", "true")
        }
    }
    Transport.send(buildMessage(session, contacts))
}`,
      },
    ],
  },
  {
    id: 'defi-multilingue',
    section: 'Défis',
    title: 'Défi 4 — Multilingue dynamique',
    points: [
      { text: "Problème : les chaînes doivent être modifiables par l'admin", detail: "Le système de ressources Android (strings.xml) est statique et nécessite une recompilation pour toute modification. Les commerciaux avaient besoin de personnaliser les textes produits pour des clients allemands ou anglais sans passer par un développeur." },
      { text: "Solution : ContentManager stocke les overrides dans APP_SETTINGS", detail: "ContentManager maintient un Map<String, String> en mémoire chargé depuis APP_SETTINGS. Pour chaque clé de chaîne (ex: home.title), il retourne l'override admin s'il existe, sinon la chaîne par défaut de Localization.kt." },
      { text: "ML Kit Translate pour les traductions automatiques à la demande", detail: "Quand l'admin modifie un texte en français, TranslationService propose automatiquement des traductions EN et DE générées par ML Kit. L'admin peut les accepter telles quelles ou les modifier avant de sauvegarder." },
      { text: "LanguageManager centralise la langue active", detail: "LanguageManager expose currentLanguage: StateFlow<Language>. Un sélecteur de langue dans le header admin permet de basculer entre FR, EN et DE. Tous les composables qui observent LanguageManager se recomposent instantanément." },
      { text: "→ Commerciaux peuvent adapter les textes sans développeur", detail: "Un commercial peut arriver sur un stand client allemand, ouvrir le mode admin, basculer en allemand et personnaliser les textes de présentation en 5 minutes — sans jamais toucher à Android Studio ni attendre une mise à jour." },
    ],
  },

  // ── 7. INSIGHTS TECHNIQUES ───────────────────────────────────────────────
  {
    id: 'room-reactive',
    section: 'Insights',
    title: 'Room : Flow réactif vs one-shot',
    subtitle: 'Ce que les docs ne montrent pas',
    points: [
      {
        text: 'fun getAllContacts(): Flow<List<Contact>> — requête réactive',
        detail: "Room observe la table via un trigger SQLite interne. Chaque INSERT/UPDATE/DELETE re-émet automatiquement une nouvelle liste. L'UI se met à jour sans polling, sans callback manuel — la réactivité est dans le type de retour.",
      },
      {
        text: 'suspend fun getById(id: Long): Contact? — requête one-shot',
        detail: "Une suspend fun s'exécute une fois et retourne. Pour la lecture unique (détail d'un produit), c'est le bon choix — pas de collector à gérer. Pour une liste qui doit rester synchronisée, il faut Flow.",
      },
      {
        text: 'val id: Long = 0 — valeur sentinelle Room',
        detail: "Room utilise 0 comme valeur sentinelle à l'insertion : si id == 0, autoGenerate génère un id. Si id != 0, Room tente d'insérer avec cet id. Ce n'est pas écrit clairement dans la doc — ça fait crasher si on insère un Contact avec un id hardcodé.",
      },
      {
        text: 'sentAt: Long? plutôt que Date — Room et les types complexes',
        detail: "Room ne sait pas sérialiser java.util.Date nativement. Il faut soit un @TypeConverter (classe séparée, boilerplate), soit rester sur des primitives. Long (timestamp Unix ms) est lisible, portable, triable en SQL — meilleur choix ici.",
      },
      {
        text: '→ Le type de retour du DAO définit le comportement réactif',
        detail: 'Flow<T> = la requête reste active et re-émet. suspend T = une exécution, un résultat. Ce n\'est pas une préférence stylistique — c\'est une décision architecturale qui impacte la façon dont l\'UI se synchronise avec la base.',
      },
    ],
  },
  {
    id: 'coroutines-pratique',
    section: 'Insights',
    title: 'Coroutines : withContext vs launch',
    subtitle: 'La différence que les tutos ne précisent pas',
    points: [
      {
        text: 'withContext(Dispatchers.IO) — switch de thread, résultat attendu',
        detail: "withContext suspend la coroutine courante, exécute le bloc sur Dispatchers.IO, puis reprend sur le dispatcher d'origine avec le résultat. C'est un switch de contexte — la coroutine parente attend la fin. Utilisé dans EmailService pour l'envoi SMTP.",
      },
      {
        text: 'launch(Dispatchers.IO) — nouvelle coroutine indépendante, résultat ignoré',
        detail: "launch crée un nouveau Job indépendant. La coroutine parente continue immédiatement sans attendre. Utile pour fire-and-forget. Mauvais choix si on a besoin du résultat — on ne peut pas 'await' un launch sans Deferred.",
      },
      {
        text: 'viewModelScope.launch — survit aux rotations d\'écran',
        detail: "viewModelScope est lié au ViewModel, pas à l'Activity. L'envoi email lancé dans viewModelScope continue si l'utilisateur tourne la tablette — le ViewModel survit à la rotation. lifecycleScope se cancelle avec l'Activity.",
      },
      {
        text: 'Dispatchers.IO — pool de threads pour les opérations bloquantes',
        detail: "Dispatchers.IO maintient un pool de 64 threads max. Idéal pour Room, Jakarta Mail, FileIO. Dispatchers.Main = thread UI Android. Tout appel bloquant sur Main = ANR (Application Not Responding) — Android tue l'app après 5 secondes.",
      },
      {
        text: '→ Règle simple : I/O bloquant → withContext(Dispatchers.IO) dans une suspend fun',
        detail: "La signature suspend fun sendContacts() = withContext(Dispatchers.IO) { ... } est le pattern idiomatique : la fonction s'auto-distribue sur le bon dispatcher, l'appelant n'a pas à se soucier du thread. C'est la convention recommandée par les guidelines Kotlin.",
      },
    ],
  },
  {
    id: 'koin-scoping',
    section: 'Insights',
    title: 'Koin : durée de vie des dépendances',
    subtitle: 'single · factory · viewModel — le mauvais choix = bug silencieux',
    points: [
      {
        text: 'single { } — une seule instance pour toute l\'app',
        detail: "ContactRepository, AppDatabase, EmailService sont déclarés single. Ils sont créés au premier get() et réutilisés partout. Utiliser single pour un ViewModel = mémoire partagée entre écrans, état qui persiste après navigation — bug subtil.",
      },
      {
        text: 'factory { } — nouvelle instance à chaque injection',
        detail: "factory crée un nouvel objet à chaque appel get(). Utiliser factory pour un Repository = une nouvelle connexion Room à chaque ViewModel = gaspillage de ressources et cache in-memory systématiquement vide.",
      },
      {
        text: 'viewModel { } — lié au cycle de vie Android ViewModel',
        detail: "viewModel { ContactHistoryViewModel(get(), get()) } crée le ViewModel via Koin et le lie au ViewModelStore Android. Il survit aux rotations mais est détruit quand l'utilisateur quitte définitivement l'écran.",
      },
      {
        text: '→ Erreur classique : déclarer un ViewModel en single',
        detail: "Un ViewModel en single est partagé entre tous les écrans et n'est jamais détruit — fuite mémoire assurée. Le StateFlow continue d'émettre, les coroutines tournent en arrière-plan. Koin ne lève pas d'erreur : il faut connaître la sémantique de chaque scope.",
      },
      {
        text: '→ Erreur classique 2 : déclarer un Repository en factory',
        detail: "Un Repository en factory = une nouvelle instance injectée dans chaque ViewModel. Si le Repository maintient un cache en mémoire, chaque ViewModel voit son propre cache vide. Room n'est pas affecté (base commune), mais tout état in-memory est dupliqué.",
      },
    ],
  },
  {
    id: 'stateflow-livedata',
    section: 'Insights',
    title: 'StateFlow vs LiveData',
    subtitle: 'Pourquoi StateFlow en 2025',
    points: [
      {
        text: 'LiveData — lifecycle-aware mais dépendante d\'Android',
        detail: "LiveData observe le lifecycle automatiquement. Mais elle importe androidx.lifecycle dans le ViewModel — rendant le ViewModel dépendant d'Android, moins testable en JVM pur (besoin de InstantTaskExecutorRule en test).",
      },
      {
        text: 'StateFlow — coroutine-native, testable en JVM pur',
        detail: "StateFlow fait partie de kotlinx-coroutines — pas de dépendance Android. Le ViewModel est testable sans émulateur, sans règle JUnit spéciale. runTest gère le temps des coroutines, collectAsStateWithLifecycle() gère le lifecycle côté Compose.",
      },
      {
        text: 'StateFlow a toujours une valeur initiale',
        detail: "MutableStateFlow(initialValue) requiert une valeur à la création — impossible d'avoir un état null non-intentionnel. LiveData.value est nullable par défaut et peut rester null jusqu'au premier post — source de NullPointerException en UI.",
      },
      {
        text: 'collectAsStateWithLifecycle() — lifecycle à la frontière UI seulement',
        detail: "collectAsStateWithLifecycle() arrête la collection quand le composable quitte le cycle de vie actif. Contrairement à collectAsState() qui continue de collecter même en background — gaspillage CPU/batterie sur une tablette 24h allumée.",
      },
      {
        text: '→ StateFlow dans le ViewModel, collectAsStateWithLifecycle() dans Compose',
        detail: "Ce pattern garde le ViewModel libre de toute dépendance Android et délègue la gestion lifecycle au composable. C'est la recommandation officielle Google depuis Android Summit 2022 — et ce que ce projet applique sur tous les écrans.",
      },
    ],
  },

  // ── 8. COMPÉTENCES RNCP (was 7) ──────────────────────────────────────────
  {
    id: 'rncp-intro',
    section: 'Compétences',
    title: 'Référentiel RNCP Niveau 6',
    subtitle: "Concepteur Développeur d'Applications Full Stack",
    points: [
      { text: "C1 — Analyser les besoins et concevoir l'architecture applicative", detail: "Traduit le besoin métier (présentation salon, capture leads) en architecture MVVM + Clean avec 3 couches, 5 entités Room et un NavGraph de 12 écrans documentés." },
      { text: "C2 — Développer des interfaces utilisateur adaptatives", detail: "Jetpack Compose + Material 3 avec ScreenType enum pour adapter automatiquement le layout phone/tablette. Mode kiosque fullscreen via WindowInsetsController." },
      { text: "C3 — Concevoir et exploiter une base de données", detail: "Modélisation relationnelle de 5 entités (CATEGORIES, PRODUCTS, CONTACTS, MEDIA_FILES, APP_SETTINGS) avec clés étrangères, DAOs typés et migrations Room." },
      { text: "C4 — Développer des composants métier et services", detail: "EmailService.kt (SMTP + PDF), TranslationService.kt (ML Kit), ContentManager.kt (édition inline) et ExportViewModel orchestrant CSV + email — chaque service isolé et testable." },
      { text: "C5 — Travailler en contexte professionnel agile", detail: "Travail en autonomie avec git feature branches, livraison d'APK signé documenté et communication directe avec les commerciaux utilisateurs pour les itérations fonctionnelles." },
    ],
  },
  {
    id: 'c1',
    section: 'Compétences',
    title: 'C1 — Architecture applicative',
    points: [
      { text: "Analyse du besoin métier → cahier des charges fonctionnel", detail: "Interviews avec les commerciaux SMP pour identifier les pain points (papier, contacts perdus, absence de vidéos). Traduction en spécifications fonctionnelles : 5 fonctionnalités prioritaires, 2 profils utilisateurs (visiteur / admin)." },
      { text: "Choix architecturaux justifiés : MVVM + Clean Architecture", detail: "MVVM pour séparer logique UI et métier, Clean Architecture pour isoler les couches et maximiser la testabilité. Le choix a été documenté avec comparaison MVC/MVP/MVVM et justification par les contraintes du projet." },
      { text: "Conception du schéma de base de données (5 entités, relations)", detail: "Modélisation en MLD avec clés étrangères (PRODUCTS.categoryId → CATEGORIES.id), cascade delete et choix délibéré de stocker imagePaths en JSON plutôt qu'une table de jonction supplémentaire." },
      { text: "Diagramme de navigation (NavGraph, 9 écrans)", detail: "NavGraph typé avec Screen sealed class définissant 12 routes. Le diagramme documente les transitions possibles, les arguments passés (categoryId, productId) et les écrans accessibles uniquement en mode admin." },
      { text: "Choix des dépendances (Koin, Room, Filament) argumentés", detail: "Chaque dépendance a été évaluée sur 4 critères : performance, maintenance, compatibilité Android, courbe d'apprentissage. Koin > Hilt pour la légèreté, Room > SQLDelight pour l'intégration Jetpack officielle." },
    ],
  },
  {
    id: 'c2',
    section: 'Compétences',
    title: 'C2 — Interfaces utilisateur',
    points: [
      { text: "Jetpack Compose + Material 3 — UI déclarative moderne", detail: "100% des écrans sont en Jetpack Compose sans une ligne de XML. Material 3 fournit les tokens de couleur dynamique, la typographie et les composants (Card, FAB, Dialog, NavigationBar) cohérents avec les guidelines Google." },
      { text: "Composants réutilisables : SMPHeader, SMPNavigationBar, CameraCapture", detail: "SMPHeader et SMPNavigationBar sont des composables partagés injectés dans tous les écrans via le NavGraph. CameraCapture.kt est un composable autonome réutilisable dans tout écran nécessitant la caméra." },
      { text: "Responsive design — phone / tablette avec ScreenType", detail: "ScreenType.PHONE et TABLET déclenchent des branches de rendu distinctes dans les composables (if (screenType == TABLET)). Les deux layouts sont maintenus dans le même fichier, garantissant la cohérence visuelle." },
      { text: "Mode kiosque fullscreen avec gestion des system bars", detail: "WindowInsetsController.hide() masque les barres système en mode présentation. BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE permet un retour fugace des barres si l'admin a besoin d'accéder aux paramètres système." },
      { text: "Accessibilité : contrastes Material 3, sémantique Compose", detail: "Material 3 garantit des ratios de contraste WCAG AA sur tous les composants. Les éléments interactifs Compose ont des contentDescription pour les screen readers, et les composants focusables respectent la navigation au clavier." },
    ],
  },
  {
    id: 'c3',
    section: 'Compétences',
    title: 'C3 — Base de données',
    points: [
      { text: "Modélisation relationnelle : 5 entités, clés étrangères, cascade delete", detail: "La clé étrangère PRODUCTS.categoryId référence CATEGORIES.id avec ON DELETE CASCADE — supprimer une catégorie supprime automatiquement tous ses produits. Room vérifie l'intégrité référentielle via @ForeignKey." },
      { text: "Room ORM avec DAOs typés (ContactDao, ProductDao, etc.)", detail: "Chaque DAO est une interface annotée @Dao avec des méthodes @Query, @Insert, @Update, @Delete. Room génère l'implémentation SQL à la compilation — les erreurs de syntaxe SQL sont des erreurs de build, pas des crashes runtime." },
      { text: "Requêtes Flow réactives — mises à jour UI automatiques", detail: "getAllContacts(): Flow<List<Contact>> retourne un Flow qui émet une nouvelle liste à chaque modification de la table CONTACTS. Le ViewModel collecte ce Flow et met à jour le StateFlow UI sans aucun code de notification manuel." },
      { text: "DatabaseSeeder — initialisation des données au premier lancement", detail: "DatabaseSeeder.kt est appelé dans RoomDatabase.Callback.onCreate(). Il peuple les tables CATEGORIES et PRODUCTS avec les données initiales et copie les médias d'exemple depuis les assets vers le stockage interne." },
      { text: "Migrations Room pour les évolutions de schéma", detail: "Chaque modification de schéma (nouvelle colonne, nouvelle table) est accompagnée d'un Migration(from, to) avec le SQL ALTER TABLE correspondant. Room vérifie l'intégrité du schéma au démarrage — une migration manquante crash l'app au démarrage, pas en production silencieusement." },
    ],
  },
  {
    id: 'c4',
    section: 'Compétences',
    title: 'C4 — Composants métier',
    points: [
      { text: "EmailService.kt — service SMTP avec génération PDF", detail: "EmailService est une classe injectée par Koin exposant suspend fun sendContactsReport(contacts: List<Contact>). Elle génère le PDF via PdfDocument, construit l'email multipart MIME et l'envoie via Jakarta Mail — tout sur Dispatchers.IO." },
      { text: "TranslationService.kt — traduction ML Kit asynchrone", detail: "TranslationService wrappe l'API ML Kit Translate dans des suspend functions Kotlin. translate(text: String, from: Language, to: Language) retourne le texte traduit ou lance une TranslationException avec le code d'erreur ML Kit." },
      { text: "ContentManager.kt — gestion des contenus éditables", detail: "ContentManager maintient un Map<String, Map<Language, String>> chargé depuis APP_SETTINGS. getString(key, language) retourne la valeur localisée avec fallback hiérarchique : override admin > traduction ML Kit > valeur par défaut." },
      { text: "ExportViewModel — orchestration CSV + email", detail: "ExportViewModel coordonne le flux d'export complet via des coroutines : fetchContacts() → generateCsv() → generatePdf() → sendEmail(). Chaque étape met à jour un UiState (Loading, CsvReady, PdfReady, EmailSent, Error)." },
      { text: "Pattern Repository — isolation de la logique d'accès aux données", detail: "Le pattern Repository isole les ViewModels de la source de données concrète. ContactRepository définit le contrat, ContactRepositoryImpl l'implémente avec Room. Tester le ViewModel = mocker l'interface, sans Room, sans émulateur." },
    ],
  },
  {
    id: 'c5',
    section: 'Compétences',
    title: 'C5 — Contexte professionnel',
    points: [
      { text: "Travail en autonomie au sein de l'équipe IT de SMP Moules", detail: "Seul développeur mobile de l'équipe IT, j'ai géré l'intégralité du cycle de développement : recueil des besoins, conception, développement, tests, livraison et formation des utilisateurs commerciaux." },
      { text: "Versioning Git avec branches feature / fix", detail: "Workflow git avec branches feature/nom-fonctionnalité et fix/nom-bug. Chaque feature est développée isolément et mergée via Pull Request après auto-review — permettant une traçabilité complète de l'historique." },
      { text: "Livraison d'APK signé et documenté (apk.md)", detail: "L'APK release est généré via Build > Generate Signed Bundle et signé avec le keystore mon-app.jks. apk.md documente la procédure d'installation, les permissions requises et les instructions de mise à jour pour l'équipe SMP." },
      { text: "Communication avec les utilisateurs métier (commerciaux)", detail: "Sessions régulières de démo avec les commerciaux pour recueillir les retours. Leurs observations (ex : besoin de voir l'historique par salon, pas seulement par date) ont directement influencé les priorités de développement." },
      { text: "Documentation technique : README, CLAUDE.md, AGENTS.md", detail: "README.md documente l'architecture, la stack, les écrans et les procédures de build/signature. CLAUDE.md et AGENTS.md guident les outils IA pour contribuer au projet en respectant les conventions établies." },
    ],
  },

  // ── 8. BILAN ──────────────────────────────────────────────────────────────
  {
    id: 'chiffres-cles',
    section: 'Bilan',
    title: 'Chiffres clés du projet',
    subtitle: 'Le projet en quelques mesures',
    points: [
      { text: "~9 700 lignes de Kotlin réparties sur 70 fichiers", detail: "Une base de code conséquente mais structurée, organisée en couches Domain / Data / Presentation suivant l'architecture Clean." },
      { text: "13 écrans · 7 ViewModels · 5 repositories · 5 DAOs · 5 entités Room", detail: "Chaque écran majeur possède son ViewModel ; chaque entité métier son repository (interface + implémentation) et son DAO Room, pour un découplage strict." },
      { text: "3 modules d'injection de dépendances (Koin)", detail: "DatabaseModule, RepositoryModule et ViewModelModule câblent l'ensemble des dépendances sans couplage direct entre les couches." },
      { text: "10+ librairies Android majeures intégrées", detail: "Compose, Room, Koin, CameraX, ExoPlayer, Coil, WebKit, Jakarta Mail, ML Kit Translate… autant d'intégrations maîtrisées dans un même projet." },
      { text: "compileSdk 36 · minSdk 24 · targetSdk 35 · version 1.0.0", detail: "Une cible moderne (Android 15) tout en conservant une compatibilité large à partir d'Android 7.0, couvrant la quasi-totalité du parc d'appareils." },
      { text: "1 APK release signé livré en production", detail: "Le projet a abouti à un livrable concret : un APK release signé avec keystore, effectivement déployé et utilisé sur les stands." },
    ],
  },
  {
    id: 'bilan-technique',
    section: 'Bilan',
    title: 'Bilan technique',
    points: [
      { text: "Application Android production-ready, APK signé livré", detail: "L'APK release signé a été installé sur les tablettes Samsung de SMP Moules et utilisé lors du salon Pharmapack 2026. Aucun crash ni bug bloquant n'a été remonté en production." },
      { text: "Architecture propre — chaque couche testable et évolutive", detail: "La séparation MVVM + Clean permet d'ajouter une fonctionnalité (ex : synchronisation cloud) sans toucher aux couches existantes. Le Domain Layer resterait identique, seule une nouvelle implémentation de Repository serait ajoutée." },
      { text: "Intégration de 10+ librairies Android majeures", detail: "Room, Compose, Koin, CameraX, ExoPlayer, Coil, Filament, Jakarta Mail, ML Kit, kotlinx-serialization — chacune intégrée avec sa configuration spécifique, ses migrations et ses contraintes de cycle de vie Android." },
      { text: "Première expérience significative de développement mobile natif", detail: "Avant ce projet, mon expérience mobile se limitait à quelques tutoriels. Ce projet m'a forcé à maîtriser le cycle de vie Android, la gestion des permissions, les threads et le rendu GPU — des concepts absents du développement web." },
      { text: "Compréhension approfondie du cycle de vie Android", detail: "Le débogage des fuites mémoire ExoPlayer et des crashes de rotation d'écran m'a contraint à comprendre en détail onCreate/onStart/onResume/onPause/onStop/onDestroy et les ViewModel qui survivent aux recreations d'Activity." },
    ],
  },
  {
    id: 'bilan-entreprise',
    section: 'Bilan',
    title: 'Apport pour SMP Moules',
    points: [
      { text: "Remplacement des feuilles de prise de contact papier par une app interactive", detail: "Avant l'app, les commerciaux remplissaient des formulaires papier qui devaient être ressaisis manuellement dans le CRM après le salon — une tâche fastidieuse et source d'erreurs. L'app élimine complètement cette ressaisie." },
      { text: "Fini les cartes de visite perdues", detail: "La photo de carte de visite intégrée au formulaire garantit que les coordonnées du prospect restent accessibles même si la carte physique est égarée. L'historique Room est persistant et sauvegardé automatiquement." },
      { text: "Export automatique des contacts via email", detail: "En un seul clic depuis l'écran Export, le responsable commercial reçoit par email un rapport PDF formaté avec tous les leads du salon, prêt à être importé dans le CRM de l'entreprise." },
      { text: "Autonomie : les commerciaux mettent à jour les contenus eux-mêmes", detail: "ContentManager.kt donne aux commerciaux le contrôle total du contenu sans dépendance au service IT. Ajouter un nouveau produit, modifier une description ou changer une photo prend moins de 2 minutes depuis la tablette." },
      { text: "Image moderne de l'entreprise lors des salons professionnels", detail: "La tablette kiosque avec son interface soignée, ses vidéos produit et son mode plein écran positionne SMP Moules comme une entreprise à la pointe de la technologie face à des concurrents utilisant encore des catalogues papier." },
    ],
  },
  {
    id: 'bilan-personnel',
    section: 'Bilan',
    title: "Ce que j'ai appris",
    points: [
      { text: "Maîtrise de Kotlin et Jetpack Compose en contexte réel", detail: "Kotlin 2.1.0 avec ses sealed classes, extension functions, coroutines et scope functions (let, apply, run) est devenu mon langage principal. Jetpack Compose avec ses recompositions et ses effets de bord est une façon de penser l'UI radicalement différente du web." },
      { text: "Architecture logicielle : MVVM, Clean Architecture, DI", detail: "La vraie valeur de ces patterns ne se comprend qu'en pratique : le jour où j'ai pu tester ExportViewModel sans démarrer d'émulateur ni configurer Jakarta Mail, j'ai compris pourquoi l'isolation des couches est indispensable." },
      { text: "Gestion des APIs hardware Android (CameraX, Filament, Permissions)", detail: "CameraX m'a appris les abstractions hardware nécessaires pour supporter des centaines de modèles Android différents. Filament m'a introduit au rendu physiquement basé et aux contraintes GPU sur des appareils embarqués." },
      { text: "Rigueur sur la sécurité des données (RGPD, Keystore)", detail: "Implémenter la conformité RGPD m'a appris à penser la sécurité dès la conception (privacy by design) : minimisation des données, consentement explicite, absence de cloud non nécessaire. Le Keystore m'a initié à la signature cryptographique d'applications." },
      { text: "Communication technique avec des parties prenantes non-développeurs", detail: "Expliquer à un commercial pourquoi une fonctionnalité nécessite 2 semaines plutôt que 2 heures, ou traduire un bug technique en impact utilisateur compréhensible, sont des compétences aussi importantes que le code lui-même." },
    ],
  },
  {
    id: 'perspectives',
    section: 'Bilan',
    title: 'Perspectives & évolutions',
    points: [
      { text: "Synchronisation cloud — backup des contacts sur serveur distant", detail: "Une API REST (Ktor ou Spring Boot) permettrait de synchroniser les contacts Room vers un serveur central. Les données du salon seraient accessibles depuis le bureau dès le retour, sans attendre l'export email manuel." },
      { text: "Analyse des prospects — statistiques par secteur, par salon", detail: "Un module analytics (graphiques Vico ou MPAndroidChart) afficherait la répartition des leads par secteur, par salon et dans le temps. Ces données aideraient SMP Moules à cibler ses prochains salons prioritaires." },
      { text: "Notifications push — rappels de suivi des leads non traités", detail: "WorkManager pourrait déclencher des notifications push locales rappelant aux commerciaux de traiter les contacts pending après un délai configurable — transformant l'app en outil de suivi commercial post-salon." },
      { text: "Version iOS — React Native pour mutualiser le code métier", detail: "La logique métier (validation, formatage, génération PDF) pourrait être extraite en Kotlin Multiplatform Mobile (KMM) et partagée avec une app iOS React Native. Seules les couches UI et hardware resteraient spécifiques à chaque plateforme." },
      { text: "Mode hors ligne amélioré — sync différentielle au retour réseau", detail: "Un mécanisme de sync différentielle (timestamp de dernière modification par entité) permettrait de synchroniser uniquement les changements depuis la dernière sync, minimisant la bande passante au retour dans les locaux." },
    ],
  },

  // ── 9. CONCLUSION ─────────────────────────────────────────────────────────
  {
    id: 'conclusion',
    section: 'Conclusion',
    title: 'Conclusion',
    points: [
      { text: "Application kiosque Android complète, livrée et utilisée en production", detail: "SMP-Commercial est déployée sur les tablettes Samsung de SMP Moules et active depuis le salon Pharmapack 2026. C'est un projet livré, pas une maquette." },
      { text: "Architecture MVVM + Clean — maintenable, testable, évolutive", detail: "Les 3 couches découplées permettent d'ajouter les perspectives (sync cloud, analytics) sans réécrire l'existant. Le code est testé, documenté et versioned — prêt pour un développeur qui rejoindrait l'équipe." },
      { text: "Stack moderne : Kotlin · Compose · Room · Koin · Filament · CameraX", detail: "Chaque brique technologique est une recommandation officielle Google (Jetpack). Ce projet constitue une vitrine des meilleures pratiques Android 2025 dans un contexte métier réel et exigeant." },
      { text: "Compétences RNCP niveau 6 couvertes de la conception à la livraison", detail: "De l'analyse du besoin métier (C1) à la livraison en contexte professionnel (C5), toutes les compétences du référentiel ont été exercées sur un seul projet cohérent et significatif." },
      { text: "→ Questions ?", detail: "Je suis disponible pour détailler n'importe quel aspect technique, architectural ou fonctionnel du projet." },
    ],
  },
]

export const SECTIONS = [...new Set(SLIDES.map(s => s.section))]

export type Step =
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
