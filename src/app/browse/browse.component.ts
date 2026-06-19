import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";

// Registrar el elemento para Google Maps
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
    selector: "Browse",
    moduleId: module.id,
    templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {
    @ViewChild("MapView", { static: false }) mapView!: ElementRef;

    constructor() {
        // Inyección de servicios
    }

    ngOnInit(): void {
        // Inicialización
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onMapReady(args: any): void {
        console.log("Map Ready");
    }
}