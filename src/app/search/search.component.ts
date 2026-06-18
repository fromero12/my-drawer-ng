/*import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { Application, Dialogs } from '@nativescript/core';
import { NoticiasService } from "../domain/noticias.service";

@Component({
  selector: 'Search',
  moduleId: module.id,
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  resultados: Array<string> = [];
  @ViewChild("layout", { static: false }) layout!: ElementRef;

  constructor(public noticias: NoticiasService) {
  }

  ngOnInit(): void {
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView();
    sideDrawer.showDrawer();
  }

  onItemTap(x: any): void {
    console.dir(x);
  }

  buscarAhora(s: string) {
    console.dir("buscarAhora" + s);
    this.noticias.buscar(s).then((r: any) => {
        console.log("resultados buscarAhora: " + JSON.stringify(r));
        this.resultados = r;
    }, (e: any) => {
        console.log("error buscarAhora " + e);
        // Usamos Dialogs que es parte del core de NativeScript
        // Esto elimina cualquier dependencia de plugins externos que estaban fallando
        Dialogs.alert({
            title: "Error",
            message: "Error en la búsqueda: " + e,
            okButtonText: "Cerrar"
        });
    });
  }
}*/

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AppState } from "../app.module";
import { Noticia, NuevaNoticiaAction } from "../domain/noticias-state.model";
import { NoticiasService } from "../domain/noticias.service";
// Importamos Dialogs y Application desde @nativescript/core
import { Dialogs, Application } from "@nativescript/core";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    resultados: Array<string> = [];
    @ViewChild("layout", { static: false }) layout!: ElementRef;

    constructor(
        private noticias: NoticiasService,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        this.store.select((state: any) => state.noticias ? state.noticias.sugerida : null)
            .subscribe((f) => {
                if (f != null) {
                    // Usamos Dialogs.alert en lugar de Toast
                    Dialogs.alert({
                        title: "Sugerencia",
                        message: "Sugerimos leer: " + f.titulo,
                        okButtonText: "Cerrar"
                    });
                }
            });
    }

    onDrawerButtonTap(): void {
        // Forma moderna de obtener el root view para el SideDrawer
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args: any): void {
        this.store.dispatch(new NuevaNoticiaAction(new Noticia(args.view.bindingContext)));
    }

    buscarAhora(s: string) {
        console.dir("buscarAhora" + s);
        this.noticias.buscar(s).then((r: any) => {
            console.log("resultados buscarAhora: " + JSON.stringify(r));
            this.resultados = r;   
        }, (e) => {
            console.log("error buscarAhora " + e);
            //Toast.show({text: "Error en la búsqueda", duration: Toast.DURATION.SHORT});
        });
    }
}
