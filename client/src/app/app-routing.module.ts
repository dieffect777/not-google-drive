import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {FilePageComponent} from "./file-page/file-page.component";
import {AddFilePageComponent} from "./add-file-page/add-file-page.component";
import {OpenFilePageComponent} from "./open-file-page/open-file-page.component";
import {AddShareComponent} from "./add-share/add-share.component";

const routes: Routes = [
  {
    path:'', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path:'login', component: LoginPageComponent},
      {path:'register', component: RegisterPageComponent}
    ]
  },
  {
    path:'', component: SiteLayoutComponent, canActivate:[AuthGuard], children: [
      {path: "file", component: FilePageComponent},
      {path: "file/new", component: AddFilePageComponent},
      {path: "file/:fileid", component: OpenFilePageComponent},
      {path: "file/add/:sharehash", component: AddShareComponent}
    ]
  }
]

@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule {
}
