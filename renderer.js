// 1930년대 과학데이 키오스크 JavaScript

class KioskApp {
    constructor() {
        this.currentScreen = 'main';
        this.currentPhotoIndex = 0;
        this.currentCardIndex = 0;
        this.currentPosterIndex = 0;
        this.posterSwiper = null;
        this.cardnewsSwiper = null;
        
        // DOM 요소 캐싱
        this.cachedElements = new Map();
        this.resizeTimeout = null;
        this.activePopups = new Set();
        
        this.init();
        this.setupTouchRipple();
    }

    // DOM 요소 캐싱 메서드
    getElement(selector) {
        if (!this.cachedElements.has(selector)) {
            this.cachedElements.set(selector, document.querySelector(selector));
        }
        return this.cachedElements.get(selector);
    }

    getElements(selector) {
        if (!this.cachedElements.has(selector)) {
            this.cachedElements.set(selector, document.querySelectorAll(selector));
        }
        return this.cachedElements.get(selector);
    }

    init() {
        this.setupEventListeners();
        this.showScreen('main');
        this.initSwiper();
    }

    initSwiper() {
        // Swiper 초기화 - 성능 최적화 설정
        this.posterSwiper = new Swiper('.poster-swiper', {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            effect: 'slide',
            speed: 600,
            autoplay: false,
            // 성능 최적화 옵션 추가
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            preloadImages: false,
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 1
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    setupEventListeners() {
        // 이벤트 위임을 사용하여 성능 최적화
        const mainContainer = this.getElement('.kiosk-container');
        
        // 메뉴 아이템과 네비게이션 버튼 클릭 이벤트 위임
        mainContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.menu-item, .nav-btn');
            if (target) {
                const screenName = target.dataset.screen;
                if (screenName) {
                    this.showScreen(screenName);
                }
            }
        });

        // 포스터 상세 보기 이벤트 위임
        mainContainer.addEventListener('click', (e) => {
            const posterCard = e.target.closest('.poster-single');
            if (posterCard) {
                const posterInfo = posterCard.querySelector('.poster-info');
                const img = posterCard.querySelector('.poster-image');
                const title = posterInfo ? posterInfo.querySelector('h4').textContent : '';
                const description = posterInfo ? posterInfo.getAttribute('data-description') : '';
                const note = posterInfo ? posterInfo.getAttribute('data-note') : null;
                
                if (img && title) {
                    this.showPosterDetail(img.src, title, description, note);
                }
            }
        });

        // 사진 갤러리 클릭 이벤트 위임
        mainContainer.addEventListener('click', (e) => {
            const photoItem = e.target.closest('.photo-item');
            if (photoItem) {
                const img = photoItem.querySelector('.photo-image');
                const caption = photoItem.querySelector('.photo-caption h4');
                const photoCaption = photoItem.querySelector('.photo-caption');
                const description = photoCaption ? photoCaption.getAttribute('data-description') : '';
                
                if (img && caption) {
                    this.showPhotoDetail(img.src, caption.textContent, description);
                }
            }
        });

        // 카드뉴스 컨트롤 이벤트 위임
        mainContainer.addEventListener('click', (e) => {
            if (e.target.matches('.prev-card')) {
                this.prevCard();
            } else if (e.target.matches('.next-card')) {
                this.nextCard();
            } else if (e.target.matches('.card-indicator')) {
                const index = Array.from(this.getElements('.card-indicator')).indexOf(e.target);
                if (index !== -1) {
                    this.showCard(index);
                }
            }
        });

        // ESC 키로 팝업 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllPopups();
            }
        });

        // 디바운싱을 적용한 resize 이벤트
        window.addEventListener('resize', () => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            this.resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });
    }

    handleResize() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
        
        // Swiper 업데이트
        if (this.posterSwiper) {
            this.posterSwiper.update();
        }
    }

    showScreen(screenName) {
        // 모든 화면 숨기기 - 성능 최적화
        const screens = this.getElements('.screen');
        for (let i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active');
        }

        // 모든 네비게이션 버튼 비활성화
        const navBtns = this.getElements('.nav-btn');
        for (let i = 0; i < navBtns.length; i++) {
            navBtns[i].classList.remove('active');
        }

        // 선택된 화면 보이기
        const targetScreen = document.getElementById(screenName + 'Screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // 선택된 네비게이션 버튼 활성화
        const activeBtns = document.querySelectorAll(`[data-screen="${screenName}"]`);
        for (let i = 0; i < activeBtns.length; i++) {
            activeBtns[i].classList.add('active');
        }

        this.currentScreen = screenName;

        // 화면별 초기화
        if (screenName === 'main') {
            // 메인 화면 초기화
        } else if (screenName === 'poster') {
            // 포스터 화면으로 전환 시 Swiper를 첫 번째 슬라이드로 리셋
            if (this.posterSwiper) {
                this.posterSwiper.slideTo(0, 0);
            }
        } else if (screenName === 'photos') {
            // 사진 갤러리는 이미 표시됨
        } else if (screenName === 'cardnews') {
            this.showCard(0);
        }
    }

    // 포스터 데이터 - 정적 데이터로 최적화
    static get posters() {
        return [
            {
                title: "1회 과학데이 포스터 (1934.4.18, 조선일보)",
                description: "전기를 상징하는 번개 모양, 태엽과 같은 기계부품이 그려 전기와 기계를 통해 현대 문명과 산업화의 발전을 상징한 그림",
                image: "assets/img/poster/과학데이3_제1회포스터.JPG"
            },
            {
                title: "1935년 제2회 과학데이",
                description: "과학의 진보를 상징하는 포스터",
                image: "assets/img/poster/과학데이4_제2회과학데이포스터_1935_.png"
            },
            {
                title: "1936년 제3회 과학데이",
                description: "전국적인 과학 행사 포스터",
                image: "assets/img/poster/과학데이5_1936년 제3회 과학데이포스터.png"
            },
            {
                title: "1937년 제5회 과학데이",
                description: "과학데이의 완성을 상징하는 포스터",
                image: "assets/img/poster/과학데이6_제5회과학데이 포스터(1937, 동아일보).png"
            },
            {
                title: "자이스 모텔Ⅱ",
                description: "1926년 독일에서 출시된 자이스 모텔Ⅱ(Zeiss Model Ⅱ) 천체투영기로 최첨단 기술의 상징으로 포스터에 그림",
                image: "assets/img/poster/과학데이1_2_제1회포스터.png",
                note: "※ 아시아 최초의 천체투영관은 1937년 일본 오사카시립전기박물관에 설립됨"
            }
        ];
    }

    createPopup(content, className = 'poster-detail-popup') {
        const popup = document.createElement('div');
        popup.className = className;
        popup.innerHTML = content;
        
        // 팝업 추적
        this.activePopups.add(popup);
        
        return popup;
    }

    showPosterDetail(imageSrc, title, description, note = null) {
        const content = `
            <div class="poster-detail-content">
                <button class="close-poster-detail" aria-label="닫기">×</button>
                <img src="${imageSrc}" alt="${title}" class="poster-detail-image" loading="lazy">
                <div class="poster-detail-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    ${note ? `<p style="font-style: italic; color: #666; margin-top: 10px;">${note}</p>` : ''}
                </div>
            </div>
        `;

        const popup = this.createPopup(content);
        document.body.appendChild(popup);
        
        // 팝업 표시 애니메이션
        requestAnimationFrame(() => {
            popup.style.opacity = '1';
        });

        // 이벤트 리스너 추가
        this.setupPopupEvents(popup);
    }

    showPhotoDetail(imageSrc, title, description) {
        const content = `
            <div class="poster-detail-content">
                <button class="close-poster-detail" aria-label="닫기">×</button>
                <img src="${imageSrc}" alt="${title}" class="poster-detail-image" loading="lazy">
                <div class="poster-detail-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;

        const popup = this.createPopup(content);
        document.body.appendChild(popup);
        
        requestAnimationFrame(() => {
            popup.style.opacity = '1';
        });

        this.setupPopupEvents(popup);
    }

    setupPopupEvents(popup) {
        const closePopup = () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                    this.activePopups.delete(popup);
                }
            }, 300);
        };

        // 닫기 버튼 이벤트
        const closeBtn = popup.querySelector('.close-poster-detail');
        if (closeBtn) {
            closeBtn.addEventListener('click', closePopup, { once: true });
        }

        // 외부 클릭으로 닫기
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        }, { once: true });
    }

    closeAllPopups() {
        this.activePopups.forEach(popup => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        });
        this.activePopups.clear();
    }

    // 카드뉴스 관련 메서드들 - 성능 최적화
    showCard(index) {
        this.currentCardIndex = index;
        
        const cardItems = this.getElements('.cardnews-item');
        const indicators = this.getElements('.card-indicator');
        
        // 현재 활성 카드만 변경
        for (let i = 0; i < cardItems.length; i++) {
            cardItems[i].classList.toggle('active', i === index);
        }
        
        // 인디케이터 업데이트
        for (let i = 0; i < indicators.length; i++) {
            indicators[i].classList.toggle('active', i === index);
        }
    }

    prevCard() {
        const totalCards = this.getElements('.cardnews-item').length;
        const newIndex = this.currentCardIndex > 0 ? this.currentCardIndex - 1 : totalCards - 1;
        this.showCard(newIndex);
    }

    nextCard() {
        const totalCards = this.getElements('.cardnews-item').length;
        const newIndex = this.currentCardIndex < totalCards - 1 ? this.currentCardIndex + 1 : 0;
        this.showCard(newIndex);
    }

    setupTouchRipple() {
        // 클릭 이벤트 리스너 추가
        document.addEventListener('click', (e) => {
            this.createTouchRipple(e.clientX, e.clientY);
        }, { passive: true });

        // 터치 이벤트 리스너 추가 (모바일용)
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.createTouchRipple(touch.clientX, touch.clientY);
        }, { passive: true });
    }

    createTouchRipple(x, y) {
        // 기존 터치 리플 제거
        const existingRipples = document.querySelectorAll('.touch-ripple');
        existingRipples.forEach(ripple => ripple.remove());

        // 새로운 터치 리플 생성
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        document.body.appendChild(ripple);

        // 애니메이션 완료 후 요소 제거
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // 메모리 정리
    destroy() {
        if (this.posterSwiper) {
            this.posterSwiper.destroy(true, true);
        }
        this.closeAllPopups();
        this.cachedElements.clear();
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }
}

// 앱 초기화 - 성능 최적화
let kioskApp = null;

document.addEventListener('DOMContentLoaded', () => {
    kioskApp = new KioskApp();
});

// 터치 이벤트 지원 (모바일/키오스크) - passive 옵션으로 성능 향상
document.addEventListener('touchstart', function() {}, {passive: true});
document.addEventListener('touchmove', function() {}, {passive: true});

// 전체화면 모드 지원
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('전체화면 모드 진입 실패:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 키오스크 모드 활성화 (F11 키)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// 로딩 완료 후 초기화 - 성능 최적화
window.addEventListener('load', () => {
    // 로딩 애니메이션 제거
    document.body.classList.add('loaded');
    
    // 키오스크 준비 완료
    console.log('1930년대 과학데이 키오스크가 준비되었습니다.');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (kioskApp) {
        kioskApp.destroy();
    }
}); 