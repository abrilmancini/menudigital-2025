import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register/register';
import { RestaurantsPage } from './pages/restaurants-page/restaurants-page';
import { MenuPage } from './pages/menu-page/menu-page';
import { ProductDetailPage } from './pages/product-detail-page/product-detail-page';
import { LoggedLayout } from './layouts/logged-layout/logged-layout';
import { CategoriesPage } from './pages/categories-page/categories-page';
import { NewEditProduct } from './pages/new-edit-product/new-edit-product';
import { ProfilePage } from './pages/profile-page/profile-page';
import { onlyPublicGuard } from './guards/only-public-guard-guard';
import { onlyUserGuard } from './guards/only-user-guard-guard';
import { ProductsPage } from './pages/products-page/products-page';

export const routes: Routes = [

    {
        path: '',
        component: RestaurantsPage
    },

    {
        path: 'menu/:id',
        component: MenuPage
    },

    {
        path: 'products/:id',
        component: ProductDetailPage
    },

    {
        path: 'login',
        component: LoginPage,
        canActivate: [onlyPublicGuard]
    },

    {
        path: 'register',
        component: RegisterPage,
        canActivate: [onlyPublicGuard]
    },

    {
        path: 'dashboard',
        component: LoggedLayout,
        canActivateChild: [onlyUserGuard],
        children: [
            {
                path: 'categories',
                component: CategoriesPage
            },
            {
                path: 'products/new',
                component: NewEditProduct
            },

            {
                path: 'products/:id/edit',
                component: NewEditProduct
            },
            {
            path: 'products',
            component: ProductsPage
            },

            {
                path: 'profile',
                component: ProfilePage
            }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }

];