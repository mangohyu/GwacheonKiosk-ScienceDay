# 과천 애플리케이션

윈도우7에서 실행 가능한 일렉트론 22.3.27 기반 데스크톱 애플리케이션입니다.

## 시스템 요구사항

- **운영체제**: Windows 7 SP1 이상 (32비트/64비트 모두 지원)
- **Node.js**: 16.x 이상
- **메모리**: 최소 2GB RAM
- **디스크 공간**: 100MB 이상

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 모드 실행
```bash
npm start
```

### 3. 실행 파일 빌드
```bash
# 64비트 빌드 (기본)
npm run build

# 32비트 빌드
npm run build:32

# 64비트 빌드 (명시적)
npm run build:64
```

빌드된 포터블 실행 파일은 `dist/GwacheonApp.exe`에 생성됩니다.

## 주요 기능

- **시스템 정보 표시**: 플랫폼, Node.js, 일렉트론, Chrome 버전 정보
- **기능 테스트**: 알림, 파일 선택, 시간 표시 등
- **키보드 단축키**: Ctrl+1~4로 빠른 기능 접근
- **반응형 UI**: 다양한 화면 크기에 대응

## 키보드 단축키

- `Ctrl + 1`: 테스트 버튼
- `Ctrl + 2`: 알림 표시
- `Ctrl + 3`: 파일 선택
- `Ctrl + 4`: 현재 시간 표시

## 프로젝트 구조

```
gwacheon/
├── main.js          # 메인 프로세스
├── renderer.js      # 렌더러 프로세스
├── index.html       # 메인 UI
├── styles.css       # 스타일시트
├── package.json     # 프로젝트 설정
└── README.md        # 프로젝트 문서
```

## 윈도우7 호환성

이 프로젝트는 일렉트론 22.3.27 버전을 사용하여 윈도우7에서 안정적으로 실행됩니다. 주요 호환성 설정:

- `nodeIntegration: true`
- `contextIsolation: false`
- `enableRemoteModule: true`

## 빌드 설정

`package.json`의 `build` 섹션에서 다음 설정을 확인할 수 있습니다:

- **대상 플랫폼**: Windows (Portable 실행 파일)
- **아이콘**: icon.ico 파일 사용
- **포터블 방식**: 설치 없이 바로 실행 가능한 단일 파일

## 문제 해결

### 빌드 오류가 발생하는 경우
1. Node.js 버전이 16.x 이상인지 확인
2. `npm cache clean --force` 실행
3. `node_modules` 삭제 후 `npm install` 재실행

### 실행 파일이 작동하지 않는 경우
1. Windows 7 SP1이 설치되어 있는지 확인
2. Visual C++ Redistributable 패키지 설치
3. 바이러스 백신 프로그램의 예외 설정
4. 포터블 파일이 실행 가능한 위치에 있는지 확인

## 라이선스

MIT License

## 개발자 정보

이 프로젝트는 윈도우7 환경에서 일렉트론 애플리케이션 개발을 위한 템플릿으로 제작되었습니다. 