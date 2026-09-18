// ============================================
// ЕДИНЫЙ ФАЙЛ МЕНЮ ДЛЯ ВСЕХ СТРАНИЦ
// (Версия для файлов в корневой папке, один язык — русский)
// ============================================

(function() {
    'use strict';

    // ============================================
    // ОДИН ИСТОЧНИК ПРАВДЫ ДЛЯ МОБИЛЬНОСТИ
    // СИНХРОНИЗИРОВАН С CSS (768px)
    // ============================================
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // ============================================
    // ФУНКЦИЯ ДЛЯ ОТСЛЕЖИВАНИЯ ИЗМЕНЕНИЯ ШИРИНЫ
    // ============================================
    function checkWidthAndRebuild() {
        const wasMobile = window._isMobile;
        const nowMobile = isMobile();
        
        if (wasMobile !== nowMobile) {
            window._isMobile = nowMobile;
            menuBuilt = false;
            buildMenu();
        }
    }

    // ---------- НАСТРОЙКИ ----------
    
    // ========================================
    // КОНФИГУРАЦИЯ СТРАНИЦ
    // Чтобы добавить новую страницу — добавьте одну строчку:
    //   { id: 'Lesson3', btn: 'Урок 3' },
    // id  — имя файла без .html
    // btn — текст на кнопке меню
    // ========================================
    const pagesConfig = [
        { id: 'index',   btn: 'Главная' },
        { id: 'Lesson1', btn: 'Урок 1 Название урока' },
        { id: 'Lesson2', btn: 'Урок 2' }
    ];

    // ============================================
    // ФУНКЦИЯ ПОЛУЧЕНИЯ ИМЕНИ ФАЙЛА ИЗ URL
    // ============================================
    function getFileNameFromUrl() {
        let fullPath = window.location.pathname;
        
        if (fullPath.endsWith('/')) {
            fullPath += 'index.html';
        }
        
        let fileName = fullPath.split('/').pop();
        
        if (!fileName || fileName === '') {
            fileName = 'index.html';
        }
        
        return fileName;
    }

    // ============================================
    // ОПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СТРАНИЦЫ (без расширения)
    // ============================================
    function getCurrentPage() {
        const fileName = getFileNameFromUrl();
        return fileName.replace(/\.html$/, '');
    }

    // ============================================
    // ПОЛУЧЕНИЕ ИМЕНИ ФАЙЛА ПО ID СТРАНИЦЫ
    // ============================================
    function getFileName(pageId) {
        return pageId + '.html';
    }

    // ============================================
    // ПОЛУЧЕНИЕ НАЗВАНИЯ КНОПКИ ПО ID СТРАНИЦЫ
    // ============================================
    function getPageTitle(pageId) {
        const page = pagesConfig.find(p => p.id === pageId);
        return page ? page.btn : pageId;
    }

    // ============================================
    // СОЗДАНИЕ МОБИЛЬНОЙ ПАНЕЛИ
    // ============================================
    function buildMobilePanel() {
        const currentPage = getCurrentPage();

        const mobileContainer = document.getElementById('mobileLanguageSelector');
        if (!mobileContainer) {
            console.warn('⚠️ Контейнер #mobileLanguageSelector не найден');
            return;
        }

        let html = `
            <div class="mobile-top-bar">
                <!-- ЛЕВО: пусто (для симметрии) -->
                <div class="mobile-side"></div>

                <!-- ЦЕНТР: Надпись "Меню" -->
                <div class="mobile-center-title">Меню</div>

                <!-- ПРАВО: Выбор страницы -->
                <div class="mobile-dropdown mobile-page-dropdown">
                    <button class="mobile-dropdown-btn" id="mobilePageBtn" type="button">
                        <span class="mobile-icon">📄</span>
                        <span class="mobile-current">Меню</span>
                        <span class="mobile-arrow">▼</span>
                    </button>
                    <div class="mobile-dropdown-content" id="mobilePageContent">
                        ${pagesConfig.map(page => `
                            <div class="mobile-dropdown-item ${page.id === currentPage ? 'active' : ''}" 
                                 data-page="${page.id}">
                                <span class="mobile-item-code">📄</span>
                                <span class="mobile-item-name">${page.btn}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        mobileContainer.innerHTML = html;

        // ---------- ОБРАБОТЧИКИ ----------

        const pageBtn = document.getElementById('mobilePageBtn');
        const pageContent = document.getElementById('mobilePageContent');

        // Открытие/закрытие меню СТРАНИЦ
        if (pageBtn && pageContent) {
            pageBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                pageContent.classList.toggle('show');
            });
        }

        // Клик по странице
        if (pageContent) {
            const pageItems = pageContent.querySelectorAll('.mobile-dropdown-item');
            pageItems.forEach(item => {
                item.addEventListener('click', function() {
                    const pageId = this.dataset.page;
                    window.location.href = getFileName(pageId);
                });
            });
        }

        // Закрытие при клике вне меню
        document.addEventListener('click', function() {
            if (pageContent) pageContent.classList.remove('show');
        });

        // Не закрывать при клике внутри
        if (pageContent) {
            pageContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // ---------- СОЗДАНИЕ ДЕСКТОПНОГО МЕНЮ ----------
    let menuBuilt = false;

    function buildMenu() {
        if (menuBuilt) {
            return;
        }

        const mobile = isMobile();

        if (mobile) {
            // На мобильных — строим мобильную панель
            const menuContainer = document.getElementById('menuContainer');
            if (menuContainer) {
                menuContainer.innerHTML = '';
            }
            buildMobilePanel();
            menuBuilt = true;
            return;
        }

        // ============================================
        // ДЕСКТОПНОЕ МЕНЮ
        // ============================================
        const currentPage = getCurrentPage();

        const menuContainer = document.getElementById('menuContainer');
        if (!menuContainer) {
            console.error('❌ Контейнер #menuContainer не найден!');
            return;
        }

        let menuHTML = `
            <div class="vertical-menu">
                <div class="nav-buttons" id="navButtons">
        `;

        pagesConfig.forEach((page) => {
            const isActive = page.id === currentPage ? 'active' : '';
            
            menuHTML += `
                <button class="nav-btn ${isActive}" data-page="${page.id}">
                    <span class="btn-text">${page.btn}</span>
                </button>
            `;
        });

        menuHTML += `
                </div>
            </div>
        `;

        menuContainer.innerHTML = menuHTML;

        // ---------- ОБРАБОТЧИКИ СОБЫТИЙ (ДЕСКТОП) ----------

        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pageId = this.dataset.page;
                window.location.href = getFileName(pageId);
            });
        });

        menuBuilt = true;
    }

    // ---------- ОБРАБОТЧИК ИЗМЕНЕНИЯ РАЗМЕРА ЭКРАНА ----------
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            checkWidthAndRebuild();
        }, 150);
    });

    // ---------- ЗАПУСК ----------
    window._isMobile = isMobile();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            buildMenu();
        });
    } else {
        buildMenu();
    }

})();