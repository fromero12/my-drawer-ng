import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { AppState } from "../app.module";
import { Noticia, NuevaNoticiaAction } from "../domain/noticias-state.model";
import { NoticiasService } from "../domain/noticias.service";
import { Dialogs, Application, View } from "@nativescript/core";
import { SocialShare } from "@nativescript/social-share";

@Component({
    selector: "Search",
    moduleId: module.id,
    templateUrl: "./search.component.html"
})
export class SearchComponent implements OnInit {
    // CORRECCIÓN: 'resultados' debe ser 'any' o una interfaz, no Array<string>
    resultados: any = { items: [] }; 
    @ViewChild("layout", { static: false }) layout!: ElementRef;

    constructor(
        private noticias: NoticiasService,
        private store: Store<AppState>
    ) { }

    ngOnInit(): void {
        // Uso de encadenamiento opcional para evitar errores de null
        this.store.select((state: any) => state.noticias?.sugerida)
            .subscribe((sugerida) => {
                if (sugerida) {
                    Dialogs.alert({
                        title: "Sugerencia",
                        message: "Sugerimos leer: " + sugerida.titulo,
                        okButtonText: "Cerrar"
                    });
                }
            });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args: any): void {
        // Asegúrate de que el bindingContext sea del tipo Noticia
        this.store.dispatch(new NuevaNoticiaAction(new Noticia(args.view.bindingContext)));
    }

    onLongPress(s): void {
        console.log(s);
        SocialShare.shareText(s,"Asunto: compartido desde el curso!");
    }

    buscarAhora(s: string) {
        console.log("Iniciando búsqueda: " + s);
        this.noticias.buscar(s).then(
            (r: any) => {
                // CORRECCIÓN: Asignamos el objeto r completo o inicializamos estructura segura
                this.resultados = r ? r : { items: [] };
                console.log("Resultados recibidos:", JSON.stringify(this.resultados));
            }, 
            (e) => {
                console.error("Error en búsqueda:", e);
                Dialogs.alert({
                    title: "Error",
                    message: "No se pudieron obtener resultados.",
                    okButtonText: "Cerrar"
                });
            }
        );
    }
}