// ===== PLANTS DATA - Populates grids on plants.html =====
document.addEventListener('DOMContentLoaded', () => {

    function buildGrid(gridId, images, names = []) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        const allSrcs = [];
        images.forEach((src, i) => {
            allSrcs.push(src);
            const item = document.createElement('div');
            item.className = 'plant-item anim-up';
            item.style.setProperty('--delay', `${(i % 8) * 0.04}s`);
            const img = document.createElement('img');
            img.src = src;
            img.alt = names[i] ? names[i] : `Plant ${i + 1}`;
            img.loading = 'lazy';
            img.onerror = function() { item.style.display = 'none'; };
            item.appendChild(img);
            
            if (names && names.length > i && names[i]) {
                const overlay = document.createElement('div');
                overlay.className = 'plant-overlay-name';

                const nameEl = document.createElement('div');
                nameEl.className = 'plant-card-title';
                nameEl.textContent = names[i];
                overlay.appendChild(nameEl);

                const tagEl = document.createElement('div');
                tagEl.className = 'plant-card-tag';
                tagEl.innerHTML = '<span class="plant-card-leaf">🌱</span> Flowering Plant';
                overlay.appendChild(tagEl);

                item.appendChild(overlay);
            }
            
            item.addEventListener('click', () => {
                if (window.openLightbox) window.openLightbox(src, allSrcs, i);
            });
            grid.appendChild(item);
        });

        // Re-observe for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const d = getComputedStyle(entry.target).getPropertyValue('--delay') || '0s';
                    setTimeout(() => entry.target.classList.add('visible'), parseFloat(d) * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });
        grid.querySelectorAll('.anim-up').forEach(el => observer.observe(el));
    }

    // ===== FLOWERING (16.png to 31.png) =====
    const flowerImg = [
        '16.png',
        '17.png',
        '18.png',
        '19.png',
        '20.png',
        '21.png',
        '22.png',
        '23.png',
        '24.png',
        '25.png',
        '26.png',
        '27.png',
        '28.png',
        '29.png',
        '30.png',
        '31.png'
    ];

    const flowerNames = [
        'Pink Plumeria (Frangipani)',
        'Red Hibiscus',
        'Yellow Hawaiian Hibiscus',
        'Peach Hibiscus',
        'Pink Bougainvillea',
        'Allamanda (Yellow Bell)',
        'Snapdragon & Dianthus',
        'Madhu Kamini (Orange Jasmine)',
        'Lantana & White Plumeria',
        'Vinca Rosea (Sadabahar)',
        'Nerium Oleander (Kaner)',
        'Garlic Vine (Mansoa)',
        'Bird of Paradise',
        'White Plumeria (Champa)',
        'Flowering Trio (Jasmine, Bougainvillea, Rose)',
        'Red-Orange Lantana'
    ];

    buildGrid('floweringGrid', flowerImg, flowerNames);

    // ===== OUTDOOR (o1 to o64) =====
    const outdoorImg = [];
    for (let i = 1; i <= 64; i++) outdoorImg.push(`o${i}.jpg`);
    buildGrid('outdoorGrid', outdoorImg);

    // ===== ORNAMENTALS =====
    const ornamentalImg = ['ornamentalplants.jpg', 'plant3.jpg'];
    for (let i = 17; i <= 23; i++) ornamentalImg.push(`fl${i}.jpg`);
    buildGrid('ornamentalsGrid', ornamentalImg);

    // ===== BOUGAINVILLEA =====
    const bogainImg = ['bogain1.jpg', 'bo2.jpg', 'bo3.jpg', 'bo4.jpg', 'bo5.jpg'];
    buildGrid('bougainvilleaGrid', bogainImg);

    // ===== FICUS (fi1 to fi37) =====
    const ficusImg = [];
    for (let i = 1; i <= 37; i++) ficusImg.push(`fi${i}.jpg`);
    buildGrid('ficusGrid', ficusImg);

    // ===== FRUIT =====
    const fruitFiles = [
        'f1','f2','f3','f4','f7','f12','f21','f23','f26','f31','f32','f35',
        'f37','f38','f45','f47','f54','f66','f67','f69','f77','f80',
        'f147','f148','f161','f162','f163','f164','f165','f166','f168','f171','f173'
    ];
    buildGrid('fruitGrid', fruitFiles.map(f => f + '.jpg'));

});
