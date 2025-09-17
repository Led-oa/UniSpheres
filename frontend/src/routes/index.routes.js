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
        component: GeneralPages.Accueil,
      },
      {
        path: "about",
        name: "Apropos",
        component: GeneralPages.Apropos,
      },
      {
        path: "notActivated",
        name: "NotActivated",
        component: GeneralPages.NotActivated,
      },
      {
        path: "Unauthorized",
        name: "Unauthorized",
        component: GeneralPages.Unauthorized,
      },
      {
        path: "login",
        name: "Authentification",
        component: AuthPages.Authentification,
        meta: { requiresAuth: false, guestOnly: true },
      },
      {
        path: "register",
        name: "Inscription",
        component: AuthPages.Inscription,
        meta: { requiresAuth: false, guestOnly: true },
      },
    ],
  },
  {
    path: "/administrator",
    component: LayoutAdmin,
    meta: { requiresAuth: true, requiredRole: "administrator" },
    children: [
      {
        path: "",
        name: "TableauDeBordsAdmin",
        component: AdminPages.TableauDeBordsAdmin,
      },
      {
        path: "announces",
        name: "GestionAnnoncesAdmin",
        component: AdminPages.GestionAnnoncesAdmin,
      },
      {
        path: "courses",
        name: "GestionCoursAdmin",
        component: AdminPages.GestionCoursAdmin,
      },
      {
        path: "users",
        name: "GestionUtilisateursAdmin",
        component: AdminPages.GestionUtilisateursAdmin,
      },
      {
        path: "classes",
        name: "GestionAcademiquesAdmin",
        component: AdminPages.GestionAcademiquesAdmin,
      },
      {
        path: "classes/:idClasse",
        name: "GestionClassesAdmin",
        component: AdminPages.GestionClassesAdmin,
      },
      {
        path: "profile",
        name: "ProfileAdmin",
        component: OtherPages.Profile,
      },
    ],
  },
  {
    path: "/teacher",
    component: LayoutTeacher,
    meta: { requiresAuth: true, requiredRole: "teacher" },
    children: [
      {
        path: "",
        name: "TableauDeBordsEnseignant",
        component: TeacherPages.TableauDeBordsEnseignant,
      },
      {
        path: "classes",
        name: "ListeClasseEnseignant",
        component: TeacherPages.ListeClasseEnseignant,
      },
      {
        path: "courses",
        name: "ListeCoursEnseignant",
        component: TeacherPages.ListeCoursEnseignant,
      },
      {
        path: "courses/:id/details",
        name: "CoursEnseignant",
        component: TeacherPages.CoursEnseignant,
      },
      {
        path: "courses/:id/noter",
        name: "NoterCoursEnseignant",
        component: TeacherPages.NoterCoursEnseignant,
      },
      {
        path: "classes/:idClasse/notes",
        name: "NotesClasseEnseignant",
        component: TeacherPages.NotesClasseEnseignant,
      },
      {
        path: "classes/:idClasse/etudiants",
        name: "ListeEtudiantEnseignant",
        component: TeacherPages.ListeEtudiantEnseignant,
      },
      {
        path: "profile",
        name: "ProfileEnseignant",
        component: OtherPages.Profile,
      },
      {
        path: "announce",
        name: "AnnoncesEnseignant",
        component: OtherPages.Annonces,
      },
    ],
  },
  {
    path: "/student",
    component: LayoutStudent,
    meta: { requiresAuth: true, requiredRole: "student" },
    children: [
      {
        path: "",
        name: "TableauDeBordsEtudiant",
        component: StudentPages.TableauDeBordsEtudiant,
      },
      {
        path: "announce",
        name: "AnnoncesEtudiant",
        component: OtherPages.Annonces,
      },
      {
        path: "class",
        name: "ClasseEtudiant",
        component: StudentPages.ClasseEtudiant,
      },
      {
        path: "courses",
        name: "ListeCoursEtudiant",
        component: StudentPages.ListeCoursEtudiant,
      },
      {
        path: "courses/:id",
        name: "CoursEtudiant",
        component: StudentPages.CoursEtudiant,
      },
      {
        path: "messageries",
        name: "ListeDiscussionsEtudiant",
        component: ChatPages.ListeDiscussions,
      },
      {
        path: "messageries/:id",
        name: "DiscussionEtudiant",
        component: ChatPages.Discussion,
      },
      {
        path: "classStudents",
        name: "ListeEtudiantsEtudiant",
        component: StudentPages.ListeEtudiantsEtudiant,
      },
      {
        path: "profile",
        name: "ProfileEtudiant",
        component: OtherPages.Profile,
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

// --- Garde globale refactorisée ---
router.beforeEach(async (to, from, next) => {
  // const userStore = useUserStore();

  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.checkTokenPresence()) {
    next({ name: "Authentification", query: { redirect: to.fullPath } });
    return;
  }

  // Debug initial
  console.log("Navigation to:", to.name);
  // console.log("Initial auth state:", {
  //   hasToken: !!authStore.token,
  //   hasUser: !!authStore.user,
  //   user: authStore.user,
  //   role: authStore.role,
  // });

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

  // console.log("Final auth state:", {
  //   isLoggedIn: authStore.isLoggedIn,
  //   user: authStore.user,
  //   role: authStore.role,
  // });

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

  console.log("Navigation allowed");
  next();
});

export default router;
