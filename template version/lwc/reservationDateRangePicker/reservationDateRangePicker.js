import { LightningElement, api, track } from 'lwc';
import momentjs from '@salesforce/resourceUrl/momentjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ReservationDateRangePicker extends LightningElement {
    @api
    arrivingDate
    @api
    departingDate

    @track
    selectedStartDate
    @track
    selectedEndDate

    @track
    moment

    connectedCallback() {
		loadScript(this, momentjs).then(()=>{
            this.moment = moment;
        });
    }

    renderedCallback() {
        this.template.querySelector("[name='start']").value = this.selectedStartDate ? this.selectedStartDate.format("M/D/YYYY"): "";
        this.template.querySelector("[name='end']").value = this.selectedEndDate ? this.selectedEndDate.format("M/D/YYYY"): "";
    }

    handleChangeStartDate(evt) {
        let inputValue = evt.target.value;
        let inputDate = this.moment(inputValue);
        if(inputDate.isValid()) {
            this.selectedStartDate = inputDate;
            evt.target.value = inputDate.format("M/D/YYYY");
        } else {
            this.selectedStartDate = null;
            this.querySelector("[name='start']").value = "";
        }
    }

    handleChangeEndDate(evt) {
        let inputValue = evt.target.value;
        let inputDate = this.moment(inputValue);
        if(inputDate.isValid()) {
            this.selectedEndDate = inputDate;
            evt.target.value = inputDate.format("M/D/YYYY");
        } else {
            this.selectedEndDate = null;
            this.querySelector("[name='end']").value = "";
        }
    }

    handleSelectDay(evt) {
        let newDate = evt.detail;
        if((this.selectedStartDate && this.selectedEndDate) 
            || !this.selectedStartDate) {
            this.selectedStartDate = newDate;
            this.selectedEndDate = null;
        } else if (this.selectedStartDate && !this.selectedEndDate) {
            this.selectedEndDate = newDate;
        }
    }

    handleIconClick() {
        this.template.querySelector("c-reservation-date-range-calendar").toggleCalendar();
    }
}