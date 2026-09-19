// School Year Tracker Logic
class SchoolTracker {
    constructor() {
        this.semesters = {
            sem1: { start: new Date(2026, 7, 25), end: new Date(2026, 11, 25) },
            sem2: { start: new Date(2027, 0, 5), end: new Date(2027, 4, 28) },
            full: { start: new Date(2026, 7, 25), end: new Date(2027, 4, 28) }
        };

        this.holidays = [
            new Date(2026, 8, 7),
            new Date(2026, 8, 28),
            new Date(2026, 9, 30),
            new Date(2026, 10, 23),
            new Date(2026, 10, 24),
            new Date(2026, 10, 25),
            new Date(2026, 10, 26),
            new Date(2026, 10, 27),
            new Date(2026, 11, 21),
            new Date(2026, 11, 22),
            new Date(2026, 11, 23),
            new Date(2026, 11, 24),
            new Date(2026, 11, 25),
            new Date(2026, 11, 26),
            new Date(2026, 11, 27),
            new Date(2026, 11, 28),
            new Date(2026, 11, 29),
            new Date(2026, 11, 30),
            new Date(2026, 11, 31),
            new Date(2027, 0, 1),
            new Date(2027, 0, 2),
            new Date(2027, 0, 3),
            new Date(2027, 0, 4),
            new Date(2027, 0, 17),
            new Date(2027, 1, 14),
            new Date(2027, 1, 25),
            new Date(2027, 2, 28),
            new Date(2027, 2, 29),
            new Date(2027, 2, 30),
            new Date(2027, 3, 0),
            new Date(2027, 3, 1),
            new Date(2027, 3, 29)
        ];
    }

    isHoliday(date) {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        return this.holidays.some(h => {
            const hStr = `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-${String(h.getDate()).padStart(2,'0')}`;
            return dateStr === hStr;
        });
    }

    isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    countSchoolDays(startDate, endDate, includeWeekends = false) {
        let count = 0;
        let current = new Date(startDate.getTime());

        while (current <= endDate) {
            if (!this.isHoliday(current) && (includeWeekends || !this.isWeekend(current))) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    getProgress(semesterKey, includeWeekends = false) {
        const now = new Date();
        const semester = this.semesters[semesterKey];

        if (!semester) return 0;

        if (now < semester.start) return 0;
        if (now > semester.end) return 1;

        const totalDays = this.countSchoolDays(semester.start, semester.end, includeWeekends);
        const elapsedDays = this.countSchoolDays(semester.start, now, includeWeekends);

        return elapsedDays / totalDays;
    }

    formatProgress(progress, showPercentage, includeWeekends = false, semesterKey = 'full') {
        if (showPercentage) {
            return `${Math.round(progress * 100)}%`;
        } else {
            const semester = this.semesters[semesterKey];
            const totalDays = this.countSchoolDays(semester.start, semester.end, includeWeekends);
            const elapsedDays = this.countSchoolDays(semester.start, new Date(), includeWeekends);
            const daysLeft = Math.max(0, totalDays - elapsedDays);
            return `${daysLeft} days left`;
        }
    }

    getProgressDetails(semesterKey, includeWeekends = false) {
        const now = new Date();
        const semester = this.semesters[semesterKey];
        
        if (!semester) return null;
        
        const totalDays = this.countSchoolDays(semester.start, semester.end, includeWeekends);
        const elapsedDays = this.countSchoolDays(semester.start, now, includeWeekends);
        const daysLeft = Math.max(0, totalDays - elapsedDays);
        const percent = totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;
        
        return { totalDays, elapsedDays, daysLeft, percent };
    }
}

let tracker = null;
let progressDisplay = null;
let progressLabel = null;
let progressSubtext = null;
let semesterSelect = null;
let weekendSwitch = null;
let displaySelect = null;

document.addEventListener('DOMContentLoaded', () => {
    tracker = new SchoolTracker();
    progressDisplay = document.getElementById('progress-display');
    progressLabel = document.getElementById('progress-label');
    progressSubtext = document.getElementById('progress-subtext');
    semesterSelect = document.querySelector('.semester-select');
    weekendSwitch = document.getElementById('include-weekends');
    displaySelect = document.querySelector('.display-select');

    window.updateDisplay = function() {
        if (!tracker || !progressDisplay || !progressLabel || !progressSubtext) return;

        const semesterValue = semesterSelect?.value || 'full';
        const includeWeekends = weekendSwitch?.checked || false;
        const showPercentage = (displaySelect?.value || 'percentage') === 'percentage';

        const progress = tracker.getProgress(semesterValue, includeWeekends);
        const formatted = tracker.formatProgress(progress, showPercentage, includeWeekends, semesterValue);
        const details = tracker.getProgressDetails(semesterValue, includeWeekends);

        progressDisplay.textContent = formatted;
        progressDisplay.classList.add('updating');
        setTimeout(() => progressDisplay.classList.remove('updating'), 300);

        if (showPercentage) {
            progressLabel.textContent = 'School Year Progress';
            if (details) {
                progressSubtext.textContent = `${details.elapsedDays} / ${details.totalDays} days`;
            }
        } else {
            progressLabel.textContent = 'Days Remaining';
            if (details) {
                progressSubtext.textContent = `${details.percent}% complete • ${details.totalDays} total days`;
            }
        }

        gsap.fromTo(progressDisplay,
            { scale: 0.8, opacity: 0.5 },
            { duration: 0.3, scale: 1, opacity: 1, ease: "power2.out" }
        );
    };

    if (semesterSelect) {
        semesterSelect.addEventListener('change', updateDisplay);
    }
    if (weekendSwitch) {
        weekendSwitch.addEventListener('change', updateDisplay);
    }
    if (displaySelect) {
        displaySelect.addEventListener('change', updateDisplay);
    }

    updateDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelector('#tabs');
    if (tabs) {
        tabs.addEventListener('change', (event) => {
            const value = event.detail?.value || tabs.value;
            if (value === 'school-tracker') {
                setTimeout(updateDisplay, 50);
            }
        });

        tabs.querySelectorAll('mdui-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const value = tab.getAttribute('value');
                if (value === 'school-tracker') {
                    setTimeout(updateDisplay, 50);
                }
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", (event) => {
    const tl = gsap.timeline();
    const tabs = document.querySelector("mdui-tabs");
    const tocContainer = document.querySelector(".key");

    function slugify(text) {
        return text.trim().toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }

    function buildTocForPanel(value) {
        const panel = document.querySelector(`mdui-tab-panel[value="${value}"]`);
        if (!panel || !tocContainer) return;

        const headings = panel.querySelectorAll("h1, h2, h3, h4");
        tocContainer.innerHTML = `
            <div class="toc-title">Table of Contents</div>
            <ul class="toc-list"></ul>
        `;
        const list = tocContainer.querySelector(".toc-list");

        if (!headings.length) {
            list.innerHTML = `<li class="toc-empty">No headings in this section</li>`;
            return;
        }

        headings.forEach((heading, index) => {
            const text = heading.textContent.trim();
            let id = heading.id || slugify(text || `section-${index + 1}`);
            if (!id) id = `section-${index + 1}`;

            let suffix = 1;
            while (document.getElementById(id)) {
                id = `${id}-${suffix}`;
                suffix += 1;
            }

            heading.id = id;
            const level = Math.max(0, Number(heading.tagName.slice(1)) - 1);
            const item = document.createElement("li");
            item.className = `toc-item toc-level-${level}`;
            item.innerHTML = `<a href="#${id}">${text}</a>`;
            list.appendChild(item);
        });
    }

    function animatePanel(value) {
        const panel = document.querySelector(`mdui-tab-panel[value="${value}"]`);
        if (!panel) return;

        gsap.fromTo(panel,
            { autoAlpha: 0, y: 20, scale: 0.98 },
            { duration: 0.35, autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" }
        );
    }

    tabs.addEventListener("change", (event) => {
        const value = event.detail?.value || tabs.value;
        requestAnimationFrame(() => {
            buildTocForPanel(value);
            animatePanel(value);
        });
    });

    tabs.querySelectorAll("mdui-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const value = tab.getAttribute("value");
            requestAnimationFrame(() => {
                buildTocForPanel(value);
                animatePanel(value);
            });
        });
    });

    buildTocForPanel(tabs.value || "home");

    tl.from("mdui-tabs", {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: "power2.out"
    }, 0);
    tl.from(".content", {
        opacity: 0,
        x: "-100vw",
        duration: 0.8,
        ease: "elastic.out"
    }, 0.2);
    tl.from("h1", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "back.out"
    }, 0.4);
    tl.from("p", {
        opacity: 0,
        y: "100vh",
        duration: .5,
        stagger: 1,
        ease: "power2.out"
    });
});