const mouseState = document.getElementById('mouse-state');
let p = [0, 0];
let inflexionCount = 0;
document.body.addEventListener('pointermove', (event) => {
    const v = [event.movementX, event.movementY];
    // dot product of v and p
    const dp = v[0] * p[0] + v[1] * p[1];
    if (dp < 0) {
        inflexionCount++;
        if (inflexionCount === 3) {
            console.log('onMouseShake');
        }
        document.body.style.backgroundColor = `rgba(255, 136, 136, ${inflexionCount / 10})`;
        setTimeout(() => {
            inflexionCount--;
            document.body.style.backgroundColor = `rgba(255, 136, 136, ${inflexionCount / 10})`;
            if (inflexionCount < 3) {
                mouseState.innerHTML = 'idle';
            }
        }, 700);
    }
    p = v;
    if (inflexionCount >= 3) {
        mouseState.innerHTML = 'shaking';
    }
});