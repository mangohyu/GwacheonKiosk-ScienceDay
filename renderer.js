const { remote, dialog } = require('electron');

// DOM 요소들
const testButton = document.getElementById('testButton');
const alertBtn = document.getElementById('alertBtn');
const fileBtn = document.getElementById('fileBtn');
const timeBtn = document.getElementById('timeBtn');
const output = document.getElementById('output');

// 시스템 정보 표시
function displaySystemInfo() {
    document.getElementById('platform').textContent = process.platform;
    document.getElementById('nodeVersion').textContent = process.version;
    document.getElementById('electronVersion').textContent = process.versions.electron;
    document.getElementById('chromeVersion').textContent = process.versions.chrome;
}

// 출력 영역에 메시지 추가
function addOutput(message) {
    const timestamp = new Date().toLocaleTimeString();
    output.textContent += `[${timestamp}] ${message}\n`;
    output.scrollTop = output.scrollHeight;
}

// 테스트 버튼 클릭 이벤트
testButton.addEventListener('click', () => {
    addOutput('테스트 버튼이 클릭되었습니다!');
    testButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        testButton.style.transform = 'scale(1)';
    }, 150);
});

// 알림 표시 버튼
alertBtn.addEventListener('click', () => {
    addOutput('알림을 표시합니다...');
    if (remote) {
        remote.dialog.showMessageBox({
            type: 'info',
            title: '과천 애플리케이션',
            message: '안녕하세요! 이것은 윈도우7 호환 일렉트론 앱입니다.',
            detail: '일렉트론 22.3.27 버전으로 개발되었습니다.',
            buttons: ['확인']
        });
    } else {
        alert('안녕하세요! 이것은 윈도우7 호환 일렉트론 앱입니다.');
    }
    addOutput('알림이 표시되었습니다.');
});

// 파일 선택 버튼
fileBtn.addEventListener('click', async () => {
    addOutput('파일 선택 대화상자를 엽니다...');
    try {
        if (remote) {
            const result = await remote.dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [
                    { name: '텍스트 파일', extensions: ['txt'] },
                    { name: '모든 파일', extensions: ['*'] }
                ]
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
                addOutput(`선택된 파일: ${result.filePaths[0]}`);
            } else {
                addOutput('파일 선택이 취소되었습니다.');
            }
        } else {
            addOutput('파일 선택 기능을 사용할 수 없습니다.');
        }
    } catch (error) {
        addOutput(`파일 선택 오류: ${error.message}`);
    }
});

// 현재 시간 버튼
timeBtn.addEventListener('click', () => {
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    addOutput(`현재 시간: ${timeString}`);
});

// 키보드 단축키
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        switch (event.key) {
            case '1':
                event.preventDefault();
                testButton.click();
                break;
            case '2':
                event.preventDefault();
                alertBtn.click();
                break;
            case '3':
                event.preventDefault();
                fileBtn.click();
                break;
            case '4':
                event.preventDefault();
                timeBtn.click();
                break;
        }
    }
});

// 윈도우 크기 변경 감지
window.addEventListener('resize', () => {
    addOutput(`윈도우 크기가 변경되었습니다: ${window.innerWidth}x${window.innerHeight}`);
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    displaySystemInfo();
    addOutput('과천 애플리케이션이 시작되었습니다.');
    addOutput('단축키: Ctrl+1(테스트), Ctrl+2(알림), Ctrl+3(파일), Ctrl+4(시간)');
    
    // 윈도우 정보 표시
    if (remote && remote.getCurrentWindow) {
        const win = remote.getCurrentWindow();
        addOutput(`윈도우 크기: ${win.getSize()[0]}x${win.getSize()[1]}`);
    }
});

// 오류 처리
window.addEventListener('error', (event) => {
    addOutput(`JavaScript 오류: ${event.error.message}`);
});

// 언로드 시 정리
window.addEventListener('beforeunload', () => {
    addOutput('애플리케이션을 종료합니다...');
}); 