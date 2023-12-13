import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, checkmarkOutline, book, cart, wallet, bicycle, home, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      checkmarkOutline,
      home,
      book,
      cart,
      wallet,
      bicycle,
      arrowBack
    });
  }
}
