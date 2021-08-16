import { Routes } from '@angular/router';
import { CadastroPessoas } from 'app/cadastro-pessoas/cadastro-pessoas.component';
import { Pessoas } from '../../pessoas/pessoas.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'pessoas',   component: Pessoas },
    { path: 'cadastro-pessoas',   component: CadastroPessoas },
];
