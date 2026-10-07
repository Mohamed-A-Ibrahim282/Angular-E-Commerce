import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth-layout/auth/auth.component';
import { MainComponent } from './layouts/auth-layout/main/main.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { logedGuard } from './core/guards/loged/loged.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '', component: AuthComponent, canActivate: [logedGuard], children: [
            { path: 'login', loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent), title: 'Login' },
            { path: 'register', loadComponent: () => import('./pages/register/register.component').then((c) => c.RegisterComponent), title: 'Register' },
            { path: 'forgetPassword', loadComponent: () => import('./pages/forget-password/forget-password.component').then((c) => c.ForgetPasswordComponent), title: 'Forget password' },
        ]
    },
    {
        path: '', component: MainComponent, canActivate: [authGuard], children: [
            { path: 'home', loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent), title: 'Home' },
            { path: 'products', loadComponent: () => import('./pages/products/products.component').then((c) => c.ProductsComponent), title: 'Products' },
            { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then((c) => c.CartComponent), title: 'Cart' },
            { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then((c) => c.CategoriesComponent), title: 'Categories' },
            { path: 'category/:id', loadComponent: () => import('./pages/category-products/category-products.component').then((c) => c.CategoryProductsComponent), title: 'Category products' },
            { path: 'productDetails/:id', loadComponent: () => import('./pages/product-details/product-details.component').then((c) => c.ProductDetailsComponent), title: 'Product details' },
            { path: 'brands', loadComponent: () => import('./pages/brands/brands.component').then((c) => c.BrandsComponent), title: 'Brands' },
            { path: 'brand-products/:id', loadComponent: () => import('./pages/brand-products/brand-products.component').then((c) => c.BrandProductsComponent), title: 'Brand products' },
            { path: 'allorders', loadComponent: () => import('./pages/all-orders/all-orders.component').then((c) => c.AllOrdersComponent), title: 'All orders' },
            { path: 'checkout/:id', loadComponent: () => import('./pages/checkout/checkout.component').then((c) => c.CheckoutComponent), title: 'Checkout' },
            { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then((c) => c.WishlistComponent), title: 'Checkout' },
            { path: '**', component: NotfoundComponent, title: 'Notfound' },
        ]
    },
];
