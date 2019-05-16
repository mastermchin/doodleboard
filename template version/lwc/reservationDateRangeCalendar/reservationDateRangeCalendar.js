import { LightningElement, api, track} from 'lwc';
import momentjs from '@salesforce/resourceUrl/momentjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ReservationDateRangeCalendar extends LightningElement {
    @track 
    showing
    @track
    calendarInitialized

    @track
    startRangeDate
    @track
    endRangeDate
    
    @track
    moment

    @api
    set selectedStartDate(value) {
        this._selectedStartDate = value;
        this.selectDatesChanged();
    }

    get selectedStartDate() {
        return this._selectedStartDate;
    }

    @api
    set selectedEndDate(value) {
        this._selectedEndDate = value;
        this.selectDatesChanged();
    }

    get selectedEndDate() {
        return this._selectedEndDate;
    }

    @api
    toggleCalendar() {
        this.showing = !this.showing;
        this.toggleCalendarVisibility();
        this.initializeCalendar();
    }

    
    get rangeIsOneMonth() {
        if(this.startRangeDate && this.endRangeDate) {
            return this.endRangeDate.diff(this.startRangeDate, "months") <= 1;
        }
        return false;
    }

    connectedCallback() {
		loadScript(this, momentjs).then(()=>{
            this.moment = moment;
        });
    }

    renderedCallback() {
        this.toggleCalendarVisibility(); 
    }

    initializeCalendar() {
        if(!this.calendarInitialized) {
            let baseStart = this.selectedStartDate ? this.selectedStartDate :this.moment();
            let baseEnd = this.selectedEndDate ? this.selectedEndDate :this.moment();
            let startDate =  baseStart.startOf("month");
            let endDate = baseEnd.startOf("month");
            this.resetCalendarRange(startDate, endDate);
            this.calendarInitialized = true;
        }
    }

    selectDatesChanged() {
        if(this.selectedStartDate) {
            let baseEnd;
            let baseStart = this.selectedStartDate.clone().startOf("month");
            if(!this.selectedEndDate) {
                baseEnd = this.selectedStartDate.clone().startOf("month").add(1, "months");
            } else {
                baseEnd = this._selectedEndDate.clone().startOf("month");
            }
            this.resetCalendarRange(baseStart, baseEnd);
        }
    }

    resetCalendarRange(startDate, endDate) {
        this.startRangeDate = startDate.clone();
        if(!endDate) {
            this.endRangeDate = startDate.clone();
        }
        this.endRangeDate = endDate.clone();
        if(this.startRangeDate.month() === this.endRangeDate.month()) {
            this.endRangeDate.add(1, "months");
        }      
    }

    toggleCalendarVisibility() {
        let container = this.template.querySelector(".calendar-container");
        if(container) {
            if(!this.showing) {
                container.classList.add("slds-hide");
            } else{
                container.classList.remove("slds-hide");
            }
        }
    }

    handleChangeStartRangeDateHandler(event){
        this.startRangeDate = (this.moment(event.detail));
        this.endRangeDate = this.endRangeDate.clone();
    }

    handleChangeEndRangeDateHandler(event){
        this.startRangeDate = this.startRangeDate.clone();
        this.endRangeDate = (this.moment(event.detail));
    }

    handleSelectDay(evt) {
        let selectDayEvent = new CustomEvent("selectday", { detail: evt.detail});
        this.dispatchEvent(selectDayEvent);
    }
}