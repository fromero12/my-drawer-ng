import { Injectable } from '@angular/core';
import { getJSON } from "@nativescript/core/http";
import { request } from "@nativescript/core/http";
const sqlite = require("nativescript-sqlite");

@Injectable()
export class NoticiasService {
    api: string = "https://cherub-manhole-blooper.ngrok-free.dev";

    constructor() {
        this.getDb((db:any) => {
            console.dir(db);
            db.each("select * from logs",
                (err: any, fila: any) => console.log("fila: ", fila),
                (err:any, totales:any) => console.log("Filas totales: ", totales));
        }, () => console.log("error on getDB"));
    }

    getDb(fnOk: any, fnError: any) {
        return new sqlite("mi_db_logs", (err:any, db:any) => {
            if (err) {
                console.error("Error al abrir db!", err);
            } else {
                console.log("Está la db abierta: ", db.isOpen() ? "Si" : "No");
                db.execSQL("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, texto TEXT)")
                    .then((id:any) => {
                        console.log("CREATE TABLE OK");
                        fnOk(db);
                    }, (error:any) => {
                        console.log("CREATE TABLE ERROR", error);
                        fnError(error);
                    });
            }
        });
    }

    agregar(s: string) {
    return request({
        url: this.api + "/favs",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            nuevo: s
        })
    });
}

    favs() {
    return getJSON(this.api + "/favs");
    }

    buscar(s: string) {
    this.getDb((db:any) => {
        db.execSQL("insert into logs (texto) values (?)", [s],
            (err:any, id:any) => console.log("nuevo id: ", id));
    }, () => console.log("error on getDB"));

    return getJSON(this.api + "/get?q=" + s);   
    }   


}


    //private baseUrl: string = "https://cherub-manhole-blooper.ngrok-free.dev";
