﻿
function toggleBottomSheet(Id) {
    document.getElementById(Id).classList.toggle("show");
}

const Storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    }
};

function initCarousel(Element, Qty) {
            var $slider = $('#' + Element + '');
            if ($slider.hasClass('owl-loaded')) {
                $slider.trigger('destroy.owl.carousel');
            }
            $slider.owlCarousel({
                loop: $slider.find('.item').length > 10,
                margin: 16,
                nav: false,
                dots: true,
                responsive: {
                    0: { items: Qty },
                    600: { items: Qty },
                    1000: { items: Qty }
                }
            });
}

function lazyAnimateItems(Element) {
    var items = document.querySelectorAll('#' + Element + ' .fade-in');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        items.forEach(function (item) { observer.observe(item); });
    } else {
        // fallback
        items.forEach(function (item) { item.classList.add('visible'); });
    }
}

function showToast(message,Id) {
    const toast = document.getElementById(Id);
    if (!toast) {
        console.error(`Elemen dengan id '${Id}' tidak ditemukan.`);
        return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function formatTanggalIndo(tanggalString) {
    const bulanIndo = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dateObj = new Date(tanggalString);
    const tanggal = dateObj.getDate().toString().padStart(2, '0');
    const bulan = bulanIndo[dateObj.getMonth()];
    const tahun = dateObj.getFullYear();

    return `${tanggal} ${bulan} ${tahun}`;
}