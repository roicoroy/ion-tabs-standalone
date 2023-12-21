import { Injectable, inject } from "@angular/core";
import { AlertController, AlertOptions } from "@ionic/angular";
import { State, Store, Action, StateContext } from "@ngxs/store";
import { ErrorLoggingActions } from "./errors-logging.actions";
import { AlertService } from "src/app/shared/utils/alert.service";

export class ErrosStateModel {
    entries!: Error[];
}

@State({
    name: 'errors',
})
@Injectable()
export class ErrorsLoggingState {

    errorEntries: Error[] = [];

    private alertService = inject(AlertService);

    @Action(ErrorLoggingActions.LogErrorEntry)
    async logErrorEntry(ctx: StateContext<unknown>, action: ErrorLoggingActions.LogErrorEntry): Promise<void> {
        if (action.error.error?.message != null) {
            await this.alertService.presentSimpleAlert(action.error.error.message);
        }
        if (action.error && !action.error.error) {
            await this.alertService.presentSimpleAlert(JSON.stringify(action.error, ["message", "arguments", "type", "name"]));
        }
        this.errorEntries.push(action.error);
        ctx.patchState({
            entries: this.errorEntries,
        });
    }

    @Action(ErrorLoggingActions.ClearErrorEntry)
    clearErrprEntry(ctx: StateContext<unknown>): void {
        ctx.patchState({
            entries: null,
        });
    }
}
