import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@vcb/shared-libs";

@Component({
    selector: 'app-payment-landing',
    templateUrl: './payment.landing.component.html',
    styleUrl: './payment.landing.component.scss',
    imports: [RouterLink, TranslatePipe]
})
export class PaymentLandingComponent {

}