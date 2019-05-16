import { LightningElement, api } from 'lwc';

export default class ReservationDateCalendarDay extends LightningElement {
    @api
    calendarDate;

    @api
    disabled;

    @api
    selected;

    get dateNumber() {
        if(this.calendarDate) {
            return this.calendarDate.date();
        }
        return "";
    }

    get dayClass() {
        let cssClass  = "day slds-align_absolute-center";
        if(this.disabled) {
            cssClass += " disabled";
        } else if(this.selected) {
            cssClass += " selected";
        }
        return cssClass;
    }

    selectDay() {
        if(!this.disabled) {
            let selectDayEvent = new CustomEvent("selectday", { detail: this.calendarDate.clone()});
            this.dispatchEvent(selectDayEvent);
        }
    }
}