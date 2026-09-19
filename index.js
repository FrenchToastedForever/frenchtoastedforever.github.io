

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