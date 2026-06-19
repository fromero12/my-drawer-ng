import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouterExtensions } from '@nativescript/angular'
import {
  DrawerTransitionBase,
  RadSideDrawer,
  SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer'
import { filter } from 'rxjs/operators'
import { Application, Dialogs } from '@nativescript/core'
import * as firebase from 'nativescript-plugin-firebase'

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  private _activatedUrl!: string
  private _sideDrawerTransition!: DrawerTransitionBase

  constructor(private router: Router, private routerExtensions: RouterExtensions) {
    // Use the component constructor to inject services.
  }

  ngOnInit(): void {
    this._activatedUrl = '/home'
    this._sideDrawerTransition = new SlideInOnTopTransition()

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => (this._activatedUrl = event.urlAfterRedirects))

    this.initFirebase()
  }

  private initFirebase(): void {
    firebase
      .init({
        onMessageReceivedCallback: (message: any) => {
          console.log(`titulo: ${message.title}`)
          console.log(`cuerpo: ${message.body}`)
          console.log(`data: ${JSON.stringify(message.data)}`)

          Dialogs.alert({
            title: 'Notificación',
            message: message.title,
            okButtonText: 'Cerrar',
          })
        },
        onPushTokenReceivedCallback: (token: string) =>
          console.log('Firebase push token: ' + token),
      })
      .then(
        () => console.log('firebase.init done'),
        (error) => console.log(`firebase.init error: ${error}`)
      )
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition
  }

  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url
  }

  onNavItemTap(navItemRoute: string): void {
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })

    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }
}