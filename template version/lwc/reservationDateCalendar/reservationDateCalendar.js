import { LightningElement, api, track } from 'lwc';
class CalendarDay {
    constructor(calendarDate, disabled, selected) {
        this.calendarDate = calendarDate;
        this.disabled = disabled;
        this.selected = Boolean(selected);
    }
}
export default class ReservationDateCalendar extends LightningElement {

    @api
    set calendarDate(value) {
        this._calendarDate = value;
        this.generateCalendarDays();
    }

    get calendarDate() {
        return this._calendarDate;
    }

    @api
    set selectedStartDate(value) {
        this._selectedStartDate = value;
        this.generateCalendarDays();
    }

    get selectedStartDate() {
        return this._selectedStartDate;
    }

    @api
    set selectedEndDate(value) {
        this._selectedEndDate = value;
        this.generateCalendarDays();
    }

    get selectedEndDate() {
        return this._selectedEndDate;
    }

    @api
    dateId

    @api
    disableIncrement

    @api
    disableDecrement

    @track
    days;

    renderedCallback() {
        if(this.disableDecrement) {
            this.template.querySelector("[id^='prevMonth']").classList.add("slds-hide");
        } else {
            this.template.querySelector("[id^='prevMonth']").classList.remove("slds-hide");
        }
        if(this.disableIncrement) {
            this.template.querySelector("[id^='nextMonth']").classList.add("slds-hide");
        } else {
            this.template.querySelector("[id^='nextMonth']").classList.remove("slds-hide");
        }
    }

    get currentMonth() {
        return this.calendarDate ? this.calendarDate.format("MMMM") : "";
    }

    get currentYear() {
        return this.calendarDate ? this.calendarDate.format("YYYY") : "";
    }

    incrementMonth() {
        let newDate = this.calendarDate.clone().add(1, "M");
        this._changeMonth(newDate);
    }

    decrementMonth() {
        let newDate = this.calendarDate.clone().add(-1, "M");
        this._changeMonth(newDate);
    }

    handleSelectDay(evt) {
        let selectDayEvent = new CustomEvent("selectday", { detail: evt.detail});
        this.dispatchEvent(selectDayEvent);
    }

    _changeMonth(newDate) {
        let changeMonthEvent = new CustomEvent("changecalendardate", { detail: newDate.format() });
        this.dispatchEvent(changeMonthEvent);
    }

    generateCalendarDays() {
        if(this.calendarDate) {
            let currentDate = this.calendarDate.clone().startOf("month");
            let endDate = this.calendarDate.clone().endOf("month");
            let startDate = findStartOfWeek(currentDate);
            let month = new Array();
            while(!startDate.isAfter(endDate)) {
                let week = generateWeek(startDate, this.calendarDate.month(), this.selectedStartDate, this.selectedEndDate);
                month = month.concat(week);
                startDate = startDate.clone().add(1, "weeks");
            }
            this.days = month;
        }

        function generateWeek(weekStart, calendarMonth, selectedStart, selectedEnd) {
            let week = new Array();
            for(let m = 0; m<7; m++) {
                let calendarDayDate = weekStart.clone().add(m, "days");
                let notCurrentMonth = calendarDayDate.month() !== calendarMonth;
                let isSelected = isDaySelected(calendarDayDate, selectedStart, selectedEnd);
                week.push(new CalendarDay(calendarDayDate, notCurrentMonth, isSelected));
            }
            return week;
        }

        function findStartOfWeek(dateInWeek) {
            let startOfMonthDiff = -1 * dateInWeek.day();
            return dateInWeek.clone().add(startOfMonthDiff, "days");
        }

        function isDaySelected(calendarDayDate, selectedStart, selectedEnd) {
            if(selectedStart && selectedEnd) {
                return calendarDayDate.isBetween(selectedStart, selectedEnd, "days", "[]");
            } else if(selectedStart) {
                return calendarDayDate.isSame(selectedStart, "day");
            }
            return false;
        }
    }

}