import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth.store";

import * as GeneralPages from "../pages/generale/index.generale";
import * as AuthPages from "../pages/auth/index.auth";
import * as OtherPages from "../pages/other/index.other";
import * as ChatPages from "../pages/chat/index.chat";
import * as AdminPages from "../pages/admin/index.admin";
import * as TeacherPages from "../pages/teacher/index.teacher";
import * as StudentPages from "../pages/student/index.student";

import LayoutGenerale from "../layouts/Layout.generale.vue";
import LayoutAdmin from "../layouts/Layout.admin.vue";
import LayoutTeacher from "../layouts/Layout.teacher.vue";
import LayoutStudent from "../layouts/Layout.student.vue";

const routes = [
  {
    path: "/",
    component: LayoutGenerale,
    children: [
      {
        path: "",
        name: "Accueil",
        alias: "Acceuil",
        component: GeneralPages.Accueil,
      },
      {
        path: "about",
        name: "Apropos",
        alias: "A propos",
        component: GeneralPages.Apropos,
      },
      {
        path: "notActivated",
        name: "NotActivated",
        alias: "Non Activer",
        component: GeneralPages.NotActivated,
      },
      {
        path: "Unauthorized",
        name: "Unauthorized",
        alias: "Non Autoriser",
        component: GeneralPages.Unauthorized,
      },
      {
        path: "login",
        name: "Authentification",
        alias: "Connexion",
        component: AuthPages.Authentification,
        meta: { requiresAuth: false, guestOnly: true },
      },
      {
        path: "register",
        name: "Inscription",
        alias: "Inscription",
        component: AuthPages.Inscription,
        meta: { requiresAuth: false, guestOnly: true },
      },
    ],
  },
  {
    path: "/administrator",
    component: LayoutAdmin,
    meta: { requiresAuth: true, requiredRole: "administrator", isActive: 1 },
    children: [
      {
        path: "",
        name: "TableauDeBordsAdmin",
        alias: "Tableau de bords Administrateur",
        component: AdminPages.TableauDeBordsAdmin,
        meta: { title: "Tableau de bords Administrateur" },
      },
      {
        path: "announces",
        name: "GestionAnnoncesAdmin",
        alias: "Gestion d'annonce",
        component: AdminPages.GestionAnnoncesAdmin,
        meta: { title: "Gestion d'annonce" },
      },
      {
        path: "courses",
        name: "GestionCoursAdmin",
        alias: "Gestion de cours",
        component: AdminPages.GestionCoursAdmin,
        meta: { title: "Gestion de cours" },
      },
      {
        path: "users",
        name: "GestionUtilisateursAdmin",
        alias: "Gestion Utilisateur",
        component: AdminPages.GestionUtilisateursAdmin,
        meta: { title: "Gestion Utilisateur" },
      },
      {
        path: "classes",
        name: "GestionAcademiquesAdmin",
        alias: "Gestion académique",
        component: AdminPages.GestionAcademiquesAdmin,
        meta: { title: "Gestion académique" },
      },
      {
        path: "classes/:idClasse",
        name: "InformationClassesAdmin",
        alias: "Gestion de la classe/:idClasse",
        component: AdminPages.InformationClassesAdmin,
        meta: { title: "Gestion de la classe" },
      },
      {
        path: "profile",
        name: "ProfileAdmin",
        alias: "Profil Administrateur",
        component: OtherPages.Profile,
        meta: { title: "Profil Administrateur" },
      },
    ],
  },
  {
    path: "/teacher",
    component: LayoutTeacher,
    meta: { requiresAuth: true, requiredRole: "teacher", isActive: 1 },
    children: [
      {
        path: "",
        name: "TableauDeBordsEnseignant",
        alias: "Tableau de bords Enseignant",
        component: TeacherPages.TableauDeBordsEnseignant,
        meta: { title: "Tableau de bords Enseignant" },
      },
      {
        path: "classes",
        name: "ListeClasseEnseignant",
        alias: "Liste des classes de l'Enseignant",
        component: TeacherPages.ListeClasseEnseignant,
        meta: { title: "Liste des classes de l'Enseignant" },
      },
      {
        path: "courses",
        name: "ListeCoursEnseignant",
        alias: "Liste des cours de l'enseignant",
        component: TeacherPages.ListeCoursEnseignant,
        meta: { title: "Liste des cours de l'enseignant" },
      },
      {
        path: "messageries",
        name: "ListeDiscussionsEnseignant",
        alias: "Messagerie Enseignant",
        component: ChatPages.ListeDiscussionsTeacher,
        meta: { title: "Messagerie Enseignant" },
      },
      {
        path: "Discussion",
        name: "DiscussionTeacher",
        alias: "Discussion Enseignant",
        component: ChatPages.DiscussionEnseignants,
        meta: { title: "Discussion Enseignant" },
      },
      {
        path: "messageries/:id",
        name: "DiscussionEnseignant",
        alias: "Discussion de l'Enseignant/:id",
        component: ChatPages.DiscussionTeacher,
        meta: { title: "Discussion de l'Enseignant" },
      },
      {
        path: "courses/:id/details",
        name: "CoursEnseignant",
        alias: "Details d'un cours/:id",
        component: TeacherPages.CoursEnseignant,
        meta: { title: "Details d'un cours" },
      },
      {
        path: "courses/:id/noter",
        name: "NoterCoursEnseignant",
        alias: "Note d'un cours/:id",
        component: TeacherPages.NoterCoursEnseignant,
        meta: { title: "Note d'un cours" },
      },
      {
        path: "classes/:idClasse/notes",
        name: "NotesClasseEnseignant",
        alias: "Notes de la classes/:idClasse",
        component: TeacherPages.NotesClasseEnseignant,
        meta: { title: "Notes de la classes" },
      },
      {
        path: "classes/:idClasse/etudiants",
        name: "ListeEtudiantEnseignant",
        alias: "Liste des etudiants de la classe/:idClasse",
        component: TeacherPages.ListeEtudiantEnseignant,
        meta: { title: "Liste des etudiants de la classe" },
      },
      {
        path: "profile",
        name: "ProfileEnseignant",
        alias: "Profils Enseignant",
        component: OtherPages.Profile,
        meta: { title: "Profils Enseignant" },
      },
      {
        path: "announce",
        name: "AnnoncesEnseignant",
        alias: "Annonces",
        component: OtherPages.Annonces,
        meta: { title: "Annonces" },
      },
    ],
  },
  {
    path: "/student",
    component: LayoutStudent,
    meta: { requiresAuth: true, requiredRole: "student", isActive: 1 },
    children: [
      {
        path: "",
        name: "TableauDeBordsEtudiant",
        alias: "Tableau de bords de l'Etudiant",
        component: StudentPages.TableauDeBordsEtudiant,
        meta: { title: "Tableau de bords de l'Etudiant" },
      },
      {
        path: "announce",
        name: "AnnoncesEtudiant",
        alias: "Annonces",
        component: OtherPages.Annonces,
        meta: { title: "Annonces" },
      },
      {
        path: "class",
        name: "ClasseEtudiant",
        alias: "Information de la classe",
        component: StudentPages.ClasseEtudiant,
        meta: { title: "Information de la classe" },
      },
      {
        path: "courses",
        name: "ListeCoursEtudiant",
        alias: "Liste des cours",
        component: StudentPages.ListeCoursEtudiant,
        meta: { title: "Liste des cours" },
      },
      {
        path: "courses/:id",
        name: "CoursEtudiant",
        alias: "Information sur le cours/:id",
        component: StudentPages.CoursEtudiant,
        meta: { title: "Information sur le cours" },
      },
      {
        path: "messageries",
        name: "ListeDiscussionsEtudiant",
        alias: "Messagerie Etudiant",
        component: ChatPages.ListeDiscussionsStudent,
        meta: { title: "Messagerie Etudiant" },
      },
      {
        path: "Discussion",
        name: "DiscussionStudent",
        alias: "Discussion Etudiant",
        component: ChatPages.DiscussionEtudiants,
        meta: { title: "Discussion Etudiant" },
      },
      {
        path: "messageries/:id",
        name: "DiscussionEtudiant",
        alias: "Discussion de l'Etudiant/:id",
        component: ChatPages.DiscussionStudent,
        meta: { title: "Discussion de l'Etudiant" },
      },
      {
        path: "classStudents",
        name: "ListeEtudiantsEtudiant",
        alias: "Liste des etudiants",
        component: StudentPages.ListeEtudiantsEtudiant,
        meta: { title: "Liste des etudiants" },
      },
      {
        path: "profile",
        name: "ProfileEtudiant",
        alias: "Profil Etudiant",
        component: OtherPages.Profile,
        meta: { title: "Profil Etudiant" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "pageNonTrouvee",
    component: GeneralPages.NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.checkTokenPresence()) {
    next({ name: "Authentification", query: { redirect: to.fullPath } });
    return;
  }

  // Debug initial
  console.log("Navigation to:", to.name);
  console.log("Initial auth state:", {
    hasToken: !!authStore.token,
    hasUser: !!authStore.user,
    user: authStore.user,
    role: authStore.role,
    is_active: authStore.is_active,
  });

  // Si on a un token mais pas de données utilisateur, les récupérer
  if (authStore.token && !authStore.user) {
    // console.log("Token present but no user data, fetching user data...");
    try {
      await authStore.fetchUserData();
      // console.log("User data fetched successfully");
    } catch (error) {
      // console.log("Failed to fetch user data, logging out:", error.message);
      authStore.logout();
    }
  }

  const redirectByRole = (role) => {
    switch (role) {
      case "administrator":
        return { name: "TableauDeBordsAdmin" };
      case "teacher":
        return { name: "TableauDeBordsEnseignant" };
      case "student":
        return { name: "TableauDeBordsEtudiant" };
      default:
        return { name: "Accueil" };
    }
  };

  console.log("Final auth state:", {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user,
    role: authStore.role,
    is_active: authStore.is_active,
  });

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // console.log("Redirecting to login - requires authentication");
    next({ name: "Authentification", query: { redirect: to.fullPath } });
    return;
  }

  // Use the computed role property instead of authStore.role
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    // console.log("Redirecting to dashboard - already authenticated");
    const role = authStore.user?.role;
    // console.log("Redirecting to dashboard - role:", role);
    next(redirectByRole(role));
    return;
  }

  if (to.meta.requiredRole && authStore.user?.role !== to.meta.requiredRole) {
    // console.log(
    //   "Unauthorized - required:",
    //   to.meta.requiredRole,
    //   "has:",
    //   authStore.user?.role
    // );
    next({ name: "Unauthorized" });
    return;
  }

  if (to.meta.requiredRole && authStore.user?.is_active !== to.meta.isActive) {
    console.log(
      "Unauthorized - required:",
      to.meta.isActive,
      "has:",
      authStore.user?.is_active
    );
    next({ name: "NotActivated" });
    return;
  }

  console.log("Navigation allowed");
  next();
});

export default router;
