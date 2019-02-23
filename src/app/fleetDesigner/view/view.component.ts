import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit, OnDestroy {
  @Input() design: ShipDesign;
  @Input() showDifference = false;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.designEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
