var vanillaCalendar = {
    month: document.querySelectorAll('[data-calendar-area="month"]')[0],
    next: document.querySelectorAll('[data-calendar-toggle="next"]')[0],
    previous: document.querySelectorAll('[data-calendar-toggle="previous"]')[0],
    label: document.querySelectorAll('[data-calendar-label="month"]')[0],
    activeDates: null,
    date: new Date,
    todaysDate: new Date,
    init: function(t) {
        this.options = t, this.date.setDate(1), this.createMonth(), this.createListeners()
    },
    createListeners: function() {
        var e = this;
        this.next.addEventListener("click", function() {
            e.clearCalendar();
            var t = e.date.getMonth() + 1;
            e.date.setMonth(t), e.createMonth()
        }), this.previous.addEventListener("click", function() {
            e.clearCalendar();
            var t = e.date.getMonth() - 1;
            e.date.setMonth(t), e.createMonth()
        })
    },
    createDay: function(t, e, a) {
        var i = document.createElement("div"),
            n = document.createElement("span");
        n.innerHTML = t, i.className = "vcal-date", i.setAttribute("data-calendar-date", this.date), 1 === t && (i.style.marginLeft = 0 === e ? 6 * 14.28 + "%" : 14.28 * (e - 1) + "%"), this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1 || (i.classList.add("vcal-date--active"), i.setAttribute("data-calendar-status", "active")), this.date.toString() === this.todaysDate.toString() && i.classList.add("vcal-date--today"), i.appendChild(n), this.month.appendChild(i)
    },
    dateClicked: function() {
        this.activeDates = document.querySelectorAll('[data-calendar-status="active"]');
        for (var t = 0; t < this.activeDates.length; t++) this.activeDates[t].addEventListener("click", function(t) {})
    },
    createMonth: function() {
        for (var t = this.date.getMonth(); this.date.getMonth() === t;) this.createDay(this.date.getDate(), this.date.getDay(), this.date.getFullYear()), this.date.setDate(this.date.getDate() + 1);
        this.date.setDate(1), this.date.setMonth(this.date.getMonth() - 1), this.label.setAttribute('data-number-month',((t+1)<10 ? '0'+ (t+1) : t+1)),this.label.innerHTML = this.monthsAsString(this.date.getMonth()) + " " + this.date.getFullYear(), this.dateClicked()
    },
    monthsAsString: function(t) {
        return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"][t]
    },
    clearCalendar: function() {
        vanillaCalendar.month.innerHTML = ""
    },
    removeActiveClass: function() {
        for (var t = 0; t < this.activeDates.length; t++) this.activeDates[t].classList.remove("vcal-date--selected")
    }
};


