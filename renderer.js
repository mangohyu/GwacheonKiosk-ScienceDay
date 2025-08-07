// 1930년대 과학데이 키오스크 JavaScript

class KioskApp {
    constructor() {
        this.currentScreen = 'main';
        this.currentPhotoIndex = 0;
        this.currentCardIndex = 0;
        this.currentPosterIndex = 0;
        this.posterSwiper = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('main');
        this.initSwiper();
    }

    initSwiper() {
        // Swiper 초기화 - Slides Per View 데모처럼 여러 개의 슬라이드가 동시에 보이도록 설정
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
            breakpoints: {
                // 모바일에서는 1개씩
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // 태블릿에서는 2개씩
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // 데스크톱에서는 3개씩
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    setupEventListeners() {
        // 메뉴 아이템 클릭 이벤트
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const screenName = item.dataset.screen;
                this.showScreen(screenName);
            });
        });

        // 네비게이션 버튼 클릭 이벤트
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const screenName = btn.dataset.screen;
                this.showScreen(screenName);
            });
        });

        // 포스터 상세 보기 이벤트
        document.querySelectorAll('.poster-single').forEach(card => {
            card.addEventListener('click', () => {
                const posterIndex = parseInt(card.dataset.posterIndex);
                if (this.posters[posterIndex]) {
                    const posterData = this.posters[posterIndex];
                    const img = card.querySelector('.poster-image');
                    if (img) {
                        this.showPosterDetail(img.src, posterData.title, posterData.description, posterData.note);
                    }
                }
            });
        });

        // 사진 갤러리 클릭 이벤트
        document.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.photo-image');
                const caption = item.querySelector('.photo-caption h4');
                const photoCaption = item.querySelector('.photo-caption');
                const description = photoCaption ? photoCaption.getAttribute('data-description') : '';
                
                if (img && caption) {
                    this.showPhotoDetail(img.src, caption.textContent, description);
                }
            });
        });

        // 카드뉴스 컨트롤
        document.querySelector('.prev-card').addEventListener('click', () => this.prevCard());
        document.querySelector('.next-card').addEventListener('click', () => this.nextCard());
        document.querySelectorAll('.card-indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.showCard(index));
        });



        // ESC 키로 팝업 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllPopups();
            }
        });
    }

    showScreen(screenName) {
        // 모든 화면 숨기기
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // 모든 네비게이션 버튼 비활성화
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 선택된 화면 보이기
        const targetScreen = document.getElementById(screenName + 'Screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // 선택된 네비게이션 버튼 활성화
        const targetNavBtn = document.querySelector(`[data-screen="${screenName}"]`);
        if (targetNavBtn) {
            targetNavBtn.classList.add('active');
        }

        this.currentScreen = screenName;

        // 화면별 초기화
        if (screenName === 'main') {
            // 메인 화면 초기화
        } else if (screenName === 'poster') {
            // Swiper가 이미 초기화되어 있으므로 추가 작업 불필요
        } else if (screenName === 'photos') {
            // 사진 갤러리는 이미 표시됨
        } else if (screenName === 'cardnews') {
            this.showCard(0);
        }
    }

    // 포스터 데이터
    posters = [
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



    showPosterDetail(imageSrc, title, description, note = null) {
        const popup = document.createElement('div');
        popup.className = 'poster-detail-popup';
        popup.innerHTML = `
            <div class="poster-detail-content">
                <button class="close-poster-detail">×</button>
                <img src="${imageSrc}" alt="${title}" class="poster-detail-image">
                <div class="poster-detail-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    ${note ? `<p style="font-style: italic; color: #666; margin-top: 10px;">${note}</p>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // 팝업 표시 애니메이션
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        // 닫기 버튼 이벤트
        popup.querySelector('.close-poster-detail').addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        });

        // 외부 클릭으로 닫기
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(popup);
                }, 300);
            }
        });
    }

    showPhotoDetail(imageSrc, title, description) {
        const popup = document.createElement('div');
        popup.className = 'poster-detail-popup';
        popup.innerHTML = `
            <div class="poster-detail-content">
                <button class="close-poster-detail">×</button>
                <img src="${imageSrc}" alt="${title}" class="poster-detail-image">
                <div class="poster-detail-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        popup.querySelector('.close-poster-detail').addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(popup);
                }, 300);
            }
        });
    }

    closeAllPopups() {
        const popups = document.querySelectorAll('.poster-detail-popup');
        popups.forEach(popup => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        });
    }

    // 카드뉴스 관련 메서드들
    showCard(index) {
        this.currentCardIndex = index;
        
        document.querySelectorAll('.cardnews-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const cardItems = document.querySelectorAll('.cardnews-item');
        if (cardItems[index]) {
            cardItems[index].classList.add('active');
        }
        
        document.querySelectorAll('.card-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    prevCard() {
        const totalCards = document.querySelectorAll('.cardnews-item').length;
        const newIndex = this.currentCardIndex > 0 ? this.currentCardIndex - 1 : totalCards - 1;
        this.showCard(newIndex);
    }

    nextCard() {
        const totalCards = document.querySelectorAll('.cardnews-item').length;
        const newIndex = this.currentCardIndex < totalCards - 1 ? this.currentCardIndex + 1 : 0;
        this.showCard(newIndex);
    }


}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new KioskApp();
});

// 터치 이벤트 지원 (모바일/키오스크)
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

// 화면 크기 변경 시 레이아웃 조정
window.addEventListener('resize', () => {
    // 반응형 레이아웃 조정
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
});

// 로딩 완료 후 초기화
window.addEventListener('load', () => {
    // 로딩 애니메이션 제거
    document.body.classList.add('loaded');
    
    // 키오스크 준비 완료
    console.log('1930년대 과학데이 키오스크가 준비되었습니다.');
}); 