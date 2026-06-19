import { Component } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application } from "@nativescript/core";
// Importamos el plugin de cámara
import * as camera from "@nativescript/camera";
import { Image } from "tns-core-modules/ui/image";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent {

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onButtonTap(): void {
        camera.requestPermissions().then(
            () => {
                const options = { width: 300, height: 300, keepAspectRatio: false, saveToGallery: true };
                camera.takePicture(options).then((imageAsset) => {
                    console.log("Tamaño: " + imageAsset.options.width + "x" + imageAsset.options.height);
                    console.log("Foto guardada exitosamente");
                }).catch((err) => {
                    console.log("Error al tomar la foto -> " + err.message);
                });
            },
            () => {
                console.log("Permiso de cámara no aceptado por el usuario");
            }
        );
    }
}