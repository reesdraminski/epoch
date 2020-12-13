const yearsSection = document.getElementById("yearsSection");
const yearsBar = document.getElementById("yearsProgress");
const yearsDisplay = document.getElementById("yearsDisplay");

const monthsSection = document.getElementById("monthsSection");
const monthsBar = document.getElementById("monthsProgress");
const monthsDisplay = document.getElementById("monthsDisplay");

const daysSection = document.getElementById("daysSection");
const daysBar = document.getElementById("daysProgress");
const daysDisplay = document.getElementById("daysDisplay");

const hoursSection = document.getElementById("hoursSection");
const hoursBar = document.getElementById("hoursProgress");
const hoursDisplay = document.getElementById("hoursDisplay");

const minutesSection = document.getElementById("minutesSection");
const minutesBar = document.getElementById("minutesProgress");
const minutesDisplay = document.getElementById("minutesDisplay");

const secondsBar = document.getElementById("secondsProgress");
const secondsDisplay = document.getElementById("secondsDisplay");

const lastMilestoneEl = document.getElementById("lastMilestone");
const nextMilestoneEl = document.getElementById("nextMilestone");

// the time that is being counted from
let epoch;

/**
 * Initialize UI components.
 */
(function initUI() {
    // get epoch from storage
    epoch = localStorage.getItem("epoch");

    // if the user has defined an epoch
    if (epoch)
    {
        epoch = new Date(epoch);

        // calculate elapsed time
        updateDisplay();

        // update elapsed time every second
        setInterval(updateDisplay, 1000);
    }
    // if the user has not defined an epoch
    else
    {
        // show input screen
        document.getElementById("inputScreen").style.display = "";

        // hide bars read out
        document.getElementById("bars").style.display = "none";

        // bind to submit button
        document.getElementById("saveDatetime").onclick = () => {
            // save date time
            localStorage.setItem("epoch", document.getElementById("userInput").value);

            // set as epoch
            epoch = new Date(document.getElementById("userInput").value);

            // show bars read out
            document.getElementById("bars").style.display = "";

            // hide input input screen
            document.getElementById("inputScreen").style.display = "none";

            // update display right now so we don't have to wait a second
            updateDisplay();

            // update display every second
            setInterval(updateDisplay, 1000);
        }
    }
})();

/**
 * Calculate the elapsed time since the starting point and update the bars.
 */
function updateDisplay() {
    // get the current time in milliseconds
    const now = new Date().getTime();

    // get total seconds from milliseconds
    let elapsed = Math.floor((now - epoch) / 1000);

    const years = Math.floor(elapsed / (365 * 24 * 60 * 60));
    elapsed = elapsed - years * (365 * 24 * 60 * 60);

    // hide years if there haven't been any that have elapsed
    if (years === 0)
    {
        yearsSection.style.display = "none";
    }

    // calculate months
    const months = Math.floor(elapsed / (30 * 24 * 60 * 60));
    elapsed = elapsed - months * (30 * 24 * 60 * 60);

    // hide months if there haven't been any that have elapsed
    if (months === 0 && years === 0)
    {
        monthsSection.style.display = "none";
    }

    // calculate days
    const days = Math.floor(elapsed / (24 * 60 * 60));
    elapsed = elapsed - days * (24 * 60 * 60);

    // hide days if there haven't been any that have elapsed
    if (days === 0 && months === 0)
    {
        daysSection.style.display = "none";
    }

    // calculate hours
    const hours = Math.floor(elapsed / (60 * 60));    
    elapsed = elapsed - hours * (60 * 60);

    // hide hours if there haven't been any that have elapsed
    if (hours === 0 && days === 0)
    {
        hoursSection.style.display = "none";
    }

    // calculate minutes
    const minutes = Math.floor(elapsed / 60);

    // hide minutes if there haven't been any that have elapsed
    if (minutes === 0 && hours === 0)
    {
        minutesSection.style.display = "none";
    }

    // calculate seconds
    const seconds = elapsed - minutes * 60;

    // update progress bar values
    yearsBar.value = years;
    monthsBar.value = months;
    daysBar.value = days;
    hoursBar.value = hours;
    minutesBar.value = minutes;
    secondsBar.value = seconds;

    // update time readouts
    yearsDisplay.innerText = `${years} ${years == 1 ? "year" : "years"}`;
    monthsDisplay.innerText = `${months} ${months == 1 ? "month" : "months"}`;
    daysDisplay.innerText = `${days} ${days == 1 ? "day" : "days"}`;
    hoursDisplay.innerText = `${hours} ${hours == 1 ? "hour" : "hours"}`;
    minutesDisplay.innerText = `${minutes} ${minutes == 1 ? "minute" : "minutes"}`;
    secondsDisplay.innerText = `${seconds} ${seconds == 1 ? "second" : "seconds"}`;

    // calculate last and next milestones
    let lastMilestone = "", nextMilestone = "";
    if (days === 0)
    {
        lastMilestone = "N/A";
        nextMilestone = "1 day";
    }
    else
    {
        // get last multiple of 5 days, or last month
        const last = Math.floor(days / 5) * 5;

        // if the last milestone was a month milestone
        if (last % 30 === 0 && last !== 0)
        {
            lastMilestone = `${last / 30} ${last / 30 == 1 ? "month" : "months"}`;
        }
        else
        {
            // get the one day milestone
            if (last === 0 && days < 5)
            {
                lastMilestone = `1 day`;
            }
            else
            {
                lastMilestone = `${last} days`;
            }
        }

        // get next multiple of 5 days, or next month
        const next = Math.ceil(days / 5) * 5;
        if (next % 30 === 0)
        {
            nextMilestone = `${next / 30} ${next / 30 == 1 ? "month" : "months"}`;
        }
        // if currently on a milestone, add five days to get next milestone
        else if (days % 5 === 0)
        {
            nextMilestone = `${next + 5} days`;
        }
        else
        {
            nextMilestone = `${next} days`;
        }
    }

    // update milestone displays
    lastMilestoneEl.innerHTML = lastMilestone;
    nextMilestoneEl.innerHTML = nextMilestone;
}