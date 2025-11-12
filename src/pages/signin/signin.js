
const passwordInput = document.getElementById('password');
const characters = document.querySelectorAll('.character');
const wrappers = document.querySelectorAll('.bob-wrapper');
const characterStage = document.querySelector('.characters');
let isPeeking = false; // computed from hover and force
let isPasswordVisible = false;
let isTypingPassword = false;
let hoverPeek = false;
let forcePeek = false;
let lastCursorX = window.innerWidth / 2;
let lastCursorY = window.innerHeight / 2;

        // Track password field state
    passwordInput.addEventListener('focus', () => {
        isTypingPassword = true;
        forcePeek = true; // peek when focusing/typing
        applyState(lastCursorX, lastCursorY);
    });
    passwordInput.addEventListener('blur', () => {
        isTypingPassword = false;
        forcePeek = isPasswordVisible; // keep peek if still visible
        applyState(lastCursorX, lastCursorY);
    });

    function getPasswordCenter() {
        const rect = passwordInput.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function applyState(cursorX, cursorY) {
            // global leaning based on viewport center
        const viewportCenterX = window.innerWidth / 2;
        let leanAngle = 0;

            // base from password states
        if (isPasswordVisible) {
            leanAngle = -10; // away
        } else if (isTypingPassword) {
            leanAngle = 6; // toward
        }

        const deltaX = cursorX - viewportCenterX;
        const normalizedX = Math.max(-1, Math.min(1, deltaX / viewportCenterX));
        leanAngle += normalizedX * 8;

            // compute peek
        isPeeking = hoverPeek || forcePeek;
        if (isPeeking) leanAngle += 6;

            // clamp and apply
        leanAngle = Math.max(-14, Math.min(14, leanAngle));
        characters.forEach(char => {
            const peekScaleX = isPeeking ? 1.02 : 1;
            const peekScaleY = isPeeking ? 1.08 : 1;
            char.style.transform = `rotate(${leanAngle}deg) scale(${peekScaleX}, ${peekScaleY})`;
        });

            // pupil targeting
        const pupils = document.querySelectorAll('.pupil');
        const pwd = getPasswordCenter();
        pupils.forEach(pupil => {
            const eye = pupil.parentElement;
            const eyeRect = eye.getBoundingClientRect();
            const pupilRect = pupil.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;

            let targetX = cursorX;
            let targetY = cursorY;
            if (isPasswordVisible) {
                    // look opposite of password field center
                const dx = pwd.x - eyeCenterX;
                const dy = pwd.y - eyeCenterY;
                targetX = eyeCenterX - dx;
                targetY = eyeCenterY - dy;
            } else if (isTypingPassword) {
                    // look toward password field
                targetX = pwd.x;
                    targetY = pwd.y;
            }

            const dx2 = targetX - eyeCenterX;
            const dy2 = targetY - eyeCenterY;
            const angle = Math.atan2(dy2, dx2);
            const maxX = (eyeRect.width / 2) - (pupilRect.width / 2) - 2;
            const maxY = (eyeRect.height / 2) - (pupilRect.height / 2) - 2;
            const pupilX = Math.cos(angle) * maxX;
            const pupilY = Math.sin(angle) * maxY;
            pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
            });
        }

        // --- Eye Following & Character Leaning Logic ---
    document.addEventListener('mousemove', (e) => {
        lastCursorX = e.clientX;
        lastCursorY = e.clientY;
        applyState(lastCursorX, lastCursorY);
    });

        // --- Password Toggle Logic ---
    function togglePassword() {
        const eyeIcon = document.getElementById('eye-icon');
        const eyeSlashIcon = document.getElementById('eye-slash-icon');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeSlashIcon.classList.remove('hidden');
            isPasswordVisible = true;
            forcePeek = true;
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeSlashIcon.classList.add('hidden');
            isPasswordVisible = false;
            forcePeek = isTypingPassword; // keep peek if still typing
        }
        applyState(lastCursorX, lastCursorY);
    }

        // Hover (peek) effect handlers
        // Global hover/peek: any hover on document triggers peek for the group
    document.addEventListener('mouseenter', () => {
        hoverPeek = true;
        applyState(lastCursorX, lastCursorY);
    });
    document.addEventListener('mouseleave', () => {
        hoverPeek = false;
        applyState(lastCursorX, lastCursorY);
    });